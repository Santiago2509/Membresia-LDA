import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export const revalidate = 0;

function getEmbedUrl(url: string | null) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

export default async function ContenidoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
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

  // 1. Fetch content by ID usando supabaseAdmin para asegurar lectura
  const { data: content, error } = await supabaseAdmin
    .from('content')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !content) {
    notFound();
  }

  // 2. Verificar acceso si el contenido es Premium
  let hasAccess = !content.is_premium;
  let requireLogin = false;

  if (content.is_premium) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      requireLogin = true;
    } else {
      // Verificar si es admin (tiene acceso a todo)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        hasAccess = true;
      } else {
        // Verificar si tiene membresía activa en la tabla memberships
        const { data: membership } = await supabaseAdmin
          .from('memberships')
          .select('status, current_period_end')
          .eq('user_id', user.id)
          .single();

        if (membership && membership.status === 'active') {
          const isExpired = membership.current_period_end 
            ? new Date(membership.current_period_end) < new Date() 
            : false;
          if (!isExpired) {
            hasAccess = true;
          }
        }
      }
    }
  }

  const embedUrl = getEmbedUrl(content.url);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/aula" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div className="flex items-center gap-2 font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">
           <span className="text-secondary">{content.category}</span>
           <span className="material-symbols-outlined text-[16px]">chevron_right</span>
           <span>{content.type}</span>
        </div>
      </div>

      {/* Hero Media: Video player or Hero Image */}
      {hasAccess && embedUrl ? (
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-outline-variant/30 relative bg-black">
          <iframe 
            src={embedUrl} 
            className="w-full h-full border-0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title={content.title}
          />
        </div>
      ) : content.thumbnail_url ? (
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-outline-variant/30 relative bg-surface-container-high">
           <img 
            src={content.thumbnail_url} 
            alt={content.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      ) : null}

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display-sm text-primary font-bold tracking-tight">
            {content.title}
          </h1>
          {content.is_premium && (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-container text-primary shadow-sm" title="Contenido Premium">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </span>
          )}
        </div>
        
        {content.description && (
           <p className="font-body-lg text-on-surface-variant italic border-l-4 border-secondary pl-4 py-1">
             {content.description}
           </p>
        )}

        {/* External resource link if not video embed */}
        {hasAccess && content.url && !embedUrl && (
          <div className="pt-2">
            <a 
              href={content.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-sm font-bold hover:bg-secondary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>Abrir recurso / enlace externo</span>
            </a>
          </div>
        )}
      </div>

      {/* Markdown Body or Lock Screen */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden relative">
        
        {hasAccess ? (
          <div className="p-8 md:p-12">
            {content.body ? (
              <article className="prose prose-slate prose-lg max-w-none 
                 prose-headings:text-primary prose-headings:font-bold 
                 prose-a:text-secondary hover:prose-a:text-primary prose-a:font-bold prose-a:no-underline
                 prose-strong:text-on-surface prose-strong:font-bold
                 prose-li:marker:text-secondary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.body}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="text-center text-on-surface-variant py-10">
                <p>Este contenido no tiene cuerpo de texto adicional.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative p-10 md:p-20 flex flex-col items-center justify-center text-center bg-surface-container-lowest">
            {/* Blurry text background effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 select-none overflow-hidden flex flex-col gap-4 p-8 blur-[4px]">
              <div className="h-4 bg-outline-variant rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-outline-variant rounded w-full mx-auto"></div>
              <div className="h-4 bg-outline-variant rounded w-5/6 mx-auto"></div>
              <div className="h-4 bg-outline-variant rounded w-full mx-auto"></div>
              <div className="h-4 bg-outline-variant rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-outline-variant rounded w-4/5 mx-auto"></div>
            </div>
            
            <div className="relative z-10 max-w-md bg-surface-container-lowest/80 backdrop-blur-2xl p-8 rounded-3xl shadow-lg border border-outline-variant/30">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
                <span className="material-symbols-outlined text-[32px]">lock_person</span>
              </div>
              <h2 className="font-headline-sm text-on-surface font-bold mb-3">Contenido Exclusivo</h2>
              
              {requireLogin ? (
                <>
                  <p className="text-body-md text-on-surface-variant mb-6">
                    Inicia sesión o adquiere una membresía premium para acceder a este curso completo.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link href="/login" className="w-full py-3 bg-primary text-on-primary rounded-full font-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm">
                      Iniciar Sesión
                    </Link>
                    <Link href="/#membresia" className="w-full py-3 bg-surface-container text-on-surface rounded-full font-label-md font-bold hover:bg-surface-container-high transition-colors">
                      Ver Planes
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-body-md text-on-surface-variant mb-6">
                    Tu suscripción no está activa. Renueva tu plan premium para desbloquear este material.
                  </p>
                  <Link href="/#membresia" className="w-full inline-block py-3 bg-primary text-on-primary rounded-full font-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    Activar Membresía
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
