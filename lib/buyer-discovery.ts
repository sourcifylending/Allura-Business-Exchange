export type DiscoveryRecord = Readonly<{
  id: string;
  asset_name: string;
  ideal_buyer_profile: string;
  likely_decision_maker: string;
  likely_buyer_company_type: string;
  recommended_promotion_channels: string[];
  recommended_communities_directories_events: string[];
  comparable_software_categories: string[];
  top_target_company_ideas: string[];
  suggested_positioning_angle: string;
  best_places_to_promote: string[];
  where_buyers_gather: string[];
}>;

export const discoveryRecords: DiscoveryRecord[] = [
  {
    id: "disc-01",
    asset_name: "ReplyPilot",
    ideal_buyer_profile: "Owner-operator looking to speed up response time and reduce manual inbox work.",
    likely_decision_maker: "Founder or operations lead",
    likely_buyer_company_type: "Small service business",
    recommended_promotion_channels: ["Direct outreach", "Niche communities", "Founder groups"],
    recommended_communities_directories_events: [
      "Operator communities",
      "Local business groups",
      "Small business meetups",
    ],
    comparable_software_categories: ["Inbox triage", "Lead routing", "Workflow automation"],
    top_target_company_ideas: ["Home services", "Boutique agencies", "Appointment-driven businesses"],
    suggested_positioning_angle: "Save response time and keep leads from slipping away.",
    best_places_to_promote: ["Service operator communities", "No-code groups", "Founder forums"],
    where_buyers_gather: ["Peer groups", "Slack communities", "Local events"],
  },
  {
    id: "disc-02",
    asset_name: "ScopeFlow",
    ideal_buyer_profile: "Agency founder who wants a cleaner handoff from call to proposal.",
    likely_decision_maker: "Founder, sales lead, or ops manager",
    likely_buyer_company_type: "Small agency",
    recommended_promotion_channels: ["Agency communities", "LinkedIn", "Industry newsletters"],
    recommended_communities_directories_events: [
      "Agency owner groups",
      "Marketing communities",
      "Digital agency events",
    ],
    comparable_software_categories: ["Proposal software", "Sales enablement", "Scope automation"],
    top_target_company_ideas: ["Marketing agencies", "Design studios", "Consulting teams"],
    suggested_positioning_angle: "Turn discovery conversations into a faster scope and proposal process.",
    best_places_to_promote: ["Agency forums", "LinkedIn posts", "Agency newsletters"],
    where_buyers_gather: ["Agency peer groups", "Marketing events", "Online communities"],
  },
  {
    id: "disc-03",
    asset_name: "BriefSpark",
    ideal_buyer_profile: "Ops-focused buyer who wants a simple internal tool for task summaries and handoffs.",
    likely_decision_maker: "Operations manager",
    likely_buyer_company_type: "Small team or operations-heavy business",
    recommended_promotion_channels: ["Ops communities", "Peer networks", "Founder circles"],
    recommended_communities_directories_events: [
      "Operations meetups",
      "Team productivity communities",
      "Business systems events",
    ],
    comparable_software_categories: ["Task summarization", "Internal documentation", "Team workflow tools"],
    top_target_company_ideas: ["SaaS support teams", "Ops-heavy SMBs", "Internal enablement teams"],
    suggested_positioning_angle: "Keep teams aligned with less manual summarization work.",
    best_places_to_promote: ["Operations groups", "Productivity communities", "Founder channels"],
    where_buyers_gather: ["Slack groups", "Ops events", "Peer-to-peer communities"],
  },
];

