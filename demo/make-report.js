#!/usr/bin/env node

/**
 * blast-radius demo report generator
 * Reads demo outputs and generates DEMO.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, 'output');
const DEMO_MD = path.join(__dirname, '..', 'DEMO.md');

const REPO_LINKS = {
  'express': 'https://github.com/expressjs/express',
  'chalk': 'https://github.com/chalk/chalk',
  'query-string': 'https://github.com/sindresorhus/query-string',
  'blast-radius': 'https://github.com/Jennaleighwilder/blast-radius',
};

function main() {
  if (!fs.existsSync(OUTPUT)) {
    fs.writeFileSync(DEMO_MD, '# blast-radius Demo\n\nNo demo outputs yet. Run `npm run demo`.\n', 'utf8');
    return;
  }

  const files = fs.readdirSync(OUTPUT).filter(f => f.endsWith('.txt')).sort();
  const sections = [];

  sections.push('# blast-radius Demo\n');
  sections.push('Live outputs from running blast-radius against real open-source repos.\n');

  for (const file of files) {
    const content = fs.readFileSync(path.join(OUTPUT, file), 'utf8');
    const lines = content.split('\n');
    const first50 = lines.slice(0, 50).join('\n');
    const base = file.replace('.txt', '');
    const [repo, ...targetParts] = base.split('__');
    const targetPath = targetParts.join('__').replace(/__/g, '/');
    const repoLink = REPO_LINKS[repo] || `https://github.com/${repo}`;

    sections.push('---\n');
    sections.push(`## ${repo} — \`${targetPath}\`\n`);
    sections.push(`- **Repo:** [${repo}](${repoLink})\n`);
    sections.push(`- **Target:** \`${targetPath}\`\n`);
    sections.push('**Report (first 50 lines):**\n');
    sections.push('```\n' + first50 + '\n```\n');
    sections.push('**What this shows:**\n');
    sections.push('- Blast radius analysis on a real production codebase\n');
    sections.push('- Risk scoring based on import graph and file patterns\n');
    sections.push('- Direct importers and transitive impact within depth 3\n');
    sections.push('');
  }

  fs.writeFileSync(DEMO_MD, sections.join('\n'), 'utf8');
  console.log('Generated DEMO.md');
}

main();
