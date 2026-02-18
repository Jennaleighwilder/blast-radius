/**
 * blast-radius output formatting
 * Human-readable report and JSON output.
 */

const WIDTH = 58;

function line(char = '━') {
  return char.repeat(WIDTH);
}

/**
 * Format single-file report for human output
 */
export function formatReport(data) {
  if (data.error) {
    return `Error: ${data.error}\nFiles scanned: ${data.filesScanned || 0}`;
  }

  if (data.mode === 'directory') {
    return formatDirectoryReport(data);
  }

  const parts = [];
  parts.push(line());
  parts.push('BLAST-RADIUS REPORT');
  parts.push(line());
  parts.push('');
  parts.push(`TARGET:           ${data.target}`);
  parts.push(`RISK:             ${data.risk} (score ${data.score})`);
  parts.push('');
  parts.push(`DIRECT IMPORTERS: ${data.inboundCount}`);
  parts.push(`TRANSITIVE (≤${data.inboundLayers?.length || 0}):  ${data.transitiveInboundCount}`);
  parts.push('');
  parts.push('WHY THIS IS RISKY:');
  for (const r of data.reasons || []) {
    parts.push(`- ${r}`);
  }
  if ((data.reasons || []).length === 0) {
    parts.push('- (no specific risk factors)');
  }
  parts.push('');
  parts.push(line());
  parts.push('TOP DIRECT IMPORTERS:');
  for (const imp of (data.directImporters || []).slice(0, 8)) {
    parts.push(`  ${imp}`);
  }
  if ((data.directImporters || []).length === 0) {
    parts.push('  (none)');
  }
  parts.push('');
  parts.push(line());
  parts.push('IMPACT PATHS (depth 1–3):');
  for (const layer of data.inboundLayers || []) {
    parts.push(`  depth ${layer.depth}:`);
    for (const f of layer.files.slice(0, 5)) {
      parts.push(`    ${f}`);
    }
    if (layer.files.length > 5) {
      parts.push(`    ... and ${layer.files.length - 5} more`);
    }
  }
  if (!data.inboundLayers?.length) {
    parts.push('  (none)');
  }
  parts.push('');
  parts.push(line());
  parts.push('SAFER EDIT ZONES (if you just need UI/behavior tweaks):');
  for (const zone of data.safeZones || []) {
    parts.push(`  ${zone}`);
  }
  parts.push('');
  parts.push(line());
  parts.push('');

  return parts.join('\n');
}

function formatDirectoryReport(data) {
  const parts = [];
  parts.push(line());
  parts.push('BLAST-RADIUS REPORT (directory)');
  parts.push(line());
  parts.push('');
  parts.push(`TARGET:           ${data.target}`);
  parts.push('');
  parts.push('TOP 5 RISKY FILES IN THIS DIRECTORY:');
  parts.push('');
  for (const f of data.topFiles || []) {
    parts.push(`  ${f.file}`);
    parts.push(`    RISK: ${f.risk} (score ${f.score})`);
    parts.push(`    Direct importers: ${f.inboundCount}`);
    for (const r of f.reasons || []) {
      parts.push(`    - ${r}`);
    }
    parts.push('');
  }
  parts.push(line());
  parts.push('');

  return parts.join('\n');
}

/**
 * Convert report to JSON
 */
export function toJSON(data) {
  return JSON.stringify(data, null, 2);
}
