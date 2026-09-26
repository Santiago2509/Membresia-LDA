'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Conectar con Supabase Auth cuando esté listo
    // const { error } = await supabase.auth.signInWithOtp({ email });
    
    // Simulación para UI
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="flex-grow flex items-center justify-center relative overflow-hidden py-12 px-6">
      
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-container-low via-surface to-background"></div>
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-secondary-fixed/30 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-surface-container-highest/50 blur-3xl"></div>
      
      <div className="relative w-full max-w-md z-10">
        
        {/* Logo + Branding */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-space-sm justify-center mb-6 group">
            <img 
              alt="Libre de Ansiedad Logo" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WAjJ6_ECtFRxRaJ3lFJHnhgHTcK6LdiwldYzEYFmFbRaEM-HBp7ScP1MWd_lH-53059TFnGXNoPFV6z3HftDSG0zgCu-L2jUgb5q8VrTs3nKJIPf5HKYRdzowO7y8BJqJBYlPmXMM3oyZ5YlWf6lEUozR-tZWK5cYZbfzj3Lf9uMu0R2dOFLFGlCUVhs9KS827jD_Lv8o9Htt6N87_pSZUomwZe1E6kGFXBOdEkRCah3oc6n97XRpvQZM"
            />
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              Libre de Ansiedad
            </span>
          </Link>
          
          {!sent ? (
            <>
              <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                Bienvenido de nuevo
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                Ingresa tu correo electrónico y te enviaremos un enlace mágico para acceder a tu espacio personal.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-secondary text-[32px]">mark_email_read</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                ¡Revisa tu correo!
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                Hemos enviado un enlace de acceso a <span className="font-semibold text-on-surface">{email}</span>. Haz clic en él para iniciar sesión.
              </p>
            </>
          )}
        </div>

        {!sent ? (
          /* Glassmorphism Card */
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-surface-container">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="font-label-md text-label-md text-on-surface font-semibold block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">mail</span>
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                    placeholder="ejemplo@correo.com" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading} 
                className="w-full flex items-center justify-center gap-2 h-13 py-3.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Enlace Mágico</span>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="font-label-xs text-label-xs text-on-surface-variant">o</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 text-on-surface-variant font-label-xs text-label-xs">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
                <span>Acceso seguro</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">speed</span>
                <span>Sin contraseña</span>
              </div>
            </div>
          </div>
        ) : (
          /* Sent confirmation card */
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-surface-container text-center">
            <button 
              onClick={() => { setSent(false); setEmail(''); }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Usar otro correo</span>
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            ¿Aún no tienes membresía?{' '}
            <Link href="/#membresia-exclusiva" className="text-secondary font-semibold hover:text-primary transition-colors underline underline-offset-2">
              Conoce nuestros planes
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
