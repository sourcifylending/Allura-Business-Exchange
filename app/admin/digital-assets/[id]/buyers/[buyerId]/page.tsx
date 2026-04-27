import { AdminPageHeader } from "@/components/admin-page-header";
import { PageCard } from "@/components/page-card";
import { getDigitalAsset } from "@/lib/digital-assets";
import { getBuyerInterestById } from "@/lib/digital-assets";
import { BuyerDealRoomContent } from "@/components/buyer-deal-room-content";

type PageProps = Readonly<{
  params: {
    id: string;
    buyerId: string;
  };
}>;

export const dynamic = "force-dynamic";

export default async function BuyerDealRoomPage({ params }: PageProps) {
  const [asset, buyer] = await Promise.all([
    getDigitalAsset(params.id),
    getBuyerInterestById(params.buyerId),
  ]);

  if (!asset || !buyer) {
    return (
      <div className="grid gap-6">
        <AdminPageHeader title="Not Found" description="Buyer or asset not found" />
        <PageCard title="Error" description="">
          <p className="text-sm text-ink-600">The buyer or asset you're looking for doesn't exist.</p>
        </PageCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        title={`${buyer.buyer_name || "Buyer"} – ${asset.name}`}
        description="Asset sale deal room and buyer management"
      />

      <BuyerDealRoomContent asset={asset} buyer={buyer} />
    </div>
  );
}
