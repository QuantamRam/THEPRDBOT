import { marked } from 'marked';
import { TEMPLATES } from './data/templates.js';
import { generateClarifyingQuestions } from './engine/qaGenerator.js';
import { getTelemetryData } from './engine/telemetryEngine.js';
import { runCPOAudit } from './engine/cpoAuditEngine.js';
import { getWireframeSpec } from './engine/wireframeEngine.js';
import { downloadMarkdown, downloadJson, copyToClipboard, triggerConfetti } from './utils/exportUtils.js';
import { getAISettings, saveAISettings, testAIConnection, generatePRD } from './engine/aiService.js';
import { detectDomain } from './engine/domainDetector.js';
import { convertToJiraMarkup, convertToNotionBlocks } from './utils/jiraNotionExporter.js';
import { runPlaygroundGeneration } from './engine/playgroundEngine.js';

// Application State
let currentInputs = {};
let currentQA = [];
let currentQAAnswers = {};
let currentPRDMarkdown = '';
let currentAudit = null;
let currentWireframeData = null;
let isEditRawMode = false;
let playgroundOutputText = '';

// DOM Elements
const templateSelect = document.getElementById('templateSelect');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
const resetBtn = document.getElementById('resetBtn');

const aiSettingsBtn = document.getElementById('aiSettingsBtn');
const aiEngineIcon = document.getElementById('aiEngineIcon');
const aiEngineLabel = document.getElementById('aiEngineLabel');

// AI Modal Elements
const aiModal = document.getElementById('aiModal');
const closeAiModalBtn = document.getElementById('closeAiModalBtn');
const cancelAiModalBtn = document.getElementById('cancelAiModalBtn');
const saveAiSettingsBtn = document.getElementById('saveAiSettingsBtn');
const testConnectionBtn = document.getElementById('testConnectionBtn');
const aiProviderSelect = document.getElementById('aiProviderSelect');
const apiKeyGroup = document.getElementById('apiKeyGroup');
const aiApiKeyInput = document.getElementById('aiApiKeyInput');
const modelGroup = document.getElementById('modelGroup');
const aiModelInput = document.getElementById('aiModelInput');
const baseUrlGroup = document.getElementById('baseUrlGroup');
const aiBaseUrlInput = document.getElementById('aiBaseUrlInput');
const testConnectionStatus = document.getElementById('testConnectionStatus');

// Jira Modal Elements
const jiraModal = document.getElementById('jiraModal');
const closeJiraModalBtn = document.getElementById('closeJiraModalBtn');
const jiraMarkupText = document.getElementById('jiraMarkupText');
const copyJiraModalBtn = document.getElementById('copyJiraModalBtn');
const downloadJiraBtn = document.getElementById('downloadJiraBtn');
const syncJiraBtn = document.getElementById('syncJiraBtn');
const syncNotionBtn = document.getElementById('syncNotionBtn');

// Form Input Elements
const businessUnitInput = document.getElementById('businessUnit');
const featureNameInput = document.getElementById('featureName');
const epicIdInput = document.getElementById('epicId');
const personaChipsContainer = document.getElementById('personaChipsContainer');
const problemStatementInput = document.getElementById('problemStatement');

const qaContainer = document.getElementById('qaContainer');
const generateBtn = document.getElementById('generateBtn');
const timelineStatusBox = document.getElementById('timelineStatusBox');

const prdEmptyState = document.getElementById('prdEmptyState');
const prdRenderedView = document.getElementById('prdRenderedView');
const prdRawEditor = document.getElementById('prdRawEditor');
const prdQuickJumpBar = document.getElementById('prdQuickJumpBar');
const editToggleBtn = document.getElementById('editToggleBtn');
const copyPrdBtn = document.getElementById('copyPrdBtn');
const downloadPrdBtn = document.getElementById('downloadPrdBtn');

const auditContainer = document.getElementById('auditContainer');
const wireframeContainer = document.getElementById('wireframeContainer');
const telemetryContainer = document.getElementById('telemetryContainer');

// Playground Elements
const playgroundModelSelect = document.getElementById('playgroundModelSelect');
const playgroundStyleSelect = document.getElementById('playgroundStyleSelect');
const playgroundTempSlider = document.getElementById('playgroundTempSlider');
const tempVal = document.getElementById('tempVal');
const playgroundCustomPrompt = document.getElementById('playgroundCustomPrompt');
const loadFeatureContextBtn = document.getElementById('loadFeatureContextBtn');
const runPlaygroundBtn = document.getElementById('runPlaygroundBtn');
const playgroundMetricsBar = document.getElementById('playgroundMetricsBar');
const metricModelName = document.getElementById('metricModelName');
const metricStyleName = document.getElementById('metricStyleName');
const metricLatency = document.getElementById('metricLatency');
const metricTokens = document.getElementById('metricTokens');
const copyPlaygroundBtn = document.getElementById('copyPlaygroundBtn');
const playgroundOutput = document.getElementById('playgroundOutput');

