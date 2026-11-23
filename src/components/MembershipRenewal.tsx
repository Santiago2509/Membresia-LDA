import Link from 'next/link';
import { Icon } from './ui/Icon';
import { EPAYCO_PLAN_URL } from '@/lib/membership';
import { CLINIC } from '@/lib/clinic';

type Props = {
  /** Estado guardado en la tabla memberships (null si no hay membresía asociada a la cuenta). */
  status: string | null | undefined;
  email: string;
  /** Fecha de fin del periodo (se acepta por compatibilidad; hoy no cambia el mensaje). */
  periodEnd?: string | null;
  /** Variante compacta para usar dentro de Mi perfil. */
  compact?: boolean;
};

/**
 * Explica por qué la membresía no está activa y cómo reactivarla SIN crear otra cuenta
 * ni quedar con dos suscripciones en ePayco.
 */
export function MembershipRenewal({ status, email, compact = false }: Props) {
  // Las cuentas solo se crean cuando ePayco confirma un pago. Por eso:
  //  - sin membresía (null): pagó pero algo falló al activarla -> revisar, NO cobrar otra vez
  //  - canceled: la suspendió un administrador -> hablar con soporte
  //  - past_due / vencida: falló o no llegó la renovación mensual
  const missing = !status;
  const canceled = status === 'canceled';
  const paymentFailed = !missing && !canceled;
  const needsSupportFirst = missing || canceled;

  const title = missing
    ? 'No encontramos tu membresía'
    : canceled
    ? 'Tu membresía está suspendida'
    : 'No pudimos cobrar tu renovación';

  const text = missing
    ? 'Tu cuenta se creó con tu pago, pero no vemos una membresía activa asociada. Puede ser un error de nuestra parte: escríbenos y lo revisamos. No vuelvas a pagar.'
    : canceled
    ? 'Tu acceso fue suspendido por el equipo. Escríbenos y te contamos cómo reactivarlo. Tu cuenta y tu progreso siguen guardados.'
    : 'El cobro mensual de ePayco no se pudo completar, normalmente porque la tarjeta no tenía fondos o venció. Tu cuenta y tu progreso siguen guardados.';

  const supportMessage = missing
    ? `Hola, pagué la membresía de Libre de Ansiedad pero mi cuenta aparece sin membresía activa. Mi correo es ${email}`
    : canceled
    ? `Hola, mi membresía de Libre de Ansiedad aparece suspendida y quiero reactivarla. Mi correo es ${email}`
    : `Hola, mi membresía de Libre de Ansiedad está suspendida por un pago fallido. Quiero actualizar mi método de pago. Mi correo es ${email}`;

  const whatsappUpdate = 'https://wa.me/573117606107?text=' + encodeURIComponent(supportMessage);

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
        <a
          href={whatsappUpdate}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
        >
          <Icon name="whatsapp" className="h-5 w-5" />
          {missing ? 'Escribir para revisar mi cuenta' : canceled ? 'Escribir para reactivarla' : 'Cambiar mi tarjeta o método de pago'}
        </a>
        <p className="text-center text-base text-body">
          {paymentFailed
            ? `Te ayudamos por WhatsApp (${CLINIC.phoneDisplay}) a actualizar el pago sin crear otra suscripción, para que no te cobren dos veces.`
            : `Te respondemos por WhatsApp (${CLINIC.phoneDisplay}). Tu mensaje ya incluye tu correo.`}
        </p>
      </div>

      {/* Aviso clave: mismo correo = misma cuenta (solo cuando tiene sentido volver a pagar) */}
      {!needsSupportFirst && (
      <div className="rounded-2xl border-2 border-ink/10 p-5">
        <p className="flex items-center gap-2 text-base font-semibold text-ink">
          <Icon name="mail" className="h-5 w-5 text-brand" />
          Si prefieres suscribirte de nuevo
        </p>
        <p className="mt-2 text-lg leading-relaxed text-body">
          Usa exactamente este correo en ePayco: <strong className="break-all text-ink">{email}</strong>. Así tu acceso se
          activa en esta misma cuenta y no se crea una nueva.
        </p>
        <p className="mt-3 text-base leading-relaxed text-body">
            Antes de suscribirte otra vez, escríbenos para cancelar la suscripción anterior y evitar un doble cobro.{' '}
            <Link href={EPAYCO_PLAN_URL} className="font-semibold text-ink underline underline-offset-4">
              Ir al pago de la membresía
            </Link>
        </p>
      </div>
      )}
    </div>
  );
}
