'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showButtons, setShowButtons] = useState(!isHome);

  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  useEffect(() => {
    if (!isHome) {
      setShowButtons(true);
      return;
    }

    // Inicialmente oculto en el home para dejar la primera mitad de la animación completamente limpia
    setShowButtons(false);

    // Aparecer cuando la animación vaya más allá de la mitad (~3.2 segundos)
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
  const isContacto = pathname.startsWith('/contacto');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out transform ${
        isGlassActive 
          ? 'bg-[#e6e6e6]/70 backdrop-blur-2xl border-b border-black/10 shadow-[0_8px_32px_0_rgba(19,42,74,0.08)] opacity-100 translate-y-0 pointer-events-auto' 
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
        
        {/* Logo Icon Only (sin texto a petición) */}
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

        {/* Botones de navegación central con estado activo dinámico */}
        <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-full bg-black/5 backdrop-blur-md border border-black/5">
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
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <Link 
            href="/login" 
            className={`font-label-md text-sm font-semibold transition-colors px-3 py-1.5 rounded-full hover:bg-black/5 hidden sm:inline-block ${
              pathname === '/login' ? 'text-primary font-bold' : 'text-neutral-800 hover:text-primary'
            }`}
          >
            Iniciar sesión
          </Link>
          
          {/* Botón directo al plan de suscripción de ePayco */}
          <Link 
            href={epaycoPlanUrl}
            className="h-10 sm:h-11 px-4 sm:px-6 rounded-full bg-primary text-on-primary font-label-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md hover:-translate-y-0.5"
          >
            <span>Obtener Membresía</span>
            <span className="material-symbols-outlined text-[16px]">credit_card</span>
          </Link>

          <Link 
            href="/login" 
            className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors flex items-center justify-center shrink-0 border border-primary/20"
            aria-label="Perfil"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
