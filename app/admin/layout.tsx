import { Navbar } from "@/components/layout/Navbar";

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
