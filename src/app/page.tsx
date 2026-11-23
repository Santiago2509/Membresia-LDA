import { AnimatedLogoIntro } from '@/components/AnimatedLogoIntro';
import { Hero } from '@/components/Hero';
import { FAQSection } from '@/components/FAQSection';
import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import { BreathingExercise } from '@/components/BreathingExercise';
import { SituationPicker } from '@/components/SituationPicker';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CONTENT_CARD_COLUMNS, EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';
import { CLINIC, CLINIC_STATS, CLINIC_TOPICS } from '@/lib/clinic';

export const revalidate = 0;

const formats: { name: string; icon: IconName; color: string; text: string }[] = [
  {
    name: 'Videos',
    icon: 'play',
    color: '#2b93d1',
    text: 'Clases en las que Nelson explica qué pasa en tu cuerpo y en tu mente con la ansiedad, y cómo intervenir.',
  },
  {
    name: 'Audios guiados',
    icon: 'headphones',
    color: '#12a04a',
    text: 'Ejercicios de respiración y de aterrizaje para usar en el momento en que la ansiedad sube.',
  },
  {
    name: 'Guías en PDF',
    icon: 'file',
    color: '#eeab52',
    text: 'Hojas de trabajo y registros para practicar entre una lección y otra. Puedes descargarlas e imprimirlas.',
  },
  {
    name: 'Artículos',
    icon: 'book',
    color: '#d6006f',
    text: 'Lecturas cortas para entender y repasar los conceptos clave cuando lo necesites.',
  },
];

const steps = [
  {
    title: 'Te suscribes',
    text: 'Pagas con tarjeta de forma segura en ePayco. El cobro se renueva cada mes y puedes cancelarlo cuando quieras.',
  },
  {
    title: 'Recibes tu acceso',
    text: 'En pocos minutos te llega un correo con tu usuario y una contraseña temporal. Revisa también la carpeta de spam.',
  },
  {
    title: 'Entras y avanzas',
    text: 'Ingresas a tu Aula Virtual desde el celular o el computador y avanzas a tu ritmo, cuando quieras.',
  },
];

const priceIncludes = [
  'Acceso a todo el material del aula',
  'Contenido nuevo a medida que se publica',
  'Guías descargables en PDF',
  'Desde el celular o el computador',
  'Sin permanencia: cancelas cuando quieras',
];

