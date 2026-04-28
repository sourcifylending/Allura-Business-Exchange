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
    label: "Asset Management",
    subitems: [
      { href: "/admin/assets", label: "All Assets" },
      { href: "/admin/asset-drafts", label: "Draft Assets" },
      { href: "/admin/digital-assets", label: "Digital Assets" },
      { href: "/admin/packaging", label: "Asset Packaging" },
    ],
  },

  {
    label: "Buyer Operations",
    subitems: [
      { href: "/admin/buyers", label: "Buyers" },
      { href: "/admin/buyer-interest", label: "Buyer Interest" },
      { href: "/admin/buyer-offers", label: "Buyer Offers" },
      { href: "/admin/applications", label: "Applications" },
      { href: "/admin/opportunities", label: "Opportunities" },
    ],
  },

  {
    label: "Deals & Contracts",
    subitems: [
      { href: "/admin/deals", label: "Deals" },
      { href: "/admin/deal-room", label: "Deal Room" },
      { href: "/admin/offers", label: "All Offers" },
      { href: "/admin/contracts", label: "Contracts" },
      { href: "/admin/closeout", label: "Closeout" },
    ],
  },

  {
    label: "Operations",
    subitems: [
      { href: "/admin/inquiries", label: "Inquiries" },
      { href: "/admin/requests", label: "Portal Requests" },
      { href: "/admin/transfers", label: "Transfers" },
      { href: "/admin/underwriting", label: "Underwriting" },
    ],
  },

  {
    label: "CRM Hub",
    href: "/admin/crm",
    subitems: [
      { href: "/admin/inquiries", label: "Leads & Inquiries" },
      { href: "/admin/buyers", label: "Buyer Management" },
      { href: "/admin/applications", label: "Applications & Review" },
    ],
  },

  {
    label: "Market & Insights",
    subitems: [
      { href: "/admin/market-radar", label: "Market Radar" },
      { href: "/admin/risk", label: "Risk Desk" },
      { href: "/admin/reporting", label: "Reporting" },
      { href: "/admin/activity", label: "Activity Log" },
    ],
  },

  { href: "/admin/documents", label: "Documents" },

  { href: "/admin/settings", label: "Settings" },
];
