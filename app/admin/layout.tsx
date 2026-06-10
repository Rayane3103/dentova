import { Navbar } from "@/components/layout/Navbar";
import { getAdminSession } from "@/lib/auth/cookies";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  return (
    <>
      <Navbar admin authenticated={Boolean(session)} />
      {children}
    </>
  );
}
