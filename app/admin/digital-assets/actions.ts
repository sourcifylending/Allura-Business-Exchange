"use server";

import {
  createDigitalAssetTask,
  deleteDigitalAssetTask,
  createDigitalAssetBuyerInterest,
  updateDigitalAsset,
  updateDigitalAssetBuyerInterest,
} from "@/lib/digital-assets";
import type { InsertRow, DigitalAssetBuyerInterestRow, UpdateRow, DigitalAssetRow, DigitalAssetBuyerInterestNDAStatus } from "@/lib/supabase/database.types";

export async function addTaskAction(
  assetId: string,
  title: string
) {
  return createDigitalAssetTask({
    digital_asset_id: assetId,
    title: title.trim(),
    status: "open",
    priority: "normal",
  });
}

export async function removeTaskAction(taskId: string) {
  return deleteDigitalAssetTask(taskId);
}

export async function addBuyerInterestAction(
  assetId: string,
  buyerName: string,
  buyerEmail: string
) {
  return createDigitalAssetBuyerInterest({
    digital_asset_id: assetId,
    buyer_name: buyerName.trim() || null,
    buyer_email: buyerEmail.trim() || null,
    status: "new",
    nda_status: "not_sent",
    proof_of_funds_status: "not_requested",
  } as InsertRow<DigitalAssetBuyerInterestRow>);
}

export async function updateAssetNotesAction(assetId: string, notes: string) {
  return updateDigitalAsset(assetId, { notes } as UpdateRow<DigitalAssetRow>);
}

export async function updateBuyerNDAStatusAction(
  buyerInterestId: string,
  ndaStatus: DigitalAssetBuyerInterestNDAStatus
) {
  return updateDigitalAssetBuyerInterest(buyerInterestId, {
    nda_status: ndaStatus,
  } as UpdateRow<DigitalAssetBuyerInterestRow>);
}

export async function updateBuyerFieldAction(
  buyerInterestId: string,
  updates: Partial<UpdateRow<DigitalAssetBuyerInterestRow>>
) {
  return updateDigitalAssetBuyerInterest(buyerInterestId, updates as UpdateRow<DigitalAssetBuyerInterestRow>);
}
