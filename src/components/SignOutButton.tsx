'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface SignOutButtonProps {
  type?: 'member' | 'admin';
  className?: string;
  title?: string;
  children: React.ReactNode;
}

// IMPORTANTE: el cierre de sesión es un <button>, NO un <Link>.
// Next.js hace prefetch automático de los <Link> visibles en producción,
// lo que ejecutaba /api/auth/signout en segundo plano y cerraba la sesión
// del usuario sin que hiciera clic.
export default function SignOutButton({ type = 'member', className, title, children }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 1. Limpiar cookies de sesión en el servidor
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch {
      // continuar igualmente con el cierre en el cliente
    }
    try {
      // 2. Limpiar la sesión del navegador (solo este dispositivo)
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // ignorar
    }
    window.location.href = type === 'admin' ? '/admin/login' : '/login';
  };

  return (
    <button type="button" onClick={handleSignOut} disabled={loading} title={title} className={className}>
      {children}
    </button>
  );
}
