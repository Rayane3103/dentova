import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getAdminSession } from "@/lib/auth/cookies";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAdminSession();

  return (
    <>
      <Navbar authenticated={Boolean(session)} />
      {children}
      <Footer />
    </>
  );
}
