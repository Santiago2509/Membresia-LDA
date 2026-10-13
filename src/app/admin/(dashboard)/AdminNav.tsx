'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      group: 'General',
      items: [
        {
          href: '/admin',
          label: 'Dashboard',
          icon: 'space_dashboard',
          exact: true,
        },
        {
          href: '/admin/suscriptores',
          label: 'Suscriptores',
          icon: 'groups',
          exact: false,
        },
      ],
    },
    {
      group: 'Contenido',
      items: [
        {
          href: '/admin/contenido',
          label: 'Catálogo de Contenido',
          icon: 'library_books',
          exact: true,
        },
        {
          href: '/admin/contenido/nuevo',
          label: 'Crear Nuevo',
          icon: 'add_circle',
          exact: false,
        },
      ],
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top bar for Mobile */}
      <header className="md:hidden bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </div>
          <span className="font-headline-sm text-title-sm text-primary font-bold">
            Libre de Ansiedad
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-surface-container text-on-surface"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="w-72 bg-surface-container-lowest h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Link href="/" className="inline-flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  </div>
                  <span className="font-headline-sm text-title-sm text-primary font-bold">
                    Admin
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              <div className="space-y-6">
                {links.map((section) => (
                  <div key={section.group}>
                    <span className="px-3 text-label-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-2 block">
                      {section.group}
                    </span>
                    <nav className="space-y-1">
                      {section.items.map((item) => {
                        const active = isLinkActive(item.href, item.exact);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-label-md text-label-md transition-all ${
                              active
                                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30">
              <p className="text-label-xs text-on-surface-variant font-bold truncate">{adminEmail}</p>
              <Link
                href="/api/auth/signout"
                className="mt-3 flex items-center gap-2 px-3 py-2 text-error font-label-md font-bold hover:bg-error/10 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Cerrar sesión</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 flex-col justify-between hidden md:flex shrink-0 pt-8 pb-4 h-screen sticky top-0 shadow-[4px_0_24px_rgba(19,42,74,0.02)]">
        <div className="px-6 pb-8">
          <Link href="/" className="inline-flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-on-primary text-[18px]">admin_panel_settings</span>
            </div>
            <span className="font-headline-sm text-title-md text-primary tracking-tight font-bold">
              Libre de Ansiedad
            </span>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-6 overflow-y-auto">
          {links.map((section) => (
            <div key={section.group}>
              <span className="px-4 text-label-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-2 block">
                {section.group}
              </span>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isLinkActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all ${
                        active
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="px-4 pt-6 border-t border-outline-variant/30 mt-4">
          <div className="px-4 py-2 mb-2">
            <p className="text-label-xs text-on-surface-variant font-bold truncate">{adminEmail}</p>
            <p className="text-label-xs text-secondary font-bold uppercase tracking-wider">Administrador</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-error font-label-md text-label-md transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:text-error transition-colors">logout</span>
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
