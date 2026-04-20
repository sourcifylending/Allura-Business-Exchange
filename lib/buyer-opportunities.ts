import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AssetPackagingRecordStatus,
  AssetPackagingRow,
  AssetRegistryRow,
  BuyerOpportunityInteractionRow,
  BuyerOpportunityInteractionType,
  BuyerApplicationRow,
} from "@/lib/supabase/database.types";
import { requireActivatedBuyerPortalAccess } from "@/lib/portal-access";

export type BuyerOpportunityRecord = Readonly<{
  id: string;
  asset_registry_id: string;
  asset_name: string;
  asset_slug: string;
  niche: string;
  asset_type: string;
  asking_price: string;
  one_line_pitch: string;
  short_listing_description: string;
  portal_summary: string;
  portal_visible: boolean;
  packaging_status: AssetPackagingRecordStatus;
}>;

export type BuyerOpportunityInteractionRecord = Readonly<{
  id: string;
  buyer_application_id: string;
  asset_packaging_id: string;
  owner_user_id: string;
  interaction_type: BuyerOpportunityInteractionType;
  asset_name: string;
  asset_slug: string;
  buyer_name: string;
  buyer_email: string;
  niche: string;
  asset_type: string;
  asking_price: string;
  packaging_status: AssetPackagingRecordStatus;
  created_at: string;
  updated_at: string;
}>;

function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return Boolean(
    url &&
      key &&
      (() => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      })(),
  );
}

function mapOpportunityRow(
  packaging: AssetPackagingRow,
  registryMap: ReadonlyMap<string, AssetRegistryRow>,
): BuyerOpportunityRecord {
  const asset = registryMap.get(packaging.asset_registry_id);

  return {
    id: packaging.id,
    asset_registry_id: packaging.asset_registry_id,
    asset_name: asset?.asset_name ?? "Unknown asset",
    asset_slug: asset?.slug ?? packaging.asset_registry_id,
    niche: asset?.niche ?? "Uncategorized",
    asset_type: asset?.target_buyer_type ?? packaging.buyer_type,
    asking_price: packaging.asking_price,
    one_line_pitch: packaging.one_line_pitch,
    short_listing_description: packaging.short_listing_description,
    portal_summary: packaging.portal_summary || packaging.short_listing_description,
    portal_visible: packaging.portal_visible,
    packaging_status: packaging.status,
  };
}

export async function getBuyerPortalOpportunities() {
  if (!hasSupabaseEnv()) {
    return [] as BuyerOpportunityRecord[];
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    return [];
  }

  try {
    const [packagingResult, assetResult] = await Promise.all([
      adminClient
        .from("asset_packaging")
        .select("*")
        .eq("portal_visible", true)
        .order("created_at", { ascending: false }),
      adminClient.from("asset_registry").select("*"),
    ]);

    if (packagingResult.error || !packagingResult.data || assetResult.error || !assetResult.data) {
      return [];
    }

    const packagingRows = packagingResult.data as AssetPackagingRow[];
    const assetRows = assetResult.data as AssetRegistryRow[];
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));
    return packagingRows.map((row) => mapOpportunityRow(row, registryMap));
  } catch {
    return [];
  }
}

export async function getBuyerPortalOpportunityById(opportunityId: string) {
  if (!hasSupabaseEnv() || !opportunityId) {
    return null;
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    return null;
  }

  try {
    const [packagingResult, assetResult] = await Promise.all([
      adminClient.from("asset_packaging").select("*").eq("id", opportunityId).maybeSingle(),
      adminClient.from("asset_registry").select("*"),
    ]);

    if (packagingResult.error || !packagingResult.data || assetResult.error || !assetResult.data) {
      return null;
    }

    const packagingRow = packagingResult.data as AssetPackagingRow;

    if (!packagingRow.portal_visible) {
      return null;
    }

    const assetRows = assetResult.data as AssetRegistryRow[];
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));
    return mapOpportunityRow(packagingRow, registryMap);
  } catch {
    return null;
  }
}

export async function getBuyerPortalInteractionsForApplication(applicationId: string) {
  if (!hasSupabaseEnv() || !applicationId) {
    return [] as BuyerOpportunityInteractionRecord[];
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    return [];
  }

  try {
    const [interactionResult, applicationResult, packagingResult, assetResult] = await Promise.all([
      adminClient
        .from("buyer_opportunity_interactions")
        .select("*")
        .eq("buyer_application_id", applicationId)
        .order("created_at", { ascending: false }),
      adminClient.from("buyer_applications").select("*").eq("id", applicationId).maybeSingle(),
      adminClient.from("asset_packaging").select("*"),
      adminClient.from("asset_registry").select("*"),
    ]);

    if (
      interactionResult.error ||
      !interactionResult.data ||
      applicationResult.error ||
      !applicationResult.data ||
      packagingResult.error ||
      !packagingResult.data ||
      assetResult.error ||
      !assetResult.data
    ) {
      return [];
    }

    const buyer = applicationResult.data as BuyerApplicationRow;
    const interactionRows = interactionResult.data as BuyerOpportunityInteractionRow[];
    const packagingRows = packagingResult.data as AssetPackagingRow[];
    const assetRows = assetResult.data as AssetRegistryRow[];
    const packagingMap = new Map(packagingRows.map((row) => [row.id, row]));
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));

    return interactionRows
      .map((interaction) => {
        const packaging = packagingMap.get(interaction.asset_packaging_id);
        if (!packaging) {
          return null;
        }

        const asset = registryMap.get(packaging.asset_registry_id);

        return {
          ...interaction,
          buyer_name: buyer.applicant_name,
          buyer_email: buyer.email,
          asset_name: asset?.asset_name ?? "Unknown asset",
          asset_slug: asset?.slug ?? packaging.asset_registry_id,
          niche: asset?.niche ?? "Uncategorized",
          asset_type: asset?.target_buyer_type ?? packaging.buyer_type,
          asking_price: packaging.asking_price,
          packaging_status: packaging.status,
        } satisfies BuyerOpportunityInteractionRecord;
      })
      .filter((record): record is BuyerOpportunityInteractionRecord => Boolean(record));
  } catch {
    return [];
  }
}

