'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Anima una cifra desde 0 cuando aparece en pantalla.
 * Acepta textos como "1000+", "85%" o "4.6/5": anima solo el primer número.
 */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0;
  const [display, setDisplay] = useState(match ? (0).toFixed(decimals) : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      frame = requestAnimationFrame(() => setDisplay(target.toFixed(decimals)));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay((target * eased).toFixed(decimals));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">{display}{suffix}</span>
    </span>
  );
}
