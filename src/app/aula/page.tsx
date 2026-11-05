import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ContentCard from '@/components/ContentCard';
import AulaVisitorGate from '@/components/AulaVisitorGate';
import SignOutButton from '@/components/SignOutButton';
import { BrandStripe } from '@/components/BrandStripe';
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
        <div className="max-w-3xl mx-auto py-12 sm:py-20 px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-black/8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-8">
          
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary shadow-inner">
            <span className="material-symbols-outlined text-[40px]">school</span>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Zona Exclusiva para Miembros</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#001531] tracking-tight">
              Bienvenido al Aula Virtual
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Este es el espacio de formación, masterclasses y ejercicios clínicos dirigidos por el 
              Psicólogo Nelson Arturo. Para acceder a tus cursos y sesiones, inicia sesión o activa tu membresía.
            </p>
          </div>

          {/* Opciones de Acceso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg mx-auto">
            
            {/* Tarjeta 1: Ya soy miembro */}
            <div className="bg-neutral-50 rounded-2xl p-6 border border-black/6 flex flex-col justify-between text-left space-y-4">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">login</span>
                  <span>Ya soy suscriptor</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Ingresa con tu correo y la contraseña que recibiste tras suscribirte.
                </p>
              </div>
              <Link 
                href="/login"
                className="w-full py-3 rounded-full bg-primary text-white text-center font-bold text-xs shadow-sm hover:bg-primary/90 transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Tarjeta 2: Quiero suscribirme */}
            <div className="bg-[#001531] rounded-2xl p-6 text-left flex flex-col justify-between space-y-4 text-white shadow-md">
              <div>
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  <span>Quiero ser miembro</span>
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  Accede a todos los contenidos, masterclasses y acompañamiento.
                </p>
              </div>
              <Link 
                href={epaycoPlanUrl}
                className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-900 text-center font-bold text-xs shadow-sm transition-all"
              >
                Obtener Membresía ({MEMBERSHIP_PRICE_LABEL}/mes)
              </Link>
            </div>

          </div>

          <div className="pt-4 border-t border-black/5">
            <Link 
              href="/catalogo"
              className="text-xs font-bold text-[#133a73] hover:underline flex items-center justify-center gap-1"
            >
              <span>Explorar catálogo y lecciones abiertas</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
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
      <div className="max-w-2xl mx-auto py-12 sm:py-20 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-black/8 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
            <span className="material-symbols-outlined text-[32px]">lock_clock</span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <span>Suscripción Inactiva o Vencida</span>
            </div>
            <h2 className="text-2xl font-bold text-[#001531]">
              Hola, {displayName}
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Tu cuenta está registrada pero no cuenta con una membresía activa en este momento. Activa tu suscripción para desbloquear el Aula Virtual y todas las lecciones.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href={epaycoPlanUrl}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Activar Membresía ({MEMBERSHIP_PRICE_LABEL}/mes)
            </Link>
            <SignOutButton 
              type="member"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-neutral-600 hover:bg-neutral-100 font-bold text-sm transition-colors"
            >
              Cerrar sesión
            </SignOutButton>
          </div>
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
      <header className="border-b border-black/10 pb-10">
        <BrandStripe className="mb-6" />
        <h1 className="font-display text-4xl leading-tight tracking-[-0.01em] text-[#001531] sm:text-5xl">
          Hola, {firstName}
        </h1>
        <p className="mt-4 text-neutral-600">
          {isAdmin ? (
            'Estás viendo el aula con permisos de administrador.'
          ) : periodEnd ? (
            <>
              Tu membresía está activa hasta el{' '}
              <strong className="font-semibold text-[#001531]">
                {format(periodEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}
              </strong>
              . Se renueva automáticamente con ePayco.
            </>
          ) : (
            'Tu membresía está activa.'
          )}{' '}
          <Link href="/aula/perfil" className="font-semibold text-[#001531] underline underline-offset-4">
            Ver mi perfil
          </Link>
        </p>
      </header>

      {/* Explorar por formato (conteos reales) */}
      {formats.length > 0 && (
        <section>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Explorar por formato</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {formats.map((f) => (
              <Link
                key={f.key}
                href={`/catalogo?tipo=${f.key}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-[#001531]/40"
              >
                <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="mt-4 block font-display text-3xl text-[#001531]">{f.count}</span>
                <span className="mt-1 block text-sm text-neutral-600 group-hover:text-[#001531]">{f.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contenido reciente */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-[#001531]">Agregado recientemente</h2>
          <Link href="/catalogo" className="shrink-0 text-sm font-semibold text-[#001531] underline decoration-black/25 underline-offset-[6px] hover:decoration-[#001531]">
            Ver todo →
          </Link>
        </div>

        {contents.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-black/10 bg-white p-8 text-center text-neutral-500">
            Todavía no hay contenido publicado. Muy pronto encontrarás aquí las primeras lecciones.
          </p>
        )}
      </section>

      {/* Ayuda */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#001531] p-7 text-white sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl">¿Necesitas ayuda?</h2>
          <p className="mt-1 text-sm text-white/70">Si tienes problemas con tu acceso o una duda sobre el contenido, escríbenos.</p>
        </div>
        <Link
          href="/contacto"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#001531] hover:bg-[#f3efe6]"
        >
          Contactar soporte
        </Link>
      </section>
    </div>
  );
}
