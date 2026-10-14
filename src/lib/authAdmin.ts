import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from './supabaseAdmin';

export const ADMIN_EMAILS = [
  'santiago@gmail.com',
  'adminlibredeansiedad@gmail.com',
  'admin@serenamente.com',
];

export async function verifyAdmin(req?: NextRequest) {
  let user: any = null;

  // 1. Probar primero si viene token Bearer en el header Authorization
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.substring(7).trim();
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }
  }

  // 2. Si no hay token en header o no fue válido, leer de cookies de sesión
  if (!user) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Puede fallar silenciosamente en Server Components de solo lectura
            }
          },
        },
      }
    );
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  }

  if (!user) return null;

  const email = (user.email || '').toLowerCase().trim();

  // 1. Comprobación directa por lista de correos administradores
  if (email && ADMIN_EMAILS.includes(email)) {
    return { user, profile: { role: 'admin', email } };
  }

  // 2. Verificar en la tabla dedicada de administradores ('admins')
  const { data: adminRecord } = await supabaseAdmin
    .from('admins')
    .select('id, email, full_name')
    .eq('id', user.id)
    .single();

  if (adminRecord) {
    return { user, profile: { ...adminRecord, role: 'admin' } };
  }

  // 3. Respaldo: verificar en 'profiles' con role = 'admin'
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, role, email')
    .eq('id', user.id)
    .single();

  if (profile && profile.role === 'admin') {
    return { user, profile };
  }

  return null;
}

