"use server";

/**
 * Market Radar Research Engine
 *
 * Generates ranked market opportunities and AI asset ideas based on research criteria.
 * This is the agentic research workflow that powers Market Radar.
 */

export type ResearchMode =
  | "hottest_demand"
  | "market_gap"
  | "fast_build"
  | "high_ticket"
  | "buyer_ready";

export type OpportunityType =
  | "AI_SaaS"
  | "Internal_Tool"
  | "Lead_Gen"
  | "Compliance"
  | "CRM_Addon"
  | "Analytics"
  | "Automation";

export type BuildSpeed = "fast" | "medium" | "longer";
export type TargetBuyer =
  | "Agency_Owners"
  | "Small_Business"
  | "Vertical_SaaS"
  | "Private_Equity"
  | "Service_Business"
  | "Compliance"
  | "Sales_Teams";
export type SaleRange = "$10k-$25k" | "$25k-$50k" | "$50k-$100k" | "$100k+";

export interface ResearchCriteria {
  researchMode: ResearchMode;
  industryFocus: string[];
  opportunityType: OpportunityType;
  buildSpeed: BuildSpeed;
  targetBuyer: TargetBuyer;
  targetSaleRange: SaleRange;
  optionalPrompt: string;
}

export interface OpportunityScore {
  demand: number; // 0-100
  buildSpeed: number; // 0-100
  buyerClarity: number; // 0-100
  competition: number; // 0-100 (lower is better)
  salePotential: number; // 0-100
  overall: number; // 0-100
}

export interface RankedOpportunity {
  id: string;
  opportunityName: string;
  industry: string;
  problemGap: string;
  assetIdea: string;
  targetBuyer: string;
  whyDemandExists: string;
  buildSpeed: string;
  difficulty: string;
  likelySaleRange: string;
  competitionLevel: string;
  validationSignals: string[];
  suggestedMVPScope: string;
  nextSteps: string[];
  scores: OpportunityScore;
}

export interface ResearchResult {
  criteria: ResearchCriteria;
  opportunities: RankedOpportunity[];
  runId: string;
  generatedAt: string;
}

/**
 * Generate deterministic research results based on criteria.
 * Currently uses simulated ranking; future versions will integrate web crawling/LLM.
 */
export async function runMarketRadarResearch(criteria: ResearchCriteria): Promise<ResearchResult> {
  // Deterministic research result generation
  // In production, this would call web crawlers, LLM APIs, market data providers

  const opportunities = generateOpportunities(criteria);
  const ranked = rankOpportunities(opportunities, criteria);

  return {
    criteria,
    opportunities: ranked,
    runId: generateRunId(),
    generatedAt: new Date().toISOString(),
  };
}

