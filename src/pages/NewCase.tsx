import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Loader2, AlertTriangle, User, Stethoscope, FlaskConical, HeartPulse,
  FileText, MapPin, Microscope, Activity, Shield, Search, CheckCircle2, XCircle,
  FolderOpen, Upload,
} from 'lucide-react';
import PatientFileUpload from '@/components/PatientFileUpload';
import GlobalVoiceButton from '@/components/GlobalVoiceButton';
import DuplicateManager from '@/components/DuplicateManager';
import DuplicateCheckDialog from '@/components/DuplicateCheckDialog';
import IcdoSuggester from '@/components/IcdoSuggester';
import AnapathExtractor from '@/components/AnapathExtractor';
import type { PatientLite } from '@/lib/duplicate-detection';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ALGERIA_WILAYAS } from '@/lib/algeria-wilayas';
import { communesForWilaya } from '@/lib/algeria-communes';
import { validateCase, ICDO3_TOPOGRAPHY, ICDO3_MORPHOLOGY, type ValidationError } from '@/lib/iacr-validation';

// Fallbacks if form_config is empty
const DEFAULT_CANCER_TYPES = [
  'Poumon', 'Colorectal', 'Sein', 'Prostate', 'Vessie', 'Estomac',
  'Foie', 'Pancréas', 'Rein', 'Thyroïde', 'Leucémie', 'Lymphome',
  'Mélanome', 'Col utérin', 'Ovaire', 'Cavité buccale', 'Larynx',
  'Œsophage', 'Cerveau/SNC', 'Sarcome', 'Myélome', 'Autre',
];

const DEFAULT_COMMUNES = [
  'Tlemcen', 'Mansourah', 'Chetouane', 'Remchi', 'Ghazaouet',
  'Maghnia', 'Sebdou', 'Hennaya', 'Nedroma', 'Beni Snous',
  'Ouled Mimoun', 'Ain Tallout', 'Bab El Assa', 'Honaine',
];

const DEFAULT_METHODES = [
  { value: 'histologie', label: 'Histologie' },
  { value: 'cytologie', label: 'Cytologie' },
  { value: 'clinique', label: 'Clinique seule' },
  { value: 'imagerie', label: 'Imagerie' },
  { value: 'biochimie', label: 'Marqueurs biochimiques' },
  { value: 'dco', label: 'Certificat de décès (DCO)' },
];

const DEFAULT_GRADES = ['G1 — Bien différencié', 'G2 — Moyennement différencié', 'G3 — Peu différencié', 'G4 — Indifférencié', 'GX — Non évalué'];
const LATERALITES = ['Droite', 'Gauche', 'Bilatéral'];

// Organes pairs (latéralité applicable). Préfixes ICD-O3 (3 premiers caractères).
const PAIRED_TOPO_PREFIXES = new Set([
  'C09','C30','C31','C33','C34','C40','C41','C44','C47','C49',
  'C50','C56','C57','C62','C64','C65','C66','C69','C74',
]);
const isPairedTopography = (code?: string) => {
  if (!code) return false;
  return PAIRED_TOPO_PREFIXES.has(code.substring(0, 3).toUpperCase());
};

// Cancers strictement féminins ou masculins (sexe → filtrage du type)
const FEMALE_ONLY_CANCERS = new Set(['Col utérin', 'Ovaire', 'Utérus', 'Endomètre', 'Vulve', 'Vagin', 'Placenta']);
const MALE_ONLY_CANCERS = new Set(['Prostate', 'Testicule', 'Pénis']);

// Valeurs TNM normalisées (pas de saisie libre)
const STADE_T = ['TX', 'Tis', 'T0', 'T1', 'T2', 'T3', 'T4'];
const STADE_N = ['NX', 'N0', 'N1', 'N2', 'N3'];
const STADE_M = ['MX', 'M0', 'M1'];

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  tab_id: string;
  is_required: boolean;
  options: any;
}

