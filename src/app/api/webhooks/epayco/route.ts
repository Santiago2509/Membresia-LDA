import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addDays, addMonths } from 'date-fns';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendWelcomeSubscriberEmail } from '@/lib/email';
import { MEMBERSHIP_GRACE_DAYS } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Webhook ePayco - Libre de Ansiedad',
    message: 'El endpoint está activo y listo para recibir confirmaciones de pago (POST).',
    verifyMode: getVerifyMode(),
    timestamp: new Date().toISOString(),
  });
}

// =============================================================================
// Utilidades
// =============================================================================

/**
 * Modo de verificación de autenticidad del aviso de ePayco:
 *  - 'log'     → se verifica y se registra el resultado, pero se procesa igual
 *                (comportamiento anterior, para no romper nada mientras se confirma).
 *  - 'enforce' → si el aviso no se puede verificar, NO se activa ninguna membresía.
 * Se controla con la variable de entorno EPAYCO_VERIFY_MODE.
 */
function getVerifyMode(): 'log' | 'enforce' {
  return process.env.EPAYCO_VERIFY_MODE === 'enforce' ? 'enforce' : 'log';
}

/** Contraseña temporal segura: LDA- + 8 caracteres sin letras/números confusos. */
function generateTemporaryPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += alphabet[crypto.randomInt(alphabet.length)];
  }
  return `LDA-${result}`;
}

/** Busca un usuario de Supabase Auth por correo recorriendo todas las páginas. */
async function findAuthUserByEmail(email: string) {
  const perPage = 1000;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error || !data) return null;
    const found = data.users.find((u) => u.email?.toLowerCase() === email);
    if (found) return found;
    if (data.users.length < perPage) return null;
  }
  return null;
}

interface EpaycoValidation {
  verified: boolean;
  method: 'signature' | 'api' | 'none';
  /** Código de respuesta confirmado por la API de ePayco (si se consultó). */
  apiCodResponse?: string;
  detail: string;
}

/**
 * Verifica que el aviso realmente venga de ePayco:
 *  1. Por firma SHA-256 (x_signature) con P_CUST_ID y P_KEY.
 *  2. Si la firma no viene o no coincide, consultando la referencia directamente
 *     en la API pública de validación de ePayco.
 */
