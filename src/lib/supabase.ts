import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

let cachedBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Convierte las opciones de cookie en "cookie de sesión": sin maxAge/expires,
 * así el navegador la borra al cerrarse y el usuario debe volver a iniciar sesión.
 * Se respetan los borrados (maxAge 0) para que el cierre de sesión funcione.
 */
export function toSessionCookieOptions<T extends { maxAge?: number; expires?: Date }>(options: T = {} as T): T {
  if (options.maxAge === 0) return options;
  const { maxAge: _maxAge, expires: _expires, ...rest } = options;
  return rest as T;
}

function readDocumentCookies() {
  if (typeof document === 'undefined' || !document.cookie) return [];
  return document.cookie.split(';').map((part) => {
    const index = part.indexOf('=');
    const name = decodeURIComponent(part.slice(0, index).trim());
    const value = decodeURIComponent(part.slice(index + 1).trim());
    return { name, value };
  });
}

function writeDocumentCookie(name: string, value: string, options: any = {}) {
  const opts = toSessionCookieOptions(options);
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; Path=${opts.path || '/'}`;
  if (opts.maxAge === 0) cookie += '; Max-Age=0';
  if (opts.domain) cookie += `; Domain=${opts.domain}`;
  cookie += `; SameSite=${opts.sameSite === 'strict' ? 'Strict' : opts.sameSite === 'none' ? 'None' : 'Lax'}`;
  if (opts.secure || window.location.protocol === 'https:') cookie += '; Secure';
  document.cookie = cookie;
}

// Cliente para usar en componentes del cliente (browser).
// Singleton para que todas las partes de la app compartan la misma sesión.
export function createSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!cachedBrowserClient) {
    cachedBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return readDocumentCookies();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => writeDocumentCookie(name, value, options));
          },
        },
      }
    );
  }

  return cachedBrowserClient;
}

// Cliente legacy para compatibilidad (solo lectura pública, sin sesión de servidor)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
