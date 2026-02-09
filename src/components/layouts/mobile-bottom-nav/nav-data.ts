import { Calendar, Car, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface MobileNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const mobileNavItems: MobileNavItem[] = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Frota", href: "/frota", icon: Car },
  { title: "Reserva", href: "/reservas", icon: Calendar },
];
