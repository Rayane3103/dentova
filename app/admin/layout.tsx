import { getAdminSession } from "@/lib/auth/cookies";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  return <AdminShell authenticated={Boolean(session)}>{children}</AdminShell>;
}
