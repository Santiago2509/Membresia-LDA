import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CatalogoClient from '@/components/CatalogoClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CatalogoPage() {
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

  // Fetch all contents ordered by created_at DESC
  const { data: contents } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#e6e6e6] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Harmonious Calming Header (No harsh dark blue blocks) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/8 text-[#133a73] font-bold text-xs uppercase tracking-wider shadow-sm">
            <span className="material-symbols-outlined text-[16px]">local_library</span>
            <span>Biblioteca Clínica & Aula Virtual</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#001531] tracking-tight leading-tight">
            Catálogo de Lecciones y Recursos
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Explora las masterclasses, audios guiados de respiración y artículos clínicos diseñados paso a paso para ayudarte a recuperar tu tranquilidad.
          </p>
        </div>

        {/* Interactive Filter & Cards Grid */}
        <CatalogoClient initialContents={contents || []} />

      </div>
    </div>
  );
}
