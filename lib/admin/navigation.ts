import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderTree,
  GraduationCap,
  Handshake,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Newspaper,
  Star,
  Ticket,
  Users
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
  defaultOpen?: boolean;
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Principal",
    defaultOpen: true,
    items: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        exact: true
      }
    ]
  },
  {
    label: "Contenu du site",
    defaultOpen: true,
    items: [
      { href: "/admin/courses", label: "Formations", icon: BookOpen },
      { href: "/admin/categories", label: "Catégories", icon: FolderTree },
      { href: "/admin/mentors", label: "Formateurs", icon: GraduationCap },
      { href: "/admin/posts", label: "Blog", icon: Newspaper },
      { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
      { href: "/admin/workshop-images", label: "Galerie", icon: ImageIcon },
      { href: "/admin/faqs", label: "FAQ", icon: HelpCircle }
    ]
  },
  {
    label: "Gestion clients",
    defaultOpen: true,
    items: [
      { href: "/admin/reservations", label: "Réservations", icon: Ticket },
      { href: "/admin/signups", label: "Inscriptions", icon: Users },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail }
    ]
  },
  {
    label: "Modération",
    defaultOpen: true,
    items: [
      { href: "/admin/feedback", label: "Avis clients", icon: Star }
    ]
  }
];

export function isAdminNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
