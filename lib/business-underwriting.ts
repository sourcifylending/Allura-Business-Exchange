import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BusinessUnderwritingRow } from "@/lib/supabase/database.types";

export type UnderwritingStatus = "screening" | "reviewing" | "hold" | "approved" | "rejected";

export type RiskLevel = "low" | "medium" | "high";

export type BusinessUnderwritingRecord = Readonly<Omit<BusinessUnderwritingRow, "created_at" | "updated_at">> & {
  cash_flow_profit_range: string;
  sde_owner_benefit_placeholder: string;
  overall_underwriting_status: UnderwritingStatus;
  deal_quality: RiskLevel;
  transferability_score: RiskLevel;
  debt_risk: RiskLevel;
  owner_dependence_risk: RiskLevel;
  spread_score: RiskLevel;
};

export const underwritingStatusLabels: Record<UnderwritingStatus, string> = {
  screening: "Screening",
  reviewing: "Reviewing",
  hold: "Hold",
  approved: "Approved",
  rejected: "Rejected",
};

export const riskLevelLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

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

function mapUnderwritingRowToRecord(row: BusinessUnderwritingRow): BusinessUnderwritingRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;

  return {
    ...record,
    cash_flow_profit_range: record.cash_flow_range,
    sde_owner_benefit_placeholder: record.sde_owner_benefit,
    overall_underwriting_status: record.underwriting_status,
    deal_quality: inferRiskLevel(record.margin_quality, record.closing_friction, record.spread_potential),
    transferability_score: inferRiskLevel(record.transferability, record.customer_concentration, record.growth_opportunity),
    debt_risk: inferRiskLevel(record.debt_mca_lien_status, record.risk_flags.join(" "), record.next_action),
    owner_dependence_risk: inferRiskLevel(record.owner_dependence, record.transferability, record.risk_flags.join(" ")),
    spread_score: inferRiskLevel(record.spread_potential, record.margin_quality, record.growth_opportunity),
  };
}

type BusinessUnderwritingFormValues = Omit<BusinessUnderwritingRow, "id" | "created_at" | "updated_at">;

function readUnderwritingFormData(formData: FormData) {
  const readText = (name: keyof BusinessUnderwritingFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const underwriting_status = readText("underwriting_status");
  const riskFlagsText = readText("risk_flags");
  const validStatuses = ["screening", "reviewing", "hold", "approved", "rejected"] as const;

  const risk_flags = riskFlagsText
    ? riskFlagsText
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

  const invalid =
    !readText("business_name") ||
    !readText("industry") ||
    !readText("location") ||
    !readText("years_in_business") ||
    !readText("monthly_revenue_range") ||
    !readText("cash_flow_range") ||
    !readText("sde_owner_benefit") ||
    !readText("debt_mca_lien_status") ||
    !readText("customer_concentration") ||
    !readText("owner_dependence") ||
    !readText("transferability") ||
    !readText("margin_quality") ||
    !readText("growth_opportunity") ||
    !readText("closing_friction") ||
    !readText("spread_potential") ||
    !readText("next_action") ||
    !validStatuses.includes(underwriting_status as (typeof validStatuses)[number]);

  if (invalid) {
    return { error: "Please complete all required fields." } as const;
  }

  return {
    data: {
      business_name: readText("business_name"),
      industry: readText("industry"),
      location: readText("location"),
      years_in_business: readText("years_in_business"),
      monthly_revenue_range: readText("monthly_revenue_range"),
      cash_flow_range: readText("cash_flow_range"),
      sde_owner_benefit: readText("sde_owner_benefit"),
      debt_mca_lien_status: readText("debt_mca_lien_status"),
      customer_concentration: readText("customer_concentration"),
      owner_dependence: readText("owner_dependence"),
      transferability: readText("transferability"),
      margin_quality: readText("margin_quality"),
      growth_opportunity: readText("growth_opportunity"),
      closing_friction: readText("closing_friction"),
      spread_potential: readText("spread_potential"),
      underwriting_status: underwriting_status as BusinessUnderwritingRow["underwriting_status"],
      risk_flags,
      next_action: readText("next_action"),
    } satisfies BusinessUnderwritingFormValues,
  } as const;
}

function readUnderwritingId(formData: FormData) {
  const idValue = formData.get("id");
  return typeof idValue === "string" ? idValue.trim() : "";
}

function inferRiskLevel(...values: string[]): RiskLevel {
  const text = values.join(" ").toLowerCase();

  if (/(high|risk|pending|unclear|material|limited|heavy|hold|red flag)/.test(text)) {
    return "high";
  }

  if (/(medium|moderate|partial|review|confirm|clean-up|clean up|good|fair)/.test(text)) {
    return "medium";
  }

  return "low";
}

export async function getUnderwritingRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("business_underwriting").select("*").order("created_at", {
      ascending: false,
    });

    if (error || !data) {
      return [];
    }

    return data.map(mapUnderwritingRowToRecord);
  } catch {
    return [];
  }
}

export async function createUnderwritingRecord(formData: FormData) {
  "use server";

  const parsed = readUnderwritingFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/underwriting?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("business_underwriting").insert({
      id: randomUUID(),
      ...parsed.data,
    } as never);

    if (error) {
      redirect("/admin/underwriting?error=Unable%20to%20save%20the%20new%20underwriting%20record.");
    }

    revalidatePath("/admin/underwriting");
    redirect("/admin/underwriting?saved=created");
  } catch {
    redirect("/admin/underwriting?error=Unable%20to%20save%20the%20new%20underwriting%20record.");
  }
}

export async function updateUnderwritingRecord(formData: FormData) {
  "use server";

  const id = readUnderwritingId(formData);
  const parsed = readUnderwritingFormData(formData);

  if (!id) {
    redirect("/admin/underwriting?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/underwriting?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("business_underwriting").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/underwriting?error=Unable%20to%20update%20the%20underwriting%20record.");
    }

    revalidatePath("/admin/underwriting");
    redirect("/admin/underwriting?saved=updated");
  } catch {
    redirect("/admin/underwriting?error=Unable%20to%20update%20the%20underwriting%20record.");
  }
}
