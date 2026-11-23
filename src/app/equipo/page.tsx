import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TeamGrid } from '@/components/TeamGrid';
import { Icon } from '@/components/ui/Icon';
import { TEAM } from '@/lib/team';
import { CLINIC } from '@/lib/clinic';

export const metadata = {
  title: 'Nuestro equipo | Libre de Ansiedad',
  description: 'Conoce a los psicólogos de Libre de Ansiedad, especializados en ansiedad y Terapia Cognitivo-Conductual.',
};

export default function EquipoPage() {
  return (
    <div className="min-h-screen pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Nuestro equipo"
          title="Psicólogos especializados en ansiedad"
          text="Un equipo que trabaja con Terapia Cognitivo-Conductual y métodos validados por la ciencia. Varios de nosotros también vivimos la ansiedad y sabemos lo que se siente."
        />

        <div className="mt-14">
          <TeamGrid members={TEAM} />
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-8 rounded-[2.5rem] border-2 border-ink/10 p-8 sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">¿Quieres trabajar con nuestro equipo?</h2>
            <p className="mt-3 text-lg leading-relaxed text-body">
              Agenda una valoración inicial gratis o escríbenos por WhatsApp y te ayudamos a elegir el acompañamiento
              que necesitas.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5">
            <a
              href={CLINIC.freeSession}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white hover:bg-brand"
            >
              <Icon name="calendar" className="h-5 w-5" />
              Agendar primera sesión gratis
            </a>
            <a
              href={CLINIC.whatsappTherapy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#1f9d55] px-7 text-lg font-semibold text-white hover:bg-[#178a48]"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              WhatsApp {CLINIC.phoneDisplay}
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-lg text-body">
          ¿Quieres leer sus experiencias?{' '}
          <Link href="/testimonios" className="font-semibold text-ink underline underline-offset-4">
            Ver testimonios de pacientes
          </Link>
        </p>
      </div>
    </div>
  );
}
