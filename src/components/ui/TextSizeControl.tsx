'use client';

import { useSyncExternalStore } from 'react';

const SIZES = [
  { value: '100%', label: 'A', aria: 'Letra normal', cls: 'text-sm', px: 'text-[14px]' },
  { value: '112.5%', label: 'A', aria: 'Letra grande', cls: 'text-base', px: 'text-[16px]' },
  { value: '125%', label: 'A', aria: 'Letra muy grande', cls: 'text-lg', px: 'text-[19px]' },
];

/** Botones A / A+ / A++ para agrandar toda la letra del sitio. Se recuerda en este navegador. */
const EVENT = 'lda-font-scale-change';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getSnapshot() {
  return document.documentElement.style.getPropertyValue('--lda-font-scale') || '100%';
}

export function TextSizeControl({ className = '', fixedSize = false }: { className?: string; fixedSize?: boolean }) {
  // Lee el tamaño aplicado en <html> (lo pone el script de layout.tsx al cargar)
  const current = useSyncExternalStore(subscribe, getSnapshot, () => '100%');

  const apply = (value: string) => {
    document.documentElement.style.setProperty('--lda-font-scale', value);
    try {
      localStorage.setItem('lda-font-scale', value);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <div
      role="group"
      aria-label="Tamaño de letra"
      className={`flex items-center rounded-full border border-ink/15 bg-white p-1 ${className}`}
    >
      {SIZES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => apply(s.value)}
          aria-label={s.aria}
          aria-pressed={current === s.value}
          title={s.aria}
          className={`flex cursor-pointer items-center justify-center rounded-full font-display font-semibold leading-none transition-colors ${fixedSize ? `h-[36px] w-[36px] ${s.px}` : `h-9 w-9 ${s.cls}`} ${
            current === s.value ? 'bg-ink text-white' : 'text-ink hover:bg-ink/5'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
