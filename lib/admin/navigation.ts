import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FolderTree,
  GraduationCap,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Star,
  Ticket,
  Users
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Vue d'ensemble",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }]
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/courses", label: "Cours", icon: BookOpen },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/mentors", label: "Mentors", icon: GraduationCap },
      { href: "/admin/workshop-images", label: "Galerie", icon: ImageIcon },
      { href: "/admin/faqs", label: "FAQ", icon: HelpCircle }
    ]
  },
  {
    label: "Demandes",
    items: [
      { href: "/admin/signups", label: "Inscriptions", icon: Users },
      { href: "/admin/reservations", label: "Reservations", icon: Ticket },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail }
    ]
  },
  {
    label: "Moderation",
    items: [{ href: "/admin/feedback", label: "Avis", icon: Star }]
  }
];

export function isAdminNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
