'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './ui/Icon';
import type { Testimonial } from '@/lib/testimonials';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/** Testimonios destacados, uno a la vez, con botones grandes de anterior / siguiente (sin avance automático). */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const current = items[index];
  const go = (delta: number) => setIndex((i) => (i + delta + items.length) % items.length);

  if (!current) return null;

  return (
    <div className="rounded-[2.5rem] bg-white p-7 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-12 lg:p-16" aria-roledescription="carrusel">
      <div key={current.id} className="animate-fade-up" aria-live="polite">
        <Icon name="quote" className="h-12 w-12 text-sun" />
        <blockquote className="mt-6 font-display text-[1.7rem] leading-snug text-ink sm:text-4xl">
          “{current.highlight ?? current.text.slice(0, 180) + '…'}”
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">
            {initials(current.name)}
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">{current.name}</p>
            <p className="text-base text-body">
              {current.context}
              {current.place ? ` · ${current.place}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Testimonio anterior"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-ink/15 text-ink transition-colors hover:border-ink"
          >
            <Icon name="arrow-right" className="h-6 w-6 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente testimonio"
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-brand"
          >
            <Icon name="arrow-right" className="h-6 w-6" />
          </button>
          <span className="ml-2 text-base text-body" aria-hidden="true">
            {index + 1} de {items.length}
          </span>
        </div>
        <Link
          href={`/testimonios#${current.id}`}
          className="inline-flex items-center gap-2 text-lg font-semibold text-ink underline underline-offset-4"
        >
          Leer su historia completa
          <Icon name="arrow-right" className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
