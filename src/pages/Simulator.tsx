import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RotateCcw, TrendingUp, TrendingDown, Activity, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Area, AreaChart } from 'recharts';
import { DEFAULT_SCENARIO, projectIncidence, casesAvoided, type ScenarioInputs } from '@/lib/digital-twin';
import { cn } from '@/lib/utils';

const FALLBACK_COUNTS: Record<string, number> = { Poumon: 30, Sein: 50, Colon: 20, Prostate: 15, Vessie: 10 };

export default function Simulator() {
  const navigate = useNavigate();
  // Render immediately with reasonable defaults; refine when data arrives.
  const [baseCounts, setBaseCounts] = useState<Record<string, number>>(FALLBACK_COUNTS);
  const [baseYear, setBaseYear] = useState(new Date().getFullYear() - 1);
  const [horizon, setHorizon] = useState<5 | 10 | 20>(10);
  const [scenario, setScenario] = useState<ScenarioInputs>(DEFAULT_SCENARIO);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('cancer_cases')
      .select('type_cancer, date_diagnostic')
      .eq('statut', 'valide')
      .limit(5000)
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data || [];
        if (rows.length === 0) { setRefreshing(false); return; }
        const yearCounts: Record<number, Record<string, number>> = {};
        for (const r of rows) {
          const y = parseInt((r.date_diagnostic || '').slice(0, 4));
          if (!y) continue;
          (yearCounts[y] ||= {})[r.type_cancer] = (yearCounts[y][r.type_cancer] || 0) + 1;
        }
        const years = Object.keys(yearCounts).map(Number).sort();
        const last = years[years.length - 1];
        if (last) {
          setBaseYear(last);
          setBaseCounts(yearCounts[last]);
        }
        setRefreshing(false);
      });
    return () => { cancelled = true; };
  }, []);

  const projection = useMemo(
    () => projectIncidence(baseCounts, baseYear, horizon, scenario),
    [baseCounts, baseYear, horizon, scenario],
  );

  const avoided = casesAvoided(projection.total);
  const finalDelta = projection.total[projection.total.length - 1]?.deltaPct || 0;

  const chartData = useMemo(() => projection.total.map(p => ({
    year: p.year,
    'Sans changement': p.baseline,
    'Avec scénario': p.scenario,
  })), [projection.total]);

  const update = (k: keyof ScenarioInputs, v: number) => setScenario(s => ({ ...s, [k]: v }));

  const sliders: { key: keyof ScenarioInputs; label: string; min: number; max: number; step: number; unit: string; desc: string }[] = [
    { key: 'tabagisme', label: '🚬 Tabagisme', min: -50, max: 50, step: 5, unit: '%', desc: 'Variation de la prévalence du tabac' },
    { key: 'pollution', label: '🏭 Pollution air', min: -30, max: 50, step: 5, unit: '%', desc: 'PM2.5 / qualité air' },
    { key: 'obesite', label: '🍔 Obésité', min: -30, max: 50, step: 5, unit: '%', desc: 'Prévalence IMC > 30' },
    { key: 'depistageSein', label: '🎀 Dépistage sein', min: -50, max: 50, step: 5, unit: '%', desc: 'Couverture mammographie' },
    { key: 'depistageColon', label: '🔬 Dépistage colon', min: -50, max: 50, step: 5, unit: '%', desc: 'Couverture colonoscopie' },
    { key: 'hpvVaccination', label: '💉 Vaccination HPV', min: 0, max: 100, step: 10, unit: '%', desc: 'Couverture vaccinale filles 11-14 ans' },
    { key: 'populationGrowth', label: '👥 Croissance pop.', min: 0, max: 3, step: 0.1, unit: '%/an', desc: 'Taux annuel' },
    { key: 'agingFactor', label: '👴 Vieillissement', min: 0, max: 2, step: 0.1, unit: '×', desc: 'Multiplicateur effet âge' },
  ];



  return (
    <AppLayout>
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>
        <div className="hero-banner p-5 md:p-6 text-white">
          <div className="relative z-10 flex items-center gap-3">
            <Sparkles className="text-white/90" size={28} />
            <div>
              <p className="text-white/70 text-sm">Jumeau numérique épidémiologique</p>
              <h1 className="font-display text-xl md:text-2xl font-bold mt-0.5">Simulateur prospectif d'incidence</h1>
              <p className="text-white/60 text-xs mt-1">
                Modèle multi-facteurs basé sur les élasticités IARC · projection sur {horizon} ans à partir de {baseYear}
                {refreshing && <Loader2 size={11} className="inline ml-2 animate-spin" />}
              </p>
            </div>
          </div>
        </div>

        {/* KPIs scénario */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="kpi-card text-center">
            <Activity size={18} className="mx-auto mb-1 text-primary" />
            <p className="text-2xl font-display font-bold text-primary">{projection.total[projection.total.length - 1]?.scenario || 0}</p>
            <p className="text-[10px] text-muted-foreground">Cas projetés en {baseYear + horizon}</p>
          </div>
          <div className="kpi-card text-center">
            {finalDelta > 0 ? <TrendingUp size={18} className="mx-auto mb-1 text-destructive" /> : <TrendingDown size={18} className="mx-auto mb-1 text-success" />}
            <p className={cn('text-2xl font-display font-bold', finalDelta > 0 ? 'text-destructive' : 'text-success')}>
              {finalDelta > 0 ? '+' : ''}{finalDelta.toFixed(1)}%
            </p>
            <p className="text-[10px] text-muted-foreground">vs scénario neutre</p>
          </div>
          <div className="kpi-card text-center">
            <p className={cn('text-2xl font-display font-bold', avoided > 0 ? 'text-success' : 'text-destructive')}>
              {avoided > 0 ? '−' : '+'}{Math.abs(avoided).toLocaleString('fr-FR')}
            </p>
            <p className="text-[10px] text-muted-foreground">{avoided > 0 ? 'Cas évités cumulés' : 'Cas additionnels cumulés'}</p>
          </div>
          <div className="kpi-card text-center">
            <p className="text-2xl font-display font-bold text-primary">{projection.perType.length}</p>
            <p className="text-[10px] text-muted-foreground">Types modélisés</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sliders */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Variables du scénario</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setScenario(DEFAULT_SCENARIO)}>
                <RotateCcw size={14} className="mr-1" /> Reset
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {([5, 10, 20] as const).map(h => (
                  <Button key={h} size="sm" variant={horizon === h ? 'default' : 'outline'} onClick={() => setHorizon(h)} className="flex-1">
                    {h} ans
                  </Button>
                ))}
              </div>
              {sliders.map(s => (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium">{s.label}</label>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {(scenario[s.key] as number) > 0 && s.min < 0 ? '+' : ''}{scenario[s.key]}{s.unit}
                    </Badge>
                  </div>
                  <Slider
                    min={s.min} max={s.max} step={s.step}
                    value={[scenario[s.key] as number]}
                    onValueChange={v => update(s.key, v[0])}
                  />
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Graphique */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Projection — incidence totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gScen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Sans changement" stroke="hsl(var(--muted-foreground))" fill="url(#gBase)" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="Avec scénario" stroke="hsl(var(--primary))" fill="url(#gScen)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails par type */}
        <Card>
          <CardHeader><CardTitle className="text-base">Impact par type de cancer en {baseYear + horizon}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b">
                    <th className="py-2">Type</th>
                    <th className="text-right">Base ({baseYear})</th>
                    <th className="text-right">Sans changement</th>
                    <th className="text-right">Avec scénario</th>
                    <th className="text-right">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.perType.map(t => {
                    const last = t.points[t.points.length - 1];
                    return (
                      <tr key={t.type} className="border-b last:border-0">
                        <td className="py-2 font-medium">{t.type}</td>
                        <td className="text-right">{t.baselineCases}</td>
                        <td className="text-right text-muted-foreground">{last.baseline}</td>
                        <td className="text-right font-semibold">{last.scenario}</td>
                        <td className={cn('text-right font-mono text-xs', last.deltaPct > 1 ? 'text-destructive' : last.deltaPct < -1 ? 'text-success' : 'text-muted-foreground')}>
                          {last.deltaPct > 0 ? '+' : ''}{last.deltaPct.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              ⚠️ Modèle pédagogique basé sur les élasticités publiées (IARC, Global Burden of Disease). Les projections doivent être interprétées comme des ordres de grandeur, pas des prédictions absolues.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
