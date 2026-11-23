'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Icon } from '@/components/ui/Icon';
import { EPAYCO_PLAN_URL } from '@/lib/membership';

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

  const epaycoPlanUrl = EPAYCO_PLAN_URL;

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
          .maybeSingle();

        // El admin nunca podrá iniciar sesión por la parte de los miembros
        if (profile?.role === 'admin') {
          await supabase.auth.signOut();
          setError('Esta sección es exclusiva para miembros suscriptores. Para ingresar al panel de administración, accede desde el login administrativo.');
          setLoading(false);
          return;
        }

        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const redirectParam = params?.get('redirect');
        window.location.href = redirectParam || '/aula';
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
      // La plataforma envía su propio correo con un enlace que funciona en cualquier navegador
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setResetError(json?.error || 'No pudimos enviar el enlace. Inténtalo de nuevo en unos minutos.');
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError('No pudimos conectar. Revisa tu internet e inténtalo de nuevo.');
    } finally {
      setResetLoading(false);
    }
  };

  const inputClass =
    'block h-14 w-full rounded-2xl border-2 border-ink/15 bg-white px-4 text-lg text-ink placeholder:text-body/60 focus:border-brand focus:outline-none';

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-grow items-center justify-center px-4 pb-16 pt-28">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <img src="/logo-mark.png" alt="" className="mx-auto h-14 w-auto" />
          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
            {isResetMode ? 'Recuperar contraseña' : 'Iniciar sesión'}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-lg text-body">
            {isResetMode
              ? 'Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.'
              : 'Entra con el correo y la contraseña que recibiste al suscribirte.'}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-10">
          {(error || resetError) && (
            <div role="alert" className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-base text-red-800">
              {error || resetError}
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-base font-semibold text-ink">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="tunombre@correo.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-base font-semibold text-ink">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-28`}
                    placeholder="Tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 h-10 -translate-y-1/2 cursor-pointer rounded-xl px-3 text-base font-semibold text-brand hover:bg-brand/10"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-body">Si es la primera vez, usa la contraseña temporal del correo (empieza por LDA-).</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink text-lg font-semibold text-white transition-colors hover:bg-brand disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Entrando…
                  </>
                ) : (
                  <>
                    Entrar a mi aula
                    <Icon name="arrow-right" className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setIsResetMode(true); setError(null); }}
                className="w-full cursor-pointer py-2 text-center text-base font-semibold text-brand underline underline-offset-4"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          ) : !resetSent ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="mb-2 block text-base font-semibold text-ink">
                  Correo con el que te suscribiste
                </label>
                <input
                  type="email"
                  id="reset-email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="tunombre@correo.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-ink text-lg font-semibold text-white transition-colors hover:bg-brand disabled:opacity-60"
              >
                {resetLoading ? 'Enviando…' : 'Enviarme el enlace'}
              </button>
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setResetError(null); }}
                className="w-full cursor-pointer py-2 text-center text-base font-semibold text-body underline underline-offset-4"
              >
                Volver a iniciar sesión
              </button>
            </form>
          ) : (
            <div className="space-y-4 py-4 text-center animate-fade-up">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-calm/15 text-calm">
                <Icon name="mail" className="h-8 w-8" />
              </span>
              <h2 className="font-display text-3xl text-ink">Revisa tu correo</h2>
              <p className="text-lg text-body">
                Si <strong className="text-ink">{email}</strong> está registrado, en unos minutos te llegará un enlace
                para crear tu nueva contraseña. Puedes abrirlo desde el celular o el computador. Si no aparece, mira en
                spam o promociones.
              </p>
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setResetSent(false); }}
                className="cursor-pointer py-2 text-base font-semibold text-brand underline underline-offset-4"
              >
                Volver a iniciar sesión
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-2 text-center text-lg text-body">
          <p>
            ¿Todavía no eres miembro?{' '}
            <Link href={epaycoPlanUrl} className="font-semibold text-ink underline underline-offset-4">
              Suscríbete aquí
            </Link>
          </p>
          <p className="text-base">
            ¿Problemas para entrar?{' '}
            <Link href="/contacto" className="font-semibold text-ink underline underline-offset-4">
              Te ayudamos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
