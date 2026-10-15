import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Solo POST: un GET puede ser disparado por prefetch del navegador/Next.js
// y cerraría la sesión del usuario sin que haga clic.
export async function POST() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // scope 'local': cierra solo este dispositivo, no todas las sesiones del usuario
  await supabase.auth.signOut({ scope: 'local' });

  return NextResponse.json({ ok: true });
}
