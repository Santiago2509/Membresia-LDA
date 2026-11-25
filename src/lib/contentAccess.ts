import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminEmail, isMembershipActive } from '@/lib/membership';

export interface ContentRow {
  id: string;
  type?: string | null;
  url?: string | null;
  is_premium?: boolean | null;
}

export type ContentAccess =
  | { status: 'ok'; content: ContentRow }
  | { status: 'not_found' }
  | { status: 'login_required' }
  | { status: 'forbidden' };

/** Usuario de la petición: token Bearer (cliente) o cookies de sesión. */
async function getRequestUser(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const { data } = await supabaseAdmin.auth.getUser(token);
      if (data?.user) return data.user;
    }
  }

  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
  const { data } = await supabaseServer.auth.getUser();
  return data?.user ?? null;
}

/**
 * Mismas reglas que /api/content/access: el contenido gratis es para todos;
 * el premium, para administradores y miembros con membresía activa.
 */
export async function resolveContentAccess(request: NextRequest, contentId: string): Promise<ContentAccess> {
  const { data: content } = await supabaseAdmin
    .from('content')
    .select('id, type, url, is_premium')
    .eq('id', contentId)
    .maybeSingle();

  if (!content) return { status: 'not_found' };
  if (!content.is_premium) return { status: 'ok', content };

  const user = await getRequestUser(request);
  if (!user) return { status: 'login_required' };

  const [adminRecordRes, profileRes] = await Promise.all([
    supabaseAdmin.from('admins').select('id').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('profiles').select('role').eq('id', user.id).maybeSingle(),
  ]);
  const isAdmin = adminRecordRes.data !== null || profileRes.data?.role === 'admin' || isAdminEmail(user.email);
  if (isAdmin) return { status: 'ok', content };

  const { data: membership } = await supabaseAdmin
    .from('memberships')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  return isMembershipActive(membership) ? { status: 'ok', content } : { status: 'forbidden' };
}
