import Link from 'next/link';
import { Icon } from './ui/Icon';
import { EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';

const TRUST = [
  { icon: 'heart' as const, text: '1000+ pacientes atendidos' },
  { icon: 'spark' as const, text: '4.6/5 de calificación' },
  { icon: 'check' as const, text: 'Cancela cuando quieras' },
];

export function Hero() {
  return (
    <section id="hero-principal" className="relative overflow-hidden bg-paper">
      {/* Halo de colores del logo, muy suave */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-sky/20 via-rose/10 to-sun/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-24 lg:pt-36">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-brand">
            <span className="h-2 w-2 rounded-full bg-calm" />
            Membresía del Centro de Psicología Especializado en Ansiedad
          </p>

          <h1 className="mt-7 font-display text-[2.7rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.6rem]">
            La ansiedad se entiende.{' '}
            <em className="font-normal italic text-brand">Y se aprende a manejar.</em>
          </h1>

          <p className="mt-7 max-w-xl text-xl leading-relaxed text-body">
            Videos, audios guiados y guías prácticas del Psic. Nelson Arturo para que trabajes tu ansiedad desde casa,
            a tu ritmo, con herramientas de la Terapia Cognitivo-Conductual.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={EPAYCO_PLAN_URL}
              className="group inline-flex h-16 items-center justify-center gap-3 rounded-full sm:whitespace-nowrap bg-ink px-7 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(11,31,58,0.25)] transition-all hover:bg-brand"
            >
              Suscribirme · {MEMBERSHIP_PRICE_LABEL}/mes
              <Icon name="arrow-right" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#respira"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-full sm:whitespace-nowrap border-2 border-ink/15 bg-white px-7 text-lg font-semibold text-ink transition-colors hover:border-ink"
            >
              <Icon name="wind" className="h-5 w-5 shrink-0 text-sky" />
              Probar ejercicio gratis
            </a>
          </div>

          <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-2.5 text-base font-medium text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-calm/15 text-calm">
                  <Icon name={t.icon} className="h-4 w-4" />
                </span>
                {t.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Foto de Nelson */}
        <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] bg-gradient-to-b from-sky/25 via-white to-white">
            <img
              alt="Psic. Nelson Arturo, creador de Libre de Ansiedad"
              src="/foto%20inicio%20nelson.png"
              className="absolute bottom-0 left-1/2 w-[105%] max-w-none -translate-x-1/2 object-contain"
            />
          </div>
          <div className="animate-float absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(11,31,58,0.15)] sm:-left-8">
            <img src="/logo-mark.png" alt="" className="h-9 w-auto" />
            <div>
              <p className="text-base font-semibold leading-tight text-ink">Psic. Nelson Arturo</p>
              <p className="text-sm text-body">Especialista en ansiedad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
