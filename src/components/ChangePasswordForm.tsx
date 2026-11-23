'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Icon } from './ui/Icon';

/** Formulario para que el suscriptor cambie la contraseña temporal que recibió por correo. */
export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

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
          ? 'La nueva contraseña debe ser distinta a la actual.'
          : 'No pudimos cambiar la contraseña. Cierra sesión, vuelve a entrar e inténtalo de nuevo.'
      );
      return;
    }

    setPassword('');
    setConfirm('');
    setSaved(true);
    setOpen(false);
  };

  return (
    <div className="space-y-4 rounded-[2rem] bg-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Contraseña</h2>
          <p className="text-base text-body">
            Cambia la contraseña temporal que recibiste por correo por una que recuerdes.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => { setOpen(true); setSaved(false); }}
            className="inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-paper px-6 text-base font-semibold text-ink transition-colors hover:bg-ink/10 sm:w-auto"
          >
            <Icon name="key" className="h-5 w-5" />
            Cambiar contraseña
          </button>
        )}
      </div>

      {saved && (
        <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Tu contraseña se actualizó. Úsala la próxima vez que inicies sesión.
        </p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {error && (
            <p className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <label className="block">
            <span className="text-base font-semibold text-ink">Nueva contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full h-14 rounded-2xl border-2 border-ink/15 px-4 text-lg outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
            />
          </label>
          <label className="block">
            <span className="text-base font-semibold text-ink">Repite la contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 w-full h-14 rounded-2xl border-2 border-ink/15 px-4 text-lg outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
            />
          </label>
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-12 px-6 rounded-full bg-ink hover:bg-brand text-white font-semibold text-base disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? 'Guardando…' : 'Guardar nueva contraseña'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); }}
              className="h-12 px-6 rounded-full text-body hover:bg-ink/5 font-semibold text-base transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
