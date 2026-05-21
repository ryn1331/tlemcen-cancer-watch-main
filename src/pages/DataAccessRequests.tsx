import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2, Plus, FileSearch, Check, X, Download, Database,
  Clock, CheckCircle2, XCircle, FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface RequestRow {
  id: string;
  requester_id: string | null;
  researcher_name: string;
  researcher_email: string;
  institution: string;
  project_title: string;
  justification: string;
  fields_requested: string[];
  filters: any;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  decision_note: string | null;
  decided_at: string | null;
  created_at: string;
}

const AVAILABLE_FIELDS = [
  { key: 'sexe', label: 'Sexe' },
  { key: 'tranche_age', label: "Tranche d'âge" },
  { key: 'wilaya', label: 'Wilaya' },
  { key: 'milieu', label: 'Milieu (urbain/rural)' },
  { key: 'date_diagnostic', label: 'Année de diagnostic' },
  { key: 'type_cancer', label: 'Type de cancer' },
  { key: 'topographie_icdo', label: 'Topographie CIM-O' },
  { key: 'morphologie_icdo', label: 'Morphologie CIM-O' },
  { key: 'stade_tnm', label: 'Stade TNM' },
  { key: 'grade', label: 'Grade' },
  { key: 'statut_vital', label: 'Statut vital' },
];

const STATUS_META: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
  pending:   { label: 'En attente',     icon: Clock,        cls: 'bg-warning/10 text-warning border-warning/20' },
  approved:  { label: 'Approuvée',      icon: CheckCircle2, cls: 'bg-success/10 text-success border-success/20' },
  rejected:  { label: 'Refusée',        icon: XCircle,      cls: 'bg-destructive/10 text-destructive border-destructive/20' },
  fulfilled: { label: 'Export généré',  icon: FileCheck,    cls: 'bg-primary/10 text-primary border-primary/20' },
};

