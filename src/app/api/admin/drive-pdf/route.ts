import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { extractDriveId } from '@/lib/videoUtils';
import { drivePdfResponse } from '@/lib/drivePdf';

export const dynamic = 'force-dynamic';

/** Vista previa del PDF en el panel de admin, antes de guardar la lección. Solo administradores. */
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const driveId = extractDriveId(request.nextUrl.searchParams.get('url'));
  if (!driveId) {
    return NextResponse.json({ error: 'Enlace de Google Drive no válido' }, { status: 400 });
  }

  return drivePdfResponse(driveId);
}
