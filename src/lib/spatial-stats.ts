/**
 * Spatial autocorrelation statistics for cancer cluster detection.
 *  - Moran's I (global): tests whether incidence rates are spatially clustered.
 *  - LISA (local Moran): identifies which areas drive the clustering.
 * Distance-decay weights are derived from area centroids.
 */

export interface AreaPoint {
  code: string;       // wilaya code or commune id
  name: string;
  lat: number;
  lng: number;
  rate: number;       // incidence (or ASR) per 100k
}

export interface MoranResult {
  I: number;
  expected: number;
  variance: number;
  zScore: number;
  pValue: number;
  interpretation: 'clustered' | 'dispersed' | 'random';
}

function distance(a: AreaPoint, b: AreaPoint): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Inverse-distance weight matrix (row-standardized) */
function buildWeights(areas: AreaPoint[]): number[][] {
  const n = areas.length;
  const w: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = distance(areas[i], areas[j]);
      const wij = d > 0 ? 1 / d : 0;
      w[i][j] = wij; rowSum += wij;
    }
    if (rowSum > 0) for (let j = 0; j < n; j++) w[i][j] /= rowSum;
  }
  return w;
}

export function globalMoran(areas: AreaPoint[]): MoranResult {
  const n = areas.length;
  if (n < 3) return { I: 0, expected: 0, variance: 0, zScore: 0, pValue: 1, interpretation: 'random' };
  const w = buildWeights(areas);
  const mean = areas.reduce((s, a) => s + a.rate, 0) / n;
  const dev = areas.map(a => a.rate - mean);
  let num = 0, den = 0, S0 = 0;
  for (let i = 0; i < n; i++) {
    den += dev[i] ** 2;
    for (let j = 0; j < n; j++) {
      num += w[i][j] * dev[i] * dev[j];
      S0 += w[i][j];
    }
  }
  const I = (n / S0) * (num / (den || 1));
  const expected = -1 / (n - 1);
  const variance = 2 / ((n - 1) * (n - 2));
  const z = (I - expected) / Math.sqrt(variance || 1);
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  return {
    I: Math.round(I * 1000) / 1000,
    expected: Math.round(expected * 1000) / 1000,
    variance: Math.round(variance * 10000) / 10000,
    zScore: Math.round(z * 100) / 100,
    pValue: Math.round(pValue * 1000) / 1000,
    interpretation: pValue < 0.05 ? (I > expected ? 'clustered' : 'dispersed') : 'random',
  };
}

export interface LisaResult {
  code: string;
  name: string;
  rate: number;
  Ii: number;
  zScore: number;
  pValue: number;
  cluster: 'HH' | 'LL' | 'HL' | 'LH' | 'NS';
}

export function localMoran(areas: AreaPoint[]): LisaResult[] {
  const n = areas.length;
  if (n < 3) return [];
  const w = buildWeights(areas);
  const mean = areas.reduce((s, a) => s + a.rate, 0) / n;
  const dev = areas.map(a => a.rate - mean);
  const m2 = dev.reduce((s, d) => s + d * d, 0) / n;
  return areas.map((a, i) => {
    const lag = w[i].reduce((s, wij, j) => s + wij * dev[j], 0);
    const Ii = (dev[i] / (m2 || 1)) * lag;
    const z = Ii * Math.sqrt(n);
    const p = 2 * (1 - normalCdf(Math.abs(z)));
    let cluster: LisaResult['cluster'] = 'NS';
    if (p < 0.05) {
      if (dev[i] > 0 && lag > 0) cluster = 'HH';
      else if (dev[i] < 0 && lag < 0) cluster = 'LL';
      else if (dev[i] > 0 && lag < 0) cluster = 'HL';
      else if (dev[i] < 0 && lag > 0) cluster = 'LH';
    }
    return {
      code: a.code, name: a.name, rate: a.rate,
      Ii: Math.round(Ii * 1000) / 1000,
      zScore: Math.round(z * 100) / 100,
      pValue: Math.round(p * 1000) / 1000,
      cluster,
    };
  });
}

function normalCdf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}
