/**
 * Digital Twin épidémiologique — simulation prospective de l'incidence
 * Modèle multiplicatif simple inspiré des projections IARC/GLOBOCAN
 * (croissance démographique × vieillissement × facteurs de risque modifiables)
 */

export interface ScenarioInputs {
  // Variations relatives par rapport à l'observé (%)
  tabagisme: number;        // -50 .. +50  (impact poumon, vessie, ORL)
  depistageSein: number;    // -50 .. +50  (impact sein — détecte plus tôt = +incidence court terme, -mortalité)
  depistageColon: number;   // -50 .. +50
  pollution: number;        // -30 .. +50  (poumon, vessie)
  obesite: number;          // -30 .. +50  (sein post-méno, colon, endomètre)
  hpvVaccination: number;   // 0 .. 100  (couverture % — impact col à long terme)
  populationGrowth: number; // taux annuel %, défaut 1.4 (Algérie)
  agingFactor: number;      // 0 .. 2  (vieillissement accéléré)
}

export const DEFAULT_SCENARIO: ScenarioInputs = {
  tabagisme: 0,
  depistageSein: 0,
  depistageColon: 0,
  pollution: 0,
  obesite: 0,
  hpvVaccination: 30,
  populationGrowth: 1.4,
  agingFactor: 1,
};

// Élasticités approximatives (literature IARC) — variation incidence pour +1% du facteur
const ELASTICITIES: Record<string, Record<string, number>> = {
  Poumon: { tabagisme: 0.85, pollution: 0.30 },
  Sein: { depistageSein: 0.40, obesite: 0.20 },
  Colon: { depistageColon: -0.15, obesite: 0.18 },
  Vessie: { tabagisme: 0.45, pollution: 0.20 },
  'Col utérin': { hpvVaccination: -0.005 }, // par % couverture, effet 15 ans
  Estomac: { obesite: 0.10 },
  Prostate: { obesite: 0.08 },
};

export interface ProjectionPoint {
  year: number;
  baseline: number;       // si aucun changement
  scenario: number;       // avec les inputs
  delta: number;
  deltaPct: number;
}

export interface TypeProjection {
  type: string;
  baselineCases: number;
  points: ProjectionPoint[];
}

/**
 * @param baseCounts  cas observés par type sur la dernière année connue
 * @param baseYear    dernière année observée
 * @param horizon     nombre d'années à projeter
 * @param s           scénario
 */
export function projectIncidence(
  baseCounts: Record<string, number>,
  baseYear: number,
  horizon: number,
  s: ScenarioInputs,
): { perType: TypeProjection[]; total: ProjectionPoint[] } {
  const perType: TypeProjection[] = [];

  for (const [type, base] of Object.entries(baseCounts)) {
    const elast = ELASTICITIES[type] || {};
    const points: ProjectionPoint[] = [];
    for (let dy = 1; dy <= horizon; dy++) {
      const year = baseYear + dy;
      // Croissance démographique composée
      const popMult = Math.pow(1 + s.populationGrowth / 100, dy);
      // Vieillissement (sur cancers > 50 ans)
      const ageWeight = ['Sein', 'Colon', 'Prostate', 'Estomac', 'Poumon'].includes(type) ? 0.015 : 0.005;
      const ageMult = 1 + ageWeight * s.agingFactor * dy;

      // Effet facteurs (cumulatif progressif sur 10 ans)
      let factorMult = 1;
      for (const [k, e] of Object.entries(elast)) {
        const v = (s as any)[k] ?? 0;
        const ramp = Math.min(1, dy / 10); // pleine intensité à 10 ans
        factorMult *= 1 + (e * v / 100) * ramp;
      }

      const baselineN = base * popMult * ageMult;
      const scenarioN = baselineN * factorMult;

      points.push({
        year,
        baseline: Math.round(baselineN),
        scenario: Math.round(scenarioN),
        delta: Math.round(scenarioN - baselineN),
        deltaPct: ((scenarioN - baselineN) / baselineN) * 100,
      });
    }
    perType.push({ type, baselineCases: base, points });
  }

  // Agrégat total
  const total: ProjectionPoint[] = [];
  const horizonYears = perType[0]?.points.map(p => p.year) || [];
  horizonYears.forEach((year, i) => {
    let b = 0, sc = 0;
    perType.forEach(t => { b += t.points[i].baseline; sc += t.points[i].scenario; });
    total.push({
      year,
      baseline: b,
      scenario: sc,
      delta: sc - b,
      deltaPct: b > 0 ? ((sc - b) / b) * 100 : 0,
    });
  });

  return { perType, total };
}

export function casesAvoided(total: ProjectionPoint[]): number {
  return total.reduce((s, p) => s + (p.baseline - p.scenario), 0);
}
