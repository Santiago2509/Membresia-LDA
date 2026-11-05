'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase';

type Stage = 'checking' | 'ready' | 'invalid' | 'done';

/**
 * Página a la que llega el enlace de "¿Olvidaste tu contraseña?".
 * Soporta los tres formatos que puede enviar Supabase:
 *  - ?token_hash=...&type=recovery  (recomendado: funciona aunque el correo se abra en otro dispositivo)
 *  - ?code=...                      (PKCE: el cliente de Supabase lo intercambia solo)
 *  - #access_token=...&type=recovery (flujo implícito antiguo)
 */
export default function RestablecerPage() {
  const [stage, setStage] = useState<Stage>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const urlError = query.get('error_description') || hash.get('error_description');

    const markReady = () => {
      if (!cancelled) setStage('ready');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: unknown) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) markReady();
    });

    (async () => {
      if (urlError) {
        setStage('invalid');
        return;
      }

      const tokenHash = query.get('token_hash');
      if (tokenHash) {
        const { error: otpError } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash });
        if (cancelled) return;
        if (otpError) setStage('invalid');
        else markReady();
        return;
      }

      // getSession espera a que el cliente procese ?code= o #access_token si vienen en la URL
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data?.session) {
        markReady();
        return;
      }

      timeout = setTimeout(() => {
        if (!cancelled) setStage((s) => (s === 'checking' ? 'invalid' : s));
      }, 4000);
    })();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(
        updateError.message?.toLowerCase().includes('different')
          ? 'La nueva contraseña debe ser distinta a la anterior.'
          : 'No pudimos guardar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.'
      );
      return;
    }

    window.history.replaceState(null, '', '/restablecer');
    setStage('done');
  };

  return (
    <div className="flex-grow flex items-center justify-center px-5 pt-28 pb-16 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#12a04a] mb-3">Tu cuenta</p>
        <h1 className="font-display text-4xl text-[#001531] leading-tight mb-3">
          {stage === 'done' ? 'Contraseña actualizada' : stage === 'invalid' ? 'Enlace no válido' : 'Crea una nueva contraseña'}
        </h1>

        {stage === 'checking' && (
          <p className="text-neutral-600">Verificando tu enlace…</p>
        )}

        {stage === 'invalid' && (
          <div className="space-y-6">
            <p className="text-neutral-600 leading-relaxed">
              Este enlace no es válido o ya expiró. Los enlaces de recuperación funcionan una sola vez
              y por tiempo limitado. Pide uno nuevo desde la pantalla de inicio de sesión.
            </p>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#001531] px-7 text-sm font-semibold text-white hover:bg-[#133a73] transition-colors"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        )}

        {stage === 'done' && (
          <div className="space-y-6">
            <p className="text-neutral-600 leading-relaxed">
              Listo. A partir de ahora entra con tu correo y la contraseña que acabas de crear.
            </p>
            <Link
              href="/aula"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#001531] px-7 text-sm font-semibold text-white hover:bg-[#133a73] transition-colors"
            >
              Ir a mi Aula Virtual
            </Link>
          </div>
        )}

        {stage === 'ready' && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-3xl bg-white p-7 border border-black/10">
            {error && (
              <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Nueva contraseña</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Repite la contraseña</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
              />
            </label>
            <p className="text-xs text-neutral-500">Mínimo 8 caracteres.</p>
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-full bg-[#001531] text-sm font-semibold text-white hover:bg-[#133a73] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