const LOGO_COLORS = ['#12a04a', '#8dc42a', '#eeab52', '#ec6f31', '#e8363b', '#d6006f', '#b0106a', '#2b93d1', '#133a73'];

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

      {/* 3. Ejercicio de respiración interactivo */}
      <section id="respira" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <Reveal className="mx-auto max-w-[1240px]">
          <BreathingExercise />
        </Reveal>
      </section>

      {/* 4. ¿Qué te está pasando? (interactivo) */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              eyebrow="Encuentra tu punto de partida"
              title="¿Qué te está pasando?"
              text="Toca la opción que más se parece a lo que vives y mira cómo te ayuda la membresía."
            />
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <SituationPicker />
          </Reveal>
        </div>
      </section>

      {/* 5. Qué incluye */}
      <section id="que-incluye" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div id="membresia-exclusiva" className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              eyebrow="Qué incluye"
              title="Material para los momentos difíciles y para el trabajo de fondo"
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((f, i) => (
              <Reveal key={f.name} delay={i * 90} className="h-full">
                <div className="group h-full rounded-[1.75rem] bg-white p-7 shadow-[0_10px_40px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,58,0.12)]">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${f.color}1f`, color: f.color }}
                  >
                    <Icon name={f.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-ink">{f.name}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-body">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Cómo funciona */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1240px] rounded-[2.5rem] bg-ink px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Cómo funciona"
              title="Tres pasos y estás dentro"
              text="Todo es automático. No tienes que esperar a que alguien te habilite."
              tone="dark"
            />
          </Reveal>
          <div className="relative mt-14">
          <div aria-hidden="true" className="absolute left-7 right-7 top-7 hidden h-px bg-white/20 md:block" />
          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 120} className="relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white font-display text-2xl text-ink">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 max-w-sm text-lg leading-relaxed text-white/75">{step.text}</p>
              </Reveal>
            ))}
          </ol>
          </div>
          <Reveal delay={200} className="mt-14">
            <Link
              href={EPAYCO_PLAN_URL}
              className="group inline-flex h-16 w-full items-center justify-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-ink transition-colors hover:bg-sun sm:w-auto"
            >
              Empezar ahora
              <Icon name="arrow-right" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7. Quién soy (texto real de la web oficial) */}
      <section id="quien-soy" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#d9d9d6]">
              <img
                src="/nelson-quien-soy.jpg"
                alt="Psic. Nelson Arturo"
                className="aspect-[4/5] w-full object-cover object-[70%_center]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-7 pt-24 text-white">
                <p className="font-display text-3xl">Nelson Arturo</p>
                <p className="mt-1 text-base text-white/85">Psicólogo especialista en ansiedad</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-center lg:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-calm">Quién soy</p>
            <blockquote className="mt-5 font-display text-[1.85rem] leading-snug text-ink sm:text-[2.3rem]">
              “Soy psicólogo, especialista en el tratamiento de la ansiedad, pero también fui uno de los afectados.
              Quiero ayudarte a que seas una persona mucho más fuerte, inteligente y calmada para que seas libre y
              reemprendas tus sueños.”
            </blockquote>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body">
              {CLINIC.name} es un centro de psicología online con un equipo de psicólogos clínicos especializados en
              ansiedad, estrés y trastornos emocionales. Trabajamos con Terapia Cognitivo-Conductual (TCC) y otras
              metodologías validadas por la ciencia, sin medicamentos.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Áreas que trabaja el centro">
              {CLINIC_TOPICS.map((topic) => (
                <li key={topic} className="rounded-full bg-white px-4 py-2 text-base text-ink shadow-[0_2px_10px_rgba(11,31,58,0.05)]">
                  {topic}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Cifras publicadas por el centro, animadas */}
        <dl className="mx-auto mt-16 grid max-w-[1240px] grid-cols-2 gap-4 lg:grid-cols-4">
          {CLINIC_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="h-full rounded-[1.5rem] bg-white p-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp value={stat.value} className="block font-display text-4xl text-ink sm:text-5xl" />
                  <span className="mt-2 block text-base leading-snug text-body">{stat.label}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* 8. Contenido reciente (desde Supabase) */}
      {contents.length > 0 && (
        <section id="cursos-destacados" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Recién publicado" title="Lo último en el aula" />
              <Link
                href="/catalogo"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-ink/15 px-6 text-lg font-semibold text-ink hover:border-ink"
              >
                Ver todo el catálogo
                <Icon name="arrow-right" className="h-5 w-5" />
              </Link>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {contents.map((item, i) => (
                <Reveal key={item.id} delay={i * 90}>
                  <ContentCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Precio */}
      <section id="precio-membresia" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <Reveal className="mx-auto max-w-[1040px]">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_80px_rgba(11,31,58,0.12)]">
            <div className="flex h-2" aria-hidden="true">
              {LOGO_COLORS.map((c) => (
                <span key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-calm">Membresía mensual</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-ink">Todo el contenido, una sola tarifa</h2>
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="font-display text-8xl leading-none text-ink">$30</span>
                  <span className="text-xl text-body">USD al mes</span>
                </div>
                <p className="mt-6 max-w-sm text-lg leading-relaxed text-body">
                  Todo el material actual y el que se publique mientras tu membresía esté activa.
                </p>
              </div>
              <div className="flex flex-col justify-between gap-10">
                <ul className="space-y-4">
                  {priceIncludes.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-lg text-ink">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-calm/15 text-calm">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
                <div>
                  <Link
                    href={EPAYCO_PLAN_URL}
                    className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-lg font-semibold text-white transition-colors hover:bg-brand"
                  >
                    Suscribirme por {MEMBERSHIP_PRICE_LABEL}/mes
                    <Icon name="arrow-right" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="mt-4 flex items-center justify-center gap-2 text-base text-body">
                    <Icon name="lock" className="h-4 w-4" />
                    Pago seguro procesado por ePayco
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 10. Acompañamiento 1 a 1 (servicios reales del centro) */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <Reveal className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-8 rounded-[2.5rem] border-2 border-ink/10 p-8 sm:p-12 lg:grid-cols-12 lg:p-14">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-calm">Terapia con un psicólogo</p>
            <h2 className="mt-4 hyphens-none font-display text-[1.85rem] leading-tight text-ink sm:text-5xl">
              ¿Prefieres un acompañamiento personalizado?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-body">
              El centro también ofrece psicoterapia online 1 a 1 con un psicólogo especializado en ansiedad: evaluación
              inicial, plan personalizado y técnicas prácticas para la ansiedad y el pánico. También hay sesiones grupales.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5">
            <a
              href={CLINIC.freeSession}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
            >
              <Icon name="calendar" className="h-5 w-5" />
              Agendar primera sesión gratis
            </a>
            <a
              href={CLINIC.whatsappTherapy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#1f9d55] px-7 text-lg font-semibold text-white transition-colors hover:bg-[#178a48]"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              WhatsApp {CLINIC.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </section>

      {/* 11. Preguntas frecuentes */}
      <FAQSection />
    </>
  );
}
