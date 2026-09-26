import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  // 1. Leer sesión del usuario desde las cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // 2. Verificar rol usando el cliente SSR (aprovechando que RLS permite ver el propio perfil)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/aula');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-container-low font-body-md text-on-surface">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-surface-container-lowest/80 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col justify-between hidden md:flex shrink-0 pt-8 pb-4 h-screen sticky top-0 shadow-[4px_0_24px_rgba(19,42,74,0.02)]">
        
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
           <div>
              <span className="px-4 text-label-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-2 block">General</span>
              <nav className="space-y-1">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                  <span>Dashboard</span>
                </Link>
                <Link href="/admin/suscriptores" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                  <span>Suscriptores</span>
                </Link>
              </nav>
           </div>

           <div>
              <span className="px-4 text-label-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-2 block">Contenido</span>
              <nav className="space-y-1">
                <Link href="/admin/contenido" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
                  <span className="material-symbols-outlined text-[20px]">library_books</span>
                  <span>Catálogo de Contenido</span>
                </Link>
                <Link href="/admin/contenido/nuevo" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-md text-label-md transition-all">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>Crear Nuevo</span>
                </Link>
              </nav>
           </div>
        </div>
        
        <div className="px-4 pt-6 border-t border-outline-variant/30 mt-4">
          <div className="px-4 py-2 mb-2">
            <p className="text-label-xs text-on-surface-variant font-bold truncate">{profile.email}</p>
            <p className="text-label-xs text-secondary font-bold uppercase tracking-wider">Administrador</p>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-error font-label-md text-label-md transition-all group">
            <span className="material-symbols-outlined text-[20px] group-hover:text-error transition-colors">logout</span>
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-surface-container to-transparent opacity-50 pointer-events-none"></div>
        <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
