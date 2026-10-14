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

  useEffect(() => {
    if (initialUser) return;

    // Si el servidor no detectó usuario en cookies, sincronizar de inmediato con la sesión del cliente
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(async ({ data }: { data: any }) => {
      const activeUser = data?.session?.user;
      if (activeUser) {
        setUser(activeUser);

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
            .select('status')
            .eq('user_id', activeUser.id)
            .maybeSingle();
          setIsSubscriber(membership?.status === 'active');
        }
      }
    });
  }, [initialUser]);

  return (
    <div className="px-4 pt-4 border-t border-black/5">
      {user ? (
        <div className="bg-neutral-50 rounded-2xl p-3.5 flex items-center justify-between border border-black/5 shadow-inner">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#133a73] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-neutral-900 truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-neutral-500 truncate">
                {isSubscriber ? 'Membresía Activa' : 'Cuenta Gratuita'}
              </span>
            </div>
          </div>
          <Link 
            href="/api/auth/signout" 
            title="Cerrar sesión"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </Link>
        </div>
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
