/**
 * blast-radius dependency graph
 * Builds adjacency lists and computes inbound metrics.
 */

/**
 * Build graph from scan edges
 * edges: [[from, to], ...]
 * Returns { forward, reverse } adjacency maps
 */
export function buildGraph(edges) {
  const forward = new Map(); // file -> [imported files]
  const reverse = new Map(); // file -> [files that import it]
  for (const [from, to] of edges) {
    const fromNorm = normalizePath(from);
    const toNorm = normalizePath(to);
    if (!forward.has(fromNorm)) forward.set(fromNorm, []);
    forward.get(fromNorm).push(toNorm);
    if (!reverse.has(toNorm)) reverse.set(toNorm, []);
    reverse.get(toNorm).push(fromNorm);
  }
  return { forward, reverse };
}

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * BFS outward from target on reverse graph (who imports this file)
 * Returns inbound metrics within depth
 */
export function computeInboundMetrics(targetPath, reverse, depth = 3) {
  const target = normalizePath(targetPath);
  const inboundLayers = [];
  const seen = new Set([target]);
  let queue = reverse.get(target) ? [...reverse.get(target)] : [];
  let layer = 0;
  let transitiveCount = 0;
  while (layer < depth && queue.length > 0) {
    const layerFiles = [...new Set(queue)];
    inboundLayers.push({ depth: layer + 1, files: layerFiles });
    transitiveCount += layerFiles.length;
    const next = [];
    for (const f of queue) {
      if (seen.has(f)) continue;
      seen.add(f);
      const importers = reverse.get(f) || [];
      next.push(...importers);
    }
    queue = next.filter(f => !seen.has(f));
    layer++;
  }
  const directImporters = reverse.get(target) || [];
  return {
    inboundCount: directImporters.length,
    inboundLayers,
    transitiveInboundCount: transitiveCount,
    topImporters: directImporters,
  };
}
