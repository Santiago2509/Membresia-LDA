'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SuspendButton({ membershipId }: { membershipId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSuspend = async () => {
    if (!confirm('¿Estás seguro de que quieres suspender el acceso de este paciente? Podrás reactivarlo manualmente desde Supabase o ePayco.')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/suspend-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh(); // recargar la tabla
      } else {
        alert('Error al suspender. Intenta de nuevo.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return <span className="font-label-xs text-on-surface-variant">Suspendido ✓</span>;
  }

  return (
    <button
      onClick={handleSuspend}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-error/40 text-error font-label-xs font-bold hover:bg-error/10 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[14px]">block</span>
      {loading ? 'Suspendiendo...' : 'Suspender acceso'}
    </button>
  );
}
