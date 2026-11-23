import nodemailer from 'nodemailer';

interface SendWelcomeSubscriberEmailParams {
  to: string;
  name: string;
  password?: string;
  isNewUser?: boolean;
}

export async function sendWelcomeSubscriberEmail({
  to,
  name,
  password,
  isNewUser = true,
}: SendWelcomeSubscriberEmailParams) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || `"Libre de Ansiedad" <${smtpUser}>`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://membresia-lda.vercel.app';
  const loginUrl = `${siteUrl}/login`;

  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ SMTP_USER o SMTP_PASS no están configurados. No se pudo enviar el correo de bienvenida.');
    return { success: false, error: 'Credenciales SMTP faltantes' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const displayName = name && name.trim() !== '' ? name : 'Estimado/a Miembro';

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Libre de Ansiedad</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 40px 15px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0e4b52 0%, #1a365d 100%); padding: 36px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                  Libre de Ansiedad
                </h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 15px;">
                  Tu camino hacia la calma, la claridad y el bienestar
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 36px 30px;">
                <p style="font-size: 18px; font-weight: 600; color: #1a202c; margin-top: 0;">
                  ¡Hola, ${displayName}! 👋
                </p>
                <p style="font-size: 15px; color: #4a5568; margin-bottom: 24px;">
                  ¡Queremos darte una cálida bienvenida a nuestra comunidad! Tu pago ha sido confirmado con éxito y tu <strong>Membresía Premium</strong> ya se encuentra activa.
                </p>

                ${
                  isNewUser && password
                    ? `
                <!-- Credenciales -->
                <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #0e4b52; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #2d3748; text-transform: uppercase; letter-spacing: 0.5px;">
                    🔑 Tus Credenciales de Acceso al Aula Virtual:
                  </p>
                  <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 15px;">
                    <tr>
                      <td width="35%" style="color: #718096; font-weight: 500;">Correo:</td>
                      <td style="color: #1a202c; font-weight: 600;">${to}</td>
                    </tr>
                    <tr>
                      <td style="color: #718096; font-weight: 500;">Contraseña temporal:</td>
                      <td style="color: #0e4b52; font-weight: 700; font-size: 17px; letter-spacing: 1px;">
                        <span style="background-color: #e6fffa; padding: 4px 8px; border-radius: 4px; border: 1px dashed #38b2ac;">
                          ${password}
                        </span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 14px 0 0 0; font-size: 12px; color: #718096;">
                    *Puedes cambiar esta contraseña cuando quieras desde <strong>Mi Perfil</strong> dentro del Aula Virtual.
                  </p>
                </div>
                `
                    : `
                <!-- Usuario existente -->
                <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #319795; border-radius: 8px; padding: 18px; margin: 24px 0;">
                  <p style="margin: 0; font-size: 14px; color: #2d3748;">
                    Como ya contabas con una cuenta en la plataforma, todo el contenido premium ya ha sido desbloqueado. Puedes ingresar con tu correo <strong>${to}</strong> y tu contraseña de siempre.
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 13px; color: #4a5568;">
                    ¿No la recuerdas? Entra a <a href="${loginUrl}" style="color: #0e4b52; font-weight: 600;">${loginUrl}</a> y usa la opción <strong>"¿Olvidaste tu contraseña?"</strong> para crear una nueva.
                  </p>
                </div>
                `
                }

                <!-- Botón CTA -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${loginUrl}" target="_blank" style="background-color: #0e4b52; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(14, 75, 82, 0.25);">
                        Ingresar a mi Aula Virtual
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #718096; margin-top: 28px;">
                  Si tienes cualquier pregunta o inconveniente para ingresar, puedes responder directamente a este correo y con gusto te asistiremos.
                </p>

                <p style="font-size: 14px; color: #4a5568; margin-bottom: 0;">
                  Con aprecio,<br>
                  <strong>Equipo Libre de Ansiedad</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #edf2f7; padding: 20px 30px; text-align: center; font-size: 12px; color: #718096;">
                Este correo fue enviado automáticamente tras la confirmación de tu membresía.<br>
                © ${new Date().getFullYear()} Libre de Ansiedad. Todos los derechos reservados.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject: isNewUser && password
        ? '🌿 ¡Bienvenido(a) a Libre de Ansiedad! Tus credenciales de acceso'
        : '🌿 Tu membresía de Libre de Ansiedad está activa',
      html: htmlContent,
    });

    console.log(`✉️ Correo de bienvenida enviado a ${to}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Error enviando correo a ${to}:`, error);
    return { success: false, error: error.message };
  }
}