export default function DataAccessRequests() {
  const { role, user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('mine');

  // Decision dialog
  const [decisionTarget, setDecisionTarget] = useState<{ id: string; action: 'approved' | 'rejected'; project: string } | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  // Form
  const [form, setForm] = useState({
    researcher_name: '', researcher_email: '', institution: '',
    project_title: '', justification: '',
  });
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = role === 'admin';

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('data_access_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const submit = async () => {
    if (!user) return;
    if (!form.researcher_name || !form.institution || !form.project_title || !form.justification || selectedFields.length === 0) {
      toast.error('Tous les champs sont requis et au moins une variable doit être sélectionnée');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('data_access_requests').insert({
      requester_id: user.id,
      ...form,
      fields_requested: selectedFields as any,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Demande soumise — un administrateur va l\'examiner');
    setOpen(false);
    setForm({ researcher_name: '', researcher_email: '', institution: '', project_title: '', justification: '' });
    setSelectedFields([]);
    load();
  };

  const decide = async (id: string, status: 'approved' | 'rejected', note: string) => {
    if (!user) return;
    const { error } = await supabase.from('data_access_requests').update({
      status, decision_note: note, decided_by: user.id, decided_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'}`);
    setDecisionTarget(null);
    setDecisionNote('');
    load();
  };

  // K-anonymity (k=5) export
  const generateExport = async (req: RequestRow) => {
    toast.info('Génération de l\'export anonymisé…');
    const fields = req.fields_requested.filter(f => AVAILABLE_FIELDS.find(af => af.key === f));
    if (fields.length === 0) return;

    const needsPatient = fields.some(f => ['sexe', 'wilaya', 'tranche_age'].includes(f));
    const caseFields = fields.filter(f => !['sexe', 'wilaya', 'tranche_age'].includes(f));
    const sel = ['id', ...caseFields, needsPatient ? 'patient_id' : ''].filter(Boolean).join(',');

    const { data: cases } = await supabase.from('cancer_cases').select(sel).eq('statut', 'valide').limit(5000);
    if (!cases) { toast.error('Aucune donnée'); return; }

    let patientsMap: Record<string, any> = {};
    if (needsPatient) {
      const ids = Array.from(new Set((cases as any).map((c: any) => c.patient_id).filter(Boolean)));
      const { data: pts } = await supabase.from('patients').select('id, sexe, wilaya, date_naissance').in('id', ids as string[]);
      pts?.forEach((p: any) => { patientsMap[p.id] = p; });
    }

    const ageGroup = (dob: string | null) => {
      if (!dob) return 'inconnu';
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      if (age < 15) return '0-14';
      if (age < 30) return '15-29';
      if (age < 45) return '30-44';
      if (age < 60) return '45-59';
      if (age < 75) return '60-74';
      return '75+';
    };

    const rows: any[] = (cases as any).map((c: any) => {
      const out: any = {};
      fields.forEach(f => {
        if (f === 'sexe') out.sexe = patientsMap[c.patient_id]?.sexe || '';
        else if (f === 'wilaya') out.wilaya = patientsMap[c.patient_id]?.wilaya || '';
        else if (f === 'tranche_age') out.tranche_age = ageGroup(patientsMap[c.patient_id]?.date_naissance);
        else if (f === 'date_diagnostic') out.date_diagnostic = c.date_diagnostic ? new Date(c.date_diagnostic).getFullYear() : '';
        else out[f] = c[f] || '';
      });
      return out;
    });

    const key = (r: any) => fields.map(f => r[f]).join('|');
    const groups: Record<string, any[]> = {};
    rows.forEach(r => { const k = key(r); (groups[k] = groups[k] || []).push(r); });
    const safe = Object.values(groups).filter(g => g.length >= 5).flat();
    const suppressed = rows.length - safe.length;

    if (safe.length === 0) {
      toast.error(`Toutes les lignes (${rows.length}) sont supprimées par k=5. Ajoutez moins de variables.`);
      return;
    }

    const header = fields.join(',');
    const csv = [header, ...safe.map(r => fields.map(f => `"${String(r[f] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_anonymise_${req.id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    await supabase.from('data_access_requests').update({ status: 'fulfilled' }).eq('id', req.id);
    toast.success(`Export généré : ${safe.length} lignes (${suppressed} supprimées par k-anonymité k=5)`);
    load();
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="animate-spin" aria-hidden="true" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;

  const myRequests = requests.filter(r => r.requester_id === user.id);
  const allPending = requests.filter(r => r.status === 'pending');

  const openDecision = (id: string, action: 'approved' | 'rejected', project: string) => {
    setDecisionTarget({ id, action, project });
    setDecisionNote(action === 'approved' ? 'Approuvée' : '');
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <header className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <FileSearch className="text-primary" aria-hidden="true" /> Demandes d'accès aux données
            </h1>
            <p className="text-muted-foreground mt-1">
              Module conforme ANPDP — exports anonymisés (k-anonymité k=5)
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus size={14} className="mr-2" aria-hidden="true" />Nouvelle demande</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Demande d'accès aux données du registre</DialogTitle>
                <DialogDescription>
                  Renseignez les informations du chercheur et les variables nécessaires. Tous les champs marqués
                  d'un astérisque sont obligatoires.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dar-name" required>Nom du chercheur</Label>
                    <Input id="dar-name" autoComplete="name" autoCapitalize="words" value={form.researcher_name} onChange={e => setForm({ ...form, researcher_name: e.target.value })} aria-required="true" />
                  </div>
                  <div>
                    <Label htmlFor="dar-email" required>Email</Label>
                    <Input id="dar-email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={form.researcher_email} onChange={e => setForm({ ...form, researcher_email: e.target.value })} aria-required="true" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dar-inst" required>Institution</Label>
                  <Input id="dar-inst" autoComplete="organization" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} aria-required="true" />
                </div>
                <div>
                  <Label htmlFor="dar-title" required>Titre du projet</Label>
                  <Input id="dar-title" value={form.project_title} onChange={e => setForm({ ...form, project_title: e.target.value })} aria-required="true" />
                </div>
                <div>
                  <Label htmlFor="dar-just" required>Justification scientifique</Label>
                  <Textarea id="dar-just" rows={4} value={form.justification} onChange={e => setForm({ ...form, justification: e.target.value })} aria-required="true" />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium mb-2">Variables demandées <span aria-hidden="true" className="text-destructive">*</span><span className="sr-only">(requis)</span> — k=5 sera appliqué</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-lg p-3 max-h-60 overflow-y-auto">
                    {AVAILABLE_FIELDS.map(f => {
                      const id = `dar-field-${f.key}`;
                      const checked = selectedFields.includes(f.key);
                      return (
                        <div key={f.key} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(c) => setSelectedFields(c
                              ? [...selectedFields, f.key]
                              : selectedFields.filter(s => s !== f.key))}
                          />
                          <Label htmlFor={id} className="cursor-pointer font-normal">{f.label}</Label>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2" aria-live="polite">
                    {selectedFields.length} variable{selectedFields.length > 1 ? 's' : ''} sélectionnée{selectedFields.length > 1 ? 's' : ''}
                  </p>
                </fieldset>
                <Button className="w-full" onClick={submit} disabled={submitting} aria-busy={submitting}>
                  {submitting && <Loader2 className="animate-spin mr-2" size={14} aria-hidden="true" />}
                  Soumettre la demande
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList aria-label="Filtrer les demandes">
            <TabsTrigger value="mine">Mes demandes ({myRequests.length})</TabsTrigger>
            {isAdmin && <TabsTrigger value="pending">À traiter ({allPending.length})</TabsTrigger>}
            {isAdmin && <TabsTrigger value="all">Toutes ({requests.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="mine" className="space-y-3 mt-4">
            <RequestList rows={myRequests} loading={loading} isAdmin={false} onDecide={openDecision} onExport={generateExport} />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="pending" className="space-y-3 mt-4">
              <RequestList rows={allPending} loading={loading} isAdmin onDecide={openDecision} onExport={generateExport} />
            </TabsContent>
          )}
          {isAdmin && (
            <TabsContent value="all" className="space-y-3 mt-4">
              <RequestList rows={requests} loading={loading} isAdmin onDecide={openDecision} onExport={generateExport} />
            </TabsContent>
          )}
        </Tabs>

        {/* Accessible decision dialog (replaces window.prompt) */}
        <Dialog open={!!decisionTarget} onOpenChange={(v) => { if (!v) { setDecisionTarget(null); setDecisionNote(''); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {decisionTarget?.action === 'approved' ? 'Approuver la demande' : 'Refuser la demande'}
              </DialogTitle>
              <DialogDescription>
                « {decisionTarget?.project} » — {decisionTarget?.action === 'approved'
                  ? 'Une note peut être ajoutée pour le demandeur.'
                  : 'Veuillez préciser le motif du refus.'}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="decision-note" required={decisionTarget?.action === 'rejected'}>
                {decisionTarget?.action === 'approved' ? 'Note (optionnelle)' : 'Motif du refus'}
              </Label>
              <Textarea
                id="decision-note"
                rows={3}
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                aria-required={decisionTarget?.action === 'rejected'}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDecisionTarget(null); setDecisionNote(''); }}>Annuler</Button>
              <Button
                variant={decisionTarget?.action === 'rejected' ? 'destructive' : 'default'}
                disabled={decisionTarget?.action === 'rejected' && !decisionNote.trim()}
                onClick={() => {
                  if (!decisionTarget) return;
                  decide(decisionTarget.id, decisionTarget.action, decisionNote.trim() || (decisionTarget.action === 'approved' ? 'Approuvée' : ''));
                }}
              >
                {decisionTarget?.action === 'approved' ? 'Approuver' : 'Refuser'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

function RequestList({
  rows, loading, isAdmin, onDecide, onExport,
}: {
  rows: RequestRow[]; loading: boolean; isAdmin: boolean;
  onDecide: (id: string, status: 'approved' | 'rejected', project: string) => void;
  onExport: (r: RequestRow) => void;
}) {
  if (loading) return (
    <div className="flex justify-center py-8" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Chargement des demandes…</span>
    </div>
  );
  if (rows.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">Aucune demande</p>;
  return (
    <ul className="space-y-3 list-none p-0" aria-live="polite">
      {rows.map(r => {
        const meta = STATUS_META[r.status];
        const StatusIcon = meta.icon;
        return (
          <li key={r.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle className="text-base">{r.project_title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.researcher_name} · {r.institution}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${meta.cls} gap-1`}>
                    <StatusIcon size={12} aria-hidden="true" />
                    <span>{meta.label}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{r.justification}</p>
                <div className="flex flex-wrap gap-1" aria-label="Variables demandées">
                  {(r.fields_requested || []).map((f: string) => (
                    <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
                {r.decision_note && (
                  <div className="text-sm bg-muted/50 p-2 rounded border-l-2 border-primary">
                    <strong>Décision :</strong> {r.decision_note}
                  </div>
                )}
                {isAdmin && r.status === 'pending' && (
                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button size="sm" onClick={() => onDecide(r.id, 'approved', r.project_title)}>
                      <Check size={14} className="mr-1" aria-hidden="true" />Approuver
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDecide(r.id, 'rejected', r.project_title)}>
                      <X size={14} className="mr-1" aria-hidden="true" />Refuser
                    </Button>
                  </div>
                )}
                {isAdmin && r.status === 'approved' && (
                  <Button size="sm" onClick={() => onExport(r)}>
                    <Database size={14} className="mr-1" aria-hidden="true" />Générer export anonymisé
                  </Button>
                )}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
