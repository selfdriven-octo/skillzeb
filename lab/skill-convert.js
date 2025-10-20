// generate-skill-from-skillzeb.js
// Plain Node.js (CommonJS) script that converts a Skillzeb template JSON
// into a SKILL.md file. No external packages. Uses https + fs only.
//
// Usage:
//   node generate-skill-from-skillzeb.js \
//        https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/main/templates/json/skillzeb.template.resource.cardano-aiken.json \
//        SKILL.md
//
// If args are omitted, defaults to the Aiken URL and ./SKILL.md

const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const INPUT_URL =
  process.argv[2] ||
  'https://raw.githubusercontent.com/selfdriven-foundation/skillzeb/main/templates/json/skillzeb.template.resource.cardano-aiken.json';
const OUTPUT_PATH = process.argv[3] || path.join(process.cwd(), 'SKILL.md');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow redirect
          return resolve(fetchUrl(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function coalesce() {
  for (let i = 0; i < arguments.length; i++) {
    const v = arguments[i];
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return '';
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[\r\n]+/g, ' ').trim();
}

function yamlEscape(s) {
  // keep it simple; wrap in quotes if contains colon or starting with special chars
  const str = String(s == null ? '' : s);
  if (/[:\-\?\[\]\{\}\n\r#,&*!|>'"%@`]/.test(str)) {
    return JSON.stringify(str);
  }
  return str;
}

function isoDate(dflt) {
  try {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  } catch {
    return dflt || '';
  }
}

function toMarkdown(def) {
  const title = coalesce(def.title, def.name, 'Skill');
  const summary = coalesce(def.summary, def.usage, '');
  const usage = coalesce(def.usage, '');
  const description = coalesce(def.description, '');
  const versionNum = def.version && def.version.number ? def.version.number : '';
  const versionDate = def.version && def.version.date ? def.version.date : '';
  const sourceUrl = def.source && def.source.url ? def.source.url : '';
  const license =
    def.source && def.source.sharing && def.source.sharing.type
      ? def.source.sharing.type
      : def.sharing && def.sharing.type
      ? def.sharing.type
      : '';
  const domains = Array.isArray(def.domains) ? def.domains : [];
  const resources = Array.isArray(def.resources) ? def.resources : [];
  const sharing = def.sharing || {};

  // YAML front matter
  const frontMatter =
    '---\n' +
    `name: ${yamlEscape(title)}\n` +
    `description: ${yamlEscape(esc(coalesce(summary, usage, description)))}\n` +
    (versionNum || versionDate
      ? `version: ${yamlEscape(versionNum + (versionDate ? ' (' + versionDate + ')' : ''))}\n`
      : '') +
    (sourceUrl ? `source: ${yamlEscape(sourceUrl)}\n` : '') +
    (license ? `license: ${yamlEscape(license)}\n` : '') +
    '---\n';

  // Body
  let md = '';

  md += `# ${title}\n\n`;
  if (summary) {
    md += `**TL;DR:** ${esc(summary)}\n\n`;
  }

  if (usage) {
    md += `## Usage\n\n${usage}\n\n`;
  }

  if (description) {
    md += `## Description\n\n${description}\n\n`;
  }

  if (domains.length) {
    md += `## Domains\n\n`;
    domains.forEach((d) => {
      md += `- ${esc(d)}\n`;
    });
    md += `\n`;
  }

  if (resources.length) {
    md += `## Resources\n\n`;
    md += `| Subject | For | URL |\n|---|---|---|\n`;
    resources.forEach((r) => {
      const subject = esc(r.subject || '');
      const forList = Array.isArray(r.for) ? r.for.join(', ') : esc(r.for || '');
      const url = esc(r.url || '');
      md += `| ${subject} | ${forList} | ${url} |\n`;
    });
    md += `\n`;
  }

  // Sharing / Attribution
  const sharingType = sharing.type ? esc(sharing.type) : '';
  const sharingDesc = sharing.description ? esc(sharing.description) : '';
  if (sharingType || sharingDesc || (sharing.resources && sharing.resources.length)) {
    md += `## Sharing & Attribution\n\n`;
    if (sharingType) md += `- **Type:** ${sharingType}\n`;
    if (sharingDesc) md += `- **Description:** ${sharingDesc}\n`;
    if (sharing.resources && sharing.resources.length) {
      md += `- **Assets:**\n`;
      sharing.resources.forEach((x) => {
        const t = esc(x.type || 'resource');
        const u = esc(x.url || x.imageURL || '');
        if (u) md += `  - ${t}: ${u}\n`;
      });
    }
    md += `\n`;
  }

  md += `---\nUpdated: ${isoDate()}\n`;

  return frontMatter + '\n' + md;
}

function parseTemplate(jsonText) {
  let obj;
  try {
    obj = JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }
  if (!obj || !obj.template || !obj.template.definition) {
    throw new Error('Unexpected format: expected { template: { definition: { ... }}}');
  }
  return obj.template.definition;
}

fetchUrl(INPUT_URL)
  .then((raw) => {
    const def = parseTemplate(raw);
    // tolerate common misspellings (e.g., "resournce"); no-op needed here
    const md = toMarkdown(def);
    fs.writeFileSync(OUTPUT_PATH, md, 'utf8');
    console.log('Wrote', OUTPUT_PATH);
  })
  .catch((err) => {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  });