// Grounding Status Elements
const groundingStatusTitle = document.getElementById('groundingStatusTitle');
const appToast = document.getElementById('appToast');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateAIEngineBadge();
  initCleanWorkspace();
});

function initCleanWorkspace() {
  // Clean initial state without auto-generating noisy walls of text
  templateSelect.value = 'custom';
  businessUnitInput.value = '';
  featureNameInput.value = '';
  epicIdInput.value = '';
  problemStatementInput.value = '';
  
  updateInputsFromDOM();
  refreshQAQuestions();
  updateGroundingTab();

  // Show inviting empty state initially
  prdEmptyState.style.display = 'block';
  prdRenderedView.style.display = 'none';
  prdRawEditor.style.display = 'none';
  prdQuickJumpBar.style.display = 'none';
}

function setupEventListeners() {
  // Theme Toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // AI Settings Modal
  aiSettingsBtn.addEventListener('click', openAIModal);
  closeAiModalBtn.addEventListener('click', closeAIModal);
  cancelAiModalBtn.addEventListener('click', closeAIModal);
  saveAiSettingsBtn.addEventListener('click', handleSaveAISettings);
  testConnectionBtn.addEventListener('click', handleTestAIConnection);
  aiProviderSelect.addEventListener('change', updateAIModalFields);

  // Jira Modal
  syncJiraBtn.addEventListener('click', openJiraModal);
  closeJiraModalBtn.addEventListener('click', () => { jiraModal.style.display = 'none'; });
  copyJiraModalBtn.addEventListener('click', handleCopyJiraModal);
  downloadJiraBtn.addEventListener('click', handleDownloadJira);

  // Notion Sync
  syncNotionBtn.addEventListener('click', handleSyncNotion);

  // Quick Inspiration Pills
  document.querySelectorAll('.quick-idea-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const tplKey = e.target.dataset.tpl;
      templateSelect.value = tplKey;
      loadTemplate(tplKey, true);
      showToast(`Loaded ${e.target.innerText} archetype!`);
    });
  });

  // Empty State Action Boxes
  const emptyActionDraft = document.getElementById('emptyActionDraft');
  const emptyActionArchetype = document.getElementById('emptyActionArchetype');
  const emptyActionPlayground = document.getElementById('emptyActionPlayground');

  if (emptyActionDraft) {
    emptyActionDraft.addEventListener('click', () => {
      featureNameInput.focus();
      showToast('Type your feature idea and click Draft 12-Phase PRD!');
    });
  }

  if (emptyActionArchetype) {
    emptyActionArchetype.addEventListener('click', () => {
      templateSelect.value = 'fintech_fraud';
      loadTemplate('fintech_fraud', true);
      showToast('Loaded Fintech Fraud Shield archetype!');
    });
  }

  if (emptyActionPlayground) {
    emptyActionPlayground.addEventListener('click', () => {
      switchPreviewTab('playground');
    });
  }

  // Template Dropdown
  templateSelect.addEventListener('change', (e) => {
    const isCustom = e.target.value === 'custom';
    loadTemplate(e.target.value, !isCustom);
  });

  // Reset Button
  resetBtn.addEventListener('click', () => {
    initCleanWorkspace();
    showToast('Clean canvas reset.');
  });

  // Left Panel Tabs
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      const targetTab = e.target.dataset.tab;
      document.getElementById('tabContentSetup').style.display = targetTab === 'setup' ? 'flex' : 'none';
      document.getElementById('tabContentQA').style.display = targetTab === 'qa' ? 'flex' : 'none';
      document.getElementById('tabContentGrounding').style.display = targetTab === 'grounding' ? 'flex' : 'none';

      if (targetTab === 'qa') {
        refreshQAQuestions();
      }
      if (targetTab === 'grounding') {
        updateGroundingTab();
      }
    });
  });

  // Right Panel Tabs
  document.querySelectorAll('.preview-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      switchPreviewTab(e.target.dataset.tab);
    });
  });

  // Quick Jump Navigation Pills
  document.querySelectorAll('.jump-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const targetPhase = e.target.dataset.target;
      const phaseNum = targetPhase.replace('phase-', '');
      const headings = prdRenderedView.querySelectorAll('h3');
      for (const h of headings) {
        if (h.innerText.includes(`PHASE ${phaseNum}:`)) {
          h.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
      }
    });
  });

  // Persona Chips Select
  personaChipsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('persona-chip')) {
      e.target.classList.toggle('selected');
      updateInputsFromDOM();
    }
  });

  // Form Input Change Listeners
  [businessUnitInput, featureNameInput, epicIdInput, problemStatementInput].forEach(elem => {
    elem.addEventListener('input', () => {
      updateInputsFromDOM();
      updateGroundingTab();
    });
  });

  // Real-Time Sync on Raw Editor typing
  prdRawEditor.addEventListener('input', (e) => {
    currentPRDMarkdown = e.target.value;
  });

  // Generate Button
  generateBtn.addEventListener('click', runPRDGenerationPipeline);

  // Raw MD Editor Toggle
  editToggleBtn.addEventListener('click', () => {
    if (!currentPRDMarkdown) {
      showToast('Draft a PRD first to edit raw markdown.');
      return;
    }

    isEditRawMode = !isEditRawMode;
    if (isEditRawMode) {
      prdRawEditor.value = currentPRDMarkdown;
      prdRenderedView.style.display = 'none';
      prdRawEditor.style.display = 'block';
      editToggleBtn.innerText = 'View Rendered';
    } else {
      currentPRDMarkdown = prdRawEditor.value;
      prdRenderedView.innerHTML = marked.parse(currentPRDMarkdown);
      prdRawEditor.style.display = 'none';
      prdRenderedView.style.display = 'block';
      editToggleBtn.innerText = 'Edit Raw MD';
    }
  });

  // Copy PRD
  copyPrdBtn.addEventListener('click', () => {
    if (!currentPRDMarkdown) {
      showToast('Draft a PRD first to copy.');
      return;
    }
    copyToClipboard(currentPRDMarkdown).then(() => {
      showToast('Markdown copied to clipboard! ✓');
    });
  });

  // Download PRD
  downloadPrdBtn.addEventListener('click', () => {
    if (!currentPRDMarkdown) {
      showToast('Draft a PRD first to download.');
      return;
    }
    const filename = `${(currentInputs.featureName || 'prd').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_prd.md`;
    downloadMarkdown(filename, currentPRDMarkdown);
    triggerConfetti();
    showToast('Downloaded PRD Markdown file!');
  });

  // Playground Listeners
  if (playgroundTempSlider && tempVal) {
    playgroundTempSlider.addEventListener('input', (e) => {
      tempVal.innerText = e.target.value;
    });
  }

  if (loadFeatureContextBtn) {
    loadFeatureContextBtn.addEventListener('click', () => {
      updateInputsFromDOM();
      const feature = currentInputs.featureName || 'My Feature';
      const bu = currentInputs.businessUnit || 'Core Product';
      const problem = currentInputs.problemStatement || 'User friction in manual workflows.';
      playgroundCustomPrompt.value = `Feature: "${feature}"\nDomain: "${bu}"\nProblem: "${problem}"\nWrite a technical specification exploring trade-offs, architecture, and edge cases.`;
      showToast('Active feature context loaded into playground prompt!');
    });
  }

  if (runPlaygroundBtn) {
    runPlaygroundBtn.addEventListener('click', handleRunPlayground);
  }

  if (copyPlaygroundBtn) {
    copyPlaygroundBtn.addEventListener('click', () => {
      if (!playgroundOutputText) return;
      copyToClipboard(playgroundOutputText).then(() => {
        showToast('Playground output copied to clipboard! ✓');
      });
    });
  }
}

