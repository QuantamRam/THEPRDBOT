import { detectDomain } from './domainDetector.js';

export function getTelemetryData(inputs) {
  const domain = detectDomain(inputs);
  const feature = inputs.featureName || "Target Capability";
  const bu = inputs.businessUnit || "Product Operations";

  switch (domain) {
    case 'fintech':
      return {
        sqlQueries: [
          {
            title: "Transaction Fraud Score Distribution & Auth Drop-off",
            sql: `SELECT 
  t.payment_rail,
  COUNT(t.id) AS total_transactions,
  ROUND(AVG(t.auth_latency_ms), 1) AS avg_latency_ms,
  ROUND(SUM(CASE WHEN t.status = 'failed_fraud_flag' THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id), 2) AS false_positive_rate_pct,
  ROUND(SUM(t.amount_usd), 2) AS total_volume_usd
FROM payment_transactions t
WHERE t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY t.payment_rail
ORDER BY total_volume_usd DESC;`,
            results: [
              { payment_rail: "Card Processing (Credit/Debit)", total_transactions: "1,240,890", avg_latency_ms: "210.4ms", false_positive_rate_pct: "1.82%", total_volume_usd: "$42,500,000" },
              { payment_rail: "Instant Bank Transfer (ACH / SEPA)", total_transactions: "412,000", avg_latency_ms: "480.2ms", false_positive_rate_pct: "0.64%", total_volume_usd: "$28,100,000" },
              { payment_rail: "Digital Wallets (Apple/Google Pay)", total_transactions: "890,300", avg_latency_ms: "145.0ms", false_positive_rate_pct: "0.45%", total_volume_usd: "$31,400,000" }
            ]
          },
          {
            title: "Merchant Tier Chargeback Ratio & Escalation Impact",
            sql: `SELECT 
  m.tier_name,
  COUNT(DISTINCT m.merchant_id) AS active_merchants,
  ROUND(AVG(m.chargeback_ratio_pct), 3) AS avg_chargeback_pct,
  ROUND(SUM(m.disputed_amount_usd), 0) AS total_disputed_usd
FROM merchant_accounts m
WHERE m.status = 'active'
GROUP BY m.tier_name
ORDER BY total_disputed_usd DESC;`,
            results: [
              { tier_name: "Tier-1 Enterprise ($10M+ GMV)", active_merchants: "142", avg_chargeback_pct: "0.18%", total_disputed_usd: "$240,000" },
              { tier_name: "Mid-Market ($1M-$10M GMV)", active_merchants: "680", avg_chargeback_pct: "0.42%", total_disputed_usd: "$390,000" },
              { tier_name: "Emerging Sellers (<$1M GMV)", active_merchants: "3,450", avg_chargeback_pct: "0.89%", total_disputed_usd: "$510,000" }
            ]
          }
        ],
        regionalStats: [
          { region: "North America (US & Canada)", usageShare: "52%", avgLatency: "118ms", slaCompliance: "99.98%", dataQuality: "Real-time Verified" },
          { region: "Europe (UK, DE, FR)", usageShare: "28%", avgLatency: "162ms", slaCompliance: "99.95%", dataQuality: "SCA / 3DS Compliant" },
          { region: "Asia Pacific (SG, JP, AU)", usageShare: "14%", avgLatency: "215ms", slaCompliance: "99.80%", dataQuality: "Local Bank Settlement Gaps" },
          { region: "Latin America (BR, MX)", usageShare: "6%", avgLatency: "280ms", slaCompliance: "99.40%", dataQuality: "PIX / SPEI Telemetry Sampling" }
        ],
        customerQuotes: [
          {
            quote: "Every 100ms of payment delay increases checkout bounce by 1.2%. We need sub-second fraud evaluations that never block legitimate high-value customers.",
            author: "David Chen, VP of Payments Engineering",
            company: "Apex Global Commerce"
          },
          {
            quote: "False-positive card declines during Black Friday cost us over $400,000 in lost revenue. Real-time confidence calibration is our #1 requirement.",
            author: "Samantha Miller, Head of Financial Risk",
            company: "StrataPay Merchants"
          }
        ],
        dataGaps: [
          "Cross-border currency conversion settlement lags lack granular sub-minute telemetry.",
          "Alternative payment methods (APMs) report aggregated settlement batches rather than real-time webhooks.",
          "Lack of normalized device fingerprinting across legacy mobile app versions."
        ],
        competitorMatrix: [
          { feature: "Real-time Fraud Scoring Latency", freshworks: "Sub-150ms Guaranteed", zendesk: "Stripe Radar (180ms)", serviceNow: "Adyen Protect (190ms)", salesforce: "Cybersource (260ms)" },
          { feature: "Dynamic Risk Threshold Controls", freshworks: "Self-Service Slider (0-100)", zendesk: "Rule Engine Only", serviceNow: "Manual Config", salesforce: "Custom Scripting" },
          { feature: "Idempotent Safe Fallback", freshworks: "Built-in Dual-Rail Routing", zendesk: "Partial (Webhooks)", serviceNow: "Native", salesforce: "Requires Middleware" }
        ]
      };

    case 'healthcare':
      return {
        sqlQueries: [
          {
            title: "Clinician Daily Documentation Burden & Chart Closure Latency",
            sql: `SELECT 
  d.specialty,
  COUNT(e.encounter_id) AS total_encounters,
  ROUND(AVG(e.documentation_time_minutes), 1) AS avg_charting_mins,
  ROUND(SUM(CASE WHEN e.signed_same_day = FALSE THEN 1 ELSE 0 END) * 100.0 / COUNT(e.encounter_id), 1) AS deferred_chart_pct,
  ROUND(AVG(e.pajama_time_minutes), 1) AS avg_after_hours_mins
FROM clinical_encounters e
JOIN clinical_staff d ON e.clinician_id = d.id
WHERE e.encounter_date >= CURRENT_DATE - 30
GROUP BY d.specialty
ORDER BY avg_charting_mins DESC;`,
            results: [
              { specialty: "Primary Care / Family Medicine", total_encounters: "18,420", avg_charting_mins: "16.8m", deferred_chart_pct: "34.2%", avg_after_hours_mins: "52.0m" },
              { specialty: "Internal Medicine & Oncology", total_encounters: "9,850", avg_charting_mins: "21.4m", deferred_chart_pct: "41.0%", avg_after_hours_mins: "68.5m" },
              { specialty: "Emergency Department", total_encounters: "12,100", avg_charting_mins: "11.2m", deferred_chart_pct: "14.5%", avg_after_hours_mins: "22.0m" }
            ]
          }
        ],
        regionalStats: [
          { region: "Northeast Hospital System", usageShare: "42%", avgLatency: "210ms", slaCompliance: "99.9%", dataQuality: "Epic FHIR Integrated" },
          { region: "Midwest Clinical Network", usageShare: "32%", avgLatency: "245ms", slaCompliance: "99.6%", dataQuality: "Cerner Millenium Connected" },
          { region: "West Coast Ambulatory Centers", usageShare: "26%", avgLatency: "190ms", slaCompliance: "99.8%", dataQuality: "AthenaHealth Sync Clean" }
        ],
        customerQuotes: [
          {
            quote: "I spend nearly two hours every evening finishing notes in the EHR instead of seeing my family. If an AI tool can draft clean SOAP notes while I talk to patients, it will change medicine.",
            author: "Dr. Evelyn Reed, MD, Chief of Clinical Quality",
            company: "Valley Health System"
          },
          {
            quote: "Physician burnout is at an all-time high. Whatever tool we adopt must guarantee zero PHI leakage and allow attending sign-off in under 30 seconds.",
            author: "Brian Larson, Chief Information Officer",
            company: "Metro Medical Center"
          }
        ],
        dataGaps: [
          "Ambient audio acoustic quality drops in noisy emergency department trauma rooms.",
          "Unmapped medical abbreviation taxonomy across regional pediatric clinics.",
          "Telemetry on clinician manual note edits lacks granular keystroke-level diff logs."
        ],
        competitorMatrix: [
          { feature: "SOAP Note Generation Speed", freshworks: "< 45s Post-Encounter", zendesk: "Nuance DAX (> 4m)", serviceNow: "Ambience (< 60s)", salesforce: "Abridge (< 50s)" },
          { feature: "FHIR / HL7 Native Sync", freshworks: "Bi-directional Automated", zendesk: "Custom Middleware", serviceNow: "Partial (Manual Pull)", salesforce: "Batch Export" },
          { feature: "Attending 1-Click Sign-off", freshworks: "Inline Electronic Signature", zendesk: "EHR Dependent", serviceNow: "Web Portal Only", salesforce: "Mobile App" }
        ]
      };

    case 'ecommerce':
      return {
        sqlQueries: [
          {
            title: "Checkout Funnel Step Drop-off & Cart Abandonment",
            sql: `SELECT 
  step_name,
  COUNT(session_id) AS total_sessions,
  ROUND(COUNT(session_id) * 100.0 / FIRST_VALUE(COUNT(session_id)) OVER (ORDER BY step_order), 1) AS funnel_retention_pct,
  ROUND(AVG(step_duration_seconds), 1) AS avg_time_spent_sec
FROM checkout_funnel_events
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY step_name, step_order
ORDER BY step_order ASC;`,
            results: [
              { step_name: "1. Cart Summary", total_sessions: "450,000", funnel_retention_pct: "100.0%", avg_time_spent_sec: "28.4s" },
              { step_name: "2. Shipping Address & Method", total_sessions: "288,000", funnel_retention_pct: "64.0%", avg_time_spent_sec: "42.1s" },
              { step_name: "3. Payment & Billing Entry", total_sessions: "198,000", funnel_retention_pct: "44.0%", avg_time_spent_sec: "58.6s" },
              { step_name: "4. Order Confirmation (Success)", total_sessions: "148,500", funnel_retention_pct: "33.0%", avg_time_spent_sec: "12.0s" }
            ]
          }
        ],
        regionalStats: [
          { region: "North America (US-East/West)", usageShare: "58%", avgLatency: "95ms", slaCompliance: "99.95%", dataQuality: "Full Attribution" },
          { region: "Western Europe (UK, DE, FR)", usageShare: "26%", avgLatency: "140ms", slaCompliance: "99.85%", dataQuality: "GDPR Consent Filtered" },
          { region: "Southeast Asia (SG, ID, TH)", usageShare: "16%", avgLatency: "220ms", slaCompliance: "98.90%", dataQuality: "Cash-on-Delivery Gaps" }
        ],
        customerQuotes: [
          {
            quote: "Over 67% of our mobile shoppers abandon their cart at the shipping address form. A friction-free 1-click checkout flow will unlock millions in recovered GMV.",
            author: "Chloe Martinez, VP of Digital Merchandising",
            company: "Nordic Trend Apparel"
          },
          {
            quote: "Speed is our conversion engine. Every fraction of a second shaved off checkout directly increases our bottom-line ROAS.",
            author: "Jason Lee, Head of Growth",
            company: "Luxe Brands Direct"
          }
        ],
        dataGaps: [
          "Guest mobile users clearing cookies cause multi-device attribution discontinuities.",
          "Stock reservation race conditions during flash drops lack sub-millisecond event logs."
        ],
        competitorMatrix: [
          { feature: "1-Click Express Checkout", freshworks: "Native Embedded (<2 clicks)", zendesk: "Shopify ShopPay", serviceNow: "Bolt One-Click", salesforce: "Fast Checkout" },
          { feature: "Dynamic Address Autocomplete", freshworks: "Sub-100ms Google/Loqate", zendesk: "Standard Dropdown", serviceNow: "Manual Zip Lookup", salesforce: "Standard Autocomplete" },
          { feature: "Cart Recovery Automation", freshworks: "Multi-Channel SMS/Email/Push", zendesk: "Klaviyo Dependent", serviceNow: "Email Only", salesforce: "Marketing Cloud" }
        ]
      };

    case 'devtools':
      return {
        sqlQueries: [
          {
            title: "Distributed Service Latency (p95/p99) & Error Spikes",
            sql: `SELECT 
  service_name,
  COUNT(trace_id) AS total_requests,
  ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY duration_ms), 1) AS p50_ms,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms), 1) AS p95_ms,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY duration_ms), 1) AS p99_ms,
  ROUND(SUM(CASE WHEN http_status >= 500 THEN 1 ELSE 0 END) * 100.0 / COUNT(trace_id), 2) AS error_rate_pct
FROM service_telemetry_traces
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY service_name
ORDER BY p99_ms DESC;`,
            results: [
              { service_name: "auth-gateway-service", total_requests: "14,500,000", p50_ms: "18.2ms", p95_ms: "82.4ms", p99_ms: "245.0ms", error_rate_pct: "0.08%" },
              { service_name: "payment-ledger-engine", total_requests: "2,100,000", p50_ms: "45.0ms", p95_ms: "192.0ms", p99_ms: "480.5ms", error_rate_pct: "0.32%" },
              { service_name: "data-sync-worker", total_requests: "8,900,000", p50_ms: "110.0ms", p95_ms: "410.0ms", p99_ms: "920.0ms", error_rate_pct: "1.14%" }
            ]
          }
        ],
        regionalStats: [
          { region: "AWS us-east-1 (N. Virginia)", usageShare: "46%", avgLatency: "14ms", slaCompliance: "99.99%", dataQuality: "Full Trace Ingestion" },
          { region: "AWS eu-west-1 (Ireland)", usageShare: "34%", avgLatency: "22ms", slaCompliance: "99.98%", dataQuality: "Full Trace Ingestion" },
          { region: "GCP asia-northeast1 (Tokyo)", usageShare: "20%", avgLatency: "48ms", slaCompliance: "99.90%", dataQuality: "Sampled at 20%" }
        ],
        customerQuotes: [
          {
            quote: "When a microservice begins degrading, finding the root cause across 200 services takes 45 minutes of manual log searching. We need automated incident tracing that isolates the faulty commit in seconds.",
            author: "Alexei Volkov, Staff Platform Engineer",
            company: "CloudScale Infra"
          },
          {
            quote: "Our alerting is too noisy. SREs get paged 15 times a night for transient blips. Intelligent anomaly clustering is our critical priority.",
            author: "Rachel Adams, Director of Site Reliability",
            company: "FinServ Global"
          }
        ],
        dataGaps: [
          "High-cardinality custom metric tags increase storage costs, forcing aggressive 10% sampling.",
          "Serverless cold start duration is not cleanly broken down between runtime init and handler execution."
        ],
        competitorMatrix: [
          { feature: "Continuous Trace Correlation", freshworks: "Automated eBPF + OTel", zendesk: "Datadog APM", serviceNow: "New Relic One", salesforce: "Dynatrace PurePath" },
          { feature: "Predictive Anomaly Clustering", freshworks: "ML Root Cause Engine", zendesk: "Watchdog Alerts", serviceNow: "Basic Thresholds", salesforce: "Davis AI" },
          { feature: "OpenTelemetry Native", freshworks: "100% Zero-Vendor Lock-in", zendesk: "Proprietary Agent First", serviceNow: "OTel Compatible", salesforce: "Plugin Required" }
        ]
      };

    case 'ai_agent':
      return {
        sqlQueries: [
          {
            title: "AI Agent Task Completion Rate & Verification Feedback",
            sql: `SELECT 
  agent_workflow,
  COUNT(session_id) AS total_runs,
  ROUND(AVG(total_tokens), 0) AS avg_tokens,
  ROUND(AVG(latency_ms / 1000.0), 2) AS avg_duration_sec,
  ROUND(SUM(CASE WHEN completion_status = 'success_verified' THEN 1 ELSE 0 END) * 100.0 / COUNT(session_id), 1) AS success_rate_pct,
  ROUND(SUM(CASE WHEN human_escalated = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(session_id), 1) AS escalation_pct
FROM agent_execution_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY agent_workflow
ORDER BY total_runs DESC;`,
            results: [
              { agent_workflow: "Autonomous Code Refactoring", total_runs: "42,100", avg_tokens: "4,850", avg_duration_sec: "12.4s", success_rate_pct: "88.4%", escalation_pct: "11.6%" },
              { agent_workflow: "Customer Research & Synthesis", total_runs: "68,400", avg_tokens: "2,920", avg_duration_sec: "6.8s", success_rate_pct: "94.2%", escalation_pct: "5.8%" },
              { agent_workflow: "Multi-Step Data Extraction", total_runs: "112,000", avg_tokens: "1,450", avg_duration_sec: "3.2s", success_rate_pct: "96.8%", escalation_pct: "3.2%" }
            ]
          }
        ],
        regionalStats: [
          { region: "US Central (Tier 1 Inference)", usageShare: "62%", avgLatency: "380ms TTFT", slaCompliance: "99.95%", dataQuality: "Full Token Logs" },
          { region: "EU West (GDPR Guarded)", usageShare: "26%", avgLatency: "440ms TTFT", slaCompliance: "99.88%", dataQuality: "PII Masked Clean" },
          { region: "AP East (Regional Cache)", usageShare: "12%", avgLatency: "520ms TTFT", slaCompliance: "99.40%", dataQuality: "Inference Buffer Active" }
        ],
        customerQuotes: [
          {
            quote: "The biggest barrier to enterprise AI adoption is hallucination risk and lack of auditability. We need verifiable source citations for every single generated recommendation.",
            author: "Priya Sundaram, VP of Product AI",
            company: "Enterprise Cognitive Labs"
          },
          {
            quote: "Speed and cost matter just as much as accuracy. If an agent query costs $0.15 and takes 20 seconds, it won't work for interactive end-user products.",
            author: "Tom Westermann, Principal Architect",
            company: "Synthetix Workflows"
          }
        ],
        dataGaps: [
          "Subjective user satisfaction ratings are only submitted on 4.2% of agent sessions.",
          "RAG document chunk overlap sometimes causes duplicate context retrieval."
        ],
        competitorMatrix: [
          { feature: "Verifiable Citation Grounding", freshworks: "Dual-Pass RAG Verification", zendesk: "OpenAI Assistants API", serviceNow: "Anthropic Artifacts", salesforce: "LangChain / Bedrock" },
          { feature: "Time-To-First-Token (TTFT)", freshworks: "Sub-350ms Streaming", zendesk: "650ms", serviceNow: "480ms", salesforce: "850ms" },
          { feature: "Autonomous Tool Calling", freshworks: "Deterministic Schema Validation", zendesk: "Function Calling", serviceNow: "MCP Integration", salesforce: "Custom Tools" }
        ]
      };

    case 'b2b_saas':
      return {
        sqlQueries: [
          {
            title: "Workspace Seat Adoption & Enterprise Role Governance",
            sql: `SELECT 
  w.plan_tier,
  COUNT(DISTINCT w.workspace_id) AS total_workspaces,
  ROUND(AVG(w.active_seats_pct), 1) AS avg_seat_utilization_pct,
  ROUND(AVG(w.weekly_active_teams), 1) AS avg_active_teams,
  ROUND(SUM(CASE WHEN w.custom_rbac_enabled = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(w.workspace_id), 1) AS rbac_adoption_pct
FROM workspace_analytics w
WHERE w.last_activity >= NOW() - INTERVAL '30 days'
GROUP BY w.plan_tier
ORDER BY total_workspaces DESC;`,
            results: [
              { plan_tier: "Enterprise ($100k+ ARR)", total_workspaces: "380", avg_seat_utilization_pct: "84.2%", avg_active_teams: "24.5", rbac_adoption_pct: "96.4%" },
              { plan_tier: "Mid-Market ($25k-$100k ARR)", total_workspaces: "1,420", avg_seat_utilization_pct: "71.0%", avg_active_teams: "8.2", rbac_adoption_pct: "62.0%" },
              { plan_tier: "Team Starter ($5k-$25k ARR)", total_workspaces: "4,890", avg_seat_utilization_pct: "55.8%", avg_active_teams: "2.8", rbac_adoption_pct: "18.5%" }
            ]
          }
        ],
        regionalStats: [
          { region: "North America (US & Canada)", usageShare: "54%", avgLatency: "115ms", slaCompliance: "99.98%", dataQuality: "SOC2 Certified" },
          { region: "Europe (Frankfurt & London)", usageShare: "30%", avgLatency: "165ms", slaCompliance: "99.92%", dataQuality: "Dedicated EU Data Isolation" },
          { region: "Asia Pacific (Sydney & Tokyo)", usageShare: "16%", avgLatency: "230ms", slaCompliance: "99.70%", dataQuality: "Regional Replicas Active" }
        ],
        customerQuotes: [
          {
            quote: "Our security team blocked deployment across 3,000 employees until we could enforce granular workspace role boundaries and SCIM auto-provisioning.",
            author: "Nathan Vance, VP of IT Operations",
            company: "Fortress Financial Corp"
          },
          {
            quote: "Managers want autonomy to create project workspaces without IT intervention, but IT needs central visibility and audit trails. That balance is essential.",
            author: "Danielle Morris, Director of Product Operations",
            company: "Horizon Media Systems"
          }
        ],
        dataGaps: [
          "Legacy SSO sessions without SCIM sync lead to orphaned accounts during employee offboarding.",
          "Granular permission check latencies spike during nested group evaluations."
        ],
        competitorMatrix: [
          { feature: "Custom RBAC Hierarchy", freshworks: "Granular Dynamic Matrix", zendesk: "Atlassian Access", serviceNow: "Notion Teamspaces", salesforce: "Slack Enterprise Grid" },
          { feature: "Instant Session Invalidation", freshworks: "Sub-30s Global JWT Purge", zendesk: "15-Minute Polling", serviceNow: "Next-Login Check", salesforce: "Manual Revoke" },
          { feature: "SCIM 2.0 User Provisioning", freshworks: "Real-Time Webhook Driven", zendesk: "Okta / Azure AD Sync", serviceNow: "Enterprise Add-on", salesforce: "Native" }
        ]
      };

    case 'support_ops':
    default:
      return {
        sqlQueries: [
          {
            title: `${feature} Operational Latency & SLA Breach Rate`,
            sql: `SELECT 
  t.business_unit,
  COUNT(t.id) AS total_events,
  ROUND(AVG(t.first_response_time_sec / 60.0), 2) AS avg_duration_minutes,
  ROUND(SUM(CASE WHEN t.sla_breached = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(t.id), 1) AS sla_breach_pct,
  ROUND(AVG(t.friction_score), 1) AS avg_friction_score
FROM workflow_events t
WHERE t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY t.business_unit
ORDER BY sla_breach_pct DESC;`,
            results: [
              { business_unit: `${bu}`, total_events: "48,290", avg_duration_minutes: "4.2m", sla_breach_pct: "17.8%", avg_friction_score: "3.8/5" },
              { business_unit: "Enterprise Operations", total_events: "31,400", avg_duration_minutes: "3.8m", sla_breach_pct: "14.2%", avg_friction_score: "3.2/5" },
              { business_unit: "Shared Services", total_events: "19,850", avg_duration_minutes: "2.9m", sla_breach_pct: "9.5%", avg_friction_score: "2.6/5" }
            ]
          }
        ],
        regionalStats: [
          { region: "North America (US-East / West)", usageShare: "48%", avgLatency: "112ms", slaCompliance: "92.4%", dataQuality: "High (Clean)" },
          { region: "Europe (EU-Central / London)", usageShare: "31%", avgLatency: "185ms", slaCompliance: "88.1%", dataQuality: "PII Masked" },
          { region: "Asia Pacific (AP-South / Singapore)", usageShare: "15%", avgLatency: "240ms", slaCompliance: "81.6%", dataQuality: "Telemetry Sampling Needed" },
          { region: "Latin America (LATAM / Sao Paulo)", usageShare: "6%", avgLatency: "290ms", slaCompliance: "79.2%", dataQuality: "Regional Sampling" }
        ],
        customerQuotes: [
          {
            quote: `Our teams waste substantial operational hours manually navigating bottlenecks in ${feature}. Automating this with precision controls is our highest strategic priority.`,
            author: "Sarah Jenkins, VP of Customer Operations",
            company: "Global Tech Solutions (CAB Member)"
          },
          {
            quote: "We need transparent telemetry and clear audit logs. Show us why decisions were made with sub-second response times.",
            author: "Marcus Vance, Lead Enterprise Architect",
            company: "OmniCorp Systems"
          }
        ],
        dataGaps: [
          "Missing real-time mobile telemetry in high-latency regional nodes.",
          "Historical exception logs lack normalized categorization across legacy systems."
        ],
        competitorMatrix: [
          { feature: "Automated Execution SLA", freshworks: "Native Sub-Second (<300ms)", zendesk: "Zendesk AI (>1.2s)", serviceNow: "ServiceNow Predictive", salesforce: "Salesforce Einstein" },
          { feature: "Granular Control Sliders", freshworks: "Dynamic Precision Controls", zendesk: "Fixed Thresholds", serviceNow: "Custom Scripting", salesforce: "Admin Rules" },
          { feature: "Transparent Telemetry & Audit", freshworks: "Full SQL + Immutable Logs", zendesk: "Closed Analytics", serviceNow: "Performance Analytics", salesforce: "Tableau Integration" }
        ]
      };
  }
}
