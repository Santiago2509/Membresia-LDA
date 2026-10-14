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

export default function ContentCard({ item }: ContentCardProps) {
  // Normalize type
  const typeKey = (item.type || 'video').toLowerCase();

  const getTypeMeta = () => {
    switch (typeKey) {
      case 'video':
        return {
          icon: 'play_circle',
          label: 'Masterclass en Video',
          actionText: 'Ver Lección',
          actionIcon: 'play_arrow',
          badgeColor: 'text-[#133a73] bg-[#133a73]/10',
        };
      case 'audio':
        return {
          icon: 'headphones',
          label: 'Audio Guiado',
          actionText: 'Escuchar Audio',
          actionIcon: 'headphones',
          badgeColor: 'text-purple-700 bg-purple-50',
        };
      case 'pdf':
        return {
          icon: 'picture_as_pdf',
          label: 'Guía / Plantilla PDF',
          actionText: 'Abrir Guía',
          actionIcon: 'download',
          badgeColor: 'text-rose-700 bg-rose-50',
        };
      case 'article':
      case 'articulo':
      default:
        return {
          icon: 'menu_book',
          label: 'Artículo de Lectura',
          actionText: 'Leer Artículo',
          actionIcon: 'arrow_forward',
          badgeColor: 'text-emerald-700 bg-emerald-50',
        };
    }
  };

  const typeMeta = getTypeMeta();
  const finalThumbnail = item.thumbnail_url || getVideoThumbnail(item.url);

  return (
    <Link 
      href={`/aula/contenido/${item.id}`}
      className="group relative bg-white rounded-3xl border border-black/8 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
    >
      {/* 16:9 Thumbnail Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200">
        {finalThumbnail ? (
          <img 
            src={finalThumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <span className="material-symbols-outlined text-4xl">
              {typeMeta.icon}
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Play / Media Button Overlay for Videos */}
        {typeKey === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-[#001531] group-hover:scale-115 group-hover:bg-[#133a73] group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-[26px] ml-0.5">play_arrow</span>
            </div>
          </div>
        )}

        {/* Category Pill (Top-Left) */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#001531] text-[11px] font-bold uppercase tracking-wider shadow-sm border border-white/40">
            {item.category || 'Clínico'}
          </span>
        </div>

        {/* Access Pill (Top-Right) */}
        <div className="absolute top-3.5 right-3.5 z-10">
          {item.is_premium ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001531]/95 backdrop-blur-md text-amber-300 text-[11px] font-bold shadow-md border border-amber-400/30">
              <span className="material-symbols-outlined text-[13px] text-amber-300">lock</span>
              <span>Premium</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[13px]">public</span>
              <span>Gratis</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Format Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${typeMeta.badgeColor}`}>
              <span className="material-symbols-outlined text-[14px]">{typeMeta.icon}</span>
              <span>{typeMeta.label}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-[#001531] group-hover:text-[#133a73] transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Short Description */}
          {item.description && (
            <p className="text-neutral-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Card Footer CTA */}
        <div className="pt-4 border-t border-black/6 flex items-center justify-between mt-auto">
          <span className="text-xs font-bold text-[#133a73] group-hover:text-[#001531] flex items-center gap-1.5 transition-colors">
            <span>{typeMeta.actionText}</span>
            <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>

          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[#133a73] group-hover:bg-[#133a73] group-hover:text-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-[16px]">
              {typeMeta.actionIcon}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
