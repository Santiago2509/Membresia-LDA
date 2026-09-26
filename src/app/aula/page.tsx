import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Link from 'next/link';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 60; // Revalida cada 60s en vez de nunca cachear

export default async function AulaDashboard() {
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

  const { data: { user } } = await supabase.auth.getUser();

  // Queries en paralelo — antes eran secuenciales (3x más lento)
  const [profileResult, contentsResult] = await Promise.all([
    user
      ? supabase.from('profiles').select('full_name, email').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    supabase.from('content').select('*').order('created_at', { ascending: false }).limit(3),
  ]);

  const profile = profileResult.data;
  const contents = contentsResult.data;

  let displayName = 'Usuario';
  if (profile) {
    displayName = profile.full_name || profile.email?.split('@')[0] || 'Usuario';
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
      
      {/* Welcome Banner - Premium Gradient with Glass Elements */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
         {/* Background gradients */}
         <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full"></div>
         
         <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row justify-between sm:items-center gap-8">
            <div className="space-y-2 max-w-lg">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white font-label-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                  Plan Premium
               </div>
               <h1 className="font-display-sm text-white font-bold tracking-tight">Hola, {displayName}</h1>
               <p className="font-body-md text-white/90">
                  Has mantenido una racha increíble. Sigue invirtiendo en tu bienestar emocional, paso a paso.
               </p>
            </div>
            
            {/* Circular Progress Widget - Glassmorphism */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
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
                        className="text-secondary-fixed drop-shadow-[0_0_8px_rgba(186,230,253,0.8)]" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeDasharray="75, 100" 
                        strokeLinecap="round" 
                        strokeWidth="3.5"
                     />
                  </svg>
                  <span className="absolute font-title-sm text-white font-bold">75%</span>
               </div>
               <div className="flex flex-col">
                  <span className="font-label-md text-white font-bold">Meta semanal</span>
                  <span className="font-label-xs text-white/80">3/4 sesiones completadas</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Watching Section */}
            <section>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="font-title-lg text-primary font-bold">Contenido Reciente</h2>
               </div>
               
               <div className="space-y-4">
                 {contents && contents.length > 0 ? contents.map(item => (
                   <Link href={`/aula/contenido/${item.id}`} key={item.id}>
                     <div className="group relative rounded-3xl bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
                        <div className="absolute top-0 left-0 w-1 bg-secondary h-full"></div>
                        
                        <div className="p-6 flex flex-col sm:flex-row gap-6">
                           <div className="w-full sm:w-48 h-32 rounded-xl bg-surface-container-high relative overflow-hidden shrink-0 group-hover:shadow-lg transition-shadow">
                              {item.thumbnail_url ? (
                                <img src={item.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant">image</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[28px] ml-1">play_arrow</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex-1 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">{item.category}</span>
                                 <span className="text-label-xs text-on-surface-variant font-medium uppercase">{item.type}</span>
                              </div>
                              <h3 className="font-title-md text-on-surface font-bold leading-tight group-hover:text-primary transition-colors">
                                 {item.title}
                              </h3>
                              <p className="font-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                 {item.description}
                              </p>
                           </div>
                        </div>
                     </div>
                   </Link>
                 )) : (
                   <div className="p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-3xl">No hay contenido disponible aún.</div>
                 )}
               </div>
            </section>

            {/* Recommended Resources Grid */}
            <section>
               <h2 className="font-title-lg text-primary font-bold mb-4">Recomendado para ti</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                        <span className="material-symbols-outlined">headphones</span>
                     </div>
                     <div>
                        <h4 className="font-label-md font-bold text-on-surface group-hover:text-primary transition-colors">Meditación guiada</h4>
                        <p className="font-body-sm text-on-surface-variant mt-1 text-sm line-clamp-2">Audio de 10 min para centrar la respiración antes de dormir.</p>
                     </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                     <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined">edit_note</span>
                     </div>
                     <div>
                        <h4 className="font-label-md font-bold text-on-surface group-hover:text-primary transition-colors">Diario Emocional</h4>
                        <p className="font-body-sm text-on-surface-variant mt-1 text-sm line-clamp-2">Plantilla PDF descargable para registro cognitivo semanal.</p>
                     </div>
                  </div>
               </div>
            </section>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            
            {/* Live Session Widget */}
            <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 blur-2xl rounded-full"></div>
               
               <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                  <span className="font-label-xs font-bold text-error uppercase tracking-wider">Próximamente</span>
               </div>
               
               <h3 className="font-title-md font-bold text-primary mb-2">Q&A en Vivo: Gestión del Estrés</h3>
               <p className="font-body-sm text-on-surface-variant mb-6">Únete a la sesión mensual exclusiva para miembros premium con la Dra. Martínez.</p>
               
               <div className="bg-surface-container p-4 rounded-2xl flex items-center justify-between mb-4">
                  <div>
                     <p className="font-label-xs text-on-surface-variant uppercase font-bold">Jueves, 24 Oct</p>
                     <p className="font-title-sm text-on-surface font-bold">18:00 hrs</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center">
                     <span className="material-symbols-outlined text-on-surface-variant text-[20px]">calendar_today</span>
                  </div>
               </div>
               
               <button className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-label-md font-bold hover:bg-surface-container-highest transition-colors">
                  Añadir al calendario
               </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
               <h3 className="font-title-sm text-on-surface font-bold mb-4">Tu Impacto</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                        </div>
                        <span className="font-label-sm text-on-surface-variant">Días seguidos</span>
                     </div>
                     <span className="font-title-sm text-on-surface font-bold">4</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                           <span className="material-symbols-outlined text-[16px]">timer</span>
                        </div>
                        <span className="font-label-sm text-on-surface-variant">Min. aprendizaje</span>
                     </div>
                     <span className="font-title-sm text-on-surface font-bold">185</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                           <span className="material-symbols-outlined text-[16px]">task_alt</span>
                        </div>
                        <span className="font-label-sm text-on-surface-variant">Módulos listos</span>
                     </div>
                     <span className="font-title-sm text-on-surface font-bold">2</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
      
    </div>
  );
}
