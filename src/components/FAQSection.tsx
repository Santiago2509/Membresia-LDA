'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SectionHeading } from './ui/SectionHeading';
import { Icon } from './ui/Icon';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo accedo a los contenidos después de pagar?',
    answer: 'Cuando ePayco confirma tu pago, el sistema crea tu cuenta y te envía un correo con tu usuario y una contraseña temporal. Con esos datos entras al Aula Virtual. Todo es automático.',
  },
  {
    question: 'No me llegó el correo, ¿qué hago?',
    answer: 'Revisa las carpetas de spam y promociones. Si no aparece, entra a "Iniciar sesión", elige "¿Olvidaste tu contraseña?" y escribe el mismo correo con el que pagaste: te llegará un enlace para crear tu contraseña.',
  },
  {
    question: '¿Puedo cambiar la contraseña que me enviaron?',
    answer: 'Sí. Dentro del aula ve a "Mi Perfil & Suscripción" y usa la opción "Cambiar contraseña".',
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer: 'Sí. No hay permanencia ni cobros ocultos. Si cancelas, conservas el acceso hasta que termine el periodo que ya pagaste.',
  },
  {
    question: '¿Necesito conocimientos de psicología?',
    answer: 'No. Cada recurso está explicado con un lenguaje claro y práctico, pensado para cualquier persona que quiera herramientas para su día a día.',
  },
  {
    question: '¿También puedo tener terapia individual?',
    answer: 'Sí. El centro Libre de Ansiedad ofrece psicoterapia online 1 a 1 y sesiones grupales con psicólogos especializados en ansiedad. Puedes agendar tu primera sesión gratis o escribirnos por WhatsApp al +57 311 760 61 07.',
  },
  {
    question: '¿Desde qué países puedo suscribirme?',
    answer: 'Desde cualquier país. ePayco acepta tarjetas de crédito y débito internacionales y el cobro se hace en dólares (USD).',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Resolvemos tus dudas" title="Preguntas frecuentes" />
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-body">
            ¿Tienes otra pregunta?{' '}
            <Link href="/contacto" className="font-semibold text-ink underline underline-offset-4">
              Escríbenos
            </Link>
            .
          </p>
        </div>

        <div className="space-y-3 lg:col-span-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border-2 bg-white transition-colors ${isOpen ? 'border-ink/30' : 'border-transparent'}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-semibold text-ink sm:text-xl">{faq.question}</span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? 'rotate-45 bg-ink text-white' : 'bg-ink/5 text-ink'
                      }`}
                      aria-hidden="true"
                    >
                      <Icon name="close" className="h-5 w-5 rotate-45" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${index}`}
                  className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl px-6 pb-6 text-lg leading-relaxed text-body">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
