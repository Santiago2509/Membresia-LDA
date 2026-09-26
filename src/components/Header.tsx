import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_1px_8px_rgba(19,42,74,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-space-md">
        
        <div className="flex items-center gap-space-sm">
          <Link href="/" className="flex items-center gap-space-sm focus:outline-none">
            <img 
              alt="Libre de Ansiedad Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WAjJ6_ECtFRxRaJ3lFJHnhgHTcK6LdiwldYzEYFmFbRaEM-HBp7ScP1MWd_lH-53059TFnGXNoPFV6z3HftDSG0zgCu-L2jUgb5q8VrTs3nKJIPf5HKYRdzowO7y8BJqJBYlPmXMM3oyZ5YlWf6lEUozR-tZWK5cYZbfzj3Lf9uMu0R2dOFLFGlCUVhs9KS827jD_Lv8o9Htt6N87_pSZUomwZe1E6kGFXBOdEkRCah3oc6n97XRpvQZM"
            />
            <span className="font-title-md text-title-md text-primary tracking-tight font-bold hidden sm:inline-block">
              Libre de Ansiedad
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-space-lg">
          <Link href="/" className="transition-colors bg-primary-container text-on-primary font-label-md rounded-full px-space-md py-1.5" aria-current="page">
            Inicio
          </Link>
          <Link href="/catalogo" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
            Catálogo
          </Link>
          <Link href="/contacto" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-space-md">
          <Link href="/login" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors hidden sm:inline-block">
            Iniciar sesión
          </Link>
          <Link href="#membresia-exclusiva" className="h-11 px-space-lg rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center hover:bg-primary transition-all shadow-[0_4px_14px_rgba(19,42,74,0.2)] hover:-translate-y-0.5">
            Obtener Membresía
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