function switchPreviewTab(targetView) {
  document.querySelectorAll('.preview-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === targetView);
  });

  document.getElementById('viewPRD').style.display = targetView === 'prd' ? 'block' : 'none';
  document.getElementById('viewAudit').style.display = targetView === 'audit' ? 'block' : 'none';
  document.getElementById('viewWireframe').style.display = targetView === 'wireframe' ? 'block' : 'none';
  document.getElementById('viewTelemetry').style.display = targetView === 'telemetry' ? 'block' : 'none';
  document.getElementById('viewPlayground').style.display = targetView === 'playground' ? 'block' : 'none';

  prdQuickJumpBar.style.display = (targetView === 'prd' && currentPRDMarkdown) ? 'flex' : 'none';
}

// Toast Helper
function showToast(message, duration = 3000) {
  if (!appToast) return;
  appToast.innerText = message;
  appToast.classList.add('show');
  clearTimeout(appToast._timer);
  appToast._timer = setTimeout(() => {
    appToast.classList.remove('show');
  }, duration);
}

// Notion & Jira Handlers
function handleSyncNotion() {
  if (!currentPRDMarkdown) {
    showToast('Draft a PRD first before syncing to Notion.');
    return;
  }

  const notionMarkdown = convertToNotionBlocks(currentPRDMarkdown, currentInputs);
  copyToClipboard(notionMarkdown).then(() => {
    triggerConfetti();
    showToast('📑 Notion-ready blocks copied! Paste directly into any Notion page.');
  });
}

function openJiraModal() {
  if (!currentPRDMarkdown) {
    showToast('Draft a PRD first before exporting to Jira.');
    return;
  }

  const jiraMarkup = convertToJiraMarkup(currentPRDMarkdown);
  jiraMarkupText.value = jiraMarkup;
  jiraModal.style.display = 'flex';
}

function handleCopyJiraModal() {
  const text = jiraMarkupText.value;
  copyToClipboard(text).then(() => {
    triggerConfetti();
    showToast('🔷 Jira markup copied to clipboard! Paste into Jira description.');
  });
}

function handleDownloadJira() {
  const text = jiraMarkupText.value;
  const filename = `${(currentInputs.featureName || 'prd').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_jira_spec.txt`;
  downloadMarkdown(filename, text);
  showToast('Downloaded Jira markup file!');
}

