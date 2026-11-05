'use client';

import Link from 'next/link';
import { getVideoThumbnail } from '@/lib/videoUtils';

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

const TYPE_META: Record<string, { label: string; icon: string; color: string }> = {
  video: { label: 'Video', icon: 'play_arrow', color: '#2b93d1' },
  audio: { label: 'Audio guiado', icon: 'headphones', color: '#12a04a' },
  pdf: { label: 'Guía PDF', icon: 'description', color: '#eeab52' },
  tool: { label: 'Herramienta', icon: 'handyman', color: '#ec6f31' },
  article: { label: 'Artículo', icon: 'menu_book', color: '#d6006f' },
};

export default function ContentCard({ item }: ContentCardProps) {
  const typeKey = (item.type || 'video').toLowerCase();
  const meta = TYPE_META[typeKey] || TYPE_META.article;
  const thumbnail = item.thumbnail_url || getVideoThumbnail(item.url);

  return (
    <Link href={`/aula/contenido/${item.id}`} prefetch={false} className="group flex h-full flex-col">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#d9d9d6]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: `${meta.color}1f` }}>
            <span className="material-symbols-outlined text-5xl" style={{ color: meta.color }}>
              {meta.icon}
            </span>
          </div>
        )}

        {typeKey === 'video' && thumbnail && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#001531] shadow-md transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined ml-0.5 text-[26px]">play_arrow</span>
            </span>
          </div>
        )}

        {!item.is_premium && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12a04a]">
            Gratis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
          <span>{meta.label}</span>
          {item.category && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{item.category}</span>
            </>
          )}
          {item.is_premium && (
            <span className="material-symbols-outlined ml-auto text-[15px] text-neutral-400" title="Solo miembros">
              lock
            </span>
          )}
        </p>

        <h3 className="mt-3 font-display text-[1.45rem] leading-snug text-[#001531] transition-colors group-hover:text-[#133a73]">
          {item.title}
        </h3>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
        )}
      </div>
    </Link>
  );
}