function generateOpportunities(criteria: ResearchCriteria): RankedOpportunity[] {
  // Template-based opportunity generation
  // Each combination of criteria produces relevant ideas

  const baseOpportunities: RankedOpportunity[] = [
    {
      id: "opp_001",
      opportunityName: "Automated Compliance Document Generator",
      industry: "Legal Services",
      problemGap: "Small law firms spend 15-20 hours/week on routine compliance docs",
      assetIdea: "AI-powered document generation tool that learns firm-specific language and auto-generates contracts, NDAs, and compliance templates",
      targetBuyer: "Solo attorneys and small law firms",
      whyDemandExists: "Compliance is time-sensitive, error-prone, and heavily regulated. Attorneys constantly search for faster ways to generate correct documents.",
      buildSpeed: "Medium (4-6 weeks)",
      difficulty: "Medium",
      likelySaleRange: "$35k-$60k annual / $500-$1200/month",
      competitionLevel: "Medium (existing solutions exist but are expensive)",
      validationSignals: [
        "Legal Tech community actively discusses doc generation pain",
        "Competitors (LawGeex, Rocket Lawyer) have 6-figure+ annual recurring revenue",
        "Bar association forums show repeated requests for faster doc generation",
      ],
      suggestedMVPScope: "Start with 5 common document types, basic GPT integration, firm template learning",
      nextSteps: [
        "Interview 5-10 small law practices about current document workflows",
        "Research LawTech SaaS pricing models (most charge $500-$2000/month)",
        "Build MVP with 3 document types: NDA, Engagement Letter, Client Intake",
      ],
      scores: {
        demand: 82,
        buildSpeed: 72,
        buyerClarity: 88,
        competition: 45,
        salePotential: 78,
        overall: 78,
      },
    },
    {
      id: "opp_002",
      opportunityName: "Service Business Invoice & Proposal AI Assistant",
      industry: "Home Services & Field Services",
      problemGap: "Service businesses lose 2-3 hours/day creating quotes, invoices, and follow-up sequences",
      assetIdea: "AI tool that auto-generates professional invoices, proposals, and email sequences based on service type, location, and past pricing",
      targetBuyer: "Plumbing, HVAC, landscaping, cleaning companies",
      whyDemandExists: "Field service businesses are perpetually underserved for tech. Most use spreadsheets or outdated software.",
      buildSpeed: "Fast (2-3 weeks)",
      difficulty: "Low",
      likelySaleRange: "$15k-$35k annual / $120-$300/month",
      competitionLevel: "Low (fragmented market, no clear winner)",
      validationSignals: [
        "Service business owners post daily in industry Facebook groups about billing pain",
        "ServiceTitan and Housecall Pro are highly successful ($50M+ ARR) but expensive",
        "YouTube has 50k+ views on 'invoice templates for plumbers'",
      ],
      suggestedMVPScope: "Invoice & quote generator, simple CRM integration, email template library",
      nextSteps: [
        "Post in 5+ plumbing/HVAC Facebook groups and collect feedback on pain points",
        "Study ServiceTitan and Housecall Pro pricing ($200-$600/month) and undercut",
        "Build MVP: invoice generation, quote templates, email sequences",
      ],
      scores: {
        demand: 88,
        buildSpeed: 92,
        buyerClarity: 85,
        competition: 35,
        salePotential: 72,
        overall: 80,
      },
    },
    {
      id: "opp_003",
      opportunityName: "Real Estate Lead Scoring & Nurture Automation",
      industry: "Real Estate",
      problemGap: "Real estate teams manually score leads and send generic follow-ups, resulting in 60% lead loss",
      assetIdea: "AI tool that auto-scores inbound leads by purchase intent, auto-sends personalized nurture sequences, and suggests next actions",
      targetBuyer: "Real estate brokerages and agent teams",
      whyDemandExists: "Real estate is a high-value, high-frequency business. Lead loss directly impacts revenue. Teams are willing to pay for conversion tools.",
      buildSpeed: "Medium (5-7 weeks)",
      difficulty: "Medium",
      likelySaleRange: "$40k-$80k annual / $400-$800/month",
      competitionLevel: "Medium (Zillow, Redfin, Follow Up Boss compete, but not all affordable)",
      validationSignals: [
        "Real Estate Express and similar platforms have 100k+ active agents",
        "RE forums consistently mention lead follow-up as #1 pain point",
        "Existing tools charge $400-$1200/month; demand for cheaper alternative is high",
      ],
      suggestedMVPScope: "Lead scoring engine, email sequence builder, CRM integration (Salesforce/Pipedrive)",
      nextSteps: [
        "Interview 5-10 real estate teams on lead scoring criteria they use",
        "Study Zillow Premier Agent and Follow Up Boss pricing structure",
        "Build: lead intake form, AI scoring, email sequence builder",
      ],
      scores: {
        demand: 85,
        buildSpeed: 68,
        buyerClarity: 82,
        competition: 55,
        salePotential: 80,
        overall: 76,
      },
    },
    {
      id: "opp_004",
      opportunityName: "Insurance Claims Processing Bot",
      industry: "Insurance",
      problemGap: "Insurance agents spend 5+ hours per day on manual claim form intake and routing",
      assetIdea: "AI chatbot that collects claim info, validates against policy, routes to adjusters, and sends status updates",
      targetBuyer: "Independent insurance agencies",
      whyDemandExists: "Insurance is heavily regulated and claims are high-touch. Agencies that reduce claim processing time increase customer satisfaction and retention.",
      buildSpeed: "Longer (8-10 weeks)",
      difficulty: "High",
      likelySaleRange: "$50k-$120k annual / $500-$1500/month",
      competitionLevel: "Medium-High (some enterprise solutions exist)",
      validationSignals: [
        "National Association of Insurance Commissioners reports claims processing as top pain point",
        "Independent agencies (80% of US market) lack sophisticated automation",
        "InsurTech startups raising capital for claims automation",
      ],
      suggestedMVPScope: "Chatbot for claim intake, integration with major policy platforms, basic status notification",
      nextSteps: [
        "Connect with insurance industry association to find pilot agencies",
        "Map integration needs with Salesforce and major policy platforms",
        "Build claims intake chatbot + policy validation engine",
      ],
      scores: {
        demand: 78,
        buildSpeed: 55,
        buyerClarity: 75,
        competition: 60,
        salePotential: 82,
        overall: 72,
      },
    },
    {
      id: "opp_005",
      opportunityName: "Construction Bid Analyzer & Cost Estimator",
      industry: "Construction",
      problemGap: "Construction companies manually compare bids and create cost estimates, losing 3-4 hours per job",
      assetIdea: "AI tool that analyzes subcontractor bids, flags cost anomalies, and auto-generates project cost estimates",
      targetBuyer: "General contractors and project managers",
      whyDemandExists: "Construction margins are thin (5-10%). Tools that reduce overhead and improve bidding accuracy have immediate ROI.",
      buildSpeed: "Medium (5-6 weeks)",
      difficulty: "Medium",
      likelySaleRange: "$25k-$50k annual / $250-$500/month",
      competitionLevel: "Low (few AI-native solutions)",
      validationSignals: [
        "Construction industry is notoriously underserved for tech",
        "GENERAL CONTRACTORS report bid analysis as top manual task",
        "Existing solutions (Sage Estimating) cost $150-$300/month but are complex",
      ],
      suggestedMVPScope: "Bid comparison tool, cost anomaly detection, basic estimate generator",
      nextSteps: [
        "Talk to 5-10 small GCs about current bid analysis workflow",
        "Research RSMeans and Guidepoint pricing (industry standard data)",
        "Build bid analyzer and cost flag engine",
      ],
      scores: {
        demand: 80,
        buildSpeed: 75,
        buyerClarity: 78,
        competition: 40,
        salePotential: 74,
        overall: 77,
      },
    },
  ];

  // Filter by criteria
  return baseOpportunities.filter((opp) => {
    // Filter by industry if specific industries selected
    if (criteria.industryFocus.length > 0 && criteria.industryFocus[0] !== "Any Industry") {
      // Simple matching - in production, this would be more sophisticated
      return criteria.industryFocus.some((ind) =>
        opp.industry.toLowerCase().includes(ind.toLowerCase())
      );
    }
    return true;
  });
}

