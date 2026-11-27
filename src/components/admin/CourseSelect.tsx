'use client';

import { useEffect, useState } from 'react';

interface CourseOption {
  id: string;
  title: string;
  lesson_count: number;
}

/**
 * Selector "¿A qué curso pertenece?" del formulario de lecciones.
 * "Ninguno" = contenido suelto, que aparece solo en el catálogo.
 */
export default function CourseSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [courses, setCourses] = useState<CourseOption[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/courses')
      .then((res) => (res.ok ? res.json() : { courses: [] }))
      .then((data) => {
        if (!cancelled) setCourses(data.courses || []);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-1.5 md:col-span-2">
      <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Curso</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={courses === null}
        className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
      >
        <option value="">Ninguno — contenido suelto (aparece solo en el catálogo)</option>
        {(courses || []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.title} ({c.lesson_count} {c.lesson_count === 1 ? 'lección' : 'lecciones'})
          </option>
        ))}
      </select>
      {value ? (
        <p className="text-xs text-neutral-600">
          Se agrega al <strong>final del curso</strong> (puedes cambiar el orden desde la página del curso) y es{' '}
          <strong>solo para miembros</strong>.
        </p>
      ) : courses && courses.length === 0 ? (
        <p className="text-xs text-neutral-500">Aún no hay cursos. Créalos en el menú Cursos.</p>
      ) : null}
    </div>
  );
}
