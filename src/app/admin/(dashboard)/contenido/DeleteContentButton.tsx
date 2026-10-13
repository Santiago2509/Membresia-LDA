'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteContentButton({ 
  contentId, 
  contentTitle 
}: { 
  contentId: string; 
  contentTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${contentTitle}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error al eliminar: ${errorData.error || 'Intenta de nuevo.'}`);
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Eliminar contenido"
      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[20px]">
        {loading ? 'progress_activity' : 'delete'}
      </span>
    </button>
  );
}
