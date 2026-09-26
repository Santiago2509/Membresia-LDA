import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6 py-12">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-lg border border-outline-variant/30 text-center">
        
        {/* Success Icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center text-on-primary shadow-inner">
            <span className="material-symbols-outlined text-[40px]">check_circle</span>
          </div>
        </div>

        <h1 className="font-headline-md text-primary font-bold mb-4">¡Pago Exitoso!</h1>
        <p className="font-body-md text-on-surface-variant mb-6">
          Tu membresía Premium se está activando. 
        </p>

        <div className="bg-surface-container-low p-6 rounded-2xl mb-8 space-y-4 text-left">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">mark_email_unread</span>
            <p className="font-label-sm text-on-surface">
              <strong className="block text-primary">Revisa tu correo electrónico</strong>
              Te hemos enviado un enlace para que configures tu contraseña y accedas de inmediato si eres nuevo en la plataforma.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">lock_open</span>
            <p className="font-label-sm text-on-surface">
              <strong className="block text-primary">Acceso Desbloqueado</strong>
              Si ya tenías cuenta, todo el contenido premium ya está disponible para ti.
            </p>
          </div>
        </div>

        <Link 
          href="/login" 
          className="w-full py-3.5 bg-primary text-on-primary rounded-full font-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm inline-block"
        >
          Ir a Iniciar Sesión
        </Link>
        
        <div className="mt-6">
          <Link href="/" className="font-label-sm text-secondary font-semibold hover:underline">
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