// =============================================================================
// Correo de recuperación de contraseña (lo envía la plataforma, no Supabase)
// =============================================================================

interface SendPasswordResetEmailParams {
  to: string;
  name?: string | null;
  link: string;
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

export async function sendPasswordResetEmail({ to, name, link }: SendPasswordResetEmailParams) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || `"Libre de Ansiedad" <${smtpUser}>`;

  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ SMTP_USER o SMTP_PASS no están configurados. No se pudo enviar el correo de recuperación.');
    return { success: false, error: 'Credenciales SMTP faltantes' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  });

  const displayName = name && name.trim() !== '' ? escapeHtml(name.trim()) : '';
  const greeting = displayName ? `Hola, ${displayName}:` : 'Hola:';

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Restablece tu contraseña</title></head>
  <body style="margin:0;padding:0;background-color:#f7f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0b1f3a;line-height:1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0;padding:40px 15px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e7e3da;">
          <tr><td style="height:6px;background:linear-gradient(90deg,#12a04a,#8dc42a,#eeab52,#ec6f31,#e8363b,#d6006f,#b0106a,#2b93d1,#133a73);"></td></tr>
          <tr><td style="padding:36px 32px 8px 32px;">
            <p style="margin:0 0 6px 0;font-size:14px;font-weight:600;color:#12a04a;letter-spacing:1px;text-transform:uppercase;">Libre de Ansiedad</p>
            <h1 style="margin:0 0 20px 0;font-size:26px;line-height:1.25;color:#0b1f3a;">Crea una nueva contraseña</h1>
            <p style="margin:0 0 14px 0;font-size:17px;color:#3f4a5a;">${greeting}</p>
            <p style="margin:0 0 26px 0;font-size:17px;color:#3f4a5a;">Recibimos una solicitud para cambiar la contraseña de tu cuenta. Toca el botón para elegir una nueva. Puedes abrirlo desde el celular o el computador.</p>
          </td></tr>
          <tr><td align="center" style="padding:0 32px 28px 32px;">
            <a href="${link}" target="_blank" style="display:inline-block;background-color:#0b1f3a;color:#ffffff;text-decoration:none;font-size:18px;font-weight:600;padding:16px 34px;border-radius:999px;">Crear mi nueva contraseña</a>
          </td></tr>
          <tr><td style="padding:0 32px 32px 32px;">
            <p style="margin:0 0 10px 0;font-size:14px;color:#3f4a5a;">Este enlace funciona una sola vez y vence en poco tiempo. Si vence, pide uno nuevo desde la pantalla de inicio de sesión.</p>
            <p style="margin:0;font-size:14px;color:#3f4a5a;">Si no pediste este cambio, ignora este correo: tu contraseña sigue igual.</p>
          </td></tr>
          <tr><td style="background-color:#f7f5f0;padding:18px 32px;font-size:12px;color:#6b7280;text-align:center;">
            © ${new Date().getFullYear()} Libre de Ansiedad · Centro de Psicología Especializado en Ansiedad
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;

  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      subject: 'Restablece tu contraseña – Libre de Ansiedad',
      html,
      text: `${greeting}\n\nPara crear una nueva contraseña abre este enlace:\n${link}\n\nSi no pediste este cambio, ignora este correo.`,
    });
    console.log(`✉️ Correo de recuperación enviado a ${to}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error enviando correo de recuperación a ${to}:`, error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
