/**
 * AI Service Engine
 * Handles live LLM API calls:
 * - Claude via genzdealz.ai API (Default active engine with Claude Haiku 5.5)
 * - Google Gemini API
 * - OpenAI / Custom endpoint
 * - Seamless fallback to Built-In Precision Synthesis Engine.
 */
import { generateFullPRD } from './prdGenerator.js';

const STORAGE_KEY = 'the_prd_bot_ai_settings';

export const DEFAULT_AI_KEY = 'sk-gzd-live_518c73d06740.fQfZ_xi4IpivFQYIGx0706CSjpd-atms1-JCaIgt7Y8';
export const DEFAULT_AI_PROVIDER = 'claude';
export const DEFAULT_AI_MODEL = 'haiku';
export const DEFAULT_AI_BASE_URL = 'https://api.genzdealz.ai';

export function getAISettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // If user had builtin without a custom key, automatically upgrade to active Claude provider
      if (parsed.provider === 'builtin' && (!parsed.apiKey || parsed.apiKey === '')) {
        return {
          provider: 'claude',
          apiKey: DEFAULT_AI_KEY,
          model: 'haiku',
          baseUrl: DEFAULT_AI_BASE_URL
        };
      }
      if (parsed.provider === 'claude' && !parsed.apiKey) {
        parsed.apiKey = DEFAULT_AI_KEY;
      }
      if (parsed.provider === 'claude' && !parsed.model) {
        parsed.model = 'haiku';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read AI settings:', e);
  }

  return {
    provider: 'claude', // Active default: Claude Haiku 5.5 via genzdealz.ai
    apiKey: DEFAULT_AI_KEY,
    model: 'haiku',
    baseUrl: DEFAULT_AI_BASE_URL
  };
}

export function saveAISettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings:', e);
  }
}

export async function testAIConnection(settings) {
  if (settings.provider === 'builtin') {
    return { ok: true, message: 'Built-in Precision Engine ready (Zero setup required).' };
  }

  const apiKey = settings.apiKey || (settings.provider === 'claude' ? DEFAULT_AI_KEY : '');
  if (!apiKey) {
    return { ok: false, message: 'API Key is missing.' };
  }

  try {
    if (settings.provider === 'claude') {
      const model = settings.model || 'haiku';
      const endpoints = ['/api/genzdealz/v1/messages', `${(settings.baseUrl || DEFAULT_AI_BASE_URL).replace(/\/$/, '')}/v1/messages`];
      let lastErr = null;
      let data = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              model,
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Reply with "OK"' }]
            })
          });

          if (res.ok) {
            data = await res.json();
            break;
          } else {
            const errData = await res.json().catch(() => ({}));
            lastErr = new Error(errData?.error?.message || `HTTP ${res.status}`);
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (data) {
        return { ok: true, message: `Connected to Claude (${data.model || model}) via genzdealz.ai successfully!` };
      }
      throw lastErr || new Error('Failed to connect to Claude API.');
    }

    if (settings.provider === 'gemini') {
      const model = settings.model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, reply with "OK"' }] }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      return { ok: true, message: `Connected to Gemini (${model}) successfully!` };
    }

    if (settings.provider === 'openai' || settings.provider === 'custom') {
      const baseUrl = settings.baseUrl || 'https://api.openai.com/v1';
      const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: settings.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Reply with "OK"' }],
          max_tokens: 5
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      return { ok: true, message: `Connected to ${settings.provider} (${settings.model}) successfully!` };
    }
  } catch (err) {
    return { ok: false, message: `Connection failed: ${err.message}` };
  }

  return { ok: false, message: 'Unknown provider.' };
}

