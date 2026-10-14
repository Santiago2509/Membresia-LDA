'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEmbedUrl } from '@/lib/videoUtils';
import { createSupabaseBrowserClient } from '@/lib/supabase';

interface LessonViewProps {
  contentId: string;
  initialContent: any;
  initialHasAccess: boolean;
  initialRequireLogin: boolean;
}

export default function LessonView({
  contentId,
  initialContent,
  initialHasAccess,
  initialRequireLogin,
}: LessonViewProps) {
  const [hasAccess, setHasAccess] = useState(initialHasAccess);
  const [requireLogin, setRequireLogin] = useState(initialRequireLogin);
  const [content, setContent] = useState(initialContent);
  const [isCheckingClient, setIsCheckingClient] = useState(!initialHasAccess);
  const [isExpired, setIsExpired] = useState(false);

  const epaycoPlanUrl = "https://subscription-landing.epayco.co/plan/a29e87ce7cb8b4eef061e42";

  useEffect(() => {
    // Si el servidor ya validó el acceso, no necesitamos hacer nada más
    if (initialHasAccess) {
      setIsCheckingClient(false);
      return;
    }

    let isMounted = true;

    async function verifyClientSession() {
      try {
        const supabase = createSupabaseBrowserClient();
        
        // 1. Obtener la sesión activa del navegador (localStorage / cookies)
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          // El usuario realmente no ha iniciado sesión en este navegador
          if (isMounted) {
            setRequireLogin(true);
            setHasAccess(false);
            setIsCheckingClient(false);
          }
          return;
        }

        // 2. Validar con nuestro backend seguro enviando el Bearer Token del usuario
        const response = await fetch('/api/content/access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ contentId }),
        });

        if (!response.ok) {
          throw new Error('Error al consultar permisos');
        }

        const result = await response.json();

        if (!isMounted) return;

        if (result.authorized) {
          // Acceso concedido al usuario activo
          setContent(result.content);
          setHasAccess(true);
          setRequireLogin(false);
          setIsExpired(false);
        } else if (result.subscriptionExpired) {
          // Usuario autenticado pero su membresía expiró
          setHasAccess(false);
          setRequireLogin(false);
          setIsExpired(true);
        } else {
          // No autorizado
          setHasAccess(false);
          setRequireLogin(result.requireLogin ?? true);
        }
      } catch (err) {
        console.error('Error al sincronizar acceso en cliente:', err);
        if (isMounted) {
          setRequireLogin(true);
          setHasAccess(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingClient(false);
        }
      }
    }

    verifyClientSession();

    return () => {
      isMounted = false;
    };
  }, [contentId, initialHasAccess]);

  const embedUrl = content?.url ? getEmbedUrl(content.url) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Navegación y retorno */}
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/catalogo" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-black/10 text-neutral-700 hover:text-neutral-900 transition-colors shadow-sm text-xs font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver al Catálogo</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {content?.category && (
            <span className="px-3 py-1 rounded-full bg-white/90 border border-black/8 text-[#133a73] shadow-sm">
              {content.category}
            </span>
          )}
          {content?.is_premium ? (
            <span className="px-2.5 py-1 rounded-full bg-[#001531] text-amber-300 flex items-center gap-1 shadow-sm font-bold text-[11px]">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>Premium</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white flex items-center gap-1 shadow-sm font-bold text-[11px]">
              <span className="material-symbols-outlined text-[13px]">public</span>
              <span>Gratis</span>
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          ESTADO 1: VERIFICANDO ACCESO (Solo visible una fracción de segundo si hubo desincronización)
          ========================================================================= */}
      {isCheckingClient ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-black/10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-semibold text-neutral-600">
            Verificando tu acceso de miembro...
          </p>
        </div>
      ) : hasAccess ? (
        /* =========================================================================
            ESTADO 2: CONTENIDO DESBLOQUEADO (El usuario ya inició sesión y está activo)
            Texto inicial -> Video en el centro -> Título y texto explicativo posterior
            ========================================================================= */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-8">
          
          {/* 1. Texto al Inicio (Antes del video - Reflexión / Bienvenida) */}
          {content?.body && (
            <article className="prose prose-slate prose-base sm:prose-lg max-w-none 
              prose-p:text-neutral-800 prose-p:leading-relaxed prose-p:my-3
              prose-headings:text-[#001531] prose-headings:font-bold 
              prose-a:text-[#133a73] hover:prose-a:underline prose-a:font-bold
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-blockquote:border-l-[#133a73] prose-blockquote:text-neutral-600 prose-blockquote:italic">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="whitespace-pre-line mb-3">{children}</p>,
                }}
              >
                {content.body}
              </ReactMarkdown>
            </article>
          )}

          {/* 2. Video Intermedio En el Centro (YouTube / Vimeo) */}
          {embedUrl ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-black/10 relative bg-black my-6">
              <iframe 
                src={embedUrl} 
                className="w-full h-full border-0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={content?.title || 'Video de la lección'}
              />
            </div>
          ) : content?.thumbnail_url && !content?.body ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-black/10 relative bg-neutral-100 my-6">
              <img 
                src={content.thumbnail_url} 
                alt={content.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : null}

          {/* 3. Título de la Lección y Explicación Posterior */}
          <div className="space-y-4 pt-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#001531] font-bold tracking-tight leading-tight">
              {content?.title}
            </h1>

            {content?.description && (
              <p className="text-sm sm:text-base text-neutral-600 italic border-l-4 border-[#133a73] pl-4 py-1">
                {content.description}
              </p>
            )}

            {/* Texto posterior al video (Explicación detallada, ejercicios, conclusiones) */}
            {content?.body_after && (
              <article className="prose prose-slate prose-base sm:prose-lg max-w-none pt-4 border-t border-black/5
                prose-p:text-neutral-800 prose-p:leading-relaxed prose-p:my-3
                prose-headings:text-[#001531] prose-headings:font-bold 
                prose-a:text-[#133a73] hover:prose-a:underline prose-a:font-bold
                prose-strong:text-neutral-900 prose-strong:font-bold
                prose-blockquote:border-l-[#12a04a] prose-blockquote:text-neutral-600">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="whitespace-pre-line mb-3">{children}</p>,
                  }}
                >
                  {content.body_after}
                </ReactMarkdown>
              </article>
            )}
          </div>

          {/* 4. Enlace / Botón Final de la Lección (Opcional) */}
          {content?.resource_url && (
            <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 p-6 rounded-2xl">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">
                  {content.resource_title || 'Material Complementario'}
                </h4>
                <p className="text-xs text-neutral-500">
                  Accede a los recursos adjuntos recomendados para esta sesión.
                </p>
              </div>

              <a 
                href={content.resource_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#133a73] text-white font-label-md text-xs sm:text-sm font-bold hover:bg-[#001531] transition-all shadow-md hover:-translate-y-0.5 shrink-0"
              >
                <span>{content.resource_title || 'Abrir Recurso'}</span>
                <span className="material-symbols-outlined text-[18px]">download</span>
              </a>
            </div>
          )}

        </div>
      ) : (
        /* =========================================================================
            ESTADO 3: BLOQUEO (Solo para visitantes que NO han iniciado sesión o membresía vencida)
            ========================================================================= */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-black/10 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-[#133a73]">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-headline-sm text-xl font-bold text-[#001531]">
              Contenido Exclusivo para Miembros
            </h2>
            <p className="font-body-md text-sm text-neutral-600">
              {isExpired 
                ? 'Tu periodo de membresía ha concluido. Renueva para continuar disfrutando del acompañamiento y las lecciones.'
                : 'Esta lección forma parte de la membresía premium. Suscríbete o inicia sesión para acceder a todo el material.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            {requireLogin ? (
              <Link 
                href={`/login?redirect=/aula/contenido/${contentId}`} 
                className="w-full sm:w-auto px-7 py-3.5 bg-[#133a73] text-white rounded-full font-label-md text-sm font-bold hover:bg-[#001531] transition-all shadow-md"
              >
                Iniciar sesión para acceder
              </Link>
            ) : (
              <Link 
                href={epaycoPlanUrl}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#133a73] text-white rounded-full font-label-md text-sm font-bold hover:bg-[#001531] transition-all shadow-md"
              >
                {isExpired ? 'Renovar Membresía ($30 USD/mes)' : 'Adquirir Membresía ($30 USD/mes)'}
              </Link>
            )}
            
            <Link 
              href="/catalogo" 
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-neutral-700 hover:bg-neutral-100 font-label-md text-sm font-semibold transition-colors"
            >
              Ver otros contenidos
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
