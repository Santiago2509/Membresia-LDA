import Link from 'next/link';
import { Icon } from './ui/Icon';

export interface CourseCardItem {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  category?: string | null;
  lesson_count: number;
}

/** Tarjeta de un curso en el catálogo: portada, cantidad de lecciones y descripción. */
export default function CourseCard({ course }: { course: CourseCardItem }) {
  return (
    <Link
      href={`/cursos/${course.id}`}
      prefetch={false}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_rgba(11,31,58,0.06)] ring-2 ring-brand/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,58,0.12)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e9e6df]">
        {course.cover_url ? (
          <img
            src={course.cover_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
            <Icon name="school" className="h-14 w-14" />
          </div>
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-white shadow">
          <Icon name="school" className="h-4 w-4" />
          Curso
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-body">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span>
            {course.lesson_count} {course.lesson_count === 1 ? 'lección' : 'lecciones'}
          </span>
          {course.category && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{course.category}</span>
            </>
          )}
          <Icon name="lock" className="ml-auto h-4 w-4 shrink-0" />
        </p>
        <h3 className="mt-3 font-display text-2xl leading-snug text-ink">{course.title}</h3>
        {course.description && <p className="mt-2 line-clamp-3 text-base leading-relaxed text-body">{course.description}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-lg font-semibold text-ink">
          Ver curso
          <Icon name="arrow-right" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
