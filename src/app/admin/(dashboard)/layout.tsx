import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/authAdmin';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await verifyAdmin();

  if (!auth) {
    redirect('/admin/login');
  }

  const adminEmail = auth.profile?.email || auth.user?.email || '';

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
