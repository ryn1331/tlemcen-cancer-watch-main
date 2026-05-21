import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, UserCheck, UserPlus, ShieldOff, Loader2, Users, Merge, Check, Combine, X, FileText, Stethoscope } from 'lucide-react';
import { findDuplicates, type PatientLite, type MatchLevel, dismissalKey, orderedPair } from '@/lib/duplicate-detection';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface CandidateData extends PatientLite {
  // Optional cancer-case fields from the form being filled
  caseFields?: Record<string, any>;
}

export interface MergeApplyResult {
  patient: PatientLite;
  linkedCaseId: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  candidate: CandidateData;
  onUseExisting: (patient: PatientLite, opts?: { linkedCaseId?: string | null }) => void;
  onForceCreate: () => void;
}

const LEVEL_CONFIG: Record<MatchLevel, { label: string; color: string; bg: string }> = {
  exact: { label: 'IDENTIQUE', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
  probable: { label: 'TRÈS PROBABLE', color: 'text-warning', bg: 'bg-warning/10 border-warning/30' },
  possible: { label: 'POSSIBLE', color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/30' },
  none: { label: '', color: '', bg: '' },
};

const PATIENT_FIELDS: { key: keyof PatientLite; label: string }[] = [
  { key: 'nom', label: 'Nom' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'date_naissance', label: 'Date naissance' },
  { key: 'sexe', label: 'Sexe' },
  { key: 'commune', label: 'Commune' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'num_dossier', label: 'N° Dossier' },
];

// Cancer case fields (DB column ↔ form key)
const CASE_FIELDS: { db: string; form: string; label: string }[] = [
  { db: 'type_cancer', form: 'typeCancer', label: 'Type de cancer' },
  { db: 'sous_type_cancer', form: 'sousTypeCancer', label: 'Sous-type' },
  { db: 'code_icdo', form: 'codeIcdo', label: 'Code ICD-O' },
  { db: 'topographie_icdo', form: 'topographieIcdo', label: 'Topographie' },
  { db: 'morphologie_icdo', form: 'morphologieIcdo', label: 'Morphologie' },
  { db: 'comportement', form: 'comportement', label: 'Comportement' },
  { db: 'grade', form: 'grade', label: 'Grade' },
  { db: 'lateralite', form: 'lateralite', label: 'Latéralité' },
  { db: 'stade_tnm', form: 'stadeTnm', label: 'Stade TNM' },
  { db: 'anomalies_moleculaires', form: 'anomaliesMoleculaires', label: 'Anomalies mol.' },
  { db: 'resultat_anapath', form: 'resultatAnapath', label: 'Résultat anapath' },
  { db: 'ref_anapath', form: 'refAnapath', label: 'Réf. anapath' },
  { db: 'biologie_fns', form: 'biologieFns', label: 'Biologie FNS' },
  { db: 'notes', form: 'notes', label: 'Notes' },
];

const NEW = 'new';
const EXISTING = 'existing';
const COMBINE = 'combine';

const combineValues = (a: any, b: any) => {
  const sa = (a ?? '').toString().trim();
  const sb = (b ?? '').toString().trim();
  if (!sa) return sb;
  if (!sb) return sa;
  if (sa.toLowerCase() === sb.toLowerCase()) return sa;
  return `${sa} + ${sb}`;
};

export default function DuplicateCheckDialog({ open, onOpenChange, candidate, onUseExisting, onForceCreate }: Props) {
  const [matches, setMatches] = useState<{ patient: PatientLite; score: number; level: MatchLevel }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [mergeOpenId, setMergeOpenId] = useState<string | null>(null);
  const [mergeChoices, setMergeChoices] = useState<Record<string, 'new' | 'existing' | 'combine'>>({});
  const [applying, setApplying] = useState(false);
  const [existingCases, setExistingCases] = useState<any[]>([]);
  const [existingDocs, setExistingDocs] = useState<any[]>([]);
  const [existingRechutes, setExistingRechutes] = useState<any[]>([]);
  const [existingTraitements, setExistingTraitements] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null); // null => create new case

  useEffect(() => {
    if (!open) return;
    if (!candidate.nom || !candidate.prenom) return;
    let cancel = false;
    setLoading(true);
    (async () => {
      const { data: pool } = await supabase
        .from('patients')
        .select('id, nom, prenom, date_naissance, sexe, commune, telephone, num_dossier, code_patient');
      const { data: dismissed } = await supabase
        .from('dismissed_duplicates')
        .select('patient_a_id, patient_b_id');

      const dismissedSet = new Set((dismissed || []).map((d: any) => dismissalKey(d.patient_a_id, d.patient_b_id)));

      const candidateId = candidate.id || '__new__';
      const found = findDuplicates({ ...candidate, id: candidateId }, pool || [], 0.7)
        .filter(m => !dismissedSet.has(dismissalKey(candidateId, m.patient.id)));
      if (!cancel) {
        setMatches(found);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [open, candidate]);

  const dismiss = async (matchPatientId: string) => {
    if (!candidate.id) {
      setMatches(prev => prev.filter(m => m.patient.id !== matchPatientId));
      toast.info('Marqué comme distinct');
      return;
    }
    setDismissingId(matchPatientId);
    const [a, b] = orderedPair(candidate.id, matchPatientId);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('dismissed_duplicates').insert({
      patient_a_id: a, patient_b_id: b, dismissed_by: user?.id, raison: 'Distinct confirmé par médecin',
    });
    setDismissingId(null);
    if (error) { toast.error(error.message); return; }
    setMatches(prev => prev.filter(m => m.patient.id !== matchPatientId));
    toast.success('Patients marqués comme distincts');
  };

  const openMerge = async (patient: PatientLite) => {
    setMergeOpenId(patient.id);
    // Init demographic choices
    const init: Record<string, 'new' | 'existing' | 'combine'> = {};
    for (const f of PATIENT_FIELDS) {
      const newVal = (candidate[f.key] ?? '').toString().trim();
      init[`p_${f.key as string}`] = newVal ? NEW : EXISTING;
    }
    // Fetch existing cases, documents, rechutes & traitements
    const [{ data: cases }, { data: docs }] = await Promise.all([
      supabase.from('cancer_cases').select('*').eq('patient_id', patient.id).order('date_diagnostic', { ascending: false }),
      supabase.from('patient_files').select('id, file_name, file_type, case_id').eq('patient_id', patient.id),
    ]);
    setExistingCases(cases || []);
    setExistingDocs(docs || []);
    const caseIds = (cases || []).map((c: any) => c.id);
    if (caseIds.length > 0) {
      const [{ data: rech }, { data: trait }] = await Promise.all([
        supabase.from('cancer_rechutes').select('*').in('case_id', caseIds).order('date_evenement', { ascending: false }),
        supabase.from('traitements').select('*').in('case_id', caseIds).order('date_debut', { ascending: false }),
      ]);
      setExistingRechutes(rech || []);
      setExistingTraitements(trait || []);
    } else {
      setExistingRechutes([]);
      setExistingTraitements([]);
    }
    // Auto-pick a matching case (same type_cancer)
    const candType = candidate.caseFields?.typeCancer;
    const matchedCase = (cases || []).find((c: any) => candType && c.type_cancer === candType) || null;
    setSelectedCaseId(matchedCase?.id || null);
    if (matchedCase) {
      for (const f of CASE_FIELDS) {
        const newVal = (candidate.caseFields?.[f.form] ?? '').toString().trim();
        init[`c_${f.db}`] = newVal ? NEW : EXISTING;
      }
    }
    setMergeChoices(init);
  };

  const applyMerge = async (patient: PatientLite) => {
    setApplying(true);
    try {
      // 1. Merge patient demographics
      const mergedPatient: Record<string, any> = {};
      for (const f of PATIENT_FIELDS) {
        const choice = mergeChoices[`p_${f.key as string}`] || EXISTING;
        if (choice === NEW) mergedPatient[f.key as string] = candidate[f.key] ?? null;
        else if (choice === EXISTING) mergedPatient[f.key as string] = patient[f.key] ?? null;
        else mergedPatient[f.key as string] = combineValues(candidate[f.key], patient[f.key]) || null;
      }
      const { error: pErr } = await supabase.from('patients').update({
        nom: mergedPatient.nom, prenom: mergedPatient.prenom,
        date_naissance: mergedPatient.date_naissance || null,
        sexe: mergedPatient.sexe, commune: mergedPatient.commune,
        telephone: mergedPatient.telephone, num_dossier: mergedPatient.num_dossier,
      }).eq('id', patient.id);
      if (pErr) throw pErr;

      // 2. If a case is selected, merge case fields too
      let linkedCaseId: string | null = null;
      if (selectedCaseId) {
        const target = existingCases.find(c => c.id === selectedCaseId);
        if (target) {
          const mergedCase: Record<string, any> = {};
          for (const f of CASE_FIELDS) {
            const choice = mergeChoices[`c_${f.db}`] || EXISTING;
            const newVal = candidate.caseFields?.[f.form];
            const exVal = target[f.db];
            if (choice === NEW) mergedCase[f.db] = newVal ?? null;
            else if (choice === EXISTING) mergedCase[f.db] = exVal ?? null;
            else mergedCase[f.db] = combineValues(newVal, exVal) || null;
          }
          const { error: cErr } = await supabase.from('cancer_cases').update(mergedCase).eq('id', selectedCaseId);
          if (cErr) throw cErr;
          linkedCaseId = selectedCaseId;
        }
      }

      toast.success(linkedCaseId
        ? 'Patient et cas existant fusionnés avec succès'
        : 'Patient mis à jour — un nouveau cas sera créé');
      onUseExisting({ ...patient, ...mergedPatient }, { linkedCaseId });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApplying(false);
    }
  };

  const renderFieldRow = (f: { label: string }, keyPrefix: string, newRaw: any, exRaw: any) => {
    const newVal = (newRaw ?? '').toString();
    const exVal = (exRaw ?? '').toString();
    const choice = mergeChoices[keyPrefix] || EXISTING;
    const Btn = ({ id, label, value, color }: { id: string; label: string; value: string; color: string }) => (
      <button
        type="button"
        onClick={() => setMergeChoices(prev => ({ ...prev, [keyPrefix]: id as any }))}
        className={cn(
          'flex-1 min-w-0 text-left px-2 py-1 rounded text-[11px] border truncate',
          choice === id ? `${color} font-medium` : 'border-border/50 bg-background/50 hover:bg-muted/50'
        )}
        title={value}
      >
        {choice === id && <Check size={9} className="inline mr-1" />}
        <span className="text-[9px] uppercase tracking-wide opacity-70">{label}</span>{' '}
        <span>{value || '—'}</span>
      </button>
    );
    return (
      <div key={keyPrefix} className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground w-24 shrink-0">{f.label}</span>
        <Btn id={NEW} label="Nouv." value={newVal} color="bg-primary/10 border-primary/40 text-primary" />
        <Btn id={EXISTING} label="Exist." value={exVal} color="bg-foreground/10 border-foreground/30" />
        <Btn id={COMBINE} label="Comb." value={combineValues(newVal, exVal)} color="bg-success/10 border-success/40 text-success" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-warning" size={20} />
            Patients similaires détectés
          </DialogTitle>
          <DialogDescription>
            Politique zéro-doublon. Choisissez une action pour chaque correspondance.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <Users className="text-success" size={32} />
            <p className="text-sm text-muted-foreground">Aucun doublon détecté — vous pouvez créer ce patient.</p>
            <Button onClick={onForceCreate}><UserPlus size={14} className="mr-1.5" /> Créer le patient</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(({ patient, score, level }) => {
              const cfg = LEVEL_CONFIG[level];
              const isMerging = mergeOpenId === patient.id;
              return (
                <div key={patient.id} className={cn('p-3 rounded-xl border', cfg.bg)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={cn('text-[10px] font-bold', cfg.color, 'bg-background border')}>
                          {cfg.label} · {(score * 100).toFixed(0)}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">{patient.code_patient}</span>
                      </div>
                      <p className="font-medium text-sm">{patient.nom} {patient.prenom}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.date_naissance || 'Date inc.'} · {patient.sexe || '?'} · {patient.commune || 'Commune inc.'}
                        {patient.telephone && ` · ${patient.telephone}`}
                      </p>
                    </div>
                  </div>

                  {!isMerging && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <Button size="sm" className="gap-1 h-8" onClick={() => onUseExisting(patient)}>
                        <UserCheck size={12} /> Utiliser tel quel
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-1 h-8" onClick={() => openMerge(patient)}>
                        <Merge size={12} /> Fusionner tout (identité + cancer + docs)…
                      </Button>
                      <Button
                        size="sm" variant="outline" className="gap-1 h-8"
                        disabled={dismissingId === patient.id}
                        onClick={() => dismiss(patient.id)}
                      >
                        {dismissingId === patient.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldOff size={12} />}
                        Pas un doublon
                      </Button>
                    </div>
                  )}

                  {isMerging && (
                    <div className="mt-3 rounded-lg bg-background/90 border border-border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Source par champ : <span className="text-primary">Nouveau</span> · Existant · <span className="text-success">Combiner</span>
                        </p>
                        <button type="button" onClick={() => setMergeOpenId(null)} className="text-muted-foreground hover:text-foreground">
                          <X size={14} />
                        </button>
                      </div>

                      {/* Patient identity section */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Users size={10} /> Identité du patient
                        </p>
                        {PATIENT_FIELDS.map(f =>
                          renderFieldRow(f, `p_${f.key as string}`, candidate[f.key], patient[f.key])
                        )}
                      </div>

                      {/* Cancer case section */}
                      {candidate.caseFields && (
                        <div className="space-y-1.5 pt-2 border-t border-border/40">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                              <Stethoscope size={10} /> Cas de cancer
                            </p>
                            {existingCases.length > 0 ? (
                              <select
                                className="text-[10px] border border-border/60 rounded px-1.5 py-0.5 bg-background"
                                value={selectedCaseId || ''}
                                onChange={e => setSelectedCaseId(e.target.value || null)}
                              >
                                <option value="">→ Créer un nouveau cas</option>
                                {existingCases.map((c: any) => (
                                  <option key={c.id} value={c.id}>
                                    Fusionner avec : {c.type_cancer} ({c.date_diagnostic})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">Aucun cas existant — sera créé</span>
                            )}
                          </div>
                          {selectedCaseId
                            ? CASE_FIELDS.map(f => {
                                const target = existingCases.find(c => c.id === selectedCaseId);
                                return renderFieldRow(
                                  { label: f.label },
                                  `c_${f.db}`,
                                  candidate.caseFields?.[f.form],
                                  target?.[f.db]
                                );
                              })
                            : (
                              <p className="text-[10px] text-muted-foreground italic px-1">
                                Le nouveau cas sera créé séparément avec les valeurs saisies dans le formulaire.
                              </p>
                            )
                          }
                        </div>
                      )}

                      {/* Rechutes & métastases existantes */}
                      {existingRechutes.length > 0 && (
                        <div className="pt-2 border-t border-border/40">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                            <AlertTriangle size={10} /> Rechutes & métastases ({existingRechutes.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {existingRechutes.slice(0, 8).map((r: any) => (
                              <Badge key={r.id} variant="outline" className="text-[9px] font-normal">
                                {r.type_evenement} · {r.date_evenement}
                                {r.localisation ? ` · ${r.localisation}` : ''}
                              </Badge>
                            ))}
                            {existingRechutes.length > 8 && (
                              <Badge variant="outline" className="text-[9px]">+{existingRechutes.length - 8}</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Traitements existants */}
                      {existingTraitements.length > 0 && (
                        <div className="pt-2 border-t border-border/40">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                            <Stethoscope size={10} /> Traitements ({existingTraitements.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {existingTraitements.slice(0, 8).map((t: any) => (
                              <Badge key={t.id} variant="outline" className="text-[9px] font-normal">
                                {t.type_traitement} · {t.date_debut}
                                {t.protocole ? ` · ${t.protocole}` : ''}
                              </Badge>
                            ))}
                            {existingTraitements.length > 8 && (
                              <Badge variant="outline" className="text-[9px]">+{existingTraitements.length - 8}</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Documents section (informational) */}
                      <div className="pt-2 border-t border-border/40">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1.5">
                          <FileText size={10} /> Documents existants ({existingDocs.length})
                        </p>
                        {existingDocs.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground italic px-1">Aucun document — vos nouveaux fichiers seront ajoutés.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {existingDocs.slice(0, 8).map((d: any) => (
                              <Badge key={d.id} variant="outline" className="text-[9px] font-normal">
                                {d.file_type} · {d.file_name.length > 22 ? d.file_name.slice(0, 22) + '…' : d.file_name}
                              </Badge>
                            ))}
                            {existingDocs.length > 8 && (
                              <Badge variant="outline" className="text-[9px]">+{existingDocs.length - 8}</Badge>
                            )}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          ℹ️ Les nouveaux documents, rechutes et traitements seront rattachés au cas sélectionné ci-dessus.
                        </p>
                      </div>

                      <div className="flex justify-end gap-1.5 pt-2 border-t border-border/40">
                        <Button size="sm" variant="outline" onClick={() => setMergeOpenId(null)} className="h-7 text-xs">
                          Annuler
                        </Button>
                        <Button size="sm" disabled={applying} onClick={() => applyMerge(patient)} className="h-7 text-xs gap-1 bg-success text-success-foreground hover:bg-success/90">
                          {applying ? <Loader2 size={11} className="animate-spin" /> : <Combine size={11} />}
                          Appliquer la fusion complète
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-3 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                {matches.filter(m => m.level === 'exact').length > 0
                  ? '⚠️ Une correspondance identique requiert une décision explicite.'
                  : 'Forcer la création si vous êtes certain qu\'il s\'agit d\'un autre patient.'}
              </p>
              <Button
                variant={matches.some(m => m.level === 'exact') ? 'destructive' : 'outline'}
                size="sm"
                onClick={onForceCreate}
                className="gap-1"
              >
                <UserPlus size={12} /> Créer un nouveau patient
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