export default function NewCase() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedPatientId, setSavedPatientId] = useState<string | null>(null);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; type: string }[]>([]);
  const [pendingFileType, setPendingFileType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('identite');
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [topoSearch, setTopoSearch] = useState('');
  const [morphoSearch, setMorphoSearch] = useState('');
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [dupCheckOpen, setDupCheckOpen] = useState(false);
  const [linkedPatientId, setLinkedPatientId] = useState<string | null>(null);
  const [linkedCaseId, setLinkedCaseId] = useState<string | null>(null);
  const [forceCreateAllowed, setForceCreateAllowed] = useState(false);

  // Dynamic config from DB
  const [cancerTypes, setCancerTypes] = useState<string[]>(DEFAULT_CANCER_TYPES);
  const [communes, setCommunes] = useState<string[]>(DEFAULT_COMMUNES);
  const [methodes, setMethodes] = useState<{ value: string; label: string }[]>(DEFAULT_METHODES);
  const [grades, setGrades] = useState<string[]>(DEFAULT_GRADES);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // Load dynamic config
  useEffect(() => {
    const loadConfig = async () => {
      const [configRes, fieldsRes] = await Promise.all([
        supabase.from('form_config').select('category, label, value').eq('is_active', true).order('sort_order'),
        supabase.from('custom_fields').select('*').eq('is_active', true).order('sort_order'),
      ]);

      if (configRes.data && configRes.data.length > 0) {
        const byCategory: Record<string, any[]> = {};
        configRes.data.forEach((c: any) => {
          if (!byCategory[c.category]) byCategory[c.category] = [];
          byCategory[c.category].push(c);
        });

        if (byCategory.cancer_type?.length) setCancerTypes(byCategory.cancer_type.map((c: any) => c.label));
        if (byCategory.commune?.length) setCommunes(byCategory.commune.map((c: any) => c.label));
        if (byCategory.methode_diagnostic?.length) setMethodes(byCategory.methode_diagnostic.map((c: any) => ({ value: c.value, label: c.label })));
        if (byCategory.grade?.length) setGrades(byCategory.grade.map((c: any) => c.label));
      }

      if (fieldsRes.data) setCustomFields(fieldsRes.data as CustomField[]);
    };
    loadConfig();
  }, []);

  const [form, setForm] = useState({
    nom: '', prenom: '', dateNaissance: '', sexe: '', telephone: '', numDossier: '',
    wilaya: 'Tlemcen', commune: '', milieu: 'urbain', profession: '',
    methodeDiagnostic: 'histologie', dateDiagnostic: '', typeCancer: '', sourceInfo: '', baseDiagnostic: '',
    topographieIcdo: '', codeIcdo: '', lateralite: '',
    morphologieIcdo: '', comportement: '', sousTypeCancer: '', grade: '',
    stadeTnm: '', stadeT: '', stadeN: '', stadeM: '', stadeChiffre: '', anomaliesMoleculaires: '',
    medecinAnapath: '', dateAnapath: '', refAnapath: '', resultatAnapath: '',
    biologieFns: '', biologieGlobules: '', biologieDate: '',
    notes: '',
  });

  const update = useCallback((key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (['nom', 'prenom', 'dateNaissance'].includes(key)) {
      setForceCreateAllowed(false);
    }
  }, []);

  // Filtrer les types de cancer selon le sexe
  const filteredCancerTypes = useMemo(() => {
    if (form.sexe === 'F') return cancerTypes.filter(t => !MALE_ONLY_CANCERS.has(t));
    if (form.sexe === 'M') return cancerTypes.filter(t => !FEMALE_ONLY_CANCERS.has(t));
    return cancerTypes;
  }, [cancerTypes, form.sexe]);

  // Si on change de sexe et que le type devient invalide, on le vide
  useEffect(() => {
    if (form.typeCancer && !filteredCancerTypes.includes(form.typeCancer)) {
      setForm(f => ({ ...f, typeCancer: '' }));
    }
  }, [filteredCancerTypes, form.typeCancer]);

  // Latéralité : applicable seulement si organe pair
  const lateraliteApplicable = isPairedTopography(form.topographieIcdo);
  useEffect(() => {
    if (!lateraliteApplicable && form.lateralite && form.lateralite !== 'Non applicable') {
      setForm(f => ({ ...f, lateralite: 'Non applicable' }));
    }
  }, [lateraliteApplicable, form.lateralite]);

  // Recomposer stade TNM automatiquement à partir des selects T/N/M
  useEffect(() => {
    if (form.stadeT || form.stadeN || form.stadeM) {
      const tnm = `${form.stadeT}${form.stadeN}${form.stadeM}`;
      if (tnm !== form.stadeTnm) {
        setForm(f => ({ ...f, stadeTnm: tnm }));
      }
    }
  }, [form.stadeT, form.stadeN, form.stadeM]);

  const handleVoiceFields = useCallback((fields: Record<string, string>) => {
    // Normalize snake_case → camelCase (AI sometimes returns either)
    const toCamel = (k: string) => k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(fields || {})) {
      if (v === null || v === undefined || v === '') continue;
      normalized[toCamel(k)] = String(v);
    }
    // Aliases for keys that don't map 1:1
    if (normalized.icdoCode && !normalized.codeIcdo) normalized.codeIcdo = normalized.icdoCode;
    if (normalized.codeIcdo && !normalized.topographieIcdo) normalized.topographieIcdo = normalized.codeIcdo;

    setForm(f => {
      const updated = { ...f };
      const applied: string[] = [];
      for (const [key, value] of Object.entries(normalized)) {
        if (!(key in updated)) continue;
        if (['notes', 'resultatAnapath'].includes(key)) {
          const cur = (updated as any)[key];
          (updated as any)[key] = cur ? cur + ' ' + value : value;
          applied.push(key);
        } else {
          // Always overwrite (voice dictation is the source of truth for that field)
          (updated as any)[key] = value;
          applied.push(key);
        }
      }
      if (applied.length > 0) {
        console.log('[VoiceFields applied]', applied, normalized);
      }
      return updated;
    });
  }, []);

  const validationErrors = useMemo(() => validateCase({
    nom: form.nom, prenom: form.prenom, dateNaissance: form.dateNaissance,
    sexe: form.sexe, dateDiagnostic: form.dateDiagnostic, typeCancer: form.typeCancer,
    topographieIcdo: form.topographieIcdo, morphologieIcdo: form.morphologieIcdo,
    codeIcdo: form.codeIcdo, stadeTnm: form.stadeTnm, resultatAnapath: form.resultatAnapath,
    methodeDiagnostic: form.methodeDiagnostic,
  }), [form]);

  const errorCount = validationErrors.filter(e => e.severity === 'error').length;
  const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

  const checkDuplicate = async () => {
    if (!form.nom || !form.prenom) return;
    setDupCheckOpen(true);
  };

  const handleUseExisting = (p: PatientLite, opts?: { linkedCaseId?: string | null }) => {
    setLinkedPatientId(p.id);
    setLinkedCaseId(opts?.linkedCaseId || null);
    setForm(f => ({
      ...f,
      nom: p.nom, prenom: p.prenom,
      dateNaissance: p.date_naissance || f.dateNaissance,
      sexe: p.sexe || f.sexe,
      commune: p.commune || f.commune,
      telephone: p.telephone || f.telephone,
      numDossier: p.num_dossier || f.numDossier,
    }));
    setDupCheckOpen(false);
    setDuplicateWarning(false);
    setForceCreateAllowed(true);
    toast.success(opts?.linkedCaseId
      ? `Fusion complète appliquée à ${p.nom} ${p.prenom}`
      : `Cas rattaché au patient ${p.nom} ${p.prenom}`);
  };

  const handleForceCreate = () => {
    setLinkedPatientId(null);
    setForceCreateAllowed(true);
    setDupCheckOpen(false);
    setDuplicateWarning(false);
    toast.info('Création autorisée — un nouveau patient sera créé.');
  };

  const filteredTopo = topoSearch.length >= 1
    ? ICDO3_TOPOGRAPHY.filter(t => t.code.toLowerCase().includes(topoSearch.toLowerCase()) || t.label.toLowerCase().includes(topoSearch.toLowerCase()))
    : ICDO3_TOPOGRAPHY;

  const filteredMorpho = morphoSearch.length >= 1
    ? ICDO3_MORPHOLOGY.filter(m => m.code.includes(morphoSearch) || m.label.toLowerCase().includes(morphoSearch.toLowerCase()))
    : ICDO3_MORPHOLOGY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const criticalErrors = validationErrors.filter(e => e.severity === 'error');
    if (criticalErrors.length > 0) {
      toast.error(`${criticalErrors.length} erreur(s) de validation à corriger`);
      return;
    }

    // Zero-tolerance duplicate check before insert
    if (!linkedPatientId && !forceCreateAllowed && form.nom && form.prenom) {
      setDupCheckOpen(true);
      toast.warning('Vérification des doublons requise avant enregistrement');
      return;
    }

    setLoading(true);
    try {
      let patientId = linkedPatientId;
      if (!patientId) {
        const code = form.numDossier || `P-${Date.now().toString(36).toUpperCase()}`;
        const { data: patient, error: patientErr } = await supabase
          .from('patients')
          .insert({
            code_patient: code, nom: form.nom, prenom: form.prenom,
            date_naissance: form.dateNaissance || null, sexe: form.sexe,
            commune: form.commune, telephone: form.telephone || null,
            num_dossier: form.numDossier || null, wilaya: form.wilaya || 'Tlemcen', created_by: user.id,
          })
          .select().single();
        if (patientErr) throw patientErr;
        patientId = patient.id;
      }
      const patient = { id: patientId } as { id: string };

      let caseData: { id: string } | null = null;
      if (linkedCaseId) {
        // Case fields were already merged into the existing case during dup-check.
        caseData = { id: linkedCaseId };
      } else {
        const { data: inserted, error: caseErr } = await supabase
          .from('cancer_cases')
          .insert({
            patient_id: patient.id, type_cancer: form.typeCancer,
            sous_type_cancer: form.sousTypeCancer || null,
            code_icdo: form.codeIcdo || null,
            topographie_icdo: form.topographieIcdo || null,
            morphologie_icdo: form.morphologieIcdo || null,
            comportement: form.comportement || null,
            grade: form.grade || null,
            lateralite: form.lateralite || null,
            methode_diagnostic: form.methodeDiagnostic,
            milieu: form.milieu,
            profession: form.profession || null,
            base_diagnostic: form.baseDiagnostic || null,
            source_info: form.sourceInfo || null,
            stade_tnm: form.stadeTnm || null,
            anomalies_moleculaires: form.anomaliesMoleculaires || null,
            date_diagnostic: form.dateDiagnostic,
            medecin_anapath: form.medecinAnapath || null,
            date_anapath: form.dateAnapath || null,
            ref_anapath: form.refAnapath || null,
            resultat_anapath: form.resultatAnapath || null,
            biologie_fns: form.biologieFns || null,
            biologie_globules: form.biologieGlobules || null,
            biologie_date: form.biologieDate || null,
            notes: form.notes || null,
            created_by: user.id,
          }).select().single();
        if (caseErr) throw caseErr;
        caseData = inserted;
      }

      // Upload pending files
      if (pendingFiles.length > 0 && patient.id) {
        for (const item of pendingFiles) {
          const file = item.file;
          const fileType = item.type || 'autre';
          const storagePath = `${patient.id}/${fileType}/${Date.now()}_${file.name}`;
          await supabase.storage.from('patient-files').upload(storagePath, file);
          await supabase.from('patient_files').insert({
            patient_id: patient.id,
            case_id: caseData?.id || null,
            file_name: file.name,
            file_path: storagePath,
            file_type: fileType,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user.id,
          });
        }
      }

      toast.success('Cas enregistré avec succès — Standards IARC');
      navigate('/cas');
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // Render custom fields for a specific tab
  const renderCustomFields = (tabId: string) => {
    const fields = customFields.filter(f => f.tab_id === tabId);
    if (fields.length === 0) return null;

    return (
      <>
        <hr className="border-border/30" />
        <p className="text-xs font-semibold text-muted-foreground">Champs personnalisés</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.id}>
              <Label>{f.field_label} {f.is_required && '*'}</Label>
              {f.field_type === 'textarea' ? (
                <Textarea
                  value={customValues[f.field_name] || ''}
                  onChange={e => setCustomValues(prev => ({ ...prev, [f.field_name]: e.target.value }))}
                  className="mt-1" rows={2}
                />
              ) : f.field_type === 'select' ? (
                <Select value={customValues[f.field_name] || ''} onValueChange={v => setCustomValues(prev => ({ ...prev, [f.field_name]: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(f.options) ? f.options : []).map((opt: string) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={f.field_type === 'number' ? 'number' : f.field_type === 'date' ? 'date' : 'text'}
                  value={customValues[f.field_name] || ''}
                  onChange={e => setCustomValues(prev => ({ ...prev, [f.field_name]: e.target.value }))}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const TABS = [
    { id: 'identite', label: 'Identité', icon: User },
    { id: 'epidemio', label: 'Épidémiologie', icon: MapPin },
    { id: 'diagnostic', label: 'Diagnostic', icon: Stethoscope },
    { id: 'topographie', label: 'Topographie', icon: Search },
    { id: 'morphologie', label: 'Morphologie', icon: Microscope },
    { id: 'stade', label: 'Stade', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
  ];

  const isMedecin = role === 'medecin' || role === 'admin';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-4 px-2 sm:px-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Nouveau Cas — IARC Standard</h1>
            <p className="text-muted-foreground text-sm">Formulaire 7 onglets · CanReg5 compatible · CHU Tlemcen</p>
          </div>
          <div className="flex items-center gap-2">
            {isMedecin && (
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setShowDuplicates(!showDuplicates)}>
                <AlertTriangle size={14} /> Doublons
              </Button>
            )}
            {(form.nom || form.prenom || form.dateDiagnostic) && errorCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <XCircle size={12} /> {errorCount} erreur(s)
              </Badge>
            )}
            {(form.nom || form.prenom || form.dateDiagnostic) && warningCount > 0 && (
              <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
                <AlertTriangle size={12} /> {warningCount} alerte(s)
              </Badge>
            )}
            {errorCount === 0 && warningCount === 0 && form.nom && (
              <Badge className="bg-success/10 text-success border-success/20 gap-1">
                <CheckCircle2 size={12} /> Valide
              </Badge>
            )}
          </div>
        </div>

        {/* Duplicate Manager */}
        {showDuplicates && isMedecin && (
          <div className="stat-card">
            <DuplicateManager />
          </div>
        )}

        {/* Linked existing patient banner */}
        {linkedPatientId && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30 text-success">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Ce cas sera rattaché à un patient existant (aucun nouveau patient créé).</span>
            <Button type="button" variant="outline" size="sm" className="ml-auto"
              onClick={() => { setLinkedPatientId(null); setLinkedCaseId(null); setForceCreateAllowed(false); }}>
              Annuler le rattachement
            </Button>
          </div>
        )}

        {/* Quick duplicate check button */}
        {!linkedPatientId && form.nom && form.prenom && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <AlertTriangle size={16} className="text-warning" />
            <span className="text-xs text-muted-foreground">Politique zéro-doublon active</span>
            <Button type="button" variant="outline" size="sm" className="ml-auto h-7 text-xs"
              onClick={() => setDupCheckOpen(true)}>
              Vérifier les doublons maintenant
            </Button>
          </div>
        )}


        {/* Validation panel removed per user request */}


        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full grid grid-cols-7 h-auto gap-1 p-1 bg-muted/50" aria-label="Sections du formulaire de saisie">
              {TABS.map((tab, i) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  aria-label={`Onglet ${i + 1} : ${tab.label}`}
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 text-[10px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium"
                >
                  <tab.icon size={14} className="shrink-0" aria-hidden="true" />
                  <span className="hidden md:inline truncate">{tab.label}</span>
                  <span className="md:hidden text-[9px] leading-none" aria-hidden="true">{i + 1}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab 1: Identité */}
            <TabsContent value="identite" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><User size={18} className="text-primary" aria-hidden="true" /> Identité Patient</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-nom" required>Nom</Label>
                  <Input id="patient-nom" value={form.nom} onChange={e => update('nom', e.target.value)} onBlur={checkDuplicate} required aria-required="true" autoComplete="family-name" autoCapitalize="words" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="patient-prenom" required>Prénom</Label>
                  <Input id="patient-prenom" value={form.prenom} onChange={e => update('prenom', e.target.value)} onBlur={checkDuplicate} required aria-required="true" autoComplete="given-name" autoCapitalize="words" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="patient-dob">Date de naissance</Label>
                  <Input id="patient-dob" type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)} onBlur={checkDuplicate} autoComplete="bday" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="patient-sexe" required>Sexe</Label>
                  <Select value={form.sexe} onValueChange={v => update('sexe', v)}>
                    <SelectTrigger id="patient-sexe" className="mt-1" aria-required="true"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="patient-dossier">N° Dossier</Label>
                  <Input id="patient-dossier" value={form.numDossier} onChange={e => update('numDossier', e.target.value)} placeholder="DOS-2026-001" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="patient-tel">Téléphone</Label>
                  <Input id="patient-tel" value={form.telephone} onChange={e => update('telephone', e.target.value)} placeholder="+213 5XX XX XX XX" type="tel" autoComplete="tel" inputMode="tel" className="mt-1" />
                </div>
              </div>
              {renderCustomFields('identite')}
            </TabsContent>

            {/* Tab 2: Épidémiologie */}
            <TabsContent value="epidemio" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><MapPin size={18} className="text-primary" aria-hidden="true" /> Épidémiologie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="epi-wilaya">Wilaya</Label>
                  <Select value={form.wilaya} onValueChange={v => { update('wilaya', v); update('commune', ''); }}>
                    <SelectTrigger id="epi-wilaya" className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {ALGERIA_WILAYAS.map(w => (
                        <SelectItem key={w.code} value={w.name}>{w.code} — {w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="epi-commune">Commune</Label>
                  <Select value={form.commune} onValueChange={v => update('commune', v)}>
                    <SelectTrigger id="epi-commune" className="mt-1"><SelectValue placeholder={form.wilaya ? 'Sélectionner' : 'Choisir d\'abord une wilaya'} /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {(() => {
                        const w = ALGERIA_WILAYAS.find(x => x.name === form.wilaya);
                        const list = w ? communesForWilaya(w.code).map(c => c.name) : communes;
                        return list.sort().map(c => <SelectItem key={c} value={c}>{c}</SelectItem>);
                      })()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="epi-milieu">Milieu</Label>
                  <Select value={form.milieu} onValueChange={v => update('milieu', v)}>
                    <SelectTrigger id="epi-milieu" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urbain">Urbain</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                      <SelectItem value="semi-urbain">Semi-urbain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="epi-profession">Profession</Label>
                  <Input id="epi-profession" value={form.profession} onChange={e => update('profession', e.target.value)} placeholder="Ex: Agriculteur, Enseignant..." autoComplete="organization-title" className="mt-1" />
                </div>
              </div>
              {renderCustomFields('epidemio')}
            </TabsContent>

            {/* Tab 3: Diagnostic */}
            <TabsContent value="diagnostic" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><Stethoscope size={18} className="text-primary" aria-hidden="true" /> Diagnostic</h2>
              <AnapathExtractor
                initialText={form.resultatAnapath || ''}
                onApply={(f) => {
                  if (f.type_cancer) update('typeCancer', f.type_cancer);
                  if (f.sous_type_cancer) update('sousTypeCancer', f.sous_type_cancer);
                  if (f.topographie_icdo) { update('topographieIcdo', f.topographie_icdo); update('codeIcdo', f.topographie_icdo); }
                  if (f.morphologie_icdo) update('morphologieIcdo', f.morphologie_icdo);
                  if (f.grade) update('grade', f.grade);
                  if (f.comportement) update('comportement', f.comportement);
                  if (f.stade_tnm) update('stadeTnm', f.stade_tnm);
                  if (f.lateralite) update('lateralite', f.lateralite);
                  if (f.ref_anapath) update('refAnapath', f.ref_anapath);
                  if (f.date_anapath) update('dateAnapath', f.date_anapath);
                  if (f.medecin_anapath) update('medecinAnapath', f.medecin_anapath);
                  if (f.anomalies_moleculaires) update('anomaliesMoleculaires', f.anomalies_moleculaires);
                  if (f.resume && !form.notes) update('notes', f.resume);
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diag-methode" required>Méthode de diagnostic</Label>
                  <Select value={form.methodeDiagnostic} onValueChange={v => update('methodeDiagnostic', v)}>
                    <SelectTrigger id="diag-methode" className="mt-1" aria-required="true"><SelectValue /></SelectTrigger>
                    <SelectContent>{methodes.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="diag-date" required>Date diagnostic</Label>
                  <Input id="diag-date" type="date" value={form.dateDiagnostic} onChange={e => update('dateDiagnostic', e.target.value)} required aria-required="true" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="diag-type" required>Type de cancer</Label>
                  <Select value={form.typeCancer} onValueChange={v => update('typeCancer', v)}>
                    <SelectTrigger id="diag-type" className="mt-1" aria-required="true"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{filteredCancerTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="diag-source">Source d'information</Label>
                  <Input id="diag-source" value={form.sourceInfo} onChange={e => update('sourceInfo', e.target.value)} placeholder="Hôpital, laboratoire..." className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="diag-base">Base du diagnostic</Label>
                  <Input id="diag-base" value={form.baseDiagnostic} onChange={e => update('baseDiagnostic', e.target.value)} placeholder="Histologie de la tumeur primitive..." className="mt-1" />
                </div>
              </div>
              {renderCustomFields('diagnostic')}
            </TabsContent>

            {/* Tab 4: Topographie ICD-O3 */}
            <TabsContent value="topographie" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><Search size={18} className="text-primary" aria-hidden="true" /> Topographie ICD-O3</h2>
              <IcdoSuggester
                initialDescription={form.resultatAnapath || form.notes || ''}
                onApply={(s) => {
                  update('topographieIcdo', s.topographie);
                  update('codeIcdo', s.topographie);
                  update('morphologieIcdo', s.morphologie);
                  if (s.comportement) update('comportement', s.comportement);
                  if (s.grade) update('grade', s.grade);
                }}
              />
              <div className="space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Label htmlFor="topo-search" className="sr-only">Rechercher un site anatomique</Label>
                  <Input id="topo-search" value={topoSearch} onChange={e => setTopoSearch(e.target.value)} placeholder="Rechercher un site anatomique (ex: poumon, C34)..." className="pl-9" />
                </div>
                <div
                  className="max-h-48 overflow-y-auto rounded-lg border border-border/40 divide-y divide-border/30"
                  role="listbox"
                  aria-label="Résultats de recherche topographie"
                >
                  {filteredTopo.slice(0, 20).map(t => (
                    <button key={t.code} type="button"
                      role="option"
                      aria-selected={form.topographieIcdo === t.code}
                      className={cn('w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors flex items-center justify-between',
                        form.topographieIcdo === t.code && 'bg-primary/10 font-medium'
                      )}
                      onClick={() => { update('topographieIcdo', t.code); update('codeIcdo', t.code); }}
                    >
                      <span>{t.label}</span>
                      <Badge variant="outline" className="text-[10px]">{t.code}</Badge>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topo-code">Code topographie sélectionné</Label>
                    <Input id="topo-code" value={form.topographieIcdo} onChange={e => update('topographieIcdo', e.target.value)} placeholder="C34.1" className="mt-1 font-mono" />
                  </div>
                  <div>
                    <Label htmlFor="topo-lateralite">
                      Latéralité {!lateraliteApplicable && <span className="text-[10px] text-muted-foreground">(non applicable — organe unique)</span>}
                    </Label>
                    <Select value={form.lateralite} onValueChange={v => update('lateralite', v)} disabled={!lateraliteApplicable}>
                      <SelectTrigger id="topo-lateralite" className="mt-1">
                        <SelectValue placeholder={lateraliteApplicable ? 'Sélectionner' : 'Non applicable'} />
                      </SelectTrigger>
                      <SelectContent>{LATERALITES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {renderCustomFields('topographie')}
            </TabsContent>

            {/* Tab 5: Morphologie ICD-O3 */}
            <TabsContent value="morphologie" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><Microscope size={18} className="text-primary" aria-hidden="true" /> Morphologie ICD-O3</h2>
              <div className="space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Label htmlFor="morpho-search" className="sr-only">Rechercher une morphologie</Label>
                  <Input id="morpho-search" value={morphoSearch} onChange={e => setMorphoSearch(e.target.value)} placeholder="Rechercher morphologie (ex: adénocarcinome, 8140)..." className="pl-9" />
                </div>
                <div
                  className="max-h-48 overflow-y-auto rounded-lg border border-border/40 divide-y divide-border/30"
                  role="listbox"
                  aria-label="Résultats de recherche morphologie"
                >
                  {filteredMorpho.slice(0, 20).map(m => (
                    <button key={m.code} type="button"
                      role="option"
                      aria-selected={form.morphologieIcdo === m.code}
                      className={cn('w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors flex items-center justify-between',
                        form.morphologieIcdo === m.code && 'bg-primary/10 font-medium'
                      )}
                      onClick={() => { update('morphologieIcdo', m.code); update('sousTypeCancer', m.label); }}
                    >
                      <span>{m.label}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">{m.code}</Badge>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="morpho-code">Code morphologie</Label>
                    <Input id="morpho-code" value={form.morphologieIcdo} onChange={e => update('morphologieIcdo', e.target.value)} placeholder="8140/3" className="mt-1 font-mono" />
                  </div>
                  <div>
                    <Label htmlFor="morpho-soustype">Sous-type histologique</Label>
                    <Input id="morpho-soustype" value={form.sousTypeCancer} onChange={e => update('sousTypeCancer', e.target.value)} placeholder="Adénocarcinome" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="morpho-grade">Grade</Label>
                    <Select value={form.grade} onValueChange={v => update('grade', v)}>
                      <SelectTrigger id="morpho-grade" className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {renderCustomFields('morphologie')}
            </TabsContent>

            {/* Tab 6: Stade */}
            <TabsContent value="stade" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2"><Shield size={18} className="text-primary" aria-hidden="true" /> Stadification TNM</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Stade TNM (sélection guidée)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Select value={form.stadeT} onValueChange={v => update('stadeT', v)}>
                      <SelectTrigger><SelectValue placeholder="T —" /></SelectTrigger>
                      <SelectContent>{STADE_T.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={form.stadeN} onValueChange={v => update('stadeN', v)}>
                      <SelectTrigger><SelectValue placeholder="N —" /></SelectTrigger>
                      <SelectContent>{STADE_N.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={form.stadeM} onValueChange={v => update('stadeM', v)}>
                      <SelectTrigger><SelectValue placeholder="M —" /></SelectTrigger>
                      <SelectContent>{STADE_M.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {form.stadeTnm && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Stade TNM composé : <span className="font-mono font-semibold text-primary">{form.stadeTnm}</span>
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stade-clinique">Stade clinique</Label>
                  <Select value={form.stadeChiffre} onValueChange={v => update('stadeChiffre', v)}>
                    <SelectTrigger id="stade-clinique" className="mt-1"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {['I', 'IA', 'IB', 'II', 'IIA', 'IIB', 'III', 'IIIA', 'IIIB', 'IIIC', 'IV', 'IVA', 'IVB'].map(s =>
                        <SelectItem key={s} value={s}>Stade {s}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stade-mol">Anomalies moléculaires</Label>
                  <Input id="stade-mol" value={form.anomaliesMoleculaires} onChange={e => update('anomaliesMoleculaires', e.target.value)} placeholder="EGFR, ALK, KRAS, HER2, BRCA..." className="mt-1" />
                </div>
              </div>
              {renderCustomFields('stade')}
            </TabsContent>

            {/* Anatomopathologie tab removed */}
            {/* Tab Documents */}
            <TabsContent value="documents" className="stat-card space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <FolderOpen size={18} className="text-primary" /> Documents du Patient
              </h2>
              {savedPatientId ? (
                <PatientFileUpload patientId={savedPatientId} caseId={savedCaseId || undefined} />
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Type selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">1</span>
                        Sélectionnez le type de document
                      </p>
                      <span className="text-[10px] text-muted-foreground">15 catégories médicales</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                      {[
                        { key: 'compte_rendu', label: 'Compte-rendu', icon: '📋' },
                        { key: 'scanner', label: 'Scanner / TDM', icon: '🩻' },
                        { key: 'irm', label: 'IRM', icon: '🧠' },
                        { key: 'pet_scan', label: 'PET Scan', icon: '💗' },
                        { key: 'radiographie', label: 'Radiographie', icon: '📡' },
                        { key: 'echographie', label: 'Échographie', icon: '🔊' },
                        { key: 'mammographie', label: 'Mammographie', icon: '🩺' },
                        { key: 'scintigraphie', label: 'Scintigraphie', icon: '✨' },
                        { key: 'anapath', label: 'Anapath', icon: '🔬' },
                        { key: 'biologie', label: 'Biologie', icon: '🩸' },
                        { key: 'ordonnance', label: 'Ordonnance', icon: '💊' },
                        { key: 'consentement', label: 'Consentement', icon: '✍️' },
                        { key: 'administratif', label: 'Administratif', icon: '🏥' },
                        { key: 'photo', label: 'Photo clinique', icon: '📷' },
                        { key: 'autre', label: 'Autre', icon: '📄' },
                      ].map(doc => {
                        const active = pendingFileType === doc.key;
                        return (
                          <button
                            type="button"
                            key={doc.key}
                            onClick={() => setPendingFileType(doc.key)}
                            className={cn(
                              'group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                              active
                                ? 'bg-primary/10 border-primary shadow-sm ring-2 ring-primary/20 -translate-y-0.5'
                                : 'bg-card border-border/50 hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5'
                            )}
                          >
                            <div className={cn(
                              'w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110',
                              active ? 'bg-primary/20' : 'bg-gradient-to-br from-primary/5 to-primary/10'
                            )}>
                              {doc.icon}
                            </div>
                            <span className={cn('text-[10px] font-medium text-center leading-tight', active ? 'text-primary' : 'text-foreground/80')}>
                              {doc.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Upload zone (only after type selected) */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <span className={cn(
                        'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold',
                        pendingFileType ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}>2</span>
                      Glissez vos fichiers
                    </p>
                    <div
                      className={cn(
                        'border-2 border-dashed rounded-xl p-6 text-center transition-all',
                        !pendingFileType
                          ? 'border-border/40 bg-muted/20 opacity-60 cursor-not-allowed'
                          : 'border-primary/40 hover:border-primary bg-primary/[0.02] cursor-pointer'
                      )}
                      onClick={() => pendingFileType && document.getElementById('pending-file-input')?.click()}
                    >
                      <input
                        id="pending-file-input"
                        type="file"
                        multiple
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.dcm,.dicom,.xls,.xlsx,.doc,.docx"
                        onChange={e => {
                          if (e.target.files && pendingFileType) {
                            const newItems = Array.from(e.target.files).map(f => ({ file: f, type: pendingFileType }));
                            setPendingFiles(prev => [...prev, ...newItems]);
                            e.target.value = '';
                          }
                        }}
                      />
                      <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium text-sm">
                        {pendingFileType ? `Glissez vos fichiers « ${pendingFileType} » ici` : 'Choisissez d\'abord un type ci-dessus'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPEG, PNG, DICOM · Max 20 MB
                      </p>
                      <p className="text-xs text-primary mt-2">
                        Les fichiers seront uploadés automatiquement après l'enregistrement du cas
                      </p>
                    </div>
                  </div>

                  {pendingFiles.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">{pendingFiles.length} fichier(s) en attente</p>
                      {pendingFiles.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-muted/50">
                          <FileText size={14} className="text-primary shrink-0" />
                          <span className="flex-1 truncate">{item.file.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px]">{item.type}</span>
                          <span className="text-muted-foreground">{(item.file.size / 1024).toFixed(0)} KB</span>
                          <button onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-destructive hover:text-destructive/80">
                            <XCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation & Submit */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {activeTab !== 'identite' && (
                <Button type="button" variant="outline" onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1].id);
                }}>
                  ← Précédent
                </Button>
              )}
              {activeTab !== 'documents' && (
                <Button type="button" variant="secondary" onClick={() => {
                  const idx = TABS.findIndex(t => t.id === activeTab);
                  // Required fields per tab
                  const tabRequired: Record<string, { key: keyof typeof form; label: string }[]> = {
                    identite: [
                      { key: 'nom', label: 'Nom' },
                      { key: 'prenom', label: 'Prénom' },
                      { key: 'sexe', label: 'Sexe' },
                    ],
                    diagnostic: [
                      { key: 'typeCancer', label: 'Type de cancer' },
                      { key: 'dateDiagnostic', label: 'Date de diagnostic' },
                      { key: 'methodeDiagnostic', label: 'Méthode de diagnostic' },
                    ],
                  };
                  const required = tabRequired[activeTab] || [];
                  const missing = required.filter(r => !form[r.key]);
                  if (missing.length > 0) {
                    toast.error(`Champ${missing.length > 1 ? 's' : ''} requis : ${missing.map(m => m.label).join(', ')}`);
                    return;
                  }
                  if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
                }}>
                  Suivant →
                </Button>
              )}
            </div>
            <Button type="submit" disabled={loading || errorCount > 0} className="h-11 px-8">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer le cas
            </Button>
          </div>
        </form>
      </div>
      <GlobalVoiceButton currentForm={form} onFieldsExtracted={handleVoiceFields} />
      <DuplicateCheckDialog
        open={dupCheckOpen}
        onOpenChange={setDupCheckOpen}
        candidate={{
          id: linkedPatientId || '',
          nom: form.nom, prenom: form.prenom,
          date_naissance: form.dateNaissance || null, sexe: form.sexe,
          commune: form.commune, telephone: form.telephone, num_dossier: form.numDossier,
          caseFields: {
            typeCancer: form.typeCancer, sousTypeCancer: form.sousTypeCancer,
            codeIcdo: form.codeIcdo, topographieIcdo: form.topographieIcdo,
            morphologieIcdo: form.morphologieIcdo, comportement: form.comportement,
            grade: form.grade, lateralite: form.lateralite,
            stadeTnm: form.stadeTnm, anomaliesMoleculaires: form.anomaliesMoleculaires,
            resultatAnapath: form.resultatAnapath, refAnapath: form.refAnapath,
            biologieFns: form.biologieFns, notes: form.notes,
          },
        }}
        onUseExisting={handleUseExisting}
        onForceCreate={handleForceCreate}
      />
    </AppLayout>
  );
}
