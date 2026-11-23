'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './ui/Icon';

const LINKS: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: '/aula', label: 'Inicio del aula', icon: 'home', exact: true },
  { href: '/catalogo', label: 'Todo el contenido', icon: 'grid' },
  { href: '/aula/perfil', label: 'Mi perfil', icon: 'user' },
  { href: '/contacto', label: 'Ayuda', icon: 'chat' },
];

export function AulaNavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={
              compact
                ? `inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-base font-semibold ${
                    active ? 'bg-ink text-white' : 'bg-paper text-ink'
                  }`
                : `flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[1.05rem] font-semibold transition-colors ${
                    active ? 'bg-ink text-white' : 'text-ink hover:bg-ink/5'
                  }`
            }
          >
            <Icon name={link.icon} className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
