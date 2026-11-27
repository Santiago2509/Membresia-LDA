import Link from 'next/link';
import { getCoursesWithCounts } from '@/lib/courses';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isMissingCoursesSchema } from '@/lib/courses';

export const revalidate = 0;

export default async function AdminCursosPage() {
  // Si aún no se ejecutó supabase_cursos.sql, se avisa en vez de fallar
  const { error: schemaError } = await supabaseAdmin.from('courses').select('id').limit(1);
  const missingSchema = isMissingCoursesSchema(schemaError);
  const courses = missingSchema ? [] : await getCoursesWithCounts();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Cursos</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Agrupa videos, guías PDF y audios en un curso, en el orden en que se deben ver.
          </p>
        </div>
        {!missingSchema && (
          <Link
            href="/admin/cursos/nuevo"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo curso
          </Link>
        )}
      </div>

      {missingSchema ? (
        <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 text-sm space-y-1">
          <p className="font-bold">Falta preparar la base de datos para los cursos.</p>
          <p>
            Ejecuta el archivo <code className="font-mono">supabase_cursos.sql</code> en Supabase → SQL Editor y recarga
            esta página.
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-10 text-center bg-surface-container-lowest/90 rounded-3xl border border-outline-variant/30 text-on-surface-variant">
          Todavía no hay cursos. Crea el primero con el botón &quot;Nuevo curso&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/cursos/${course.id}`}
              className="group overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest/90 shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                {course.cover_url ? (
                  <img src={course.cover_url} alt="" className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform" />
                ) : (
                  <div className="flex h-full items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px]">school</span>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-1">
                <p className="font-label-xs text-on-surface-variant">
                  {course.lesson_count} {course.lesson_count === 1 ? 'lección' : 'lecciones'}
                  {course.category ? ` · ${course.category}` : ''}
                </p>
                <p className="font-label-lg text-on-surface font-bold">{course.title}</p>
                <p className="font-label-sm text-secondary font-bold pt-2">Administrar curso →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
