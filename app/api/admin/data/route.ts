import { createClient } from "@/lib/supabase/server";
import type { DigitalAssetRow, DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = createClient();

    // Get all assets
    const { data: assets, error: assetsError } = await (client.from("digital_assets") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (assetsError) throw assetsError;

    // Get all buyers
    const { data: buyers, error: buyersError } = await (client.from("digital_asset_buyer_interest") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (buyersError) throw buyersError;

    return NextResponse.json({
      assets: (assets || []) as DigitalAssetRow[],
      buyers: (buyers || []) as DigitalAssetBuyerInterestRow[],
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
