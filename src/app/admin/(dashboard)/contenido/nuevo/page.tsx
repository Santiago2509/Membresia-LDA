'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function NuevoContenidoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('article');
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(true);
  const [body, setBody] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let thumbnailUrl = null;

      // Usar cliente SSR autenticado
      const supabaseClient = createSupabaseBrowserClient();

      // 1. Upload thumbnail if provided
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabaseClient.storage
          .from('thumbnails')
          .upload(filePath, thumbnailFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabaseClient.storage
          .from('thumbnails')
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrlData.publicUrl;
      }

      // 2. Insert into content table
      const { error: insertError } = await supabaseClient
        .from('content')
        .insert({
          title,
          description,
          type,
          category,
          is_premium: isPremium,
          body,
          thumbnail_url: thumbnailUrl,
        });

      if (insertError) throw insertError;

      // 3. Redirect back to list
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
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-6">
        <Link href="/admin/contenido" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Crear Nuevo Contenido</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Sube un nuevo curso, artículo o video a la plataforma.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 p-6 md:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-sm font-bold text-on-surface">Título del contenido</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Gestionando la Ansiedad"
              className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-sm transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-sm font-bold text-on-surface">Categoría</label>
            <input 
              type="text" 
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Bienestar Emocional"
              className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-sm transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-sm font-bold text-on-surface">Tipo de Contenido</label>
            <div className="relative">
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-sm transition-all appearance-none"
              >
                <option value="article">Artículo / Blog</option>
                <option value="video">Video</option>
                <option value="audio">Audio / Meditación</option>
                <option value="pdf">Documento PDF</option>
                <option value="tool">Herramienta</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-sm font-bold text-on-surface">Acceso</label>
            <div className="flex items-center gap-4 h-[48px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={isPremium} 
                  onChange={() => setIsPremium(true)}
                  className="w-4 h-4 text-primary bg-surface-container border-outline-variant focus:ring-primary"
                />
                <span className="font-label-sm font-bold text-primary">Premium (Candado)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={!isPremium} 
                  onChange={() => setIsPremium(false)}
                  className="w-4 h-4 text-primary bg-surface-container border-outline-variant focus:ring-primary"
                />
                <span className="font-label-sm font-medium text-on-surface-variant">Gratis (Público)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label-sm font-bold text-on-surface">Descripción Corta (Para tarjetas)</label>
          <textarea 
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Un resumen de 2 líneas para mostrar en la tarjeta..."
            className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-sm transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label-sm font-bold text-on-surface">Imagen de Miniatura</label>
          <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-outline-variant/50 border-dashed rounded-xl cursor-pointer bg-surface-container hover:bg-surface-container-high transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">cloud_upload</span>
                      <p className="mb-2 text-sm text-on-surface-variant">
                        {thumbnailFile ? (
                          <span className="font-bold text-primary">{thumbnailFile.name}</span>
                        ) : (
                          <>Haz clic para subir o arrastra la imagen</>
                        )}
                      </p>
                      <p className="text-xs text-on-surface-variant/70">PNG, JPG o WEBP (Recomendado 16:9)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
              </label>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant/30">
          <div className="flex justify-between items-center mb-2">
            <label className="font-label-sm font-bold text-on-surface">Contenido Completo (Markdown)</label>
            <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-2 py-1 rounded">Soporta Markdown (Negritas, Links, etc.)</span>
          </div>
          <textarea 
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`# Título principal\n\nAquí va el texto. Puedes usar **negritas** y agregar [enlaces](https://...).`}
            className="w-full px-4 py-4 bg-surface-container rounded-xl border border-outline-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-body-sm transition-all font-mono text-sm resize-y"
          />
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-outline-variant/30">
          <Link 
            href="/admin/contenido"
            className="px-6 py-3 rounded-full font-label-md font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-full bg-primary text-on-primary font-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Guardando...
              </>
            ) : (
              <>Guardar Contenido</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
