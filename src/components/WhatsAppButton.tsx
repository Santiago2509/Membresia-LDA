'use client';

import { usePathname } from 'next/navigation';
import { Icon } from './ui/Icon';
import { CLINIC } from '@/lib/clinic';

/** Botón flotante de ayuda por WhatsApp (no aparece en el panel de administración). */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <a
      href={CLINIC.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="¿Necesitas ayuda? Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#1f9d55] py-3 pl-3 pr-3 text-white shadow-[0_10px_30px_rgba(16,90,50,0.35)] transition-all hover:bg-[#178a48] sm:pr-5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <Icon name="whatsapp" className="h-6 w-6" />
      </span>
      <span className="hidden text-[0.95rem] font-semibold sm:inline">¿Necesitas ayuda?</span>
    </a>
  );
}
