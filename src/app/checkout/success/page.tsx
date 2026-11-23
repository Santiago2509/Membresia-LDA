import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { CLINIC } from '@/lib/clinic';

const nextSteps = [
  {
    title: 'Revisa tu correo',
    text: 'En unos minutos te llega un correo con tu usuario y tu contraseña temporal. Mira también en spam o promociones.',
  },
  {
    title: 'Inicia sesión',
    text: 'Entra con ese correo y esa contraseña. Si ya tenías cuenta, usa tu contraseña de siempre.',
  },
  {
    title: 'Empieza a tu ritmo',
    text: 'Dentro del aula encuentras todo el material. Puedes cambiar tu contraseña desde Mi perfil.',
  },
];

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-16 pt-28">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-calm text-white">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">¡Gracias! Tu pago fue recibido</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">
          Tu membresía se está activando. Puede tardar unos minutos mientras ePayco nos confirma el pago.
        </p>

        <ol className="mt-10 space-y-6">
          {nextSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg text-white">
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-1 text-lg leading-relaxed text-body">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white hover:bg-brand"
          >
            Ir a iniciar sesión
            <Icon name="arrow-right" className="h-5 w-5" />
          </Link>
          <a
            href={CLINIC.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-7 text-lg font-semibold text-ink hover:border-ink"
          >
            <Icon name="whatsapp" className="h-5 w-5 text-[#1f9d55]" />
            ¿No te llegó? Escríbenos
          </a>
        </div>
      </div>
    </div>
  );
}
