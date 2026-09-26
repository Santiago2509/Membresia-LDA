import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const revalidate = 0; 

export default async function AdminContenidoPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: contents, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">Catálogo de Contenido</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Gestiona todos los cursos, artículos y recursos de la plataforma.
          </p>
        </div>
        <Link 
          href="/admin/contenido/nuevo" 
          className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Crear Nuevo
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl">
          Error cargando contenidos: {error.message}
        </div>
      ) : contents && contents.length > 0 ? (
        <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Contenido</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Tipo & Categoría</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Acceso</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Fecha</th>
                  <th className="p-4 font-label-sm text-on-surface-variant font-bold uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {contents.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 relative">
                          {item.thumbnail_url ? (
                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant absolute inset-0 m-auto text-[20px] w-5 h-5">image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-label-md text-on-surface font-bold line-clamp-1">{item.title}</p>
                          <p className="font-body-sm text-on-surface-variant line-clamp-1 text-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-xs text-secondary font-bold uppercase">{item.type}</span>
                        <span className="font-label-sm text-on-surface-variant">{item.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.is_premium ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-xs font-bold">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-xs font-bold">
                          <span className="material-symbols-outlined text-[14px]">public</span>
                          Gratis
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-body-sm text-on-surface-variant">
                      {format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-20 bg-surface-container-lowest/50 rounded-3xl border border-dashed border-outline-variant/50">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-[32px]">post_add</span>
          </div>
          <h3 className="font-title-lg text-on-surface font-bold">Aún no hay contenido</h3>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
            Sube tu primer curso, artículo o video para que tus suscriptores comiencen a aprender.
          </p>
          <Link 
            href="/admin/contenido/nuevo" 
            className="mt-6 px-6 py-2.5 bg-primary-container text-on-primary rounded-full font-label-md font-bold hover:bg-primary transition-colors"
          >
            Crear Contenido
          </Link>
        </div>
      )}
    </div>
  );
}