// AI Settings & Modal Management
function updateAIEngineBadge() {
  const settings = getAISettings();
  if (settings.provider === 'gemini') {
    aiEngineIcon.innerText = '✨';
    aiEngineLabel.innerText = `Gemini (${settings.model || 'flash'})`;
  } else if (settings.provider === 'openai' || settings.provider === 'custom') {
    aiEngineIcon.innerText = '🤖';
    aiEngineLabel.innerText = `${settings.provider === 'custom' ? 'Custom' : 'OpenAI'} (${settings.model || 'gpt'})`;
  } else {
    aiEngineIcon.innerText = '⚡';
    aiEngineLabel.innerText = 'Engine: Built-in';
  }
}

function openAIModal() {
  const settings = getAISettings();
  aiProviderSelect.value = settings.provider || 'builtin';
  aiApiKeyInput.value = settings.apiKey || '';
  aiModelInput.value = settings.model || '';
  aiBaseUrlInput.value = settings.baseUrl || '';
  testConnectionStatus.style.display = 'none';

  updateAIModalFields();
  aiModal.style.display = 'flex';
}

function closeAIModal() {
  aiModal.style.display = 'none';
}

function updateAIModalFields() {
  const provider = aiProviderSelect.value;
  if (provider === 'builtin') {
    apiKeyGroup.style.display = 'none';
    modelGroup.style.display = 'none';
    baseUrlGroup.style.display = 'none';
  } else if (provider === 'gemini') {
    apiKeyGroup.style.display = 'block';
    modelGroup.style.display = 'block';
    baseUrlGroup.style.display = 'none';
    if (!aiModelInput.value) aiModelInput.value = 'gemini-2.0-flash';
  } else {
    apiKeyGroup.style.display = 'block';
    modelGroup.style.display = 'block';
    baseUrlGroup.style.display = 'block';
    if (!aiModelInput.value) aiModelInput.value = 'gpt-4o-mini';
  }
}

async function handleTestAIConnection() {
  testConnectionBtn.disabled = true;
  testConnectionStatus.style.display = 'block';
  testConnectionStatus.style.color = 'var(--color-muted)';
  testConnectionStatus.innerText = 'Testing connection...';

  const settings = {
    provider: aiProviderSelect.value,
    apiKey: aiApiKeyInput.value.trim(),
    model: aiModelInput.value.trim(),
    baseUrl: aiBaseUrlInput.value.trim()
  };

  const res = await testAIConnection(settings);
  testConnectionBtn.disabled = false;
  testConnectionStatus.style.color = res.ok ? 'var(--color-success)' : 'var(--color-error)';
  testConnectionStatus.innerText = res.message;
}

function handleSaveAISettings() {
  const settings = {
    provider: aiProviderSelect.value,
    apiKey: aiApiKeyInput.value.trim(),
    model: aiModelInput.value.trim(),
    baseUrl: aiBaseUrlInput.value.trim()
  };

  saveAISettings(settings);
  updateAIEngineBadge();
  closeAIModal();
  triggerConfetti();
  showToast(`Saved AI settings (${settings.provider})!`);
}

// Load Preset Archetype Template
function loadTemplate(templateKey, autoGenerate = false) {
  const tpl = TEMPLATES[templateKey];

  if (!tpl) {
    initCleanWorkspace();
    return;
  }

  businessUnitInput.value = tpl.businessUnit;
  featureNameInput.value = tpl.featureName;
  epicIdInput.value = tpl.epicId;
  problemStatementInput.value = tpl.problemStatement;

  document.querySelectorAll('.persona-chip').forEach(c => {
    if (tpl.targetPersonas.includes(c.dataset.persona)) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  updateInputsFromDOM();

  currentQA = tpl.qAndA;
  currentQAAnswers = {};
  tpl.qAndA.forEach(item => {
    currentQAAnswers[item.id] = item.answer;
  });

  renderQACards();
  updateGroundingTab();

  if (autoGenerate) {
    runPRDGenerationPipeline();
  }
}

function updateInputsFromDOM() {
  const selectedPersonas = Array.from(document.querySelectorAll('.persona-chip.selected'))
    .map(c => c.dataset.persona);

  currentInputs = {
    businessUnit: businessUnitInput.value,
    featureName: featureNameInput.value,
    epicId: epicIdInput.value,
    targetPersonas: selectedPersonas,
    problemStatement: problemStatementInput.value
  };
}

function updateGroundingTab() {
  const domain = detectDomain(currentInputs);
  const domainNames = {
    fintech: "Fintech & Payments Ledger",
    healthcare: "Digital Health & EHR FHIR Systems",
    ecommerce: "E-Commerce Funnel & Cart Store",
    devtools: "Distributed Tracing & Cloud APM",
    ai_agent: "Agentic Knowledge Vector Store",
    b2b_saas: "Enterprise Multi-Tenant SaaS DB",
    support_ops: "Service Desk Workflow DB",
    general_saas: "Core Product Telemetry DB"
  };

  if (groundingStatusTitle) {
    groundingStatusTitle.innerText = `Domain Telemetry: ${domainNames[domain] || 'Active DB'}`;
  }
}

// Q&A Discovery Management
function refreshQAQuestions() {
  if (!currentQA || currentQA.length === 0 || templateSelect.value === 'custom') {
    currentQA = generateClarifyingQuestions(currentInputs);
    currentQAAnswers = {};
    currentQA.forEach(q => {
      currentQAAnswers[q.id] = q.answer;
    });
  }
  renderQACards();
}

function renderQACards() {
  qaContainer.innerHTML = '';
  currentQA.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'qa-card';

    const suggestionsHtml = item.suggestions.map(s => 
      `<span class="suggestion-chip" data-qid="${item.id}" data-val="${s}">${s}</span>`
    ).join('');

    card.innerHTML = `
      <div class="qa-question">Q${index + 1}: ${item.question}</div>
      <input type="text" class="form-input qa-answer-input" data-qid="${item.id}" value="${currentQAAnswers[item.id] || item.answer}" />
      <div class="qa-suggestion-chips">
        <span style="font-size:11px; color:var(--color-muted); align-self:center;">Quick Fill:</span>
        ${suggestionsHtml}
      </div>
    `;
    qaContainer.appendChild(card);
  });

  qaContainer.querySelectorAll('.qa-answer-input').forEach(inp => {
    inp.addEventListener('input', (e) => {
      currentQAAnswers[e.target.dataset.qid] = e.target.value;
    });
  });

  qaContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const qid = e.target.dataset.qid;
      const val = e.target.dataset.val;
      const inputElem = qaContainer.querySelector(`.qa-answer-input[data-qid="${qid}"]`);
      if (inputElem) {
        inputElem.value = val;
        currentQAAnswers[qid] = val;
      }
    });
  });
}