async function validateEpaycoEvent(
  data: Record<string, string>,
  ids: { refPayco: string; transactionId: string; amount: string; currency: string },
  credentials: { custId: string; key: string }
): Promise<EpaycoValidation> {
  const receivedSignature = (data.x_signature || data.signature || '').trim().toLowerCase();

  if (receivedSignature) {
    const signatureStr = `${credentials.custId}^${credentials.key}^${ids.refPayco}^${ids.transactionId}^${ids.amount}^${ids.currency}`;
    const expected = crypto.createHash('sha256').update(signatureStr).digest('hex');
    if (receivedSignature === expected) {
      return { verified: true, method: 'signature', detail: 'firma válida' };
    }
  }

  const signatureDetail = receivedSignature ? 'firma no coincide' : 'sin firma';

  // Respaldo: preguntar a ePayco por la referencia
  const ref = data.x_ref_payco || data.ref_payco;
  if (!ref) {
    return { verified: false, method: 'none', detail: `${signatureDetail}; sin x_ref_payco para consultar` };
  }

  try {
    const res = await fetch(
      `https://secure.epayco.co/validation/v1/reference/${encodeURIComponent(ref)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(8000) }
    );
    const json = await res.json().catch(() => null);
    const apiData = json?.data;

    if (json?.success && apiData && String(apiData.x_ref_payco ?? '') === String(ref)) {
      return {
        verified: true,
        method: 'api',
        apiCodResponse: apiData.x_cod_response != null ? String(apiData.x_cod_response) : undefined,
        detail: `${signatureDetail}; confirmado por API ePayco`,
      };
    }
    return { verified: false, method: 'none', detail: `${signatureDetail}; API ePayco no reconoce la referencia` };
  } catch (err) {
    return { verified: false, method: 'none', detail: `${signatureDetail}; error consultando API ePayco (${errorMessage(err)})` };
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

async function markEvent(reference: string, status: 'processed' | 'failed' | 'pending', errorMessage?: string | null) {
  await supabaseAdmin
    .from('webhook_events')
    .update({ status, error_message: errorMessage ?? null })
    .eq('epayco_reference', reference);
}

// =============================================================================
// Webhook
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, string> = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await req.json().catch(() => ({}));
      Object.entries(json).forEach(([key, val]) => {
        data[key] = val != null ? String(val) : '';
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
    const codResponse = data.x_cod_response || data.x_cod_transaction_state || '';

    console.log(`[ePayco] Aviso recibido. Ref: ${x_ref_payco} | Código: ${codResponse || '-'} | Respuesta: ${data.x_response || data.response || '-'}`);

    // -------------------------------------------------------------------------
    // 1. Idempotencia: se procesa una vez por cada (referencia + estado).
    //    Así un pago que llega primero "Pendiente" y luego "Aceptada" con la
    //    misma referencia SÍ se activa al llegar la aceptación.
    // -------------------------------------------------------------------------
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('id, status, payload')
      .eq('epayco_reference', x_ref_payco)
      .maybeSingle();

    if (existingEvent) {
      const previousPayload = (existingEvent.payload || {}) as Record<string, string>;
      const previousCod = previousPayload.x_cod_response || previousPayload.x_cod_transaction_state || '';
      if (existingEvent.status === 'processed' && previousCod === codResponse) {
        console.log(`[ePayco] Evento ya procesado (Ref: ${x_ref_payco}, código ${codResponse}).`);
        return NextResponse.json({ message: 'Evento ya procesado' }, { status: 200 });
      }
      await supabaseAdmin
        .from('webhook_events')
        .update({ payload: data, status: 'pending', error_message: null })
        .eq('epayco_reference', x_ref_payco);
    } else {
      await supabaseAdmin.from('webhook_events').insert({
        epayco_reference: x_ref_payco,
        event_type: 'payment',
        payload: data,
        status: 'pending',
      });
    }

    // -------------------------------------------------------------------------
    // 2. Verificar que el aviso viene realmente de ePayco
    // -------------------------------------------------------------------------
    const verifyMode = getVerifyMode();
    const validation = await validateEpaycoEvent(
      data,
      { refPayco: x_ref_payco, transactionId: x_transaction_id, amount: x_amount, currency: x_currency_code },
      { custId: p_cust_id, key: p_key }
    );
    console.log(`[ePayco] Verificación (modo ${verifyMode}): ${validation.verified ? 'VERIFICADO' : 'NO VERIFICADO'} vía ${validation.method} — ${validation.detail}`);

    if (!validation.verified && verifyMode === 'enforce') {
      await markEvent(x_ref_payco, 'failed', `Rechazado: no se pudo verificar con ePayco (${validation.detail})`);
      return NextResponse.json({ error: 'No se pudo verificar la autenticidad del aviso' }, { status: 401 });
    }

    // -------------------------------------------------------------------------
    // 3. Filtrar si la transacción pertenece a la Membresía de Libre de Ansiedad
    // La cuenta de ePayco se usa también para otros cobros (sesiones, consultas,
    // links de pago), así que solo se procesan los de la membresía.
    // -------------------------------------------------------------------------
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
      console.log(`[ePayco] Transacción omitida (Ref: ${x_ref_payco}): corresponde a otro servicio ("${data.x_description || 'Sin descripción'}").`);
      await markEvent(x_ref_payco, 'failed', `Omitido: corresponde a otro servicio de la empresa (${data.x_description || 'no-membresia'})`);
      return NextResponse.json({
        message: 'Transacción recibida pero omitida: no corresponde a la Membresía de Libre de Ansiedad.',
        reference: x_ref_payco,
      }, { status: 200 });
    }

    // -------------------------------------------------------------------------
    // 4. Determinar el estado del pago. Si la API de ePayco confirmó el estado,
    //    se usa ese (no se puede falsificar enviando "Aceptada").
    // -------------------------------------------------------------------------
    const effectiveCod = validation.apiCodResponse ?? codResponse;
    const responseText = (data.x_response || data.response || '').toLowerCase();

    const isAprobada = validation.apiCodResponse
      ? validation.apiCodResponse === '1'
      : data.x_cod_response === '1' ||
        data.x_response === 'Aceptada' ||
        data.response === 'Aceptada' ||
        data.x_cod_transaction_state === '1' ||
        data.status === 'success';

    const isPendiente = !isAprobada && (effectiveCod === '3' || responseText === 'pendiente');

    const rawEmail = data.x_customer_email || data.email || data.customer_email;
    const customerEmail = rawEmail ? rawEmail.trim().toLowerCase() : '';

    if (isPendiente) {
      // Un pago pendiente no da ni quita acceso: se espera el aviso final.
      console.log(`[ePayco] Pago pendiente (Ref: ${x_ref_payco}). Se espera la confirmación final.`);
      await markEvent(x_ref_payco, 'processed', 'Pendiente: a la espera de confirmación final de ePayco');
      return NextResponse.json({ message: 'Pago pendiente registrado' }, { status: 200 });
    }

    if (!isAprobada) {
      // Rechazado / fallido / reversado.
      // NO se corta el acceso si el usuario aún tiene días pagados: un reintento
      // de cobro fallido no debe quitarle lo que ya pagó. El acceso termina solo
      // cuando vence current_period_end.
      console.log(`[ePayco] Transacción no aceptada (Ref: ${x_ref_payco}), código: ${effectiveCod || '-'}`);
      if (customerEmail) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .maybeSingle();

        if (profile) {
          const { data: membership } = await supabaseAdmin
            .from('memberships')
            .select('status, current_period_end')
            .eq('user_id', profile.id)
            .maybeSingle();

          const stillPaid =
            membership?.current_period_end && new Date(membership.current_period_end) > new Date();

          if (membership && !stillPaid && membership.status === 'active') {
            await supabaseAdmin
              .from('memberships')
              .update({ status: 'past_due', updated_at: new Date().toISOString() })
              .eq('user_id', profile.id);
            console.log(`[ePayco] Membresía de ${customerEmail} marcada como past_due (periodo vencido).`);
          } else if (stillPaid) {
            console.log(`[ePayco] ${customerEmail} conserva acceso hasta ${membership?.current_period_end}.`);
          }
        }
      }
      await markEvent(x_ref_payco, 'processed', `No aceptada (código ${effectiveCod || '-'})`);
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    // =========================================================================
    // PAGO APROBADO
    // =========================================================================
    if (!customerEmail) {
      throw new Error('No se recibió email del cliente');
    }

    const customerName =
      `${data.x_customer_name || data.name || ''} ${data.x_customer_last_name || data.last_name || ''}`.trim() || 'Miembro';

    // PASO 1: encontrar o crear el usuario
    let userId: string | null = null;
    let isNewUser = false;
    let confirmedPassword = '';

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', customerEmail)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
      console.log(`[ePayco] Usuario existente en profiles: ${customerEmail} (ID: ${userId})`);
    } else {
      const existingAuthUser = await findAuthUserByEmail(customerEmail);
      if (existingAuthUser) {
        userId = existingAuthUser.id;
        console.log(`[ePayco] Usuario existente en auth: ${customerEmail} (ID: ${userId})`);
      }
    }

    if (!userId) {
      confirmedPassword = generateTemporaryPassword();

      console.log(`[ePayco] Creando nuevo usuario: ${customerEmail}`);
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password: confirmedPassword,
        email_confirm: true,
        user_metadata: { full_name: customerName },
      });

      if (createError || !newUser?.user) {
        // Si otro aviso simultáneo ya lo creó, recuperarlo en vez de fallar
        const raced = await findAuthUserByEmail(customerEmail);
        if (!raced) {
          console.error('[ePayco] Error creando usuario en Supabase Auth:', createError);
          throw new Error(`Error al registrar usuario: ${createError?.message || 'sin usuario'}`);
        }
        userId = raced.id;
        confirmedPassword = '';
      } else {
        userId = newUser.user.id;
        isNewUser = true;
        console.log(`[ePayco] Usuario creado con ID: ${userId}`);
      }
    }

    // PASO 2: garantizar perfil (sin tocar el rol de un perfil existente)
    const profileUpdate: Record<string, string> = {
      id: userId!,
      email: customerEmail,
      updated_at: new Date().toISOString(),
    };
    if (customerName !== 'Miembro' || !existingProfile?.full_name) {
      profileUpdate.full_name = customerName;
    }
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert(profileUpdate);
    if (profileError) {
      console.error('[ePayco] Error guardando perfil:', profileError);
      throw new Error(`Error al guardar perfil: ${profileError.message}`);
    }

    // PASO 3: activar / renovar membresía
    // Un mes calendario + días de gracia. Nunca se acorta un periodo ya pagado.
    const { data: previousMembership } = await supabaseAdmin
      .from('memberships')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .maybeSingle();

    const now = new Date();
    const wasActive =
      previousMembership?.status === 'active' &&
      !!previousMembership.current_period_end &&
      new Date(previousMembership.current_period_end) > now;

    let periodEnd = addDays(addMonths(now, 1), MEMBERSHIP_GRACE_DAYS);
    if (previousMembership?.current_period_end) {
      const previousEnd = new Date(previousMembership.current_period_end);
      if (previousEnd > periodEnd) periodEnd = previousEnd;
    }

    const { error: memError } = await supabaseAdmin.from('memberships').upsert({
      user_id: userId,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      epayco_subscription_id: x_ref_payco,
      updated_at: now.toISOString(),
    }, { onConflict: 'user_id' });

    if (memError) {
      console.error('[ePayco] Error al guardar membresía:', memError);
      throw new Error(`Error al activar membresía: ${memError.message}`);
    }

    console.log(`[ePayco] Membresía activa para ${customerEmail} hasta ${periodEnd.toISOString()}.`);

    // PASO 4: correo. Usuario nuevo → credenciales. Usuario que vuelve → aviso de
    // reactivación. Renovación mensual de alguien ya activo → no se envía nada
    // (antes recibía un "Bienvenido" cada mes).
    let emailNote: string | null = null;
    if (isNewUser || !wasActive) {
      try {
        const emailResult = await sendWelcomeSubscriberEmail({
          to: customerEmail,
          name: customerName,
          password: isNewUser ? confirmedPassword : undefined,
          isNewUser,
        });
        console.log('[ePayco] Resultado envío de correo:', emailResult);
        if (!emailResult?.success) {
          emailNote = `Membresía activada, pero el correo falló: ${emailResult?.error || 'desconocido'}. El usuario puede usar "¿Olvidaste tu contraseña?".`;
        }
      } catch (emailErr) {
        console.error('[ePayco] Error enviando correo de bienvenida:', emailErr);
        emailNote = `Membresía activada, pero el correo falló: ${errorMessage(emailErr)}.`;
      }
    } else {
      console.log(`[ePayco] Renovación de ${customerEmail}: no se envía correo.`);
    }

    const verificationNote = validation.verified ? null : `Aviso no verificado (${validation.detail})`;
    await markEvent(x_ref_payco, 'processed', [emailNote, verificationNote].filter(Boolean).join(' | ') || null);

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('[ePayco] Error en webhook:', error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
