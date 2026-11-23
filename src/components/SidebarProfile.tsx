'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Icon } from './ui/Icon';
import SignOutButton from '@/components/SignOutButton';

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
    <div className="space-y-3 border-t border-ink/10 px-4 pt-5">
      {user ? (
        <>
          <Link
            href="/aula/perfil"
            className="flex items-center gap-3 rounded-2xl bg-paper p-3 transition-colors hover:bg-ink/5"
            title="Ver mi perfil y suscripción"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
              {initials}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-base font-semibold text-ink">{displayName}</span>
              <span className="flex items-center gap-1.5 text-sm text-body">
                <span className={`h-2 w-2 rounded-full ${isSubscriber ? 'bg-calm' : 'bg-ink/30'}`} />
                {isSubscriber ? 'Membresía activa' : 'Sin membresía activa'}
              </span>
            </span>
          </Link>

          <SignOutButton
            type="member"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink/10 text-base font-semibold text-ink transition-colors hover:border-red-300 hover:text-red-700"
          >
            <Icon name="logout" className="h-5 w-5" />
            Cerrar sesión
          </SignOutButton>
        </>
      ) : (
        <Link
          href="/login"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-white transition-colors hover:bg-brand"
        >
          <Icon name="user" className="h-5 w-5" />
          Iniciar sesión
        </Link>
      )}
    </div>
  );
}