// 12-Phase PRD Generation Pipeline
async function runPRDGenerationPipeline() {
  updateInputsFromDOM();

  // If user clicks draft on completely empty fields, provide gentle defaults
  if (!currentInputs.featureName && !currentInputs.problemStatement) {
    currentInputs.featureName = "Intelligent User Workflow";
    currentInputs.businessUnit = "Core Platform";
    currentInputs.problemStatement = "Users experience critical operational friction, high latency, and workflow drop-offs due to legacy manual processes.";
    featureNameInput.value = currentInputs.featureName;
    businessUnitInput.value = currentInputs.businessUnit;
    problemStatementInput.value = currentInputs.problemStatement;
  }

  generateBtn.disabled = true;

  try {
    const prdText = await generatePRD(currentInputs, currentQAAnswers, (pill, text) => {
      const pillClasses = {
        'THINKING': 'pill-thinking',
        'GREPPING': 'pill-grep',
        'READING': 'pill-read',
        'READ': 'pill-read',
        'EDITING': 'pill-edit',
        'DONE': 'pill-done'
      };

      timelineStatusBox.innerHTML = `
        <span class="timeline-pill ${pillClasses[pill] || 'pill-done'}">${pill}</span>
        <span style="font-size:11px; font-family:var(--font-code);">${text}</span>
      `;
    });

    currentPRDMarkdown = prdText;
    currentAudit = runCPOAudit(currentPRDMarkdown, currentInputs);
    currentWireframeData = getWireframeSpec(currentInputs);
    const telemetryData = getTelemetryData(currentInputs);

    // Hide empty state and reveal rendered view
    prdEmptyState.style.display = 'none';
    prdRenderedView.style.display = 'block';
    prdRawEditor.style.display = 'none';
    prdQuickJumpBar.style.display = 'flex';

    prdRenderedView.innerHTML = marked.parse(currentPRDMarkdown);
    prdRawEditor.value = currentPRDMarkdown;

    renderCPOAuditDashboard(currentAudit);
    renderWireframeView(currentWireframeData);
    renderTelemetryView(telemetryData);
    updateGroundingTab();
    triggerConfetti();
    showToast('12-Phase PRD drafted successfully!');
  } catch (err) {
    console.error('PRD generation error:', err);
    timelineStatusBox.innerHTML = `
      <span class="timeline-pill pill-thinking" style="background:var(--color-error); color:#fff;">ERROR</span>
      <span style="font-size:11px; font-family:var(--font-code);">${err.message}</span>
    `;
    showToast(`Generation error: ${err.message}`);
  } finally {
    generateBtn.disabled = false;
  }
}

