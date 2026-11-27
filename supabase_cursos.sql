-- ============================================================================
-- Cursos (ejecutar una vez en Supabase → SQL Editor)
--
-- Un curso agrupa lecciones (videos, PDF, audios...) en un orden. Las lecciones
-- siguen siendo filas de `content`; solo se les agrega a qué curso pertenecen y
-- su posición. El contenido sin curso sigue apareciendo suelto en el catálogo.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Portada, título y descripción de los cursos son públicos (se ven en el catálogo).
-- Solo el servidor (service_role) crea, edita o borra cursos.
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede ver los cursos" ON public.courses;
CREATE POLICY "Cualquiera puede ver los cursos" ON public.courses FOR SELECT USING (true);

-- Lecciones: a qué curso pertenecen y en qué orden.
-- Si se borra un curso, sus lecciones no se borran: quedan como contenido suelto.
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS position INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS content_course_position_idx ON public.content (course_id, position);

-- Comprobación: debe listar las columnas course_id y position
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'content' AND column_name IN ('course_id', 'position');
