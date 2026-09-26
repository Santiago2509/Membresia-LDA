import Link from 'next/link';

export default function AulaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-container-low font-body-md text-on-surface">
      
      {/* Sidebar - Premium Glass */}
      <aside className="w-full md:w-72 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col justify-between hidden md:flex shrink-0 pt-8 pb-4 h-screen sticky top-0 shadow-[4px_0_24px_rgba(19,42,74,0.02)]">
        
        <div className="px-6 pb-8">
           <Link href="/" className="inline-flex items-center gap-space-sm group">
             <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-secondary text-[18px]">self_improvement</span>
             </div>
             <span className="font-headline-sm text-title-md text-primary tracking-tight font-bold">
              Libre de Ansiedad
             </span>
          </Link>
        </div>
        
        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
            <Link href="/aula" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Mi Espacio</span>
            </Link>
            <Link href="/aula/cursos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
              <span className="material-symbols-outlined text-[20px]">school</span>
              <span>Mis Cursos</span>
            </Link>
            <Link href="/aula/biblioteca" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
              <span className="material-symbols-outlined text-[20px]">library_books</span>
              <span>Biblioteca</span>
            </Link>
            <Link href="/aula/progreso" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
              <span>Mi Progreso</span>
            </Link>
        </div>
        
        {/* Profile Snippet */}
        <div className="px-4 pt-4 mt-2">
           <div className="bg-surface-container/50 rounded-2xl p-4 flex items-center justify-between border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary p-[2px]">
                       <div className="w-full h-full bg-surface-container-lowest rounded-full border-2 border-surface-container-lowest overflow-hidden flex items-center justify-center text-secondary font-bold text-sm">
                          EL
                       </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-lowest"></div>
                 </div>
                 <div className="flex flex-col">
                    <span className="font-label-md text-on-surface font-bold truncate max-w-[100px]">Elena M.</span>
                    <span className="font-label-xs text-secondary font-semibold">Premium</span>
                 </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">more_vert</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-fixed/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto">
          {children}
        </main>
      </div>
      
    </div>
  );
}
