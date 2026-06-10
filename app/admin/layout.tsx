import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar admin />
      {children}
    </>
  );
}
