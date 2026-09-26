import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-primary-container text-on-primary mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl border-b border-outline/20">
          
          <div className="lg:col-span-2 space-y-space-md pr-space-md">
            <div className="flex items-center gap-space-sm">
              <img 
                alt="Libre de Ansiedad Logo" 
                className="h-8 w-auto object-contain brightness-0 invert" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1WAjJ6_ECtFRxRaJ3lFJHnhgHTcK6LdiwldYzEYFmFbRaEM-HBp7ScP1MWd_lH-53059TFnGXNoPFV6z3HftDSG0zgCu-L2jUgb5q8VrTs3nKJIPf5HKYRdzowO7y8BJqJBYlPmXMM3oyZ5YlWf6lEUozR-tZWK5cYZbfzj3Lf9uMu0R2dOFLFGlCUVhs9KS827jD_Lv8o9Htt6N87_pSZUomwZe1E6kGFXBOdEkRCah3oc6n97XRpvQZM"
              />
              <span className="font-title-md text-title-md text-on-primary tracking-tight font-bold">
                Libre de Ansiedad
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-container max-w-sm">
              Un espacio para aprender y cuidar tu bienestar emocional y mental con rigor científico y calidez humana.
            </p>
            <div className="flex items-center gap-space-md pt-space-xs">
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container-highest/10 flex items-center justify-center text-on-primary hover:bg-surface-container-highest/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container-highest/10 flex items-center justify-center text-on-primary hover:bg-surface-container-highest/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">podcasts</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container-highest/10 flex items-center justify-center text-on-primary hover:bg-surface-container-highest/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>

          <div className="space-y-space-sm">
            <h3 className="font-label-md text-label-md text-on-primary uppercase tracking-wider font-semibold">Plataforma</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-primary-container">
              <li><Link href="/" className="hover:text-on-primary transition-colors">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-on-primary transition-colors">Catálogo Completo</Link></li>
              <li><Link href="/catalogo" className="hover:text-on-primary transition-colors">Recursos</Link></li>
            </ul>
          </div>

          <div className="space-y-space-sm">
            <h3 className="font-label-md text-label-md text-on-primary uppercase tracking-wider font-semibold">Clínica</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-primary-container">
              <li><Link href="/contacto" className="hover:text-on-primary transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-on-primary transition-colors">Contacto</Link></li>
              <li><Link href="#membresia-exclusiva" className="hover:text-on-primary transition-colors">Planes de membresía</Link></li>
            </ul>
          </div>

          <div className="space-y-space-sm">
            <h3 className="font-label-md text-label-md text-on-primary uppercase tracking-wider font-semibold">Legal</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-primary-container">
              <li><Link href="#" className="hover:text-on-primary transition-colors">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-on-primary transition-colors">Términos y condiciones</Link></li>
              <li><Link href="#" className="hover:text-on-primary transition-colors">Soporte clínico</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-primary-container font-label-sm text-label-sm">
          <p>© 2026 Libre de Ansiedad | Psicología &amp; Bienestar. Todos los derechos reservados.</p>
          <div className="flex items-center gap-space-lg">
            <Link href="#" className="hover:text-on-primary transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-on-primary transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
