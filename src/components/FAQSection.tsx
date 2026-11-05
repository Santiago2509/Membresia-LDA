'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandStripe } from './BrandStripe';

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
    question: '¿Desde qué países puedo suscribirme?',
    answer: 'Desde cualquier país. ePayco acepta tarjetas de crédito y débito internacionales y el cobro se hace en dólares (USD).',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-black/10">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-4">
          <BrandStripe className="mb-6" />
          <h2 className="font-display text-4xl leading-tight tracking-[-0.01em] text-[#001531] sm:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-neutral-600">
            ¿Tienes otra duda?{' '}
            <Link href="/contacto" className="font-semibold text-[#001531] underline underline-offset-4">
              Escríbenos
            </Link>
            .
          </p>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10 lg:col-span-7 lg:col-start-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-[#001531]">{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className={`mt-1 font-display text-2xl leading-none text-[#133a73] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="max-w-2xl pb-7 pr-10 leading-relaxed text-neutral-600">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
