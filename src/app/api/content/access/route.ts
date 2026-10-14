import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { contentId } = await request.json();

    if (!contentId) {
      return NextResponse.json({ error: 'ID de contenido requerido' }, { status: 400 });
    }

    // 1. Obtener contenido usando supabaseAdmin
    const { data: content, error: contentError } = await supabaseAdmin
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
    }

    // Si es contenido gratuito, autorizar inmediatamente
    if (!content.is_premium) {
      return NextResponse.json({
        authorized: true,
        content,
      });
    }

    // 2. Determinar el usuario autenticado
    // Método A: Header de autorización Bearer Token (el método más robusto desde cliente)
    let user: any = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token) {
        const { data: userData } = await supabaseAdmin.auth.getUser(token);
        if (userData?.user) {
          user = userData.user;
        }
      }
    }

    // Método B: Si no vino Bearer Token, verificar cookies de sesión
    if (!user) {
      const cookieStore = await cookies();
      const supabaseServer = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() {},
          },
        }
      );
      const { data: serverUserData } = await supabaseServer.auth.getUser();
      user = serverUserData?.user || null;
    }

    // Si no hay usuario autenticado en ningún canal
    if (!user) {
      return NextResponse.json({
        authorized: false,
        requireLogin: true,
        content: {
          id: content.id,
          title: content.title,
          category: content.category,
          is_premium: true,
        },
      });
    }

    // 3. Verificar privilegios de Administrador
    const [adminRecordRes, profileRes] = await Promise.all([
      supabaseAdmin.from('admins').select('id').eq('id', user.id).maybeSingle(),
      supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle(),
    ]);

    const isAdmin =
      adminRecordRes.data !== null ||
      profileRes.data?.role === 'admin' ||
      ['santiago@gmail.com', 'adminlibredeansiedad@gmail.com', 'admin@serenamente.com'].includes(user.email || '');

    if (isAdmin) {
      return NextResponse.json({
        authorized: true,
        isAdmin: true,
        content,
        user: { id: user.id, email: user.email },
      });
    }

    // 4. Verificar suscripción activa en tabla memberships
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
        return NextResponse.json({
          authorized: true,
          content,
          user: { id: user.id, email: user.email },
        });
      }
    }

    // Usuario autenticado pero sin suscripción activa o vencida
    return NextResponse.json({
      authorized: false,
      requireLogin: false,
      subscriptionExpired: true,
      content: {
        id: content.id,
        title: content.title,
        category: content.category,
        is_premium: true,
      },
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    console.error('Error al verificar acceso a contenido:', error);
    return NextResponse.json({ error: 'Error interno al validar acceso' }, { status: 500 });
  }
}
