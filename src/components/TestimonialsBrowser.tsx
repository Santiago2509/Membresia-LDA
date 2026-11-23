'use client';

import { useState } from 'react';
import { Icon } from './ui/Icon';
import type { Testimonial } from '@/lib/testimonials';

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'individual', label: 'Terapia individual' },
  { key: 'grupal', label: 'Curso grupal' },
] as const;

const COLORS = ['#133a73', '#12a04a', '#d6006f', '#2b93d1', '#b9771f', '#b0106a'];

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function TestimonialCard({ t, color }: { t: Testimonial; color: string }) {
  const [open, setOpen] = useState(false);
  const long = t.text.length > 360;

  return (
    <article id={t.id} className="scroll-mt-28 break-inside-avoid rounded-[1.75rem] bg-white p-7 shadow-[0_10px_40px_rgba(11,31,58,0.06)] sm:p-8">
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <div>
          <h3 className="text-xl font-semibold text-ink">{t.name}</h3>
          <p className="text-base text-body">
            {t.context}
            {t.place ? ` · ${t.place}` : ''}
          </p>
        </div>
      </div>

      <p className={`mt-6 whitespace-pre-line text-lg leading-relaxed text-body ${!open && long ? 'line-clamp-6' : ''}`}>
        “{t.text}”
      </p>

      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-brand underline underline-offset-4"
        >
          <Icon name={open ? 'minus' : 'plus'} className="h-4 w-4" />
          {open ? 'Mostrar menos' : 'Leer testimonio completo'}
        </button>
      )}
    </article>
  );
}

export function TestimonialsBrowser({ items }: { items: Testimonial[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const visible = filter === 'all' ? items : items.filter((t) => t.kind === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtrar testimonios">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? items.length : items.filter((t) => t.kind === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-5 text-base font-semibold transition-colors ${
                filter === f.key ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white text-ink hover:border-ink/40'
              }`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-sm ${filter === f.key ? 'bg-white/20' : 'bg-ink/5'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 gap-6 space-y-6 md:columns-2 xl:columns-3">
        {visible.map((t, i) => (
          <TestimonialCard key={t.id} t={t} color={COLORS[i % COLORS.length]} />
        ))}
      </div>
    </div>
  );
}
