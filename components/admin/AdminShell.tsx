import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Cours" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/mentors", label: "Mentors" },
  { href: "/admin/workshop-images", label: "Galerie" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/feedback", label: "Avis" },
  { href: "/admin/signups", label: "Inscriptions" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-dentova-canvas py-10">
      <Container>
        <div className="mb-8 flex flex-wrap gap-2">
          {adminLinks.map((link) => (
            <Link
              className={cn(
                "dentova-focus shrink-0 rounded-full border border-dentova-navy/10 bg-white px-4 py-2 text-sm font-bold text-dentova-violet transition hover:bg-dentova-ice"
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
