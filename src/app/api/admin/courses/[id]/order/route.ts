import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';

export const dynamic = 'force-dynamic';

/** Guarda el orden de las lecciones de un curso: { lessonIds: [id1, id2, ...] }. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { lessonIds } = await req.json();
  if (!Array.isArray(lessonIds) || lessonIds.some((l) => typeof l !== 'string')) {
    return NextResponse.json({ error: 'Orden inválido' }, { status: 400 });
  }

  const results = await Promise.all(
    lessonIds.map((lessonId: string, index: number) =>
      supabaseAdmin.from('content').update({ position: index + 1 }).eq('id', lessonId).eq('course_id', id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
