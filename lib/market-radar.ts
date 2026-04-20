import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MarketRadarLevel, MarketRadarRow, MarketRadarStatus } from "@/lib/supabase/database.types";

export type RadarStatus = MarketRadarStatus;

export type ScoreLevel = MarketRadarLevel;

export type RadarRecord = Readonly<Omit<MarketRadarRow, "created_at" | "updated_at">>;

export const radarStatusOrder: RadarStatus[] = ["idea", "researching", "approved", "rejected", "later"];

export const radarStatusLabels: Record<RadarStatus, string> = {
  idea: "Idea",
  researching: "Researching",
  approved: "Approved",
  rejected: "Rejected",
  later: "Later",
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

function mapRadarRowToRecord(row: MarketRadarRow): RadarRecord {
  const { created_at: _createdAt, updated_at: _updatedAt, ...record } = row;
  return record;
}

export async function getRadarRecords() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("market_radar")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapRadarRowToRecord);
  } catch {
    return [];
  }
}

type RadarFormValues = Omit<
  MarketRadarRow,
  "id" | "created_at" | "updated_at"
>;

function readRadarFormData(formData: FormData) {
  const readText = (name: keyof RadarFormValues) => {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  };

  const readScore = (name: "speed_to_build_score" | "speed_to_sell_score" | "saleability_score") => {
    const value = Number.parseInt(readText(name), 10);
    return Number.isFinite(value) ? value : Number.NaN;
  };

  const urgency_of_pain = readText("urgency_of_pain");
  const competition_level = readText("competition_level");
  const build_complexity = readText("build_complexity");
  const status = readText("status");
  const scores = {
    speed_to_build_score: readScore("speed_to_build_score"),
    speed_to_sell_score: readScore("speed_to_sell_score"),
    saleability_score: readScore("saleability_score"),
  };

  const invalid =
    !readText("niche_industry") ||
    !readText("problem_statement") ||
    !readText("target_buyer") ||
    !readText("likely_sale_price_band") ||
    !readText("demand_notes") ||
    !readText("reason_to_build_now") ||
    !["low", "medium", "high"].includes(urgency_of_pain) ||
    !["low", "medium", "high"].includes(competition_level) ||
    !["low", "medium", "high"].includes(build_complexity) ||
    !radarStatusLabels[status as RadarStatus] ||
    scores.speed_to_build_score < 0 ||
    scores.speed_to_build_score > 10 ||
    scores.speed_to_sell_score < 0 ||
    scores.speed_to_sell_score > 10 ||
    scores.saleability_score < 0 ||
    scores.saleability_score > 100;

  if (invalid) {
    return { error: "Please complete all required fields with valid values." } as const;
  }

  return {
    data: {
      niche_industry: readText("niche_industry"),
      problem_statement: readText("problem_statement"),
      target_buyer: readText("target_buyer"),
      urgency_of_pain: urgency_of_pain as MarketRadarLevel,
      competition_level: competition_level as MarketRadarLevel,
      build_complexity: build_complexity as MarketRadarLevel,
      speed_to_build_score: scores.speed_to_build_score,
      speed_to_sell_score: scores.speed_to_sell_score,
      likely_sale_price_band: readText("likely_sale_price_band"),
      saleability_score: scores.saleability_score,
      demand_notes: readText("demand_notes"),
      reason_to_build_now: readText("reason_to_build_now"),
      status: status as RadarStatus,
    } satisfies RadarFormValues,
  } as const;
}

export async function createRadarRecord(formData: FormData) {
  "use server";

  const parsed = readRadarFormData(formData);

  if ("error" in parsed) {
    redirect(
      `/admin/market-radar?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields with valid values.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("market_radar").insert(parsed.data as never);

    if (error) {
      redirect("/admin/market-radar?error=Unable%20to%20save%20the%20new%20idea.");
    }

    revalidatePath("/admin/market-radar");
    redirect("/admin/market-radar?saved=created");
  } catch {
    redirect("/admin/market-radar?error=Unable%20to%20save%20the%20new%20idea.");
  }
}

export async function updateRadarRecord(formData: FormData) {
  "use server";

  const idValue = formData.get("id");
  const id = typeof idValue === "string" ? idValue.trim() : "";
  const parsed = readRadarFormData(formData);

  if (!id) {
    redirect("/admin/market-radar?error=Missing%20record%20id.");
  }

  if ("error" in parsed) {
    redirect(
      `/admin/market-radar?error=${encodeURIComponent(
        parsed.error ?? "Please complete all required fields with valid values.",
      )}`,
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("market_radar").update(parsed.data as never).eq("id", id);

    if (error) {
      redirect("/admin/market-radar?error=Unable%20to%20update%20the%20idea.");
    }

    revalidatePath("/admin/market-radar");
    redirect("/admin/market-radar?saved=updated");
  } catch {
    redirect("/admin/market-radar?error=Unable%20to%20update%20the%20idea.");
  }
}
