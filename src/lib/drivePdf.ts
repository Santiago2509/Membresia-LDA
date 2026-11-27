import { NextResponse } from 'next/server';

/**
 * Descarga un PDF compartido en Google Drive y lo devuelve como respuesta para el
 * navegador. Si Drive no entrega un PDF (sin permiso, verificación, otro tipo de
 * archivo), responde con un error que el visor usa para mostrar el respaldo de Drive.
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

  // Google suele entregar el archivo como "application/octet-stream" (descarga genérica),
  // así que se revisa el contenido real: todo PDF empieza con "%PDF-". Si Drive devolvió
  // una página HTML (sin permiso, aviso de virus, verificación), no empieza así.
  const contentType = driveRes.headers.get('content-type') || '';
  const bytes = driveRes.ok ? new Uint8Array(await driveRes.arrayBuffer()) : new Uint8Array();
  const isPdf = bytes.length > 4 && new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';

  if (!isPdf) {
    const detail = `Drive respondió ${driveRes.status} (${contentType || 'sin tipo'})`;
    console.error('Drive no entregó un PDF', { driveId, detail });
    return NextResponse.json(
      {
        error: contentType.includes('html')
          ? 'Google Drive no entregó el archivo (pidió permiso o una verificación)'
          : 'El archivo de Drive no es un PDF',
        detail,
      },
      { status: 422 }
    );
  }

  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Content-Length': String(bytes.length),
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
