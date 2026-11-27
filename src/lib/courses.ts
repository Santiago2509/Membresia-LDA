import type { PostgrestError } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CONTENT_CARD_COLUMNS } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  category: string | null;
  created_at: string;
}

export interface CourseWithCount extends Course {
  lesson_count: number;
}

export const COURSE_COLUMNS = 'id, title, description, cover_url, category, created_at';

/**
 * true si el error es porque aún no se ejecutó supabase_cursos.sql (falta la tabla
 * `courses` o las columnas `course_id` / `position`). Así la página sigue funcionando
 * como antes mientras tanto, en vez de romperse.
 */
export function isMissingCoursesSchema(error: PostgrestError | null): boolean {
  if (!error) return false;
  return (
    error.code === '42P01' ||
    error.code === '42703' ||
    error.code === 'PGRST205' ||
    error.code === 'PGRST204' ||
    /courses|course_id|position/i.test(error.message || '')
  );
}

/**
 * Ejecuta una consulta de contenido mostrando solo el contenido suelto (sin curso).
 * Si la columna course_id aún no existe, repite la consulta sin ese filtro.
 */
export async function selectStandalone<T>(
  build: (onlyStandalone: boolean) => PromiseLike<{ data: T[] | null; error: PostgrestError | null }>
): Promise<T[]> {
  const result = await build(true);
  if (result.error && isMissingCoursesSchema(result.error)) {
    return (await build(false)).data || [];
  }
  return result.data || [];
}

/** Todos los cursos con su cantidad de lecciones, del más nuevo al más viejo. */
export async function getCoursesWithCounts(): Promise<CourseWithCount[]> {
  const { data: courses, error } = await supabaseAdmin
    .from('courses')
    .select(COURSE_COLUMNS)
    .order('created_at', { ascending: false });
  if (error || !courses) return [];

  const { data: lessons } = await supabaseAdmin.from('content').select('course_id').not('course_id', 'is', null);
  const counts = new Map<string, number>();
  for (const row of lessons || []) {
    const id = (row as { course_id: string }).course_id;
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return (courses as Course[]).map((c) => ({ ...c, lesson_count: counts.get(c.id) || 0 }));
}

/** Un curso con sus lecciones en orden (solo datos de tarjeta, nunca la url del contenido). */
export async function getCourseWithLessons(courseId: string) {
  const { data: course, error } = await supabaseAdmin
    .from('courses')
    .select(COURSE_COLUMNS)
    .eq('id', courseId)
    .maybeSingle();
  if (error || !course) return null;

  const { data: rows } = await supabaseAdmin
    .from('content')
    .select(`${CONTENT_CARD_COLUMNS}, position`)
    .eq('course_id', courseId)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  return { course: course as Course, lessons: (rows || []).map(toContentCard) };
}

/** Posición para una lección nueva en un curso: al final (orden de subida). */
export async function nextLessonPosition(courseId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('content')
    .select('position')
    .eq('course_id', courseId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data as { position?: number } | null)?.position ?? 0) + 1;
}

/** Lección anterior y siguiente dentro del curso, para navegar desde una lección. */
export async function getLessonNavigation(courseId: string, lessonId: string) {
  const [{ data: course }, { data: rows }] = await Promise.all([
    supabaseAdmin.from('courses').select('id, title').eq('id', courseId).maybeSingle(),
    supabaseAdmin
      .from('content')
      .select('id, title')
      .eq('course_id', courseId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);
  if (!course || !rows) return null;

  const index = rows.findIndex((r) => r.id === lessonId);
  if (index === -1) return null;
  return {
    course: course as { id: string; title: string },
    index: index + 1,
    total: rows.length,
    previous: index > 0 ? (rows[index - 1] as { id: string; title: string }) : null,
    next: index < rows.length - 1 ? (rows[index + 1] as { id: string; title: string }) : null,
  };
}

export type LessonNavigation = NonNullable<Awaited<ReturnType<typeof getLessonNavigation>>>;
