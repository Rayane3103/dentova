import { MarketerSidebar } from "@/components/marketer/MarketerSidebar";
import { MarketerTopBar } from "@/components/marketer/MarketerTopBar";
import { MarketerMobileDrawer } from "@/components/marketer/MarketerMobileDrawer";
import type { DashboardUser } from "@/components/admin/AdminShell";

export function MarketerShell({
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
    <div className="flex h-screen overflow-hidden bg-slate-50/80" suppressHydrationWarning>
      {/* Desktop Sidebar */}
      <MarketerSidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MarketerTopBar user={user} />
        <MarketerMobileDrawer />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 animate-page-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
