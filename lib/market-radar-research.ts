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

  console.log("DEBUG: runMarketRadarResearch called with criteria:", {
    industryFocus: criteria.industryFocus,
    researchMode: criteria.researchMode,
    opportunityType: criteria.opportunityType,
  });

  const opportunities = generateOpportunities(criteria);
  console.log("DEBUG: Generated opportunities count:", opportunities.length);

  const ranked = rankOpportunities(opportunities, criteria);
  console.log("DEBUG: Final ranked opportunities count:", ranked.length);

  return {
    criteria,
    opportunities: ranked,
    runId: generateRunId(),
    generatedAt: new Date().toISOString(),
  };
}

// Comprehensive opportunity template library
const OPPORTUNITY_LIBRARY = {
  Healthcare: [
    {
      name: "AI Intake & Follow-up Tracker",
      problem: "Clinics spend hours manually tracking patient intake and follow-up calls",
      idea: "AI tool that auto-creates follow-up tasks from patient intake forms and tracks compliance",
      buyer: "Small clinics and practices",
      demand: "Patient follow-up is critical compliance; 40% of clinics do it manually",
      saleRange: "$18k-$35k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low (niche)",
    },
    {
      name: "Healthcare Staff Task Router",
      problem: "Staff spends 15%+ time determining who should handle each task",
      idea: "Internal tool that auto-routes tasks to right staff based on skills, availability, compliance",
      buyer: "Mid-size practices",
      demand: "Staff efficiency is top operational pain point",
      saleRange: "$25k-$50k",
      speed: "Medium (4-5 weeks)",
      difficulty: "Medium",
      competition: "Medium",
    },
    {
      name: "Patient Document Collection Portal",
      problem: "Collecting documents from patients takes 5-10 back-and-forth emails",
      idea: "Lightweight patient portal for document submission with auto-checks and reminders",
      buyer: "Solo and small practices",
      demand: "HIPAA compliance + efficiency drives adoption",
      saleRange: "$15k-$28k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
    {
      name: "Clinic Referral Follow-Up Manager",
      problem: "Referral follow-ups fall through cracks; no tracking of referral outcomes",
      idea: "Tool that tracks sent referrals, auto-reminds, records outcomes for quality/compliance",
      buyer: "Primary care and specialists",
      demand: "Quality metrics + regulatory requirements drive need",
      saleRange: "$20k-$40k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
    {
      name: "Insurance Verification Workflow",
      problem: "Staff loses 30+ min/day verifying insurance before appointments",
      idea: "Bot that auto-verifies insurance, checks coverage, sends verification reminders",
      buyer: "Practices with high patient volume",
      demand: "Insurance hassles and no-shows drive urgency",
      saleRange: "$25k-$45k",
      speed: "Medium (4-6 weeks)",
      difficulty: "Medium",
      competition: "Medium-Low",
    },
    {
      name: "Telemedicine Intake Automation",
      problem: "Telehealth services manually create intake forms for each visit",
      idea: "AI tool that pulls historical patient data and auto-populates visit intake",
      buyer: "Telehealth providers",
      demand: "Telehealth growth + patient friction = high adoption potential",
      saleRange: "$22k-$38k",
      speed: "Fast (3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
  ],
  Legal: [
    {
      name: "Automated Compliance Document Generator",
      problem: "Small law firms spend 15-20 hours/week on routine compliance docs",
      idea: "AI-powered document generation tool that learns firm-specific language and auto-generates contracts",
      buyer: "Solo attorneys and small firms",
      demand: "Compliance is time-sensitive and error-prone",
      saleRange: "$35k-$60k",
      speed: "Medium (4-6 weeks)",
      difficulty: "Medium",
      competition: "Medium",
    },
    {
      name: "Legal Matter Timesheet Automation",
      problem: "Attorneys manually log time; 20% of billable time goes unbilled",
      idea: "Tool that auto-tracks attorney activities and auto-logs to matter codes",
      buyer: "Solo and small law firms",
      demand: "Increased revenue capture is primary driver",
      saleRange: "$18k-$32k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low-Medium",
    },
  ],
  "Real Estate": [
    {
      name: "Real Estate Lead Scoring & Nurture",
      problem: "Real estate teams manually score leads and send generic follow-ups; 60% lead loss",
      idea: "AI tool that auto-scores leads, sends personalized sequences, suggests next actions",
      buyer: "Real estate brokerages",
      demand: "Lead loss directly impacts revenue",
      saleRange: "$40k-$80k",
      speed: "Medium (5-7 weeks)",
      difficulty: "Medium",
      competition: "Medium",
    },
    {
      name: "Property Showing Scheduler & Analytics",
      problem: "Agents spend hours scheduling showings and lose insight into buyer engagement",
      idea: "Portal that auto-schedules showings, tracks attendance, generates buyer engagement insights",
      buyer: "Agents and teams",
      demand: "Efficiency and buyer insights are key motivators",
      saleRange: "$20k-$35k",
      speed: "Fast (3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
    {
      name: "Comparative Market Analysis Generator",
      problem: "Creating CMAs manually takes 2-3 hours per property",
      idea: "Tool that auto-pulls comps and generates professional CMA reports in minutes",
      buyer: "Agents and small brokerages",
      demand: "Listing accuracy and time-to-market are crucial",
      saleRange: "$15k-$28k",
      speed: "Medium (4-5 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
  ],
  Construction: [
    {
      name: "Construction Bid Analyzer & Cost Estimator",
      problem: "Construction companies manually compare bids and create estimates, losing 3-4 hours per job",
      idea: "AI tool that analyzes subcontractor bids, flags cost anomalies, auto-generates estimates",
      buyer: "General contractors",
      demand: "Thin margins (5-10%) make efficiency tools attractive",
      saleRange: "$25k-$50k",
      speed: "Medium (5-6 weeks)",
      difficulty: "Medium",
      competition: "Low",
    },
    {
      name: "Daily Job Site Report Generator",
      problem: "Site managers spend 30-45 min daily on manual job reports",
      idea: "Tool that auto-compiles photos, notes, and logs into professional daily reports",
      buyer: "GCs and project managers",
      demand: "Time savings + documentation requirements drive adoption",
      saleRange: "$18k-$32k",
      speed: "Fast (3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
  ],
  Insurance: [
    {
      name: "Insurance Claims Processing Bot",
      problem: "Insurance agents spend 5+ hours per day on manual claim form intake and routing",
      idea: "AI chatbot that collects claim info, validates against policy, routes to adjusters, sends updates",
      buyer: "Independent insurance agencies",
      demand: "Claims processing is heavily manual and time-consuming",
      saleRange: "$50k-$120k",
      speed: "Longer (8-10 weeks)",
      difficulty: "High",
      competition: "Medium-High",
    },
    {
      name: "Policy Verification & Coverage Checker",
      problem: "Agents spend 20+ min per day verifying policies and coverage limits",
      idea: "Tool that auto-checks policy status, coverage, exclusions, and renewal dates",
      buyer: "Insurance agencies",
      demand: "Compliance + efficiency are key drivers",
      saleRange: "$22k-$38k",
      speed: "Medium (4-5 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
  ],
  "Home Services": [
    {
      name: "Service Business Invoice & Proposal AI",
      problem: "Service businesses lose 2-3 hours/day creating quotes, invoices, follow-ups",
      idea: "Tool that auto-generates invoices, proposals, and email sequences based on service type",
      buyer: "Plumbing, HVAC, cleaning companies",
      demand: "Field service is underserved; most use spreadsheets",
      saleRange: "$15k-$35k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
    {
      name: "Service Technician Mobile Check-In",
      problem: "Technicians spend 15 min per job on paperwork; no real-time job tracking",
      idea: "Mobile app for technicians to check in, log work, collect signatures, generate invoices on-site",
      buyer: "Service company owners",
      demand: "Productivity and customer experience are primary drivers",
      saleRange: "$20k-$38k",
      speed: "Medium (4-5 weeks)",
      difficulty: "Medium",
      competition: "Medium",
    },
  ],
  Finance: [
    {
      name: "Small Business Financial Reconciliation Tool",
      problem: "Small businesses spend 5+ hours monthly manually reconciling accounts",
      idea: "AI tool that auto-reconciles bank, credit card, and accounting entries",
      buyer: "Small business owners",
      demand: "Accounting accuracy and time savings are critical",
      saleRange: "$18k-$35k",
      speed: "Medium (4-5 weeks)",
      difficulty: "Medium",
      competition: "Medium",
    },
    {
      name: "Invoice Payment Tracking & Follow-up",
      problem: "Small businesses lose 10-15% of revenue to unpaid invoices and failed follow-ups",
      idea: "Tool that auto-tracks invoice payments and sends smart follow-up reminders",
      buyer: "Service businesses",
      demand: "Cash flow management is essential",
      saleRange: "$15k-$28k",
      speed: "Fast (2-3 weeks)",
      difficulty: "Low",
      competition: "Low",
    },
  ],
};

function generateOpportunities(criteria: ResearchCriteria): RankedOpportunity[] {
  const opportunities: RankedOpportunity[] = [];
  let oppId = 0;

  // Determine which industries to generate for
  const targetIndustries =
    criteria.industryFocus.length > 0 && criteria.industryFocus[0] !== "Any Industry"
      ? criteria.industryFocus
      : Object.keys(OPPORTUNITY_LIBRARY);

  // Generate opportunities for each target industry
  for (const industry of targetIndustries) {
    const industryKey = Object.keys(OPPORTUNITY_LIBRARY).find(
      (k) => k.toLowerCase() === industry.toLowerCase()
    );
    if (!industryKey) continue;

    const templates = OPPORTUNITY_LIBRARY[industryKey as keyof typeof OPPORTUNITY_LIBRARY];

    // Take 2-3 opportunities per industry
    const selectedOps = templates.slice(0, Math.min(3, templates.length));

    for (const template of selectedOps) {
      oppId++;
      const id = `opp_${String(oppId).padStart(3, "0")}`;

      // Build scores based on criteria matching
      const demandBase = criteria.researchMode === "hottest_demand" ? 85 : 75;
      const buildSpeedBase =
        criteria.buildSpeed === "fast" && template.speed.includes("2-3")
          ? 90
          : criteria.buildSpeed === "medium"
            ? 75
            : 60;
      const buyerClarityBase = 80;
      const competitionBase = Math.random() * 50 + 25;
      const salePotentialBase = template.saleRange.includes("$10k") ? 65 : 75;

      opportunities.push({
        id,
        opportunityName: template.name,
        industry: industry === "Any Industry" ? industryKey || industry : industry,
        problemGap: template.problem,
        assetIdea: template.idea,
        targetBuyer: template.buyer,
        whyDemandExists: template.demand,
        buildSpeed: template.speed,
        difficulty: template.difficulty,
        likelySaleRange: template.saleRange,
        competitionLevel: template.competition,
        validationSignals: [
          `${industry} market shows high demand for this solution`,
          `Competitors or adjacent tools validate buyer willingness to pay`,
          `Industry forums and communities discuss this pain point regularly`,
        ],
        suggestedMVPScope: `Start with core ${criteria.opportunityType === "AI_SaaS" ? "SaaS" : criteria.opportunityType === "Internal_Tool" ? "operations tool" : "workflow"} features`,
        nextSteps: [
          `Research top 10 competitors in ${industry}`,
          `Interview 5-10 potential buyers about current workflow`,
          `Build MVP focusing on highest-friction part of the workflow`,
        ],
        scores: {
          demand: demandBase,
          buildSpeed: buildSpeedBase,
          buyerClarity: buyerClarityBase,
          competition: competitionBase,
          salePotential: salePotentialBase,
          overall: 0, // Will be calculated in ranking
        },
      });
    }
  }

  // Ensure minimum 5 opportunities
  if (opportunities.length < 5) {
    // Add additional opportunities from other industries if needed
    const allIndustries = Object.keys(OPPORTUNITY_LIBRARY);
    for (const industry of allIndustries) {
      if (opportunities.length >= 5) break;
      if (
        criteria.industryFocus.length > 0 &&
        criteria.industryFocus[0] !== "Any Industry" &&
        !criteria.industryFocus.some((i) => i.toLowerCase() === industry.toLowerCase())
      ) {
        const templates = OPPORTUNITY_LIBRARY[industry as keyof typeof OPPORTUNITY_LIBRARY];
        const template = templates[Math.floor(Math.random() * templates.length)];
        oppId++;
        const id = `opp_${String(oppId).padStart(3, "0")}`;

        opportunities.push({
          id,
          opportunityName: template.name,
          industry,
          problemGap: template.problem,
          assetIdea: template.idea,
          targetBuyer: template.buyer,
          whyDemandExists: template.demand,
          buildSpeed: template.speed,
          difficulty: template.difficulty,
          likelySaleRange: template.saleRange,
          competitionLevel: template.competition,
          validationSignals: [
            `${industry} market shows demand for solution like this`,
            `Cross-industry patterns suggest strong buyer segment`,
          ],
          suggestedMVPScope: "Core features focused on primary workflow",
          nextSteps: [
            "Research market demand in this industry",
            "Interview 5+ potential buyers",
            "Build MVP with minimal scope",
          ],
          scores: {
            demand: 70,
            buildSpeed: 75,
            buyerClarity: 75,
            competition: 50,
            salePotential: 70,
            overall: 0,
          },
        });
      }
    }
  }

  return opportunities;
}

function rankOpportunities(opportunities: RankedOpportunity[], criteria: ResearchCriteria): RankedOpportunity[] {
  // Calculate overall scores and adjust based on criteria
  const adjusted = opportunities.map((opp) => {
    const scores = { ...opp.scores };

    // Calculate overall score
    scores.overall = Math.round((scores.demand + scores.buildSpeed + scores.buyerClarity + (100 - scores.competition) + scores.salePotential) / 5);

    // Boost scores based on research mode
    if (criteria.researchMode === "fast_build" && scores.buildSpeed > 80) {
      scores.overall = Math.min(100, scores.overall + 8);
    }
    if (criteria.researchMode === "high_ticket" && scores.salePotential > 75) {
      scores.overall = Math.min(100, scores.overall + 8);
    }
    if (criteria.researchMode === "market_gap" && scores.competition < 40) {
      scores.overall = Math.min(100, scores.overall + 8);
    }
    if (criteria.researchMode === "hottest_demand" && scores.demand > 80) {
      scores.overall = Math.min(100, scores.overall + 8);
    }

    // Adjust based on build speed preference
    if (criteria.buildSpeed === "fast" && opp.buildSpeed.includes("2-3")) {
      scores.overall = Math.min(100, scores.overall + 5);
    }
    if (criteria.buildSpeed === "medium" && opp.buildSpeed.includes("4-6")) {
      scores.overall = Math.min(100, scores.overall + 5);
    }
    if (criteria.buildSpeed === "longer" && opp.buildSpeed.includes("8-10")) {
      scores.overall = Math.min(100, scores.overall + 5);
    }

    // Adjust based on sale range
    if (criteria.targetSaleRange === "$10k-$25k" && (opp.likelySaleRange.includes("$15") || opp.likelySaleRange.includes("$18") || opp.likelySaleRange.includes("$20"))) {
      scores.overall = Math.min(100, scores.overall + 5);
    }
    if (criteria.targetSaleRange === "$25k-$50k" && (opp.likelySaleRange.includes("$25") || opp.likelySaleRange.includes("$28") || opp.likelySaleRange.includes("$32") || opp.likelySaleRange.includes("$35") || opp.likelySaleRange.includes("$40"))) {
      scores.overall = Math.min(100, scores.overall + 5);
    }
    if (criteria.targetSaleRange === "$50k-$100k" && (opp.likelySaleRange.includes("$50") || opp.likelySaleRange.includes("$60") || opp.likelySaleRange.includes("$80"))) {
      scores.overall = Math.min(100, scores.overall + 5);
    }

    return { ...opp, scores };
  });

  // Sort by overall score descending
  return adjusted.sort((a, b) => b.scores.overall - a.scores.overall);
}

function generateRunId(): string {
  return `radar_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
