'use client';

import Link from 'next/link';

export function CheckoutButton() {
  // Enlace directo al plan de suscripción de ePayco
  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  return (
    <Link 
      href={epaycoPlanUrl}
      className="h-12 px-space-lg rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-space-xs shadow-md hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
    >
      <span>Comprar Membresía ($30 USD/mes)</span>
      <span className="material-symbols-outlined text-[18px]">credit_card</span>
    </Link>
  );
}
