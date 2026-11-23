'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEmbedUrl } from '@/lib/videoUtils';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { EPAYCO_PLAN_URL, MEMBERSHIP_PRICE_LABEL } from '@/lib/membership';
import { Icon } from './ui/Icon';
import type { Components } from 'react-markdown';

// Estilos del texto de las lecciones (Markdown), legibles para todas las edades
const markdownComponents: Components = {
  h1: ({ children }) => <h2 className="mt-10 mb-4 font-display text-3xl leading-tight text-ink">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-10 mb-4 font-display text-3xl leading-tight text-ink">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 font-display text-2xl text-ink">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-6 mb-2 text-xl font-semibold text-ink">{children}</h4>,
  p: ({ children }) => <p className="my-5 whitespace-pre-line text-lg leading-[1.8] text-body sm:text-xl">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-7 text-lg leading-relaxed text-body marker:text-calm sm:text-xl">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-7 text-lg leading-relaxed text-body marker:font-semibold marker:text-ink sm:text-xl">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-4">{children}</a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-2xl border-l-4 border-calm bg-calm/10 px-6 py-2 text-ink">{children}</blockquote>
  ),
  hr: () => <hr className="my-10 border-ink/10" />,
  img: ({ src, alt }) => <img src={typeof src === 'string' ? src : undefined} alt={alt || ''} className="my-6 w-full rounded-2xl" />,
};

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

  const epaycoPlanUrl = EPAYCO_PLAN_URL;

  // Función para validar acceso con la sesión activa
  const checkSessionAccess = useCallback(async (session: any, isMounted: () => boolean) => {
    if (!session?.access_token || !session?.user) {
      if (isMounted()) {
        setRequireLogin(true);
        setHasAccess(false);
        setIsCheckingClient(false);
      }
      return;
    }

    const supabase = createSupabaseBrowserClient();

    try {
      // Intento 1: Validar vía API segura /api/content/access con Bearer Token
      const response = await fetch('/api/content/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ contentId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (!isMounted()) return;

        if (result.authorized) {
          setContent(result.content);
          setHasAccess(true);
          setRequireLogin(false);
          setIsExpired(false);
          setIsCheckingClient(false);
          return;
        } else if (result.subscriptionExpired) {
          setHasAccess(false);
          setRequireLogin(false);
          setIsExpired(true);
          setIsCheckingClient(false);
          return;
        }
      }
    } catch {
      // Fallback a consulta directa si la API tuvo problemas de red
    }

    // Intento 2 (Fallback directo con cliente autenticado de Supabase)
    try {
      const { data: membership } = await supabase
        .from('memberships')
        .select('status, current_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const { data: fullContent } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .maybeSingle();

      if (!isMounted()) return;

      if (membership && membership.status === 'active') {
        const expired = membership.current_period_end
          ? new Date(membership.current_period_end) < new Date()
          : false;

        if (!expired && fullContent) {
          setContent(fullContent);
          setHasAccess(true);
          setRequireLogin(false);
          setIsExpired(false);
          setIsCheckingClient(false);
          return;
        } else if (expired) {
          setIsExpired(true);
          setHasAccess(false);
          setRequireLogin(false);
          setIsCheckingClient(false);
          return;
        }
      }

      setHasAccess(false);
      setRequireLogin(false);
      setIsExpired(true);
    } catch {
      if (isMounted()) {
        setRequireLogin(true);
        setHasAccess(false);
      }
    } finally {
      if (isMounted()) {
        setIsCheckingClient(false);
      }
    }
  }, [contentId]);

  useEffect(() => {
    // Si el servidor ya validó el acceso inicialmente, no hay necesidad de esperar
    if (initialHasAccess) {
      setIsCheckingClient(false);
      return;
    }

    let mounted = true;
    const isMounted = () => mounted;
    const supabase = createSupabaseBrowserClient();

    // 1. Verificar sesión inmediata en caché
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      if (!mounted) return;
      if (data?.session) {
        checkSessionAccess(data.session, isMounted);
      } else {
        // Si no hay sesión inmediata, esperar un instante por onAuthStateChange
        setTimeout(() => {
          if (mounted && !hasAccess) {
            setIsCheckingClient(false);
          }
        }, 800);
      }
    });

    // 2. Escuchar evento de autenticación (garantiza captura cuando el cliente restaura la sesión)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!mounted) return;
      if (session) {
        checkSessionAccess(session, isMounted);
      } else {
        setRequireLogin(true);
        setHasAccess(false);
        setIsCheckingClient(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [contentId, initialHasAccess, checkSessionAccess, hasAccess]);

  const embedUrl = content?.url ? getEmbedUrl(content.url) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      {/* Volver */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/catalogo"
          className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-5 text-base font-semibold text-ink transition-colors hover:border-ink/40"
        >
          <Icon name="arrow-right" className="h-5 w-5 rotate-180" />
          Volver al catálogo
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {content?.category && (
            <span className="rounded-full bg-white px-3.5 py-1.5 text-brand">{content.category}</span>
          )}
          {content?.is_premium ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-white">
              <Icon name="lock" className="h-4 w-4" />
              Solo miembros
            </span>
          ) : (
            <span className="rounded-full bg-calm px-3.5 py-1.5 text-white">Gratis</span>
          )}
        </div>
      </div>

      {isCheckingClient ? (
        /* ESTADO 1: verificando acceso */
        <div className="space-y-4 rounded-[2rem] bg-white p-12 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-lg text-body">Verificando tu acceso…</p>
        </div>
      ) : hasAccess ? (
        /* ESTADO 2: contenido desbloqueado */
        <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_40px_rgba(11,31,58,0.06)]">
          <header className="px-6 pt-8 sm:px-12 sm:pt-12">
            <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.01em] text-ink sm:text-5xl">{content?.title}</h1>
            {content?.description && (
              <p className="mt-5 text-xl leading-relaxed text-body">{content.description}</p>
            )}
          </header>

          {embedUrl ? (
            <div className="mt-8 px-0 sm:px-12">
              <div className="relative aspect-video w-full overflow-hidden bg-black sm:rounded-2xl">
                <iframe
                  src={embedUrl}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={content?.title || 'Video de la lección'}
                />
              </div>
            </div>
          ) : content?.thumbnail_url ? (
            <div className="mt-8 px-0 sm:px-12">
              <img src={content.thumbnail_url} alt="" className="aspect-video w-full object-cover sm:rounded-2xl" />
            </div>
          ) : null}

          <div className="px-6 pb-10 pt-4 sm:px-12 sm:pb-14">
            {content?.body && (
              <div className="mx-auto max-w-[68ch]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {content.body}
                </ReactMarkdown>
              </div>
            )}

            {content?.body_after && (
              <div className="mx-auto mt-6 max-w-[68ch] border-t border-ink/10 pt-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {content.body_after}
                </ReactMarkdown>
              </div>
            )}

            {content?.resource_url && (
              <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-sun/15 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#b9771f]">
                    <Icon name="file" className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{content.resource_title || 'Material complementario'}</h2>
                    <p className="mt-1 text-base text-body">Descárgalo o ábrelo para practicar lo que viste en esta lección.</p>
                  </div>
                </div>
                <a
                  href={content.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand sm:w-auto"
                >
                  Abrir material
                  <Icon name="arrow-right" className="h-5 w-5" />
                </a>
              </div>
            )}
          </div>
        </article>
      ) : (
        /* ESTADO 3: bloqueado (sin sesión o membresía vencida) */
        <div className="space-y-6 rounded-[2rem] bg-white p-8 text-center sm:p-14">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Icon name="lock" className="h-8 w-8" />
          </span>
          <div className="mx-auto max-w-lg space-y-3">
            {content?.title && <p className="text-base font-semibold text-body">{content.title}</p>}
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              {isExpired ? 'Tu membresía no está activa' : 'Este contenido es para miembros'}
            </h2>
            <p className="text-lg leading-relaxed text-body">
              {isExpired
                ? 'Tu cuenta sigue activa, pero la membresía no. Te explicamos cómo reactivarla en tu misma cuenta, sin pagar dos veces.'
                : requireLogin
                ? 'Si ya eres miembro, inicia sesión. Si todavía no, suscríbete para ver esta lección y todo el material.'
                : 'Suscríbete para ver esta lección y todo el material del aula.'}
            </p>
          </div>

          <div className="mx-auto flex max-w-md flex-col gap-3">
            {requireLogin && (
              <Link
                href={`/login?redirect=/aula/contenido/${contentId}`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
              >
                Ya soy miembro: iniciar sesión
              </Link>
            )}
            {requireLogin || !isExpired ? (
              <Link
                href={epaycoPlanUrl}
                className={`inline-flex h-14 items-center justify-center rounded-full px-7 text-lg font-semibold transition-colors ${
                  requireLogin ? 'border-2 border-ink/15 text-ink hover:border-ink' : 'bg-ink text-white hover:bg-brand'
                }`}
              >
                Suscribirme por {MEMBERSHIP_PRICE_LABEL}/mes
              </Link>
            ) : (
              /* Ya tiene cuenta: se le explica cómo reactivar sin crear otra cuenta ni otra suscripción */
              <Link
                href="/aula"
                className="inline-flex h-14 items-center justify-center rounded-full bg-ink px-7 text-lg font-semibold text-white transition-colors hover:bg-brand"
              >
                Ver cómo reactivar mi membresía
              </Link>
            )}
            <Link href="/catalogo" className="py-2 text-base font-semibold text-body underline underline-offset-4">
              Ver otros contenidos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
