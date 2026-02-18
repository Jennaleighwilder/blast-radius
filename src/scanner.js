/**
 * blast-radius scanner
 * Extracts import/require dependencies from JS/TS and Python files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ignore from 'ignore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JS_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
const PY_EXTENSIONS = ['.py'];

const DEFAULT_IGNORE = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.venv',
  '__pycache__',
  '.pytest_cache',
  'demo/tmp',
  'demo/output',
];

// Regex for JS/TS imports
const IMPORT_REGEX = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
const REQUIRE_REGEX = /(?:const|let|var)\s+\w+\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)|require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

// Regex for Python relative imports
const PY_FROM_RELATIVE = /from\s+\.+(?:\.\w+)*\s+import\s+/g;
const PY_FROM_MODULE = /from\s+([\w.]+)\s+import\s+/g;

/**
 * Get ignore filter for project root
 */
function getIgnoreFilter(rootPath) {
  const ig = ignore();
  ig.add(DEFAULT_IGNORE);
  const gitignorePath = path.join(rootPath, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    try {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      ig.add(gitignore);
    } catch (_) {}
  }
  return ig;
}

/**
 * Check if path should be ignored
 */
function shouldIgnore(relativePath, ig, includeTests) {
  if (ig.ignores(relativePath)) return true;
  if (!includeTests && /(^|\/)tests?(\/|$)/.test(relativePath)) return true;
  if (!includeTests && /(^|\/)__tests__(\/|$)/.test(relativePath)) return true;
  if (!includeTests && /\.(test|spec)\.(js|ts|jsx|tsx)$/.test(relativePath)) return true;
  return false;
}

/**
 * Resolve relative import to absolute path
 */
function resolveRelativeImport(fromFile, importPath, rootPath) {
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    return null; // external package
  }
  const fromDir = path.dirname(fromFile);
  let resolved = path.resolve(fromDir, importPath);
  if (!resolved.startsWith(rootPath)) return null;
  if (!path.extname(resolved)) {
    const candidates = [
      ...JS_EXTENSIONS.map(ext => resolved + ext),
      path.join(resolved, 'index.js'),
      path.join(resolved, 'index.ts'),
      path.join(resolved, 'index.jsx'),
      path.join(resolved, 'index.tsx'),
      path.join(resolved, 'index.mjs'),
      path.join(resolved, 'index.cjs'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
    return resolved + '.js'; // best guess
  }
  return fs.existsSync(resolved) ? resolved : null;
}

/**
 * Extract imports from JS/TS file
 */
function extractJsImports(filePath, content, rootPath) {
  const imports = new Set();
  let m;
  const regexes = [IMPORT_REGEX, REQUIRE_REGEX];
  for (const regex of regexes) {
    regex.lastIndex = 0;
    while ((m = regex.exec(content)) !== null) {
      const spec = m[1] || m[2] || m[3];
      if (!spec) continue;
      const resolved = resolveRelativeImport(filePath, spec, rootPath);
      if (resolved) imports.add(resolved);
    }
  }
  return [...imports];
}

/**
 * Extract imports from Python file (best effort)
 */
function extractPyImports(filePath, content, rootPath) {
  const imports = new Set();
  const fromDir = path.dirname(filePath);
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('from .')) {
      const match = trimmed.match(/from\s+(\.+(?:\.\w+)*)\s+import\s+/);
      if (match) {
        const mod = match[1];
        const parts = mod.split('.').filter(Boolean);
        let resolved = fromDir;
        for (const p of parts) {
          if (p === '') continue;
          resolved = path.dirname(resolved);
        }
        const base = path.join(resolved, ...parts.filter(p => p !== ''));
        const candidates = [base + '.py', path.join(base, '__init__.py')];
        for (const c of candidates) {
          if (fs.existsSync(c)) {
            imports.add(c);
            break;
          }
        }
      }
    }
  }
  return [...imports];
}

/**
 * Get all scannable files in directory
 */
function getFilesToScan(rootPath, includeTests) {
  const ig = getIgnoreFilter(rootPath);
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      const rel = path.relative(rootPath, full);
      if (e.isDirectory()) {
        if (!shouldIgnore(rel + '/', ig, includeTests)) walk(full);
      } else {
        const ext = path.extname(e.name);
        if ([...JS_EXTENSIONS, ...PY_EXTENSIONS].includes(ext)) {
          if (!shouldIgnore(rel, ig, includeTests)) files.push(full);
        }
      }
    }
  }
  walk(rootPath);
  return files;
}

/**
 * Scan project and build import graph
 * Returns: { edges: [[from, to], ...], files: Set<string>, rootPath }
 */
export function scanProject(rootPath, options = {}) {
  const { includeTests = false } = options;
  const root = path.resolve(rootPath);
  if (!fs.existsSync(root)) {
    throw new Error(`Path does not exist: ${root}`);
  }
  const isDir = fs.statSync(root).isDirectory();
  const projectRoot = isDir ? root : path.dirname(root);
  const ig = getIgnoreFilter(projectRoot);
  const edges = [];
  const files = new Set();
  const toScan = isDir ? getFilesToScan(projectRoot, includeTests) : [root];
  for (const file of toScan) {
    const rel = path.relative(projectRoot, file);
    if (shouldIgnore(rel, ig, includeTests)) continue;
    files.add(file);
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (_) {
      continue;
    }
    const ext = path.extname(file);
    let imports = [];
    if (JS_EXTENSIONS.includes(ext)) {
      imports = extractJsImports(file, content, projectRoot);
    } else if (PY_EXTENSIONS.includes(ext)) {
      imports = extractPyImports(file, content, projectRoot);
    }
    for (const imp of imports) {
      const norm = path.normalize(imp);
      if (norm.startsWith(projectRoot)) {
        edges.push([file, norm]);
        files.add(norm);
      }
    }
  }
  return { edges, files: [...files], rootPath: projectRoot };
}
