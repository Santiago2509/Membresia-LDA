'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface CourseFormValues {
  title: string;
  description: string;
  category: string;
  cover_url: string;
}

/** Formulario de curso (crear o editar): nombre, descripción, tema y portada. */
export default function CourseForm({ courseId, initial }: { courseId?: string; initial?: Partial<CourseFormValues> }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      let finalCover = coverUrl.trim() || null;
      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) throw new Error(uploadData.error || 'No se pudo subir la portada.');
        finalCover = uploadData.publicUrl;
      }

      const res = await fetch(courseId ? `/api/admin/courses/${courseId}` : '/api/admin/courses', {
        method: courseId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, cover_url: finalCover }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar el curso.');

      if (courseId) {
        setCoverUrl(finalCover || '');
        setCoverFile(null);
        setMessage({ type: 'ok', text: 'Curso guardado.' });
        router.refresh();
      } else {
        router.push(`/admin/cursos/${data.course.id}`);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const preview = coverFile ? URL.createObjectURL(coverFile) : coverUrl;
  const input =
    'w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-3xl border border-black/10 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Nombre del curso *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej: Guía Tinnitus Libre de Ansiedad" className={input} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Descripción</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="De qué trata el curso y qué va a aprender el miembro..." className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Tema (para los filtros del catálogo)</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Tinnitus" className={input} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Portada</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
          <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="O pega el enlace de una imagen" className={input} />
        </div>
      </div>

      {preview && (
        <img src={preview} alt="Portada del curso" className="w-full max-w-md aspect-[16/9] object-cover rounded-2xl border border-black/10" />
      )}

      {message && (
        <p className={`text-sm font-medium ${message.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>{message.text}</p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="px-8 py-3 bg-[#133a73] text-white rounded-full font-bold text-sm hover:bg-[#001531] disabled:opacity-50">
          {saving ? 'Guardando…' : courseId ? 'Guardar cambios' : 'Crear curso'}
        </button>
      </div>
    </form>
  );
}
