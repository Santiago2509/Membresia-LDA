'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import SignOutButton from '@/components/SignOutButton';
import { EPAYCO_PLAN_URL } from '@/lib/membership';
import { Icon, type IconName } from './ui/Icon';
import { TextSizeControl } from './ui/TextSizeControl';

const NAV: { href: string; label: string; icon: IconName; match: (p: string) => boolean; mobileOnly?: boolean }[] = [
  { href: '/', label: 'Inicio', icon: 'home', match: (p) => p === '/' },
  { href: '/catalogo', label: 'Catálogo', icon: 'grid', match: (p) => p.startsWith('/catalogo') },
  { href: '/testimonios', label: 'Testimonios', icon: 'quote', match: (p) => p.startsWith('/testimonios') },
  { href: '/equipo', label: 'Equipo', icon: 'users', match: (p) => p.startsWith('/equipo') },
  { href: '/contacto', label: 'Contacto', icon: 'chat', match: (p) => p.startsWith('/contacto') },
  { href: '/aula', label: 'Mi Aula', icon: 'school', match: (p) => p.startsWith('/aula') && !p.startsWith('/aula/perfil'), mobileOnly: true },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [homeRevealed, setHomeRevealed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);
  // El menú queda abierto solo en la página donde se abrió: al navegar se cierra solo
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
  const visible = !isHome || homeRevealed;

  // Sesión activa
  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }: { data: { user: { email?: string } | null } }) => {
        setCurrentUser(data?.user ?? null);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: string, session: { user?: { email?: string } } | null) => setCurrentUser(session?.user ?? null)
      );
      return () => subscription.unsubscribe();
    } catch (e) {
      console.error('Error al inicializar sesión en Header:', e);
    }
  }, []);

  // En el inicio, el menú aparece cuando avanza la animación del logo o al bajar
  useEffect(() => {
    if (!isHome) return;
    const show = () => setHomeRevealed(true);
    const timer = setTimeout(show, 3200);
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      if (window.scrollY > 40) setHomeRevealed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('lda_show_header', show);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('lda_show_header', show);
    };
  }, [isHome]);

  // Bloquear el scroll de la página mientras el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  if (pathname.startsWith('/admin')) return null;

  const solid = !isHome || isScrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'border-b border-ink/10 bg-paper/95 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      } ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Libre de Ansiedad, ir al inicio">
          <img src="/logo-mark.png" alt="" className="h-[40px] w-auto" />
          <span className="hidden font-display text-[20px] leading-none whitespace-nowrap text-ink sm:block">
            Libre de Ansiedad
          </span>
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-1 xl:flex">
          {NAV.filter((item) => !item.mobileOnly).map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-full px-[16px] py-[8px] text-[17px] whitespace-nowrap font-semibold transition-colors ${
                  active ? 'bg-ink text-white' : 'text-ink hover:bg-ink/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-3">
          <TextSizeControl className="hidden xl:flex" fixedSize />

          <Link
            href={currentUser ? '/aula' : '/login'}
            aria-current={currentUser && pathname.startsWith('/aula') ? 'page' : undefined}
            className={`hidden h-[44px] items-center gap-2 rounded-full px-[16px] text-[17px] whitespace-nowrap font-semibold transition-colors md:inline-flex ${
              currentUser && pathname.startsWith('/aula') ? 'bg-ink text-white' : 'text-ink hover:bg-ink/5'
            }`}
          >
            <Icon name={currentUser ? 'school' : 'user'} className="h-[20px] w-[20px]" />
            {currentUser ? 'Mi Aula' : 'Ingresar'}
          </Link>

          {!currentUser && (
            <Link
              href={EPAYCO_PLAN_URL}
              className="hidden h-[44px] items-center gap-2 rounded-full bg-ink px-[20px] text-[17px] whitespace-nowrap font-semibold text-white transition-colors hover:bg-brand sm:inline-flex"
            >
              Suscribirme
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            className="inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-[17px] whitespace-nowrap font-semibold text-ink xl:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-[20px] w-[20px]" />
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>

      {/* Menú móvil a pantalla completa, con botones grandes */}
      {menuOpen && (
        <div id="menu-movil" className="h-[calc(100dvh-76px)] overflow-y-auto border-t border-ink/10 bg-paper px-4 pb-10 pt-6 sm:px-6 xl:hidden">
          <nav aria-label="Menú" className="grid gap-2">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-xl font-semibold ${
                    active ? 'bg-ink text-white' : 'bg-white text-ink'
                  }`}
                >
                  <Icon name={item.icon} className="h-6 w-6" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={currentUser ? '/aula/perfil' : '/login'}
              className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 text-xl font-semibold text-ink"
            >
              <Icon name="user" className="h-6 w-6" />
              {currentUser ? 'Mi perfil y suscripción' : 'Ingresar a mi cuenta'}
            </Link>
          </nav>

          <div className="mt-8 rounded-2xl bg-white p-5">
            <p className="text-base font-semibold text-ink">Tamaño de letra</p>
            <p className="mt-1 text-sm text-body">Agranda el texto si te cuesta leer.</p>
            <TextSizeControl className="mt-4 w-fit" />
          </div>

          <div className="mt-8 grid gap-3">
            {currentUser ? (
              <SignOutButton
                type="member"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 text-lg font-semibold text-red-700"
              >
                Cerrar sesión
              </SignOutButton>
            ) : (
              <Link
                href={EPAYCO_PLAN_URL}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-lg font-semibold text-white"
              >
                Suscribirme a la membresía
                <Icon name="arrow-right" className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
