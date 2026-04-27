export const publicNavItems = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/buyers", label: "Buyers" },
  { href: "/sellers", label: "Sellers" },
  { href: "/digital-assets", label: "Digital Assets" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/contact", label: "Contact" },
];

export type AdminNavItem = Readonly<{
  href?: string;
  label: string;
  subitems?: AdminNavItem[];
}>;

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/buyers", label: "Buyers" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/settings", label: "Settings" },
];
