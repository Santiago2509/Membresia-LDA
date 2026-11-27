import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseWithLessons } from '@/lib/courses';
import CourseForm from '../CourseForm';
import CourseLessons from './CourseLessons';
import DeleteCourseButton from './DeleteCourseButton';

export const revalidate = 0;

export default async function AdminCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCourseWithLessons(id);
  if (!result) notFound();
  const { course, lessons } = result;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/cursos" aria-label="Volver" className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/10 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{course.title}</h1>
            <p className="text-sm text-neutral-600 mt-0.5">
              {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'} ·{' '}
              <Link href={`/cursos/${course.id}`} target="_blank" className="font-semibold text-[#133a73] underline">
                Ver como miembro
              </Link>
            </p>
          </div>
        </div>
        <DeleteCourseButton courseId={course.id} lessonCount={lessons.length} />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-neutral-900">Lecciones (en orden)</h2>
          <Link
            href={`/admin/contenido/nuevo?curso=${course.id}`}
            className="px-5 py-2.5 bg-[#133a73] text-white rounded-full font-bold text-sm flex items-center gap-1.5 hover:bg-[#001531]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Agregar lección
          </Link>
        </div>
        <CourseLessons courseId={course.id} initialLessons={lessons} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-neutral-900">Datos del curso</h2>
        <CourseForm
          courseId={course.id}
          initial={{
            title: course.title,
            description: course.description || '',
            category: course.category || '',
            cover_url: course.cover_url || '',
          }}
        />
      </section>
    </div>
  );
}
