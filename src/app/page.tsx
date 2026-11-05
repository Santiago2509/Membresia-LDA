import { AnimatedLogoIntro } from '@/components/AnimatedLogoIntro';
import { Hero } from '@/components/Hero';
import { FAQSection } from '@/components/FAQSection';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import ContentCard from '@/components/ContentCard';
import { BrandStripe } from '@/components/BrandStripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CONTENT_CARD_COLUMNS, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';

export const revalidate = 0;

const steps = [
  {
    title: 'Te suscribes con ePayco',
    text: 'Pagas con tarjeta de forma segura. El cobro se renueva cada mes y puedes cancelarlo cuando quieras.',
  },
  {
    title: 'Recibes tu acceso por correo',
    text: 'En pocos minutos te llega un correo con tu usuario y una contraseña temporal, que puedes cambiar desde tu perfil.',
  },
  {
    title: 'Entras al aula y avanzas a tu ritmo',
    text: 'Todo el material queda disponible mientras tu membresía esté activa, desde el celular o el computador.',
  },
];

const formats = [
  {
    name: 'Videos',
    color: '#2b93d1',
    text: 'Clases en las que Nelson explica qué pasa en tu cuerpo y en tu mente con la ansiedad, y cómo intervenir.',
  },
  {
    name: 'Audios guiados',
    color: '#12a04a',
    text: 'Ejercicios de respiración y de aterrizaje para usar en el momento en que la ansiedad sube.',
  },
  {
    name: 'Guías en PDF',
    color: '#eeab52',
    text: 'Hojas de trabajo y registros para practicar entre una lección y otra.',
  },
  {
    name: 'Artículos',
    color: '#d6006f',
    text: 'Lecturas cortas para entender y repasar los conceptos clave cuando lo necesites.',
  },
];

const priceIncludes = [
  'Acceso a todo el material del aula',
  'Contenido nuevo a medida que se publica',
  'Guías descargables en PDF',
  'Sin permanencia: cancelas cuando quieras',
];

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

  // Solo las columnas que necesita la tarjeta (nunca el contenido completo)
  const { data: rows } = await supabase
    .from('content')
    .select(CONTENT_CARD_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(3);

  const contents = (rows || []).map(toContentCard);

  return (
    <>
      {/* 1. Animación de entrada del logo (se mantiene tal cual) */}
      <AnimatedLogoIntro />

      {/* 2. Presentación */}
      <Hero />

      {/* 3. Cómo funciona */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
          <div className="lg:col-span-4">
            <BrandStripe className="mb-6" />
            <h2 className="font-display text-4xl leading-tight tracking-[-0.01em] text-[#001531] sm:text-5xl">
              Tres pasos y estás dentro.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-neutral-600">
              Todo el proceso es automático. No tienes que esperar a que alguien te habilite.
            </p>
          </div>

          <ol className="divide-y divide-black/10 border-y border-black/10 lg:col-span-7 lg:col-start-6">
            {steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-4 py-8 sm:grid-cols-[5rem_1fr] sm:gap-6">
                <span className="font-display text-4xl leading-none text-[#12a04a] sm:text-5xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#001531]">{step.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-neutral-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Qué incluye */}
      <section id="que-incluye" className="bg-[#001531] text-white">
        <div id="membresia-exclusiva" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <BrandStripe className="mb-6" />
              <h2 className="font-display text-4xl leading-tight tracking-[-0.01em] sm:text-5xl">
                Material para los momentos difíciles <em className="italic text-white/70">y para el trabajo de fondo.</em>
              </h2>
            </div>

            <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-7">
              {formats.map((f) => (
                <li key={f.name} className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-[13rem_1fr] sm:gap-8">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: f.color }} />
                    <h3 className="font-display text-2xl">{f.name}</h3>
                  </div>
                  <p className="leading-relaxed text-white/75">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Contenido reciente (desde Supabase) */}
      {contents.length > 0 && (
        <section id="cursos-destacados" className="border-b border-black/10">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <BrandStripe className="mb-6" />
                <h2 className="font-display text-4xl leading-tight tracking-[-0.01em] text-[#001531] sm:text-5xl">
                  Lo último en el aula
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="text-[15px] font-semibold text-[#001531] underline decoration-black/25 underline-offset-[6px] hover:decoration-[#001531]"
              >
                Ver todo el catálogo →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {contents.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Quién está detrás */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
          <div className="lg:col-span-4">
            <BrandStripe className="mb-6" />
            <h2 className="font-display text-4xl leading-tight tracking-[-0.01em] text-[#001531] sm:text-5xl">
              Quién está detrás
            </h2>
          </div>
          <div className="space-y-6 lg:col-span-7 lg:col-start-6">
            <p className="font-display text-2xl leading-snug text-[#001531] sm:text-[1.7rem]">
              Libre de Ansiedad es la clínica del Psic. Nelson Arturo. Esta membresía reúne en un solo lugar
              el material que prepara para sus pacientes.
            </p>
            <p className="max-w-2xl leading-relaxed text-neutral-700">
              Explicaciones claras, ejercicios guiados y guías prácticas, pensadas para que puedas seguir
              trabajando entre sesiones o empezar por tu cuenta, con un lenguaje sencillo y sin necesidad de
              conocimientos previos.
            </p>
            <p className="max-w-2xl border-l-2 border-[#eeab52] pl-4 text-sm leading-relaxed text-neutral-600">
              Este contenido es educativo y no reemplaza la atención psicológica individual. Si estás atravesando
              una crisis, busca ayuda profesional de inmediato.{' '}
              <Link href="/contacto" className="font-semibold text-[#001531] underline underline-offset-4">
                Escríbenos para agendar una consulta
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 7. Precio */}
      <section id="precio-membresia" className="border-b border-black/10">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-12 rounded-[2rem] bg-white p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#133a73]">Membresía mensual</p>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-7xl leading-none text-[#001531] sm:text-8xl">$30</span>
                <span className="text-lg text-neutral-500">USD al mes</span>
              </div>
              <p className="mt-6 max-w-sm leading-relaxed text-neutral-600">
                Una sola tarifa. Todo el contenido actual y el que se publique mientras tu membresía esté activa.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-10">
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {priceIncludes.map((line) => (
                  <li key={line} className="flex items-start gap-3 py-4 text-neutral-800">
                    <span aria-hidden="true" className="mt-0.5 text-[#12a04a]">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-4">
                <CheckoutButton label={`Suscribirme por ${MEMBERSHIP_PRICE_LABEL} al mes`} />
                <p className="text-sm text-neutral-500">Pago procesado de forma segura por ePayco.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Preguntas frecuentes */}
      <FAQSection />
    </>
  );
}
