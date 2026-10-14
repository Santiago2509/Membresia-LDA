'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo accedo a los contenidos una vez realizada la compra?',
    answer: 'Tan pronto confirmas tu membresía en ePayco, nuestro sistema te envía un correo electrónico de bienvenida con tu usuario y tu contraseña temporal para que ingreses de inmediato a tu Aula Virtual. Todo el proceso es 100% automático e instantáneo.',
  },
  {
    question: '¿Puedo cancelar la membresía en cualquier momento?',
    answer: 'Sí, totalmente. No tenemos cláusulas de permanencia ni cobros ocultos. Puedes cancelar tu suscripción mensual cuando lo desees y mantendrás acceso completo hasta que finalice el periodo que ya pagaste.',
  },
  {
    question: '¿Qué tipo de contenidos encontraré en la plataforma?',
    answer: 'Tendrás acceso ilimitado a cursos completos en video impartidos por el Psic. Nelson Arturo, audios terapéuticos guiados para emergencias de ansiedad, cuadernos de trabajo clínicos descargables en PDF y sesiones de actualización constantes.',
  },
  {
    question: '¿Es necesario tener conocimientos previos en psicología?',
    answer: 'Para nada. Cada clase y recurso está diseñado con un lenguaje claro, cercano y práctico, pensando en personas comunes que buscan herramientas científicas reales para aplicar en su vida diaria.',
  },
  {
    question: '¿Desde qué países puedo adquirir la membresía?',
    answer: 'Nuestra pasarela ePayco acepta pagos con tarjetas de crédito y débito internacionales desde cualquier país del mundo. El cobro se realiza de forma segura en dólares (USD).',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 border-b border-black/5">
      <div className="max-w-[960px] mx-auto px-6 lg:px-12">
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-black/5 px-4 py-1 shadow-sm backdrop-blur-md">
            <span className="material-symbols-outlined text-[#133a73] text-[18px]">help_outline</span>
            <span className="font-label-sm text-xs font-bold text-neutral-700 tracking-wider uppercase">
              Resolvemos tus dudas
            </span>
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-[#001531] font-bold tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="font-body-md text-sm sm:text-base text-neutral-600">
            Todo lo que necesitas saber sobre el funcionamiento de tu membresía y el acceso al Aula Virtual.
          </p>
        </div>

        {/* Acordeón de Preguntas */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4.5 px-6 flex items-center justify-between gap-4 text-left font-title-md text-sm sm:text-base font-bold text-[#001531] hover:text-[#133a73] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#133a73] text-white rotate-180' : 'bg-black/5 text-neutral-600'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      keyboard_arrow_down
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-neutral-600 text-sm leading-relaxed border-t border-black/5 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
