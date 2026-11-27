import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';
import { getCourseWithLessons } from '@/lib/courses';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const result = await getCourseWithLessons(id);
  if (!result) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { title, description, cover_url, category } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: 'El nombre del curso es obligatorio' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('courses')
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      cover_url: cover_url || null,
      category: category?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, course: data });
}

/** Borra el curso. Sus lecciones NO se borran: quedan como contenido suelto. */
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  await supabaseAdmin.from('content').update({ course_id: null, position: 0 }).eq('course_id', id);
  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
