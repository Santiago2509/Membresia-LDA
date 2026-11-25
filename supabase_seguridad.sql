-- ============================================================================
-- Corrección de seguridad (ejecutar una vez en Supabase → SQL Editor)
--
-- 1. `admins` y `webhook_events` tenían RLS desactivado: con la clave pública
--    (anon), cualquiera podía leer los pagos o agregarse como administrador.
-- 2. Un miembro podía cambiar su propio `profiles.role` a 'admin'.
--
-- La plataforma escribe en estas tablas solo desde el servidor (service_role),
-- que no está sujeto a RLS, así que nada de la página deja de funcionar.
-- ============================================================================

-- Administradores: cada quien puede ver solo su propia fila (lo usa /admin/login).
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin ve su propia fila" ON public.admins;
CREATE POLICY "Admin ve su propia fila" ON public.admins
  FOR SELECT USING (auth.uid() = id);

-- Avisos de ePayco: sin acceso desde el navegador.
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Perfiles: los miembros pueden leer su perfil pero no modificarlo desde el
-- navegador (la plataforma lo actualiza desde el servidor).
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon, authenticated;

-- Comprobación: todas deben salir con rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
