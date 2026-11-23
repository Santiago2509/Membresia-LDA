import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { Icon } from '@/components/ui/Icon';
import { MembershipRenewal } from '@/components/MembershipRenewal';
import { MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function PerfilPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon name="lock" className="h-8 w-8" />
        </span>
        <h1 className="font-display text-3xl text-ink">Inicia sesión para ver tu perfil</h1>
        <p className="text-lg text-body">Entra con tu correo y contraseña para ver tus datos y la fecha de tu membresía.</p>
        <Link
          href="/login?redirect=/aula/perfil"
          className="inline-flex h-14 items-center justify-center rounded-full bg-ink px-8 text-lg font-semibold text-white hover:bg-brand"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // Consultar perfil y membresía con supabaseAdmin
  const [profileResult, membershipResult] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('memberships').select('*').eq('user_id', user.id).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const membership = membershipResult.data;

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Miembro';
  const email = user.email || '';
  const isActive = membership?.status === 'active';
  const periodEnd = membership?.current_period_end ? new Date(membership.current_period_end) : null;
  const periodStart = membership?.current_period_start ? new Date(membership.current_period_start) : null;

  const isExpired = periodEnd ? periodEnd < new Date() : false;
  const daysLeft = periodEnd ? differenceInDays(periodEnd, new Date()) : 0;

  const formattedPeriodEnd = periodEnd
    ? format(periodEnd, "d 'de' MMMM 'de' yyyy", { locale: es })
    : 'No registrado';

  const formattedPeriodStart = periodStart
    ? format(periodStart, "d 'de' MMMM 'de' yyyy", { locale: es })
    : 'No registrado';


  const active = isActive && !isExpired;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20">
      <header className="pb-2">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">Mi perfil</h1>
        <p className="mt-3 text-lg text-body">Tus datos, el estado de tu membresía y tu contraseña.</p>
      </header>

      {/* Datos */}
      <section className="flex items-center gap-5 rounded-[2rem] bg-white p-6 sm:p-8">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
          {displayName.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-2xl text-ink">{displayName}</p>
          <p className="truncate text-lg text-body">{email}</p>
        </div>
      </section>

      {/* Membresía */}
      <section className="space-y-6 rounded-[2rem] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-ink">Mi membresía</h2>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold ${
              active ? 'bg-calm/15 text-[#0b7a37]' : 'bg-sun/25 text-[#8a5a12]'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-calm' : 'bg-[#b9771f]'}`} />
            {active ? 'Activa' : 'Vencida o inactiva'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-paper p-5">
            <p className="text-base text-body">Inicio del periodo</p>
            <p className="mt-1 text-xl font-semibold text-ink first-letter:uppercase">{formattedPeriodStart}</p>
          </div>
          <div className={`rounded-2xl p-5 ${active ? 'bg-calm/10' : 'bg-sun/15'}`}>
            <p className="text-base text-body">{active ? 'Tienes acceso hasta' : 'Venció el'}</p>
            <p className="mt-1 text-xl font-semibold text-ink first-letter:uppercase">{formattedPeriodEnd}</p>
            {active && daysLeft >= 0 && (
              <p className="mt-1 text-base text-[#0b7a37]">
                {daysLeft === 1 ? 'Te queda 1 día' : `Te quedan ${daysLeft} días`}
              </p>
            )}
          </div>
        </div>

        <p className="text-base leading-relaxed text-body">
          Membresía Libre de Ansiedad ({MEMBERSHIP_PRICE_LABEL}/mes). Se renueva automáticamente con ePayco; cuando se
          cobra la renovación, tu fecha de acceso se actualiza sola.
        </p>

        {!active && (
          <div className="border-t border-ink/10 pt-6">
            <MembershipRenewal
              compact
              status={membership?.status}
              email={email}
              periodEnd={membership?.current_period_end}
            />
          </div>
        )}
      </section>

      <ChangePasswordForm />

      <section className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-ink">Cerrar sesión</h2>
          <p className="text-base text-body">Puedes volver a entrar cuando quieras con tu correo y contraseña.</p>
        </div>
        <SignOutButton
          type="member"
          className="inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-red-50 px-6 text-base font-semibold text-red-700 hover:bg-red-100 sm:w-auto"
        >
          <Icon name="logout" className="h-5 w-5" />
          Cerrar sesión
        </SignOutButton>
      </section>
    </div>
  );
}
