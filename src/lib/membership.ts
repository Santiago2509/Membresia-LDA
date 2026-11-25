// Configuración y reglas compartidas de la membresía.
// Este archivo no importa nada del servidor, así que se puede usar tanto
// en Server Components como en componentes de cliente.

/** Link del plan de suscripción de ePayco (botón "Comprar membresía"). */
export const EPAYCO_PLAN_URL =
  process.env.NEXT_PUBLIC_EPAYCO_PLAN_URL ||
  'https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42';

/** Precio que se muestra en la web. */
export const MEMBERSHIP_PRICE_LABEL = '$30 USD';

/**
 * Días extra que se suman a cada mes pagado. Evitan que el usuario pierda
 * acceso unas horas si ePayco cobra la renovación tarde o el aviso se demora.
 */
export const MEMBERSHIP_GRACE_DAYS = 3;

/**
 * Correos con acceso de administrador aunque no estén en la tabla `admins`.
 * Se puede sobrescribir con la variable de entorno ADMIN_EMAILS (separados por coma).
 */
const DEFAULT_ADMIN_EMAILS = ['santiago@gmail.com', 'adminlibredeansiedad@gmail.com'];

export const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
  .concat(process.env.ADMIN_EMAILS ? [] : DEFAULT_ADMIN_EMAILS);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

interface MembershipLike {
  status?: string | null;
  current_period_end?: string | null;
}

/** Una membresía da acceso si está activa y su periodo no ha vencido. */
export function isMembershipActive(membership?: MembershipLike | null): boolean {
  if (!membership || membership.status !== 'active') return false;
  if (!membership.current_period_end) return true;
  return new Date(membership.current_period_end) > new Date();
}

/**
 * Estado de una membresía tal como lo ve el administrador:
 * - al_dia: pagada y vigente (tiene acceso)
 * - vencida: activa pero su periodo pagado terminó; sin acceso hasta el próximo pago
 * - pago_fallido: ePayco rechazó el cobro de la renovación; sin acceso
 * - suspendida: suspendida por un administrador o cancelada; sin acceso
 * - incompleta: el pago nunca se completó
 */
export type MembershipState = 'al_dia' | 'vencida' | 'pago_fallido' | 'suspendida' | 'incompleta';

export function getMembershipState(membership?: MembershipLike | null): MembershipState {
  switch (membership?.status) {
    case 'active':
      return isMembershipActive(membership) ? 'al_dia' : 'vencida';
    case 'past_due':
      return 'pago_fallido';
    case 'canceled':
      return 'suspendida';
    default:
      return 'incompleta';
  }
}

export const MEMBERSHIP_STATE_LABEL: Record<MembershipState, string> = {
  al_dia: 'Al día',
  vencida: 'Vencida',
  pago_fallido: 'Pago fallido',
  suspendida: 'Suspendida',
  incompleta: 'Incompleta',
};

/** Totales para los contadores del panel de administración. */
export function countMembershipStates(memberships: MembershipLike[]) {
  const counts = { total: memberships.length, al_dia: 0, pendientes: 0, suspendidas: 0 };
  for (const m of memberships) {
    const state = getMembershipState(m);
    if (state === 'al_dia') counts.al_dia++;
    else if (state === 'suspendida') counts.suspendidas++;
    else counts.pendientes++; // vencida, pago fallido o incompleta: sin acceso hasta que pague
  }
  return counts;
}

/**
 * Columnas que se leen para mostrar tarjetas de contenido. Nunca se pide
 * `body`, `body_after` ni `resource_url`. La `url` solo se usa en el servidor
 * para calcular la miniatura, y `toContentCard` la quita antes de enviarla al navegador.
 */
export const CONTENT_CARD_COLUMNS =
  'id, title, description, type, category, thumbnail_url, is_premium, created_at, url';