export async function generatePRD(inputs, qaAnswers, onProgress) {
  const settings = getAISettings();
  const apiKey = settings.apiKey || (settings.provider === 'claude' ? DEFAULT_AI_KEY : '');

  // If explicitly using Built-in Engine or no key available for non-builtin providers
  if (settings.provider === 'builtin' || (!apiKey && settings.provider !== 'claude')) {
    return generateBuiltinWithProgress(inputs, qaAnswers, onProgress);
  }

  // Live AI Generation (Claude / Gemini / OpenAI / Custom)
  try {
    if (onProgress) onProgress('THINKING', 'Connecting to Claude AI (genzdealz.ai) & framing product context...');
    
    const masterPrompt = buildMasterPMPrompt(inputs, qaAnswers);

    // 1. Claude via genzdealz.ai
    if (settings.provider === 'claude') {
      const model = settings.model || 'haiku';
      if (onProgress) onProgress('GREPPING', `Querying Claude (${model}) with 12-Phase PM Framework...`);

      const endpoints = ['/api/genzdealz/v1/messages', `${(settings.baseUrl || DEFAULT_AI_BASE_URL).replace(/\/$/, '')}/v1/messages`];
      let data = null;
      let lastErr = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              model,
              max_tokens: 8192,
              messages: [{ role: 'user', content: masterPrompt }]
            })
          });

          if (res.ok) {
            data = await res.json();
            break;
          } else {
            const errData = await res.json().catch(() => ({}));
            lastErr = new Error(errData?.error?.message || `HTTP ${res.status}`);
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (!data) {
        throw lastErr || new Error('Claude generation failed.');
      }

      if (onProgress) onProgress('EDITING', 'Structuring executive 12-Phase PRD markdown...');
      const text = data?.content?.map(c => c.text).join('') || data?.content?.[0]?.text;

      if (!text || text.length < 200) {
        throw new Error('Claude returned an empty or truncated response.');
      }

      if (onProgress) onProgress('DONE', `Drafted successfully with Claude (${data.model || model})!`);
      return text;
    }

    // 2. Google Gemini
    if (settings.provider === 'gemini') {
      const model = settings.model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      if (onProgress) onProgress('GREPPING', `Querying ${model} with 12-Phase PM Framework...`);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: masterPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      if (onProgress) onProgress('EDITING', 'Parsing and structuring markdown PRD...');
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || text.length < 200) {
        throw new Error('AI returned an empty or truncated response.');
      }

      if (onProgress) onProgress('DONE', `Drafted successfully with ${model}!`);
      return text;
    }

    // 3. OpenAI or Custom Endpoint
    if (settings.provider === 'openai' || settings.provider === 'custom') {
      const baseUrl = settings.baseUrl || 'https://api.openai.com/v1';
      const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

      if (onProgress) onProgress('GREPPING', `Querying ${settings.model || 'LLM'} with 12-Phase PM Framework...`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: settings.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an elite Principal Product Manager and Chief Product Officer. You write the most rigorous, precise, production-ready Product Requirements Documents (PRDs) in tech.'
            },
            {
              role: 'user',
              content: masterPrompt
            }
          ],
          temperature: 0.2
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      if (onProgress) onProgress('EDITING', 'Structuring executive PRD markdown...');
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text || text.length < 200) {
        throw new Error('AI returned an empty response.');
      }

      if (onProgress) onProgress('DONE', `Drafted successfully with ${settings.model}!`);
      return text;
    }
  } catch (err) {
    console.warn('Live AI generation failed; falling back to Built-In Precision Synthesizer:', err);
    if (onProgress) onProgress('READ', `AI Notice: ${err.message}. Switching to Built-In Engine...`);
    await new Promise(r => setTimeout(r, 800));
    return generateBuiltinWithProgress(inputs, qaAnswers, onProgress);
  }

  return generateBuiltinWithProgress(inputs, qaAnswers, onProgress);
}

async function generateBuiltinWithProgress(inputs, qaAnswers, onProgress) {
  const steps = [
    { pill: 'THINKING', text: 'Analyzing Problem, Personas & First-Principles Grounding...' },
    { pill: 'GREPPING', text: 'Synthesizing Domain SQL Schema & Baseline Telemetry...' },
    { pill: 'READING', text: 'Modeling Competitor Matrix & Customer Voice Quotes...' },
    { pill: 'EDITING', text: 'Drafting 12-Phase PRD, Gherkin Specs & Architecture Flow...' },
    { pill: 'DONE', text: 'CPO Executive Audit & Component Specs Complete!' }
  ];

  for (let i = 0; i < steps.length - 1; i++) {
    if (onProgress) onProgress(steps[i].pill, steps[i].text);
    await new Promise(r => setTimeout(r, 160));
  }

  const prd = generateFullPRD(inputs, qaAnswers);
  const finalStep = steps[steps.length - 1];
  if (onProgress) onProgress(finalStep.pill, finalStep.text);
  return prd;
}

