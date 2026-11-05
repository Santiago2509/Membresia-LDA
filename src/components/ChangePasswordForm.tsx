'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">Contraseña</h4>
          <p className="text-xs text-neutral-500">
            Cambia la contraseña temporal que recibiste por correo por una que recuerdes.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => { setOpen(true); setSaved(false); }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#001531] font-bold text-xs transition-colors shrink-0 w-full sm:w-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>Cambiar contraseña</span>
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
            <span className="text-xs font-semibold text-neutral-700">Nueva contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-neutral-700">Repite la contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#133a73] focus:ring-2 focus:ring-[#133a73]/15"
            />
          </label>
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full bg-[#001531] hover:bg-[#133a73] text-white font-bold text-xs disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? 'Guardando…' : 'Guardar nueva contraseña'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); }}
              className="px-6 py-3 rounded-full text-neutral-600 hover:bg-neutral-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
