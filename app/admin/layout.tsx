import { AdminShell } from "@/components/admin-shell";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
