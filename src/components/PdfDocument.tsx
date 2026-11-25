'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface PdfDocumentProps {
  /** ID de la lección; el PDF se pide a /api/content/[id]/document (que valida el acceso). */
  contentId: string;
  title?: string;
  /** Se llama si el PDF no se puede cargar, para mostrar el visor de Drive como respaldo. */
  onError?: () => void;
}

type PageSize = { width: number; height: number };

/**
 * Dibuja todas las páginas del PDF una debajo de otra, al ancho del contenido.
 * Así el miembro lee el documento con el scroll normal de la página, sin un
 * recuadro con su propio scroll. Cada página se dibuja cuando se acerca a la pantalla.
 */
export default function PdfDocument({ contentId, title, onError }: PdfDocumentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageSizes, setPageSizes] = useState<PageSize[]>([]);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Ancho disponible (se recalcula si cambia el tamaño de la ventana)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.floor(entry.contentRect.width);
      // Redibujar solo con cambios notorios, para no repetir trabajo al hacer scroll en el celular
      setWidth((prev) => (Math.abs(prev - next) > 40 ? next : prev));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cargar el documento
  useEffect(() => {
    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | null = null;

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

        const { data } = await createSupabaseBrowserClient().auth.getSession();
        const token = data.session?.access_token;

        const task = pdfjs.getDocument({
          url: `/api/content/${contentId}/document`,
          httpHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        loadingTask = task;
        const loaded = await task.promise;
        if (cancelled) return;

        const sizes: PageSize[] = [];
        for (let n = 1; n <= loaded.numPages; n++) {
          const page = await loaded.getPage(n);
          const viewport = page.getViewport({ scale: 1 });
          sizes.push({ width: viewport.width, height: viewport.height });
        }
        if (cancelled) return;
        setPageSizes(sizes);
        setPdf(loaded);
      } catch (error) {
        console.error('No se pudo cargar el PDF de la lección:', error);
        if (!cancelled) {
          setFailed(true);
          onErrorRef.current?.();
        }
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [contentId]);

  if (failed) return null;

  return (
    <div ref={containerRef} className="w-full" aria-label={title ? `Documento: ${title}` : 'Documento de la lección'}>
      {!pdf || width === 0 ? (
        <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 bg-[#f4f2ee] sm:rounded-2xl">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-lg text-body">Cargando el documento…</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {pageSizes.map((size, index) => (
            <PdfPage
              key={index}
              pdf={pdf}
              pageNumber={index + 1}
              totalPages={pageSizes.length}
              size={size}
              width={width}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PdfPage({
  pdf,
  pageNumber,
  totalPages,
  size,
  width,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  totalPages: number;
  size: PageSize;
  width: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const height = Math.round((width * size.height) / size.width);

  // Dibujar solo cuando la página está cerca de la pantalla
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;

    (async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (width / size.width) * pixelRatio });
      const canvas = canvasRef.current;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      task = page.render({ canvas, viewport });
      try {
        await task.promise;
      } catch {
        // Render cancelado al cambiar de tamaño o salir de la página
      }
    })();

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, pdf, pageNumber, width, size.width]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-white shadow-[0_2px_16px_rgba(11,31,58,0.08)] ring-1 ring-ink/10 sm:rounded-xl"
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Página ${pageNumber} de ${totalPages}`}
        className="block h-full w-full"
      />
      <span className="absolute bottom-2 right-3 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-semibold text-white">
        {pageNumber} / {totalPages}
      </span>
    </div>
  );
}
