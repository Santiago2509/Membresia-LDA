import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';

const social = [
  { label: 'Instagram', href: CLINIC.instagram },
  { label: 'YouTube', href: CLINIC.youtube },
  { label: 'Facebook', href: CLINIC.facebook },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-[#001531] text-white">
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-3xl">{CLINIC.name}</p>
            <p className="mt-2 text-sm text-white/60">{CLINIC.tagline}</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              Psicoterapia online y contenido basado en Terapia Cognitivo-Conductual para manejar la ansiedad,
              el estrés y tus desafíos emocionales.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Membresía</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><Link href="/" className="hover:text-white">Inicio</Link></li>
              <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
              <li><Link href="/aula" className="hover:text-white">Aula Virtual</Link></li>
              <li><Link href="/login" className="hover:text-white">Iniciar sesión</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Centro</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li><a href={CLINIC.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">Sitio oficial</a></li>
              <li><a href={CLINIC.blog} target="_blank" rel="noopener noreferrer" className="hover:text-white">Blog</a></li>
              <li><Link href="/testimonios" className="hover:text-white">Testimonios</Link></li>
              <li><Link href="/equipo" className="hover:text-white">Nuestro equipo</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Contacto</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <a href={CLINIC.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp {CLINIC.phoneDisplay}
                </a>
              </li>
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a>
                </li>
              ))}
              <li><Link href="/contacto" className="hover:text-white">Soporte de la membresía</Link></li>
            </ul>
          </div>
        </div>

        <p className="pt-8 text-xs text-white/50">
          © {new Date().getFullYear()} {CLINIC.name} · Psicología &amp; Bienestar. El contenido de la membresía es
          educativo y no reemplaza la atención psicológica individual.
        </p>
      </div>
    </footer>
  );
}
