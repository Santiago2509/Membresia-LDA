'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEmbedUrl, getVideoThumbnail } from '@/lib/videoUtils';

export default function NuevoContenidoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('video');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(true);

  // Estructura de la lección
  const [body, setBody] = useState(''); // Texto 1: Antes del video
  const [url, setUrl] = useState(''); // Video intermedio
  const [bodyAfter, setBodyAfter] = useState(''); // Texto 2: Después del video
  const [resourceUrl, setResourceUrl] = useState(''); // Enlace final
  const [resourceTitle, setResourceTitle] = useState(''); // Título del enlace final

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState('');

  // Video embed preview
  const embedPreviewUrl = getEmbedUrl(url);
  const autoDetectedThumbnail = getVideoThumbnail(url);

  // Effective preview thumbnail
  const effectiveThumbnail = thumbnailUrlInput.trim() || autoDetectedThumbnail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let finalThumbnailUrl = thumbnailUrlInput.trim() || autoDetectedThumbnail || null;

      // 1. Subir miniatura a través de endpoint seguro del servidor si hay archivo local
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

      // 2. Insertar contenido estructurado
      const res = await fetch('/api/admin/content', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Error al guardar el contenido.');
      }

      // 3. Redirigir al catálogo de administración
      router.push('/admin/contenido');
      router.refresh();
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar el contenido.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="font-headline-md text-2xl font-bold text-neutral-900 tracking-tight">Publicar Nuevo Contenido</h1>
          <p className="font-body-sm text-sm text-neutral-600 mt-0.5">
            Crea una lección estructurada con texto inicial, video central y reflexiones posteriores.
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
        
        {/* =========================================================
            BLOQUE 1: DATOS BÁSICOS DE LA LECCIÓN
            ========================================================= */}
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
                placeholder="Ej: Tu cerebro escucha lo que te dices"
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
                placeholder="Ej: Reestructuración Cognitiva, Respiración, Pánico..."
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
                placeholder="Resumen breve de 1 o 2 líneas que aparecerá en el catálogo..."
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
                      <span>Seleccionar archivo local (JPG, PNG, WEBP)</span>
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
                    placeholder="O pega aquí un enlace directo a la imagen..."
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-xs transition-all"
                  />
                  {effectiveThumbnail && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                      <span>Miniatura lista</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BLOQUE 2: ESTRUCTURA DE LA LECCIÓN (TEXTO -> VIDEO -> TEXTO)
            ========================================================= */}
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
              placeholder="Escribe la bienvenida, reflexión inicial o introducción antes del video..."
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
              placeholder="Pega enlace de YouTube (ej. https://www.youtube.com/watch?v=... o https://youtu.be/...)"
              className="w-full px-4 py-3 bg-white rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#133a73]/40 text-sm transition-all"
            />

            {/* Vista previa en vivo del video si se pega un enlace */}
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
              placeholder="Desarrollo del tema, ejercicios prácticos, pasos a seguir o reflexiones finales después del video..."
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
                <span>Publicar Lección</span>
                <span className="material-symbols-outlined text-[18px]">publish</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
