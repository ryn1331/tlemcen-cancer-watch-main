// Detection utilities for patient duplicates
// Inspired by SEER, IARC, and CanReg5 matching rules.

export interface PatientLite {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  sexe: string;
  commune?: string | null;
  telephone?: string | null;
  num_dossier?: string | null;
  code_patient?: string;
}

const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

// Levenshtein distance
export function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return m[a.length][b.length];
}

export function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na && !nb) return 1;
  const max = Math.max(na.length, nb.length);
  if (max === 0) return 1;
  return 1 - levenshtein(na, nb) / max;
}

// Compute confidence score 0-1 between 2 patients
export function matchScore(a: PatientLite, b: PatientLite): number {
  let score = 0;
  let weight = 0;

  const nameW = 0.45;
  const nameSim = (similarity(a.nom, b.nom) + similarity(a.prenom, b.prenom)) / 2;
  score += nameSim * nameW;
  weight += nameW;

  // Date of birth: huge factor
  if (a.date_naissance && b.date_naissance) {
    weight += 0.3;
    if (a.date_naissance === b.date_naissance) score += 0.3;
    else {
      // Same year same month → partial
      const [ya, ma] = a.date_naissance.split('-');
      const [yb, mb] = b.date_naissance.split('-');
      if (ya === yb && ma === mb) score += 0.15;
      else if (ya === yb) score += 0.05;
    }
  }

  // Sex
  if (a.sexe && b.sexe) {
    weight += 0.1;
    if (a.sexe === b.sexe) score += 0.1;
  }

  // Phone
  if (a.telephone && b.telephone) {
    weight += 0.1;
    if (normalize(a.telephone) === normalize(b.telephone)) score += 0.1;
  }

  // Num dossier exact
  if (a.num_dossier && b.num_dossier && normalize(a.num_dossier) === normalize(b.num_dossier)) {
    score += 0.05;
    weight += 0.05;
  }

  return weight > 0 ? score / weight : 0;
}

export type MatchLevel = 'exact' | 'probable' | 'possible' | 'none';

export function classifyMatch(score: number): MatchLevel {
  if (score >= 0.95) return 'exact';
  if (score >= 0.85) return 'probable';
  if (score >= 0.7) return 'possible';
  return 'none';
}

export function findDuplicates(
  candidate: PatientLite,
  pool: PatientLite[],
  threshold = 0.7
): { patient: PatientLite; score: number; level: MatchLevel }[] {
  return pool
    .filter((p) => p.id !== candidate.id)
    .map((p) => {
      const score = matchScore(candidate, p);
      return { patient: p, score, level: classifyMatch(score) };
    })
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

// Group all patients into duplicate clusters (transitive close)
export function clusterDuplicates(
  patients: PatientLite[],
  dismissed: Set<string>, // "id1|id2" pairs (sorted)
  threshold = 0.85
): PatientLite[][] {
  const parent: Record<string, string> = {};
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  patients.forEach((p) => (parent[p.id] = p.id));

  for (let i = 0; i < patients.length; i++) {
    for (let j = i + 1; j < patients.length; j++) {
      const a = patients[i];
      const b = patients[j];
      const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
      if (dismissed.has(pairKey)) continue;
      if (matchScore(a, b) >= threshold) union(a.id, b.id);
    }
  }

  const groups: Record<string, PatientLite[]> = {};
  patients.forEach((p) => {
    const r = find(p.id);
    if (!groups[r]) groups[r] = [];
    groups[r].push(p);
  });

  return Object.values(groups).filter((g) => g.length >= 2);
}

export const dismissalKey = (a: string, b: string) =>
  a < b ? `${a}|${b}` : `${b}|${a}`;

export const orderedPair = (a: string, b: string): [string, string] =>
  a < b ? [a, b] : [b, a];
