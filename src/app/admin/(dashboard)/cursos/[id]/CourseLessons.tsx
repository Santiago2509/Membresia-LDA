'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  type?: string | null;
  thumbnail_url?: string | null;
}

const TYPE_LABEL: Record<string, string> = {
  video: 'Video',
  pdf: 'Guía PDF',
  audio: 'Audio',
  article: 'Artículo',
  tool: 'Herramienta',
};

/** Lista de lecciones del curso con flechas para cambiar el orden. */
export default function CourseLessons({ courseId, initialLessons }: { courseId: string; initialLessons: Lesson[] }) {
  const [lessons, setLessons] = useState(initialLessons);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= lessons.length) return;
    const next = [...lessons];
    [next[index], next[target]] = [next[target], next[index]];
    setLessons(next);
    setDirty(true);
    setMessage(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/courses/${courseId}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonIds: lessons.map((l) => l.id) }),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      setMessage('Orden guardado.');
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'No se pudo guardar el orden.');
    }
  };

  if (lessons.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-black/10 text-neutral-600 text-sm">
        Este curso aún no tiene lecciones. Usa &quot;Agregar lección&quot; para subir el primer video o PDF.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ol className="bg-white rounded-3xl border border-black/10 divide-y divide-black/5 overflow-hidden">
        {lessons.map((lesson, index) => (
          <li key={lesson.id} className="flex items-center gap-3 p-3 sm:p-4">
            <span className="w-7 text-center font-bold text-neutral-500">{index + 1}</span>
            <div className="w-20 aspect-video rounded-lg bg-neutral-100 overflow-hidden shrink-0">
              {lesson.thumbnail_url && <img src={lesson.thumbnail_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-neutral-900 truncate">{lesson.title}</p>
              <p className="text-xs text-neutral-500">{TYPE_LABEL[(lesson.type || '').toLowerCase()] || lesson.type}</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir" className="w-9 h-9 rounded-full border border-black/10 disabled:opacity-30 hover:bg-neutral-100">
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === lessons.length - 1} aria-label="Bajar" className="w-9 h-9 rounded-full border border-black/10 disabled:opacity-30 hover:bg-neutral-100">
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </button>
              <Link href={`/admin/contenido/editar/${lesson.id}`} aria-label="Editar" className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-neutral-100">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-end gap-3">
        {message && <span className="text-sm text-neutral-700">{message}</span>}
        {dirty && (
          <button type="button" onClick={saveOrder} disabled={saving} className="px-6 py-2.5 bg-[#133a73] text-white rounded-full font-bold text-sm disabled:opacity-50">
            {saving ? 'Guardando…' : 'Guardar orden'}
          </button>
        )}
      </div>
    </div>
  );
}
