import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import LessonView from '@/components/LessonView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // 1. Fetch content by ID usando supabaseAdmin
  const { data: content, error } = await supabaseAdmin
    .from('content')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !content) {
    notFound();
  }

  // 2. Verificar acceso en el Servidor (Optimización SSR instantánea)
  let hasAccess = !content.is_premium;
  let requireLogin = false;

  if (content.is_premium) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      requireLogin = true;
    } else {
      // A. Verificar Administrador
      const [adminRecordRes, profileRes] = await Promise.all([
        supabaseAdmin.from('admins').select('id').eq('id', user.id).maybeSingle(),
        supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle(),
      ]);

      const isAdmin = 
        adminRecordRes.data !== null || 
        profileRes.data?.role === 'admin' ||
        ['santiago@gmail.com', 'adminlibredeansiedad@gmail.com', 'admin@serenamente.com'].includes(user.email || '');

      if (isAdmin) {
        hasAccess = true;
      } else {
        // B. Verificar suscripción activa en tabla memberships
        const { data: membership } = await supabaseAdmin
          .from('memberships')
          .select('status, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle();

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

  // Si tiene acceso confirmado desde el servidor, pasamos el contenido completo
  // Si no, pasamos la metadata básica para que LessonView verifique la sesión en el cliente
  const initialContent = hasAccess ? content : {
    id: content.id,
    title: content.title,
    category: content.category,
    is_premium: content.is_premium,
  };

  return (
    <LessonView 
      key={content.id}
      contentId={content.id}
      initialContent={initialContent}
      initialHasAccess={hasAccess}
      initialRequireLogin={requireLogin}
    />
  );
}
