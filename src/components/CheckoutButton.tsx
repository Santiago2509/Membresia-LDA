import Link from 'next/link';
import { EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';

interface CheckoutButtonProps {
  /** 'dark' para fondos claros (por defecto), 'light' para fondos oscuros. */
  tone?: 'dark' | 'light';
  label?: string;
}

export function CheckoutButton({ tone = 'dark', label }: CheckoutButtonProps) {
  const toneClasses =
    tone === 'light'
      ? 'bg-white text-[#001531] hover:bg-[#f3efe6]'
      : 'bg-[#001531] text-white hover:bg-[#133a73]';

  return (
    <Link
      href={EPAYCO_PLAN_URL}
      className={`group inline-flex h-13 items-center justify-center gap-3 rounded-full px-7 text-[15px] font-semibold transition-colors duration-200 w-full sm:w-auto ${toneClasses}`}
    >
      <span>{label || `Comenzar por ${MEMBERSHIP_PRICE_LABEL} al mes`}</span>
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
    </Link>
  );
}
