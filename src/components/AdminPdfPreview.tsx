'use client';

import { useState } from 'react';
import PdfDocument from './PdfDocument';

/**
 * Vista previa de un PDF de Drive en el panel de admin, igual a como lo verán los
 * miembros: todas las páginas seguidas. Si no se puede dibujar, usa el visor de Drive.
 */
export default function AdminPdfPreview({ driveUrl, embedUrl }: { driveUrl: string; embedUrl: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-amber-800">
          No se pudo cargar el PDF completo (¿está compartido &quot;con el enlace&quot;?). Se muestra el visor de Drive.
        </p>
        <div className="w-full max-w-2xl mx-auto h-[480px] rounded-2xl overflow-hidden shadow-xl border border-black/10 bg-neutral-100">
          <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen title="Vista previa del documento" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PdfDocument src={`/api/admin/drive-pdf?url=${encodeURIComponent(driveUrl)}`} onError={() => setFailed(true)} />
    </div>
  );
}
