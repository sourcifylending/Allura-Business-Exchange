import { redirect } from "next/navigation";

type LegacyAdminBuyerOfferDetailPageProps = Readonly<{
  params: {
    id: string;
  };
}>;

export default function LegacyAdminBuyerOfferDetailPage({ params }: LegacyAdminBuyerOfferDetailPageProps) {
  redirect(`/admin/deals/buyer-offers/${params.id}`);
}
