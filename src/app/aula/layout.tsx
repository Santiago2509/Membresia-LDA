import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import SidebarProfile from '@/components/SidebarProfile';
import { AulaNavLinks } from '@/components/AulaNavLinks';
import { isAdminEmail, isMembershipActive } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function AulaLayout({ children }: { children: React.ReactNode }) {
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

  const { data: { user } } = await supabase.auth.getUser();

  let displayName = 'Miembro';
  let emailDisplay = '';
  let initials = 'MB';
  let isSubscriber = false;

  if (user) {
    emailDisplay = user.email || '';
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();

    if (profile?.full_name) {
      displayName = profile.full_name;
      const parts = profile.full_name.trim().split(' ');
      initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    } else if (user.email) {
      displayName = user.email.split('@')[0];
      initials = displayName.slice(0, 2).toUpperCase();
    }

    if (profile?.role === 'admin' || isAdminEmail(user.email)) {
      isSubscriber = true;
    } else {
      const { data: membership } = await supabaseAdmin
        .from('memberships')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .maybeSingle();
      isSubscriber = isMembershipActive(membership);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper pt-[4.75rem] md:flex-row">
      {/* Menú lateral del aula (escritorio) */}
      <aside className="sticky top-[4.75rem] hidden h-[calc(100vh-4.75rem)] w-72 shrink-0 flex-col justify-between border-r border-ink/10 bg-white py-6 md:flex">
        <nav aria-label="Aula" className="flex-1 space-y-1.5 overflow-y-auto px-4">
          <p className="px-3 pb-3 text-sm font-semibold uppercase tracking-[0.16em] text-body">Mi aula</p>
          <AulaNavLinks />
        </nav>
        <SidebarProfile
          initialUser={user}
          initialDisplayName={displayName}
          initialInitials={initials}
          initialIsSubscriber={isSubscriber}
        />
      </aside>

      {/* Navegación del aula (celular): botones grandes arriba del contenido */}
      <nav aria-label="Aula" className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-white px-4 py-3 md:hidden">
        <AulaNavLinks compact />
      </nav>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <main className="relative z-10 flex-1 p-4 sm:p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
