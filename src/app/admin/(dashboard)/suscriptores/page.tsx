import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SuspendButton } from './SuspendButton';
import { countMembershipStates, getMembershipState, MEMBERSHIP_STATE_LABEL, type MembershipState } from '@/lib/membership';

const STATE_BADGE: Record<MembershipState, { box: string; dot: string }> = {
  al_dia: { box: 'bg-secondary/10 text-secondary border-secondary/20', dot: 'bg-secondary animate-pulse' },
  vencida: { box: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  pago_fallido: { box: 'bg-error/10 text-error border-error/20', dot: 'bg-error' },
  suspendida: { box: 'bg-surface-container-high text-on-surface-variant border-outline-variant/50', dot: 'bg-on-surface-variant' },
  incompleta: { box: 'bg-surface-container-high text-on-surface-variant border-outline-variant/50', dot: 'bg-on-surface-variant' },
};

export const revalidate = 0;

export default async function AdminSuscriptoresPage() {
  // Fetch memberships joined with profiles
  const { data: memberships, error } = await supabaseAdmin
    .from('memberships')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false });

  // Estadísticas
  // Al día = pagada y vigente; Pendientes de pago = vencida o cobro fallido; Suspendidas = por un admin
  const counts = countMembershipStates(memberships || []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Suscriptores</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Gestiona los miembros de la plataforma y el estado de sus membresías.
          </p>
        </div>
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          {[
            { label: 'Total', value: counts.total, color: 'text-primary' },
            { label: 'Al día', value: counts.al_dia, color: 'text-secondary' },
            { label: 'Pendientes de pago', value: counts.pendientes, color: 'text-amber-700' },
            { label: 'Suspendidas', value: counts.suspendidas, color: 'text-error' },
          ].map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-5 sm:gap-6">
              {index > 0 && <div className="h-10 w-px bg-outline-variant/50"></div>}
              <div className="flex flex-col items-end">
                <span className="font-label-xs text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
                <span className={`font-headline-sm font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl">
          Error cargando suscriptores: {error.message}
        </div>
      ) : memberships && memberships.length > 0 ? (
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Paciente</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Estado</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Vence / Venció</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden md:table-cell">Ref. ePayco</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {memberships.map((sub) => {
                  const profile = sub.profiles as any;
                  const email = profile?.email || 'Sin correo';
                  const name = profile?.full_name || email.split('@')[0];
                  const initial = name.charAt(0).toUpperCase();
                  
                  const state = getMembershipState(sub);
                  // Verificar si ya venció
                  const isExpired = sub.current_period_end 
                    ? new Date(sub.current_period_end) < new Date() 
                    : false;
                  
                  return (
                    <tr key={sub.id} className="hover:bg-surface-container/30 transition-colors">
                      {/* Paciente */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-label-md text-on-surface font-bold">{name}</p>
                            <p className="font-label-xs text-on-surface-variant">{email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-xs font-bold border ${STATE_BADGE[state].box}`}>
                          <span className={`w-2 h-2 rounded-full ${STATE_BADGE[state].dot}`}></span>
                          {MEMBERSHIP_STATE_LABEL[state]}
                        </span>
                      </td>

                      {/* Vencimiento */}
                      <td className="p-4 font-body-sm text-on-surface-variant">
                        {sub.current_period_end ? (
                          <span className={isExpired ? 'text-error font-semibold' : ''}>
                            {format(new Date(sub.current_period_end), "dd 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>

                      {/* Ref. ePayco */}
                      <td className="p-4 hidden md:table-cell">
                        <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {sub.epayco_subscription_id ? 
                            `...${sub.epayco_subscription_id.slice(-8)}` : 
                            'N/A'
                          }
                        </span>
                      </td>

                      {/* Acción */}
                      <td className="p-4">
                        <SuspendButton membershipId={sub.id} currentStatus={sub.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer de la tabla */}
          <div className="px-4 py-3 bg-surface-container/30 border-t border-outline-variant/30 text-right">
            <p className="font-label-xs text-on-surface-variant">
              Los estados se actualizan automáticamente con los avisos de ePayco (ver Pagos ePayco). Para detener cobros, gestiona la suscripción en el panel de ePayco.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-20 bg-surface-container-lowest/50 rounded-3xl border border-dashed border-outline-variant/50">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <h3 className="font-title-lg text-on-surface font-bold">Aún no hay suscriptores</h3>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
            Cuando tus pacientes compren la membresía, aparecerán aquí automáticamente.
          </p>
        </div>
      )}
    </div>
  );
}
