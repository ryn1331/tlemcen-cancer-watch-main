/**
 * Survival analysis — Kaplan-Meier and approximate net survival.
 * Net survival uses Ederer II method (simpler than Pohar-Perme but widely used by registries).
 */

export interface SurvivalRecord {
  /** Time from diagnosis (months) */
  time: number;
  /** 1 = death, 0 = censored (alive at last contact) */
  event: 0 | 1;
  /** Optional: age at diagnosis for net survival weighting */
  age?: number;
  /** Optional: sex for life-table lookup */
  sex?: 'M' | 'F';
}

export interface SurvivalPoint {
  time: number;
  survival: number;
  ciLow: number;
  ciHigh: number;
  atRisk: number;
  events: number;
}

/** Kaplan-Meier estimator with Greenwood 95% CI */
export function kaplanMeier(records: SurvivalRecord[]): SurvivalPoint[] {
  if (!records.length) return [];
  const sorted = [...records].sort((a, b) => a.time - b.time);
  const times = Array.from(new Set(sorted.filter(r => r.event === 1).map(r => r.time))).sort((a, b) => a - b);

  const points: SurvivalPoint[] = [{ time: 0, survival: 1, ciLow: 1, ciHigh: 1, atRisk: sorted.length, events: 0 }];
  let s = 1;
  let varSum = 0;

  for (const t of times) {
    const atRisk = sorted.filter(r => r.time >= t).length;
    const events = sorted.filter(r => r.time === t && r.event === 1).length;
    if (atRisk === 0) continue;
    const factor = (atRisk - events) / atRisk;
    s *= factor;
    varSum += events / (atRisk * (atRisk - events || 1));
    const se = s * Math.sqrt(varSum);
    points.push({
      time: t,
      survival: s,
      ciLow: Math.max(0, s - 1.96 * se),
      ciHigh: Math.min(1, s + 1.96 * se),
      atRisk,
      events,
    });
  }
  return points;
}

/** Survival at a specific time point (months) */
export function survivalAt(curve: SurvivalPoint[], months: number): { survival: number; ciLow: number; ciHigh: number } {
  if (!curve.length) return { survival: 0, ciLow: 0, ciHigh: 0 };
  let last = curve[0];
  for (const p of curve) {
    if (p.time <= months) last = p;
    else break;
  }
  return { survival: last.survival, ciLow: last.ciLow, ciHigh: last.ciHigh };
}

/** Algerian abridged life table (qx per 5-year band, 2020 estimate, both sexes combined) */
const LIFE_TABLE_DZ: Record<string, number> = {
  '0-4': 0.024, '5-9': 0.0008, '10-14': 0.0009, '15-19': 0.0017, '20-24': 0.0025,
  '25-29': 0.0029, '30-34': 0.0033, '35-39': 0.0042, '40-44': 0.006, '45-49': 0.0095,
  '50-54': 0.015, '55-59': 0.024, '60-64': 0.038, '65-69': 0.058, '70-74': 0.092,
  '75-79': 0.143, '80-84': 0.222, '85+': 0.45,
};

function ageBand(age: number): string {
  if (age >= 85) return '85+';
  const lo = Math.floor(age / 5) * 5;
  return `${lo}-${lo + 4}`;
}

/** Expected survival probability at t months from general population (Ederer II) */
function expectedSurvival(records: SurvivalRecord[], months: number): number {
  if (!records.length) return 1;
  const probs = records.map(r => {
    const age = r.age ?? 60;
    const yearsElapsed = months / 12;
    const band = ageBand(age + yearsElapsed / 2);
    const qx = LIFE_TABLE_DZ[band] ?? 0.05;
    // approximate: P(survive t months) = (1-qx)^(t/12)
    return Math.pow(1 - qx, yearsElapsed);
  });
  return probs.reduce((s, p) => s + p, 0) / probs.length;
}

/** Net survival = observed / expected (Ederer II) */
export function netSurvivalAt(records: SurvivalRecord[], months: number): number {
  const km = kaplanMeier(records);
  const obs = survivalAt(km, months).survival;
  const exp = expectedSurvival(records, months);
  return exp > 0 ? Math.min(1, obs / exp) : obs;
}

/** Build records from cases with date_diagnostic + statut_vital + date_deces/derniere_nouvelle */
export function recordsFromCases(cases: any[], referenceDate = new Date()): SurvivalRecord[] {
  return cases
    .map(c => {
      if (!c.date_diagnostic) return null;
      const diag = new Date(c.date_diagnostic);
      const dead = c.statut_vital === 'decede' || !!c.date_deces;
      const endDate = c.date_deces ? new Date(c.date_deces)
        : c.date_derniere_nouvelle ? new Date(c.date_derniere_nouvelle)
        : referenceDate;
      const months = (endDate.getTime() - diag.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
      if (months < 0 || !isFinite(months)) return null;
      const age = c.patients?.date_naissance
        ? (diag.getTime() - new Date(c.patients.date_naissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        : undefined;
      return { time: Math.round(months), event: (dead ? 1 : 0) as 0 | 1, age, sex: c.patients?.sexe as 'M' | 'F' | undefined };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}
