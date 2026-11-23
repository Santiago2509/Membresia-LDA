'use client';

import { useState } from 'react';
import { Icon } from './ui/Icon';
import type { TeamMember } from '@/lib/team';

function MemberCard({ m }: { m: TeamMember }) {
  const [open, setOpen] = useState(false);

  return (
    <article id={m.id} className="flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(11,31,58,0.06)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#dfe7ee]">
        <img src={m.photo} alt={`Foto de ${m.name}`} className={`h-full w-full object-cover ${m.founder ? 'object-[70%_center]' : 'object-top'}`} />
        {m.founder && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink shadow">
            Fundador
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-3xl text-ink">{m.name}</h3>
        <p className="mt-1 text-base font-semibold text-calm">{m.role}</p>
        <p className="mt-4 text-lg leading-relaxed text-body">{m.summary}</p>

        {open && (
          <div className="mt-5 space-y-4 border-t border-ink/10 pt-5 animate-fade-up">
            {m.bio.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-body">{p}</p>
            ))}
            {m.helps && (
              <>
                <p className="text-base font-semibold text-ink">¿Cómo puede ayudarte?</p>
                <ul className="space-y-2">
                  {m.helps.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-lg text-body">
                      <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-calm" />
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink/15 text-base font-semibold text-ink transition-colors hover:border-ink"
        >
          <Icon name={open ? 'minus' : 'plus'} className="h-5 w-5" />
          {open ? 'Mostrar menos' : `Conocer a ${m.name.split(' ')[0]}`}
        </button>
      </div>
    </article>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <MemberCard key={m.id} m={m} />
      ))}
    </div>
  );
}
