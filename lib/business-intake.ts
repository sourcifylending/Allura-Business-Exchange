import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BusinessIntakeRow } from "@/lib/supabase/database.types";

export type IntakeStatus = "new" | "in_review" | "needs_info" | "complete";

export type ReviewStatus = "pending" | "clear" | "red_flags" | "hold";

export type BusinessIntakeRecord = Readonly<Omit<BusinessIntakeRow, "created_at" | "updated_at">>;

export const intakeStatusLabels: Record<IntakeStatus, string> = {
  new: "New",
  in_review: "In Review",
  needs_info: "Needs Info",
  complete: "Complete",
};

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: "Pending",
  clear: "Clear",
  red_flags: "Red Flags",
  hold: "Hold",
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

function mapBusinessIntakeRowToRecord(row: BusinessIntakeRow): BusinessIntakeRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

type BusinessIntakeFormValues = Omit<BusinessIntakeRow, "id" | "created_at" | "updated_at">;

function readBusinessIntakeFormData(formData: FormData) {
  const readText = (name: keyof BusinessIntakeFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const intake_status = readText("intake_status");
  const review_status = readText("review_status");
  const uploadsText = readText("uploads_placeholder_list");

  const validIntakeStatuses = ["new", "in_review", "needs_info", "complete"] as const;
  const validReviewStatuses = ["pending", "clear", "red_flags", "hold"] as const;

  const uploads_placeholder_list = uploadsText
    ? uploadsText
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

  const invalid =
    !readText("legal_business_name") ||
    !readText("dba") ||
    !readText("industry") ||
    !readText("location") ||
    !readText("years_in_business") ||
    !readText("monthly_revenue_range") ||
    !readText("cash_flow_profit_range") ||
    !readText("reason_for_selling") ||
    !readText("debt_liens_mca_disclosure") ||
    !readText("number_of_employees") ||
    !readText("owner_involvement") ||
    !readText("equipment_assets") ||
    !readText("transferability_notes") ||
    !readText("next_action") ||
    !validIntakeStatuses.includes(intake_status as (typeof validIntakeStatuses)[number]) ||
    !validReviewStatuses.includes(review_status as (typeof validReviewStatuses)[number]);

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      legal_business_name: readText("legal_business_name"),
      dba: readText("dba"),
      industry: readText("industry"),
      location: readText("location"),
      years_in_business: readText("years_in_business"),
      monthly_revenue_range: readText("monthly_revenue_range"),
      cash_flow_profit_range: readText("cash_flow_profit_range"),
      reason_for_selling: readText("reason_for_selling"),
      debt_liens_mca_disclosure: readText("debt_liens_mca_disclosure"),
      number_of_employees: readText("number_of_employees"),
      owner_involvement: readText("owner_involvement"),
      equipment_assets: readText("equipment_assets"),
      transferability_notes: readText("transferability_notes"),
      uploads_placeholder_list,
      intake_status: intake_status as BusinessIntakeRow["intake_status"],
      review_status: review_status as BusinessIntakeRow["review_status"],
      next_action: readText("next_action"),
    } satisfies BusinessIntakeFormValues,
  } as const;
}

function readBusinessIntakeId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

export async function getBusinessIntakeRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("business_intake").select("*").order("created_at", {
      ascending: false,
    });

    if (error || !data) {
      return [];
    }

    return data.map(mapBusinessIntakeRowToRecord);
  } catch {
    return [];
  }
}

export async function createBusinessIntakeRecord(formData: FormData) {
  "use server";

  const parsed = readBusinessIntakeFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/business-submissions?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("business_intake").insert({
      id: randomUUID(),
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/business-submissions?error=Unable%20to%20save%20the%20new%20intake.");
    }

    revalidatePath("/admin/business-submissions");
    redirect("/admin/business-submissions?saved=created");
  } catch {
    redirect("/admin/business-submissions?error=Unable%20to%20save%20the%20new%20intake.");
  }
}

export async function updateBusinessIntakeRecord(formData: FormData) {
  "use server";

  const id = readBusinessIntakeId(formData);
  const parsed = readBusinessIntakeFormData(formData);

  if (!id) {
    redirect("/admin/business-submissions?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/business-submissions?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("business_intake").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/business-submissions?error=Unable%20to%20update%20the%20intake.");
    }

    revalidatePath("/admin/business-submissions");
    redirect("/admin/business-submissions?saved=updated");
  } catch {
    redirect("/admin/business-submissions?error=Unable%20to%20update%20the%20intake.");
  }
}
