import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar sesión
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAdminLoginRoute = url.pathname === '/admin/login';
  const isAdminRoute = url.pathname.startsWith('/admin') && !isAdminLoginRoute;
  const isAulaRoute = url.pathname.startsWith('/aula');

  // Sin sesión → redirigir al login
  if (!user) {
    if (isAdminRoute) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    if (isAulaRoute) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Ya autenticado intentando ir al login de admin → redirigir al panel
  if (user && isAdminLoginRoute) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // El chequeo de rol admin se hace en la página del servidor, no aquí
  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/aula/:path*'],
};
