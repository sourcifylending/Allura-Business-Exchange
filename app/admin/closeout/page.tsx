import { redirect } from "next/navigation";

export default function LegacyAdminCloseoutPage() {
  redirect("/admin/deals/closing-desk");
}
