import { BrandStripe } from '@/components/BrandStripe';
import { CLINIC } from '@/lib/clinic';

export const metadata = {
  title: 'Contacto | Libre de Ansiedad',
};

const channels = [
  {
    title: 'WhatsApp',
    detail: CLINIC.phoneDisplay,
    text: 'Dudas sobre la membresía, problemas con tu acceso o información sobre terapia.',
    href: CLINIC.whatsapp,
    cta: 'Escribir por WhatsApp',
  },
  {
    title: 'Primera sesión gratis',
    detail: 'Psicoterapia online 1 a 1',
    text: 'Agenda una valoración inicial con un psicólogo especializado en ansiedad.',
    href: CLINIC.freeSession,
    cta: 'Agendar sesión',
  },
];

const social = [
  { label: 'Instagram', handle: '@libredeansiedadoficial', href: CLINIC.instagram },
  { label: 'YouTube', handle: 'Libre de Ansiedad', href: CLINIC.youtube },
  { label: 'Facebook', handle: 'libredeansiedadoficial', href: CLINIC.facebook },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <BrandStripe className="mb-6" />
          <h1 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] text-[#001531] sm:text-5xl lg:text-6xl">
            Contacto
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-600">
            Estamos para ayudarte. Escríbenos y te responderemos lo más pronto posible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {channels.map((c) => (
            <div key={c.title} className="flex flex-col justify-between gap-8 rounded-3xl border border-black/10 bg-white p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#133a73]">{c.title}</p>
                <p className="mt-3 font-display text-3xl text-[#001531]">{c.detail}</p>
                <p className="mt-3 leading-relaxed text-neutral-600">{c.text}</p>
              </div>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#001531] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#133a73] sm:w-auto sm:self-start"
              >
                {c.cta} →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-black/10 pt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Redes y sitio oficial</h2>
          <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 py-5 text-[#001531] hover:text-[#133a73]"
                >
                  <span className="font-display text-2xl">{s.label}</span>
                  <span className="text-sm text-neutral-500">{s.handle} →</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={CLINIC.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 py-5 text-[#001531] hover:text-[#133a73]"
              >
                <span className="font-display text-2xl">Sitio oficial y blog</span>
                <span className="text-sm text-neutral-500">nelsonarturopsicologo.com →</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
