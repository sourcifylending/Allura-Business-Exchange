import { createAdminClient } from "@/lib/supabase/admin";
import type { DigitalAssetRow, DigitalAssetBuyerInterestRow } from "@/lib/supabase/database.types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = createAdminClient();

    if (!client) {
      return NextResponse.json(
        { error: "Supabase service role is not configured", assets: [], buyers: [] },
        { status: 500 }
      );
    }

    const { data: assets, error: assetsError } = await (client.from("digital_assets") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (assetsError) throw assetsError;

    const { data: buyers, error: buyersError } = await (client.from("digital_asset_buyer_interest") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (buyersError) throw buyersError;

    return NextResponse.json({
      assets: (assets || []) as DigitalAssetRow[],
      buyers: (buyers || []) as DigitalAssetBuyerInterestRow[],
    });
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch data",
        assets: [],
        buyers: [],
      },
      { status: 500 }
    );
  }
}
