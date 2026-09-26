import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const revalidate = 0;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 6;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

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

  // Fetch paginated content and total count
  const { data: contents, count } = await supabase
    .from('content')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="bg-primary-container text-on-primary-container py-12 lg:py-20 text-center px-6">
        <h1 className="font-display-md lg:font-display-lg font-bold tracking-tight mb-4">Catálogo Completo</h1>
        <p className="max-w-2xl mx-auto font-body-lg text-on-surface-variant/80">
          Explora todos nuestros recursos, cursos y herramientas. Tu camino hacia el bienestar emocional comienza aquí.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16">
        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg mb-16">
          {contents && contents.length > 0 ? contents.map((item) => (
            <div key={item.id} className="group bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container-high">
                {item.thumbnail_url ? (
                  <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.thumbnail_url} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-on-surface-variant">
                    <span className="material-symbols-outlined text-[32px]">image</span>
                  </div>
                )}
                {item.is_premium && (
                  <div className="absolute top-3 right-3 rounded-full bg-primary-container/85 backdrop-blur-sm px-3 py-1 font-label-xs text-label-xs text-on-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    <span>Premium</span>
                  </div>
                )}
              </div>
              <div className="p-space-md flex-1 flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed/60 text-on-secondary-fixed font-label-xs text-label-xs tracking-wider uppercase font-semibold">
                    {item.category}
                  </span>
                  <h3 className="font-title-md text-title-md text-primary group-hover:text-secondary transition-colors font-bold line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="pt-space-md mt-space-md border-t border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-space-xs font-label-xs text-label-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      {item.type === 'video' ? 'play_circle' : item.type === 'audio' ? 'headphones' : item.type === 'pdf' ? 'picture_as_pdf' : 'menu_book'}
                    </span>
                    <span className="uppercase">{item.type}</span>
                  </div>
                  <Link href={`/aula/contenido/${item.id}`} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-on-surface-variant">
              Aún no hay contenido publicado en el catálogo.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Link 
              href={currentPage > 1 ? `/catalogo?page=${currentPage - 1}` : '#'}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                currentPage > 1 
                  ? 'bg-surface-container text-primary hover:bg-surface-container-high' 
                  : 'bg-surface text-outline-variant cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </Link>
            
            <div className="font-label-md font-bold text-on-surface-variant">
              Página {currentPage} de {totalPages}
            </div>

            <Link 
              href={currentPage < totalPages ? `/catalogo?page=${currentPage + 1}` : '#'}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                currentPage < totalPages 
                  ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm' 
                  : 'bg-surface text-outline-variant cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
