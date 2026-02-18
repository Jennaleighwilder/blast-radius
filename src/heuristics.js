/**
 * blast-radius risk scoring heuristics
 * Deterministic scoring based on file patterns and graph metrics.
 */

const RISKY_PATTERNS = [
  'auth', 'security', 'middleware', 'config', 'db', 'database',
  'session', 'core', 'router', 'server', 'app', 'index', 'main', 'bootstrap',
];

const MANIFEST_PATTERNS = [
  'package.json', 'tsconfig.json', '.env', 'vite.config', 'next.config',
  'webpack', 'babel', 'rollup.config', 'jest.config',
];

const SAFE_ZONES = [
  'components/', 'styles/', 'public/', 'assets/', 'docs/', 'examples/',
];

function normalizePath(p) {
  return p.replace(/\\/g, '/').toLowerCase();
}

/**
 * Compute risk score and reasons
 */
export function computeRiskScore(filePath, metrics, rootPath) {
  const normalized = normalizePath(filePath);
  const relative = normalized.replace(normalizePath(rootPath), '').replace(/^\//, '');
  const fileName = relative.split('/').pop() || '';
  let score = 0;
  const reasons = [];

  // inbound_count weight 3
  const inboundWeight = Math.min(metrics.inboundCount * 3, 15);
  score += inboundWeight;
  if (metrics.inboundCount > 0) {
    reasons.push(`Imported by ${metrics.inboundCount} file(s) directly`);
  }

  // transitive_inbound_count weight 1
  const transitiveWeight = Math.min(metrics.transitiveInboundCount, 10);
  score += transitiveWeight;
  if (metrics.transitiveInboundCount > 0) {
    reasons.push(`Central transit node (${metrics.transitiveInboundCount} transitive within depth)`);
  }

  // risky filename/path patterns +8
  for (const pat of RISKY_PATTERNS) {
    if (fileName.includes(pat) || relative.includes(pat)) {
      score += 8;
      reasons.push(`Touches ${pat} (pattern match)`);
      break;
    }
  }

  // manifest/config +10
  for (const pat of MANIFEST_PATTERNS) {
    if (fileName.includes(pat) || relative.includes(pat) || relative.endsWith(pat)) {
      score += 10;
      reasons.push(`Config/manifest file`);
      break;
    }
  }

  // safe zones -4
  for (const zone of SAFE_ZONES) {
    if (relative.includes(zone)) {
      score -= 4;
      reasons.push(`In safe zone (${zone})`);
      break;
    }
  }

  // tests -6 (only if includeTests; otherwise they're filtered)
  if (/(^|\/)tests?(\/|$)|__tests__|\.(test|spec)\./.test(relative)) {
    score -= 6;
    reasons.push('Test file');
  }

  score = Math.max(0, score);

  let label;
  if (score <= 7) label = 'LOW';
  else if (score <= 16) label = 'MEDIUM';
  else label = 'HIGH';

  return { score, label, reasons };
}

/**
 * Get safe edit zones for the project
 */
export function getSafeZones(rootPath) {
  return SAFE_ZONES;
}