function rankOpportunities(opportunities: RankedOpportunity[], criteria: ResearchCriteria): RankedOpportunity[] {
  // Adjust scores based on research mode and criteria
  const adjusted = opportunities.map((opp) => {
    const scores = { ...opp.scores };

    // Boost scores based on research mode
    if (criteria.researchMode === "fast_build" && opp.scores.buildSpeed > 70) {
      scores.overall = Math.min(100, scores.overall + 5);
    }
    if (criteria.researchMode === "high_ticket" && opp.scores.salePotential > 75) {
      scores.overall = Math.min(100, scores.overall + 8);
    }

    // Adjust based on build speed preference
    if (criteria.buildSpeed === "fast" && opp.buildSpeed.includes("2-3")) {
      scores.overall = Math.min(100, scores.overall + 3);
    }
    if (criteria.buildSpeed === "longer" && opp.buildSpeed.includes("8-10")) {
      scores.overall = Math.min(100, scores.overall + 3);
    }

    // Adjust based on sale range
    if (criteria.targetSaleRange === "$10k-$25k" && opp.likelySaleRange.includes("$15")) {
      scores.overall = Math.min(100, scores.overall + 3);
    }

    return { ...opp, scores };
  });

  // Sort by overall score descending
  return adjusted.sort((a, b) => b.scores.overall - a.scores.overall);
}

function generateRunId(): string {
  return `radar_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
