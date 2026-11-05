import { getVideoThumbnail } from './videoUtils';

interface ContentRow {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  category?: string | null;
  thumbnail_url?: string | null;
  is_premium?: boolean | null;
  created_at?: string | null;
  url?: string | null;
}

/**
 * Convierte una fila de `content` en los datos mínimos de una tarjeta.
 * Calcula la miniatura en el servidor y NO envía la `url` del contenido al
 * navegador, para que un visitante no pueda ver el enlace de un video premium.
 */
export function toContentCard(row: ContentRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    type: row.type ?? null,
    category: row.category ?? null,
    thumbnail_url: row.thumbnail_url || getVideoThumbnail(row.url) || null,
    is_premium: Boolean(row.is_premium),
    created_at: row.created_at ?? undefined,
  };
}
