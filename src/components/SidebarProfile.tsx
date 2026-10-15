'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface SidebarProfileProps {
  initialUser: any;
  initialDisplayName: string;
  initialInitials: string;
  initialIsSubscriber: boolean;
}

export default function SidebarProfile({
  initialUser,
  initialDisplayName,
  initialInitials,
  initialIsSubscriber,
}: SidebarProfileProps) {
  const [user, setUser] = useState(initialUser);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [initials, setInitials] = useState(initialInitials);
  const [isSubscriber, setIsSubscriber] = useState(initialIsSubscriber);

  const fetchProfileAndMembership = async (activeUser: any) => {
    if (!activeUser) {
      setUser(null);
      return;
    }
    setUser(activeUser);

    const supabase = createSupabaseBrowserClient();

    // Consultar nombre del perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', activeUser.id)
      .maybeSingle();

    if (profile?.full_name) {
      setDisplayName(profile.full_name);
      const parts = profile.full_name.trim().split(' ');
      setInitials(parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase());
    } else if (activeUser.email) {
      const name = activeUser.email.split('@')[0];
      setDisplayName(name);
      setInitials(name.slice(0, 2).toUpperCase());
    }

    // Consultar membresía
    if (profile?.role === 'admin') {
      setIsSubscriber(true);
    } else {
      const { data: membership } = await supabase
        .from('memberships')
        .select('status, current_period_end')
        .eq('user_id', activeUser.id)
        .maybeSingle();

      const isActive = membership?.status === 'active';
      const isExpired = membership?.current_period_end
        ? new Date(membership.current_period_end) < new Date()
        : false;

      setIsSubscriber(isActive && !isExpired);
    }
  };

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // 1. Obtener sesión inmediata
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      if (data?.session?.user) {
        fetchProfileAndMembership(data.session.user);
      }
    });

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        fetchProfileAndMembership(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="px-4 pt-4 border-t border-black/5 space-y-2">
      {user ? (
        <>
          <div className="bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-2xl p-3 flex items-center justify-between border border-black/5 shadow-inner">
            <Link 
              href="/aula/perfil" 
              className="flex items-center gap-3 overflow-hidden flex-1 group"
              title="Ver mi perfil y suscripción"
            >
              <div className="w-9 h-9 rounded-full bg-[#133a73] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-neutral-900 truncate group-hover:text-[#133a73] transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSubscriber ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  {isSubscriber ? 'Membresía Activa' : 'Cuenta Gratuita'}
                </span>
              </div>
            </Link>

            <Link 
              href="/api/auth/signout?type=member" 
              title="Cerrar sesión"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 ml-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </Link>
          </div>

          <Link
            href="/aula/perfil"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white border border-black/8 text-[11px] font-bold text-neutral-700 hover:text-[#133a73] hover:border-[#133a73]/30 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">badge</span>
            <span>Mi Perfil & Vencimiento</span>
          </Link>
        </>
      ) : (
        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#001531] text-white text-xs font-bold shadow-sm hover:bg-[#133a73] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">login</span>
          <span>Iniciar Sesión</span>
        </Link>
      )}
    </div>
  );
}
