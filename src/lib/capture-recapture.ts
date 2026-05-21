/**
 * Capture-recapture completeness estimation (Chapman estimator).
 * Estimate the true number of cancer cases when at least 2 independent
 * sources (e.g. anapath, hospital, death registry) are available.
 */

export interface SourceCounts {
  /** Cases captured by source A only */
  onlyA: number;
  /** Cases captured by source B only */
  onlyB: number;
  /** Cases captured by both */
  both: number;
}

export interface CompletenessResult {
  observed: number;
  estimatedTotal: number;
  completenessPct: number;
  ciLow: number;
  ciHigh: number;
  missingEstimate: number;
}

/** Chapman (1951) bias-corrected Lincoln-Petersen estimator with 95% CI */
export function chapmanEstimate(c: SourceCounts): CompletenessResult {
  const n1 = c.onlyA + c.both;
  const n2 = c.onlyB + c.both;
  const m = c.both;
  const observed = c.onlyA + c.onlyB + c.both;
  if (n1 === 0 || n2 === 0) {
    return { observed, estimatedTotal: observed, completenessPct: 100, ciLow: observed, ciHigh: observed, missingEstimate: 0 };
  }
  const N = ((n1 + 1) * (n2 + 1)) / (m + 1) - 1;
  const variance = ((n1 + 1) * (n2 + 1) * (n1 - m) * (n2 - m)) / (((m + 1) ** 2) * (m + 2));
  const se = Math.sqrt(variance);
  const completeness = (observed / N) * 100;
  return {
    observed,
    estimatedTotal: Math.round(N),
    completenessPct: Math.round(completeness * 10) / 10,
    ciLow: Math.max(observed, Math.round(N - 1.96 * se)),
    ciHigh: Math.round(N + 1.96 * se),
    missingEstimate: Math.max(0, Math.round(N - observed)),
  };
}
