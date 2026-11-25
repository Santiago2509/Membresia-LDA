'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { Icon, type IconName } from './ui/Icon';

export interface ContentCardItem {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  category?: string | null;
  thumbnail_url?: string | null;
  is_premium?: boolean;
  created_at?: string;
  url?: string | null;
}

interface ContentCardProps {
  item: ContentCardItem;
  priority?: boolean;
}

const TYPE_META: Record<string, { label: string; icon: IconName; color: string; action: string }> = {
  video: { label: 'Video', icon: 'play', color: '#2b93d1', action: 'Ver video' },
  audio: { label: 'Audio guiado', icon: 'headphones', color: '#12a04a', action: 'Escuchar audio' },
  pdf: { label: 'Guía PDF', icon: 'file', color: '#eeab52', action: 'Abrir guía' },
  tool: { label: 'Herramienta', icon: 'spark', color: '#ec6f31', action: 'Abrir herramienta' },
  article: { label: 'Artículo', icon: 'book', color: '#d6006f', action: 'Leer artículo' },
};

export default function ContentCard({ item }: ContentCardProps) {
  const typeKey = (item.type || 'video').toLowerCase();
  const meta = TYPE_META[typeKey] || TYPE_META.article;
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  // Si la miniatura no carga (p. ej. un archivo de Drive sin compartir), se muestra el ícono del tipo
  const thumbnail = thumbnailFailed ? null : item.thumbnail_url || getVideoThumbnail(item.url);

  return (
    <Link
      href={`/aula/contenido/${item.id}`}
      prefetch={false}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,58,0.12)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e9e6df]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            onError={() => setThumbnailFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: `${meta.color}1f` }}>
            <span style={{ color: meta.color }}>
              <Icon name={meta.icon} className="h-14 w-14" />
            </span>
          </div>
        )}

        {typeKey === 'video' && thumbnail && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Icon name="play" className="ml-1 h-7 w-7" />
            </span>
          </div>
        )}

        {!item.is_premium && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-calm shadow">
            Gratis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-body">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
          <span>{meta.label}</span>
          {item.category && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{item.category}</span>
            </>
          )}
          {item.is_premium && (
            <span className="ml-auto flex items-center gap-1 text-body" title="Solo miembros">
              <Icon name="lock" className="h-4 w-4" />
              <span className="sr-only">Solo miembros</span>
            </span>
          )}
        </p>

        <h3 className="mt-3 font-display text-2xl leading-snug text-ink transition-colors group-hover:text-brand">
          {item.title}
        </h3>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-body">{item.description}</p>
        )}

        <span className="mt-auto flex items-center gap-2 pt-5 text-base font-semibold text-ink">
          {meta.action}
          <Icon name="arrow-right" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