// Playground Execution Runner
async function handleRunPlayground() {
  updateInputsFromDOM();
  runPlaygroundBtn.disabled = true;
  runPlaygroundBtn.innerText = '⚡ Running...';
  playgroundOutput.innerHTML = `<div style="text-align:center; padding:30px; color:var(--color-muted);">Querying model and synthesizing framework style...</div>`;

  const modelId = playgroundModelSelect.value;
  const styleId = playgroundStyleSelect.value;
  const temperature = parseFloat(playgroundTempSlider.value);
  const customPrompt = playgroundCustomPrompt.value;

  try {
    const res = await runPlaygroundGeneration({
      modelId,
      styleId,
      temperature,
      inputs: currentInputs,
      customPrompt
    });

    playgroundOutputText = res.output;
    metricModelName.innerText = res.modelName;
    metricStyleName.innerText = res.styleName;
    metricLatency.innerText = `${res.durationMs}ms`;
    metricTokens.innerText = `~${res.estimatedTokens.toLocaleString()}`;
    playgroundMetricsBar.style.display = 'flex';

    playgroundOutput.innerHTML = marked.parse(res.output);
    triggerConfetti();
    showToast(`Benchmarked ${res.modelName} in ${res.durationMs}ms!`);
  } catch (err) {
    playgroundOutput.innerHTML = `<div style="color:var(--color-error); padding:20px;">Playground error: ${err.message}</div>`;
    showToast(`Playground error: ${err.message}`);
  } finally {
    runPlaygroundBtn.disabled = false;
    runPlaygroundBtn.innerText = '🚀 Run Model Test';
  }
}

// Render CPO Strategic Audit Dashboard
function renderCPOAuditDashboard(audit) {
  const dimensionsHtml = audit.dimensions.map(d => `
    <div class="cpo-metric-card">
      <div class="metric-header">
        <span>${d.name}</span>
        <span style="color:var(--color-primary); font-weight:700;">${d.score}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width:${d.score}%;"></div>
      </div>
      <div style="font-size:11px; color:var(--color-muted); font-weight:500; text-align:right;">Status: ${d.status}</div>
    </div>
  `).join('');

  const strengthsHtml = audit.strengths.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('');
  const blindSpotsHtml = audit.blindSpots.map(b => `<li style="margin-bottom:6px; color:var(--color-error);">${b}</li>`).join('');

  const recsHtml = audit.cpoRecommendations.map(r => `
    <div style="background:var(--color-surface-card); border:1px solid var(--color-hairline); border-radius:var(--radius-md); padding:14px; display:flex; justify-content:space-between; align-items:center; gap:16px;">
      <div>
        <div style="font-weight:600; font-size:13px;">${r.title}</div>
        <div style="font-size:12px; color:var(--color-body);">${r.description}</div>
      </div>
      <button class="btn btn-primary btn-sm apply-rec-btn" data-recid="${r.id}">1-Click Apply</button>
    </div>
  `).join('');

  auditContainer.innerHTML = `
    <div class="cpo-score-banner">
      <div class="grade-box">
        <div class="grade-badge">${audit.grade}</div>
        <div>
          <div style="font-size:18px; font-weight:700;">CPO Strategic Executive Audit</div>
          <div style="font-size:13px; color:var(--color-body);">${audit.executiveSummary}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--color-muted);">Audit Score</div>
        <div class="score-num">${audit.score}/100</div>
      </div>
    </div>

    <div style="font-weight:700; font-size:15px; margin-top:8px;">Strategic Audit Dimensions (Radar & Telemetry)</div>
    <div class="cpo-metrics-grid">
      ${dimensionsHtml}
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:12px;">
      <div style="background:var(--color-canvas-soft); border:1px solid var(--color-hairline); border-radius:var(--radius-lg); padding:18px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:var(--color-success);">Key PRD Strengths</div>
        <ul style="padding-left:18px; font-size:13px; color:var(--color-body);">${strengthsHtml}</ul>
      </div>

      <div style="background:var(--color-canvas-soft); border:1px solid var(--color-hairline); border-radius:var(--radius-lg); padding:18px;">
        <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:var(--color-error);">Blind Spots & Risks Identified</div>
        <ul style="padding-left:18px; font-size:13px;">${blindSpotsHtml}</ul>
      </div>
    </div>

    <div style="margin-top:16px;">
      <div style="font-weight:700; font-size:15px; margin-bottom:12px;">CPO Executive Action Recommendations</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${recsHtml}
      </div>
    </div>
  `;

  // Attach Apply Rec Handlers
  auditContainer.querySelectorAll('.apply-rec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerText = 'Applied ✓';
      btn.disabled = true;
      btn.style.backgroundColor = 'var(--color-success)';

      const recId = btn.dataset.recid;
      const rec = audit.cpoRecommendations.find(r => r.id === recId);
      if (rec) {
        currentPRDMarkdown += `\n\n> **[CPO Strategic Amendment Applied]:** ${rec.title} — ${rec.description}\n`;
        prdRenderedView.innerHTML = marked.parse(currentPRDMarkdown);
        prdRawEditor.value = currentPRDMarkdown;
        
        // Re-evaluate CPO Audit
        currentAudit = runCPOAudit(currentPRDMarkdown, currentInputs);
        renderCPOAuditDashboard(currentAudit);
        triggerConfetti();
        showToast(`Applied: ${rec.title}`);
      }
    });
  });
}

