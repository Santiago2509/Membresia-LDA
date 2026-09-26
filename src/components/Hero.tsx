import Link from 'next/link';
import { CheckoutButton } from './CheckoutButton';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background py-space-xl lg:py-24">
      {/* Ambient organic light gradients (contained) */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-secondary-fixed/40 blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/2 -right-20 h-[480px] w-[480px] rounded-full bg-surface-container-highest/60 blur-3xl"></div>
      
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          
          {/* Left column: Editorial Typography & Intentional CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
            {/* Serene Pill Badge */}
            <div className="inline-flex items-center gap-space-xs rounded-full bg-secondary-fixed/50 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant tracking-wide uppercase">
                Bienestar • Aprendizaje • Salud mental
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary tracking-tight font-bold">
              Un espacio para aprender, comprender y cuidar tu bienestar
            </h1>
            
            {/* Body Description */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Accede a cursos, recursos y contenido creado por profesionales de la clínica para acompañarte en tu proceso con rigor científico y calidez humana.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <CheckoutButton />
              <Link href="#cursos-destacados" className="h-12 px-space-lg rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md flex items-center justify-center shadow-sm hover:bg-surface-container-low transition-all duration-200 hover:-translate-y-0.5">
                <span>Ver catálogo</span>
              </Link>
            </div>
            
            {/* Trust Bar */}
            <div className="flex items-center gap-3 pt-space-md mt-space-xs">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-xs shadow-sm">SM</div>
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container font-bold text-xs shadow-sm">CL</div>
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                </div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">+1,800 pacientes y miembros activos</span> • 100% impartido por psicólogos clínicos colegiados
              </p>
            </div>
          </div>
          
          {/* Right column: Photographic Layering with Glassmorphism Overlays */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[500px]">
              {/* Main Editorial Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-surface-container-high aspect-[1.34]">
                <img 
                  alt="Persona en calma en ambiente sereno y luminoso Libre de Ansiedad" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9i1BUBw042PenpdONkuNHhtxUCazH4tKFDYD0m21UTitgcYCtQS_WooMAvDsqqa3YEWdV0Qb1xNJ0o9weSgSm38JgDCq8JQrkmiWQDSnofWo2AwsI2eJMMGixmjl_A0IibnzbbjkI-VL3R_E4GTSn1USlXzDNoGf3x_L9d7xniqN-6gOCU1gaX5ajz40c0plk03E-Efy-b5X8yUHZnlif7aF8gSKsGYGh1shUUVbi_3Jby41Dryyv"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Glass Chip Top Right */}
              <div className="absolute -top-4 -right-3 sm:-right-6 rounded-full bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2.5 shadow-lg flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">✨ Cursos exclusivos</span>
                <span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-label-xs text-label-xs text-on-secondary-fixed">Nuevo</span>
              </div>
              
              {/* Floating Glass Card Center Left */}
              <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3.5 shadow-xl flex items-center gap-3 max-w-[230px]">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[22px]">stethoscope</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">Contenido clínico</span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <span className="font-label-xs text-label-xs text-on-surface-variant truncate">Validación científica</span>
                </div>
              </div>
              
              {/* Floating Glass Pill Bottom Center */}
              <div className="absolute -bottom-5 right-6 rounded-full bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">📚 Nuevos recursos semanales</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
