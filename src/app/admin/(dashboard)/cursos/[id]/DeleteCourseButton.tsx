'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Borra el curso. Sus lecciones no se borran: quedan como contenido suelto en el catálogo. */
export default function DeleteCourseButton({ courseId, lessonCount }: { courseId: string; lessonCount: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm(
      lessonCount > 0
        ? `¿Borrar este curso? Sus ${lessonCount} lecciones NO se borran: quedarán como contenido suelto en el catálogo.`
        : '¿Borrar este curso?'
    );
    if (!ok) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/cursos');
      router.refresh();
    } else {
      setDeleting(false);
      const data = await res.json().catch(() => ({}));
      window.alert(data.error || 'No se pudo borrar el curso.');
    }
  };

  return (
    <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-full border border-red-300 text-red-700 text-sm font-bold hover:bg-red-50 disabled:opacity-50">
      {deleting ? 'Borrando…' : 'Borrar curso'}
    </button>
  );
}
