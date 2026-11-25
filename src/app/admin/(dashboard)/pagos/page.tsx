import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 0;

type Payload = Record<string, string | undefined>;

interface WebhookEvent {
  id: string;
  epayco_reference: string;
  status: 'pending' | 'processed' | 'failed';
  payload: Payload | null;
  error_message: string | null;
  created_at: string;
}

/** Resultado del cobro según ePayco (código de respuesta 1–4). */
function paymentResult(p: Payload) {
  const code = p.x_cod_response || p.x_cod_transaction_state || '';
  const text = p.x_response || p.response || '';
  if (code === '1' || /aceptad/i.test(text)) return { label: 'Aceptado', tone: 'bg-secondary/10 text-secondary border-secondary/20' };
  if (code === '3' || /pendiente/i.test(text)) return { label: 'Pendiente', tone: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (code === '2' || /rechazad/i.test(text)) return { label: 'Rechazado', tone: 'bg-error/10 text-error border-error/20' };
  if (code === '4' || /fallid/i.test(text)) return { label: 'Fallido', tone: 'bg-error/10 text-error border-error/20' };
  if (code === '6' || /reversad/i.test(text)) return { label: 'Reversado', tone: 'bg-error/10 text-error border-error/20' };
  return { label: text || 'Sin dato', tone: 'bg-surface-container-high text-on-surface-variant border-outline-variant/50' };
}

/** Qué hizo la plataforma con el aviso. */
function processingResult(event: WebhookEvent) {
  if (event.status === 'processed') return { label: 'Procesado', tone: 'text-secondary' };
  if (event.status === 'pending') return { label: 'En proceso', tone: 'text-amber-700' };
  if (event.error_message?.startsWith('Omitido')) return { label: 'Omitido (otro servicio)', tone: 'text-on-surface-variant' };
  return { label: 'Error', tone: 'text-error' };
}

export default async function AdminPagosPage() {
  const { data, error } = await supabaseAdmin
    .from('webhook_events')
    .select('id, epayco_reference, status, payload, error_message, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const events = (data || []) as WebhookEvent[];
  const accepted = events.filter((e) => paymentResult(e.payload || {}).label === 'Aceptado').length;
  const withError = events.filter((e) => e.status === 'failed' && !e.error_message?.startsWith('Omitido')).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Pagos ePayco</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Cada aviso que ePayco envía cuando cobra (o intenta cobrar) una membresía. Últimos 100.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="font-label-xs text-on-surface-variant uppercase tracking-wider">Avisos</span>
            <span className="font-headline-sm text-primary font-bold">{events.length}</span>
          </div>
          <div className="h-10 w-px bg-outline-variant/50"></div>
          <div className="flex flex-col items-end">
            <span className="font-label-xs text-on-surface-variant uppercase tracking-wider">Aceptados</span>
            <span className="font-headline-sm text-secondary font-bold">{accepted}</span>
          </div>
          <div className="h-10 w-px bg-outline-variant/50"></div>
          <div className="flex flex-col items-end">
            <span className="font-label-xs text-on-surface-variant uppercase tracking-wider">Con error</span>
            <span className="font-headline-sm text-error font-bold">{withError}</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl">
          Error cargando los avisos de pago: {error.message}
        </div>
      ) : events.length === 0 ? (
        <div className="p-10 text-center bg-surface-container-lowest/90 rounded-3xl border border-outline-variant/30 text-on-surface-variant">
          Todavía no ha llegado ningún aviso de pago de ePayco.
        </div>
      ) : (
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Fecha</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Cliente</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Monto</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Cobro</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Plataforma</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider hidden md:table-cell">Ref. ePayco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {events.map((event) => {
                  const p = event.payload || {};
                  const name = `${p.x_customer_name || ''} ${p.x_customer_last_name || ''}`.trim();
                  const email = p.x_customer_email || p.email || p.customer_email || 'Sin correo';
                  const result = paymentResult(p);
                  const processing = processingResult(event);
                  const amount = p.x_amount || p.amount;
                  return (
                    <tr key={event.id} className="hover:bg-surface-container/30 transition-colors align-top">
                      <td className="p-4 font-body-sm text-on-surface whitespace-nowrap">
                        {format(new Date(event.created_at), "dd MMM yyyy, h:mm a", { locale: es })}
                      </td>
                      <td className="p-4">
                        <p className="font-label-md text-on-surface font-bold">{name || email.split('@')[0]}</p>
                        <p className="font-label-xs text-on-surface-variant">{email}</p>
                        {p.x_description && (
                          <p className="font-label-xs text-on-surface-variant/80 mt-1 max-w-[240px] truncate">{p.x_description}</p>
                        )}
                      </td>
                      <td className="p-4 font-body-sm text-on-surface whitespace-nowrap">
                        {amount ? `${amount} ${p.x_currency_code || p.currency || ''}` : '—'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full font-label-xs font-bold border ${result.tone}`}>
                          {result.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className={`font-label-sm font-bold ${processing.tone}`}>{processing.label}</p>
                        {event.error_message && processing.label === 'Error' && (
                          <p className="font-label-xs text-on-surface-variant mt-1 max-w-[260px]">{event.error_message}</p>
                        )}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {event.epayco_reference}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-outline-variant/30 font-label-xs text-on-surface-variant text-center">
            <strong>Cobro</strong> es lo que respondió ePayco. <strong>Plataforma</strong> es lo que hizo la página con el aviso:
            &quot;Procesado&quot; significa que la membresía se activó o renovó.
          </div>
        </div>
      )}
    </div>
  );
}
