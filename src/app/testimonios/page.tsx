import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialsBrowser } from '@/components/TestimonialsBrowser';
import { YouTubeLite } from '@/components/YouTubeLite';
import { Icon } from '@/components/ui/Icon';
import { TESTIMONIALS, TESTIMONIAL_VIDEO_ID } from '@/lib/testimonials';
import { EPAYCO_PLAN_URL } from '@/lib/membership';
import { CLINIC } from '@/lib/clinic';

export const metadata = {
  title: 'Testimonios | Libre de Ansiedad',
  description: 'Historias reales de pacientes que trabajaron su ansiedad con el equipo de Libre de Ansiedad.',
};

export default function TestimoniosPage() {
  return (
    <div className="min-h-screen pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Historias reales"
              title="Lo que viven nuestros pacientes"
              text="Personas de distintos países que aprendieron a manejar su ansiedad con el equipo de Libre de Ansiedad. Sus palabras, tal como nos las compartieron."
            />
          </div>
          <div className="lg:col-span-6">
            <YouTubeLite id={TESTIMONIAL_VIDEO_ID} title="Video de testimonios de pacientes" />
          </div>
        </div>

        <div className="mt-16">
          <TestimonialsBrowser items={TESTIMONIALS} />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[2.5rem] bg-ink p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Tu historia también puede cambiar</h2>
            <p className="mt-3 max-w-xl text-lg text-white/75">
              Empieza a tu ritmo con la membresía o agenda una primera sesión gratis con el equipo.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={EPAYCO_PLAN_URL}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-lg font-semibold text-ink hover:bg-sun"
            >
              Suscribirme
              <Icon name="arrow-right" className="h-5 w-5" />
            </Link>
            <a
              href={CLINIC.freeSession}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/30 px-7 text-lg font-semibold text-white hover:border-white"
            >
              Primera sesión gratis
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
