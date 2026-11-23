import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const COOLDOWN_MS = 60_000;

// Respuesta idéntica exista o no el correo: así nadie puede averiguar quién está registrado.
const genericOk = () => NextResponse.json({ ok: true });

/**
 * Recuperación de contraseña enviada por la plataforma (no por Supabase):
 *  1. Genera un código de recuperación con la API de administrador (Supabase NO envía correo).
 *  2. Envía nuestro propio correo con un enlace ?token_hash=... que funciona en cualquier
 *     navegador o dispositivo (el enlace por defecto de Supabase solo funciona en el mismo navegador).
 */
export async function POST(req: NextRequest) {
  let email = '';
  try {
    const body = await req.json();
    email = String(body?.email || '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Escribe un correo válido' }, { status: 400 });
  }

  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      console.log('[recover] Solicitud para un correo no registrado.');
      return genericOk();
    }

    // Límite: un correo por minuto por cuenta
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    const appMeta = (userData?.user?.app_metadata || {}) as Record<string, unknown>;
    const lastSent = typeof appMeta.recovery_sent_at === 'string' ? Date.parse(appMeta.recovery_sent_at) : 0;
    if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
      console.log(`[recover] Ignorado por límite de tiempo: ${email}`);
      return genericOk();
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    });
    const tokenHash = linkData?.properties?.hashed_token;
    if (linkError || !tokenHash) {
      console.error('[recover] No se pudo generar el código de recuperación:', linkError);
      return NextResponse.json({ error: 'No pudimos generar el enlace. Inténtalo en unos minutos.' }, { status: 500 });
    }

    // Siempre la dirección oficial (nunca la que venga en la petición)
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://membresia-lda.vercel.app').replace(/\/$/, '');
    const link = `${siteUrl}/restablecer?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;

    const result = await sendPasswordResetEmail({ to: email, name: profile.full_name, link });
    if (!result.success) {
      return NextResponse.json({ error: 'No pudimos enviar el correo. Inténtalo en unos minutos o escríbenos.' }, { status: 500 });
    }

    await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      app_metadata: { ...appMeta, recovery_sent_at: new Date().toISOString() },
    });

    return genericOk();
  } catch (error) {
    console.error('[recover] Error inesperado:', error);
    return NextResponse.json({ error: 'Ocurrió un error. Inténtalo en unos minutos.' }, { status: 500 });
  }
}
