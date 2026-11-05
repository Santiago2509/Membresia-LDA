import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CatalogoClient from '@/components/CatalogoClient';
import { BrandStripe } from '@/components/BrandStripe';
import { CONTENT_CARD_COLUMNS } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';

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
  const { data: rows } = await supabase
    .from('content')
    .select(CONTENT_CARD_COLUMNS)
    .order('created_at', { ascending: false });

  const contents = (rows || []).map(toContentCard);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <BrandStripe className="mb-6" />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-[#001531]">
            Catálogo
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-600">
            Videos, audios guiados, guías y artículos para entender tu ansiedad y aprender a manejarla, paso a paso.
          </p>
        </div>

        <CatalogoClient initialContents={contents} initialType={tipo} />
      </div>
    </div>
  );
}
