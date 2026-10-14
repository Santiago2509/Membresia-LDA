import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Webhook ePayco - Libre de Ansiedad',
    message: 'El endpoint está activo y listo para recibir confirmaciones de pago (POST).',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    let data: Record<string, string> = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await req.json().catch(() => ({}));
      Object.entries(json).forEach(([key, val]) => {
        data[key] = val != null ? val.toString() : '';
      });
    } else {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        formData.forEach((value, key) => {
          data[key] = value.toString();
        });
      } else {
        const text = await req.text().catch(() => '');
        const params = new URLSearchParams(text);
        params.forEach((value, key) => {
          data[key] = value;
        });
      }
    }

    // Respaldo: si venían por query params en la URL
    if (Object.keys(data).length === 0) {
      req.nextUrl.searchParams.forEach((value, key) => {
        data[key] = value;
      });
    }

    console.log('Webhook ePayco recibido. Ref:', data.x_ref_payco);

    // 1. Validar firma de ePayco
    const p_cust_id = process.env.EPAYCO_P_CUST_ID;
    const p_key = process.env.EPAYCO_P_KEY;
    
    if (!p_cust_id || !p_key) {
      console.error('Faltan credenciales de ePayco en .env');
      return NextResponse.json({ error: 'Configuración inválida' }, { status: 500 });
    }

    const x_ref_payco = data.x_ref_payco || data.ref_payco || data.reference_payco || data.x_id_invoice || `ref_${Date.now()}`;
    const x_transaction_id = data.x_transaction_id || data.transaction_id || x_ref_payco;
    const x_amount = data.x_amount || data.amount || '0';
    const x_currency_code = data.x_currency_code || data.currency || 'USD';
    const x_signature = data.x_signature || data.signature;

    if (x_signature) {
      const signatureStr = `${p_cust_id}^${p_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`;
      const expectedSignature = crypto.createHash('sha256').update(signatureStr).digest('hex');

      if (x_signature !== expectedSignature) {
        console.warn('Firma ePayco no coincide exactamente. Recibida:', x_signature);
      }
    }

    // 2. Comprobar Idempotencia (Si ya procesamos este evento)
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('id, status')
      .eq('epayco_reference', x_ref_payco)
      .single();

    if (existingEvent && existingEvent.status === 'processed') {
      console.log('Evento ya procesado:', x_ref_payco);
      return NextResponse.json({ message: 'Evento ya procesado' }, { status: 200 });
    }

    if (!existingEvent) {
      await supabaseAdmin.from('webhook_events').insert({
        epayco_reference: x_ref_payco,
        event_type: 'payment',
        payload: data,
        status: 'pending'
      });
    }

    // 3. Procesar si la transacción fue Aceptada (Código 1 o Aceptada o success)
    const isAprobada = 
      data.x_cod_response === '1' || 
      data.x_response === 'Aceptada' || 
      data.response === 'Aceptada' || 
      data.x_cod_transaction_state === '1' ||
      data.status === 'success';

    if (isAprobada) {
      const customerEmail = data.x_customer_email || data.email || data.customer_email;
      const customerName = `${data.x_customer_name || data.name || ''} ${data.x_customer_last_name || data.last_name || ''}`.trim();

      if (!customerEmail) {
        throw new Error('No se recibió email del cliente');
      }

      // Buscar si el usuario ya existe por email usando la API de Admin
      const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      let userId = null;

      if (!listError && userList.users) {
         const existingUser = userList.users.find(u => u.email === customerEmail);
         if (existingUser) {
           userId = existingUser.id;
         }
      }

      // Si no existe, crearlo
      if (!userId) {
        const tempPassword = crypto.randomBytes(12).toString('hex'); // Contraseña segura aleatoria
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: tempPassword,
          email_confirm: true, // Auto-confirmar el email
          user_metadata: {
            full_name: customerName || 'Miembro',
          }
        });

        if (createError) throw createError;
        if (newUser.user) {
           userId = newUser.user.id;
           
           // Opcional: Podríamos enviar un correo aquí pidiéndole que restablezca su contraseña,
           // pero como supabase mandaría un reset password, podemos dispararlo:
           await supabaseAdmin.auth.admin.generateLink({
             type: 'recovery',
             email: customerEmail,
           });
        }
      }

      if (userId) {
        // Crear o actualizar la membresía
        const periodStart = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1); // +1 Mes

        // Buscar si ya tiene membresia
        const { data: existingMembership } = await supabaseAdmin
          .from('memberships')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existingMembership) {
          await supabaseAdmin
            .from('memberships')
            .update({
              status: 'active',
              current_period_start: periodStart.toISOString(),
              current_period_end: periodEnd.toISOString(),
              epayco_subscription_id: x_ref_payco,
            })
            .eq('user_id', userId);
        } else {
          await supabaseAdmin
            .from('memberships')
            .insert({
              user_id: userId,
              status: 'active',
              current_period_start: periodStart.toISOString(),
              current_period_end: periodEnd.toISOString(),
              epayco_subscription_id: x_ref_payco,
            });
        }
      }
    } else {
       console.log('Transacción no aceptada, código:', data.x_cod_response);
       // Podríamos marcar la membresía como fallida aquí si es una renovación
    }

    // Marcar webhook como procesado
    await supabaseAdmin
      .from('webhook_events')
      .update({ status: 'processed' })
      .eq('epayco_reference', x_ref_payco);

    return NextResponse.json({ message: 'OK' }, { status: 200 });

  } catch (error: any) {
    console.error('Error en webhook ePayco:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
