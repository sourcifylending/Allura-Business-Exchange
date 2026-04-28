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
      { href: "/admin/asset-drafts", label: "Draft Assets" },
      { href: "/admin/digital-assets", label: "Digital Assets" },
      { href: "/admin/packaging", label: "Asset Packaging" },
    ],
  },

  {
    label: "CRM",
    href: "/admin/crm",
    subitems: [
      { href: "/admin/inquiries", label: "Leads & Inquiries" },
      { href: "/admin/buyer-interest", label: "Buyer Interest" },
      { href: "/admin/opportunities", label: "Opportunity Mapping" },
    ],
  },

  {
    label: "Buyers",
    href: "/admin/buyers",
    subitems: [
      { href: "/admin/buyer-offers", label: "Buyer Offers" },
      { href: "/admin/applications", label: "Applications & Review" },
      { href: "/admin/requests", label: "Portal Requests" },
    ],
  },

  { href: "/admin/sellers", label: "Sellers" },

  {
    label: "Deals",
    href: "/admin/deals",
    subitems: [
      { href: "/admin/deal-room", label: "Deal Room" },
      { href: "/admin/offers", label: "All Offers" },
      { href: "/admin/contracts", label: "Contracts" },
      { href: "/admin/closeout", label: "Closeout" },
      { href: "/admin/risk", label: "Risk Desk" },
    ],
  },

  {
    label: "NDAs",
    href: "/admin/nda-management",
    subitems: [
      { href: "/admin/nda-templates", label: "NDA Templates" },
      { href: "/admin/nda-signatures", label: "NDA Signatures" },
    ],
  },

  {
    label: "Diligence",
    href: "/admin/diligence",
    subitems: [
      { href: "/admin/underwriting", label: "Underwriting" },
      { href: "/admin/transfers", label: "Transfers" },
      { href: "/admin/reporting", label: "Reporting" },
    ],
  },

  { href: "/admin/documents", label: "Documents" },

  {
    label: "Messages",
    href: "/admin/messages",
    subitems: [
      { href: "/admin/market-radar", label: "Market Radar" },
      { href: "/admin/activity", label: "Activity Log" },
    ],
  },

  { href: "/admin/settings", label: "Settings" },
];
