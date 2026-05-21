import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Loader2, Plus, ArrowLeft, Activity, Pill, AlertCircle, FileText, Upload,
  User, Phone, MapPin, Calendar, IdCard, Heart, Stethoscope, FlaskConical, Download, FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPES_EVENEMENT = ['rechute', 'metastase', 'progression', 'remission'];
const TYPES_TRAITEMENT = ['Chirurgie', 'Chimiothérapie', 'Radiothérapie', 'Immunothérapie', 'Hormonothérapie', 'Thérapie ciblée'];
const EFFICACITE_OPTIONS = ['Réponse complète', 'Réponse partielle', 'Stable', 'Progression'];

interface PatientInfo {
  id: string; nom: string; prenom: string; sexe: string;
  date_naissance: string | null; commune: string | null; wilaya: string | null;
  telephone: string | null; adresse: string | null; num_dossier: string | null; code_patient: string;
}
interface CaseInfo {
  id: string; type_cancer: string; sous_type_cancer: string | null;
  stade_tnm: string | null; grade: string | null; lateralite: string | null;
  date_diagnostic: string; statut: string; statut_vital: string | null;
  date_deces: string | null; cause_deces: string | null;
  code_icdo: string | null; topographie_icdo: string | null; morphologie_icdo: string | null;
  base_diagnostic: string | null; methode_diagnostic: string | null;
  symptomes: string | null; tabagisme: string | null; alcool: string | null; sportif: string | null;
  milieu: string | null; profession: string | null;
  resultat_anapath: string | null; medecin_anapath: string | null; date_anapath: string | null;
  ref_anapath: string | null; anomalies_moleculaires: string | null;
  notes: string | null;
}
interface Rechute { id: string; type_evenement: string; date_evenement: string; localisation: string | null; description: string | null; stade_tnm: string | null; traitement_propose: string | null; created_at: string; }
interface Traitement { id: string; type_traitement: string; date_debut: string; date_fin: string | null; protocole: string | null; efficacite: string | null; effets_secondaires: string | null; medecin_traitant: string | null; notes: string | null; created_at: string; }
interface PatientFile { id: string; file_name: string; file_path: string; file_type: string; file_size: number; mime_type: string | null; created_at: string; }

