/**
 * Cancer incidence forecasting — methods used by IARC GLOBOCAN, NORDCAN, SEER
 *
 * Implemented:
 *  - Linear (OLS) regression on counts/rates
 *  - Log-linear (Joinpoint-style APC) projection with exponential growth
 *  - Holt's double exponential smoothing (trend-aware)
 *  - Ensemble (mean of methods) — robust forecast used by NORDCAN
 *  - Poisson 95% confidence intervals on counts
 */

export interface YearPoint { year: number; value: number }
export interface ForecastPoint {
  year: number;
  observed?: number;
  linear?: number;
  loglinear?: number;
  holt?: number;
  ensemble?: number;
  ciLow?: number;
  ciHigh?: number;
}

// ── Linear regression (OLS) ──
export function linearRegression(pts: YearPoint[]): { a: number; b: number; r2: number } {
  const n = pts.length;
  if (n < 2) return { a: pts[0]?.value ?? 0, b: 0, r2: 0 };
  const mx = pts.reduce((s, p) => s + p.year, 0) / n;
  const my = pts.reduce((s, p) => s + p.value, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const p of pts) {
    sxy += (p.year - mx) * (p.value - my);
    sxx += (p.year - mx) ** 2;
    syy += (p.value - my) ** 2;
  }
  const b = sxx === 0 ? 0 : sxy / sxx;
  const a = my - b * mx;
  const r2 = syy === 0 ? 1 : Math.max(0, 1 - (syy - (sxy * sxy) / (sxx || 1)) / syy);
  return { a, b, r2 };
}

// ── Log-linear (APC) ──
export function logLinearProjection(pts: YearPoint[]): { a: number; b: number; apc: number } {
  const valid = pts.filter(p => p.value > 0);
  if (valid.length < 2) return { a: 0, b: 0, apc: 0 };
  const lr = linearRegression(valid.map(p => ({ year: p.year, value: Math.log(p.value) })));
  return { a: lr.a, b: lr.b, apc: (Math.exp(lr.b) - 1) * 100 };
}

// ── Holt's double exponential smoothing ──
export function holtForecast(values: number[], horizon: number, alpha = 0.6, beta = 0.3): number[] {
  if (values.length < 2) return Array(horizon).fill(values[0] ?? 0);
  let level = values[0];
  let trend = values[1] - values[0];
  for (let i = 1; i < values.length; i++) {
    const prevLevel = level;
    level = alpha * values[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }
  return Array.from({ length: horizon }, (_, h) => Math.max(0, level + (h + 1) * trend));
}

// ── Poisson 95% CI on a count (Byar approximation) ──
export function poissonCI(count: number): { low: number; high: number } {
  if (count <= 0) return { low: 0, high: 3.69 };
  const z = 1.96;
  const low = count * (1 - 1 / (9 * count) - z / (3 * Math.sqrt(count))) ** 3;
  const high = (count + 1) * (1 - 1 / (9 * (count + 1)) + z / (3 * Math.sqrt(count + 1))) ** 3;
  return { low: Math.max(0, low), high };
}

// ── Build full series with forecast ──
export function buildForecast(history: YearPoint[], horizon: number): {
  series: ForecastPoint[];
  apc: number;
  r2: number;
  method: 'linear' | 'loglinear' | 'holt' | 'ensemble';
  nextYearValue: number;
  growth5y: number;
} {
  const sorted = [...history].sort((a, b) => a.year - b.year);
  const lr = linearRegression(sorted);
  const ll = logLinearProjection(sorted);
  const lastYear = sorted[sorted.length - 1]?.year ?? new Date().getFullYear();
  const holt = holtForecast(sorted.map(p => p.value), horizon);

  const series: ForecastPoint[] = sorted.map(p => ({ year: p.year, observed: p.value }));

  for (let h = 1; h <= horizon; h++) {
    const y = lastYear + h;
    const lin = Math.max(0, lr.a + lr.b * y);
    const log = ll.b !== 0 ? Math.max(0, Math.exp(ll.a + ll.b * y)) : sorted[sorted.length - 1].value;
    const ho = holt[h - 1];
    const ens = (lin + log + ho) / 3;
    const ci = poissonCI(Math.round(ens));
    series.push({
      year: y,
      linear: Math.round(lin * 10) / 10,
      loglinear: Math.round(log * 10) / 10,
      holt: Math.round(ho * 10) / 10,
      ensemble: Math.round(ens * 10) / 10,
      ciLow: Math.round(ci.low * 10) / 10,
      ciHigh: Math.round(ci.high * 10) / 10,
    });
  }

  const last = sorted[sorted.length - 1]?.value ?? 0;
  const five = series.find(s => s.year === lastYear + 5)?.ensemble ?? series[series.length - 1].ensemble ?? last;
  const growth5y = last > 0 ? ((five - last) / last) * 100 : 0;

  return {
    series,
    apc: Math.round(ll.apc * 100) / 100,
    r2: Math.round(lr.r2 * 1000) / 1000,
    method: 'ensemble',
    nextYearValue: Math.round((series.find(s => s.year === lastYear + 1)?.ensemble ?? 0) * 10) / 10,
    growth5y: Math.round(growth5y * 10) / 10,
  };
}

// ── Build per-location forecasts ──
export function locationForecasts(
  history: { year: number; location: string; count: number }[],
  horizon: number,
  topN = 5,
): { location: string; series: ForecastPoint[]; apc: number; nextYear: number }[] {
  const totals: Record<string, number> = {};
  history.forEach(h => { totals[h.location] = (totals[h.location] || 0) + h.count; });
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, topN).map(e => e[0]);

  return top.map(loc => {
    const pts = history.filter(h => h.location === loc).map(h => ({ year: h.year, value: h.count }));
    const f = buildForecast(pts, horizon);
    return { location: loc, series: f.series, apc: f.apc, nextYear: f.nextYearValue };
  });
}
