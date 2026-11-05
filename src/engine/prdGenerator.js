import { detectDomain } from './domainDetector.js';
import { getTelemetryData } from './telemetryEngine.js';

export function generateFullPRD(inputs, qaAnswers = {}) {
  const domain = detectDomain(inputs);
  const bu = inputs.businessUnit || "Product Operations";
  const feature = inputs.featureName || "Core Platform Initiative";
  const epic = inputs.epicId || "EPIC-PRD-101";
  const problem = inputs.problemStatement || "Customers experience critical operational friction, elevated latency, and workflow drop-offs due to legacy manual processes.";
  const personas = inputs.targetPersonas && inputs.targetPersonas.length > 0
    ? inputs.targetPersonas
    : getDefaultPersonasForDomain(domain);

  const telemetry = getTelemetryData(inputs);

  // Extract Q&A answers or fallbacks
  const q1Ans = qaAnswers.q1 || "Sub-second UI response time (< 500ms) with asynchronous background processing for heavy computational tasks.";
  const q2Ans = qaAnswers.q2 || "Role-Based Access Control (RBAC), multi-tenant isolation, data encryption at rest (AES-256), and full audit logging.";
  const q3Ans = qaAnswers.q3 || "Graceful fallback to manual review queue, clear user error notifications, and automated retry mechanism with exponential backoff.";
  const q4Ans = qaAnswers.q4 || "40% reduction in workflow task time, 95% user adoption within 30 days, and less than 0.5% error rate.";

  const today = new Date().toISOString().split('T')[0];

  // Domain-specific architectural sequence diagrams and API schemas
  const { sequenceDiagram, apiSpec, functionalReqs, gherkinSpecs, edgeCases } = getDomainSpecs(domain, feature, bu, q1Ans, q2Ans, q3Ans);

  return `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## ${feature.toUpperCase()}

**Epic ID:** \`${epic}\`  
**Business Unit / Domain:** ${bu}  
**Domain Archetype:** \`${domain.toUpperCase()}\`  
**Target Personas:** ${personas.join(', ')}  
**Status:** \`CPO Executive Approved — Engineering Specification Ready\`  
**Date Created:** ${today}  
**Author:** THE PRD BOT (Universal AI Product Requirements Engine)  
**Methodology:** First-Principles Grounded Product Lifecycle Framework  

---

### PHASE 1: EXECUTIVE SUMMARY, STRATEGIC INTENT & NORTH STAR OBJECTIVE

**Executive Summary:**
The **${feature}** is a mission-critical platform capability designed for **${bu}** to eliminate systemic workflow friction, dramatically accelerate user completion speed, and enforce rigorous automated governance. By marrying real-time quantitative telemetry with user-centric design patterns, this solution removes manual bottlenecks while maintaining comprehensive observability and fail-safe human-in-the-loop oversight.

**Primary Business Objective:**
${q4Ans}

**North Star Metric:**
Achieve a **40%+ measurable improvement** in workflow throughput while driving end-to-end task completion error rates down to **< 0.5%** within 60 days of General Availability.

**Strategic Timing ("Why Now?"):**
1. **Compounding Friction:** Current operational drag directly harms user retention and account expansion.
2. **Technological Feasibility:** Recent advancements in high-throughput APIs and sub-second processing make automated real-time execution possible at scale.
3. **Competitive Urgency:** Industry leaders have begun piloting automated capabilities; deploying ${feature} establishes defensible product differentiation.

---

### PHASE 2: PROBLEM STATEMENT, FIRST PRINCIPLES & CUSTOMER FRICTION

**Problem Statement:**
${problem}

**Customer Pain Points & Operational Drag:**
- **Severe Time Tax:** Users lose valuable operational hours navigating repetitive manual steps, leading to frustration and drop-off.
- **Latency & Throughput Bottlenecks:** Legacy processing queues create uneven response times during peak demand periods.
- **Auditability & Observability Gaps:** Stakeholders lack granular insight into decision logic, confidence scoring, and failure root causes.
- **Cost of Inaction ("Do Nothing Scenario"):** Continued reliance on manual workarounds will lead to accelerated customer churn, elevated support escalations, and inability to scale account volume efficiently.

---

### PHASE 3: TARGET PERSONAS & JOBS-TO-BE-DONE (JTBD)

| Persona | Role & Core Responsibilities | Key Friction & Need |
| :--- | :--- | :--- |
${personas.map(p => `| **${p}** | Operational stakeholder responsible for execution and workflow quality. | Needs intuitive, sub-second execution controls with zero opaque failures. |`).join('\n')}

#### Jobs-to-be-Done (JTBD) Framework:
1. **When** facing high-volume operational tasks under time-sensitive constraints,  
   **I want to** rely on automated, high-precision assistance with instant validation,  
   **So that I can** eliminate repetitive cognitive load and prevent costly downstream errors.
2. **When** unexpected edge cases or system anomalies occur,  
   **I want to** immediately inspect transparent reasoning and take 1-click corrective action,  
   **So that I can** maintain complete accountability without stalling the business workflow.

#### End-to-End User Journey Walkthrough:
1. **Trigger:** The user initiates an action or the system ingests an inbound event payload.
2. **Contextual Evaluation:** The platform executes sub-second policy validation, evaluates confidence scores, and queries prerequisite data.
3. **Automated Execution / Decisioning:**
   - *High-Confidence Path:* Automatically executes the target workflow and updates state in under 300ms.
   - *Ambiguous Path:* Renders a 1-click confirmation chip in the user workspace with transparent reasoning.
   - *Degraded / Edge-Case Path:* Safely routes to the fallback exception queue with telemetry logging.
4. **Audit & Closure:** Emits structured events to the telemetry store and updates real-time analytics dashboards.

---

### PHASE 4: STRATEGIC ALIGNMENT, SCOPE, GOALS & NON-GOALS

#### In-Scope (Strategic Goals for v1.0):
- [x] **Sub-Second Execution Engine:** Automated processing with deterministic latency SLAs.
- [x] **Precision Threshold Controls:** Self-service administrative controls to adjust confidence boundaries.
- [x] **Comprehensive Audit Trail:** Immutable logging of every system evaluation, parameter, and user override.
- [x] **Fail-Safe Fallback Pipeline:** Graceful degradation logic preventing unhandled system crashes.

#### Out-of-Scope (Explicit Non-Goals for v1.0):
- [ ] **Unsupervised Autonomous Schema Mutations:** Modifying core database schema without admin approval is explicitly excluded.
- [ ] **Legacy On-Premises Custom Connectors:** Support for unversioned on-premises legacy software is deferred to v1.2.
- [ ] **Third-Party Marketplace Extensions:** Public third-party plugin ecosystem will follow after General Availability validation.

---

### PHASE 5: QUANTITATIVE EVIDENCE & DOMAIN SQL TELEMETRY

**Telemetry Summary & Analytical Baseline:**
To substantiate the necessity of ${feature}, historical telemetry across 30 days was analyzed to establish precise operational benchmarks.

#### SQL Query Benchmark #1: Core Workflow Performance & SLA Breaches
\`\`\`sql
${telemetry.sqlQueries[0].sql}
\`\`\`

**Query Execution Benchmark Output:**
${telemetry.sqlQueries[0].results.map(r => Object.entries(r).map(([k, v]) => `**${k}:** ${v}`).join(' | ')).map(line => `- ${line}`).join('\n')}

#### Regional Telemetry Breakdown & Data Reliability:
${telemetry.regionalStats.map(rs => `- **${rs.region}:** Usage Share: ${rs.usageShare} | Avg Latency: ${rs.avgLatency} | SLA Compliance: ${rs.slaCompliance} | *Status: ${rs.dataQuality}*`).join('\n')}

#### Identified Data Gaps:
${telemetry.dataGaps.map((gap, i) => `${i + 1}. ${gap}`).join('\n')}

---

### PHASE 6: QUALITATIVE GROUNDING & COMPETITOR POSITIONING MATRIX

#### Customer Advisory Board (CAB) & Voice-of-Customer Evidence:
${telemetry.customerQuotes.map(cq => `> "${cq.quote}"\n> — **${cq.author}** (${cq.company})\n`).join('\n')}

#### Competitor Benchmarking Matrix:

| Capability / Benchmark | ${feature} (Our Solution) | Competitor Tier A | Competitor Tier B | Competitor Tier C |
| :--- | :--- | :--- | :--- | :--- |
${telemetry.competitorMatrix.map(cm => `| **${cm.feature}** | **${cm.freshworks}** | ${cm.zendesk} | ${cm.serviceNow} | ${cm.salesforce} |`).join('\n')}

**Our Unfair Moat:**
Native sub-second execution combined with transparent self-service threshold controls and zero-lock-in telemetry integration.

---

### PHASE 7: FUNCTIONAL REQUIREMENTS & ACCEPTANCE CRITERIA (GHERKIN)

| Req ID | Requirement Name | Functional Specification | Priority | Complexity |
| :--- | :--- | :--- | :--- | :--- |
${functionalReqs.map(fr => `| **${fr.id}** | ${fr.name} | ${fr.spec} | ${fr.priority} | ${fr.complexity} |`).join('\n')}

#### Detailed Acceptance Criteria (Given/When/Then):
${gherkinSpecs}

---

### PHASE 8: NON-FUNCTIONAL REQUIREMENTS (NFRS) & SERVICE LEVEL OBJECTIVES

- **Performance & Latency SLA:** ${q1Ans}
- **Security & Data Compliance:** ${q2Ans}
- **High Availability & Uptime:** 99.95% availability SLA backed by automated multi-region failover.
- **Throughput & Scalability:** Designed to handle burst loads up to 5x standard peak volume without throttling.
- **Auditability & Retention:** All execution payloads and decision logs stored in immutable audit store with 365-day retention.
- **Accessibility:** UI components conform strictly to WCAG 2.1 Level AA standards with full keyboard navigation and screen reader labels.

---

### PHASE 9: USER STORIES & NEGATIVE EDGE-CASE MATRIX

#### Core Persona User Stories:
${personas.slice(0, 3).map((p, idx) => `- **US-0${idx + 1} (${p}):** *As a ${p}, I want ${feature} to automatically validate and process routine inputs, so that I can eliminate manual errors and focus on high-impact strategic tasks.*`).join('\n')}

#### Negative Testing & Edge-Case Matrix:

| Scenario ID | Trigger / Condition | Expected System Behavior | Negative Impact Mitigation |
| :--- | :--- | :--- | :--- |
${edgeCases.map(ec => `| **${ec.id}** | ${ec.trigger} | ${ec.behavior} | ${ec.mitigation} |`).join('\n')}

---

### PHASE 10: SYSTEM ARCHITECTURE & API CONTRACT SPEC

\`\`\`mermaid
${sequenceDiagram}
\`\`\`

#### Production API Contract Spec:
\`\`\`json
${apiSpec}
\`\`\`

---

### PHASE 11: GO-TO-MARKET (GTM), PHASED ROLLOUT & PRICING STRATEGY

#### Phased Rollout Rings (Canary Deployment):
1. **Ring 0 (Internal Dogfood — Week 1-2):** Deploy to internal product and operations teams. Verify telemetry and logging stability.
2. **Ring 1 (Canary Beta 5% — Week 3-4):** Enable feature flag for 10 CAB enterprise partners. Monitor error budgets and latency.
3. **Ring 2 (Public Beta 25% — Week 5-6):** Expand rollout to 25% of active accounts. Solicit structured feedback and fine-tune threshold defaults.
4. **Ring 3 (General Availability 100% — Week 8):** Full global rollout across all regions.

#### Automated Kill-Switch / Rollback Criteria:
- Revert immediately to prior stable version if p99 latency exceeds SLA by **> 25%** for 5 consecutive minutes.
- Trigger circuit-breaker if error rates spike above **0.5%** of total traffic.

#### Packaging & Monetization:
- **Core Tier:** Included in standard subscription plans with baseline quota.
- **Enterprise Tier:** Unlimited execution volume, sub-second latency SLA, dedicated audit analytics, and custom threshold controls.

---

### PHASE 12: SUCCESS METRICS TREE, COUNTER-METRICS & REVIEW CADENCE

#### Metric Hierarchy:
1. **North Star Metric:** Primary adoption and throughput acceleration across target personas.
2. **Operational L1 Metrics:**
   - Sub-second execution rate (> 98.5% within SLA).
   - User override rate maintained at **< 5%**.
   - Net task completion time reduced by **40%+**.
3. **Counter-Metrics (Guardrails):**
   - Customer support ticket escalation rate must **not increase by > 0.1%**.
   - Cloud infrastructure compute cost per execution must remain **under $0.004**.

#### Milestone Review Cadence:
- **30-Day Check:** Review Canary telemetry, user feedback sentiment, and initial error budgets.
- **60-Day Review:** Evaluate primary North Star metric lift and adjust enterprise packaging parameters.
- **90-Day Post-Mortem:** CPO executive strategic review to plan v1.1 roadmap enhancements.

---
*Generated by THE PRD BOT — AI-Native Precision PRD Engine for Product Managers*
`;
}

