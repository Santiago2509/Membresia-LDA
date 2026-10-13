import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const revalidate = 0; // Datos frescos en cada carga

export default async function AdminDashboard() {
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

  // Obtener nombre del admin
  const { data: { user } } = await supabase.auth.getUser();

  // Consultas en paralelo con supabaseAdmin para tener datos reales completos
  const [profileResult, membershipsResult, contentCountResult] = await Promise.all([
    user
      ? supabaseAdmin.from('profiles').select('full_name, email').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    supabaseAdmin
      .from('memberships')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('content')
      .select('*', { count: 'exact', head: true }),
  ]);

  let adminName = 'Admin';
  if (profileResult.data) {
    adminName = profileResult.data.full_name || profileResult.data.email?.split('@')[0] || 'Admin';
  }

  const memberships = membershipsResult.data || [];
  const suscriptoresTotales = memberships.length;
  const suscriptoresActivos = memberships.filter(m => m.status === 'active').length;
  const pagosFallidos = memberships.filter(m => m.status === 'past_due').length;
  const cursosActivos = contentCountResult.count ?? 0;

  // Suscriptores recientes (máximo los últimos 5)
  const recientes = memberships.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header with Search and Profile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
         <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Dashboard General</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Hola {adminName}, aquí está el resumen en vivo de Libre de Ansiedad.</p>
         </div>
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/admin/contenido/nuevo"
              className="px-4 py-2 bg-primary text-on-primary rounded-full font-label-sm font-bold flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Subir Contenido</span>
            </Link>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center border-2 border-surface shrink-0 shadow-sm">
               <span className="font-label-sm text-secondary font-bold">{adminName.substring(0, 2).toUpperCase()}</span>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Suscriptores */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary-container/30 blur-2xl group-hover:bg-primary-container/50 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">groups</span>
             </div>
             <Link href="/admin/suscriptores" className="text-label-xs font-bold text-secondary hover:underline">
               Ver todos
             </Link>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{suscriptoresTotales}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Suscriptores Registrados</p>
          </div>
        </div>

        {/* Suscriptores Activos */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary/10 blur-2xl group-hover:bg-secondary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
             </div>
             <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-xs font-bold">
               Con Acceso
             </span>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-secondary font-bold">{suscriptoresActivos}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Membresías Activas</p>
          </div>
        </div>

        {/* Contenidos Activos */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">school</span>
             </div>
             <Link href="/admin/contenido" className="text-label-xs font-bold text-secondary hover:underline">
               Gestionar
             </Link>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{cursosActivos}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Contenidos Publicados</p>
          </div>
        </div>

        {/* Pagos Fallidos */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-error/5 blur-2xl group-hover:bg-error/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[20px]">warning</span>
             </div>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{pagosFallidos}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Pagos Fallidos / Pendientes</p>
          </div>
        </div>
      </div>

      {/* Recent Subscribers Section */}
      <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
           <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Suscriptores Recientes</h2>
              <p className="text-label-sm text-on-surface-variant mt-1">Últimos registros en la plataforma</p>
           </div>
           {recientes.length > 0 && (
             <Link 
               href="/admin/suscriptores"
               className="text-secondary font-label-sm font-bold hover:underline flex items-center gap-1"
             >
               Ver todos ({suscriptoresTotales})
               <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
             </Link>
           )}
        </div>

        {recientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Paciente</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Estado</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Fecha Registro</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {recientes.map((sub) => {
                  const profile = sub.profiles as any;
                  const email = profile?.email || 'Sin correo';
                  const name = profile?.full_name || email.split('@')[0];
                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <tr key={sub.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="font-label-md text-on-surface font-bold">{name}</p>
                            <p className="font-label-xs text-on-surface-variant">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {sub.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-label-xs font-bold border border-secondary/20">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            Activo
                          </span>
                        ) : sub.status === 'past_due' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error font-label-xs font-bold">
                            Pago Fallido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-xs font-bold">
                            {sub.status === 'canceled' ? 'Cancelado' : sub.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-body-sm text-on-surface-variant">
                        {sub.created_at ? format(new Date(sub.created_at), 'dd MMM yyyy, HH:mm', { locale: es }) : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          href="/admin/suscriptores"
                          className="font-label-xs text-secondary font-bold hover:underline"
                        >
                          Administrar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant text-[28px]">group_off</span>
             </div>
             <h3 className="font-title-md text-on-surface font-bold">Aún no hay suscriptores</h3>
             <p className="text-body-sm text-on-surface-variant mt-2 max-w-sm">Cuando los pacientes completen el pago en ePayco aparecerán aquí automáticamente.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
