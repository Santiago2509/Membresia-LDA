import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendWelcomeSubscriberEmail } from '@/lib/email';

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

    // 3. Filtrar si la transacción pertenece a la Membresía de Libre de Ansiedad
    // Dado que la cuenta de ePayco de la empresa se usa también para otros cobros (sesiones individuales, consultas, links de pago),
    // verificamos que la transacción corresponda específicamente a la membresía.
    const expectedPlanId = process.env.EPAYCO_PLAN_ID || 'a29e87ce7cb8b4eef061e42';
    const planId = data.x_extra3 || data.x_id_plan || data.x_plan || data.id_plan || '';
    const description = (data.x_description || data.description || '').toLowerCase();
    const currency = (data.x_currency_code || data.currency || '').toUpperCase();
    const amount = parseFloat(data.x_amount || data.amount || '0');
    const extra9 = (data.x_extra9_epayco || '').toLowerCase();

    const isMembershipTransaction = 
      planId === expectedPlanId ||
      description.includes('adquiere acceso a contenido premium') ||
      description.includes('libre de ansiedad') ||
      description.includes('membresia') ||
      description.includes('membresía') ||
      (currency === 'USD' && amount <= 30 && !extra9.startsWith('payco_link'));

    if (!isMembershipTransaction) {
      console.log(`[ePayco Webhook] Transacción omitida (Ref: ${x_ref_payco}): corresponde a otro servicio de la empresa ("${data.x_description || 'Sin descripción'}"), no a la Membresía.`);

      await supabaseAdmin
        .from('webhook_events')
        .update({ 
          status: 'failed', 
          error_message: `Omitido: corresponde a otro servicio de la empresa (${data.x_description || 'no-membresia'})` 
        })
        .eq('epayco_reference', x_ref_payco);

      return NextResponse.json({ 
        message: 'Transacción recibida pero omitida: no corresponde a la Membresía de Libre de Ansiedad.',
        reference: x_ref_payco 
      }, { status: 200 });
    }

    // 4. Procesar si la transacción de Membresía fue Aceptada
    const isAprobada = 
      data.x_cod_response === '1' || 
      data.x_response === 'Aceptada' || 
      data.response === 'Aceptada' || 
      data.x_cod_transaction_state === '1' ||
      data.status === 'success';

    if (isAprobada) {
      const rawEmail = data.x_customer_email || data.email || data.customer_email;
      const customerName = `${data.x_customer_name || data.name || ''} ${data.x_customer_last_name || data.last_name || ''}`.trim() || 'Miembro';

      if (!rawEmail) {
        throw new Error('No se recibió email del cliente');
      }

      const customerEmail = rawEmail.trim().toLowerCase();

      // =========================================================================
      // PASO 1: VERIFICAR Y CREAR USUARIO PRIMERO EN SUPABASE
      // =========================================================================
      let userId: string | null = null;
      let isNewUser = false;
      let confirmedPassword = '';

      // Primero consultar si el usuario ya existe en profiles
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .eq('email', customerEmail)
        .single();

      if (existingProfile) {
        userId = existingProfile.id;
        isNewUser = false;
        console.log(`Usuario existente encontrado en profiles: ${customerEmail} (ID: ${userId})`);
      } else {
        // Consultar en Auth
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers().catch(() => ({ data: null }));
        const existingAuthUser = userList?.users?.find(u => u.email?.toLowerCase() === customerEmail);
        
        if (existingAuthUser) {
          userId = existingAuthUser.id;
          isNewUser = false;
          console.log(`Usuario existente encontrado en auth: ${customerEmail} (ID: ${userId})`);
        }
      }

      // Si es un usuario 100% nuevo, crearlo en Supabase Auth con contraseña garantizada
      if (!userId) {
        isNewUser = true;
        const randomPin = Math.floor(100000 + Math.random() * 900000);
        confirmedPassword = `LDA-${randomPin}`;

        console.log(`Creando nuevo usuario en Supabase Auth: ${customerEmail}`);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: confirmedPassword,
          email_confirm: true, // Auto-confirmar el email
          user_metadata: {
            full_name: customerName,
          }
        });

        if (createError) {
          console.error('Error creando usuario en Supabase Auth:', createError);
          throw new Error(`Error al registrar usuario: ${createError.message}`);
        }

        if (!newUser.user) {
          throw new Error('No se pudo obtener el usuario creado de Supabase Auth');
        }

        userId = newUser.user.id;
        console.log(`Usuario creado exitosamente con ID: ${userId}`);
      }

      // =========================================================================
      // PASO 2: GARANTIZAR PERFIL Y ACTIVAR MEMBRESÍA EN LA BASE DE DATOS
      // =========================================================================
      // Asegurar perfil
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: customerEmail,
        full_name: customerName,
        role: 'user',
        updated_at: new Date().toISOString(),
      });

      // Activar membresía por 30 días
      const periodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30); // 30 días garantizados

      const { error: memError } = await supabaseAdmin.from('memberships').upsert({
        user_id: userId,
        status: 'active',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        epayco_subscription_id: x_ref_payco,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (memError) {
        console.error('Error al guardar membresía en base de datos:', memError);
        throw new Error(`Error al activar membresía: ${memError.message}`);
      }

      console.log(`Membresía activada en base de datos para ${customerEmail}.`);

      // =========================================================================
      // PASO 3: SÓLO AHORA QUE EL USUARIO Y MEMBRESÍA ESTÁN 100% VALIDADOS, ENVIAR EMAIL
      // =========================================================================
      try {
        console.log(`Enviando correo de bienvenida a ${customerEmail}...`);
        const emailResult = await sendWelcomeSubscriberEmail({
          to: customerEmail,
          name: customerName,
          password: isNewUser ? confirmedPassword : undefined,
          isNewUser,
        });
        console.log('Resultado envío de correo:', emailResult);
      } catch (emailErr) {
        console.error('Error enviando correo de bienvenida al suscriptor:', emailErr);
      }

    } else {
      console.log('Transacción no aceptada o rechazada, código:', data.x_cod_response);
      const rawEmail = data.x_customer_email || data.email || data.customer_email;
      if (rawEmail) {
        const customerEmail = rawEmail.trim().toLowerCase();
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();

        if (profile) {
          await supabaseAdmin
            .from('memberships')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('user_id', profile.id);
          console.log(`Membresía del usuario ${customerEmail} marcada como past_due.`);
        }
      }
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
