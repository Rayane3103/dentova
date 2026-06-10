import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Courses" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/workshop-images", label: "Workshop Images" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/newsletter", label: "Newsletter" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {adminLinks.map((link) => (
            <Link
              className={cn(
                "dentova-focus shrink-0 rounded-full border border-dentova-navy/10 px-4 py-2 text-base font-bold text-dentova-violet transition hover:bg-dentova-ice"
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {children}
      </Container>
    </main>
  );
}
