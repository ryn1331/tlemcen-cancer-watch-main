import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import AnnualReportButton from '@/components/AnnualReportButton';
import EpidemiologyDashboard from '@/components/stats/EpidemiologyDashboard';
import type { CaseWithPatient, PopulationRow } from '@/lib/epidemiology';

const DetailedAnalysis = lazy(() => import('@/components/stats/DetailedAnalysis'));
const ReportEditor = lazy(() => import('@/components/stats/ReportEditor'));
const CanRegExport = lazy(() => import('@/components/stats/CanRegExport'));
const CrossTabAnalysis = lazy(() => import('@/components/stats/CrossTabAnalysis'));
const DataImport = lazy(() => import('@/components/stats/DataImport'));
const CancerForecast = lazy(() => import('@/components/stats/CancerForecast'));
const SurvivalAnalysis = lazy(() => import('@/components/stats/SurvivalAnalysis'));
const JoinpointAnalysis = lazy(() => import('@/components/stats/JoinpointAnalysis'));

const TabFallback = () => (
  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
);

interface RawCase {
  id: string; type_cancer: string; date_diagnostic: string; statut: string;
  stade_tnm: string | null; resultat_anapath: string | null; code_icdo: string | null;
  patients: { sexe: string | null; date_naissance: string | null; commune: string | null; wilaya: string | null } | null;
}

export default function EpidemiologisteDashboard() {
  const { fullName } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<RawCase[]>([]);
  const [population, setPopulation] = useState<PopulationRow[]>([]);
  const [traitements, setTraitements] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('cancer_cases').select('id, type_cancer, date_diagnostic, statut, stade_tnm, resultat_anapath, code_icdo, base_diagnostic, statut_vital, date_deces, date_derniere_nouvelle, cause_deces, tabagisme, alcool, sportif, patients(sexe, date_naissance, commune, wilaya)').limit(10000),
      supabase.from('population_reference').select('tranche_age, sexe, population'),
      supabase.from('traitements').select('type_traitement, efficacite, effets_secondaires').limit(10000),
    ]).then(([cRes, pRes, tRes]) => {
      setCases((cRes.data as RawCase[]) || []);
      setPopulation((pRes.data as PopulationRow[]) || []);
      setTraitements(tRes.data || []);
      setLoading(false);
    });
  }, []);

  const casesForEpi: CaseWithPatient[] = useMemo(() => cases.map(c => ({
    type_cancer: c.type_cancer,
    date_diagnostic: c.date_diagnostic,
    stade_tnm: c.stade_tnm,
    resultat_anapath: c.resultat_anapath,
    code_icdo: c.code_icdo,
    patients: c.patients,
  })), [cases]);

  const validatedCases = cases.filter(c => c.statut === 'valide').length;
  const pendingCases = cases.filter(c => c.statut === 'en_attente').length;

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="hero-banner p-5 md:p-6 text-white">
          <div className="relative z-10">
            <p className="text-white/70 text-sm">Espace Épidémiologiste</p>
            <h1 className="font-display text-xl md:text-2xl font-bold mt-1 text-gradient-hero">
              Registre du Cancer — Wilaya de Tlemcen
            </h1>
            <p className="text-white/60 text-xs mt-1">
              Standards IARC/OMS · {cases.length} cas · {validatedCases} validés · {pendingCases} en attente
            </p>
          </div>
        </div>

        {/* Modules innovants — accès rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/assistant" className="group rounded-xl p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Assistant IA</p>
                <p className="text-[11px] text-muted-foreground">Pose tes questions en langage naturel</p>
              </div>
            </div>
          </a>
          <a href="/simulateur" className="group rounded-xl p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🧬</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Jumeau numérique</p>
                <p className="text-[11px] text-muted-foreground">Simule l'impact des facteurs de risque</p>
              </div>
            </div>
          </a>
          <a href="/forecast" className="group rounded-xl p-4 bg-gradient-to-br from-destructive/10 to-orange-500/5 border border-destructive/20 hover:border-destructive transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Hot-spots prédictifs</p>
                <p className="text-[11px] text-muted-foreground">Carte de chaleur des 12 prochains mois</p>
              </div>
            </div>
          </a>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/40 p-1.5 rounded-xl">
            <TabsTrigger value="dashboard">📊 Tableau de bord</TabsTrigger>
            <TabsTrigger value="analysis">🔬 Analyse détaillée</TabsTrigger>
            <TabsTrigger value="crosstab">🔀 Croisement</TabsTrigger>
            <TabsTrigger value="survival">❤️ Survie</TabsTrigger>
            <TabsTrigger value="joinpoint">📈 Joinpoint</TabsTrigger>
            <TabsTrigger value="forecast">🔮 Prédictions</TabsTrigger>
            <TabsTrigger value="reports">📄 Rapports</TabsTrigger>
            <TabsTrigger value="export">📤 Export CanReg5</TabsTrigger>
            <TabsTrigger value="import">📥 Import données</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><EpidemiologyDashboard cases={casesForEpi} population={population} /></TabsContent>
          <TabsContent value="analysis"><Suspense fallback={<TabFallback />}><DetailedAnalysis cases={casesForEpi} population={population} traitements={traitements} /></Suspense></TabsContent>
          <TabsContent value="crosstab"><Suspense fallback={<TabFallback />}><CrossTabAnalysis cases={casesForEpi} population={population} traitements={traitements} /></Suspense></TabsContent>
          <TabsContent value="survival"><Suspense fallback={<TabFallback />}><SurvivalAnalysis cases={cases} /></Suspense></TabsContent>
          <TabsContent value="joinpoint"><Suspense fallback={<TabFallback />}><JoinpointAnalysis cases={cases} population={population} /></Suspense></TabsContent>
          <TabsContent value="forecast"><Suspense fallback={<TabFallback />}><CancerForecast cases={casesForEpi} /></Suspense></TabsContent>
          <TabsContent value="reports">
            <Suspense fallback={<TabFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <AnnualReportButton />
              </div>
              <ReportEditor cases={casesForEpi} population={population} traitements={traitements} />
            </Suspense>
          </TabsContent>
          <TabsContent value="export"><Suspense fallback={<TabFallback />}><CanRegExport cases={casesForEpi} population={population} /></Suspense></TabsContent>
          <TabsContent value="import"><Suspense fallback={<TabFallback />}><DataImport /></Suspense></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
