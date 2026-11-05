import { detectDomain } from './domainDetector.js';

export function generateClarifyingQuestions(inputs) {
  const domain = detectDomain(inputs);
  const bu = inputs.businessUnit || "Product Operations";
  const feature = inputs.featureName || "Target Capability";
  const problem = inputs.problemStatement || "";

  switch (domain) {
    case 'fintech':
      return [
        {
          id: "q1",
          question: `What is the target latency budget for ${feature} during peak transaction volume (e.g. payment auth or fraud scoring)?`,
          answer: "Sub-250ms p99 execution latency to prevent checkout friction and drop-off.",
          suggestions: ["Sub-200ms Instant", "< 500ms Standard", "Async Settlement (<2s)"]
        },
        {
          id: "q2",
          question: `Which financial regulatory standards, security certs, or data residency mandates must be strictly complied with?`,
          answer: "PCI-DSS Level 1, Strong Customer Authentication (SCA/3DS2), SOC2 Type II, and immutable audit logs.",
          suggestions: ["PCI-DSS Level 1 + SOC2", "GDPR + Regional Data Residency", "SCA / 3DS2 Compliant"]
        },
        {
          id: "q3",
          question: `How should ${feature} handle upstream payment gateway timeouts or payment processor outages?`,
          answer: "Automatic smart retry with secondary provider fallback, idempotency key locking, and user alert.",
          suggestions: ["Smart Fallback Gateway", "Idempotent Retry + Lock", "Soft Decline + User Prompt"]
        },
        {
          id: "q4",
          question: `What are the top 3 quantitative financial KPIs that define post-rollout validation?`,
          answer: "1) 35% reduction in fraud chargebacks, 2) +2.4% auth rate improvement, 3) Zero false-positive drops on VIP accounts.",
          suggestions: ["+3% Auth Rate & -40% Fraud", "99.99% Uptime & Low Latency", "<0.1% Chargeback Ratio"]
        }
      ];

    case 'healthcare':
      return [
        {
          id: "q1",
          question: `What is the clinician response time SLA for ${feature} inside the EHR/consultation workflow?`,
          answer: "Real-time stream with sub-second ambient note generation and < 1.5s clinical summary updates.",
          suggestions: ["< 1.0s Ambient Stream", "< 2s End-of-Visit", "Batch Sync Post-Consultation"]
        },
        {
          id: "q2",
          question: `What patient health data security, HIPAA boundaries, and consent rules govern ${feature}?`,
          answer: "HIPAA compliance, BAA safeguards, end-to-end PHI encryption, and automated de-identification for training logs.",
          suggestions: ["HIPAA + Zero-Retention PHI", "FHIR / HL7 Interoperable", "Clinician-Gated PHI Access"]
        },
        {
          id: "q3",
          question: `What human-in-the-loop review mechanism is enforced before clinical notes or diagnoses commit to the patient record?`,
          answer: "Mandatory attending physician review and 1-click electronic signature sign-off before EHR persistence.",
          suggestions: ["Mandatory Physician Signature", "Dual Clinician Sign-off", "Suggested Draft with Highlighting"]
        },
        {
          id: "q4",
          question: `What clinical & operational success metrics will validate ${feature}?`,
          answer: "1) Save 2.1 hours of documentation per doctor/day, 2) 98% clinical accuracy, 3) 25% faster patient chart closure.",
          suggestions: ["2+ Hours Saved/Doctor/Day", "99% Note Accuracy", "30% Reduction in Physician Burnout"]
        }
      ];

    case 'ecommerce':
      return [
        {
          id: "q1",
          question: `What is the maximum allowable page load and checkout interaction latency for ${feature}?`,
          answer: "Sub-300ms time to interactive (TTI) on mobile web and 1-click order submission under 600ms.",
          suggestions: ["< 300ms Mobile TTI", "< 500ms Desktop", "Optimistic Client Updates"]
        },
        {
          id: "q2",
          question: `How should ${feature} handle sudden stock depletion or race conditions during flash sales?`,
          answer: "Atomic inventory reservation lock with a 5-minute countdown timer and graceful waitlist queue.",
          suggestions: ["Atomic 5-Min Cart Hold", "Real-Time Stock Webhook", "Instant Alternative Product Suggestion"]
        },
        {
          id: "q3",
          question: `What guest vs. authenticated customer checkout experience should be prioritized?`,
          answer: "Frictionless guest 1-click checkout via Apple Pay/Google Pay/ShopPay with post-purchase account creation prompt.",
          suggestions: ["1-Click Express Wallets", "Auto-Account Creation", "Progressive Profile Completion"]
        },
        {
          id: "q4",
          question: `What core e-commerce metrics will measure the ROI of ${feature}?`,
          answer: "1) +18% checkout completion rate, 2) 22% reduction in cart abandonment, 3) +12% increase in Mobile AOV.",
          suggestions: ["+18% Checkout Conversion", "-25% Cart Abandonment", "+15% Mobile AOV"]
        }
      ];

    case 'devtools':
      return [
        {
          id: "q1",
          question: `What are the throughput and ingestion latency requirements for ${feature} under peak enterprise workload?`,
          answer: "Ingest up to 100,000 events/sec with p99 telemetry propagation latency < 500ms.",
          suggestions: ["100k events/sec (<500ms p99)", "10k events/sec (<200ms)", "Async Stream with Backpressure"]
        },
        {
          id: "q2",
          question: `What developer API conventions, rate limiting, and SDK compatibility must be supported?`,
          answer: "gRPC and REST APIs, OpenTelemetry semantic conventions, token bucket rate limiting, and TypeScript/Go SDKs.",
          suggestions: ["gRPC + REST + OpenTelemetry", "GraphQL with Query Complexity Limits", "Webhook Delivery with Auto-Retry"]
        },
        {
          id: "q3",
          question: `How should downstream service degradations, pipeline backpressure, or network partitions be isolated?`,
          answer: "Local ring-buffer caching, exponential backoff, circuit-breaker tripping, and dead-letter queues (DLQ).",
          suggestions: ["Circuit Breaker + DLQ", "Client Ring-Buffer Spooling", "Graceful Degradation to Degraded Mode"]
        },
        {
          id: "q4",
          question: `What developer adoption and reliability KPIs define launch success?`,
          answer: "1) 99.99% service availability, 2) < 5-minute Mean Time to Detection (MTTD), 3) 80% developer self-serve setup within 15 mins.",
          suggestions: ["99.99% Uptime & <5m MTTD", "50% Reduction in MTTR", "85% Weekly Active Devs"]
        }
      ];

    case 'ai_agent':
      return [
        {
          id: "q1",
          question: `What model latency, streaming SLA, and token budget constraints apply to ${feature}?`,
          answer: "First token to stream in < 400ms; complete response within 2.5 seconds with maximum 1,500 token output budget.",
          suggestions: ["< 400ms Time-To-First-Token", "< 2s End-to-End Latency", "Strict Token Budget Capping"]
        },
        {
          id: "q2",
          question: `What hallucination mitigation, grounding source citations, and safety rails must be enforced?`,
          answer: "RAG verification requiring 2+ verifiable citations, strict system prompts, and regex safety filters against prompt injection.",
          suggestions: ["RAG with Grounded Citations", "Dual-Model Fact Verification", "Zero-PII Input Sanitization"]
        },
        {
          id: "q3",
          question: `When the AI model confidence score falls below threshold (< 80%), what is the fallback experience?`,
          answer: "Display transparent uncertainty indicator with suggested options and seamless escalation to human specialist.",
          suggestions: ["Transparent Uncertainty + Human Fallback", "Clarifying Follow-up Question", "Safe Default Action Only"]
        },
        {
          id: "q4",
          question: `What AI quality, task completion, and business value metrics define success?`,
          answer: "1) 92%+ autonomous task completion rate, 2) < 3% human escalation rate, 3) 4.6/5 user satisfaction rating.",
          suggestions: ["92% Autonomous Task Completion", "< 3% Escalation Rate", "70% Manual Time Saved"]
        }
      ];

    case 'b2b_saas':
      return [
        {
          id: "q1",
          question: `What workspace scale, concurrent user load, and response time are required for ${feature}?`,
          answer: "Support workspaces up to 5,000 concurrent seats with sub-second dashboard rendering (< 600ms).",
          suggestions: ["Sub-second Dashboard (<600ms)", "5,000+ Concurrent Seats", "Real-Time WebSocket Sync"]
        },
        {
          id: "q2",
          question: `What enterprise security capabilities (SSO, SCIM, RBAC, Data Residency) must be included?`,
          answer: "SAML 2.0 / Okta SSO, SCIM 2.0 auto-provisioning, custom role-based permissions, and EU/US tenant isolation.",
          suggestions: ["SAML SSO + SCIM Provisioning", "Custom RBAC & Permission Matrix", "Dedicated Enterprise VPC Isolation"]
        },
        {
          id: "q3",
          question: `How should permission changes or role revocations take effect across active user sessions?`,
          answer: "Instant session invalidation via JWT revocation list within 30 seconds of admin role update.",
          suggestions: ["Instant Session Token Invalidation", "Next-Request Refresh Check", "Graceful Expiry (5 Mins)"]
        },
        {
          id: "q4",
          question: `What product engagement and enterprise monetization KPIs determine success?`,
          answer: "1) 45% expansion revenue in Enterprise tier, 2) 80% monthly active workspace adoption, 3) < 2% enterprise logo churn.",
          suggestions: ["+30% Enterprise ARR Expansion", "80% Monthly Active Teams", "< 2% Logo Churn"]
        }
      ];

    case 'support_ops':
      return [
        {
          id: "q1",
          question: `What confidence threshold trigger should be enforced before executing automatic triage for ${feature}?`,
          answer: "Automate routing at >= 88% confidence score; require 1-click agent confirmation for 70-87% confidence, and queue for triage lead below 70%.",
          suggestions: ["Strict (>=90%)", "Balanced (>=85%)", "Permissive (>=75%)"]
        },
        {
          id: "q2",
          question: `Which primary channels and communication formats are in-scope for ${feature}?`,
          answer: "Email tickets, web portal forms, and live chat transcripts. Social channels deferred to v1.1.",
          suggestions: ["All Multi-Channel", "Email & Web Portal Only", "Live Chat & Tickets"]
        },
        {
          id: "q3",
          question: `How should SLA escalations handle VIP Enterprise Accounts (ARR > $100k)?`,
          answer: "Bypass standard queue logic and instantly escalate to Priority 1 with Slack/SMS alert if urgency is elevated.",
          suggestions: ["P1 + Instant Slack Alert", "Dedicated TAM Notification", "VIP Express Priority Queue"]
        },
        {
          id: "q4",
          question: `What operational efficiency metrics determine feature validation after 60 days?`,
          answer: "1) 45% reduction in First Response Time (FRT), 2) 75% reduction in manual triage time, 3) 98.5%+ SLA compliance.",
          suggestions: ["45% FRT Reduction", "99% SLA Compliance", "< 30s Routing Speed"]
        }
      ];

    default: // general_saas
      return [
        {
          id: "q1",
          question: `For ${feature}, what is the primary workflow boundary and target latency or response SLA required for end users?`,
          answer: "Sub-second UI response time (< 500ms) with asynchronous background processing for heavy computational tasks.",
          suggestions: ["< 500ms Instant", "< 2s Standard", "Async Background Jobs"]
        },
        {
          id: "q2",
          question: `In the context of ${bu}, what authorization, privacy, or compliance boundaries must be strictly enforced?`,
          answer: "Role-Based Access Control (RBAC), multi-tenant isolation, data encryption at rest (AES-256), and full audit logging.",
          suggestions: ["RBAC + Audit Logs", "SOC2 & GDPR Compliance", "Tenant Hard Isolation"]
        },
        {
          id: "q3",
          question: `How should edge cases and failures (e.g. API timeouts, missing telemetry data, low confidence outputs) be handled in ${feature}?`,
          answer: "Graceful fallback to manual review queue, clear user error notifications, and automated retry mechanism with exponential backoff.",
          suggestions: ["Manual Fallback Queue", "Automated Retry + Backoff", "Default Safe Parameters"]
        },
        {
          id: "q4",
          question: `What are the top 3 quantitative KPIs that will determine whether ${feature} is deemed a success after rollout?`,
          answer: "1) 40% reduction in workflow task time, 2) 95% user adoption within 30 days, 3) Less than 0.5% error rate in processing.",
          suggestions: ["40% Time Reduction & 95% Adoption", "50% Cost Savings & High NPS", "99.9% Uptime & Low Latency"]
        }
      ];
  }
}