function readOpportunityId(formData: FormData) {
  const idValue = formData.get("asset_packaging_id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

async function recordOpportunityInteraction(
  interactionType: BuyerOpportunityInteractionType,
  formData: FormData,
) {
  const opportunityId = readOpportunityId(formData);
  if (!opportunityId) {
    redirect("/portal/buyer/opportunities?error=Missing%20opportunity%20id.");
  }

  const buyerRecord = await requireActivatedBuyerPortalAccess();
  const adminClient = createAdminClient();

  if (!adminClient) {
    redirect("/portal/buyer/opportunities?error=Portal%20opportunities%20are%20temporarily%20unavailable.");
  }

  if (!buyerRecord.linked_user_id) {
    redirect("/portal/buyer/opportunities?error=Buyer%20portal%20access%20is%20not%20fully%20linked.");
  }

  const opportunity = await getBuyerPortalOpportunityById(opportunityId);

  if (!opportunity) {
    redirect("/portal/buyer/opportunities?error=This%20opportunity%20is%20not%20available.");
  }

  const buyerApplicationId = buyerRecord.id;
  const ownerUserId = buyerRecord.linked_user_id;
  const interactionsTable = adminClient.from("buyer_opportunity_interactions") as any;

  const { error } = await interactionsTable.upsert(
    {
      buyer_application_id: buyerApplicationId,
      asset_packaging_id: opportunity.id,
      owner_user_id: ownerUserId,
      interaction_type: interactionType,
    },
    {
      onConflict: "buyer_application_id,asset_packaging_id,interaction_type",
    },
  );

  if (error) {
    redirect("/portal/buyer/opportunities?error=Unable%20to%20save%20your%20selection.");
  }

  revalidatePath("/portal/buyer");
  revalidatePath("/portal/buyer/opportunities");
  revalidatePath(`/portal/buyer/opportunities/${opportunity.id}`);
  revalidatePath("/admin/buyer-interest");
  redirect(
    `/portal/buyer/opportunities/${opportunity.id}?saved=${interactionType === "interest" ? "interest" : "watchlist"}`,
  );
}

export async function expressBuyerInterestAction(formData: FormData) {
  "use server";

  return recordOpportunityInteraction("interest", formData);
}

export async function saveBuyerOpportunityAction(formData: FormData) {
  "use server";

  return recordOpportunityInteraction("saved", formData);
}

export async function getAdminBuyerOpportunityInterests(typeFilter: "all" | BuyerOpportunityInteractionType = "all") {
  if (!hasSupabaseEnv()) {
    return [] as BuyerOpportunityInteractionRecord[];
  }

  const adminClient = createAdminClient();

  if (!adminClient) {
    return [];
  }

  try {
    const [interactionResult, applicationResult, packagingResult, assetResult] = await Promise.all([
      adminClient.from("buyer_opportunity_interactions").select("*").order("created_at", { ascending: false }),
      adminClient.from("buyer_applications").select("*"),
      adminClient.from("asset_packaging").select("*"),
      adminClient.from("asset_registry").select("*"),
    ]);

    if (
      interactionResult.error ||
      !interactionResult.data ||
      applicationResult.error ||
      !applicationResult.data ||
      packagingResult.error ||
      !packagingResult.data ||
      assetResult.error ||
      !assetResult.data
    ) {
      return [];
    }

    const interactionRows = interactionResult.data as BuyerOpportunityInteractionRow[];
    const applicationRows = applicationResult.data as BuyerApplicationRow[];
    const packagingRows = packagingResult.data as AssetPackagingRow[];
    const assetRows = assetResult.data as AssetRegistryRow[];
    const applicationMap = new Map(applicationRows.map((row) => [row.id, row]));
    const packagingMap = new Map(packagingRows.map((row) => [row.id, row]));
    const registryMap = new Map(assetRows.map((asset) => [asset.id, asset]));

    return interactionRows
      .filter((interaction) => typeFilter === "all" || interaction.interaction_type === typeFilter)
      .map((interaction) => {
        const buyer = applicationMap.get(interaction.buyer_application_id);
        const packaging = packagingMap.get(interaction.asset_packaging_id);

        if (!buyer || !packaging) {
          return null;
        }

        const asset = registryMap.get(packaging.asset_registry_id);

        return {
          ...interaction,
          buyer_name: buyer.applicant_name,
          buyer_email: buyer.email,
          asset_name: asset?.asset_name ?? "Unknown asset",
          asset_slug: asset?.slug ?? packaging.asset_registry_id,
          niche: asset?.niche ?? "Uncategorized",
          asset_type: asset?.target_buyer_type ?? packaging.buyer_type,
          asking_price: packaging.asking_price,
          packaging_status: packaging.status,
        } satisfies BuyerOpportunityInteractionRecord;
      })
      .filter((record): record is BuyerOpportunityInteractionRecord => Boolean(record));
  } catch {
    return [];
  }
}
