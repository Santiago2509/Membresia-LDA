'use client';

import { useState } from 'react';
import { Icon } from './ui/Icon';

/** Muestra la miniatura del video y carga YouTube solo cuando la persona toca "Reproducir". */
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-ink shadow-[0_20px_60px_rgba(11,31,58,0.15)]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Reproducir video: ${title}`}
        >
          {!thumbFailed && (
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Icon name="play" className="ml-1 h-9 w-9" />
          </span>
          <span className="absolute bottom-6 left-6 right-6 text-left text-lg font-semibold text-white sm:text-xl">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
