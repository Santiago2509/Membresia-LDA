import { Hero } from '@/components/Hero';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const revalidate = 0;

export default async function Home() {
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

  // Traer los 4 cursos más recientes
  const { data: contents } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      <Hero />
      
      {/* =====================================================================
          CONTENIDO RECIENTE (Dinámico)
          ===================================================================== */}
      <section className="py-space-xl lg:py-24 bg-surface" id="cursos-destacados">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-secondary font-label-md text-label-md uppercase tracking-wider font-semibold">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Actualizaciones clínicas</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary font-bold">
                Contenido reciente
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Nuevas publicaciones multidisciplinarias para enriquecer tu día a día con herramientas prácticas y científicas.
              </p>
            </div>
            <div className="shrink-0">
              <Link className="font-label-md text-label-md text-secondary hover:text-primary flex items-center gap-1 transition-colors" href="/catalogo">
                <span>Explorar catálogo completo</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Dynamic Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
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
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-10 text-on-surface-variant">
                Aún no hay contenido publicado.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          EXCLUSIVE MEMBER CONTENT (Deep Navy Ambient Container)
          ===================================================================== */}
      <section className="py-space-xl lg:py-24 bg-tertiary text-on-primary relative overflow-hidden" id="membresia-exclusiva">
        {/* Subtle glow orbs */}
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl"></div>
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left: Proposal & Call to Action */}
            <div className="lg:col-span-6 space-y-space-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/10 px-3.5 py-1.5 backdrop-blur-md">
                <span className="material-symbols-outlined text-secondary-fixed text-[18px]">verified_user</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed font-semibold uppercase tracking-wider">
                  Membresía Libre de Ansiedad
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-display-lg text-on-primary font-bold tracking-tight">
                Más contenido. Más herramientas para ti.
              </h2>
              <p className="font-body-lg text-body-lg text-secondary-fixed-dim max-w-xl">
                Descubre cursos completos, videos terapéuticos y recursos descargables exclusivos creados por los especialistas clínicos de nuestro equipo médico.
              </p>
              <div className="pt-space-xs">
                <Link className="h-12 px-space-lg rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md inline-flex items-center justify-center gap-2 shadow-lg hover:bg-secondary-fixed transition-all duration-200 hover:-translate-y-0.5" href="/catalogo">
                  <span>Explorar el catálogo</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
            
            {/* Right: Locked Premium Content Stack */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              {/* Locked Item 1 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-between gap-space-md hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center gap-space-md">
                  <div className="w-11 h-11 rounded-full bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[20px]">lock</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-label-xs text-label-xs text-secondary-fixed font-semibold uppercase">Curso premium</span>
                    <h4 className="font-title-md text-title-md text-on-primary font-semibold">
                      Masterclass: Gestión Cognitiva y Emocional
                    </h4>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] shrink-0">chevron_right</span>
              </div>
              
              {/* Locked Item 2 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-between gap-space-md hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center gap-space-md">
                  <div className="w-11 h-11 rounded-full bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[20px]">lock</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-label-xs text-label-xs text-secondary-fixed font-semibold uppercase">Video mensual</span>
                    <h4 className="font-title-md text-title-md text-on-primary font-semibold">
                      Sesiones Q&amp;A en vivo con psicólogos colegiados
                    </h4>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] shrink-0">chevron_right</span>
              </div>
              
              {/* Locked Item 3 */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md flex items-center justify-between gap-space-md hover:bg-surface-container-lowest/15 transition-all">
                <div className="flex items-center gap-space-md">
                  <div className="w-11 h-11 rounded-full bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[20px]">lock</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-label-xs text-label-xs text-secondary-fixed font-semibold uppercase">Guía PDF clínica</span>
                    <h4 className="font-title-md text-title-md text-on-primary font-semibold">
                      Cuaderno de trabajo clínico con 40 ejercicios guiados
                    </h4>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] shrink-0">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FINAL CALL TO ACTION (CTA Pre-Footer)
          ===================================================================== */}
      <section className="py-space-xl lg:py-24 bg-primary-container text-on-primary relative overflow-hidden">
        {/* Ambient backdrops */}
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"></div>
        <div className="pointer-events-none absolute top-0 -right-20 h-96 w-96 rounded-full bg-surface-container-highest/10 blur-3xl"></div>
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-space-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/15 px-4 py-1.5 backdrop-blur-md">
              <span className="material-symbols-outlined text-secondary-fixed text-[18px]">favorite</span>
              <span className="font-label-sm text-label-sm text-secondary-fixed font-semibold uppercase tracking-wider">
                Comienza tu camino
              </span>
            </div>
            <h2 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-primary font-bold tracking-tight">
              Empieza a cuidar tu bienestar hoy
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl mx-auto">
              Accede a contenido de salud mental creado por psicólogos colegiados para acompañarte paso a paso en tu proceso de autoconocimiento.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-space-md pt-space-xs">
              <CheckoutButton />
              <Link className="h-12 px-space-lg rounded-full bg-surface-container-lowest/10 text-on-primary font-label-md text-label-md flex items-center justify-center backdrop-blur-sm hover:bg-surface-container-lowest/20 transition-all duration-200" href="/catalogo">
                <span>Explorar contenido</span>
              </Link>
            </div>
            
            {/* Micro-assurance */}
            <div className="pt-space-md flex flex-wrap justify-center items-center gap-4 text-on-primary-container font-label-xs text-label-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">check_circle</span>
                <span>Cancela en cualquier momento</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">devices</span>
                <span>Acceso instantáneo desde cualquier dispositivo</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary-fixed">security</span>
                <span>Privacidad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