function buildMasterPMPrompt(inputs, qaAnswers) {
  const bu = inputs.businessUnit || "Product Operations";
  const feature = inputs.featureName || "Target Capability";
  const epic = inputs.epicId || "EPIC-PRD-101";
  const problem = inputs.problemStatement || "Customers experience severe operational friction, high latency, and workflow bottlenecks.";
  const personas = inputs.targetPersonas && inputs.targetPersonas.length > 0 ? inputs.targetPersonas.join(', ') : "Product Manager, Engineer, End User";

  const qaContext = Object.entries(qaAnswers).map(([k, v]) => `- Q&A (${k}): ${v}`).join('\n');

  return `You are a World-Class Principal Product Manager (ex-Stripe, Google, Freshworks, Reforge).
Draft a comprehensive, highly rigorous, executive-approved 12-Phase Product Requirements Document (PRD) for the following product initiative:

PRODUCT INITIATIVE DETAILS:
- Feature Name: "${feature}"
- Business Unit / Domain: "${bu}"
- Epic ID: "${epic}"
- Target Personas: ${personas}
- Problem Statement:
"${problem}"

DOMAIN DISCOVERY & CLARIFYING Q&A CONTEXT:
${qaContext || "None specified; infer optimal industry standards."}

CRITICAL INSTRUCTIONS & PRD PRINCIPLES:
1. Do NOT write generic or placeholder text. Tailor EVERY phase directly to this specific domain and problem.
2. Structure the document strictly into these 12 PHASES with clear H3 headers:
   - PHASE 1: EXECUTIVE SUMMARY, STRATEGIC INTENT & NORTH STAR OBJECTIVE
   - PHASE 2: PROBLEM STATEMENT, FIRST PRINCIPLES & CUSTOMER FRICTION
   - PHASE 3: TARGET PERSONAS & JOBS-TO-BE-DONE (JTBD)
   - PHASE 4: STRATEGIC ALIGNMENT, SCOPE, GOALS & NON-GOALS
   - PHASE 5: QUANTITATIVE EVIDENCE & DOMAIN SQL TELEMETRY (Include a realistic, syntactically valid SQL query and benchmark output table matching the domain)
   - PHASE 6: QUALITATIVE GROUNDING & COMPETITOR POSITIONING MATRIX (Include realistic CAB customer quotes and a 4-column competitor comparison table)
   - PHASE 7: FUNCTIONAL REQUIREMENTS & ACCEPTANCE CRITERIA (GHERKIN) (FR-01 to FR-05 with Priority, plus detailed GIVEN/WHEN/THEN criteria for P0 features)
   - PHASE 8: NON-FUNCTIONAL REQUIREMENTS (NFRS) & SERVICE LEVEL OBJECTIVES (Latency p50/p95/p99, throughput, security, compliance like SOC2/HIPAA/PCI, availability)
   - PHASE 9: USER STORIES & NEGATIVE EDGE-CASE MATRIX (Table with Trigger, Expected Behavior, and Negative Impact Mitigation)
   - PHASE 10: SYSTEM ARCHITECTURE & API CONTRACT SPEC (Include a valid Mermaid sequenceDiagram and a realistic REST JSON API request/response contract)
   - PHASE 11: GO-TO-MARKET (GTM), PHASED ROLLOUT & PRICING STRATEGY (Canary rollout rings, kill-switch triggers, packaging tiering)
   - PHASE 12: SUCCESS METRICS TREE, COUNTER-METRICS & REVIEW CADENCE (North Star metric, L1 operational metrics, Guardrail counter-metrics, 30/60/90 day reviews)

Output strictly clean Markdown format ready for engineering and executive handoff.`;
}
