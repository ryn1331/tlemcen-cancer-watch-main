import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AlertTriangle, Check, ArrowRight, Loader2, Eye, Merge, ShieldOff, Combine, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clusterDuplicates, dismissalKey, orderedPair, matchScore, type PatientLite } from '@/lib/duplicate-detection';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  sexe: string;
  commune: string | null;
  telephone: string | null;
  code_patient: string;
  num_dossier: string | null;
}

interface CancerCase {
  id: string;
  type_cancer: string;
  stade_tnm: string | null;
  date_diagnostic: string;
  statut: string;
  resultat_anapath: string | null;
  notes: string | null;
}

interface DuplicateGroup {
  patients: (Patient & { cases: CancerCase[] })[];
}

interface Props {
  onResolved?: () => void;
}

const FIELDS: { key: keyof Patient; label: string }[] = [
  { key: 'nom', label: 'Nom' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'date_naissance', label: 'Date naissance' },
  { key: 'sexe', label: 'Sexe' },
  { key: 'commune', label: 'Commune' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'num_dossier', label: 'N° Dossier' },
];

export default function DuplicateManager({ onResolved }: Props) {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [mlLoading, setMlLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [mergeTarget, setMergeTarget] = useState<string | null>(null);
  const [fieldChoices, setFieldChoices] = useState<Record<string, string>>({});
  const [caseActions, setCaseActions] = useState<Record<string, 'keep' | 'discard'>>({});
  const [merging, setMerging] = useState(false);

  const COMBINE = '__combine__';
  const combineValues = (vals: any[]) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of vals) {
      const s = (v ?? '').toString().trim();
      if (!s) continue;
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out.join(' + ');
  };

  const scanWithML = async () => {
    setMlLoading(true);
    try {
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id, nom, prenom, date_naissance, sexe, commune, telephone, code_patient, num_dossier');
      if (error) throw error;
      if (!patients || patients.length < 2) { toast.info('Pas assez de patients à comparer'); return; }

      const seen = new Set<string>();
      const groupsMap: Record<string, Patient[]> = {};

      // Limit to first 200 patients to control cost/latency
      const sample = patients.slice(0, 200);
      for (const candidate of sample) {
        const { data, error: fnErr } = await supabase.functions.invoke('detect-duplicates-ml', {
          body: { candidate, threshold: 0.82 },
        });
        if (fnErr) continue;
        const matches = data?.matches || [];
        for (const m of matches) {
          const [a, b] = orderedPair(candidate.id, m.patient.id);
          const key = `${a}_${b}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (!groupsMap[key]) groupsMap[key] = [candidate, m.patient];
        }
      }

      // Filter dismissed
      const { data: dismissed } = await supabase.from('dismissed_duplicates').select('patient_a_id,patient_b_id');
      const dismissedSet = new Set((dismissed || []).map(d => `${d.patient_a_id}_${d.patient_b_id}`));

      const groupKeys = Object.keys(groupsMap).filter(k => !dismissedSet.has(k));
      const dupGroups: DuplicateGroup[] = [];
      for (const k of groupKeys) {
        const group = groupsMap[k];
        const withCases = await Promise.all(group.map(async (p) => {
          const { data: cases } = await supabase
            .from('cancer_cases')
            .select('id, type_cancer, stade_tnm, date_diagnostic, statut, resultat_anapath, notes')
            .eq('patient_id', p.id);
          return { ...p, cases: cases || [] };
        }));
        dupGroups.push({ patients: withCases });
      }

      setDuplicates(dupGroups);
      if (dupGroups.length === 0) toast.info('Aucun doublon sémantique détecté par l\'IA');
      else toast.warning(`${dupGroups.length} paire(s) détectée(s) par l'IA (variantes phonétiques incluses)`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur scan ML');
    } finally {
      setMlLoading(false);
    }
  };

  const scanDuplicates = async () => {
    setLoading(true);
    try {
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id, nom, prenom, date_naissance, sexe, commune, telephone, code_patient, num_dossier')
        .order('nom');

      if (error) throw error;
      if (!patients) return;

      // Group by normalized nom+prenom similarity
      const groups: Record<string, Patient[]> = {};
      for (const p of patients) {
        const key = `${p.nom.trim().toLowerCase()}_${p.prenom.trim().toLowerCase()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
      }

      // Also check by date_naissance + similar name
      const dupGroups: DuplicateGroup[] = [];
      for (const [, group] of Object.entries(groups)) {
        if (group.length >= 2) {
          // Fetch cases for each patient
          const withCases = await Promise.all(group.map(async (p) => {
            const { data: cases } = await supabase
              .from('cancer_cases')
              .select('id, type_cancer, stade_tnm, date_diagnostic, statut, resultat_anapath, notes')
              .eq('patient_id', p.id);
            return { ...p, cases: cases || [] };
          }));
          dupGroups.push({ patients: withCases });
        }
      }

      setDuplicates(dupGroups);
      if (dupGroups.length === 0) toast.info('Aucun doublon détecté');
      else toast.warning(`${dupGroups.length} groupe(s) de doublons détectés`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const dismissPair = async (group: DuplicateGroup) => {
    const { data: { user } } = await supabase.auth.getUser();
    const pairs = [];
    for (let i = 0; i < group.patients.length; i++) {
      for (let j = i + 1; j < group.patients.length; j++) {
        const [a, b] = orderedPair(group.patients[i].id, group.patients[j].id);
        pairs.push({ patient_a_id: a, patient_b_id: b, dismissed_by: user?.id, raison: 'Distinct confirmé par médecin' });
      }
    }
    const { error } = await supabase.from('dismissed_duplicates').insert(pairs);
    if (error) { toast.error(error.message); return; }
    setDuplicates(prev => prev.filter(g => g !== group));
    toast.success('Patients marqués comme distincts');
  };

  const openMerge = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setMergeTarget(group.patients[0].id);
    const choices: Record<string, string> = {};
    for (const f of FIELDS) choices[f.key] = group.patients[0].id;
    setFieldChoices(choices);
    // Default: keep all cases
    const actions: Record<string, 'keep' | 'discard'> = {};
    group.patients.forEach(p => p.cases.forEach(c => { actions[c.id] = 'keep'; }));
    setCaseActions(actions);
  };

  const executeMerge = async () => {
    if (!selectedGroup || !mergeTarget) return;
    setMerging(true);

    try {
      const others = selectedGroup.patients.filter(p => p.id !== mergeTarget);

      // Build merged patient data from field choices (supports COMBINE)
      const mergedData: Record<string, any> = {};
      for (const f of FIELDS) {
        const sourceId = fieldChoices[f.key] || mergeTarget;
        if (sourceId === COMBINE) {
          mergedData[f.key] = combineValues(selectedGroup.patients.map(p => p[f.key]));
        } else {
          const source = selectedGroup.patients.find(p => p.id === sourceId);
          if (source) mergedData[f.key] = source[f.key];
        }
      }

      const { error: updateErr } = await supabase
        .from('patients')
        .update({
          nom: mergedData.nom, prenom: mergedData.prenom,
          date_naissance: mergedData.date_naissance || null,
          sexe: mergedData.sexe, commune: mergedData.commune,
          telephone: mergedData.telephone, num_dossier: mergedData.num_dossier,
        })
        .eq('id', mergeTarget);
      if (updateErr) throw updateErr;

      // Per-case actions: keep (reassign to target) or discard (delete)
      for (const other of others) {
        for (const c of other.cases) {
          if (caseActions[c.id] === 'discard') {
            await supabase.from('cancer_cases').delete().eq('id', c.id);
          } else {
            await supabase.from('cancer_cases').update({ patient_id: mergeTarget }).eq('id', c.id);
          }
        }
        await supabase.from('patient_files').update({ patient_id: mergeTarget }).eq('patient_id', other.id);
        await supabase.from('patients').delete().eq('id', other.id);
      }

      // Discard target's own cases if marked
      const target = selectedGroup.patients.find(p => p.id === mergeTarget);
      if (target) {
        for (const c of target.cases) {
          if (caseActions[c.id] === 'discard') {
            await supabase.from('cancer_cases').delete().eq('id', c.id);
          }
        }
      }

      toast.success('Fusion personnalisée appliquée avec succès');
      setSelectedGroup(null);
      setDuplicates(prev => prev.filter(g => g !== selectedGroup));
      onResolved?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Merge size={18} className="text-primary" /> Gestion des doublons
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Inspiré du SEER/IARC — Détecte les patients avec même nom/prénom et permet la fusion sélective
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={scanDuplicates} disabled={loading || mlLoading} variant="outline" className="gap-1.5">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
            Scan rapide
          </Button>
          <Button onClick={scanWithML} disabled={loading || mlLoading} className="gap-1.5">
            {mlLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Scan IA (variantes phonétiques)
          </Button>
        </div>
      </div>

      {duplicates.length > 0 && (
        <div className="space-y-2">
          {duplicates.map((group, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning" />
                  <span className="font-medium text-sm">
                    {group.patients[0].nom} {group.patients[0].prenom}
                  </span>
                  <Badge variant="destructive" className="text-[10px]">{group.patients.length} enregistrements</Badge>
                  {group.patients.length === 2 && (
                    <Badge variant="outline" className="text-[10px]">
                      Score {(matchScore(group.patients[0] as any, group.patients[1] as any) * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground" onClick={() => dismissPair(group)}>
                    <ShieldOff size={12} /> Pas un doublon
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openMerge(group)}>
                    <Eye size={12} /> Comparer & Fusionner
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.patients.map(p => (
                  <div key={p.id} className="text-xs p-2 rounded-lg bg-background border border-border/30">
                    <p className="font-medium">{p.nom} {p.prenom} <span className="text-muted-foreground font-normal">· {p.code_patient}</span></p>
                    <p className="text-muted-foreground">
                      {p.date_naissance || 'Date inc.'} · {p.sexe} · {p.commune || 'Commune inc.'} · {p.cases.length} cas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Merge Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Merge size={20} className="text-primary" />
              Fusion de patients — Comparaison champ par champ
            </DialogTitle>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-4">
              {/* Choose target */}
              <div>
                <p className="text-sm font-medium mb-2">Patient cible (celui qui sera conservé) :</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedGroup.patients.map(p => (
                    <Button
                      key={p.id}
                      variant={mergeTarget === p.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMergeTarget(p.id)}
                      className="gap-1"
                    >
                      {mergeTarget === p.id && <Check size={12} />}
                      {p.nom} {p.prenom} ({p.code_patient})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Field-by-field comparison */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-3 py-2 font-medium">Champ</th>
                      {selectedGroup.patients.map(p => (
                        <th key={p.id} className="text-left px-3 py-2 font-medium">
                          {p.code_patient}
                          {p.id === mergeTarget && <Badge className="ml-1 text-[9px]">Cible</Badge>}
                        </th>
                      ))}
                      <th className="text-left px-3 py-2 font-medium">Combiner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIELDS.map(f => {
                      const isCombined = fieldChoices[f.key] === COMBINE;
                      const combinedPreview = combineValues(selectedGroup.patients.map(p => p[f.key]));
                      return (
                        <tr key={f.key} className="border-t border-border/30">
                          <td className="px-3 py-2 font-medium text-muted-foreground">{f.label}</td>
                          {selectedGroup.patients.map(p => {
                            const val = p[f.key];
                            const isChosen = fieldChoices[f.key] === p.id;
                            return (
                              <td key={p.id} className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => setFieldChoices(prev => ({ ...prev, [f.key]: p.id }))}
                                  className={cn(
                                    'w-full text-left px-2 py-1 rounded text-xs transition-all',
                                    isChosen
                                      ? 'bg-primary/10 border border-primary/30 font-medium'
                                      : 'hover:bg-muted/50 border border-transparent',
                                    isCombined && 'opacity-50'
                                  )}
                                >
                                  {isChosen && <Check size={10} className="inline mr-1 text-primary" />}
                                  {val || <span className="text-muted-foreground italic">vide</span>}
                                </button>
                              </td>
                            );
                          })}
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setFieldChoices(prev => ({
                                ...prev,
                                [f.key]: isCombined ? mergeTarget! : COMBINE,
                              }))}
                              className={cn(
                                'w-full text-left px-2 py-1 rounded text-xs transition-all border',
                                isCombined
                                  ? 'bg-success/10 border-success/30 text-success font-medium'
                                  : 'border-dashed border-border/50 text-muted-foreground hover:bg-muted/40'
                              )}
                              title="Concatène les valeurs distinctes des deux patients"
                            >
                              <Combine size={10} className="inline mr-1" />
                              {isCombined ? (combinedPreview || 'vide') : '+ Combiner'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-muted-foreground -mt-2">
                Astuce : cliquez sur « + Combiner » pour concaténer les valeurs (ex. « diabète + tension »).
              </p>

              {/* Cases summary */}
              <div>
                <p className="text-sm font-medium mb-2">Cas de cancer associés — choisir individuellement :</p>
                <div className="space-y-1">
                  {selectedGroup.patients.flatMap(p =>
                    p.cases.map(c => {
                      const action = caseActions[c.id] || 'keep';
                      return (
                        <div key={c.id} className={cn(
                          'flex items-center gap-2 text-xs p-2 rounded-lg border transition-all',
                          action === 'discard' ? 'bg-destructive/5 border-destructive/30 line-through opacity-60' : 'bg-muted/20 border-transparent'
                        )}>
                          <Badge variant="outline" className="text-[9px]">{p.code_patient}</Badge>
                          <span className="font-medium">{c.type_cancer}</span>
                          <span className="text-muted-foreground">{c.stade_tnm || ''}</span>
                          <ArrowRight size={10} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{new Date(c.date_diagnostic).toLocaleDateString('fr-DZ')}</span>
                          <div className="ml-auto flex gap-1">
                            <button
                              type="button"
                              onClick={() => setCaseActions(prev => ({ ...prev, [c.id]: 'keep' }))}
                              className={cn('px-2 py-0.5 rounded text-[10px] border',
                                action === 'keep' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted')}
                            >
                              <Check size={10} className="inline mr-0.5" /> Conserver
                            </button>
                            <button
                              type="button"
                              onClick={() => setCaseActions(prev => ({ ...prev, [c.id]: 'discard' }))}
                              className={cn('px-2 py-0.5 rounded text-[10px] border',
                                action === 'discard' ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border hover:bg-muted')}
                            >
                              <Trash2 size={10} className="inline mr-0.5" /> Supprimer
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {selectedGroup.patients.every(p => p.cases.length === 0) && (
                    <p className="text-xs text-muted-foreground">Aucun cas associé</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                <Button variant="outline" onClick={() => setSelectedGroup(null)}>Annuler</Button>
                <Button onClick={executeMerge} disabled={merging} className="gap-1.5 bg-warning text-warning-foreground hover:bg-warning/90">
                  {merging ? <Loader2 size={14} className="animate-spin" /> : <Merge size={14} />}
                  Fusionner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
