export type IntakeStatus = "new" | "in_review" | "needs_info" | "complete";

export type ReviewStatus = "pending" | "clear" | "red_flags" | "hold";

export type BusinessIntakeRecord = Readonly<{
  id: string;
  legal_business_name: string;
  dba: string;
  industry: string;
  location: string;
  years_in_business: string;
  monthly_revenue_range: string;
  cash_flow_profit_range: string;
  reason_for_selling: string;
  debt_liens_mca_disclosure: string;
  number_of_employees: string;
  owner_involvement: string;
  equipment_assets: string;
  transferability_notes: string;
  uploads_placeholder_list: string[];
  intake_status: IntakeStatus;
  review_status: ReviewStatus;
  next_action: string;
}>;

export const businessIntakeRecords: BusinessIntakeRecord[] = [
  {
    id: "biz-01",
    legal_business_name: "North Shore Home Services LLC",
    dba: "North Shore Services",
    industry: "Home Services",
    location: "Southeast US",
    years_in_business: "7 years",
    monthly_revenue_range: "$42k - $55k",
    cash_flow_profit_range: "$8k - $12k",
    reason_for_selling: "Owner wants to reduce hands-on work and reposition capital.",
    debt_liens_mca_disclosure: "No known liens; MCA disclosure pending confirmation.",
    number_of_employees: "9",
    owner_involvement: "High, owner still involved in sales and dispatch",
    equipment_assets: "Service vehicle fleet, field equipment, phone numbers",
    transferability_notes: "Operations are transferable but owner dependence remains a concern.",
    uploads_placeholder_list: ["P&L placeholder", "Tax return placeholder", "Equipment list placeholder"],
    intake_status: "in_review",
    review_status: "pending",
    next_action: "Request financials and ownership verification",
  },
  {
    id: "biz-02",
    legal_business_name: "Blue Pine Digital Marketing Inc",
    dba: "Blue Pine Digital",
    industry: "Marketing Services",
    location: "Midwest US",
    years_in_business: "5 years",
    monthly_revenue_range: "$18k - $24k",
    cash_flow_profit_range: "$4k - $6k",
    reason_for_selling: "Founder is shifting into a different business line.",
    debt_liens_mca_disclosure: "No debt disclosed; verification pending.",
    number_of_employees: "4",
    owner_involvement: "Moderate",
    equipment_assets: "Laptops, software subscriptions, client assets",
    transferability_notes: "Client concentration and owner-led sales need review.",
    uploads_placeholder_list: ["Client list placeholder", "Service agreement placeholder", "Bank statement placeholder"],
    intake_status: "needs_info",
    review_status: "red_flags",
    next_action: "Clarify customer concentration and debt position",
  },
  {
    id: "biz-03",
    legal_business_name: "Metro Fleet Solutions LLC",
    dba: "Metro Fleet",
    industry: "B2B Services",
    location: "Northeast US",
    years_in_business: "10 years",
    monthly_revenue_range: "$60k - $75k",
    cash_flow_profit_range: "$12k - $18k",
    reason_for_selling: "Owner nearing retirement and wants orderly exit.",
    debt_liens_mca_disclosure: "No liens disclosed; clean up to verify.",
    number_of_employees: "12",
    owner_involvement: "Low to moderate",
    equipment_assets: "Equipment, vehicles, vendor accounts",
    transferability_notes: "Stronger transfer profile than most intake records.",
    uploads_placeholder_list: ["Asset list placeholder", "Lease placeholder", "Operating summary placeholder"],
    intake_status: "complete",
    review_status: "clear",
    next_action: "Prepare for underwriting",
  },
];

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

