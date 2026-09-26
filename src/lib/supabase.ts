import { createBrowserClient } from '@supabase/ssr';

// Cliente para usar en componentes del cliente (browser)
// Usa @supabase/ssr para guardar la sesión en cookies (no localStorage)
// así el middleware del servidor puede leerla correctamente.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Cliente legacy para compatibilidad (solo lectura pública, sin sesión de servidor)
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
