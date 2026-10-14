/**
 * Utilidades para manejo y extracción de videos (YouTube, Vimeo, etc.)
 */

export function extractYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();

  // Si pegaron un iframe completo
  const iframeMatch = clean.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : clean;

  // Regex comprehensivo para YouTube:
  // - youtube.com/watch?v=ID
  // - youtube.com/embed/ID
  // - youtube.com/v/ID
  // - youtube.com/shorts/ID
  // - youtube.com/live/ID
  // - youtu.be/ID
  // - m.youtube.com/...
  const patterns = [
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/, // Si pegaron solo el ID
  ];

  for (const pattern of patterns) {
    const match = target.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return null;
}

export function extractVimeoId(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();
  const iframeMatch = clean.match(/src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1] : clean;

  const match = target.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  return match ? match[1] : null;
}

export function getEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();

  // YouTube
  const ytId = extractYoutubeId(clean);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  }

  // Vimeo
  const vimeoId = extractVimeoId(clean);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  // Si ya es un enlace directo de iframe seguro
  if (clean.startsWith('https://www.youtube.com/embed/') || clean.startsWith('https://player.vimeo.com/')) {
    return clean;
  }

  return null;
}

export function getVideoThumbnail(url?: string | null): string | null {
  if (!url) return null;
  const ytId = extractYoutubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return null;
}
