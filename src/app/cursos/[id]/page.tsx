import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseWithLessons } from '@/lib/courses';
import { EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { Icon, type IconName } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TYPE_META: Record<string, { label: string; icon: IconName }> = {
  video: { label: 'Video', icon: 'play' },
  audio: { label: 'Audio guiado', icon: 'headphones' },
  pdf: { label: 'Guía PDF', icon: 'file' },
  tool: { label: 'Herramienta', icon: 'spark' },
  article: { label: 'Artículo', icon: 'book' },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getCourseWithLessons(id);
  if (!result) return { title: 'Curso no encontrado | Libre de Ansiedad' };
  return {
    title: `${result.course.title} | Libre de Ansiedad`,
    description: result.course.description || undefined,
    openGraph: result.course.cover_url ? { images: [result.course.cover_url] } : undefined,
  };
}

/**
 * Página pública del curso: cualquiera ve la portada, la descripción y la lista de
 * lecciones (miniatura y título). Al abrir una lección se pide iniciar sesión o la
 * membresía, igual que con cualquier contenido de pago.
 */
export default async function CursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCourseWithLessons(id);
  if (!result) notFound();
  const { course, lessons } = result;

  return (
    <div className="min-h-screen pt-28 pb-24 sm:pt-32">
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-10 space-y-10">
        <Link
          href="/catalogo"
          className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-5 text-base font-semibold text-ink transition-colors hover:border-ink/40"
        >
          <Icon name="arrow-right" className="h-5 w-5 rotate-180" />
          Volver al catálogo
        </Link>

        {/* Portada y descripción */}
        <header className="overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(11,31,58,0.06)]">
          {course.cover_url && (
            <img src={course.cover_url} alt="" className="aspect-[21/9] w-full object-cover" />
          )}
          <div className="space-y-4 p-6 sm:p-10">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-body">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-white">
                <Icon name="school" className="h-4 w-4" />
                Curso
              </span>
              <span>
                {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
              </span>
              {course.category && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{course.category}</span>
                </>
              )}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.01em] text-ink sm:text-5xl">{course.title}</h1>
            {course.description && (
              <p className="whitespace-pre-line text-xl leading-relaxed text-body">{course.description}</p>
            )}
            {lessons[0] && (
              <Link
                href={`/aula/contenido/${lessons[0].id}`}
                prefetch={false}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
              >
                Empezar el curso
                <Icon name="arrow-right" className="h-5 w-5" />
              </Link>
            )}
          </div>
        </header>

        {/* Lecciones en orden */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-ink">Contenido del curso</h2>
          {lessons.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-center text-lg text-body">Muy pronto estarán aquí las lecciones de este curso.</p>
          ) : (
            <ol className="space-y-3">
              {lessons.map((lesson, index) => {
                const meta = TYPE_META[(lesson.type || '').toLowerCase()] || TYPE_META.article;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/aula/contenido/${lesson.id}`}
                      prefetch={false}
                      className="group flex items-center gap-4 rounded-[1.5rem] bg-white p-3 pr-5 shadow-[0_6px_24px_rgba(11,31,58,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(11,31,58,0.1)] sm:gap-5"
                    >
                      <span className="w-8 shrink-0 text-center font-display text-2xl text-body">{index + 1}</span>
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-[#e9e6df] sm:w-40">
                        {lesson.thumbnail_url ? (
                          <img src={lesson.thumbnail_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-body">
                            <Icon name={meta.icon} className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-body">
                          <Icon name={meta.icon} className="h-4 w-4" />
                          {meta.label}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold leading-snug text-ink sm:text-xl">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="mt-1 hidden line-clamp-2 text-base text-body sm:block">{lesson.description}</p>
                        )}
                      </div>
                      <Icon name="lock" className="h-5 w-5 shrink-0 text-body" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Llamado a la membresía */}
        <section className="flex flex-col justify-between gap-4 rounded-[2rem] bg-ink p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl">Este curso es para miembros</h2>
            <p className="mt-1 text-lg text-white/80">
              Con la membresía accedes a este curso y a toda la biblioteca. Si ya eres miembro, inicia sesión.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex h-12 items-center rounded-full border-2 border-white/40 px-6 text-base font-semibold hover:bg-white/10">
              Iniciar sesión
            </Link>
            <Link href={EPAYCO_PLAN_URL} className="inline-flex h-12 items-center rounded-full bg-white px-6 text-base font-semibold text-ink hover:bg-white/90">
              Suscribirme · {MEMBERSHIP_PRICE_LABEL}/mes
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
