import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AssetRegistryRecord } from "@/lib/asset-registry";
import { getAssetRegistryRecords } from "@/lib/asset-registry";
import type {
  AssetPackagingRow,
  AssetPackagingRecordStatus,
  SellerApplicationRow,
} from "@/lib/supabase/database.types";

export type PackagingStatus = AssetPackagingRecordStatus;

export type PackagingRecord = Readonly<
  Omit<AssetPackagingRow, "created_at" | "updated_at">
> & {
  asset_name: string;
  asset_slug: string;
};

export type SellerApplicationOption = Readonly<Pick<SellerApplicationRow, "id" | "applicant_name" | "business_name" | "status">>;

export const packagingStatusLabels: Record<PackagingStatus, string> = {
  incomplete: "Incomplete",
  draft_ready: "Draft Ready",
  approved_for_listing: "Approved for Listing",
};

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

function mapPackagingRowToRecord(
  row: AssetPackagingRow,
  assetRegistryMap: ReadonlyMap<string, AssetRegistryRecord>,
): PackagingRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  const asset = assetRegistryMap.get(record.asset_registry_id);

  return {
    ...record,
    asset_name: asset?.asset_name ?? "Unknown asset",
    asset_slug: asset?.slug ?? record.asset_registry_id,
  };
}

type PackagingFormValues = Omit<AssetPackagingRow, "id" | "created_at" | "updated_at">;

function readPackagingFormData(formData: FormData) {
  const readText = (name: keyof PackagingFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const portalVisible = formData.get("portal_visible") === "on";
  const status = readText("status");
  const sellerApplicationIdValue = readText("seller_application_id");
  const validStatuses = ["incomplete", "draft_ready", "approved_for_listing"] as const;

  const invalid =
    !readText("asset_registry_id") ||
    !readText("one_line_pitch") ||
    !readText("short_listing_description") ||
    !readText("full_summary") ||
    !readText("buyer_type") ||
    !readText("screenshots") ||
    !readText("demo_link") ||
    !readText("logo_brand_kit") ||
    !readText("feature_summary") ||
    !readText("stack_summary") ||
    !readText("support_scope") ||
    !readText("transfer_checklist") ||
    !readText("asking_price") ||
    !validStatuses.includes(status as (typeof validStatuses)[number]);

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      asset_registry_id: readText("asset_registry_id"),
      seller_application_id: sellerApplicationIdValue || null,
      one_line_pitch: readText("one_line_pitch"),
      short_listing_description: readText("short_listing_description"),
      full_summary: readText("full_summary"),
      buyer_type: readText("buyer_type"),
      screenshots: readText("screenshots"),
      demo_link: readText("demo_link"),
      logo_brand_kit: readText("logo_brand_kit"),
      feature_summary: readText("feature_summary"),
      stack_summary: readText("stack_summary"),
      support_scope: readText("support_scope"),
      transfer_checklist: readText("transfer_checklist"),
      asking_price: readText("asking_price"),
      portal_visible: portalVisible,
      portal_summary: readText("portal_summary"),
      status: status as PackagingStatus,
    } satisfies PackagingFormValues,
  } as const;
}

function readPackagingId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

export async function getPackagingRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const [packagingResult, assetRegistryRecords] = await Promise.all([
      supabase.from("asset_packaging").select("*").order("created_at", { ascending: false }),
      getAssetRegistryRecords(),
    ]);

    const { data, error } = packagingResult;

    if (error || !data) {
      return [];
    }

    const assetRegistryMap = new Map(assetRegistryRecords.map((record) => [record.id, record]));
    return data.map((row) => mapPackagingRowToRecord(row, assetRegistryMap));
  } catch {
    return [];
  }
}

export async function getSellerApplicationOptions() {
  if (!hasSupabaseEnv()) {
    return [] as SellerApplicationOption[];
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return [] as SellerApplicationOption[];
  }

  try {
    const { data, error } = await adminClient
      .from("seller_applications")
      .select("*")
      .in("status", ["approved", "invited", "activated"])
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as SellerApplicationOption[];
  } catch {
    return [];
  }
}

export async function createPackagingRecord(formData: FormData) {
  "use server";

  const parsed = readPackagingFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/packaging?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const existingRecord = await supabase
      .from("asset_packaging")
      .select("id")
      .eq("asset_registry_id", parsed.data.asset_registry_id)
      .maybeSingle();

    if (existingRecord.data) {
      redirect("/admin/packaging?error=That%20asset%20already%20has%20a%20packaging%20record.");
    }

    const { error } = await supabase.from("asset_packaging").insert({
      id: randomUUID(),
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/packaging?error=Unable%20to%20save%20the%20new%20packaging%20record.");
    }

    revalidatePath("/admin/packaging");
    redirect("/admin/packaging?saved=created");
  } catch {
    redirect("/admin/packaging?error=Unable%20to%20save%20the%20new%20packaging%20record.");
  }
}

export async function updatePackagingRecord(formData: FormData) {
  "use server";

  const id = readPackagingId(formData);
  const parsed = readPackagingFormData(formData);

  if (!id) {
    redirect("/admin/packaging?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/packaging?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const existingRecord = await supabase
      .from("asset_packaging")
      .select("id")
      .eq("asset_registry_id", parsed.data.asset_registry_id)
      .neq("id", id)
      .maybeSingle();

    if (existingRecord.data) {
      redirect("/admin/packaging?error=That%20asset%20already%20has%20a%20packaging%20record.");
    }

    const { error } = await supabase.from("asset_packaging").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/packaging?error=Unable%20to%20update%20the%20packaging%20record.");
    }

    revalidatePath("/admin/packaging");
    redirect("/admin/packaging?saved=updated");
  } catch {
    redirect("/admin/packaging?error=Unable%20to%20update%20the%20packaging%20record.");
  }
}
