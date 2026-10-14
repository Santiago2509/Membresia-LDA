import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ContentCard from '@/components/ContentCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Datos frescos de sesión y contenidos

export default async function AulaDashboard() {
  const cookieStore = await cookies();
  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";
  
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
                Obtener Membresía ($30 USD)
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
    );
  }

  // =========================================================================
  // CASO 2: USUARIO AUTENTICADO
  // Verificar permisos (Admin o Membresía Activa)
  // =========================================================================
  const [profileResult, adminResult, membershipResult, contentsResult] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', user.id).single(),
    supabaseAdmin.from('admins').select('id').eq('id', user.id).single(),
    supabaseAdmin.from('memberships').select('*').eq('user_id', user.id).single(),
    supabaseAdmin.from('content').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const profile = profileResult.data;
  const adminRecord = adminResult.data;
  const membership = membershipResult.data;
  const contents = contentsResult.data || [];

  const isAdmin = 
    adminRecord !== null || 
    profile?.role === 'admin' || 
    ['santiago@gmail.com', 'adminlibredeansiedad@gmail.com', 'admin@serenamente.com'].includes(user.email || '');

  let hasActiveMembership = isAdmin;

  if (!isAdmin && membership && membership.status === 'active') {
    const isExpired = membership.current_period_end 
      ? new Date(membership.current_period_end) < new Date() 
      : false;
    if (!isExpired) {
      hasActiveMembership = true;
    }
  }

  let displayName = profile?.full_name || user.email?.split('@')[0] || 'Miembro';

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
              Activar Membresía ($30 USD/mes)
            </Link>
            <Link 
              href="/api/auth/signout"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-neutral-600 hover:bg-neutral-100 font-bold text-sm transition-colors"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUB-CASO 2A: USUARIO AUTENTICADO CON MEMBRESÍA ACTIVA O ADMIN
  // Renderiza el Aula Virtual Completa
  // =========================================================================
  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-16">
      
      {/* Welcome Banner - Premium Gradient con Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
         <div className="absolute inset-0 bg-gradient-to-br from-[#133a73] via-[#001531] to-[#12a04a]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full"></div>
         
         <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row justify-between sm:items-center gap-8">
            <div className="space-y-2 max-w-lg">
               <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-label-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isAdmin ? 'Panel de Administrador' : 'Plan Premium Activo'}</span>
               </div>
               <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight">
                Hola, {displayName}
               </h1>
               <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  Has mantenido una constancia increíble. Sigue invirtiendo en tu bienestar emocional, paso a paso.
               </p>
            </div>
            
            {/* Widget Circular de Progreso */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] shrink-0">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                     <path 
                        className="text-white/20" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3.5"
                     />
                     <path 
                        className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeDasharray="75, 100" 
                        strokeLinecap="round" 
                        strokeWidth="3.5"
                     />
                  </svg>
                  <span className="absolute text-sm text-white font-bold">75%</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Meta Semanal</span>
                  <span className="text-xs text-white/80">3/4 sesiones realizadas</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Columna Principal: Contenido Reciente y Recomendaciones */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Contenido Reciente */}
            <section className="space-y-4">
               <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold text-[#001531] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">play_circle</span>
                    <span>Tus Lecciones y Actualizaciones</span>
                  </h2>
                  <Link href="/catalogo" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span>Ver todo</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {contents.length > 0 ? contents.slice(0, 4).map(item => (
                   <ContentCard key={item.id} item={item} />
                 )) : (
                   <div className="col-span-2 p-8 text-center text-neutral-500 bg-white rounded-3xl border border-black/5">
                    No hay contenidos disponibles en este momento.
                   </div>
                 )}
               </div>
            </section>

            {/* Recursos Recomendados */}
            <section className="space-y-4">
               <h2 className="text-lg font-bold text-[#001531]">Recomendado para tu tranquilidad</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/catalogo" className="bg-white border border-black/8 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">headphones</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary transition-colors">
                          Meditación de Calma
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          Audio de 10 minutos para regular el sistema nervioso y disminuir la taquicardia.
                        </p>
                     </div>
                  </Link>

                  <Link href="/catalogo" className="bg-white border border-black/8 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">edit_note</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-sm text-neutral-900 group-hover:text-primary transition-colors">
                          Registro Cognitivo
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          Guía clínica descargable para identificar y reestructurar pensamientos intrusivos.
                        </p>
                     </div>
                  </Link>
               </div>
            </section>
         </div>

         {/* Barra Lateral: Próximas Sesiones y Estadísticas */}
         <div className="space-y-6">
            
            {/* Widget de Sesión en Vivo */}
            <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4">
               <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                    Sesión Mensual en Vivo
                  </span>
               </div>
               
               <h3 className="font-bold text-base text-[#001531] leading-snug">
                Q&A Clínico: Gestión de Crisis de Pánico
               </h3>
               
               <p className="text-xs text-neutral-600 leading-relaxed">
                Sesión grupal exclusiva para miembros premium con el Psicólogo Nelson Arturo para responder dudas en vivo.
               </p>
               
               <div className="bg-neutral-50 p-4 rounded-2xl flex items-center justify-between border border-black/5">
                  <div>
                     <p className="text-[11px] text-neutral-500 uppercase font-bold">Próximo Jueves</p>
                     <p className="text-sm font-bold text-neutral-900">18:00 hrs (Col / Mex)</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-neutral-600 shadow-sm">
                     <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
               </div>
               
               <Link 
                href="/contacto"
                className="w-full py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#001531] font-bold text-xs flex items-center justify-center transition-colors"
               >
                  Enviar Pregunta para el En Vivo
               </Link>
            </div>

            {/* Estadísticas de Constancia */}
            <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm space-y-4">
               <h3 className="font-bold text-sm text-neutral-900">Tu Progreso</h3>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-black/5">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                           <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                        </div>
                        <span className="text-xs font-medium text-neutral-600">Días seguidos</span>
                     </div>
                     <span className="text-xs font-bold text-neutral-900">4 días</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-black/5">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#133a73]">
                           <span className="material-symbols-outlined text-[16px]">timer</span>
                        </div>
                        <span className="text-xs font-medium text-neutral-600">Minutos dedicados</span>
                     </div>
                     <span className="text-xs font-bold text-neutral-900">185 min</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <span className="material-symbols-outlined text-[16px]">task_alt</span>
                        </div>
                        <span className="text-xs font-medium text-neutral-600">Módulos explorados</span>
                     </div>
                     <span className="text-xs font-bold text-neutral-900">2 lecciones</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
      
    </div>
  );
}
