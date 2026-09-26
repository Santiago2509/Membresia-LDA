import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 30; // Revalida cada 30s

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

  // Queries en paralelo — antes eran secuenciales
  const [profileResult, cursosResult] = await Promise.all([
    user
      ? supabase.from('profiles').select('full_name, email').eq('id', user.id).single()
      : Promise.resolve({ data: null, count: null }),
    supabase.from('content').select('*', { count: 'exact', head: true }),
  ]);

  let adminName = 'Admin';
  if (profileResult.data) {
    adminName = profileResult.data.full_name || profileResult.data.email?.split('@')[0] || 'Admin';
  }
  const cursosActivos = cursosResult.count ?? 0;

  // NOTA: Para contar suscriptores reales e ingresos necesitamos la SUPABASE_SERVICE_ROLE_KEY
  // y conectar ePayco. Por ahora mostramos los valores reales (0) hasta implementar ePayco.
  const suscriptoresTotales = 0;
  const ingresosMRR = 0;
  const pagosFallidos = 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header with Search and Profile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
         <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Dashboard General</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Hola {adminName}, aquí está el resumen de Libre de Ansiedad.</p>
         </div>
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
               </div>
               <input type="text" placeholder="Buscar usuarios, cursos..." className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/50 rounded-full text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" />
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center border-2 border-surface shrink-0 shadow-sm cursor-pointer">
               <span className="font-label-sm text-secondary font-bold">{adminName.substring(0, 2).toUpperCase()}</span>
            </div>
         </div>
      </div>

      {/* Stats Cards - Premium Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary-container/30 blur-2xl group-hover:bg-primary-container/50 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
             </div>
             {suscriptoresTotales === 0 && <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-xs font-bold">Esperando ePayco</span>}
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{suscriptoresTotales}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Suscriptores Totales</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary/10 blur-2xl group-hover:bg-secondary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
             </div>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">${ingresosMRR}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Ingresos (MRR)</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">school</span>
             </div>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{cursosActivos || 0}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Contenidos Activos</p>
          </div>
        </div>

         <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-error/5 blur-2xl group-hover:bg-error/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[20px]">warning</span>
             </div>
          </div>
          <div className="relative z-10">
             <p className="font-headline-lg text-headline-lg text-on-surface font-bold">{pagosFallidos}</p>
             <p className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-1">Pagos Fallidos</p>
          </div>
        </div>
      </div>

      {/* Main Activity Chart / Table Area */}
      <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
           <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold">Suscriptores Recientes</h2>
              <p className="text-label-sm text-on-surface-variant mt-1">Últimos registros via ePayco</p>
           </div>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-center items-center text-center min-h-[300px]">
           <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">group_off</span>
           </div>
           <h3 className="font-title-md text-on-surface font-bold">Aún no hay suscriptores</h3>
           <p className="text-body-sm text-on-surface-variant mt-2 max-w-sm">Conecta la pasarela de pagos de ePayco para empezar a ver los usuarios aquí.</p>
        </div>
      </div>
      
    </div>
  );
}
