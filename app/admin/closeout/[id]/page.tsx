import { redirect } from "next/navigation";
import { getAssetClosingByTransferRowId } from "@/lib/closing-ops";

type LegacyAdminCloseoutDetailPageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default async function LegacyAdminCloseoutDetailPage({ params }: LegacyAdminCloseoutDetailPageProps) {
  const closing = await getAssetClosingByTransferRowId(params.id);

  if (!closing) {
    redirect("/admin/deals/closing-desk?error=Closing%20not%20found.");
  }

  redirect(`/admin/deals/closing-desk/${closing.id}`);
}
