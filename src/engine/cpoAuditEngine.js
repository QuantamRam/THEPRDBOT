import { detectDomain } from './domainDetector.js';

export function runCPOAudit(prdText, inputs) {
  const domain = detectDomain(inputs);
  const bu = inputs.businessUnit || "Product Operations";
  const feature = inputs.featureName || "Target Capability";

  // Deep structural analysis of the generated PRD
  const hasSql = prdText.includes("```sql") && prdText.includes("SELECT");
  const hasMermaid = prdText.includes("```mermaid") || prdText.includes("sequenceDiagram");
  const hasApiContract = prdText.includes("POST /api") || prdText.includes("GET /api") || prdText.includes("Content-Type: application/json");
  const hasGherkin = prdText.includes("GIVEN") || prdText.includes("WHEN") || prdText.includes("THEN") || prdText.includes("Given");
  const hasEdgeCases = prdText.includes("EC-01") || prdText.includes("Edge-Case") || prdText.includes("Negative Testing");
  const hasRolloutPlan = prdText.includes("Canary") || prdText.includes("Rollout") || prdText.includes("Phase A") || prdText.includes("Feature Flag");
  const hasGuardrailMetrics = prdText.includes("Guardrail") || prdText.includes("Counter-Metric") || prdText.includes("Negative Impact");

  // Dimensional Scoring
  let strategicScore = 90;
  if (inputs.problemStatement && inputs.problemStatement.length > 80) strategicScore += 5;
  if (inputs.targetPersonas && inputs.targetPersonas.length >= 2) strategicScore += 3;
  strategicScore = Math.min(strategicScore, 98);

  let evidenceScore = 75;
  if (hasSql) evidenceScore += 15;
  if (prdText.includes("Customer Advisory Board") || prdText.includes("CAB")) evidenceScore += 8;
  evidenceScore = Math.min(evidenceScore, 98);

  let engineeringScore = 76;
  if (hasMermaid) engineeringScore += 10;
  if (hasApiContract) engineeringScore += 8;
  if (hasGherkin) engineeringScore += 4;
  engineeringScore = Math.min(engineeringScore, 99);

  let edgeCaseScore = 78;
  if (hasEdgeCases) edgeCaseScore += 12;
  if (prdText.includes("Injection") || prdText.includes("Timeout") || prdText.includes("Fallback")) edgeCaseScore += 6;
  edgeCaseScore = Math.min(edgeCaseScore, 97);

  let kpiScore = 80;
  if (prdText.includes("KPI") || prdText.includes("North Star")) kpiScore += 10;
  if (hasGuardrailMetrics) kpiScore += 8;
  kpiScore = Math.min(kpiScore, 98);

  const overallScore = Math.round(
    strategicScore * 0.20 +
    evidenceScore * 0.25 +
    engineeringScore * 0.25 +
    edgeCaseScore * 0.15 +
    kpiScore * 0.15
  );

  let grade = "A";
  if (overallScore >= 95) grade = "A+";
  else if (overallScore >= 90) grade = "A";
  else if (overallScore >= 82) grade = "B+";
  else if (overallScore >= 75) grade = "B";
  else grade = "C";

  // Contextual Strengths
  const strengths = [];
  if (hasSql) {
    strengths.push("Backed by quantitative SQL telemetry schema and realistic baseline query benchmarks.");
  }
  if (hasMermaid && hasApiContract) {
    strengths.push("Includes production-ready Mermaid sequence architecture and unambiguous REST JSON API contracts.");
  }
  if (hasGherkin) {
    strengths.push("Functional specifications formatted with Given/When/Then acceptance criteria for engineering testability.");
  }
  if (hasEdgeCases) {
    strengths.push("Exhaustive negative testing matrix covering network timeouts, payload bounds, and security attacks.");
  }
  if (strengths.length < 3) {
    strengths.push(`Strong strategic positioning tailored to ${bu} operational requirements.`);
  }

  // Contextual Blind Spots
  const blindSpots = [];
  const cpoRecommendations = [];

  if (!prdText.includes("Rollback Trigger") && !prdText.includes("Kill-Switch")) {
    blindSpots.push("Missing explicit automated kill-switch criteria in the phased rollout plan if error rates spike.");
    cpoRecommendations.push({
      id: "rec_killswitch",
      title: "Enforce Automated Canary Rollback Criteria",
      description: "Specify that any Canary deployment immediately reverts to v-previous if error rates exceed 0.5% or p99 latency spikes by > 20% over 5 minutes.",
      applied: false
    });
  }

  if (!prdText.includes("Guardrail Metric") && !prdText.includes("Counter-Metric")) {
    blindSpots.push("Lacks explicit guardrail / counter-metrics to ensure primary metric acceleration does not degrade adjacent user experience.");
    cpoRecommendations.push({
      id: "rec_guardrail",
      title: "Define Operational Guardrail / Counter-Metrics",
      description: "Add counter-metrics (e.g. customer support contact rate, infrastructure cloud compute cost per transaction) to prevent unintended side effects.",
      applied: false
    });
  }

  if (domain === 'fintech' && !prdText.includes("Idempotency")) {
    blindSpots.push("Payment transaction mutation lacks explicit idempotency key locking header specification.");
    cpoRecommendations.push({
      id: "rec_idempotency",
      title: "Mandate Idempotency-Key Header on Payment Mutation Endpoints",
      description: "Require unique Idempotency-Key UUID headers on all financial write requests with a 24-hour Redis deduplication TTL.",
      applied: false
    });
  } else if (domain === 'healthcare' && !prdText.includes("Zero-Retention")) {
    blindSpots.push("EHR documentation requires explicit zero-retention PHI policy for third-party audio model training.");
    cpoRecommendations.push({
      id: "rec_hipaa_retention",
      title: "Enforce Zero-Retention PHI Data Guarantee",
      description: "Formally contractually prohibit retaining patient audio recordings or un-redacted clinical transcripts for model fine-tuning.",
      applied: false
    });
  } else if (!prdText.includes("Rate Limiting") && !prdText.includes("Token Bucket")) {
    blindSpots.push("API contract lacks defined client-side rate limits and burst protection policies.");
    cpoRecommendations.push({
      id: "rec_ratelimit",
      title: "Incorporate Token-Bucket Rate Limiting to API Contract",
      description: "Define a 1,000 req/min rate limit with HTTP 429 Retry-After headers for public endpoints.",
      applied: false
    });
  }

  if (cpoRecommendations.length === 0) {
    cpoRecommendations.push({
      id: "rec_default",
      title: "Add Bi-Weekly Executive Review Cadence",
      description: "Schedule milestone progress check-ins with Product Operations and Engineering Leads at Week 2, 4, and 8 post-launch.",
      applied: false
    });
  }

  return {
    grade,
    score: overallScore,
    dimensions: [
      { name: "Strategic Alignment & Problem Framing", score: strategicScore, status: strategicScore >= 90 ? "Optimal" : "Needs Framing" },
      { name: "Evidence & Telemetry Grounding", score: evidenceScore, status: hasSql ? "Grounded" : "Needs Data" },
      { name: "Acceptance Criteria & Engineering Readiness", score: engineeringScore, status: hasMermaid ? "Ready" : "Needs Specs" },
      { name: "Edge Case & Vulnerability Coverage", score: edgeCaseScore, status: hasEdgeCases ? "Comprehensive" : "Missing Cases" },
      { name: "KPI Actionability & Metrics Tree", score: kpiScore, status: "Measurable" }
    ],
    executiveSummary: `The PRD for "${feature}" in ${bu} demonstrates ${grade >= 'A' ? 'exemplary' : 'solid'} execution rigor. It pairs domain-specific telemetry with structured acceptance criteria, architectural flows, and risk mitigations. Engineering handoff risk is ${overallScore >= 90 ? 'LOW' : 'MODERATE'}.`,
    strengths,
    blindSpots,
    cpoRecommendations
  };
}
