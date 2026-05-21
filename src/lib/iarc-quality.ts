/**
 * IARC CI5 Quality Indicators — extended set
 * Reference: Cancer Incidence in Five Continents Vol XI, IARC 2017
 */
import type { CaseWithPatient } from './epidemiology';

export interface QualityIndicator {
  key: string;
  label: string;
  value: number;
  unit: string;
  threshold: { good: number; acceptable: number };
  status: 'good' | 'acceptable' | 'poor';
  description: string;
  /** true => higher is better; false => lower is better */
  higherIsBetter: boolean;
}

function status(value: number, good: number, acceptable: number, higherIsBetter: boolean): QualityIndicator['status'] {
  if (higherIsBetter) {
    if (value >= good) return 'good';
    if (value >= acceptable) return 'acceptable';
    return 'poor';
  }
  if (value <= good) return 'good';
  if (value <= acceptable) return 'acceptable';
  return 'poor';
}

/** % cases with microscopic verification (anapath) — IARC target ≥75% */
export function mvPercent(cases: CaseWithPatient[]): number {
  if (!cases.length) return 0;
  return cases.filter(c => c.resultat_anapath && c.resultat_anapath.trim().length > 0).length / cases.length * 100;
}

/** % cases known by Death Certificate Only — IARC target ≤10% */
export function dcoPercent(cases: (CaseWithPatient & { base_diagnostic?: string | null })[]): number {
  if (!cases.length) return 0;
  return cases.filter(c => (c as any).base_diagnostic === 'DCO' || (c as any).base_diagnostic === 'certificat_deces').length / cases.length * 100;
}

/** Mortality / Incidence ratio — IARC target ~0.5–0.7 for solid tumours */
export function miRatio(cases: (CaseWithPatient & { statut_vital?: string | null; cause_deces?: string | null })[]): number {
  if (!cases.length) return 0;
  const deaths = cases.filter(c => (c as any).statut_vital === 'decede' || (c as any).cause_deces).length;
  return deaths / cases.length;
}

/** % unknown primary site — IARC target ≤5% */
export function unknownPrimaryPercent(cases: CaseWithPatient[]): number {
  if (!cases.length) return 0;
  return cases.filter(c => !c.type_cancer || /inconnu|unknown|autre/i.test(c.type_cancer)).length / cases.length * 100;
}

/** % cases with unknown age — IARC target ≤5% */
export function ageUnknownPercent(cases: CaseWithPatient[]): number {
  if (!cases.length) return 0;
  return cases.filter(c => !c.patients?.date_naissance).length / cases.length * 100;
}

/** % staged cases — quality marker, target ≥60% */
export function stagedPercent(cases: CaseWithPatient[]): number {
  if (!cases.length) return 0;
  return cases.filter(c => c.stade_tnm && c.stade_tnm.trim().length > 0).length / cases.length * 100;
}

/** Full IARC scorecard */
export function buildScorecard(cases: any[]): QualityIndicator[] {
  const mv = mvPercent(cases);
  const dco = dcoPercent(cases);
  const mi = miRatio(cases);
  const unk = unknownPrimaryPercent(cases);
  const ageU = ageUnknownPercent(cases);
  const staged = stagedPercent(cases);

  return [
    {
      key: 'mv', label: 'Microscopic Verification (MV%)', value: mv, unit: '%',
      threshold: { good: 75, acceptable: 65 }, status: status(mv, 75, 65, true), higherIsBetter: true,
      description: 'Cas confirmés histologiquement. Cible IARC ≥ 75%.',
    },
    {
      key: 'dco', label: 'Death Certificate Only (DCO%)', value: dco, unit: '%',
      threshold: { good: 5, acceptable: 10 }, status: status(dco, 5, 10, false), higherIsBetter: false,
      description: 'Cas connus uniquement par certificat de décès. Cible ≤ 10%.',
    },
    {
      key: 'mi', label: 'Mortality / Incidence ratio', value: mi, unit: '',
      threshold: { good: 0.7, acceptable: 0.85 }, status: status(mi, 0.7, 0.85, false), higherIsBetter: false,
      description: 'Ratio M/I. Trop proche de 1 = sous-déclaration probable.',
    },
    {
      key: 'unknown', label: 'Site primaire inconnu', value: unk, unit: '%',
      threshold: { good: 5, acceptable: 10 }, status: status(unk, 5, 10, false), higherIsBetter: false,
      description: 'Localisation tumorale inconnue. Cible ≤ 5%.',
    },
    {
      key: 'age', label: 'Âge inconnu', value: ageU, unit: '%',
      threshold: { good: 2, acceptable: 5 }, status: status(ageU, 2, 5, false), higherIsBetter: false,
      description: 'Date de naissance manquante. Cible ≤ 5%.',
    },
    {
      key: 'staged', label: 'Stadification (TNM)', value: staged, unit: '%',
      threshold: { good: 60, acceptable: 40 }, status: status(staged, 60, 40, true), higherIsBetter: true,
      description: 'Cas avec stade TNM renseigné. Cible ≥ 60%.',
    },
  ];
}

/** Global quality grade (A/B/C) based on IARC criteria */
export function globalGrade(indicators: QualityIndicator[]): { grade: 'A' | 'B' | 'C'; score: number } {
  const s = indicators.reduce((acc, i) => acc + (i.status === 'good' ? 2 : i.status === 'acceptable' ? 1 : 0), 0);
  const max = indicators.length * 2;
  const score = Math.round((s / max) * 100);
  return { grade: score >= 80 ? 'A' : score >= 55 ? 'B' : 'C', score };
}
