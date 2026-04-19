export type ListingType = "ai_asset" | "business";

export type VisibilityMode = "fully_public" | "public_teaser" | "approved_only";

export type OpportunityStatus = "live" | "coming_soon" | "private_review";

export type OpportunityRecord = Readonly<{
  listing_type: ListingType;
  visibility_mode: VisibilityMode;
  title_public: string;
  title_private: string;
  brand_name: string;
  short_description: string;
  asking_price: string;
  price_range: string;
  status: OpportunityStatus;
  cover_image: string;
  region: string;
  category: string;
  nda_required: boolean;
  published: boolean;
}>;

export const opportunities: OpportunityRecord[] = [
  {
    listing_type: "ai_asset",
    visibility_mode: "fully_public",
    title_public: "ReplyPilot",
    title_private: "ReplyPilot - AI inbox triage for niche service teams",
    brand_name: "ReplyPilot",
    short_description:
      "A focused AI inbox assistant for service businesses that need faster response routing and cleaner intake.",
    asking_price: "$18,000",
    price_range: "$15k - $24k",
    status: "live",
    cover_image: "AI inbox assistant preview",
    region: "Remote",
    category: "AI Workflow Tool",
    nda_required: false,
    published: true,
  },
  {
    listing_type: "ai_asset",
    visibility_mode: "fully_public",
    title_public: "ScopeFlow",
    title_private: "ScopeFlow - sales scope builder for agencies",
    brand_name: "ScopeFlow",
    short_description:
      "A branded digital asset that helps agencies turn discovery calls into faster, cleaner scoping outputs.",
    asking_price: "$24,500",
    price_range: "$20k - $30k",
    status: "live",
    cover_image: "Agency scoping tool preview",
    region: "United States",
    category: "AI Sales Tool",
    nda_required: false,
    published: true,
  },
  {
    listing_type: "business",
    visibility_mode: "public_teaser",
    title_public: "Regional Home Services Opportunity",
    title_private: "Confidential home services business in the Southeast",
    brand_name: "Sanitized Opportunity",
    short_description:
      "A regional home services opportunity presented as a teaser while deeper materials remain private.",
    asking_price: "$165,000",
    price_range: "$150k - $180k",
    status: "private_review",
    cover_image: "Sanitized business teaser preview",
    region: "Southeast US",
    category: "Home Services",
    nda_required: true,
    published: true,
  },
  {
    listing_type: "business",
    visibility_mode: "approved_only",
    title_public: "Specialty Services Acquisition",
    title_private: "Private operating business under review",
    brand_name: "Confidential",
    short_description:
      "A private acquisition opportunity shown only as a controlled teaser before approval.",
    asking_price: "$320,000",
    price_range: "$300k - $350k",
    status: "coming_soon",
    cover_image: "Private opportunity placeholder",
    region: "Midwest US",
    category: "Specialty Services",
    nda_required: true,
    published: false,
  },
];

export const aiAssetOpportunities = opportunities.filter(
  (opportunity) => opportunity.listing_type === "ai_asset" && opportunity.published,
);

export const businessTeaserOpportunities = opportunities.filter(
  (opportunity) => opportunity.listing_type === "business" && opportunity.published,
);
