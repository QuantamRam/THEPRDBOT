import { detectDomain } from './domainDetector.js';

export function getWireframeSpec(inputs) {
  const domain = detectDomain(inputs);
  const feature = inputs.featureName || "Target Capability";
  const bu = inputs.businessUnit || "Product Operations";

  switch (domain) {
    case 'fintech':
      return {
        title: "Fintech Fraud Shield & Instant Payment Auth Console",
        subtitle: "High-throughput transaction scoring with real-time risk slider",
        interactiveMock: {
          headerTitle: "TXN-99824 — Instant Card Payment Evaluation",
          badgeText: "Fraud Risk: 14% (Auto-Approved)",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: "⚡ High-Value VIP Merchant ($240k GMV/mo) — Zero Fraud Indicators Detected",
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: "Authorization request: $1,420.00 USD via Stripe US-East Payment Gateway. Device fingerprint matches trusted historical buyer.",
          primaryActionText: "Approve Transaction (1-Click)",
          secondaryActionText: "Escalate to 3DS2 Challenge",
          sliderLabel: "Fraud Auto-Decline Threshold:",
          sliderMin: 50,
          sliderMax: 95,
          sliderDefault: 85,
          sliderUnit: "Risk Score"
        },
        componentSpecs: [
          {
            name: "FraudRiskScorePill",
            type: "Status Pill Badge",
            props: { riskScore: "number (0-100)", riskLevel: "enum('LOW','MED','HIGH')", rail: "string" },
            state: "Green (<30%), Amber (30-75%), Red (>75%)",
            a11y: "aria-label='Fraud Risk Score: 14 Low Risk'"
          },
          {
            name: "ThreeDSChallengeTriggerBar",
            type: "Action Banner",
            props: { merchantTier: "string", suggestedAction: "string", onApprove: "func", onChallenge: "func" },
            state: "1-Click Approve / Step-up 3DS Authentication",
            a11y: "Keyboard navigable via Tab + Enter"
          },
          {
            name: "VIPMerchantSafetyBanner",
            type: "System Notification",
            props: { gmvUsd: "currency", chargebackRatio: "float", fastTrackSLA: "boolean" },
            state: "Subtle green border on low-risk VIP transactions",
            a11y: "role='status' aria-live='polite'"
          },
          {
            name: "RiskThresholdControlSlider",
            type: "Admin Configuration Form",
            props: { maxAutoApproveScore: "number (50-95)", notifyRiskOps: "boolean" },
            state: "Interactive dual slider updating transaction auto-auth percentage",
            a11y: "role='slider' aria-valuenow='85'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "fintech",
          components: [
            { id: "cmp-01", name: "Fraud Risk Pill", frame: { width: 190, height: 32, borderRadius: 9999 }, backgroundColor: "#9fc9a2", text: "Fraud Risk: 14% (Auto-Approved)" },
            { id: "cmp-02", name: "VIP Auth Safety Banner", frame: { width: 680, height: 48, borderRadius: 8 }, backgroundColor: "#f0fdf4", borderColor: "#1f8a65", text: "⚡ VIP Merchant ($240k GMV) Verified" },
            { id: "cmp-03", name: "Dynamic Risk Threshold Slider", frame: { width: 480, height: 80, borderRadius: 12 }, backgroundColor: "#fafaf7", controls: ["Risk Slider @ 85%"] }
          ]
        }
      };

    case 'healthcare':
      return {
        title: "Ambient Clinical Scribe & EHR Chart Sign-Off Console",
        subtitle: "Physician ambient voice consultation transcription with FHIR sync",
        interactiveMock: {
          headerTitle: "ENC-4409 — Patient Clinical Encounter (Cardiology Review)",
          badgeText: "Clinical AI: 96% Confidence (SOAP Generated)",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: "📋 HIPAA Verified: Ambient Audio De-identified & End-to-End Encrypted",
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: "Subjective: 58-year-old patient reports mild dyspnea on exertion. Objective: BP 132/84, HR 72 regular. Assessment: Controlled HTN. Plan: Continue Lisinopril 10mg daily.",
          primaryActionText: "Electronic Sign & Sync to Epic EHR",
          secondaryActionText: "Edit SOAP Draft",
          sliderLabel: "Physician Verification Strictness:",
          sliderMin: 70,
          sliderMax: 99,
          sliderDefault: 95,
          sliderUnit: "Clinical Confidence"
        },
        componentSpecs: [
          {
            name: "EHRSoapNoteReviewCard",
            type: "Clinical Document Container",
            props: { patientId: "string", encounterType: "string", soapSections: "object" },
            state: "Real-time stream with highlighted medical entities",
            a11y: "role='region' aria-label='SOAP Note Draft'"
          },
          {
            name: "ElectronicSignatureBar",
            type: "Physician Sign-Off Banner",
            props: { clinicianId: "string", timestamp: "iso-date", onSign: "func", onEdit: "func" },
            state: "1-Click Cryptographic Attestation + FHIR push",
            a11y: "aria-label='Physician Electronic Signature'"
          },
          {
            name: "HIPAASecurityAuditBadge",
            type: "Compliance Pill",
            props: { encryption: "AES-256", phiSanitized: "boolean", bpaActive: "boolean" },
            state: "Permanent green lock badge",
            a11y: "role='status' aria-label='HIPAA Compliant Session'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "healthcare",
          components: [
            { id: "cmp-01", name: "SOAP Review Card", frame: { width: 720, height: 180, borderRadius: 12 }, backgroundColor: "#ffffff" },
            { id: "cmp-02", name: "Physician E-Signature Bar", frame: { width: 720, height: 48, borderRadius: 8 }, backgroundColor: "#f0fdf4" }
          ]
        }
      };

    case 'ecommerce':
      return {
        title: "Smart 1-Click Checkout Drawer & Instant Pay Modal",
        subtitle: "Frictionless checkout experience with auto-address & wallet routing",
        interactiveMock: {
          headerTitle: "CHK-7712 — Express Checkout Summary (2 Items)",
          badgeText: "1-Click Ready: Apple Pay / ShopPay Active",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: "🎉 Free Express Shipping Unlocked — Guaranteed Delivery in 2 Days",
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: "Shipping to: 742 Evergreen Terrace, Springfield, OR. Payment: Apple Pay (Visa ending in 8841). Total: $128.50 USD.",
          primaryActionText: "Pay with Touch ID ($128.50)",
          secondaryActionText: "Change Shipping Address",
          sliderLabel: "Cart Abandonment Trigger Delay:",
          sliderMin: 5,
          sliderMax: 60,
          sliderDefault: 15,
          sliderUnit: "Minutes"
        },
        componentSpecs: [
          {
            name: "ExpressWalletAccordion",
            type: "Payment Selector Component",
            props: { supportedWallets: "array", defaultMethod: "string", onSelect: "func" },
            state: "Sub-second responsive selector with 1-click biometric auth",
            a11y: "role='radiogroup' aria-label='Payment Methods'"
          },
          {
            name: "SmartAddressAutocompleteField",
            type: "Input Form Control",
            props: { apiKey: "string", debounceMs: 150, countryFilter: "string" },
            state: "Real-time verified postal address dropdown",
            a11y: "role='combobox' aria-autocomplete='list'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "ecommerce",
          components: [
            { id: "cmp-01", name: "Express Wallet Pill", frame: { width: 280, height: 44, borderRadius: 8 }, backgroundColor: "#000000", text: "Pay with Apple Pay" },
            { id: "cmp-02", name: "Cart Recovery Sticky Banner", frame: { width: 600, height: 40, borderRadius: 8 }, backgroundColor: "#fff7ed" }
          ]
        }
      };

    case 'devtools':
      return {
        title: "Distributed Tracing & Real-Time Incident Copilot",
        subtitle: "Microservice latency heatmap, root cause isolation, and alert routing",
        interactiveMock: {
          headerTitle: "INC-88102 — High Latency Spike on auth-gateway-service",
          badgeText: "p99 Latency: 480ms (Anomaly Detected)",
          badgeBg: "#dfa88f",
          badgeColor: "#1a1a1a",
          alertText: "⚠️ Root Cause Identified: Postgres connection pool exhaustion following PR #412 deployment",
          alertBg: "#fff0f2",
          alertBorder: "#cf2d56",
          alertColor: "#cf2d56",
          bodyText: "Traces show 220 queries blocked waiting for connection acquisition. Downstream checkout services experiencing 4.2% timeout rate.",
          primaryActionText: "Execute Automated Rollback (1-Click)",
          secondaryActionText: "Page On-Call SRE Squad",
          sliderLabel: "Telemetry Trace Sampling Rate:",
          sliderMin: 5,
          sliderMax: 100,
          sliderDefault: 25,
          sliderUnit: "% of requests"
        },
        componentSpecs: [
          {
            name: "TelemetryLatencyHeatmap",
            type: "Time-Series Data Visualization",
            props: { serviceName: "string", timeWindow: "string", percentiles: "array" },
            state: "Interactive SVG heatmap with scrubbable cursor",
            a11y: "role='img' aria-label='Service Latency Percentiles'"
          },
          {
            name: "RootCauseAnomalyBadge",
            type: "Diagnostic Alert Pill",
            props: { confidence: "float", suspectedCommit: "string", author: "string" },
            state: "Pulsing red outline during active P1 incidents",
            a11y: "role='alert' aria-live='assertive'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "devtools",
          components: [
            { id: "cmp-01", name: "Trace Anomaly Card", frame: { width: 680, height: 140, borderRadius: 8 }, backgroundColor: "#1e1e24" },
            { id: "cmp-02", name: "Rollback Action Pill", frame: { width: 220, height: 36, borderRadius: 9999 }, backgroundColor: "#cf2d56" }
          ]
        }
      };

    case 'ai_agent':
      return {
        title: "Autonomous Agentic Assistant & Citation Grounding Console",
        subtitle: "Multi-turn autonomous task execution with verified citations & safety rails",
        interactiveMock: {
          headerTitle: "AGT-1029 — Multi-Step Market Research Synthesis",
          badgeText: "Agent State: Completed (4 Grounded Citations)",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: "✨ All assertions verified against enterprise RAG vector store with zero hallucinations",
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: "Agent executed 3 tools (VectorSearch, SQLQuery, WebScrape) in 3.4 seconds. Synthesized 4 competitor market share figures with verifiable source links.",
          primaryActionText: "Accept Agent Synthesis & Export",
          secondaryActionText: "Request Human Verification",
          sliderLabel: "Agent Confidence Hallucination Cutoff:",
          sliderMin: 70,
          sliderMax: 98,
          sliderDefault: 88,
          sliderUnit: "% Confidence"
        },
        componentSpecs: [
          {
            name: "AgentThoughtStreamBubble",
            type: "Conversational Progress Indicator",
            props: { steps: "array", currentAction: "string", executionTimeMs: "number" },
            state: "Live step-by-step collapsible thought trace",
            a11y: "role='log' aria-live='polite'"
          },
          {
            name: "CitationGroundingCard",
            type: "Source Verification Component",
            props: { sourceId: "string", documentUrl: "string", textSnippet: "string" },
            state: "Interactive hover preview showing exact source sentence",
            a11y: "role='link' aria-label='View Grounding Source'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "ai_agent",
          components: [
            { id: "cmp-01", name: "Agent Thought Pill", frame: { width: 240, height: 32, borderRadius: 9999 }, backgroundColor: "#c0a8dd" },
            { id: "cmp-02", name: "Citation Grounding Card", frame: { width: 640, height: 56, borderRadius: 8 }, backgroundColor: "#ffffff" }
          ]
        }
      };

    case 'b2b_saas':
      return {
        title: "Enterprise Multi-Tenant Workspace & RBAC Governance Console",
        subtitle: "Granular permissions, SCIM 2.0 user provisioning, and session invalidation",
        interactiveMock: {
          headerTitle: "WSP-5501 — ACME Corp Enterprise Workspace Permissions",
          badgeText: "Governance: SOC2 Type II Certified",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: "🛡️ SAML 2.0 Okta SSO & SCIM Provisioning Active (3,420 Active Seats)",
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: "Admin policy updated: Restricted billing export permissions granted to Finance Controllers only. Revoked export rights for external contractor roles.",
          primaryActionText: "Enforce Policy Across All Active Sessions",
          secondaryActionText: "Download Audit Log (CSV)",
          sliderLabel: "Session Token Expiry Buffer:",
          sliderMin: 15,
          sliderMax: 120,
          sliderDefault: 30,
          sliderUnit: "Seconds"
        },
        componentSpecs: [
          {
            name: "RolePermissionMatrixRow",
            type: "Configuration Table Row",
            props: { roleName: "string", permissions: "array", inheritedFrom: "string" },
            state: "Interactive checkbox matrix with instant permission inheritance check",
            a11y: "role='row' aria-label='Role Permissions'"
          },
          {
            name: "SessionRevocationModal",
            type: "Security Dialog",
            props: { affectedUserCount: "number", reason: "string", onConfirm: "func" },
            state: "Cryptographic token purge across active web & mobile sessions",
            a11y: "role='dialog' aria-modal='true'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "b2b_saas",
          components: [
            { id: "cmp-01", name: "Workspace Role Badge", frame: { width: 140, height: 28, borderRadius: 9999 }, backgroundColor: "#9fc9a2" },
            { id: "cmp-02", name: "SCIM Provisioning Banner", frame: { width: 680, height: 48, borderRadius: 8 }, backgroundColor: "#fafaf7" }
          ]
        }
      };

    case 'support_ops':
    default:
      return {
        title: `${feature} Operational Execution Console`,
        subtitle: `Interactive component specs and live workflow states for ${bu}`,
        interactiveMock: {
          headerTitle: `OP-1049 — Operational Triage & SLA Flow for ${feature}`,
          badgeText: "Execution Status: 92% Confidence (Optimal)",
          badgeBg: "#9fc9a2",
          badgeColor: "#1a1a1a",
          alertText: `⚡ Operational Priority: Real-time telemetry monitoring active across ${bu}`,
          alertBg: "#f0fdf4",
          alertBorder: "#1f8a65",
          alertColor: "#1f8a65",
          bodyText: `System payload evaluated against operational constraints. Recommended execution pathway prepared with sub-second execution SLA.`,
          primaryActionText: "Confirm Execution (1-Click)",
          secondaryActionText: "Override to Manual Review",
          sliderLabel: "Confidence Threshold Setting:",
          sliderMin: 60,
          sliderMax: 95,
          sliderDefault: 88,
          sliderUnit: "% Confidence"
        },
        componentSpecs: [
          {
            name: "ExecutionConfidenceBadge",
            type: "Status Pill Badge",
            props: { confidence: "number (0-100)", status: "string" },
            state: "Dynamic pill color: Green (>=88%), Amber (70-87%), Red (<70%)",
            a11y: "aria-label='Operational Confidence Badge'"
          },
          {
            name: "ActionConfirmationBar",
            type: "Action Banner",
            props: { suggestedAction: "string", reasoning: "string", onAccept: "func", onOverride: "func" },
            state: "1-Click Accept / Override Dropdown toggle",
            a11y: "Keyboard navigable via Tab + Enter"
          },
          {
            name: "ThresholdSliderControlPanel",
            type: "Admin Configuration Form",
            props: { minConfidence: "number (60-95)", autoApproveEnabled: "boolean" },
            state: "Interactive dual-thumb slider with live preview",
            a11y: "role='slider' aria-valuenow='88'"
          }
        ],
        figmaSpecJson: {
          schemaVersion: "2.0-figma-make",
          domain: "support_ops",
          components: [
            { id: "cmp-01", name: "Operational Status Chip", frame: { width: 180, height: 32, borderRadius: 9999 }, backgroundColor: "#9fc9a2", text: "Confidence: 92%" },
            { id: "cmp-02", name: "Action Banner", frame: { width: 640, height: 48, borderRadius: 8 }, backgroundColor: "#fafaf7" }
          ]
        }
      };
  }
}
