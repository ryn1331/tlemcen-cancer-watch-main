import { useEffect, useMemo, useState } from 'react';
import { ALGERIA_WILAYAS } from '@/lib/algeria-wilayas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe, Download, BookOpen, MapPin, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import AlgeriaAtlasMap from '@/components/AlgeriaAtlasMap';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/public-stats`;

interface StatsData {
  data: Record<string, number>;
  k_anonymity: number;
  year: string;
}

export default function Atlas() {
  const [year, setYear] = useState<string>('all');
  const [cancerType, setCancerType] = useState<string>('all');
  const [sex, setSex] = useState<string>('all');
  const [metric, setMetric] = useState<'cases' | 'rate'>('cases');
  const [byWilaya, setByWilaya] = useState<StatsData | null>(null);
  const [byType, setByType] = useState<StatsData | null>(null);
  const [bySex, setBySex] = useState<StatsData | null>(null);
  const [byAge, setByAge] = useState<StatsData | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Atlas Cancer Algérie — Données publiques';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Atlas national du cancer en Algérie : incidence par wilaya, type, sexe et âge. Données anonymisées (k≥5). API REST publique CC-BY-4.0.');
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (year !== 'all') params.set('year', year);
        if (cancerType !== 'all') params.set('cancer_type', cancerType);
        if (sex !== 'all') params.set('sex', sex);
        const qs = params.toString() ? `&${params.toString()}` : '';
        const [s, w, t, sx, a] = await Promise.all([
          fetch(`${ENDPOINT}?endpoint=summary${qs}`).then(r => r.json()),
          fetch(`${ENDPOINT}?endpoint=by_wilaya${qs}`).then(r => r.json()),
          fetch(`${ENDPOINT}?endpoint=by_type${qs}`).then(r => r.json()),
          fetch(`${ENDPOINT}?endpoint=by_sex${qs}`).then(r => r.json()),
          fetch(`${ENDPOINT}?endpoint=by_age_group${qs}`).then(r => r.json()),
        ]);
        setSummary(s); setByWilaya(w); setByType(t); setBySex(sx); setByAge(a);
      } catch (e: any) {
        toast.error('Erreur chargement: ' + e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [year, cancerType, sex]);

  // Cancer types list (load once unfiltered)
  const [allTypes, setAllTypes] = useState<string[]>([]);
  useEffect(() => {
    fetch(`${ENDPOINT}?endpoint=by_type`).then(r => r.json()).then(d => {
      setAllTypes(Object.keys(d?.data || {}).sort());
    }).catch(() => {});
  }, []);

  const maxWilaya = useMemo(() => Math.max(1, ...Object.values(byWilaya?.data || {})), [byWilaya]);
  const topTypes = useMemo(() => {
    if (!byType) return [];
    return Object.entries(byType.data).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [byType]);

  const downloadJSON = (name: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const colorFor = (n: number) => {
    const r = n / maxWilaya;
    if (r === 0) return 'hsl(var(--muted))';
    if (r < 0.2) return 'hsl(210 100% 92%)';
    if (r < 0.4) return 'hsl(213 94% 78%)';
    if (r < 0.6) return 'hsl(217 91% 60%)';
    if (r < 0.8) return 'hsl(224 76% 48%)';
    return 'hsl(226 71% 35%)';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Globe className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Atlas Cancer Algérie</h1>
              <p className="text-xs text-muted-foreground">Données publiques anonymisées · k-anonymity ≥ 5 · Licence CC-BY-4.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes années</SelectItem>
                {Array.from({ length: 6 }, (_, i) => 2026 - i).map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cancerType} onValueChange={setCancerType}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">Tous cancers</SelectItem>
                {allTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous sexes</SelectItem>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" asChild>
              <a href="/auth"><BookOpen size={14} className="mr-1.5" /> Espace pro</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {/* KPIs */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Cas enregistrés', value: summary?.total_cases ?? 0 },
                { label: 'Wilayas couvertes', value: summary?.wilayas_covered ?? 0 },
                { label: 'Types de cancer', value: summary?.cancer_types ?? 0 },
                { label: 'Période', value: year === 'all' ? 'Tout' : year },
              ].map(k => (
                <div key={k.label} className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="font-display text-3xl font-bold text-primary mt-1">{k.value}</p>
                </div>
              ))}
            </section>

            {/* Choropleth Leaflet */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Incidence par wilaya — carte interactive
                </h2>
                <div className="flex items-center gap-2">
                  <Select value={metric} onValueChange={(v: any) => setMetric(v)}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cases">Cas absolus</SelectItem>
                      <SelectItem value="rate">Taux brut /100k hab.</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => downloadJSON('atlas-by-wilaya', byWilaya)}>
                    <Download size={14} className="mr-1.5" /> JSON
                  </Button>
                </div>
              </div>
              <AlgeriaAtlasMap data={byWilaya?.data || {}} metric={metric} />
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground flex-wrap">
                <span>Faible</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map(r => (
                  <div key={r} className="w-6 h-3 rounded-sm" style={{ backgroundColor: colorFor(r * maxWilaya) }} />
                ))}
                <span>Élevée</span>
                <Badge variant="outline" className="ml-2 text-[10px]">Cellules &lt; 5 supprimées (k-anonymity)</Badge>
                <Badge variant="outline" className="text-[10px]">Taille = intensité · {metric === 'rate' ? 'taux/100k' : 'nb. cas'}</Badge>
              </div>
            </section>

            {/* Top types + Sex + Age */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold">Top 10 types de cancer</h2>
                  <Button size="sm" variant="outline" onClick={() => downloadJSON('atlas-by-type', byType)}>
                    <Download size={14} className="mr-1.5" /> JSON
                  </Button>
                </div>
                <div className="space-y-2">
                  {topTypes.map(([t, n]) => {
                    const pct = (n / topTypes[0][1]) * 100;
                    return (
                      <div key={t}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t}</span>
                          <span className="font-mono text-xs">{n}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {topTypes.length === 0 && <p className="text-sm text-muted-foreground italic">Aucune donnée publique disponible (k≥5).</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-display font-semibold mb-3">Par sexe</h2>
                  <div className="space-y-2">
                    {Object.entries(bySex?.data || {}).map(([s, n]) => (
                      <div key={s} className="flex justify-between text-sm">
                        <span>{s === 'M' ? 'Masculin' : s === 'F' ? 'Féminin' : s}</span>
                        <span className="font-mono">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-display font-semibold mb-3">Par tranche d'âge</h2>
                  <div className="space-y-2">
                    {Object.entries(byAge?.data || {}).map(([a, n]) => (
                      <div key={a} className="flex justify-between text-sm">
                        <span>{a} ans</span>
                        <span className="font-mono">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* API Documentation */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display font-semibold flex items-center gap-2 mb-3">
                <FileJson size={18} className="text-primary" /> API REST publique
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Toutes les données ci-dessus sont accessibles via une API REST ouverte (CORS activé).
                Aucune authentification requise. Cellules &lt; {summary?.k_anonymity ?? 5} individus automatiquement supprimées.
              </p>
              <div className="space-y-2 text-xs font-mono">
                {['summary', 'by_wilaya', 'by_type', 'by_sex', 'by_age_group', 'by_year'].map(ep => (
                  <div key={ep} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                    <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">GET</Badge>
                    <code className="text-foreground break-all">{ENDPOINT}?endpoint={ep}&amp;year=2024</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Données distribuées sous licence <strong>CC-BY-4.0</strong>. Citation : « Registre du Cancer Algérie, {new Date().getFullYear()} ».
              </p>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        Registre du Cancer Algérie · Conforme ANPDP 18-07 / 25-11 · Standards IARC/OMS
      </footer>
    </div>
  );
}
