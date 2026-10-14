'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showButtons, setShowButtons] = useState(!isHome);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  useEffect(() => {
    // Detectar sesión activa en Supabase
    try {
      const supabase = createSupabaseBrowserClient();
      
      supabase.auth.getSession().then(({ data }: { data: any }) => {
        if (data?.session?.user) {
          setCurrentUser(data.session.user);
        }
      });

      supabase.auth.getUser().then(({ data }: { data: any }) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setCurrentUser(session?.user || null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.error('Error al inicializar sesión en Header:', e);
    }
  }, []);

  useEffect(() => {
    if (!isHome) {
      setShowButtons(true);
      return;
    }

    // Inicialmente oculto en el home para dejar la primera mitad de la animación limpia
    setShowButtons(false);

    // Aparecer cuando la animación avance (~3.2 segundos)
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 3200);

    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsScrolled(scrolled);
      if (window.scrollY > 40) {
        setShowButtons(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHome]);

  // Si no está en el home o ya hizo scroll, se activa el estilo tipo espejo glass
  const isGlassActive = !isHome || isScrolled;

  // Determinar pestaña activa
  const isInicio = pathname === '/';
  const isCatalogo = pathname.startsWith('/catalogo');
  const isAula = pathname.startsWith('/aula');
  const isContacto = pathname.startsWith('/contacto');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out transform ${
        isGlassActive 
          ? 'bg-[#e6e6e6]/80 backdrop-blur-2xl border-b border-black/10 shadow-[0_8px_32px_0_rgba(19,42,74,0.06)] opacity-100 translate-y-0 pointer-events-auto' 
          : 'bg-transparent border-b border-transparent shadow-none'
      } ${
        !isGlassActive
          ? showButtons 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
          : ''
      }`}
    >
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-space-md">
        
        {/* Logo Icon Only */}
        <div className="flex items-center gap-space-sm">
          <Link href="/" className="flex items-center gap-2 focus:outline-none group" aria-label="Inicio">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#133a73] via-[#12a04a] to-[#2b93d1] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#133a73] text-[22px]">
                  psychology
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Botones de navegación central (Inicio | Catálogo | Aula Virtual | Contacto) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-black/5 backdrop-blur-md border border-black/5">
          <Link 
            href="/" 
            className={`transition-all font-label-md text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 ${
              isInicio 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-neutral-800 hover:text-primary hover:bg-black/5'
            }`}
          >
            Inicio
          </Link>

          <Link 
            href="/catalogo" 
            className={`transition-all font-label-md text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 ${
              isCatalogo 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-neutral-800 hover:text-primary hover:bg-black/5'
            }`}
          >
            Catálogo
          </Link>

          <Link 
            href="/aula" 
            className={`transition-all font-label-md text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 flex items-center gap-1.5 ${
              isAula 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-neutral-800 hover:text-primary hover:bg-black/5'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Aula Virtual</span>
          </Link>

          <Link 
            href="/contacto" 
            className={`transition-all font-label-md text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 ${
              isContacto 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'text-neutral-800 hover:text-primary hover:bg-black/5'
            }`}
          >
            Contacto
          </Link>
        </nav>

        {/* Botones de acción derecha */}
        <div className="flex items-center gap-3">
          
          {currentUser ? (
            <Link 
              href="/aula" 
              className={`font-label-md text-xs sm:text-sm font-bold transition-colors px-3.5 py-1.5 rounded-full hover:bg-black/5 hidden sm:inline-flex items-center gap-1.5 ${
                isAula ? 'text-primary font-bold' : 'text-neutral-800 hover:text-primary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mi Aula</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className={`font-label-md text-sm font-semibold transition-colors px-3 py-1.5 rounded-full hover:bg-black/5 hidden sm:inline-block ${
                pathname === '/login' ? 'text-primary font-bold' : 'text-neutral-800 hover:text-primary'
              }`}
            >
              Iniciar sesión
            </Link>
          )}
          
          {/* Botón directo al plan de membresía */}
          <Link 
            href={epaycoPlanUrl}
            className="h-10 sm:h-11 px-4 sm:px-6 rounded-full bg-primary text-on-primary font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md hover:-translate-y-0.5"
          >
            <span>Obtener Membresía</span>
            <span className="material-symbols-outlined text-[16px]">credit_card</span>
          </Link>

          {/* Icono de Perfil */}
          <Link 
            href={currentUser ? "/aula" : "/login"} 
            className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors flex items-center justify-center shrink-0 border border-primary/20"
            aria-label="Perfil de usuario"
            title={currentUser ? "Ir a mi Aula Virtual" : "Iniciar sesión"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {currentUser ? 'account_circle' : 'person'}
            </span>
          </Link>

          {/* Menú móvil hamburguesa */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-neutral-800 hover:bg-black/5 focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Drawer Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/10 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm ${isInicio ? 'bg-primary text-white' : 'text-neutral-800 hover:bg-neutral-100'}`}
            >
              Inicio
            </Link>
            <Link 
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm ${isCatalogo ? 'bg-primary text-white' : 'text-neutral-800 hover:bg-neutral-100'}`}
            >
              Catálogo de Lecciones
            </Link>
            <Link 
              href="/aula"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${isAula ? 'bg-primary text-white' : 'text-neutral-800 hover:bg-neutral-100'}`}
            >
              <span>Aula Virtual (Miembros)</span>
              <span className="material-symbols-outlined text-[18px]">school</span>
            </Link>
            <Link 
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm ${isContacto ? 'bg-primary text-white' : 'text-neutral-800 hover:bg-neutral-100'}`}
            >
              Contacto
            </Link>
          </nav>

          <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
            {currentUser ? (
              <Link 
                href="/aula"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full bg-[#001531] text-white text-center font-bold text-sm"
              >
                Mi Aula Virtual
              </Link>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full bg-neutral-100 text-neutral-800 text-center font-bold text-sm hover:bg-neutral-200"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
