export const TEMPLATES = {
  custom: {
    id: "custom",
    title: "✨ Custom Blank Project",
    subtitle: "Draft any product requirement from scratch with AI precision",
    businessUnit: "Core Product Team",
    featureName: "Next-Gen Intelligent Workflow",
    epicId: "EPIC-PROD-001",
    targetPersonas: ["Product Manager", "Engineering Lead", "End User", "Executive CPO"],
    problemStatement: "Users currently experience friction, manual cognitive load, and elevated latency when attempting to complete high-frequency workflows. We need an intelligent, high-precision capability to streamline operations, reduce error rates, and enforce automated governance.",
    goalFocus: "Efficiency & User Delight",
    qAndA: [
      {
        id: "q1",
        question: "What is the target latency SLA or UI response time for this capability?",
        answer: "Sub-second UI response time (< 500ms) with async processing for background jobs.",
        suggestions: ["< 300ms Instant", "< 800ms Responsive", "Async Background Job"]
      },
      {
        id: "q2",
        question: "What security, authorization, or compliance rules must be enforced?",
        answer: "Role-Based Access Control (RBAC), SOC2 Type II compliance, and AES-256 data encryption at rest.",
        suggestions: ["SOC2 + RBAC", "GDPR Data Isolation", "End-to-End Encryption"]
      },
      {
        id: "q3",
        question: "How should system exceptions and network timeouts be handled?",
        answer: "Graceful fallback to manual queue, clear user error notifications, and exponential backoff retry.",
        suggestions: ["Manual Fallback Queue", "Automated Retry + Backoff", "Safe Default Parameters"]
      },
      {
        id: "q4",
        question: "What top 3 quantitative KPIs will determine launch success?",
        answer: "1) 40% reduction in task completion time, 2) 90%+ user adoption within 30 days, 3) < 0.5% error rate.",
        suggestions: ["40% Time Saved & 90% Adoption", "+25% Conversion Lift", "99.9% Uptime & Low MTTR"]
      }
    ]
  },

  fintech_fraud: {
    id: "fintech_fraud",
    title: "💳 Fintech Real-Time Fraud Shield & Auth",
    subtitle: "High-Throughput Risk Scoring, SCA 3DS2 & Sub-200ms Settlement",
    businessUnit: "Fintech & Payments Infrastructure",
    featureName: "AI-Powered Real-Time Payment Fraud Shield & Dynamic Auth Routing",
    epicId: "EPIC-PAY-9041",
    targetPersonas: ["Payment Ops Manager", "Risk & Fraud Lead", "Finance Controller", "Executive CPO"],
    problemStatement: "Merchants on our payment platform experience elevated false-positive transaction declines (1.82%) and rising chargeback ratios during high-velocity promotional periods. Legitimate enterprise buyers are improperly challenged or declined, causing over $400k in monthly lost GMV. We need a real-time risk evaluation engine that scores transactions in under 150ms, dynamically triggers frictionless 3DS2 authentication only when risk is ambiguous, and auto-approves trusted buyers.",
    goalFocus: "Fraud Reduction & Payment Conversion",
    qAndA: [
      {
        id: "q1",
        question: "What is the maximum allowable latency budget for real-time fraud evaluation during checkout?",
        answer: "Sub-150ms p99 execution latency to prevent checkout friction and drop-off.",
        suggestions: ["Sub-150ms Instant", "< 250ms Standard", "Async Settlement (<2s)"]
      },
      {
        id: "q2",
        question: "Which financial compliance and regulatory certifications are mandatory?",
        answer: "PCI-DSS Level 1, Strong Customer Authentication (SCA/3DS2), SOC2 Type II, and immutable audit logs.",
        suggestions: ["PCI-DSS Level 1 + SOC2", "GDPR + Regional Data Residency", "SCA / 3DS2 Compliant"]
      },
      {
        id: "q3",
        question: "How should the platform handle primary payment gateway processor timeouts?",
        answer: "Automatic smart retry with secondary provider fallback, idempotency key locking, and user alert.",
        suggestions: ["Smart Fallback Gateway", "Idempotent Retry + Lock", "Soft Decline + User Prompt"]
      },
      {
        id: "q4",
        question: "What quantitative KPIs define feature validation after 60 days post-launch?",
        answer: "1) 35% reduction in fraud chargebacks, 2) +2.4% auth rate improvement, 3) Zero false-positive drops on VIP accounts.",
        suggestions: ["+3% Auth Rate & -40% Fraud", "99.99% Uptime & Low Latency", "<0.1% Chargeback Ratio"]
      }
    ]
  },

  health_scribe: {
    id: "health_scribe",
    title: "🏥 Ambient AI Clinical Scribe & EHR Sync",
    subtitle: "HIPAA-Compliant Audio Note Extraction with FHIR Sign-off",
    businessUnit: "Digital Health & Clinical Informatics",
    featureName: "Ambient AI Clinical Scribe with Bi-Directional EHR FHIR Synchronization",
    epicId: "EPIC-MED-7714",
    targetPersonas: ["Attending Physician", "Clinical Operations Lead", "Hospital CIO", "Chief Medical Officer"],
    problemStatement: "Physicians spend an average of 16.8 minutes per patient encounter typing notes into legacy EHR systems, leading to severe physician burnout, after-hours charting, and delayed billing closures. We need an ambient clinical intelligence scribe that listens to natural doctor-patient consultations, generates structured SOAP notes in real-time, extracts billing codes, and provides a 1-click electronic signature workflow for EHR sync.",
    goalFocus: "Physician Time Saved & Charting Accuracy",
    qAndA: [
      {
        id: "q1",
        question: "What is the clinician response time SLA for note generation inside the EHR workflow?",
        answer: "Real-time stream with sub-second ambient note generation and < 1.5s clinical summary updates.",
        suggestions: ["< 1.0s Ambient Stream", "< 2s End-of-Visit", "Batch Sync Post-Consultation"]
      },
      {
        id: "q2",
        question: "What patient health data security, HIPAA boundaries, and consent rules govern this system?",
        answer: "HIPAA compliance, BAA safeguards, end-to-end PHI encryption, and automated de-identification for training logs.",
        suggestions: ["HIPAA + Zero-Retention PHI", "FHIR / HL7 Interoperable", "Clinician-Gated PHI Access"]
      },
      {
        id: "q3",
        question: "What human-in-the-loop review mechanism is enforced before clinical notes commit to the patient chart?",
        answer: "Mandatory attending physician review and 1-click electronic signature sign-off before EHR persistence.",
        suggestions: ["Mandatory Physician Signature", "Dual Clinician Sign-off", "Suggested Draft with Highlighting"]
      },
      {
        id: "q4",
        question: "What clinical & operational success metrics will validate launch success?",
        answer: "1) Save 2.1 hours of documentation per doctor/day, 2) 98% clinical accuracy, 3) 25% faster patient chart closure.",
        suggestions: ["2+ Hours Saved/Doctor/Day", "99% Note Accuracy", "30% Reduction in Physician Burnout"]
      }
    ]
  },

  ecommerce_checkout: {
    id: "ecommerce_checkout",
    title: "🛒 1-Click Express Checkout & Cart Recovery",
    subtitle: "Mobile Conversion Acceleration, Biometrics & Inventory Locking",
    businessUnit: "E-Commerce & Digital Merchandising",
    featureName: "AI-Powered 1-Click Express Checkout & Dynamic Cart Abandonment Recovery",
    epicId: "EPIC-ECOM-6020",
    targetPersonas: ["E-Commerce Shopper", "Merchandising Lead", "Growth Marketing PM", "VP of Digital"],
    problemStatement: "Over 67% of mobile shoppers abandon their checkout funnel at the multi-step address and billing form. Mobile page load times exceed 3 seconds, leading to bounce rates above 40%. We need a frictionless 1-click express checkout drawer integrated with Apple Pay, Google Pay, and ShopPay, paired with atomic 5-minute inventory reservation and intelligent cart recovery notifications.",
    goalFocus: "Mobile Conversion Rate & GMV Growth",
    qAndA: [
      {
        id: "q1",
        question: "What is the maximum allowable page load and checkout interaction latency?",
        answer: "Sub-300ms time to interactive (TTI) on mobile web and 1-click order submission under 600ms.",
        suggestions: ["< 300ms Mobile TTI", "< 500ms Desktop", "Optimistic Client Updates"]
      },
      {
        id: "q2",
        question: "How should the platform handle sudden inventory depletion during flash sales?",
        answer: "Atomic inventory reservation lock with a 5-minute countdown timer and graceful waitlist queue.",
        suggestions: ["Atomic 5-Min Cart Hold", "Real-Time Stock Webhook", "Instant Alternative Product Suggestion"]
      },
      {
        id: "q3",
        question: "What guest vs. authenticated customer checkout experience should be prioritized?",
        answer: "Frictionless guest 1-click checkout via Apple Pay/Google Pay/ShopPay with post-purchase account creation prompt.",
        suggestions: ["1-Click Express Wallets", "Auto-Account Creation", "Progressive Profile Completion"]
      },
      {
        id: "q4",
        question: "What core e-commerce metrics will measure ROI post-launch?",
        answer: "1) +18% checkout completion rate, 2) 22% reduction in cart abandonment, 3) +12% increase in Mobile AOV.",
        suggestions: ["+18% Checkout Conversion", "-25% Cart Abandonment", "+15% Mobile AOV"]
      }
    ]
  },

  devtools_apm: {
    id: "devtools_apm",
    title: "🛠️ Distributed Tracing & Incident Copilot",
    subtitle: "OpenTelemetry Ingestion, Anomaly Root-Cause & 1-Click Rollback",
    businessUnit: "Cloud Infrastructure & Platform Engineering",
    featureName: "Predictive Incident Copilot & Real-Time Distributed Tracing APM",
    epicId: "EPIC-OPS-5100",
    targetPersonas: ["Staff Platform Engineer", "Site Reliability Engineer (SRE)", "Lead Architect", "VP of Engineering"],
    problemStatement: "When microservice latency regressions occur across 200+ interconnected services, SREs spend over 45 minutes manually correlating distributed traces and logs to isolate root causes. Alert fatigue from noisy thresholds leads to delayed incident detection. We need a real-time APM copilot that continuously ingests OpenTelemetry spans, predicts anomalies, correlates faulty commits, and offers 1-click automated rollbacks.",
    goalFocus: "MTTR Reduction & Service Reliability",
    qAndA: [
      {
        id: "q1",
        question: "What are the throughput and ingestion latency requirements under peak enterprise workload?",
        answer: "Ingest up to 100,000 events/sec with p99 telemetry propagation latency < 500ms.",
        suggestions: ["100k events/sec (<500ms p99)", "10k events/sec (<200ms)", "Async Stream with Backpressure"]
      },
      {
        id: "q2",
        question: "What developer API conventions and telemetry standards must be supported?",
        answer: "gRPC and REST APIs, OpenTelemetry semantic conventions, token bucket rate limiting, and TypeScript/Go SDKs.",
        suggestions: ["gRPC + REST + OpenTelemetry", "GraphQL with Query Complexity Limits", "Webhook Delivery with Auto-Retry"]
      },
      {
        id: "q3",
        question: "How should downstream service degradations and pipeline backpressure be isolated?",
        answer: "Local ring-buffer caching, exponential backoff, circuit-breaker tripping, and dead-letter queues (DLQ).",
        suggestions: ["Circuit Breaker + DLQ", "Client Ring-Buffer Spooling", "Graceful Degradation to Degraded Mode"]
      },
      {
        id: "q4",
        question: "What developer adoption and reliability KPIs define launch success?",
        answer: "1) 99.99% service availability, 2) < 5-minute Mean Time to Detection (MTTD), 3) 80% developer self-serve setup within 15 mins.",
        suggestions: ["99.99% Uptime & <5m MTTD", "50% Reduction in MTTR", "85% Weekly Active Devs"]
      }
    ]
  },

  agent_copilot: {
    id: "agent_copilot",
    title: "🤖 Autonomous Research Agent with Citations",
    subtitle: "RAG Fact Grounding, Multi-Tool Calling & Hallucination Guardrails",
    businessUnit: "AI Research & Generative Copilots",
    featureName: "Autonomous Multi-Step Research Agent with Verifiable Citation Grounding",
    epicId: "EPIC-AI-2045",
    targetPersonas: ["End-User Practitioner", "AI Ops Lead", "Prompt Safety Auditor", "Head of AI Product"],
    problemStatement: "Knowledge workers spend 12+ hours weekly manually aggregating research from disparate documents, web sources, and internal databases. Existing LLM chatbots frequently hallucinate facts and lack traceable citations, making their outputs unacceptable for regulated enterprise decisions. We need an autonomous agent that plans multi-step tool calls, grounds every factual assertion with clickable citations, and escalates ambiguous steps to humans.",
    goalFocus: "Knowledge Synthesis Speed & Fact Accuracy",
    qAndA: [
      {
        id: "q1",
        question: "What model latency, streaming SLA, and token budget constraints apply?",
        answer: "First token to stream in < 400ms; complete response within 2.5 seconds with maximum 1,500 token output budget.",
        suggestions: ["< 400ms Time-To-First-Token", "< 2s End-to-End Latency", "Strict Token Budget Capping"]
      },
      {
        id: "q2",
        question: "What hallucination mitigation, grounding source citations, and safety rails must be enforced?",
        answer: "RAG verification requiring 2+ verifiable citations, strict system prompts, and regex safety filters against prompt injection.",
        suggestions: ["RAG with Grounded Citations", "Dual-Model Fact Verification", "Zero-PII Input Sanitization"]
      },
      {
        id: "q3",
        question: "When the AI model confidence score falls below threshold (< 80%), what is the fallback experience?",
        answer: "Display transparent uncertainty indicator with suggested options and seamless escalation to human specialist.",
        suggestions: ["Transparent Uncertainty + Human Fallback", "Clarifying Follow-up Question", "Safe Default Action Only"]
      },
      {
        id: "q4",
        question: "What AI quality, task completion, and business value metrics define success?",
        answer: "1) 92%+ autonomous task completion rate, 2) < 3% human escalation rate, 3) 4.6/5 user satisfaction rating.",
        suggestions: ["92% Autonomous Task Completion", "< 3% Escalation Rate", "70% Manual Time Saved"]
      }
    ]
  },

  b2b_saas_rbac: {
    id: "b2b_saas_rbac",
    title: "🏢 Enterprise Workspace & RBAC Governance",
    subtitle: "SAML 2.0 SSO, SCIM Auto-Provisioning & Session Invalidation",
    businessUnit: "Enterprise Identity & Core SaaS Platform",
    featureName: "Multi-Tenant Workspace Governance with Dynamic RBAC & Instant Session Purge",
    epicId: "EPIC-GOV-8190",
    targetPersonas: ["Enterprise IT Admin", "Team Workspace Owner", "Security & Compliance Officer", "Executive CPO"],
    problemStatement: "Enterprise customers (> 1,000 employees) are unable to scale team workspaces due to lack of granular role-based access control (RBAC) and absence of automated user provisioning via SCIM. Offboarded employees retain orphaned access for up to 24 hours, presenting a major security compliance violation. We need an enterprise workspace governance engine with custom roles, real-time SCIM sync, and sub-30s session token invalidation.",
    goalFocus: "Enterprise Expansion & Security Compliance",
    qAndA: [
      {
        id: "q1",
        question: "What workspace scale, concurrent user load, and response time are required?",
        answer: "Support workspaces up to 5,000 concurrent seats with sub-second dashboard rendering (< 600ms).",
        suggestions: ["Sub-second Dashboard (<600ms)", "5,000+ Concurrent Seats", "Real-Time WebSocket Sync"]
      },
      {
        id: "q2",
        question: "What enterprise security capabilities (SSO, SCIM, RBAC, Data Residency) must be included?",
        answer: "SAML 2.0 / Okta SSO, SCIM 2.0 auto-provisioning, custom role-based permissions, and EU/US tenant isolation.",
        suggestions: ["SAML SSO + SCIM Provisioning", "Custom RBAC & Permission Matrix", "Dedicated Enterprise VPC Isolation"]
      },
      {
        id: "q3",
        question: "How should permission changes or role revocations take effect across active user sessions?",
        answer: "Instant session invalidation via JWT revocation list within 30 seconds of admin role update.",
        suggestions: ["Instant Session Token Invalidation", "Next-Request Refresh Check", "Graceful Expiry (5 Mins)"]
      },
      {
        id: "q4",
        question: "What product engagement and enterprise monetization KPIs determine success?",
        answer: "1) 45% expansion revenue in Enterprise tier, 2) 80% monthly active workspace adoption, 3) < 2% enterprise logo churn.",
        suggestions: ["+30% Enterprise ARR Expansion", "80% Monthly Active Teams", "< 2% Logo Churn"]
      }
    ]
  },

  freshworks_triage: {
    id: "freshworks_triage",
    title: "🎧 Customer Support AI Auto-Triage & SLA",
    subtitle: "CX & Service Ops Automation with Sentiment Routing & Confidence Sliders",
    businessUnit: "Customer Experience & Service Operations",
    featureName: "AI-Powered Ticket Auto-Triage & Sentiment SLA Escalation",
    epicId: "EPIC-FW-8920",
    targetPersonas: ["IT Admin", "Support Lead", "Customer Care Agent", "Executive CPO"],
    problemStatement: "Enterprise customer support teams currently spend an average of 4.2 minutes per ticket manually bucketing categorizations, assessing customer urgency, and routing tickets to specialized tier-2/3 squads. Peak volume spikes lead to SLA breaches of up to 18%, elevated churn among High-ARR enterprise accounts, and agent fatigue. We need an automated AI-native triage engine that analyzes incoming multi-channel tickets, predicts sentiment, assigns urgency scores, and dynamically routes to optimal agents while keeping human-in-the-loop control for ambiguous cases.",
    goalFocus: "Efficiency & SLA Breach Reduction",
    qAndA: [
      {
        id: "q1",
        question: "What confidence threshold trigger should be enforced before automatically executing route assignment without agent review?",
        answer: "Automate routing at >= 88% confidence score; require 1-click agent confirmation for 70-87% confidence, and queue for triage lead below 70%.",
        suggestions: ["Strict (>=90%)", "Balanced (>=85%)", "Permissive (>=75%)"]
      },
      {
        id: "q2",
        question: "Which primary channels are in-scope for initial v1.0 sentiment analysis?",
        answer: "Email tickets, Web portal forms, and Live Chat transcripts. Social media (X/LinkedIn DMs) is postponed to v1.1.",
        suggestions: ["All Multi-Channel", "Email & Web Portal Only", "Chat & Telemetry First"]
      },
      {
        id: "q3",
        question: "How should SLA escalations handle VIP Enterprise Accounts (ARR > $100k)?",
        answer: "Bypass standard queue logic and instantly escalate to Priority 1 with SMS/Slack alert if sentiment score drops below -0.65.",
        suggestions: ["P1 + Slack Alert", "VIP Priority Queue", "Dedicated TAM Notification"]
      },
      {
        id: "q4",
        question: "What success metric determines feature validation after 60 days post-launch?",
        answer: "Reduce average first-response time by 45%, cut triage manual overhead by 75%, and maintain SLA compliance above 98.5%.",
        suggestions: ["45% FRT Reduction", "99% SLA Compliance", "<30s Routing Speed"]
      }
    ]
  }
};
