import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CatalogoClient from '@/components/CatalogoClient';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CONTENT_CARD_COLUMNS } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';
import { getCoursesWithCounts, selectStandalone } from '@/lib/courses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  // Solo las columnas de la tarjeta: el contenido completo (url, texto, recursos)
  // nunca se envía al navegador desde el catálogo.
  // Las lecciones que pertenecen a un curso se ven dentro de su curso, no sueltas.
  const [rows, courses] = await Promise.all([
    selectStandalone((onlyStandalone) => {
      const query = supabase.from('content').select(CONTENT_CARD_COLUMNS);
      return (onlyStandalone ? query.is('course_id', null) : query).order('created_at', { ascending: false });
    }),
    getCoursesWithCounts(),
  ]);

  const contents = rows.map(toContentCard);

  return (
    <div className="min-h-screen pt-28 pb-24 sm:pt-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="Biblioteca"
            title="Catálogo de contenido"
            text="Videos, audios guiados, guías y artículos para entender tu ansiedad y aprender a manejarla, paso a paso."
          />
        </div>

        <CatalogoClient initialContents={contents} initialCourses={courses} initialType={tipo} />
      </div>
    </div>
  );
}
