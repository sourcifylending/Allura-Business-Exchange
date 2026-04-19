export type UnderwritingStatus = "screening" | "reviewing" | "hold" | "approved" | "rejected";

export type RiskLevel = "low" | "medium" | "high";

export type BusinessUnderwritingRecord = Readonly<{
  id: string;
  business_name: string;
  industry: string;
  location: string;
  years_in_business: string;
  monthly_revenue_range: string;
  cash_flow_profit_range: string;
  sde_owner_benefit_placeholder: string;
  debt_mca_lien_status: string;
  customer_concentration: string;
  owner_dependence: string;
  transferability: string;
  margin_quality: string;
  growth_opportunity: string;
  closing_friction: string;
  spread_potential: string;
  overall_underwriting_status: UnderwritingStatus;
  risk_flags: string[];
  next_action: string;
  deal_quality: RiskLevel;
  transferability_score: RiskLevel;
  debt_risk: RiskLevel;
  owner_dependence_risk: RiskLevel;
  spread_score: RiskLevel;
}>;

export const underwritingRecords: BusinessUnderwritingRecord[] = [
  {
    id: "uw-01",
    business_name: "North Shore Home Services LLC",
    industry: "Home Services",
    location: "Southeast US",
    years_in_business: "7 years",
    monthly_revenue_range: "$42k - $55k",
    cash_flow_profit_range: "$8k - $12k",
    sde_owner_benefit_placeholder: "$96k - $144k",
    debt_mca_lien_status: "No known liens; MCA disclosure pending confirmation",
    customer_concentration: "Moderate",
    owner_dependence: "High",
    transferability: "Transferable but owner-led sales are still material",
    margin_quality: "Good",
    growth_opportunity: "Expand routing and add repeat customer systems",
    closing_friction: "Medium",
    spread_potential: "Moderate",
    overall_underwriting_status: "reviewing",
    risk_flags: ["Owner dependence", "MCA verification pending"],
    next_action: "Confirm debt and reduce owner dependence risk",
    deal_quality: "medium",
    transferability_score: "medium",
    debt_risk: "medium",
    owner_dependence_risk: "high",
    spread_score: "medium",
  },
  {
    id: "uw-02",
    business_name: "Blue Pine Digital Marketing Inc",
    industry: "Marketing Services",
    location: "Midwest US",
    years_in_business: "5 years",
    monthly_revenue_range: "$18k - $24k",
    cash_flow_profit_range: "$4k - $6k",
    sde_owner_benefit_placeholder: "$48k - $72k",
    debt_mca_lien_status: "No debt disclosed; verification pending",
    customer_concentration: "High",
    owner_dependence: "High",
    transferability: "Limited until client mix improves",
    margin_quality: "Fair",
    growth_opportunity: "Possible, but requires stronger retention and cleaner delivery",
    closing_friction: "High",
    spread_potential: "Low",
    overall_underwriting_status: "hold",
    risk_flags: ["Customer concentration", "Owner-led sales", "Debt disclosure incomplete"],
    next_action: "Clarify concentration and debt position before proceeding",
    deal_quality: "low",
    transferability_score: "low",
    debt_risk: "medium",
    owner_dependence_risk: "high",
    spread_score: "low",
  },
  {
    id: "uw-03",
    business_name: "Metro Fleet Solutions LLC",
    industry: "B2B Services",
    location: "Northeast US",
    years_in_business: "10 years",
    monthly_revenue_range: "$60k - $75k",
    cash_flow_profit_range: "$12k - $18k",
    sde_owner_benefit_placeholder: "$144k - $216k",
    debt_mca_lien_status: "No liens disclosed; clean-up verification in progress",
    customer_concentration: "Low to moderate",
    owner_dependence: "Low to moderate",
    transferability: "Stronger than most intake records",
    margin_quality: "Strong",
    growth_opportunity: "Good room for operational cleanup and channel expansion",
    closing_friction: "Low to medium",
    spread_potential: "Good",
    overall_underwriting_status: "approved",
    risk_flags: ["Final verification still needed"],
    next_action: "Prepare for buyer presentation and packaging",
    deal_quality: "high",
    transferability_score: "high",
    debt_risk: "low",
    owner_dependence_risk: "medium",
    spread_score: "high",
  },
];

export const underwritingStatusLabels: Record<UnderwritingStatus, string> = {
  screening: "Screening",
  reviewing: "Reviewing",
  hold: "Hold",
  approved: "Approved",
  rejected: "Rejected",
};

