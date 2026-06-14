import type { Metadata } from "next";
import { getMarketerSession } from "@/lib/auth/cookies";
import { MarketerShell } from "@/components/marketer/MarketerShell";

export const metadata: Metadata = {
  title: {
    default: "Marketing | Dentova",
    template: "%s | Marketing Dentova"
  }
};

export const dynamic = "force-dynamic";

export default async function MarketerLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getMarketerSession();

  const user = session ? { name: session.name, email: session.email } : null;

  return (
    <MarketerShell user={user}>
      {children}
    </MarketerShell>
  );
}
