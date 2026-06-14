import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  MessageSquare,
  Radio,
  Star,
  Ticket,
  Users
} from "lucide-react";

export type MarketerNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

export type MarketerNavGroup = {
  label: string;
  items: MarketerNavItem[];
  defaultOpen?: boolean;
};

export const marketerNavGroups: MarketerNavGroup[] = [
  {
    label: "Principal",
    defaultOpen: true,
    items: [
      {
        href: "/marketer",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        exact: true
      }
    ]
  },
  {
    label: "Analytique",
    defaultOpen: true,
    items: [
      {
        href: "/marketer/pixels",
        label: "Pixels de tracking",
        icon: Radio
      },
      {
        href: "/marketer/reservations",
        label: "Réservations",
        icon: Ticket
      },
      {
        href: "/marketer/subscribers",
        label: "Newsletter",
        icon: Users
      }
    ]
  },
  {
    label: "Aperçu rapide",
    defaultOpen: true,
    items: [
      {
        href: "/marketer/feedback",
        label: "Avis clients",
        icon: Star
      },
      {
        href: "/marketer/messages",
        label: "Messages",
        icon: MessageSquare
      }
    ]
  }
];

export function isMarketerNavActive(
  pathname: string,
  href: string,
  exact?: boolean
) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
