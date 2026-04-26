import { createClient } from "@/lib/supabase/server";
import type {
  DigitalAssetRow,
  DigitalAssetTaskRow,
  DigitalAssetBuyerInterestRow,
  InsertRow,
  UpdateRow,
} from "@/lib/supabase/database.types";

export async function getDigitalAssets() {
  const client = createClient();
  const { data, error } = await (client.from("digital_assets") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DigitalAssetRow[];
}

export async function getDigitalAsset(id: string) {
  const client = createClient();
  const { data, error } = await (client.from("digital_assets") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DigitalAssetRow;
}

export async function createDigitalAsset(asset: InsertRow<DigitalAssetRow>) {
  const client = createClient();
  const { data, error } = await (client.from("digital_assets") as any)
    .insert([asset])
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetRow;
}

export async function updateDigitalAsset(id: string, updates: UpdateRow<DigitalAssetRow>) {
  const client = createClient();
  const { data, error } = await (client.from("digital_assets") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetRow;
}

export async function getDigitalAssetTasks(assetId: string) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_tasks") as any)
    .select("*")
    .eq("digital_asset_id", assetId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DigitalAssetTaskRow[];
}

export async function createDigitalAssetTask(task: InsertRow<DigitalAssetTaskRow>) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_tasks") as any)
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetTaskRow;
}

export async function updateDigitalAssetTask(id: string, updates: UpdateRow<DigitalAssetTaskRow>) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_tasks") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetTaskRow;
}

export async function deleteDigitalAssetTask(id: string) {
  const client = createClient();
  const { error } = await (client.from("digital_asset_tasks") as any).delete().eq("id", id);

  if (error) throw error;
}

export async function getDigitalAssetBuyerInterests(assetId: string) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
    .select("*")
    .eq("digital_asset_id", assetId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DigitalAssetBuyerInterestRow[];
}

export async function createDigitalAssetBuyerInterest(
  interest: InsertRow<DigitalAssetBuyerInterestRow>
) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
    .insert([interest])
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetBuyerInterestRow;
}

export async function updateDigitalAssetBuyerInterest(
  id: string,
  updates: UpdateRow<DigitalAssetBuyerInterestRow>
) {
  const client = createClient();
  const { data, error } = await (client.from("digital_asset_buyer_interest") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as DigitalAssetBuyerInterestRow;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    for_sale: "bg-accent-100 text-accent-900 border-accent-200",
    in_build: "bg-blue-100 text-blue-900 border-blue-200",
    sold: "bg-green-100 text-green-900 border-green-200",
    paused: "bg-amber-100 text-amber-900 border-amber-200",
    internal: "bg-purple-100 text-purple-900 border-purple-200",
  };
  return colors[status] || "bg-ink-100 text-ink-900 border-ink-200";
}

export function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    for_sale: "For Sale",
    in_build: "In Build",
    sold: "Sold",
    paused: "Paused",
    internal: "Internal",
  };
  return labels[status] || status;
}
