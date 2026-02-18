#!/usr/bin/env node

/**
 * blast-radius CLI
 * See the blast radius of a code change before you touch it.
 */

import fs from 'fs';
import path from 'path';
import { analyzeFile, analyzeDirectory } from './analyze.js';
import { formatReport, toJSON } from './format.js';

const HELP = `
blast-radius — See the blast radius of a code change before you touch it.

Usage:
  blast-radius [path] [options]
  npx blast-radius [path] [options]

Arguments:
  path    File or directory to analyze. If omitted, analyzes current directory
          and shows usage.

Options:
  --depth <n>       How many import layers outward (default: 3)
  --json            Output machine-readable JSON
  --output <file>   Write report to file
  --include-tests   Include test files in scan (default: ignore)
  --verbose         Print scan stats

Exit codes:
  0  success
  1  invalid path / no files scanned
  2  scan error
`;

function parseArgs(argv) {
  const args = { path: null, depth: 3, json: false, output: null, includeTests: false, verbose: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--depth' && argv[i + 1] != null) {
      args.depth = parseInt(argv[++i], 10) || 3;
    } else if (a === '--json') {
      args.json = true;
    } else if (a === '--output' && argv[i + 1] != null) {
      args.output = argv[++i];
    } else if (a === '--include-tests') {
      args.includeTests = true;
    } else if (a === '--verbose') {
      args.verbose = true;
    } else if (!a.startsWith('-')) {
      args.path = a;
    }
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  const cwd = process.cwd();

  let targetPath = args.path;
  if (!targetPath) {
    console.log(HELP.trim());
    console.log('\nProvide a file path to analyze, e.g.: blast-radius src/auth.js');
    process.exit(1);
  }

  targetPath = path.resolve(cwd, targetPath);

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const isDir = fs.statSync(targetPath).isDirectory();
  const options = { depth: args.depth, includeTests: args.includeTests };

  let data;
  try {
    if (isDir) {
      data = analyzeDirectory(targetPath, options);
    } else {
      data = analyzeFile(targetPath, options);
    }
  } catch (err) {
    console.error('Scan error:', err.message);
    process.exit(2);
  }

  if (data.error && !data.filesScanned) {
    console.error(`Error: ${data.error}`);
    process.exit(1);
  }

  if (data.error && data.filesScanned === 0) {
    console.error(`Error: ${data.error}`);
    process.exit(1);
  }

  let output;
  if (args.json) {
    output = toJSON(data);
  } else {
    output = formatReport(data);
    if (args.verbose && data.filesScanned != null) {
      output += `\n[verbose] Files scanned: ${data.filesScanned}\n`;
    }
  }

  if (args.output) {
    fs.writeFileSync(args.output, output, 'utf8');
    console.log(`Report written to ${args.output}`);
  } else {
    console.log(output);
  }

  process.exit(0);
}

main();
