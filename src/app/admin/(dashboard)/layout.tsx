import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  // 1. Leer sesión del usuario desde las cookies
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // 2. Verificar rol en la tabla dedicada 'admins' o en 'profiles'
  const { data: adminRecord } = await supabaseAdmin
    .from('admins')
    .select('email, full_name')
    .eq('id', user.id)
    .single();

  let adminEmail = adminRecord?.email;

  if (!adminRecord) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      redirect('/aula');
    }
    adminEmail = profile.email;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-container-low font-body-md text-on-surface">
      {/* Navigation (Sidebar en desktop + Topbar en mobile) */}
      <AdminNav adminEmail={adminEmail || ''} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-surface-container to-transparent opacity-50 pointer-events-none"></div>
        <main className="flex-1 p-4 sm:p-6 md:p-10 relative z-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
