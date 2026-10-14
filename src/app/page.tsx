import { AnimatedLogoIntro } from '@/components/AnimatedLogoIntro';
import { Hero } from '@/components/Hero';
import { FAQSection } from '@/components/FAQSection';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import ContentCard from '@/components/ContentCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  // Traer los 4 contenidos más recientes desde Supabase
  const { data: contents } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      {/* 1. Animación Cinemática de Entrada del Logo */}
      <AnimatedLogoIntro />

      {/* 2. Hero Principal con Nelson Arturo y Propuesta Clínica */}
      <Hero />

      {/* =====================================================================
          3. PILARES CLÍNICOS (El Enfoque Libre de Ansiedad)
          ===================================================================== */}
      <section className="py-16 lg:py-20 border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#133a73] bg-white/80 border border-black/5 px-3.5 py-1.5 rounded-full shadow-sm">
              Metodología Comprobada
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#001531] font-bold tracking-tight">
              ¿Por qué nuestro método funciona?
            </h2>
            <p className="font-body-md text-sm sm:text-base text-neutral-600">
              Combinamos ciencia psicológica, ejercicios guiados y acompañamiento continuo para darte resultados duraderos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pilar 1 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-7 border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#133a73] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <h3 className="font-title-md text-base sm:text-lg font-bold text-[#001531] mb-2">
                Terapia Cognitivo-Conductual (TCC)
              </h3>
              <p className="font-body-sm text-sm text-neutral-600 leading-relaxed">
                El modelo terapéutico de mayor respaldo científico mundial para reestructurar pensamientos intrusivos y desactivar respuestas de pánico.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-7 border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-[#12a04a] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[26px]">self_improvement</span>
              </div>
              <h3 className="font-title-md text-base sm:text-lg font-bold text-[#001531] mb-2">
                Herramientas para Momentos de Crisis
              </h3>
              <p className="font-body-sm text-sm text-neutral-600 leading-relaxed">
                Protocolos SOS en audio para respiración diafragmática, aterrizaje sensorial (grounding) y freno del ritmo cardíaco acelerado.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-7 border border-black/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[26px]">lock_open</span>
              </div>
              <h3 className="font-title-md text-base sm:text-lg font-bold text-[#001531] mb-2">
                Privacidad Total y a tu Ritmo
              </h3>
              <p className="font-body-sm text-sm text-neutral-600 leading-relaxed">
                Sin desplazamientos ni horarios fijos. Accede al contenido de forma 100% anónima y segura desde tu computadora o celular.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================================
          4. CONTENIDO RECIENTE (Dinámico desde Supabase)
          ===================================================================== */}
      <section className="py-16 lg:py-24 border-b border-black/5" id="cursos-destacados">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          {/* Header de la sección */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[#133a73] font-label-md text-xs uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Actualizaciones del Aula</span>
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#001531] font-bold tracking-tight">
                Contenido reciente
              </h2>
              <p className="font-body-md text-sm sm:text-base text-neutral-600 max-w-xl">
                Nuevas masterclasses, ejercicios guiados y conferencias clínicas añadidas a la plataforma.
              </p>
            </div>
            <div className="shrink-0">
              <Link 
                className="font-label-md text-sm text-[#133a73] hover:text-[#001531] font-bold flex items-center gap-1 transition-colors" 
                href="/catalogo"
              >
                <span>Explorar catálogo completo</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Grid de Contenido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contents && contents.length > 0 ? contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            )) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12 text-neutral-500 bg-white rounded-3xl border border-black/5 shadow-sm">
                No hay contenidos recientes publicados aún.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =====================================================================
          5. EXPERIENCIA DE MEMBRESÍA: QUÉ INCLUYE
          ===================================================================== */}
      <section className="py-16 lg:py-24 bg-[#001531] text-white relative overflow-hidden" id="membresia-exclusiva">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#133a73]/40 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-[#12a04a]/20 blur-3xl"></div>
        
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Columna Izquierda: Mensaje de Valor */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/10">
                <span className="material-symbols-outlined text-green-400 text-[18px]">verified</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Membresía Todo Incluido
                </span>
              </div>
              
              <h2 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Todo lo que necesitas para recuperar tu tranquilidad
              </h2>
              
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Al suscribirte obtienes acceso ilimitado e inmediato a toda nuestra videoteca clínica, audioteca de emergencia y herramientas guiadas.
              </p>

              <div className="pt-2">
                <CheckoutButton />
              </div>
            </div>

            {/* Columna Derecha: Tarjetas de Beneficios */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
                <span className="material-symbols-outlined text-green-400 text-[28px]">smart_display</span>
                <h4 className="font-bold text-white text-base">Cursos en Video HD</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Lecciones estructuradas paso a paso para entender tu sistema nervioso y reprogramar tus pensamientos.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
                <span className="material-symbols-outlined text-blue-400 text-[28px]">headphones</span>
                <h4 className="font-bold text-white text-base">Audios SOS Guiados</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Ejercicios de respiración profunda y relajación para momentos de crisis o ataques de pánico.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
                <span className="material-symbols-outlined text-amber-400 text-[28px]">description</span>
                <h4 className="font-bold text-white text-base">Cuadernos Clínicos</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Plantillas y guías en PDF descargables para monitorear tu evolución diaria.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-2">
                <span className="material-symbols-outlined text-purple-400 text-[28px]">devices</span>
                <h4 className="font-bold text-white text-base">Acceso 24/7 Total</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Ingresa desde tu celular, tablet o computador en cualquier momento y lugar.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          6. TARJETA DE PRECIO TRANSPARENTE ($30 USD / Mes)
          ===================================================================== */}
      <section className="py-16 lg:py-24 border-b border-black/5" id="precio-membresia">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/10 shadow-xl relative overflow-hidden">
            
            <div className="inline-block bg-green-100 text-green-800 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
              Suscripción Mensual Simple
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#001531] mb-2">
              Membresía Libre de Ansiedad
            </h3>
            <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
              Todo el contenido y las actualizaciones por una tarifa plana mensual sin permanencia.
            </p>

            {/* Precio */}
            <div className="flex items-baseline justify-center gap-1.5 mb-6">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#001531]">$30</span>
              <span className="text-lg font-bold text-neutral-500">USD</span>
              <span className="text-sm text-neutral-500 font-medium">/ mes</span>
            </div>

            {/* Checklist */}
            <div className="space-y-3 text-left max-w-sm mx-auto mb-8 text-sm text-neutral-700">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                <span>Acceso completo a todos los cursos y lecciones</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                <span>Audios de relajación y protocolos de emergencia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                <span>Material descargable en PDF y hojas de trabajo</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                <span><strong>Cancela cuando quieras</strong> con total libertad</span>
              </div>
            </div>

            <div className="flex justify-center">
              <CheckoutButton />
            </div>

            <p className="text-xs text-neutral-500 mt-4 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-neutral-600">lock</span>
              <span>Pago 100% cifrado y seguro procesado a través de ePayco</span>
            </p>

          </div>

        </div>
      </section>

      {/* 7. Preguntas Frecuentes con Acordeón */}
      <FAQSection />

      {/* =====================================================================
          8. LLAMADO A LA ACCIÓN FINAL (Pre-Footer)
          ===================================================================== */}
      <section className="py-16 lg:py-20 bg-gradient-to-tr from-[#133a73] via-[#001531] to-[#0e4b52] text-white text-center relative overflow-hidden">
        <div className="relative max-w-[800px] mx-auto px-6 space-y-5">
          <span className="material-symbols-outlined text-green-400 text-[40px]">spa</span>
          <h2 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Da el primer paso hacia una vida en paz
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            La ansiedad no tiene por qué gobernar tu rutina diaria. Con las herramientas correctas y orientación profesional, es posible recuperar la serenidad.
          </p>
          <div className="pt-2 flex justify-center">
            <CheckoutButton />
          </div>
        </div>
      </section>
    </>
  );
}
