import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';
import { getCoursesWithCounts } from '@/lib/courses';

export const dynamic = 'force-dynamic';

/** Lista de cursos (para el selector de curso en el formulario de lecciones). */
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  return NextResponse.json({ courses: await getCoursesWithCounts() });
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { title, description, cover_url, category } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: 'El nombre del curso es obligatorio' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('courses')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      cover_url: cover_url || null,
      category: category?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, course: data });
}
