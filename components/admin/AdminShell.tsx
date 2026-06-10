import { AdminMobileDrawer } from "@/components/admin/AdminMobileDrawer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-76px)] bg-[linear-gradient(180deg,#f7f8fc_0%,#eef1f8_100%)]">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <AdminSidebar />
        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <AdminMobileDrawer />
          {children}
        </div>
      </div>
    </main>
  );
}
