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

  {
    label: "Assets",
    href: "/admin/assets",
    subitems: [
      { href: "/admin/assets/new", label: "Add Asset" },
      { href: "/admin/digital-assets", label: "Digital Assets" },
    ],
  },

  {
    label: "Buyers",
    href: "/admin/buyers",
    subitems: [
      { href: "/admin/buyers/new", label: "Add Buyer" },
      { href: "/admin/buyer-interest", label: "Buyer Interest" },
    ],
  },

  {
    label: "Deals",
    href: "/admin/deals",
    subitems: [
      { href: "/admin/deals/buyer-offers", label: "Buyer Offers" },
      { href: "/admin/deals/closing-desk", label: "Closing Desk" },
      { href: "/admin/requests", label: "Portal Requests" },
    ],
  },

  {
    label: "Documents",
    href: "/admin/documents",
  },
];
