import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import SidebarProfile from '@/components/SidebarProfile';

export const dynamic = 'force-dynamic';

export default async function AulaLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
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

  let displayName = 'Miembro';
  let emailDisplay = '';
  let initials = 'MB';
  let isSubscriber = false;

  if (user) {
    emailDisplay = user.email || '';
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();

    if (profile?.full_name) {
      displayName = profile.full_name;
      const parts = profile.full_name.trim().split(' ');
      initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    } else if (user.email) {
      displayName = user.email.split('@')[0];
      initials = displayName.slice(0, 2).toUpperCase();
    }

    if (profile?.role === 'admin') {
      isSubscriber = true;
    } else {
      const { data: membership } = await supabaseAdmin
        .from('memberships')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();
      isSubscriber = membership?.status === 'active';
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#e6e6e6] font-body-md text-on-surface pt-20">
      
      {/* Sidebar - Navegación Limpia y Sin Enlaces Rotos */}
      <aside className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-black/8 flex flex-col justify-between hidden md:flex shrink-0 pt-6 pb-6 h-[calc(100vh-5rem)] sticky top-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="px-3 pb-3 mb-2 border-b border-black/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Navegación del Aula
            </span>
          </div>

          <Link 
            href="/aula" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#001531] text-white font-label-md text-xs font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
            <span>Mi Aula Virtual</span>
          </Link>

          <Link 
            href="/catalogo" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-700 hover:bg-neutral-100 font-label-md text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#133a73]">local_library</span>
            <span>Catálogo Completo</span>
          </Link>

          <Link 
            href="/contacto" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-700 hover:bg-neutral-100 font-label-md text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#12a04a]">support_agent</span>
            <span>Soporte & Contacto</span>
          </Link>

          <Link 
            href="/aula/perfil" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-700 hover:bg-neutral-100 font-label-md text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-600">badge</span>
            <span>Mi Perfil & Suscripción</span>
          </Link>

          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-700 hover:bg-neutral-100 font-label-md text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-neutral-500">home</span>
            <span>Volver a la Portada</span>
          </Link>
        </div>
        
        {/* Perfil Real del Usuario Logueado con recuperación automática de sesión */}
        <SidebarProfile 
          initialUser={user}
          initialDisplayName={displayName}
          initialInitials={initials}
          initialIsSubscriber={isSubscriber}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 p-4 sm:p-6 md:p-10 relative z-10 overflow-y-auto">
          {children}
        </main>
      </div>
      
    </div>
  );
}
