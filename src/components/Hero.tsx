import Link from 'next/link';
import { CheckoutButton } from './CheckoutButton';
import { BrandStripe } from './BrandStripe';
import { MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';

export function Hero() {
  return (
    <section id="hero-principal" className="relative overflow-hidden border-b border-black/10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-end gap-12 px-5 pt-20 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pt-28">
        {/* Texto */}
        <div className="lg:col-span-7 lg:pb-24">
          <BrandStripe className="mb-6" />
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#133a73]">
            Membresía · Psic. Nelson Arturo
          </p>

          <h1 className="font-display text-[2.6rem] leading-[1.04] tracking-[-0.02em] text-[#001531] sm:text-6xl lg:text-[4.4rem]">
            La ansiedad se entiende.{' '}
            <em className="font-normal italic text-[#133a73]">Y se aprende a manejar.</em>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-700">
            Videos, audios guiados y guías prácticas creadas por el Psic. Nelson Arturo para que trabajes
            tu ansiedad desde casa, a tu ritmo, con herramientas de la terapia cognitivo-conductual.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-7">
            <CheckoutButton />
            <Link
              href="#que-incluye"
              className="text-center text-[15px] font-semibold text-[#001531] underline decoration-black/25 underline-offset-[6px] transition-colors hover:decoration-[#001531]"
            >
              Ver qué incluye
            </Link>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-black/15 pt-6">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Precio</dt>
              <dd className="mt-1 whitespace-nowrap font-display text-lg text-[#001531] sm:text-2xl">{MEMBERSHIP_PRICE_LABEL}<span className="text-sm text-neutral-500">/mes</span></dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Permanencia</dt>
              <dd className="mt-1 whitespace-nowrap font-display text-lg text-[#001531] sm:text-2xl">Ninguna</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Acceso</dt>
              <dd className="mt-1 whitespace-nowrap font-display text-lg text-[#001531] sm:text-2xl">Inmediato</dd>
            </div>
          </dl>
        </div>

        {/* Foto de Nelson sobre un arco */}
        <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 aspect-[4/5] w-[78%] max-w-[380px] -translate-x-1/2 rounded-t-full bg-[#133a73]/[0.09] lg:left-auto lg:right-4 lg:translate-x-0"
          />
          <img
            alt="Psic. Nelson Arturo, creador de Libre de Ansiedad"
            src="/foto%20inicio%20nelson.png"
            className="relative z-10 w-full max-w-[420px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
