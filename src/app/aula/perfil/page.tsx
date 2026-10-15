import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
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
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-[#133a73]">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h2 className="text-xl font-bold text-[#001531]">Inicia sesión para ver tu perfil</h2>
        <p className="text-neutral-600 text-sm">
          Debes acceder con tus credenciales de suscriptor para consultar tus datos y fecha de vigencia.
        </p>
        <Link
          href="/login?redirect=/aula/perfil"
          className="inline-block px-7 py-3 rounded-full bg-[#133a73] text-white font-bold text-sm shadow-md hover:bg-[#001531] transition-all"
        >
          Iniciar Sesión
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

  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#133a73] bg-[#133a73]/10 px-3 py-1 rounded-full">
            Panel de Usuario
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#001531] mt-2">
            Mi Perfil & Membresía
          </h1>
          <p className="text-neutral-600 text-sm">
            Consulta el estado de tu cuenta, tu suscripción y tu periodo de acceso.
          </p>
        </div>

        <Link
          href="/aula"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/10 text-neutral-700 hover:text-neutral-900 transition-colors shadow-sm text-xs font-bold shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Volver al Aula</span>
        </Link>
      </div>

      {/* Tarjeta 1: Información Personal */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-black/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#133a73] to-[#2b93d1] flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{displayName}</h2>
            <p className="text-sm text-neutral-500">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              Nombre de Suscriptor
            </span>
            <p className="font-bold text-neutral-800">{displayName}</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5 space-y-1">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              Correo Electrónico
            </span>
            <p className="font-bold text-neutral-800 truncate">{email}</p>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Estado de la Suscripción & Vencimiento */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Estado de tu Suscripción</h3>
              <p className="text-xs text-neutral-500">Gestión de periodos y vigencia</p>
            </div>
          </div>

          {isActive && !isExpired ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Activa y al día</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Vencida o Inactiva</span>
            </span>
          )}
        </div>

        {/* Fechas de suscripción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#133a73]/5 border border-[#133a73]/15 space-y-1">
            <span className="text-xs text-[#133a73] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">event_available</span>
              <span>Fecha de Inicio</span>
            </span>
            <p className="text-base font-bold text-neutral-800 capitalize">
              {formattedPeriodStart}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1">
            <span className="text-xs text-amber-900 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">event_repeat</span>
              <span>Fecha de Vencimiento / Renovación</span>
            </span>
            <p className="text-base font-bold text-neutral-900 capitalize">
              {formattedPeriodEnd}
            </p>
            {isActive && !isExpired && daysLeft >= 0 && (
              <p className="text-xs text-emerald-700 font-medium pt-1">
                Te quedan {daysLeft} días de acceso activo este ciclo.
              </p>
            )}
          </div>
        </div>

        {/* Información del plan */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
          <div>
            <p className="font-bold text-neutral-800">Plan de Membresía Libre de Ansiedad ($30 USD/mes)</p>
            <p className="text-neutral-500 mt-0.5">
              Procesado de forma segura mediante ePayco Suscripciones.
            </p>
          </div>

          {(!isActive || isExpired) && (
            <Link
              href={epaycoPlanUrl}
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold shadow-sm transition-all shrink-0"
            >
              Renovar Membresía
            </Link>
          )}
        </div>
      </div>

      {/* Tarjeta 3: Acciones y Cierre de Sesión */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">¿Deseas cerrar tu sesión?</h4>
          <p className="text-xs text-neutral-500">
            Puedes desconectarte de forma segura. Podrás volver a entrar con tus credenciales cuando desees.
          </p>
        </div>

        <Link
          href="/api/auth/signout?type=member"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold text-xs transition-all border border-red-200/60 shadow-sm hover:shadow-md shrink-0 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar Sesión</span>
        </Link>
      </div>

    </div>
  );
}