function getDefaultPersonasForDomain(domain) {
  switch (domain) {
    case 'fintech':
      return ["Payment Ops Manager", "Risk & Fraud Lead", "Finance Controller", "Executive CPO"];
    case 'healthcare':
      return ["Attending Physician", "Clinical Operations Lead", "Hospital CIO", "Chief Medical Officer"];
    case 'ecommerce':
      return ["E-Commerce Shopper", "Merchandising Lead", "Growth Marketing PM", "VP of Digital"];
    case 'devtools':
      return ["Staff Platform Engineer", "Site Reliability Engineer (SRE)", "Lead Architect", "VP of Engineering"];
    case 'ai_agent':
      return ["End-User Practitioner", "AI Ops Lead", "Prompt Safety Auditor", "Head of AI Product"];
    case 'b2b_saas':
      return ["Enterprise IT Admin", "Team Workspace Owner", "Security & Compliance Officer", "Executive CPO"];
    default:
      return ["Product Manager", "Engineering Lead", "Operations Specialist", "Executive CPO"];
  }
}

function getDomainSpecs(domain, feature, bu, q1Ans, q2Ans, q3Ans) {
  switch (domain) {
    case 'fintech':
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor Client as Checkout Client / Merchant
    participant Gateway as API Gateway
    participant Engine as Fraud & Risk Scoring Engine
    participant Processor as Payment Processing Rail
    participant Ledger as Immutable SQL Ledger
    actor RiskOps as Risk Operations Lead

    Client->>Gateway: POST /api/v1/payments/authorize (Payload + Idempotency-Key)
    Gateway->>Engine: Evaluate Transaction Risk & Limits
    Engine->>Ledger: Query Historical Merchant Chargeback Ratio
    Ledger-->>Engine: Return Risk Profile (Tier-1 Low Risk)
    alt Fraud Risk Score < 30 (Auto-Approve)
        Engine->>Processor: Submit Auth Request to Card Network
        Processor-->>Engine: 200 OK (Auth Code #9921)
        Engine->>Ledger: Write Double-Entry Transaction Record
        Engine-->>Gateway: Transaction Authorized (142ms)
        Gateway-->>Client: 200 OK (Payment Success)
    else Fraud Risk 30-75 (Step-up Verification)
        Engine-->>Gateway: Trigger 3DS2 Challenge Flow
        Gateway-->>Client: 402 Requires Challenge Authentication
    else Fraud Risk > 75 (High Risk Decline)
        Engine->>Ledger: Log Blocked Attempt
        Engine-->>RiskOps: Alert Suspicious Velocity Spike
        Gateway-->>Client: 403 Payment Blocked (Risk Safeguard)
    end`,
        apiSpec: `POST /api/v1/payments/authorize
Header: Authorization: Bearer <sec_token>
Header: Idempotency-Key: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
Content-Type: application/json

{
  "merchant_id": "mch_88301",
  "amount_cents": 142000,
  "currency": "USD",
  "payment_method": {
    "type": "card",
    "token": "tok_visa_4242"
  },
  "customer": {
    "id": "cus_99120",
    "ip_address": "198.51.100.42",
    "device_fingerprint": "dfp_a7b8c9d0"
  }
}

// Expected Response: 200 OK
{
  "status": "authorized",
  "transaction_id": "txn_3391024",
  "auth_code": "AUTH_9921",
  "risk_evaluation": {
    "score": 14,
    "verdict": "AUTO_APPROVE",
    "latency_ms": 118
  },
  "created_at": "${new Date().toISOString()}"
}`,
        functionalReqs: [
          { id: "FR-01", name: "Real-time Risk Scoring Engine", spec: "Evaluate incoming payment payload for fraud risk within 150ms using weighted heuristics.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Idempotent Transaction Handling", spec: "Enforce unique Idempotency-Key headers with 24-hour Redis locking to prevent duplicate billing.", priority: "P0 (Must Have)", complexity: "Medium" },
          { id: "FR-03", name: "Dynamic 3DS2 Step-up Challenge", spec: "Trigger frictionless 3DS authentication when fraud risk score evaluates between 30 and 75.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-04", name: "Dynamic Merchant Risk Thresholds", spec: "Provide admin control UI to configure risk tolerances per merchant tier.", priority: "P1 (High)", complexity: "Medium" },
          { id: "FR-05", name: "Immutable Ledger Logging", spec: "Store transaction double-entry ledger entries in PCI-DSS compliant database.", priority: "P1 (High)", complexity: "Medium" }
        ],
        gherkinSpecs: `**FR-01: Real-time Risk Scoring**
\`\`\`gherkin
SCENARIO: Authorized low-risk payment execution
GIVEN a customer submits a valid payment method with Idempotency-Key
WHEN the fraud risk scoring evaluates below the 30% risk threshold
THEN the payment is submitted to the card processor within 150ms
AND an immutable audit record is committed to the ledger with status "authorized".
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "Duplicate API Request with Same Idempotency Key", behavior: "Return cached original response with HTTP 200 without re-billing card.", mitigation: "Prevents accidental double charges." },
          { id: "EC-02", trigger: "Payment Processor Network Timeout (> 2.5s)", behavior: "Trigger automatic fallback to secondary payment gateway rail.", mitigation: "Guarantees 99.99% transaction completion." },
          { id: "EC-03", trigger: "Card Velocity Spike (> 5 attempts/min from single IP)", behavior: "Temporarily enforce CAPTCHA & step-up 3DS challenge.", mitigation: "Prevents automated card testing attacks." }
        ]
      };

    case 'healthcare':
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor Clinician as Attending Physician
    participant App as Clinical Consultation Client
    participant Gateway as FHIR Security Gateway
    participant AI as Ambient Clinical Scribe
    participant EHR as EHR Database (Epic / Cerner)

    Clinician->>App: Start Consultation (Patient Audio Ingest)
    App->>AI: Stream De-Identified Audio Frames (E2E Encrypted)
    AI-->>AI: Real-Time Acoustic & Medical Entity Extraction
    Clinician->>App: Conclude Patient Visit
    App->>AI: Request Structured SOAP Note Draft
    AI->>Gateway: Submit Draft Note (Subjective, Objective, Assessment, Plan)
    Gateway->>App: Present Draft Note in Physician Review UI
    Clinician->>App: Review & Apply Electronic Signature (1-Click)
    App->>Gateway: POST /fhir/r4/DocumentReference (Cryptographic Signature)
    Gateway->>EHR: Commit Note to Patient Chart via FHIR API
    EHR-->>Gateway: 201 Created (Chart Updated)
    Gateway-->>App: Confirmed Patient Record Updated`,
        apiSpec: `POST /api/v1/clinical/encounters/soap
Header: Authorization: Bearer <jwt_phi_token>
Content-Type: application/json

{
  "encounter_id": "enc_89201",
  "patient_mrn": "MRN_33019",
  "clinician_npi": "129849102",
  "ambient_transcript_token": "stream_tok_4412",
  "encounter_type": "ambulatory_cardiology"
}

// Expected Response: 200 OK
{
  "status": "draft_ready",
  "soap_note": {
    "subjective": "58-year-old patient reports mild dyspnea on exertion. Denies chest pain or palpitations.",
    "objective": "BP 132/84 mmHg, HR 72 bpm regular. Lungs clear to auscultation bilaterally.",
    "assessment": "Essential hypertension, clinically stable.",
    "plan": "Continue Lisinopril 10mg daily. Recheck lab panel in 6 months."
  },
  "confidence_score": 0.96,
  "requires_physician_signature": true,
  "generated_at": "${new Date().toISOString()}"
}`,
        functionalReqs: [
          { id: "FR-01", name: "Ambient Consultation Stream", spec: "Stream ambient microphone audio with real-time medical entity recognition.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Structured SOAP Note Synthesis", spec: "Synthesize full Subjective, Objective, Assessment, Plan notes in under 45 seconds.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-03", name: "Physician Electronic Signature", spec: "Provide 1-click cryptographic electronic signature for attending physician sign-off.", priority: "P0 (Must Have)", complexity: "Medium" },
          { id: "FR-04", name: "Bi-directional FHIR / HL7 Sync", spec: "Automatically sync signed notes into Epic or Cerner EHR systems via FHIR API.", priority: "P0 (Must Have)", complexity: "High" }
        ],
        gherkinSpecs: `**FR-02: Structured SOAP Note Synthesis**
\`\`\`gherkin
SCENARIO: Ambient audio transformation into validated clinical chart
GIVEN a concluded patient encounter with recorded de-identified audio
WHEN the clinician clicks "Draft SOAP Note"
THEN a 4-section structured SOAP note is synthesized in < 45 seconds
AND all prescribed medications and ICD-10 codes are highlighted for physician review.
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "Ambient Background Noise in Trauma Room", behavior: "Filter audio frequencies; prompt clinician to verbally confirm unclear numbers.", mitigation: "Prevents clinical misinterpretation." },
          { id: "EC-02", trigger: "EHR FHIR API Gateway Timeout", behavior: "Buffer signed note securely in encrypted local store and retry with backoff.", mitigation: "Guarantees zero chart documentation loss." }
        ]
      };

    case 'ecommerce':
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor Shopper as Mobile Consumer
    participant Web as Checkout PWA / Native Client
    participant API as Commerce API Gateway
    participant Order as Order & Inventory Service
    participant Pay as Express Payment Provider (ApplePay/ShopPay)
    participant CRM as Cart Recovery Engine

    Shopper->>Web: Click "1-Click Express Checkout"
    Web->>API: Initialize Express Checkout Session
    API->>Order: Reserve SKU Inventory (Atomic 5-Min Hold)
    Order-->>API: Inventory Reserved (Lock #4491)
    API->>Pay: Request Biometric Payment Sheet (TouchID / FaceID)
    Pay-->>Shopper: Present Native Biometric Prompt
    Shopper->>Pay: Authorize Biometric Payment
    Pay->>API: Return Authorized Payment Token
    API->>Order: Commit Final Order & Decrement Stock
    Order-->>Web: Order Confirmation #ORD-88201
    Web-->>Shopper: Render Success Screen (< 600ms total)`,
        apiSpec: `POST /api/v1/checkout/express-order
Header: Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "cart_token": "cart_991823",
  "payment_provider": "apple_pay",
  "payment_token": "pay_tok_882910",
  "shipping_address": {
    "postal_code": "97477",
    "country": "US",
    "verified_autocomplete": true
  }
}

// Expected Response: 200 OK
{
  "status": "confirmed",
  "order_id": "ORD-88201",
  "total_amount_cents": 12850,
  "shipping_sla": "2_day_express",
  "receipt_url": "https://store.example.com/receipt/ORD-88201"
}`,
        functionalReqs: [
          { id: "FR-01", name: "1-Click Biometric Checkout", spec: "Enable Apple Pay, Google Pay, and ShopPay express authorization in < 2 taps.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Atomic Inventory Lock", spec: "Lock cart SKU quantities for 5 minutes during active checkout session.", priority: "P0 (Must Have)", complexity: "Medium" },
          { id: "FR-03", name: "Smart Address Autocomplete", spec: "Sub-100ms postal address verification and street completion.", priority: "P0 (Must Have)", complexity: "Low" },
          { id: "FR-04", name: "Automated Cart Recovery Push", spec: "Trigger dynamic SMS/push recovery alert with 1-click cart restore link after 15 mins.", priority: "P1 (High)", complexity: "Medium" }
        ],
        gherkinSpecs: `**FR-01: 1-Click Biometric Checkout**
\`\`\`gherkin
SCENARIO: Mobile shopper express purchase
GIVEN a customer with items in cart and Apple Pay enabled on device
WHEN customer taps "1-Click Express Pay" and confirms Touch ID
THEN the order is created and confirmed within 600ms
AND the customer receives an SMS delivery confirmation tracking link.
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "SKU Depleted While User Enters Payment", behavior: "Immediately alert user; suggest identical in-stock alternative SKU.", mitigation: "Prevents customer frustration and charge reversals." },
          { id: "EC-02", trigger: "Biometric TouchID Cancelled by User", behavior: "Gracefully return to cart view with items intact and payment methods unselected.", mitigation: "Prevents lost carts." }
        ]
      };

    case 'devtools':
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor Dev as Developer / SRE
    participant OTel as OpenTelemetry Collector
    participant Ingest as Stream Processing Ingestion Engine
    participant Anomaly as Anomaly Detection & ML Root Cause
    participant DB as Distributed Trace Store (ClickHouse)
    actor OnCall as On-Call Engineer

    Dev->>OTel: Emit Application Traces & Spans
    OTel->>Ingest: Stream Spans via gRPC (100k events/sec)
    Ingest->>DB: Ingest Trace Spans with Sub-Second Write Latency
    Ingest->>Anomaly: Evaluate Latency Percentiles (p95/p99)
    alt Latency Spikes > 2.5 Std Dev Above Baseline
        Anomaly->>DB: Query Recent Git Commits & Deployment Events
        DB-->>Anomaly: Commit #412 Deployed 4 Mins Ago
        Anomaly->>OnCall: Trigger PagerDuty Alert with Root Cause Analysis
    else Nominal Latency Profile
        Anomaly-->>Ingest: Health Score Green
    end`,
        apiSpec: `POST /api/v1/telemetry/traces
Header: Content-Type: application/x-protobuf
Header: X-Telemetry-Sampling: "adaptive"

{
  "service": "auth-gateway-service",
  "spans": [
    {
      "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
      "span_id": "00f067aa0ba902b7",
      "name": "HTTP POST /login",
      "duration_ms": 24.2,
      "status_code": "OK"
    }
  ]
}

// Expected Response: 202 Accepted
{
  "status": "ingested",
  "spans_received": 1,
  "propagation_latency_ms": 12
}`,
        functionalReqs: [
          { id: "FR-01", name: "High-Throughput Trace Ingestion", spec: "Ingest up to 100,000 OTel spans/sec with p99 write latency under 200ms.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Predictive Anomaly Clustering", spec: "Detect latency regressions and correlate with deployment events in real-time.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-03", name: "1-Click Automated Rollback", spec: "Integrate with Kubernetes/GitOps to trigger instant deployment rollbacks.", priority: "P1 (High)", complexity: "Medium" }
        ],
        gherkinSpecs: `**FR-02: Predictive Anomaly Clustering**
\`\`\`gherkin
SCENARIO: Microservice p99 latency degradation
GIVEN a service experiences a > 50% p99 latency increase within 3 minutes of a new deployment
WHEN the anomaly detection engine correlates traces with deployment metadata
THEN a prioritized alert is dispatched to the on-call channel identifying the faulty commit
AND the 1-click rollback button is surfaced in Slack and console.
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "Network Partition Between Collector and Storage", behavior: "Spool spans to local memory ring buffer; flush upon reconnect.", mitigation: "Prevents trace data loss during transient network partitions." }
        ]
      };

    case 'ai_agent':
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor User as Product Manager / End User
    participant UI as Agent Workspace UI
    participant Orchestrator as Agentic Orchestrator Engine
    participant RAG as Vector DB & Grounding Store
    participant LLM as Frontier Reasoning Model
    participant Tools as External System Tools / APIs

    User->>UI: Submit Multi-Step Task Instruction
    UI->>Orchestrator: Ingest Prompt & User Constraints
    Orchestrator->>RAG: Query Context Embeddings & Documents
    RAG-->>Orchestrator: Return Grounded Reference Chunks
    Orchestrator->>LLM: Generate Thought Plan & Tool Call Spec
    LLM-->>Orchestrator: Call Tool: ExecuteSQLQuery(table, query)
    Orchestrator->>Tools: Execute Deterministic Tool Action
    Tools-->>Orchestrator: Return Structured Data Payload
    Orchestrator->>LLM: Synthesize Grounded Answer with Citations
    LLM-->>Orchestrator: Return Final Verified Response
    Orchestrator->>UI: Stream Verified Response with Source Badges`,
        apiSpec: `POST /api/v1/agent/run
Header: Authorization: Bearer <agent_key>
Content-Type: application/json

{
  "task_prompt": "Synthesize Q3 customer churn drivers and cite 3 verified sources.",
  "max_tokens": 1500,
  "confidence_threshold": 0.88,
  "tools_allowed": ["rag_search", "sql_query", "web_lookup"]
}

// Expected Response: 200 OK
{
  "status": "completed",
  "result": {
    "text": "The primary driver of Q3 churn was payment gateway timeouts (34% of cases) [Source: Telemetry DB], followed by un-notified price tier increases [Source: CAB Survey].",
    "citations": [
      { "id": "cit_1", "source": "telemetry_metrics_q3.parquet", "confidence": 0.94 },
      { "id": "cit_2", "source": "cab_feedback_notes.md", "confidence": 0.91 }
    ],
    "execution_time_ms": 1840,
    "total_tokens": 820
  }
}`,
        functionalReqs: [
          { id: "FR-01", name: "Streaming Token Generation", spec: "Deliver first streaming token to client in < 400ms.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Verifiable Citation Grounding", spec: "Attach verifiable document citations to every generated factual assertion.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-03", name: "Dynamic Human Escalation", spec: "Escalate to human specialist whenever model confidence evaluates below 80%.", priority: "P0 (Must Have)", complexity: "Medium" }
        ],
        gherkinSpecs: `**FR-02: Verifiable Citation Grounding**
\`\`\`gherkin
SCENARIO: AI factual response generation
GIVEN a user prompt requesting factual synthesized analysis
WHEN the agent queries enterprise knowledge stores
THEN every sentence asserting facts includes an interactive citation badge
AND clicking the badge opens the exact source paragraph in the sidebar.
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "Prompt Injection Attack in User Input", behavior: "Sanitize input through safety guardrails; reject malicious instructions.", mitigation: "Ensures zero system prompt compromise." }
        ]
      };

    default:
      return {
        sequenceDiagram: `sequenceDiagram
    autonumber
    actor User as End User / PM
    participant Gateway as API Gateway
    participant Engine as Core Execution Engine
    participant DB as Telemetry & State DB
    actor Admin as System Administrator

    User->>Gateway: Submit Request / Action Payload
    Gateway->>Engine: Post Evaluated Payload
    Engine->>DB: Query User Permissions & Context
    DB-->>Engine: Context Verified (SLA Valid)
    Engine->>Engine: Process Workflow Logic (< 300ms)
    alt Execution Successful
        Engine->>DB: Log Audit Trail
        Engine-->>Gateway: 200 OK (Workflow Complete)
        Gateway-->>User: Display Success UI State
    else Edge Case / Low Confidence
        Engine-->>Gateway: Route to Human Review Queue
        Gateway-->>Admin: Alert Admin for Verification
    end`,
        apiSpec: `POST /api/v1/workflow/execute
Header: Authorization: Bearer <token>
Content-Type: application/json

{
  "request_id": "REQ-88910",
  "business_unit": "${bu}",
  "action": "EXECUTE_WORKFLOW",
  "parameters": {
    "feature": "${feature}",
    "timestamp": "${new Date().toISOString()}"
  }
}

// Expected Response: 200 OK
{
  "status": "success",
  "execution_id": "EXEC-10492",
  "latency_ms": 182,
  "result": "COMPLETED_OPTIMAL"
}`,
        functionalReqs: [
          { id: "FR-01", name: "Core Processing Pipeline", spec: "Execute end-to-end workflow in sub-second latency.", priority: "P0 (Must Have)", complexity: "High" },
          { id: "FR-02", name: "Admin Configuration Controls", spec: "Provide self-service controls for threshold settings.", priority: "P1 (High)", complexity: "Medium" },
          { id: "FR-03", name: "Telemetry & Audit Logging", spec: "Record all execution events in searchable database.", priority: "P0 (Must Have)", complexity: "Medium" }
        ],
        gherkinSpecs: `**FR-01: Core Processing Pipeline**
\`\`\`gherkin
SCENARIO: Sub-second workflow execution
GIVEN an authenticated user submits a valid workflow request
WHEN the system processes the request payload
THEN execution completes within 500ms
AND a structured event is committed to the audit store.
\`\`\``,
        edgeCases: [
          { id: "EC-01", trigger: "Service Timeout or Degradation", behavior: "Route safely to manual fallback queue.", mitigation: "Prevents data loss or user disruption." }
        ]
      };
  }
}
