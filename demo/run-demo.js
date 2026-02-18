#!/usr/bin/env node

/**
 * blast-radius demo runner
 * Downloads sample repos via GitHub archive, runs blast-radius, stores outputs.
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TMP = path.join(__dirname, 'tmp');
const OUTPUT = path.join(__dirname, 'output');

const REPOS = [
  { org: 'expressjs', repo: 'express', branch: 'master', targets: ['lib/express.js', 'lib/response.js'] },
  { org: 'chalk', repo: 'chalk', branch: 'main', targets: ['source/index.js', 'source/util.js'] },
  { org: 'sindresorhus', repo: 'query-string', branch: 'main', targets: ['index.js', 'parse.js'] },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function downloadArchive(org, repo, branch) {
  const url = `https://github.com/${org}/${repo}/archive/refs/heads/${branch}.zip`;
  const res = await fetch(url, { headers: { 'User-Agent': 'blast-radius-demo' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const outPath = path.join(TMP, `${repo}.zip`);
  fs.writeFileSync(outPath, Buffer.from(buf));
  return outPath;
}

function unzip(zipPath, outDir) {
  const result = spawnSync('unzip', ['-q', '-o', zipPath, '-d', outDir], {
    encoding: 'utf8',
    timeout: 30000,
  });
  if (result.status !== 0) throw new Error('unzip failed');
  const entries = fs.readdirSync(outDir);
  const dirName = path.basename(zipPath, '.zip');
  const extracted = entries.find(e => e.startsWith(dirName) && e.includes('-')) || entries[0];
  return path.join(outDir, extracted);
}

function runBlastRadius(cwd, target, depth = 3) {
  const cliPath = path.join(ROOT, 'src', 'cli.js');
  const result = spawnSync('node', [cliPath, target, '--depth', String(depth)], {
    cwd,
    encoding: 'utf8',
    timeout: 60000,
  });
  return { stdout: result.stdout || '', stderr: result.stderr || '', code: result.status };
}

async function main() {
  ensureDir(TMP);
  ensureDir(OUTPUT);

  for (const { org, repo, branch, targets } of REPOS) {
    const workDir = path.join(TMP, repo);
    if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true });
    ensureDir(path.dirname(workDir));

    try {
      console.log(`Downloading ${org}/${repo}...`);
      const zipPath = await downloadArchive(org, repo, branch);
      const extracted = unzip(zipPath, path.dirname(workDir));
      fs.rmSync(zipPath, { force: true });

      for (const target of targets) {
        const targetPath = path.join(extracted, target);
        if (!fs.existsSync(targetPath)) {
          console.warn(`  Target not found: ${target}, skipping`);
          continue;
        }
        const targetSlug = target.replace(/\//g, '__');
        const outSlug = `${repo}__${targetSlug}`;
        const outFile = path.join(OUTPUT, `${outSlug}.txt`);
        console.log(`  Running blast-radius on ${target}...`);
        const { stdout, stderr, code } = runBlastRadius(extracted, target, 3);
        const content = stdout + (stderr ? '\n--- stderr ---\n' + stderr : '');
        fs.writeFileSync(outFile, content, 'utf8');
        console.log(`  Wrote ${path.basename(outFile)} (exit ${code})`);
      }

      fs.rmSync(extracted, { recursive: true, force: true });
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
    }
  }

  // Fallback: if no outputs, run on blast-radius itself
  const outputFiles = fs.existsSync(OUTPUT) ? fs.readdirSync(OUTPUT).filter(f => f.endsWith('.txt')) : [];
  if (outputFiles.length === 0) {
    console.log('No external repos available. Running on blast-radius itself...');
    const selfTargets = ['src/analyze.js', 'src/scanner.js'];
    for (const target of selfTargets) {
      const outFile = path.join(OUTPUT, `blast-radius__${target.replace(/\//g, '__')}.txt`);
      const { stdout, stderr } = runBlastRadius(ROOT, target, 3);
      fs.writeFileSync(outFile, stdout + (stderr ? '\n--- stderr ---\n' + stderr : ''), 'utf8');
      console.log(`  Wrote ${path.basename(outFile)}`);
    }
  }

  console.log('Demo complete.');
}

main();
