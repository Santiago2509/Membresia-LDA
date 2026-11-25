import { NextRequest, NextResponse } from 'next/server';
import { resolveContentAccess } from '@/lib/contentAccess';
import { extractDriveId } from '@/lib/videoUtils';

export const dynamic = 'force-dynamic';

/**
 * Entrega el PDF de una lección (guardado en Google Drive) para que el aula lo dibuje
 * página por página. Solo responde a quien tiene acceso a la lección, y el navegador
 * nunca necesita el enlace de Drive.
 */
export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const access = await resolveContentAccess(request, id);
  if (access.status === 'not_found') {
    return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
  }
  if (access.status === 'login_required') {
    return NextResponse.json({ error: 'Inicia sesión para ver este documento' }, { status: 401 });
  }
  if (access.status === 'forbidden') {
    return NextResponse.json({ error: 'Necesitas una membresía activa' }, { status: 403 });
  }

  const driveId = extractDriveId(access.content.url);
  if (!driveId) {
    return NextResponse.json({ error: 'Esta lección no tiene un documento de Google Drive' }, { status: 404 });
  }

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
