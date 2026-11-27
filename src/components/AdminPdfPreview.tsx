'use client';

import { useEffect, useState } from 'react';
import PdfDocument from './PdfDocument';

/**
 * Vista previa de un PDF de Drive en el panel de admin, igual a como lo verán los
 * miembros: todas las páginas seguidas. Si no se puede dibujar, usa el visor de Drive
 * y muestra el motivo que dio el servidor.
 */
export default function AdminPdfPreview({ driveUrl, embedUrl }: { driveUrl: string; embedUrl: string }) {
  const src = `/api/admin/drive-pdf?url=${encodeURIComponent(driveUrl)}`;
  const [failed, setFailed] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  // Al fallar, se pregunta al servidor el motivo para mostrarlo
  useEffect(() => {
    if (!failed) return;
    let cancelled = false;
    fetch(src)
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          setReason('El servidor entregó el PDF, pero el navegador no pudo dibujarlo.');
          return;
        }
        const body = await res.json().catch(() => null);
        setReason(
          body?.error
            ? `${body.error} (código ${res.status}${body.detail ? ` · ${body.detail}` : ''})`
            : `Error ${res.status} del servidor.`
        );
      })
      .catch(() => {
        if (!cancelled) setReason('No hubo respuesta del servidor.');
      });
    return () => {
      cancelled = true;
    };
  }, [failed, src]);

  if (failed) {
    return (
      <div className="space-y-2">
        <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 space-y-1">
          <p>
            <strong>No se pudo cargar el PDF completo.</strong> Se muestra el visor de Drive (con scroll propio).
          </p>
          {reason && <p>Motivo: {reason}</p>}
          <p>
            Revisa en Drive: <strong>Compartir → Acceso general → &quot;Cualquier persona con el enlace&quot;</strong>.
            Prueba abrir el enlace en una ventana de incógnito: si pide iniciar sesión, no está compartido.
          </p>
        </div>
        <div className="w-full max-w-2xl mx-auto h-[480px] rounded-2xl overflow-hidden shadow-xl border border-black/10 bg-neutral-100">
          <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen title="Vista previa del documento" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PdfDocument src={src} onError={() => setFailed(true)} />
    </div>
  );
}
