import { BrandStripe } from '../BrandStripe';

/** Título de sección consistente en todo el sitio. */
export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = 'light',
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
}) {
  const dark = tone === 'dark';
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <BrandStripe className={`mb-5 ${align === 'center' ? 'mx-auto' : ''}`} />
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${dark ? 'text-sun' : 'text-calm'}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-3 font-display text-4xl leading-[1.1] tracking-[-0.01em] sm:text-5xl ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {text && <p className={`mt-5 text-xl leading-relaxed ${dark ? 'text-white/75' : 'text-body'}`}>{text}</p>}
    </div>
  );
}
