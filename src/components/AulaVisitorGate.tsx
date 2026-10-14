'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function AulaVisitorGate({ children }: { children: React.ReactNode }) {
  const [hasClientSession, setHasClientSession] = useState(false);

  useEffect(() => {
    let isMounted = true;
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data }: { data: any }) => {
        if (!isMounted) return;
        if (data?.session?.user) {
          setHasClientSession(true);
          // Recargar para que las cookies sincronizadas viajen al servidor
          window.location.reload();
        }
      });
    } catch (e) {
      console.error('Error al verificar sesión en AulaVisitorGate:', e);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasClientSession) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-semibold text-neutral-600">
          Cargando tu aula virtual...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
