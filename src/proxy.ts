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
          cookiesToSet.forEach(({ name, value, options }) => {
            // Cookie de sesión: se borra al cerrar el navegador (se respetan los borrados maxAge 0)
            const { maxAge, expires, ...rest } = options || {};
            const finalOptions = maxAge === 0 ? options : rest;
            supabaseResponse.cookies.set(name, value, finalOptions);
          });
        },
      },
    }
  );

  // Refrescar sesión para que las cookies viajen siempre actualizadas a los Server Components
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAdminLoginRoute = url.pathname === '/admin/login';

  // Si ya tiene sesión activa de admin y entra a /admin/login, enviarlo al dashboard
  if (user && isAdminLoginRoute) {
    url.pathname = '/admin';
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // La protección de rutas y permisos la gestiona de forma segura y autoritativa
  // el AdminLayout y AulaLayout en el servidor, evitando desincronizaciones de sesión
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Excluir archivos estáticos, imágenes y favicons para evitar ejecuciones innecesarias
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export { proxy as middleware };
