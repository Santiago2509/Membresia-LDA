'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getEmbedUrl, getVideoThumbnail } from '@/lib/videoUtils';

export default function EditarContenidoPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('video');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(true);

  // Estructura de la lección
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [bodyAfter, setBodyAfter] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');

  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');

  const embedPreviewUrl = getEmbedUrl(url);
  const autoDetectedThumbnail = getVideoThumbnail(url);
  const effectiveThumbnail = thumbnailUrlInput.trim() || autoDetectedThumbnail || currentThumbnailUrl;

  useEffect(() => {
    if (!contentId) return;

    async function loadItem() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/content/${contentId}`);
        if (!res.ok) throw new Error('No se pudo cargar el contenido');
        const data = await res.json();
        const item = data.item;

        setTitle(item.title || '');
        setDescription(item.description || '');
        setType(item.type || 'video');
        setCategory(item.category || '');
        setUrl(item.url || '');
        setIsPremium(item.is_premium ?? true);
        setBody(item.body || '');
        setBodyAfter(item.body_after || '');
        setResourceUrl(item.resource_url || '');
        setResourceTitle(item.resource_title || '');
        setCurrentThumbnailUrl(item.thumbnail_url || null);
        setThumbnailUrlInput(item.thumbnail_url || '');
      } catch (err: any) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let finalThumbnailUrl = thumbnailUrlInput.trim() || autoDetectedThumbnail || currentThumbnailUrl;

      // 1. Subir miniatura nueva a través del endpoint seguro del servidor si hay archivo
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Error al subir la imagen de miniatura.');
        }

        const uploadData = await uploadRes.json();
        finalThumbnailUrl = uploadData.publicUrl;
      }

      // 2. Actualizar contenido
      const res = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type,
          category: category.trim(),
          is_premium: isPremium,
          url: url.trim() || null,
          thumbnail_url: finalThumbnailUrl,
          body: body.trim() || null,
          body_after: bodyAfter.trim() || null,
          resource_url: resourceUrl.trim() || null,
          resource_title: resourceTitle.trim() || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al actualizar el contenido.');
      }

      router.push('/admin/contenido');
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al actualizar el contenido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-[#133a73]/20 border-t-[#133a73] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-neutral-500">Cargando lección...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-black/10 pb-6">
        <Link 
          href="/admin/contenido" 
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-600 hover:text-neutral-900 border border-black/10 transition-colors shadow-sm"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-md text-2xl font-bold text-neutral-900 tracking-tight">Editar Contenido</h1>
          <p className="font-body-sm text-sm text-neutral-600 mt-0.5">
            Modifica la estructura editorial, videos o textos de esta lección.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-200">
          <span className="material-symbols-outlined text-[20px] text-red-500">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BLOQUE 1: INFORMACIÓN GENERAL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="border-b border-black/5 pb-3">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#133a73] text-[20px]">info</span>
              <span>1. Información General</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Título de la Lección *</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Categoría *</label>
              <input 
                type="text" 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Tipo de Contenido *</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
              >
                <option value="video">Video (YouTube / Vimeo)</option>
                <option value="article">Artículo / Lección de Lectura</option>
                <option value="audio">Audio / Meditación</option>
                <option value="pdf">Documento PDF / Guía Clínica</option>
                <option value="tool">Herramienta / Ejercicio Práctico</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Acceso a este Contenido</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-neutral-50 rounded-xl border border-black/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="access"
                    checked={isPremium} 
                    onChange={() => setIsPremium(true)}
                    className="w-4 h-4 text-[#133a73]"
                  />
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#133a73]">lock</span>
                    <span>Premium (Solo miembros con membresía activa)</span>
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="access"
                    checked={!isPremium} 
                    onChange={() => setIsPremium(false)}
                    className="w-4 h-4 text-[#133a73]"
                  />
                  <span className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-600">public</span>
                    <span>Público / Gratis (Abierto para todos)</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Descripción Corta (Para tarjetas del catálogo)</label>
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Imagen de Miniatura</label>
                {autoDetectedThumbnail && !thumbnailFile && !thumbnailUrlInput && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Detectada automáticamente del video</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center h-28 border-2 border-black/15 border-dashed rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors p-3">
                  <span className="material-symbols-outlined text-[28px] text-neutral-500 mb-1">cloud_upload</span>
                  <p className="text-xs text-neutral-600 text-center truncate max-w-full">
                    {thumbnailFile ? (
                      <strong className="text-[#133a73]">{thumbnailFile.name}</strong>
                    ) : (
                      <span>Cambiar archivo de imagen local</span>
                    )}
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) setThumbnailFile(e.target.files[0]);
                    }}
                  />
                </label>

                <div className="flex flex-col justify-center gap-2">
                  <input 
                    type="url" 
                    value={thumbnailUrlInput}
                    onChange={(e) => setThumbnailUrlInput(e.target.value)}
                    placeholder="O enlace directo a la imagen..."
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-xs transition-all"
                  />
                  {effectiveThumbnail && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                      <span>Miniatura configurada</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: CUERPO EDITORIAL DE LA LECCIÓN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
          <div className="border-b border-black/5 pb-3">
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#12a04a] text-[20px]">view_stream</span>
              <span>2. Cuerpo de la Lección (Estructura Editorial)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Todos los campos son modulares y opcionales. Puedes redactar texto al inicio, incrustar un video intermedio y añadir reflexiones después.
            </p>
          </div>

          {/* PARTE A: TEXTO AL INICIO */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#133a73] flex items-center justify-center text-[10px] font-bold">A</span>
                <span>Texto al Inicio (Antes del video - Opcional)</span>
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">Soporta Markdown y saltos de línea</span>
            </div>
            <textarea 
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-4 bg-neutral-50 rounded-2xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 font-mono text-xs sm:text-sm transition-all"
            />
          </div>

          {/* PARTE B: VIDEO INTERMEDIO */}
          <div className="space-y-2 p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-black/10">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 text-[#12a04a] flex items-center justify-center text-[10px] font-bold">B</span>
              <span>Video Intermedio (Enlace de YouTube o Vimeo - Opcional)</span>
            </label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enlace de YouTube o Vimeo..."
              className="w-full px-4 py-3 bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
            />

            {embedPreviewUrl && (
              <div className="mt-4 pt-4 border-t border-black/5">
                <p className="text-xs font-bold text-neutral-700 mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-green-600">visibility</span>
                  <span>Vista Previa del Reproductor de Video:</span>
                </p>
                <div className="w-full aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-black/10 bg-black">
                  <iframe 
                    src={embedPreviewUrl} 
                    className="w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Vista previa del video"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PARTE C: TEXTO DESPUÉS DEL VIDEO */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">C</span>
                <span>Texto Después del Video (Explicación / Ejercicios - Opcional)</span>
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">Soporta Markdown y saltos de línea</span>
            </div>
            <textarea 
              rows={6}
              value={bodyAfter}
              onChange={(e) => setBodyAfter(e.target.value)}
              className="w-full p-4 bg-neutral-50 rounded-2xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 font-mono text-xs sm:text-sm transition-all"
            />
          </div>

          {/* PARTE D: ENLACE / BOTÓN FINAL OPCIONAL */}
          <div className="space-y-3 p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-black/10">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">D</span>
              <span>Enlace / Botón Final de la Lección (Opcional)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="Texto del botón (ej: Descargar Guía en PDF)"
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-xs sm:text-sm"
              />
              <input 
                type="url" 
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="URL del recurso (ej: https://...)"
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-xs sm:text-sm"
              />
            </div>
          </div>

        </div>

        {/* Botones de Envío */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link 
            href="/admin/contenido"
            className="px-6 py-3 rounded-full text-neutral-600 hover:text-neutral-900 font-semibold text-sm transition-colors"
          >
            Cancelar
          </Link>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#133a73] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#001531] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <span>Actualizar Lección</span>
                <span className="material-symbols-outlined text-[18px]">save</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