export default function PatientTimeline() {
  const { user, role } = useAuth();
  const [params] = useSearchParams();
  const caseId = params.get('case');
  const initialTab = params.get('tab') === 'patient' ? 'patient' : 'cancer';

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [rechutes, setRechutes] = useState<Rechute[]>([]);
  const [traitements, setTraitements] = useState<Traitement[]>([]);
  const [files, setFiles] = useState<PatientFile[]>([]);

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [showRechute, setShowRechute] = useState(false);
  const [showTraitement, setShowTraitement] = useState(false);
  const [showDeces, setShowDeces] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rechForm, setRechForm] = useState({ type_evenement: 'rechute', date_evenement: '', localisation: '', description: '', stade_tnm: '', traitement_propose: '' });
  const [traitForm, setTraitForm] = useState({ type_traitement: 'Chimiothérapie', date_debut: '', date_fin: '', protocole: '', efficacite: '', effets_secondaires: '', medecin_traitant: '', notes: '' });
  const [decesForm, setDecesForm] = useState({ date_deces: '', cause_deces: '' });

  useEffect(() => { if (caseId) fetchData(); }, [caseId]);

  const fetchData = async () => {
    setLoading(true);
    const { data: caseData } = await supabase
      .from('cancer_cases')
      .select('*, patients(*)')
      .eq('id', caseId!).single();

    if (caseData) {
      const { patients: p, ...rest } = caseData as any;
      setCaseInfo(rest as CaseInfo);
      setPatient(p);

      const { data: rechData } = await supabase.from('cancer_rechutes').select('*').eq('case_id', caseId!).order('date_evenement', { ascending: true });
      setRechutes((rechData as Rechute[]) || []);
      const { data: traitData } = await supabase.from('traitements').select('*').eq('case_id', caseId!).order('date_debut', { ascending: true });
      setTraitements((traitData as Traitement[]) || []);
      const { data: filesData } = await supabase.from('patient_files').select('id, file_name, file_path, file_type, file_size, mime_type, created_at').eq('patient_id', p.id).order('created_at', { ascending: false });
      setFiles((filesData as PatientFile[]) || []);
    }
    setLoading(false);
  };

  const downloadFile = async (f: PatientFile) => {
    const { data, error } = await supabase.storage.from('patient-files').createSignedUrl(f.file_path, 60);
    if (error || !data) { toast.error('Erreur de téléchargement'); return; }
    window.open(data.signedUrl, '_blank');
  };

  const addRechute = async () => {
    if (!caseId || !user) return;
    setSaving(true);
    const { error } = await supabase.from('cancer_rechutes').insert({
      case_id: caseId, type_evenement: rechForm.type_evenement, date_evenement: rechForm.date_evenement,
      localisation: rechForm.localisation || null, description: rechForm.description || null,
      stade_tnm: rechForm.stade_tnm || null, traitement_propose: rechForm.traitement_propose || null, created_by: user.id,
    });
    if (error) toast.error(error.message);
    else { toast.success('Événement ajouté'); setShowRechute(false); fetchData(); }
    setSaving(false);
  };

  const addTraitement = async () => {
    if (!caseId || !user) return;
    setSaving(true);
    const { error } = await supabase.from('traitements').insert({
      case_id: caseId, type_traitement: traitForm.type_traitement, date_debut: traitForm.date_debut,
      date_fin: traitForm.date_fin || null, protocole: traitForm.protocole || null, efficacite: traitForm.efficacite || null,
      effets_secondaires: traitForm.effets_secondaires || null, medecin_traitant: traitForm.medecin_traitant || null,
      notes: traitForm.notes || null, created_by: user.id,
    });
    if (error) toast.error(error.message);
    else { toast.success('Traitement ajouté'); setShowTraitement(false); fetchData(); }
    setSaving(false);
  };

  const markAsDeceased = async () => {
    if (!caseId || !decesForm.date_deces) return;
    setSaving(true);
    const { error } = await supabase.from('cancer_cases').update({
      statut_vital: 'decede',
      date_deces: decesForm.date_deces,
      cause_deces: decesForm.cause_deces || null,
      date_derniere_nouvelle: decesForm.date_deces,
    }).eq('id', caseId);
    if (error) toast.error(error.message);
    else { toast.success('Statut mis à jour — patient enregistré comme décédé'); setShowDeces(false); fetchData(); }
    setSaving(false);
  };

  const markAsAlive = async () => {
    if (!caseId) return;
    setSaving(true);
    const { error } = await supabase.from('cancer_cases').update({
      statut_vital: 'vivant',
      date_deces: null,
      cause_deces: null,
    }).eq('id', caseId);
    if (error) toast.error(error.message);
    else { toast.success('Statut rétabli à vivant'); fetchData(); }
    setSaving(false);
  };

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Seuls les fichiers PDF sont acceptés'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop volumineux (max 10 Mo)'); return; }
    setOcrLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(arrayBuffer));
      const textParts: string[] = [];
      const regex = /\(([^)]+)\)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const part = match[1];
        if (part.length > 2 && /[a-zA-ZÀ-ÿ]/.test(part)) textParts.push(part);
      }
      let extractedText = textParts.join(' ');
      if (extractedText.length < 50) extractedText = text.replace(/[^\x20-\x7EÀ-ÿ\n]/g, ' ').replace(/\s+/g, ' ').trim();
      if (extractedText.length < 20) { toast.error('Impossible d\'extraire le texte du PDF'); setOcrLoading(false); return; }
      const { data, error } = await supabase.functions.invoke('ocr-anapath', { body: { text: extractedText.slice(0, 8000) } });
      if (error) throw error;
      setOcrResult(data);
      toast.success('📄 Données extraites par IA');
    } catch (err: any) { toast.error(err.message || 'Erreur OCR'); }
    finally { setOcrLoading(false); }
  };

  const applyOcrToCase = async () => {
    if (!ocrResult || !caseId) return;
    setSaving(true);
    const updateData: any = {};
    if (ocrResult.medecinAnapath) updateData.medecin_anapath = ocrResult.medecinAnapath;
    if (ocrResult.dateAnapath) updateData.date_anapath = ocrResult.dateAnapath;
    if (ocrResult.refAnapath) updateData.ref_anapath = ocrResult.refAnapath;
    if (ocrResult.typeCancer) updateData.type_cancer = ocrResult.typeCancer;
    if (ocrResult.sousTypeCancer) updateData.sous_type_cancer = ocrResult.sousTypeCancer;
    if (ocrResult.anomaliesMoleculaires) updateData.anomalies_moleculaires = ocrResult.anomaliesMoleculaires;
    if (ocrResult.resultatAnapath) updateData.resultat_anapath = ocrResult.resultatAnapath;
    if (ocrResult.stadePathologique) updateData.stade_tnm = ocrResult.stadePathologique;
    const { error } = await supabase.from('cancer_cases').update(updateData).eq('id', caseId);
    if (error) toast.error(error.message);
    else { toast.success('✅ Dossier mis à jour'); setOcrResult(null); fetchData(); }
    setSaving(false);
  };

  const isDeceased = caseInfo?.statut_vital === 'decede';
  const canEdit = (role === 'medecin' || role === 'admin') && !isDeceased;

  const eventColor = (type: string) => {
    switch (type) {
      case 'rechute': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'metastase': return 'bg-warning/10 text-warning border-warning/20';
      case 'progression': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'remission': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const fileIcon = (type: string) => {
    if (/scanner|irm|pet|radio/i.test(type)) return '🏥';
    if (/compte|rendu/i.test(type)) return '📋';
    if (/anapath|biopsie/i.test(type)) return '🧬';
    if (/bio|sang/i.test(type)) return '🩸';
    return '📄';
  };

  if (loading) return (<AppLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div></AppLayout>);
  if (!caseInfo || !patient) return (
    <AppLayout>
      <div className="text-center py-20">
        <p className="text-muted-foreground">Cas non trouvé</p>
        <Link to="/cas"><Button className="mt-4" variant="secondary">Retour</Button></Link>
      </div>
    </AppLayout>
  );

  const age = patient.date_naissance ? new Date().getFullYear() - new Date(patient.date_naissance).getFullYear() : null;

  const timeline = [
    { date: caseInfo.date_diagnostic, type: 'diagnostic', label: `Diagnostic: ${caseInfo.type_cancer}${caseInfo.sous_type_cancer ? ` (${caseInfo.sous_type_cancer})` : ''}`, detail: caseInfo.stade_tnm ? `Stade: ${caseInfo.stade_tnm}` : null },
    ...rechutes.map(r => ({ date: r.date_evenement, type: r.type_evenement, label: `${r.type_evenement.charAt(0).toUpperCase() + r.type_evenement.slice(1)}${r.localisation ? ` — ${r.localisation}` : ''}`, detail: r.description })),
    ...traitements.map(t => ({ date: t.date_debut, type: 'traitement', label: `${t.type_traitement}${t.protocole ? ` (${t.protocole})` : ''}`, detail: t.efficacite ? `Résultat: ${t.efficacite}` : null })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const Field = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
    <div className="flex items-start gap-2 py-2 border-b border-border/40 last:border-0">
      {Icon && <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-medium break-words">{value || <span className="text-muted-foreground italic">—</span>}</p>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/cas"><Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button></Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold truncate">{patient.nom} {patient.prenom}</h1>
            <p className="text-muted-foreground text-sm">
              {patient.sexe === 'M' ? '♂' : '♀'} · {patient.commune || patient.wilaya || 'N/A'}
              {age !== null && ` · ${age} ans`} · <span className="font-mono">{patient.code_patient}</span>
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">{caseInfo.type_cancer}</Badge>
        </div>

        {isDeceased && (
          <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
            <AlertCircle className="text-destructive shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Patient décédé — Dossier en lecture seule</p>
              <p className="text-sm text-muted-foreground mt-1">
                Décès enregistré le {caseInfo.date_deces ? new Date(caseInfo.date_deces).toLocaleDateString('fr-DZ') : '—'}
                {caseInfo.cause_deces && ` · ${caseInfo.cause_deces}`}.
                Aucun nouveau traitement, événement ou document clinique ne peut être ajouté.
                Conformément à la pratique des registres IARC, seules les corrections d'historique par un administrateur sont autorisées.
              </p>
            </div>
          </div>
        )}


        <Tabs defaultValue={initialTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="patient" className="gap-2 text-sm"><User size={15} /> Dossier Patient</TabsTrigger>
            <TabsTrigger value="cancer" className="gap-2 text-sm"><Activity size={15} /> Dossier Cancer</TabsTrigger>
          </TabsList>

          {/* ===== DOSSIER PATIENT ===== */}
          <TabsContent value="patient" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="stat-card">
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                  <IdCard size={16} /> Identité
                </h3>
                <Field label="Nom" value={patient.nom} icon={User} />
                <Field label="Prénom" value={patient.prenom} icon={User} />
                <Field label="Sexe" value={patient.sexe === 'M' ? 'Masculin' : 'Féminin'} />
                <Field label="Date de naissance" value={patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString('fr-DZ') : null} icon={Calendar} />
                <Field label="Âge" value={age ? `${age} ans` : null} />
                <Field label="Code patient" value={patient.code_patient} />
                <Field label="N° dossier hospitalier" value={patient.num_dossier} />
              </div>
              <div className="stat-card">
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                  <Phone size={16} /> Coordonnées
                </h3>
                <Field label="Téléphone" value={patient.telephone} icon={Phone} />
                <Field label="Adresse" value={patient.adresse} icon={MapPin} />
                <Field label="Commune" value={patient.commune} icon={MapPin} />
                <Field label="Wilaya" value={patient.wilaya} icon={MapPin} />
              </div>
            </div>

            {(caseInfo.tabagisme || caseInfo.alcool || caseInfo.sportif || caseInfo.profession || caseInfo.milieu) && (
              <div className="stat-card">
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                  <Heart size={16} /> Mode de vie & contexte
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                  <Field label="Tabagisme" value={caseInfo.tabagisme} />
                  <Field label="Alcool" value={caseInfo.alcool} />
                  <Field label="Activité sportive" value={caseInfo.sportif} />
                  <Field label="Profession" value={caseInfo.profession} />
                  <Field label="Milieu de vie" value={caseInfo.milieu} />
                </div>
              </div>
            )}
          </TabsContent>

          {/* ===== DOSSIER CANCER ===== */}
          <TabsContent value="cancer" className="space-y-4">
            <Tabs defaultValue="synthese" className="space-y-4">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                <TabsTrigger value="synthese"><Stethoscope size={13} className="mr-1" /> Synthèse</TabsTrigger>
                <TabsTrigger value="timeline"><Activity size={13} className="mr-1" /> Timeline</TabsTrigger>
                <TabsTrigger value="traitements"><Pill size={13} className="mr-1" /> Traitements</TabsTrigger>
                <TabsTrigger value="rechutes"><AlertCircle size={13} className="mr-1" /> Évolution</TabsTrigger>
                <TabsTrigger value="anapath"><FlaskConical size={13} className="mr-1" /> Anatomopathologie</TabsTrigger>
                <TabsTrigger value="documents"><FolderOpen size={13} className="mr-1" /> Documents ({files.length})</TabsTrigger>
              </TabsList>

              {/* Synthèse */}
              <TabsContent value="synthese" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat-card">
                    <h3 className="font-display font-semibold text-sm mb-3 text-primary">🩺 Diagnostic</h3>
                    <Field label="Type de cancer" value={caseInfo.type_cancer} />
                    <Field label="Sous-type" value={caseInfo.sous_type_cancer} />
                    <Field label="Date diagnostic" value={new Date(caseInfo.date_diagnostic).toLocaleDateString('fr-DZ')} icon={Calendar} />
                    <Field label="Méthode" value={caseInfo.methode_diagnostic} />
                    <Field label="Base du diagnostic (IARC)" value={caseInfo.base_diagnostic} />
                    <Field label="Symptômes" value={caseInfo.symptomes} />
                  </div>
                  <div className="stat-card">
                    <h3 className="font-display font-semibold text-sm mb-3 text-primary">🔬 Classification IARC / OMS</h3>
                    <Field label="Code CIM-O" value={caseInfo.code_icdo} />
                    <Field label="Topographie ICD-O" value={caseInfo.topographie_icdo} />
                    <Field label="Morphologie ICD-O" value={caseInfo.morphologie_icdo} />
                    <Field label="Stade TNM" value={caseInfo.stade_tnm} />
                    <Field label="Grade" value={caseInfo.grade} />
                    <Field label="Latéralité" value={caseInfo.lateralite} />
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-sm text-primary">❤️ Statut vital</h3>
                    {(role === 'medecin' || role === 'admin') && (
                      isDeceased ? (
                        <Button variant="outline" size="sm" onClick={markAsAlive} disabled={saving}>
                          ↩️ Annuler le décès
                        </Button>
                      ) : (
                        <Dialog open={showDeces} onOpenChange={setShowDeces}>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">Déclarer décédé</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Déclarer le décès du patient</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <p className="text-xs text-muted-foreground">
                                Cette action verrouille le dossier en lecture seule (conformément aux pratiques IARC).
                                Une trace est conservée dans le journal d'audit.
                              </p>
                              <div>
                                <Label>Date de décès *</Label>
                                <Input
                                  type="date"
                                  value={decesForm.date_deces}
                                  max={new Date().toISOString().split('T')[0]}
                                  onChange={e => setDecesForm(f => ({ ...f, date_deces: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>Cause du décès</Label>
                                <Textarea
                                  value={decesForm.cause_deces}
                                  onChange={e => setDecesForm(f => ({ ...f, cause_deces: e.target.value }))}
                                  rows={3}
                                  placeholder="Ex: Évolution métastatique, complication infectieuse, autre…"
                                />
                              </div>
                              <Button
                                onClick={markAsDeceased}
                                disabled={!decesForm.date_deces || saving}
                                variant="destructive"
                                className="w-full"
                              >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmer le décès
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                    <Field label="Statut" value={caseInfo.statut_vital === 'decede' ? 'Décédé' : '💚 Vivant'} />
                    <Field label="Date de décès" value={caseInfo.date_deces ? new Date(caseInfo.date_deces).toLocaleDateString('fr-DZ') : null} />
                    <Field label="Cause" value={caseInfo.cause_deces} />
                  </div>
                </div>
                {caseInfo.notes && (
                  <div className="stat-card">
                    <h3 className="font-display font-semibold text-sm mb-2 text-primary">📝 Notes</h3>
                    <p className="text-sm whitespace-pre-wrap">{caseInfo.notes}</p>
                  </div>
                )}
              </TabsContent>

              {/* Timeline */}
              <TabsContent value="timeline">
                <div className="stat-card space-y-0">
                  {timeline.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Aucun événement enregistré</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                      {timeline.map((evt, i) => (
                        <div key={i} className="relative pl-10 pb-6 last:pb-0">
                          <div className={cn('absolute left-2 top-1 w-5 h-5 rounded-full border-2 border-background',
                            evt.type === 'diagnostic' ? 'bg-primary' : evt.type === 'traitement' ? 'bg-chart-2' : evt.type === 'remission' ? 'bg-success' : 'bg-destructive')} />
                          <div className="stat-card !p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">{new Date(evt.date).toLocaleDateString('fr-DZ')}</span>
                              <Badge variant="outline" className={cn('text-xs', eventColor(evt.type))}>{evt.type}</Badge>
                            </div>
                            <p className="text-sm font-medium">{evt.label}</p>
                            {evt.detail && <p className="text-xs text-muted-foreground mt-1">{evt.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Traitements */}
              <TabsContent value="traitements" className="space-y-3">
                {canEdit && (
                  <Dialog open={showTraitement} onOpenChange={setShowTraitement}>
                    <DialogTrigger asChild><Button className="w-full h-11"><Plus size={16} className="mr-1" /> Ajouter un traitement</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Nouveau Traitement</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <div><Label>Type *</Label>
                          <Select value={traitForm.type_traitement} onValueChange={v => setTraitForm(f => ({ ...f, type_traitement: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{TYPES_TRAITEMENT.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Date début *</Label><Input type="date" value={traitForm.date_debut} onChange={e => setTraitForm(f => ({ ...f, date_debut: e.target.value }))} /></div>
                          <div><Label>Date fin</Label><Input type="date" value={traitForm.date_fin} onChange={e => setTraitForm(f => ({ ...f, date_fin: e.target.value }))} /></div>
                        </div>
                        <div><Label>Protocole</Label><Input value={traitForm.protocole} onChange={e => setTraitForm(f => ({ ...f, protocole: e.target.value }))} placeholder="Ex: FOLFOX, AC-T..." /></div>
                        <div><Label>Efficacité</Label>
                          <Select value={traitForm.efficacite} onValueChange={v => setTraitForm(f => ({ ...f, efficacite: v }))}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                            <SelectContent>{EFFICACITE_OPTIONS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Effets secondaires</Label><Textarea value={traitForm.effets_secondaires} onChange={e => setTraitForm(f => ({ ...f, effets_secondaires: e.target.value }))} rows={2} /></div>
                        <div><Label>Médecin traitant</Label><Input value={traitForm.medecin_traitant} onChange={e => setTraitForm(f => ({ ...f, medecin_traitant: e.target.value }))} /></div>
                        <Button onClick={addTraitement} disabled={!traitForm.date_debut || saving} className="w-full">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {traitements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucun traitement enregistré</div>
                ) : traitements.map(t => (
                  <div key={t.id} className="stat-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">{t.type_traitement}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(t.date_debut).toLocaleDateString('fr-DZ')}{t.date_fin && ` → ${new Date(t.date_fin).toLocaleDateString('fr-DZ')}`}</span>
                    </div>
                    {t.protocole && <p className="text-sm"><span className="font-medium">Protocole:</span> {t.protocole}</p>}
                    {t.efficacite && <p className="text-sm"><span className="font-medium">Résultat:</span> {t.efficacite}</p>}
                    {t.effets_secondaires && <p className="text-sm text-muted-foreground mt-1">{t.effets_secondaires}</p>}
                    {t.medecin_traitant && <p className="text-xs text-muted-foreground mt-1">Dr. {t.medecin_traitant}</p>}
                  </div>
                ))}
              </TabsContent>

              {/* Rechutes / Évolution */}
              <TabsContent value="rechutes" className="space-y-3">
                {canEdit && (
                  <Dialog open={showRechute} onOpenChange={setShowRechute}>
                    <DialogTrigger asChild><Button variant="destructive" className="w-full h-11"><Plus size={16} className="mr-1" /> Ajouter un événement</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Nouvel Événement</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <div><Label>Type *</Label>
                          <Select value={rechForm.type_evenement} onValueChange={v => setRechForm(f => ({ ...f, type_evenement: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{TYPES_EVENEMENT.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Date *</Label><Input type="date" value={rechForm.date_evenement} onChange={e => setRechForm(f => ({ ...f, date_evenement: e.target.value }))} /></div>
                        <div><Label>Localisation</Label><Input value={rechForm.localisation} onChange={e => setRechForm(f => ({ ...f, localisation: e.target.value }))} placeholder="Ex: Foie, Os, Cerveau..." /></div>
                        <div><Label>Description</Label><Textarea value={rechForm.description} onChange={e => setRechForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
                        <div><Label>Stade TNM</Label><Input value={rechForm.stade_tnm} onChange={e => setRechForm(f => ({ ...f, stade_tnm: e.target.value }))} placeholder="Ex: T3N2M1" /></div>
                        <Button onClick={addRechute} disabled={!rechForm.date_evenement || saving} className="w-full">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {rechutes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Aucune évolution enregistrée</div>
                ) : rechutes.map(r => (
                  <div key={r.id} className="stat-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={eventColor(r.type_evenement)}>{r.type_evenement}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(r.date_evenement).toLocaleDateString('fr-DZ')}</span>
                    </div>
                    {r.localisation && <p className="text-sm"><span className="font-medium">Localisation:</span> {r.localisation}</p>}
                    {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                    {r.stade_tnm && <p className="text-sm"><span className="font-medium">Stade:</span> {r.stade_tnm}</p>}
                  </div>
                ))}
              </TabsContent>

              {/* Anapath */}
              <TabsContent value="anapath" className="space-y-4">
                <div className="stat-card">
                  <h3 className="font-display font-semibold text-sm mb-3 text-primary">🧬 Données anatomopathologiques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <Field label="Référence anapath" value={caseInfo.ref_anapath} />
                    <Field label="Date anapath" value={caseInfo.date_anapath ? new Date(caseInfo.date_anapath).toLocaleDateString('fr-DZ') : null} />
                    <Field label="Médecin anapath" value={caseInfo.medecin_anapath} />
                    <Field label="Anomalies moléculaires" value={caseInfo.anomalies_moleculaires} />
                  </div>
                  {caseInfo.resultat_anapath && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Résultat complet</p>
                      <p className="text-sm whitespace-pre-wrap">{caseInfo.resultat_anapath}</p>
                    </div>
                  )}
                </div>
                <div className="stat-card space-y-4 border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Upload className="text-primary" size={24} /></div>
                    <div>
                      <h3 className="font-display font-semibold">📄 OCR Anapath IA</h3>
                      <p className="text-muted-foreground text-xs">Uploadez un PDF — l'IA extraira les données automatiquement</p>
                    </div>
                  </div>
                  <Input type="file" accept=".pdf" onChange={handleOcrUpload} disabled={ocrLoading || isDeceased} />
                  {isDeceased && <p className="text-xs text-destructive">⚠️ Patient décédé — extraction IA désactivée.</p>}
                  {ocrLoading && <div className="flex items-center gap-2 text-primary text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Analyse IA en cours…</div>}
                </div>
                {ocrResult && (
                  <div className="stat-card space-y-3 border-success/30 bg-success/5">
                    <h3 className="font-semibold text-success flex items-center gap-2"><Badge className="bg-success/10 text-success border-success/20">IA</Badge> Données extraites</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {ocrResult.medecinAnapath && <p><span className="font-medium">Médecin:</span> {ocrResult.medecinAnapath}</p>}
                      {ocrResult.dateAnapath && <p><span className="font-medium">Date:</span> {ocrResult.dateAnapath}</p>}
                      {ocrResult.refAnapath && <p><span className="font-medium">Réf:</span> {ocrResult.refAnapath}</p>}
                      {ocrResult.typeCancer && <p><span className="font-medium">Type:</span> {ocrResult.typeCancer}</p>}
                      {ocrResult.stadePathologique && <p><span className="font-medium">Stade:</span> {ocrResult.stadePathologique}</p>}
                      {ocrResult.resultatAnapath && <p className="md:col-span-2"><span className="font-medium">Résultat:</span> {ocrResult.resultatAnapath}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={applyOcrToCase} disabled={saving} className="flex-1">{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} ✅ Appliquer</Button>
                      <Button variant="secondary" onClick={() => setOcrResult(null)}>Annuler</Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-3">
                <div className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-2 text-primary">
                      <FolderOpen size={16} /> Documents du dossier ({files.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">Ajoutés via Nouveau cas → Documents</p>
                  </div>
                  {files.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Aucun document</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files.map(f => (
                        <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                          <div className="text-2xl">{fileIcon(f.file_type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{f.file_name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-[10px]">{f.file_type}</Badge>
                              <span>{(f.file_size / 1024).toFixed(0)} Ko</span>
                              <span>·</span>
                              <span>{new Date(f.created_at).toLocaleDateString('fr-DZ')}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => downloadFile(f)} className="shrink-0">
                            <Download size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
