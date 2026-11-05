/**
 * Domain Detector Engine
 * Analyzes feature names, problem statements, and business units to detect
 * the product domain archetype and guide precision synthesis.
 */

export function detectDomain(inputs) {
  const text = `${inputs.businessUnit || ''} ${inputs.featureName || ''} ${inputs.problemStatement || ''}`.toLowerCase();

  if (/fraud|payment|billing|invoice|fintech|banking|wallet|transaction|subscription|payout|escrow|credit|debit|ledger/i.test(text)) {
    return 'fintech';
  }
  if (/patient|doctor|clinic|health|medical|ehr|emr|hipaa|hospital|telehealth|prescription|clinical|pharmacy/i.test(text)) {
    return 'healthcare';
  }
  if (/cart|checkout|store|shop|ecommerce|e-commerce|catalog|order|shipping|inventory|sku|retail|marketplace/i.test(text)) {
    return 'ecommerce';
  }
  if (/developer|devtools|api|sdk|ci\/cd|pipeline|latency|tracing|metric|log|deploy|kubernetes|docker|cloud|serverless|infra|database/i.test(text)) {
    return 'devtools';
  }
  if (/copilot|agentic|agent|rag|llm|embeddings|prompt|model|hallucination|generative|ai assistant|autonomous/i.test(text)) {
    return 'ai_agent';
  }
  if (/ticket|triage|support|helpdesk|customer service|sla|frt|incident response|agent queue/i.test(text)) {
    return 'support_ops';
  }
  if (/social|community|creator|follower|audio room|feed|messaging|consumer|gamification|habit|chat app/i.test(text)) {
    return 'consumer';
  }
  if (/workspace|rbac|tenant|b2b|saas|permission|sso|scim|governance|audit log|collaboration|enterprise/i.test(text)) {
    return 'b2b_saas';
  }

  return 'general_saas';
}

