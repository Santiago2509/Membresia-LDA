'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modo recuperación de contraseña
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  // Login con Correo + Contraseña
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError('El correo o la contraseña son incorrectos. Por favor verifica las credenciales que recibiste.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Consultar el rol del usuario en la base de datos
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const redirectParam = params?.get('redirect');

        if (profile?.role === 'admin') {
          window.location.href = redirectParam || '/admin';
        } else {
          window.location.href = redirectParam || '/aula';
        }
      }
    } catch (err: any) {
      setError('Ocurrió un error inesperado al conectar. Inténtalo nuevamente.');
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetErr) {
        setResetError('No pudimos enviar el enlace de recuperación. Verifica tu correo.');
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError('Error al solicitar recuperación.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-28 pb-16 px-6 min-h-[calc(100vh-80px)]">
      
      <div className="relative w-full max-w-md z-10">
        
        {/* Logo Icon + Título (sin imagen rota) */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 justify-center mb-4 group focus:outline-none">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#133a73] via-[#12a04a] to-[#2b93d1] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#133a73] text-[26px]">
                  psychology
                </span>
              </div>
            </div>
          </Link>
          
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
            {isResetMode ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
          </h1>
          <p className="font-body-md text-sm text-neutral-600 mt-2 max-w-sm mx-auto">
            {isResetMode 
              ? 'Ingresa tu correo y te enviaremos las instrucciones para restablecer tu acceso.'
              : 'Ingresa con el correo y la contraseña asignada a tu membresía.'}
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-black/10">
          
          {/* Mensajes de Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl font-medium border border-red-200 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-red-500 shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {resetError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl font-medium border border-red-200 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-red-500 shrink-0 mt-0.5">error</span>
              <span>{resetError}</span>
            </div>
          )}

          {!isResetMode ? (
            /* Formulario normal de Correo + Contraseña */
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Campo Correo */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-label-sm text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-black/15 bg-white text-on-surface font-body-md text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    placeholder="tunombre@correo.com" 
                    required 
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="font-label-sm text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                    Contraseña
                  </label>
                  <button 
                    type="button"
                    onClick={() => { setIsResetMode(true); setError(null); }}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 rounded-xl border border-black/15 bg-white text-on-surface font-body-md text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    placeholder="Tu contraseña (ej: LDA-XXXXXX)" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Botón Iniciar Sesión */}
              <button 
                type="submit"
                disabled={loading} 
                className="w-full flex items-center justify-center gap-2 h-12 py-3 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder a mi Cuenta</span>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Formulario de Recuperación */
            <div>
              {!resetSent ? (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="reset-email" className="font-label-sm text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                      Correo Electrónico Registrado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <input 
                        type="email" 
                        id="reset-email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 rounded-xl border border-black/15 bg-white text-on-surface font-body-md text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                        placeholder="ejemplo@correo.com" 
                        required 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={resetLoading} 
                    className="w-full flex items-center justify-center gap-2 h-12 py-3 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                  >
                    {resetLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setIsResetMode(false); setResetError(null); }}
                    className="w-full text-center text-xs text-neutral-600 hover:text-primary font-medium py-2"
                  >
                    ← Volver a iniciar sesión
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[30px]">mark_email_read</span>
                  </div>
                  <h3 className="font-bold text-primary text-base">¡Enlace enviado!</h3>
                  <p className="text-xs text-neutral-600">
                    Revisa tu bandeja de entrada en <strong className="text-neutral-900">{email}</strong> para restablecer tu contraseña.
                  </p>
                  <button 
                    type="button"
                    onClick={() => { setIsResetMode(false); setResetSent(false); }}
                    className="mt-2 text-xs text-primary font-bold hover:underline"
                  >
                    Volver al login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Separador e Indicadores de Confianza */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/10"></div>
            <span className="font-label-xs text-xs text-neutral-400">Libre de Ansiedad</span>
            <div className="flex-1 h-px bg-black/10"></div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-neutral-500 font-label-xs text-xs">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-green-600">verified_user</span>
              <span>Acceso Seguro SSL</span>
            </div>
            <span className="opacity-40">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">auto_stories</span>
              <span>Aula Virtual 24/7</span>
            </div>
          </div>
        </div>

        {/* Enlace directo a ePayco para comprar membresía */}
        <div className="mt-8 text-center">
          <p className="font-label-sm text-sm text-neutral-600">
            ¿Aún no tienes membresía activa?{' '}
            <Link 
              href={epaycoPlanUrl}
              className="text-primary font-bold hover:underline"
            >
              Comprar membresía aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
