import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { nextLessonPosition } from '@/lib/courses';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { data: item, error } = await supabaseAdmin
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const {
    title,
    description,
    type,
    category,
    is_premium,
    url,
    thumbnail_url,
    body: contentBody,
    body_after,
    resource_url,
    resource_title,
    course_id,
  } = body;

  if (!title || !category || !type) {
    return NextResponse.json(
      { error: 'Título, tipo y categoría son obligatorios' },
      { status: 400 }
    );
  }

  const finalThumbnail = thumbnail_url || getVideoThumbnail(url) || null;

  // Curso de la lección. Si cambia de curso, va al final del nuevo; si sale del curso,
  // queda suelta. Si la tabla de cursos aún no existe, no se toca nada de esto.
  const { data: previous, error: previousError } = await supabaseAdmin
    .from('content')
    .select('course_id')
    .eq('id', id)
    .maybeSingle();
  const previousCourse = previousError ? undefined : (previous as { course_id?: string | null } | null)?.course_id ?? null;
  const newCourse: string | null = course_id || null;
  let courseFields: Record<string, unknown> = {};
  if (previousCourse !== undefined && newCourse !== previousCourse) {
    courseFields = newCourse
      ? { course_id: newCourse, position: await nextLessonPosition(newCourse) }
      : { course_id: null, position: 0 };
  }

  const { data, error } = await supabaseAdmin
    .from('content')
    .update({
      ...courseFields,
      title,
      description,
      type,
      category,
      is_premium: newCourse ? true : Boolean(is_premium),
      url: url || null,
      thumbnail_url: finalThumbnail,
      body: contentBody || null,
      body_after: body_after || null,
      resource_url: resource_url || null,
      resource_title: resource_title || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
