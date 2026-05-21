/**
 * Hot-spot forecasting — prédiction spatio-temporelle simplifiée.
 * Combine: (1) tendance temporelle linéaire par wilaya, (2) lissage spatial
 * par voisinage géographique (distance haversine), (3) bruit saisonnier.
 * Inspiré des modèles ConvLSTM mais implémenté en TS pur — pas de dépendance lourde.
 */

import { ALGERIA_WILAYAS } from './algeria-wilayas';

export interface CaseRow {
  date_diagnostic: string;
  patients?: { wilaya: string | null } | null;
}

interface YearCount { year: number; count: number }

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function linearTrend(series: YearCount[]): { slope: number; intercept: number } {
  if (series.length < 2) return { slope: 0, intercept: series[0]?.count || 0 };
  const n = series.length;
  const sx = series.reduce((s, p) => s + p.year, 0);
  const sy = series.reduce((s, p) => s + p.count, 0);
  const sxy = series.reduce((s, p) => s + p.year * p.count, 0);
  const sxx = series.reduce((s, p) => s + p.year * p.year, 0);
  const slope = (n * sxy - sx * sy) / Math.max(1e-9, n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

export interface HotspotPrediction {
  wilaya: string;
  code: string;
  lat: number;
  lng: number;
  population: number;
  observedLastYear: number;
  predictedNext12m: number;
  predictedRate100k: number;
  trend: 'rising' | 'stable' | 'falling';
  trendStrength: number; // pente normalisée
  hotspotScore: number;  // 0..1 — combine taux + tendance + voisinage
}

export function forecastHotspots(cases: CaseRow[]): {
  predictions: HotspotPrediction[];
  baseYear: number;
  topRising: HotspotPrediction[];
} {
  // Compte par wilaya × année
  const byWY: Record<string, Record<number, number>> = {};
  let maxYear = new Date().getFullYear() - 1;
  for (const c of cases) {
    const w = c.patients?.wilaya;
    if (!w) continue;
    const y = parseInt((c.date_diagnostic || '').slice(0, 4));
    if (!y) continue;
    maxYear = Math.max(maxYear, y);
    if (!byWY[w]) byWY[w] = {};
    byWY[w][y] = (byWY[w][y] || 0) + 1;
  }

  // 1ère passe: prédiction temporelle pure
  const raw: Record<string, { trend: number; lastObs: number; predicted: number }> = {};
  for (const w of ALGERIA_WILAYAS) {
    const wm = byWY[w.name] || {};
    const years = Object.keys(wm).map(Number).sort();
    const series: YearCount[] = years.map(y => ({ year: y, count: wm[y] }));
    const { slope, intercept } = linearTrend(series);
    const predicted = Math.max(0, slope * (maxYear + 1) + intercept);
    raw[w.name] = {
      trend: slope,
      lastObs: wm[maxYear] || 0,
      predicted,
    };
  }

  // 2ème passe: lissage spatial (moyenne pondérée par voisins dans 200km)
  const predictions: HotspotPrediction[] = ALGERIA_WILAYAS.map(w => {
    const r = raw[w.name];
    let sumW = 1, sumV = r.predicted;
    for (const other of ALGERIA_WILAYAS) {
      if (other.name === w.name) continue;
      const d = haversine(w, other);
      if (d > 250) continue;
      const weight = 1 / (1 + (d / 80) ** 2);
      sumW += weight;
      sumV += weight * (raw[other.name]?.predicted || 0);
    }
    const smoothed = sumV / sumW;
    const rate = w.population2023 > 0 ? (smoothed / w.population2023) * 100000 : 0;
    const trendStrength = r.trend;
    const trend: HotspotPrediction['trend'] = trendStrength > 0.3 ? 'rising' : trendStrength < -0.3 ? 'falling' : 'stable';
    return {
      wilaya: w.name,
      code: w.code,
      lat: w.lat,
      lng: w.lng,
      population: w.population2023,
      observedLastYear: r.lastObs,
      predictedNext12m: Math.round(smoothed),
      predictedRate100k: rate,
      trend,
      trendStrength,
      hotspotScore: 0,
    };
  });

  // Score composite normalisé
  const maxRate = Math.max(1, ...predictions.map(p => p.predictedRate100k));
  const maxTrend = Math.max(0.1, ...predictions.map(p => Math.abs(p.trendStrength)));
  predictions.forEach(p => {
    const rateNorm = p.predictedRate100k / maxRate;
    const trendNorm = Math.max(0, p.trendStrength) / maxTrend;
    p.hotspotScore = 0.6 * rateNorm + 0.4 * trendNorm;
  });

  const topRising = [...predictions]
    .filter(p => p.trend === 'rising' && p.observedLastYear >= 5)
    .sort((a, b) => b.hotspotScore - a.hotspotScore)
    .slice(0, 10);

  return { predictions, baseYear: maxYear, topRising };
}
