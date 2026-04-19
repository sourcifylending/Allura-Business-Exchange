export type RadarStatus = "idea" | "researching" | "approved" | "rejected" | "later";

export type ScoreLevel = "low" | "medium" | "high";

export type RadarRecord = Readonly<{
  id: string;
  niche_industry: string;
  problem_statement: string;
  target_buyer: string;
  urgency_of_pain: ScoreLevel;
  competition_level: ScoreLevel;
  build_complexity: ScoreLevel;
  speed_to_build_score: number;
  speed_to_sell_score: number;
  likely_sale_price_band: string;
  saleability_score: number;
  demand_notes: string;
  reason_to_build_now: string;
  status: RadarStatus;
}>;

export const radarRecords: RadarRecord[] = [
  {
    id: "idea-01",
    niche_industry: "Home Services",
    problem_statement: "Teams need faster lead intake and instant routing before leads go cold.",
    target_buyer: "Owner-operators and small dispatch teams",
    urgency_of_pain: "high",
    competition_level: "medium",
    build_complexity: "low",
    speed_to_build_score: 9,
    speed_to_sell_score: 8,
    likely_sale_price_band: "$15k - $30k",
    saleability_score: 88,
    demand_notes: "Clear pain, easy demo, obvious ROI story.",
    reason_to_build_now: "Fast to package into a narrow AI workflow tool with a clean buyer story.",
    status: "idea",
  },
  {
    id: "idea-02",
    niche_industry: "Agencies",
    problem_statement: "Small agencies need quicker scoping and proposal framing after discovery calls.",
    target_buyer: "Agency founders and ops leads",
    urgency_of_pain: "high",
    competition_level: "high",
    build_complexity: "medium",
    speed_to_build_score: 7,
    speed_to_sell_score: 8,
    likely_sale_price_band: "$20k - $40k",
    saleability_score: 84,
    demand_notes: "Crowded niche, but the buyer pain is easy to explain and demo.",
    reason_to_build_now: "Strong fit for a branded AI asset with visible time savings.",
    status: "researching",
  },
  {
    id: "idea-03",
    niche_industry: "B2B Operations",
    problem_statement: "Operators want a structured way to summarize internal tasks and keep teams aligned.",
    target_buyer: "Operations managers",
    urgency_of_pain: "medium",
    competition_level: "medium",
    build_complexity: "low",
    speed_to_build_score: 8,
    speed_to_sell_score: 7,
    likely_sale_price_band: "$12k - $24k",
    saleability_score: 79,
    demand_notes: "Useful, but needs sharper positioning than the top ideas.",
    reason_to_build_now: "Good fallback asset if the niche can be narrowed further.",
    status: "approved",
  },
  {
    id: "idea-04",
    niche_industry: "Local Services",
    problem_statement: "The niche is too broad and the buyer story is not distinct enough yet.",
    target_buyer: "General SMB buyers",
    urgency_of_pain: "medium",
    competition_level: "high",
    build_complexity: "medium",
    speed_to_build_score: 5,
    speed_to_sell_score: 4,
    likely_sale_price_band: "$8k - $15k",
    saleability_score: 42,
    demand_notes: "Needs sharper buyer clarity before it becomes build-worthy.",
    reason_to_build_now: "Hold until the niche narrows and a stronger value proposition appears.",
    status: "later",
  },
  {
    id: "idea-05",
    niche_industry: "Recruiting",
    problem_statement: "The current concept would require too many dependencies and a larger support burden.",
    target_buyer: "Recruiting agencies",
    urgency_of_pain: "high",
    competition_level: "high",
    build_complexity: "high",
    speed_to_build_score: 4,
    speed_to_sell_score: 5,
    likely_sale_price_band: "$25k - $45k",
    saleability_score: 38,
    demand_notes: "Interesting market, but too heavy for the current build-to-sell velocity target.",
    reason_to_build_now: "Reject for now because the implementation cost is too high.",
    status: "rejected",
  },
];

export const radarStatusOrder: RadarStatus[] = [
  "idea",
  "researching",
  "approved",
  "rejected",
  "later",
];

export const radarStatusLabels: Record<RadarStatus, string> = {
  idea: "Idea",
  researching: "Researching",
  approved: "Approved",
  rejected: "Rejected",
  later: "Later",
};

