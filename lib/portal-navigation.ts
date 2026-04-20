export type PortalNavItem = Readonly<{
  href: string;
  label: string;
}>;

export type PortalRole = "buyer" | "seller";

export function portalNavItemsForRole(role: PortalRole): PortalNavItem[] {
  if (role === "buyer") {
    return [
      { href: "/portal/buyer", label: "Dashboard" },
      { href: "/portal/buyer/notifications", label: "Notifications" },
      { href: "/portal/buyer/history", label: "History" },
      { href: "/portal/buyer/offers", label: "Offers" },
      { href: "/portal/buyer/contracts", label: "Contracts" },
      { href: "/portal/buyer/transfers", label: "Transfers" },
      { href: "/portal/buyer/requests", label: "Requests" },
      { href: "/portal/buyer/profile", label: "Profile" },
      { href: "/portal/buyer/documents", label: "Documents" },
      { href: "/portal/buyer/opportunities", label: "Opportunities" },
    ];
  }

  return [
    { href: "/portal/seller", label: "Dashboard" },
    { href: "/portal/seller/notifications", label: "Notifications" },
    { href: "/portal/seller/history", label: "History" },
    { href: "/portal/seller/offers", label: "Offer Activity" },
    { href: "/portal/seller/contracts", label: "Contracts" },
    { href: "/portal/seller/transfers", label: "Transfers" },
    { href: "/portal/seller/requests", label: "Requests" },
    { href: "/portal/seller/profile", label: "Profile" },
    { href: "/portal/seller/business-summary", label: "Business Summary" },
    { href: "/portal/seller/documents", label: "Documents" },
  ];
}
