# Graph Report - THEPRDBOT  (2026-11-16)

## Corpus Check
- 22 files · ~30,795 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 220 nodes · 348 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb327df4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.js
- setupEventListeners
- 🚀 THE PRD BOT
- playgroundEngine.js
- package.json
- detectDomain
- Website Self-Review Log: THE PRD BOT
- Website Self-Review and Improve (max 5 passes)
- cursor.design.md
- openJiraModal
- templates.js
- AGENTS.md
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `setupEventListeners()` - 25 edges
2. `runPRDGenerationPipeline()` - 15 edges
3. `detectDomain()` - 13 edges
4. `🚀 THE PRD BOT` - 12 edges
5. `showToast()` - 10 edges
6. `triggerConfetti()` - 10 edges
7. `scripts` - 10 edges
8. `generateFullPRD()` - 9 edges
9. `Website Self-Review and Improve (max 5 passes)` - 9 edges
10. `getAISettings()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `runPRDGenerationPipeline()` --calls--> `getAISettings()`  [EXTRACTED]
  src/main.js → src/engine/aiService.js
- `runPRDGenerationPipeline()` --calls--> `generatePRD()`  [EXTRACTED]
  src/main.js → src/engine/aiService.js
- `generateBuiltinWithProgress()` --calls--> `generateFullPRD()`  [EXTRACTED]
  src/engine/aiService.js → src/engine/prdGenerator.js
- `handleRunPlayground()` --calls--> `runPlaygroundGeneration()`  [EXTRACTED]
  src/main.js → src/engine/playgroundEngine.js
- `synthesizePlaygroundStyle()` --calls--> `generateFullPRD()`  [EXTRACTED]
  src/engine/playgroundEngine.js → src/engine/prdGenerator.js

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "main.js"
Cohesion: 0.03
Nodes (72): aiApiKeyInput, aiBaseUrlInput, aiEngineIcon, aiEngineLabel, aiModal, aiModelInput, aiProviderSelect, aiSettingsBtn (+64 more)

### Community 1 - "setupEventListeners"
Cohesion: 0.16
Nodes (27): saveAISettings(), closeAIModal(), handleCopyJiraModal(), handleDownloadJira(), handleRunPlayground(), handleSaveAISettings(), handleSyncNotion(), initCleanWorkspace() (+19 more)

### Community 2 - "🚀 THE PRD BOT"
Cohesion: 0.09
Nodes (21): 1. 🧠 Dual-Engine AI Architecture (BYOK + Offline Precision), 2. 🏛️ The 12-Phase First-Principles PRD Framework, 3. 🧪 Multi-Model & Multi-Framework AI Playground, 4. 🛡️ CPO Strategic Executive Audit Engine, 5. 🎨 Interactive Visual Prototyping & Figma Schema, 👤 Author & Engineering Leadership, Building for Production, 🕸️ Code Knowledge Graph & AI-Assisted Development (Graphify) (+13 more)

### Community 3 - "playgroundEngine.js"
Cohesion: 0.14
Nodes (19): buildMasterPMPrompt(), DEFAULT_AI_BASE_URL, DEFAULT_AI_KEY, DEFAULT_AI_MODEL, DEFAULT_AI_PROVIDER, generateBuiltinWithProgress(), generatePRD(), getAISettings() (+11 more)

### Community 4 - "package.json"
Cohesion: 0.09
Nodes (24): dependencies, canvas-confetti@^1.9.3, lucide@^0.439.0, marked@^14.1.0, devDependencies, vite@^5.4.2, name, private (+16 more)

### Community 5 - "detectDomain"
Cohesion: 0.31
Nodes (8): runCPOAudit(), detectDomain(), generateFullPRD(), getDefaultPersonasForDomain(), getDomainSpecs(), generateClarifyingQuestions(), getTelemetryData(), getWireframeSpec()

### Community 6 - "Website Self-Review Log: THE PRD BOT"
Cohesion: 0.17
Nodes (11): Deficiencies Identified & Solved in Pass 3, Goal Definition (Step 0), Not Working / Deficiencies Identified (Addressed in Pass 2), Pass 1, Pass 2: Transformation to Universal AI Tool for Product Managers, Pass 3: Usability Overhaul, 1-Click Notion/Jira Sync & AI Model Playground, Solutions & Implementation Summary, Summary of What Was Added (+3 more)

### Community 7 - "Website Self-Review and Improve (max 5 passes)"
Cohesion: 0.18
Nodes (10): Common mistakes to avoid, Final report, Hard rule: the pass limit, Severity, Step 0: Understand the goal (once, before pass 1), Step 1: Inspect (see the site as a user would), Step 2: Diagnose (write it down), Step 3: Improve (using good taste) (+2 more)

### Community 9 - "openJiraModal"
Cohesion: 0.50
Nodes (3): openJiraModal(), convertToJiraMarkup(), convertToNotionBlocks()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `marked` connect `package.json` to `main.js`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `setupEventListeners()` (e.g. with `closeAIModal()` and `handleCopyJiraModal()`) actually correct?**
  _`setupEventListeners()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0273972602739726 - nodes in this community are weakly interconnected._
- **Should `🚀 THE PRD BOT` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `playgroundEngine.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08923076923076922 - nodes in this community are weakly interconnected._