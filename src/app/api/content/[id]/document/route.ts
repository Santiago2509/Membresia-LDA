import { NextRequest, NextResponse } from 'next/server';
import { resolveContentAccess } from '@/lib/contentAccess';
import { extractDriveId } from '@/lib/videoUtils';
import { drivePdfResponse } from '@/lib/drivePdf';

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

  return drivePdfResponse(driveId);
}
