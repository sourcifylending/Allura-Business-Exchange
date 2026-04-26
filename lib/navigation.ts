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
    label: "CRM / Operations",
    subitems: [
      { href: "/admin/asset-drafts", label: "AI Asset Drafts" },
      { href: "/admin/build-pipeline", label: "AI Asset Build Pipeline" },
      { href: "/admin/packaging", label: "Packaging Center" },
      { href: "/admin/opportunities", label: "Buyer Discovery" },
      { href: "/admin/buyer-interest", label: "Buyer Interest" },
      { href: "/admin/investor-leads", label: "Investor Leads" },
      { href: "/admin/business-submissions", label: "Business Intake" },
      { href: "/admin/underwriting", label: "Underwriting" },
    ],
  },
  { href: "/admin/digital-assets", label: "Listings" },
  { href: "/admin/buyers", label: "Buyers" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];