// Render Domain-Specific Interactive Visual Wireframe Canvas
function renderWireframeView(wireframeData) {
  const mock = wireframeData.interactiveMock;
  const specsHtml = wireframeData.componentSpecs.map(c => `
    <tr>
      <td style="font-weight:600; font-family:var(--font-code); font-size:12px;">${c.name}</td>
      <td>${c.type}</td>
      <td style="font-family:var(--font-code); font-size:11px;">${JSON.stringify(c.props)}</td>
      <td style="font-size:12px;">${c.state}</td>
    </tr>
  `).join('');

  wireframeContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:18px; font-weight:700;">${wireframeData.title}</div>
        <div style="font-size:13px; color:var(--color-body);">${wireframeData.subtitle}</div>
      </div>
      <button id="exportFigmaBtn" class="btn btn-secondary btn-sm">📦 Export Figma Make Spec (JSON)</button>
    </div>

    <!-- Live Interactive Wireframe Preview Canvas -->
    <div class="wireframe-canvas-box">
      <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--color-muted); margin-bottom:12px;">
        Interactive UI Prototype Simulation
      </div>

      <div class="mock-ui-triage-card">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--color-hairline); padding-bottom:12px;">
          <div>
            <span style="font-weight:700; font-size:15px;">${mock.headerTitle}</span>
          </div>
          <span id="aiConfBadge" class="timeline-pill pill-grep" style="background:${mock.badgeBg}; color:${mock.badgeColor}; font-weight:600;">
            ${mock.badgeText}
          </span>
        </div>

        <div style="background:${mock.alertBg}; border:1px solid ${mock.alertBorder}; border-radius:var(--radius-md); padding:10px 14px; color:${mock.alertColor}; font-weight:600; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
          <span>${mock.alertText}</span>
        </div>

        <div style="font-size:13px; color:var(--color-body); line-height:1.5;">
          ${mock.bodyText}
        </div>

        <div style="background:var(--color-canvas-soft); border:1px solid var(--color-hairline); border-radius:var(--radius-md); padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:12px;">
            <strong style="color:var(--color-ink);">Workflow Action:</strong> Ready for execution
          </div>
          <div style="display:flex; gap:8px;">
            <button id="mockPrimaryActionBtn" class="btn btn-primary btn-sm">${mock.primaryActionText}</button>
            <button id="mockSecondaryActionBtn" class="btn btn-outline btn-sm">${mock.secondaryActionText}</button>
          </div>
        </div>

        <div style="margin-top:8px; border-top:1px dashed var(--color-hairline); padding-top:14px;">
          <div style="font-weight:600; font-size:13px; margin-bottom:6px;">${mock.sliderLabel}</div>
          <div style="display:flex; align-items:center; gap:16px;">
            <input type="range" min="${mock.sliderMin}" max="${mock.sliderMax}" value="${mock.sliderDefault}" id="wireframeSlider" style="flex:1; cursor:pointer;" />
            <span id="sliderVal" style="font-weight:700; font-family:var(--font-code); font-size:13px; color:var(--color-primary); min-width:90px; text-align:right;">
              ${mock.sliderDefault} ${mock.sliderUnit}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top:16px;">
      <div style="font-weight:700; font-size:15px; margin-bottom:10px;">Design System UI Component Specs</div>
      <table style="width:100%; border-collapse:collapse; background:var(--color-surface-card); font-size:13px;">
        <thead>
          <tr style="background:var(--color-canvas-soft); text-align:left;">
            <th style="padding:10px; border:1px solid var(--color-hairline);">Component Name</th>
            <th style="padding:10px; border:1px solid var(--color-hairline);">Type</th>
            <th style="padding:10px; border:1px solid var(--color-hairline);">Props Schema</th>
            <th style="padding:10px; border:1px solid var(--color-hairline);">State Behavior</th>
          </tr>
        </thead>
        <tbody>
          ${specsHtml}
        </tbody>
      </table>
    </div>
  `;

  // Attach Dynamic Slider Listener with Badge States
  const slider = document.getElementById('wireframeSlider');
  const sliderVal = document.getElementById('sliderVal');
  const badge = document.getElementById('aiConfBadge');
  const primaryBtn = document.getElementById('mockPrimaryActionBtn');
  const secondaryBtn = document.getElementById('mockSecondaryActionBtn');

  if (slider && sliderVal && badge) {
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      sliderVal.innerText = `${val} ${mock.sliderUnit}`;

      if (val >= 85) {
        badge.innerText = `Status: ${val}% (Auto-Approved / Optimal)`;
        badge.style.backgroundColor = '#9fc9a2';
        badge.style.color = '#1a1a1a';
      } else if (val >= 70) {
        badge.innerText = `Status: ${val}% (Requires 1-Click Confirmation)`;
        badge.style.backgroundColor = '#dfa88f';
        badge.style.color = '#1a1a1a';
      } else {
        badge.innerText = `Status: ${val}% (Escalated to Manual Lead)`;
        badge.style.backgroundColor = '#cf2d56';
        badge.style.color = '#ffffff';
      }
    });
  }

  if (primaryBtn) {
    primaryBtn.addEventListener('click', () => {
      primaryBtn.innerText = 'Executed ✓';
      primaryBtn.style.backgroundColor = 'var(--color-success)';
      triggerConfetti();
      setTimeout(() => {
        primaryBtn.innerText = mock.primaryActionText;
        primaryBtn.style.backgroundColor = '';
      }, 2500);
    });
  }

  if (secondaryBtn) {
    secondaryBtn.addEventListener('click', () => {
      const orig = secondaryBtn.innerText;
      secondaryBtn.innerText = 'Triggered!';
      setTimeout(() => { secondaryBtn.innerText = orig; }, 1800);
    });
  }

  // Export Figma JSON
  document.getElementById('exportFigmaBtn').addEventListener('click', () => {
    downloadJson(`${(currentInputs.featureName || 'prd').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_figma_spec.json`, wireframeData.figmaSpecJson);
    triggerConfetti();
  });
}

// Render Grounding Telemetry View
function renderTelemetryView(telemetryData) {
  const sqlHtml = telemetryData.sqlQueries.map(q => `
    <div style="background:var(--color-surface-card); border:1px solid var(--color-hairline); border-radius:var(--radius-lg); padding:16px; margin-bottom:16px;">
      <div style="font-weight:700; font-size:14px; margin-bottom:8px;">${q.title}</div>
      <pre style="background:var(--color-canvas-soft); border:1px solid var(--color-hairline); border-radius:var(--radius-md); padding:12px; font-family:var(--font-code); font-size:12px; overflow-x:auto; margin-bottom:12px;"><code>${q.sql}</code></pre>
      
      <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
        <thead>
          <tr style="background:var(--color-canvas-soft);">
            ${Object.keys(q.results[0]).map(k => `<th style="border:1px solid var(--color-hairline); padding:6px 10px;">${k}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${q.results.map(row => `
            <tr>
              ${Object.values(row).map(v => `<td style="border:1px solid var(--color-hairline); padding:6px 10px;">${v}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const regionalHtml = telemetryData.regionalStats.map(r => `
    <tr>
      <td style="font-weight:600; padding:8px 10px; border:1px solid var(--color-hairline);">${r.region}</td>
      <td style="padding:8px 10px; border:1px solid var(--color-hairline);">${r.usageShare}</td>
      <td style="padding:8px 10px; border:1px solid var(--color-hairline); font-family:var(--font-code);">${r.avgLatency}</td>
      <td style="padding:8px 10px; border:1px solid var(--color-hairline);">${r.slaCompliance}</td>
      <td style="padding:8px 10px; border:1px solid var(--color-hairline); font-size:12px; color:var(--color-muted);">${r.dataQuality}</td>
    </tr>
  `).join('');

  const quotesHtml = telemetryData.customerQuotes.map(cq => `
    <div style="background:var(--color-canvas-soft); border-left:3px solid var(--color-primary); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-bottom:10px;">
      <div style="font-style:italic; font-size:13px; color:var(--color-ink);">"${cq.quote}"</div>
      <div style="font-size:12px; font-weight:600; color:var(--color-muted); margin-top:4px;">— ${cq.author} (${cq.company})</div>
    </div>
  `).join('');

  telemetryContainer.innerHTML = `
    <div style="font-size:18px; font-weight:700; margin-bottom:4px;">Qualitative & Quantitative Grounding Engine</div>
    <div style="font-size:13px; color:var(--color-body); margin-bottom:20px;">Domain SQL schemas, telemetry benchmarks, regional compliance, and customer evidence.</div>

    <div style="font-weight:700; font-size:15px; margin-bottom:10px;">1. Telemetry SQL Benchmarks (Live DB Schemas)</div>
    ${sqlHtml}

    <div style="font-weight:700; font-size:15px; margin-top:20px; margin-bottom:10px;">2. Regional Telemetry & SLA Compliance Breakdown</div>
    <table style="width:100%; border-collapse:collapse; font-size:13px; background:var(--color-surface-card); margin-bottom:20px;">
      <thead>
        <tr style="background:var(--color-canvas-soft);">
          <th style="padding:8px; border:1px solid var(--color-hairline);">Region</th>
          <th style="padding:8px; border:1px solid var(--color-hairline);">Usage Share</th>
          <th style="padding:8px; border:1px solid var(--color-hairline);">Avg Latency</th>
          <th style="padding:8px; border:1px solid var(--color-hairline);">SLA Compliance</th>
          <th style="padding:8px; border:1px solid var(--color-hairline);">Data Quality / Gaps</th>
        </tr>
      </thead>
      <tbody>
        ${regionalHtml}
      </tbody>
    </table>

    <div style="font-weight:700; font-size:15px; margin-top:20px; margin-bottom:10px;">3. Customer Advisory Board (CAB) Voice-of-Customer Quotes</div>
    ${quotesHtml}
  `;
}

// Theme Toggle Handler
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  themeIcon.innerText = newTheme === 'dark' ? '☀️' : '🌙';
  themeLabel.innerText = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}
