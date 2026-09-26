import { Hero } from '@/components/Hero';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="bg-primary-container text-on-primary-container py-12 lg:py-20 text-center px-6">
        <h1 className="font-display-md lg:font-display-lg font-bold tracking-tight mb-4">Contacto</h1>
        <p className="max-w-2xl mx-auto font-body-lg text-on-surface-variant/80">
          Estamos aquí para ayudarte. Déjanos un mensaje y te responderemos lo más pronto posible.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/30 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[32px]">construction</span>
          </div>
          <h2 className="font-headline-sm text-primary font-bold mb-4">Sección en construcción</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            Este módulo será completado con la información real de tu clínica en cuanto la proporciones (dirección, teléfonos, formulario, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}
