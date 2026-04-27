import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = createClient();

    const { data, error } = await (client.from("digital_assets") as any)
      .insert([
        {
          name: body.name,
          slug: body.slug,
          asset_type: body.assetType || null,
          status: body.status || "for_sale",
          revenue_stage: body.revenueStage || null,
          asking_price: body.askingPrice ? parseFloat(body.askingPrice) : null,
          short_description: body.shortDescription || null,
          notes: body.notes || null,
          visibility: "private",
          nda_required: true,
          supabase_project_url: null,
          github_repo_url: null,
          vercel_project_url: null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, asset: data });
  } catch (error) {
    console.error("Failed to create asset:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create asset" },
      { status: 500 }
    );
  }
}
