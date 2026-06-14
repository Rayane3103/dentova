import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminMobileDrawer } from "@/components/admin/AdminMobileDrawer";

export type DashboardUser = {
  name: string;
  email: string;
};

export function AdminShell({
  user,
  children
}: {
  user?: DashboardUser | null;
  children: React.ReactNode;
}) {
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" suppressHydrationWarning>
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopBar user={user} />
        <AdminMobileDrawer />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
