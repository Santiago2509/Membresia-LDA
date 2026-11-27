import { NextResponse } from 'next/server';

/**
 * Descarga un PDF compartido en Google Drive y lo devuelve como respuesta para el
 * navegador. Si el archivo no es un PDF o no está compartido "con el enlace",
 * responde con un error que el visor usa para mostrar el respaldo de Drive.
 */
export async function drivePdfResponse(driveId: string): Promise<Response> {
  let driveRes: Response;
  try {
    driveRes = await fetch(
      `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`,
      { cache: 'no-store', redirect: 'follow' }
    );
  } catch (error) {
    console.error('No se pudo descargar el documento de Drive:', error);
    return NextResponse.json({ error: 'No se pudo conectar con Google Drive' }, { status: 502 });
  }

  // Si el archivo no está compartido "con el enlace", Drive responde una página HTML de permisos
  const contentType = driveRes.headers.get('content-type') || '';
  if (!driveRes.ok || !driveRes.body || !contentType.includes('pdf')) {
    console.error('Drive no entregó un PDF', { driveId, status: driveRes.status, contentType });
    return NextResponse.json(
      { error: 'El archivo de Drive no es un PDF o no está compartido con "Cualquier persona con el enlace"' },
      { status: 422 }
    );
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
    'Cache-Control': 'private, max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  const length = driveRes.headers.get('content-length');
  if (length) headers.set('Content-Length', length);

  return new Response(driveRes.body, { status: 200, headers });
}
