import { getAdminSession } from "@/lib/auth/cookies";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  const user = session ? { name: session.name, email: session.email } : null;

  return <AdminShell user={user}>{children}</AdminShell>;
}
