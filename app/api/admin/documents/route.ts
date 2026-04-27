import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateNDAHTML } from "@/lib/document-templates/nda-template";
import { generateSummaryHTML } from "@/lib/document-templates/summary-template";
import { generatePresentationHTML } from "@/lib/document-templates/presentation-template";
import { generateChecklistHTML } from "@/lib/document-templates/checklist-template";
import { generateEmailHTML } from "@/lib/document-templates/email-template";
import type { DigitalAssetBuyerInterestRow, DigitalAssetRow } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentType = searchParams.get("type");
    const buyerInterestId = searchParams.get("buyerInterestId");
    const assetId = searchParams.get("assetId");

    if (!documentType || !buyerInterestId || !assetId) {
      return NextResponse.json(
        { error: "Missing required parameters: type, buyerInterestId, assetId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch buyer interest details
    const { data: buyerInterest, error: buyerError } = await supabase
      .from("digital_asset_buyer_interest")
      .select("*")
      .eq("id", buyerInterestId)
      .single() as { data: DigitalAssetBuyerInterestRow | null; error: any };

    if (buyerError || !buyerInterest) {
      return NextResponse.json({ error: "Buyer interest not found" }, { status: 404 });
    }

    // Fetch asset details
    const { data: asset, error: assetError } = await supabase
      .from("digital_assets")
      .select("*")
      .eq("id", assetId)
      .single() as { data: DigitalAssetRow | null; error: any };

    if (assetError || !asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const buyerName = buyerInterest.buyer_name || "Buyer";
    const assetName = asset.name || "Asset";
    const askingPrice = asset.asking_price ? `$${asset.asking_price.toLocaleString()}` : "$0";
    const founded = "2019";
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let html = "";

    switch (documentType) {
      case "nda":
        html = generateNDAHTML({
          buyerName,
          assetName,
          date: today,
          signer: "Abel J. Fernandez",
        });
        break;

      case "summary":
        html = generateSummaryHTML({
          assetName,
          asking_price: askingPrice,
          founded,
        });
        break;

      case "presentation":
        html = generatePresentationHTML({
          assetName,
          asking_price: askingPrice,
          founded,
        });
        break;

      case "checklist":
        html = generateChecklistHTML({
          assetName,
        });
        break;

      case "email":
        html = generateEmailHTML({
          buyerName,
          assetName,
        });
        break;

      default:
        return NextResponse.json({ error: "Unknown document type" }, { status: 400 });
    }

    // Return HTML with proper content type
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${documentType}-${assetName.toLowerCase().replace(/\s+/g, "-")}.html"`,
      },
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
