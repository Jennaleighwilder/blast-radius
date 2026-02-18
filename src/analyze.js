/**
 * blast-radius analysis orchestrator
 * Runs scan, graph, heuristics and produces report data.
 */

import { scanProject } from './scanner.js';
import { buildGraph, computeInboundMetrics } from './graph.js';
import { computeRiskScore, getSafeZones } from './heuristics.js';
import path from 'path';
import fs from 'fs';

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function findProjectRoot(startPath) {
  let dir = path.resolve(startPath);
  if (!fs.statSync(dir).isDirectory()) dir = path.dirname(dir);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json')) ||
        fs.existsSync(path.join(dir, 'tsconfig.json')) ||
        fs.existsSync(path.join(dir, '.git'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return path.dirname(startPath);
}

/**
 * Analyze a single file target
 */
export function analyzeFile(targetPath, options = {}) {
  const {
    depth = 3,
    includeTests = false,
    rootPath: explicitRoot,
  } = options;

  const target = path.resolve(targetPath);
  const root = explicitRoot || findProjectRoot(target);
  const { edges, files, rootPath } = scanProject(root, { includeTests });

  const targetNorm = normalizePath(target);
  if (!files.some(f => normalizePath(f) === targetNorm)) {
    return { error: 'Target file not found or not scannable', filesScanned: files.length };
  }

  const { forward, reverse } = buildGraph(edges);
  const metrics = computeInboundMetrics(target, reverse, depth);
  const risk = computeRiskScore(target, metrics, rootPath);
  const safeZones = getSafeZones(rootPath);

  return {
    target: targetNorm,
    rootPath: normalizePath(rootPath),
    risk: risk.label,
    score: risk.score,
    reasons: risk.reasons,
    directImporters: metrics.topImporters,
    inboundCount: metrics.inboundCount,
    transitiveInboundCount: metrics.transitiveInboundCount,
    inboundLayers: metrics.inboundLayers,
    safeZones,
    filesScanned: files.length,
  };
}

/**
 * Analyze a directory - find top 5 risky files
 */
export function analyzeDirectory(dirPath, options = {}) {
  const {
    depth = 3,
    includeTests = false,
    topN = 5,
  } = options;

  const dir = path.resolve(dirPath);
  const root = findProjectRoot(dir);
  const { edges, files, rootPath } = scanProject(root, { includeTests });

  const dirNorm = normalizePath(dir);
  const filesInDir = files.filter(f => {
    const fn = normalizePath(f);
    return fn.startsWith(dirNorm + '/') || fn === dirNorm;
  });

  if (filesInDir.length === 0) {
    return { error: 'No scannable files in directory', filesScanned: files.length };
  }

  const { reverse } = buildGraph(edges);
  const scored = [];
  for (const f of filesInDir) {
    const metrics = computeInboundMetrics(f, reverse, depth);
    const risk = computeRiskScore(f, metrics, rootPath);
    scored.push({
      file: normalizePath(f),
      ...metrics,
      risk: risk.label,
      score: risk.score,
      reasons: risk.reasons,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const topFiles = scored.slice(0, topN);

  return {
    mode: 'directory',
    target: dirNorm,
    rootPath: normalizePath(rootPath),
    topFiles,
    filesScanned: files.length,
  };
}
