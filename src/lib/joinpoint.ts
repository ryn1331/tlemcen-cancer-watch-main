/**
 * Joinpoint regression (simplified) — detects breakpoints in time-trends of rates.
 * Algorithm: grid-search over candidate joinpoints, choose the model minimising BIC.
 * Returns segments with their APC (Annual Percent Change) and the AAPC.
 */

export interface JoinpointSegment {
  startYear: number;
  endYear: number;
  apc: number;        // Annual Percent Change
  apcCiLow: number;
  apcCiHigh: number;
  significant: boolean;
}

export interface JoinpointResult {
  segments: JoinpointSegment[];
  joinpoints: number[];
  aapc: number;       // Average APC over the full period
  fitted: { year: number; value: number; fitted: number }[];
}

interface Point { year: number; value: number }

function logRegression(pts: Point[]): { intercept: number; slope: number; rss: number; seSlope: number } {
  const valid = pts.filter(p => p.value > 0);
  if (valid.length < 2) return { intercept: 0, slope: 0, rss: 0, seSlope: 0 };
  const xs = valid.map(p => p.year);
  const ys = valid.map(p => Math.log(p.value));
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = my - slope * mx;
  let rss = 0;
  for (let i = 0; i < n; i++) { const e = ys[i] - (intercept + slope * xs[i]); rss += e * e; }
  const sigma2 = rss / Math.max(1, n - 2);
  const seSlope = sxx === 0 ? 0 : Math.sqrt(sigma2 / sxx);
  return { intercept, slope, rss, seSlope };
}

function fitSegmented(pts: Point[], joinYears: number[]): { rss: number; segments: JoinpointSegment[]; fitted: Map<number, number> } {
  const fitted = new Map<number, number>();
  if (pts.length < 2) return { rss: 0, segments: [], fitted };
  const cuts = [pts[0].year - 0.5, ...joinYears.map(y => y + 0.5), pts[pts.length - 1].year + 0.5];
  const segments: JoinpointSegment[] = [];
  let totalRss = 0;
  for (let i = 0; i < cuts.length - 1; i++) {
    const seg = pts.filter(p => p.year > cuts[i] && p.year < cuts[i + 1]);
    if (seg.length < 2) return { rss: Infinity, segments: [], fitted };
    const r = logRegression(seg);
    totalRss += r.rss;
    const apc = (Math.exp(r.slope) - 1) * 100;
    const seApc = Math.abs(Math.exp(r.slope) * r.seSlope) * 100;
    segments.push({
      startYear: seg[0].year,
      endYear: seg[seg.length - 1].year,
      apc: Math.round(apc * 100) / 100,
      apcCiLow: Math.round((apc - 1.96 * seApc) * 100) / 100,
      apcCiHigh: Math.round((apc + 1.96 * seApc) * 100) / 100,
      significant: Math.abs(apc) > 1.96 * seApc,
    });
    seg.forEach(p => fitted.set(p.year, Math.exp(r.intercept + r.slope * p.year)));
  }
  return { rss: totalRss, segments, fitted };
}

export function joinpointRegression(history: Point[], maxJoinpoints = 2): JoinpointResult {
  const sorted = [...history].sort((a, b) => a.year - b.year).filter(p => p.value > 0);
  if (sorted.length < 4) {
    const r = fitSegmented(sorted, []);
    return {
      segments: r.segments,
      joinpoints: [],
      aapc: r.segments[0]?.apc ?? 0,
      fitted: sorted.map(p => ({ year: p.year, value: p.value, fitted: r.fitted.get(p.year) ?? p.value })),
    };
  }

  const candidates = sorted.slice(2, -2).map(p => p.year);
  let best = fitSegmented(sorted, []);
  let bestJoins: number[] = [];
  let bestBic = sorted.length * Math.log(best.rss / sorted.length);

  for (let k = 1; k <= Math.min(maxJoinpoints, Math.floor(sorted.length / 3) - 1); k++) {
    const combos = combinations(candidates, k);
    for (const combo of combos) {
      const r = fitSegmented(sorted, combo);
      if (!isFinite(r.rss)) continue;
      const params = 2 * (k + 1) + k;
      const bic = sorted.length * Math.log(r.rss / sorted.length) + params * Math.log(sorted.length);
      if (bic < bestBic - 2) { bestBic = bic; best = r; bestJoins = combo; }
    }
  }

  const totalYears = sorted[sorted.length - 1].year - sorted[0].year;
  const aapc = totalYears > 0
    ? (Math.exp(best.segments.reduce((s, seg) => s + Math.log(1 + seg.apc / 100) * (seg.endYear - seg.startYear), 0) / totalYears) - 1) * 100
    : 0;

  return {
    segments: best.segments,
    joinpoints: bestJoins,
    aapc: Math.round(aapc * 100) / 100,
    fitted: sorted.map(p => ({ year: p.year, value: p.value, fitted: Math.round((best.fitted.get(p.year) ?? p.value) * 100) / 100 })),
  };
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [head, ...rest] = arr;
  return [...combinations(rest, k - 1).map(c => [head, ...c]), ...combinations(rest, k)];
}
