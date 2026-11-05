/**
 * Jira and Notion Exporter & Synchronizer
 * Converts Markdown PRD specifications into native Atlassian Jira markup
 * and Notion-optimized block markdown.
 */

export function convertToJiraMarkup(markdown) {
  if (!markdown) return '';

  let jira = markdown;

  // Convert Code Blocks with language tag
  jira = jira.replace(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const l = lang ? `:${lang}` : '';
    return `{code${l}}\n${code.trim()}\n{code}`;
  });

  // Convert Headings
  jira = jira.replace(/^#### (.*?)$/gm, 'h4. $1');
  jira = jira.replace(/^### (.*?)$/gm, 'h3. $1');
  jira = jira.replace(/^## (.*?)$/gm, 'h2. $1');
  jira = jira.replace(/^# (.*?)$/gm, 'h1. $1');

  // Convert Bold (**text** -> *text*)
  jira = jira.replace(/\*\*(.*?)\*\*/g, '*$1*');

  // Convert Inline Code (`code` -> {{code}})
  jira = jira.replace(/`([^`\n]+)`/g, '{{$1}}');

  // Convert Checkboxes
  jira = jira.replace(/^- \[x\]\s*(.*?)$/gm, '* (/) $1');
  jira = jira.replace(/^- \[ \]\s*(.*?)$/gm, '* (?) $1');

  // Convert Quotes
  jira = jira.replace(/^>\s*(.*?)$/gm, '{quote}\n$1\n{quote}');

  // Convert Tables
  // Jira tables use || for header rows and | for data rows
  const lines = jira.split('\n');
  let inTable = false;
  let isFirstRow = true;

  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Check if it's a separator row like |:---|:---|
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        return null; // delete markdown separator row
      }

      if (!inTable) {
        inTable = true;
        isFirstRow = true;
      }

      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map(c => c.trim());

      if (isFirstRow) {
        isFirstRow = false;
        return `||${cells.join('||')}||`;
      } else {
        return `|${cells.join('|')}|`;
      }
    } else {
      inTable = false;
      return line;
    }
  }).filter(line => line !== null);

  return processedLines.join('\n');
}

export function convertToNotionBlocks(markdown, inputs = {}) {
  if (!markdown) return '';

  const feature = inputs.featureName || "Core Initiative";
  const epic = inputs.epicId || "EPIC-001";

  // Prepend Notion Callout Header
  const notionBanner = `> 🚀 **${feature.toUpperCase()}** — Epic Reference: \`${epic}\`
> *Created with THE PRD BOT • AI-Native Product Lifecycle Engine*

---

`;

  let notion = notionBanner + markdown;

  // Enhance section headers for Notion toggles/callouts
  notion = notion.replace(/^### (PHASE \d+:.*?)$/gm, '## 📌 $1');

  return notion;
}
