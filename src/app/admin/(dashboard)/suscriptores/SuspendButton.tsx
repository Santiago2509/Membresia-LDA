'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SuspendButton({ 
  membershipId, 
  currentStatus 
}: { 
  membershipId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isActive = currentStatus === 'active';

  const handleToggle = async () => {
    const actionText = isActive ? 'suspender' : 'reactivar';
    const confirmMessage = isActive
      ? '¿Estás seguro de que quieres suspender el acceso a este paciente?'
      : '¿Deseas reactivar el acceso para este paciente? Podrá acceder a todo el contenido premium inmediatamente.';

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/toggle-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          membershipId, 
          newStatus: isActive ? 'canceled' : 'active' 
        }),
      });

      if (res.ok) {
        router.refresh(); // Refrescar datos en el servidor
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error al ${actionText}: ${errorData.error || 'Intenta de nuevo.'}`);
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (isActive) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        title="Suspender acceso a la plataforma"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-error/40 text-error font-label-xs font-bold hover:bg-error/10 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[14px]">block</span>
        {loading ? 'Procesando...' : 'Suspender acceso'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title="Reactivar acceso a la plataforma"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/50 text-secondary bg-secondary/5 font-label-xs font-bold hover:bg-secondary/15 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[14px]">check_circle</span>
      {loading ? 'Procesando...' : 'Reactivar acceso'}
    </button>
  );
}
