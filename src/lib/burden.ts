/**
 * Burden of disease — YLL, YLD, DALYs (GBD-style)
 * Reference: WHO methods for burden of disease 2020.
 */

export interface BurdenInput {
  type_cancer: string;
  ageAtDiagnosis: number;
  sex: 'M' | 'F';
  alive: boolean;
  ageAtDeath?: number;
  yearsLivedWithDisease?: number;
}

/** Algerian life expectancy at age (combined sexes, ONS 2020) */
const LIFE_EXPECTANCY: Record<number, number> = {
  0: 77, 5: 73, 10: 68, 15: 63, 20: 58, 25: 53, 30: 48, 35: 43, 40: 39,
  45: 34, 50: 30, 55: 25, 60: 21, 65: 17, 70: 14, 75: 10, 80: 8, 85: 6,
};

function lifeExpectancyAt(age: number): number {
  const band = Math.min(85, Math.max(0, Math.floor(age / 5) * 5));
  return LIFE_EXPECTANCY[band] ?? 5;
}

/** GBD disability weights for cancer phases */
const DW = {
  diagnosisTreatment: 0.288, // first year
  controlled: 0.049,
  metastatic: 0.451,
  terminal: 0.54,
};

export interface BurdenResult {
  yll: number;
  yld: number;
  daly: number;
  byCancer: { type: string; yll: number; yld: number; daly: number; count: number }[];
}

export function calculateBurden(records: BurdenInput[]): BurdenResult {
  let yll = 0, yld = 0;
  const byCancer: Record<string, { yll: number; yld: number; daly: number; count: number }> = {};

  records.forEach(r => {
    let recYll = 0, recYld = 0;
    if (!r.alive && r.ageAtDeath !== undefined) {
      const expected = lifeExpectancyAt(r.ageAtDeath);
      recYll = expected;
      yll += expected;
    }
    const yearsLived = r.yearsLivedWithDisease ?? 1;
    // weighted: 1st year diagnosis/treatment, then controlled
    const dw = yearsLived <= 1 ? DW.diagnosisTreatment
      : DW.diagnosisTreatment * 1 + DW.controlled * (yearsLived - 1);
    recYld = dw;
    yld += dw;

    if (!byCancer[r.type_cancer]) byCancer[r.type_cancer] = { yll: 0, yld: 0, daly: 0, count: 0 };
    byCancer[r.type_cancer].yll += recYll;
    byCancer[r.type_cancer].yld += recYld;
    byCancer[r.type_cancer].daly += recYll + recYld;
    byCancer[r.type_cancer].count += 1;
  });

  return {
    yll: Math.round(yll),
    yld: Math.round(yld * 10) / 10,
    daly: Math.round((yll + yld) * 10) / 10,
    byCancer: Object.entries(byCancer)
      .map(([type, v]) => ({ type, ...v, yll: Math.round(v.yll), yld: Math.round(v.yld * 10) / 10, daly: Math.round(v.daly * 10) / 10 }))
      .sort((a, b) => b.daly - a.daly),
  };
}

export function burdenFromCases(cases: any[]): BurdenResult {
  const refDate = new Date();
  return calculateBurden(cases.map(c => {
    const dob = c.patients?.date_naissance ? new Date(c.patients.date_naissance) : null;
    const diag = c.date_diagnostic ? new Date(c.date_diagnostic) : null;
    const death = c.date_deces ? new Date(c.date_deces) : null;
    if (!dob || !diag) return null;
    const ageAtDiagnosis = (diag.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const ageAtDeath = death ? (death.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25) : undefined;
    const endDate = death ?? refDate;
    const yearsLivedWithDisease = (endDate.getTime() - diag.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return {
      type_cancer: c.type_cancer || 'Inconnu',
      ageAtDiagnosis,
      sex: (c.patients?.sexe ?? 'M') as 'M' | 'F',
      alive: !death && c.statut_vital !== 'decede',
      ageAtDeath,
      yearsLivedWithDisease: Math.max(0, yearsLivedWithDisease),
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null));
}
