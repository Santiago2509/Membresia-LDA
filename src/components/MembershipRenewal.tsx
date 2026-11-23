import Link from 'next/link';
import { Icon } from './ui/Icon';
import { EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { CLINIC } from '@/lib/clinic';

type Props = {
  /** Estado guardado en la tabla memberships (null si nunca tuvo membresía). */
  status: string | null | undefined;
  email: string;
  periodEnd?: string | null;
  /** Variante compacta para usar dentro de Mi perfil. */
  compact?: boolean;
};

/**
 * Explica por qué la membresía no está activa y cómo reactivarla SIN crear otra cuenta
 * ni quedar con dos suscripciones en ePayco.
 */
export function MembershipRenewal({ status, email, periodEnd, compact = false }: Props) {
  const hadMembership = Boolean(status);
  const paymentFailed = status === 'past_due' || (status === 'active' && periodEnd && new Date(periodEnd) < new Date());
  const canceled = status === 'canceled';

  const title = !hadMembership
    ? 'Aún no tienes una membresía activa'
    : paymentFailed
    ? 'No pudimos cobrar tu renovación'
    : canceled
    ? 'Tu membresía está cancelada'
    : 'Tu membresía no está activa';

  const text = !hadMembership
    ? 'Tu cuenta ya existe. Solo falta activar la membresía para ver todas las lecciones.'
    : paymentFailed
    ? 'El cobro mensual de ePayco no se pudo completar, normalmente porque la tarjeta no tenía fondos o venció. Tu cuenta y tu progreso siguen guardados.'
    : canceled
    ? 'Tu cuenta y tu progreso siguen guardados. Puedes volver cuando quieras.'
    : 'Tu cuenta y tu progreso siguen guardados.';

  const whatsappUpdate =
    'https://wa.me/573117606107?text=' +
    encodeURIComponent(
      `Hola, mi membresía de Libre de Ansiedad está suspendida por un pago fallido. Quiero actualizar mi método de pago. Mi correo es ${email}`
    );

  return (
    <div className={compact ? 'space-y-6' : 'space-y-8'}>
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun/25 text-[#8a5a12]">
          <Icon name={paymentFailed ? 'card' : 'calendar'} className="h-7 w-7" />
        </span>
        <div>
          <h2 className={`font-display text-ink ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{title}</h2>
          <p className="mt-2 text-lg leading-relaxed text-body">{text}</p>
        </div>
      </div>

      {paymentFailed && (
        <div className="rounded-2xl bg-calm/10 p-5 text-lg leading-relaxed text-ink">
          <p className="font-semibold">Si ya pusiste fondos en tu tarjeta, no hagas nada más.</p>
          <p className="mt-1 text-body">
            ePayco vuelve a intentar el cobro automáticamente. Cuando se apruebe, tu acceso se reactiva solo en esta
            misma cuenta.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {paymentFailed ? (
          <>
            <a
              href={whatsappUpdate}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Cambiar mi tarjeta o método de pago
            </a>
            <p className="text-center text-base text-body">
              Te ayudamos por WhatsApp ({CLINIC.phoneDisplay}) a actualizar el pago sin crear otra suscripción, para que
              no te cobren dos veces.
            </p>
          </>
        ) : (
          <Link
            href={EPAYCO_PLAN_URL}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
          >
            {hadMembership ? 'Reactivar' : 'Activar'} mi membresía ({MEMBERSHIP_PRICE_LABEL}/mes)
            <Icon name="arrow-right" className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Aviso clave: mismo correo = misma cuenta */}
      <div className="rounded-2xl border-2 border-ink/10 p-5">
        <p className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="mail" className="h-5 w-5 text-brand" />
          {paymentFailed ? 'Si prefieres suscribirte de nuevo' : 'Importante al pagar'}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-body">
          Usa exactamente este correo en ePayco: <strong className="break-all text-ink">{email}</strong>. Así tu acceso se
          activa en esta misma cuenta y no se crea una nueva.
        </p>
        {paymentFailed && (
          <p className="mt-3 text-base leading-relaxed text-body">
            Antes de suscribirte otra vez, escríbenos para cancelar la suscripción anterior y evitar un doble cobro.{' '}
            <Link href={EPAYCO_PLAN_URL} className="font-semibold text-ink underline underline-offset-4">
              Ir al pago de la membresía
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
