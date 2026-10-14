import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

let cachedBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

// Cliente para usar en componentes del cliente (browser)
// Usa @supabase/ssr como singleton para mantener cookies y sesión sincronizadas
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
        cookieOptions: {
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
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

