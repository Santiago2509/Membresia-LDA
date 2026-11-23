import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ContentCard from '@/components/ContentCard';
import AulaVisitorGate from '@/components/AulaVisitorGate';
import SignOutButton from '@/components/SignOutButton';
import { BrandStripe } from '@/components/BrandStripe';
import { Icon } from '@/components/ui/Icon';
import { BreathingExercise } from '@/components/BreathingExercise';
import { MembershipRenewal } from '@/components/MembershipRenewal';
import { CONTENT_CARD_COLUMNS, EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL, isAdminEmail, isMembershipActive } from '@/lib/membership';
import { toContentCard } from '@/lib/contentCards';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Datos frescos de sesión y contenidos

export default async function AulaDashboard() {
  const cookieStore = await cookies();
  const epaycoPlanUrl = EPAYCO_PLAN_URL;
  
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

  // =========================================================================
  // CASO 1: USUARIO NO HA INICIADO SESIÓN (VISITANTE NO AUTENTICADO)
  // Muestra pantalla amigable pidiendo iniciar sesión o adquirir membresía
  // =========================================================================
  if (!user) {
    return (
      <AulaVisitorGate>
        <div className="mx-auto max-w-3xl py-8 sm:py-16">
          <div className="space-y-8 rounded-[2rem] bg-white p-8 text-center shadow-[0_10px_40px_rgba(11,31,58,0.06)] sm:p-14">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Icon name="school" className="h-8 w-8" />
            </span>
            <div className="mx-auto max-w-xl space-y-3">
              <h1 className="font-display text-4xl text-ink sm:text-5xl">Bienvenido al Aula Virtual</h1>
              <p className="text-lg leading-relaxed text-body">
                Aquí están las lecciones, audios y guías del Psic. Nelson Arturo. Inicia sesión con el correo y la
                contraseña que recibiste, o activa tu membresía.
              </p>
            </div>
            <div className="mx-auto grid max-w-lg gap-3">
              <Link
                href="/login"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
              >
                <Icon name="user" className="h-5 w-5" />
                Ya soy miembro: iniciar sesión
              </Link>
              <Link
                href={epaycoPlanUrl}
                className="inline-flex h-14 items-center justify-center rounded-full border-2 border-ink/15 px-7 text-lg font-semibold text-ink transition-colors hover:border-ink"
              >
                Quiero ser miembro ({MEMBERSHIP_PRICE_LABEL}/mes)
              </Link>
              <Link href="/catalogo" className="py-2 text-base font-semibold text-body underline underline-offset-4">
                Explorar el catálogo
              </Link>
            </div>
          </div>
        </div>
      </AulaVisitorGate>
    );
}

  // =========================================================================
  // CASO 2: USUARIO AUTENTICADO
  // Verificar permisos (Admin o Membresía Activa)
  // =========================================================================
  const [profileResult, adminResult, membershipResult, contentsResult, typesResult] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('admins').select('id').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('memberships').select('*').eq('user_id', user.id).maybeSingle(),
    supabaseAdmin.from('content').select(CONTENT_CARD_COLUMNS).order('created_at', { ascending: false }).limit(6),
    supabaseAdmin.from('content').select('type'),
  ]);

  const profile = profileResult.data;
  const adminRecord = adminResult.data;
  const membership = membershipResult.data;
  const contents = (contentsResult.data || []).map(toContentCard);
  const typeRows: { type: string | null }[] = typesResult.data || [];

  const isAdmin = 
    adminRecord !== null || 
    profile?.role === 'admin' || 
    isAdminEmail(user.email);

  const hasActiveMembership = isAdmin || isMembershipActive(membership);

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Miembro';

  // =========================================================================
  // SUB-CASO 2B: USUARIO LOGUEADO PERO SIN MEMBRESÍA ACTIVA
  // =========================================================================
  if (!hasActiveMembership) {
    return (
      <div className="mx-auto max-w-2xl py-6 sm:py-12">
        <p className="mb-4 text-lg text-body">Hola, {displayName}</p>
        <div className="rounded-[2rem] bg-white p-7 shadow-[0_10px_40px_rgba(11,31,58,0.06)] sm:p-10">
          <MembershipRenewal
            status={membership?.status}
            email={user.email || ''}
            periodEnd={membership?.current_period_end}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-base text-body">
          <Link href="/aula/perfil" className="font-semibold text-ink underline underline-offset-4">
            Ver mi perfil
          </Link>
          <SignOutButton type="member" className="cursor-pointer font-semibold text-body underline underline-offset-4">
            Cerrar sesión
          </SignOutButton>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUB-CASO 2A: USUARIO AUTENTICADO CON MEMBRESÍA ACTIVA O ADMIN
  // Solo datos reales: nombre, vigencia, contenido y conteo por formato.
  // =========================================================================
  const firstName = displayName.split(' ')[0];
  const periodEnd = membership?.current_period_end ? new Date(membership.current_period_end) : null;

  const countBy = (types: string[]) =>
    typeRows.filter((r) => types.includes((r.type || '').toLowerCase())).length;

  const formats = [
    { key: 'video', label: 'Videos', color: '#2b93d1', count: countBy(['video']) },
    { key: 'audio', label: 'Audios guiados', color: '#12a04a', count: countBy(['audio']) },
    { key: 'pdf', label: 'Guías PDF', color: '#eeab52', count: countBy(['pdf']) },
    { key: 'article', label: 'Artículos', color: '#d6006f', count: countBy(['article', 'articulo']) },
  ].filter((f) => f.count > 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-14 pb-16">
      {/* Bienvenida */}
      <header className="pb-2">
        <BrandStripe className="mb-6" />
        <h1 className="font-display text-4xl leading-tight tracking-[-0.01em] text-ink sm:text-5xl">
          Hola, {firstName}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-body">
          {isAdmin ? (
            'Estás viendo el aula con permisos de administrador.'
          ) : periodEnd ? (
            <>
              Tu membresía está activa hasta el{' '}
              <strong className="font-semibold text-ink">
                {format(periodEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}
              </strong>
              . Se renueva automáticamente con ePayco.
            </>
          ) : (
            'Tu membresía está activa.'
          )}{' '}
          <Link href="/aula/perfil" className="font-semibold text-ink underline underline-offset-4">
            Ver mi perfil
          </Link>
        </p>
      </header>

      {/* Explorar por formato (conteos reales) */}
      {formats.length > 0 && (
        <section>
          <h2 className="mb-5 font-display text-3xl text-ink">Explorar por formato</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {formats.map((f) => (
              <Link
                key={f.key}
                href={`/catalogo?tipo=${f.key}`}
                className="group rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgba(11,31,58,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,31,58,0.1)]"
              >
                <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="mt-4 block font-display text-3xl text-ink">{f.count}</span>
                <span className="mt-1 block text-base font-medium text-body group-hover:text-ink">{f.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contenido reciente */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-ink">Agregado recientemente</h2>
          <Link href="/catalogo" className="shrink-0 text-sm font-semibold text-ink underline decoration-black/25 underline-offset-[6px] hover:decoration-[#001531]">
            Ver todo →
          </Link>
        </div>

        {contents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-lg text-body">
            Todavía no hay contenido publicado. Muy pronto encontrarás aquí las primeras lecciones.
          </p>
        )}
      </section>

      {/* Herramienta rápida */}
      <section aria-label="Ejercicio de respiración">
        <h2 className="mb-6 font-display text-3xl text-ink">¿Necesitas calmarte ahora?</h2>
        <BreathingExercise />
      </section>

      {/* Ayuda */}
      <section className="flex flex-col justify-between gap-4 rounded-[2rem] bg-ink p-8 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl">¿Necesitas ayuda?</h2>
          <p className="mt-1 text-base text-white/75">Si tienes problemas con tu acceso o una duda sobre el contenido, escríbenos.</p>
        </div>
        <Link
          href="/contacto"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-base font-semibold text-ink hover:bg-sun"
        >
          Contactar soporte
        </Link>
      </section>
    </div>
  );
}
