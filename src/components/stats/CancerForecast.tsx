import { useMemo, useState } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Activity, Target, Sparkles, Calendar, Filter, X } from 'lucide-react';
import type { CaseWithPatient } from '@/lib/epidemiology';
import { getAge } from '@/lib/epidemiology';
import { buildForecast, locationForecasts } from '@/lib/forecasting';
import { ALGERIA_WILAYAS } from '@/lib/algeria-wilayas';
import { communesForWilaya } from '@/lib/algeria-communes';
import { cn } from '@/lib/utils';

interface Props {
  cases: CaseWithPatient[];
}

const HORIZONS = [3, 5, 10] as const;
const ALL = '__all__';

interface Filters {
  wilaya: string;
  commune: string;
  cancer: string;
  sex: string;
  ageMin: string;
  ageMax: string;
}

const DEFAULT: Filters = {
  wilaya: ALL, commune: ALL, cancer: ALL, sex: ALL, ageMin: '', ageMax: '',
};

export default function CancerForecast({ cases }: Props) {
  const [horizon, setHorizon] = useState<3 | 5 | 10>(5);
  const [showMethods, setShowMethods] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT);

  // Build wilaya / commune / cancer option lists
  const wilayas = useMemo(() => {
    const set = new Set<string>();
    cases.forEach(c => { if (c.patients?.wilaya) set.add(c.patients.wilaya); });
    // Always offer all 58 from reference
    ALGERIA_WILAYAS.forEach(w => set.add(w.name));
    return Array.from(set).sort();
  }, [cases]);

  const communeOptions = useMemo(() => {
    if (filters.wilaya !== ALL) {
      const w = ALGERIA_WILAYAS.find(x => x.name === filters.wilaya);
      if (w) return communesForWilaya(w.code).map(c => c.name).sort();
    }
    const set = new Set<string>();
    cases.forEach(c => { if (c.patients?.commune) set.add(c.patients.commune); });
    return Array.from(set).sort();
  }, [filters.wilaya, cases]);

  const cancerTypes = useMemo(() => {
    const set = new Set<string>();
    cases.forEach(c => { if (c.type_cancer) set.add(c.type_cancer); });
    return Array.from(set).sort();
  }, [cases]);

  // Apply filters
  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (filters.wilaya !== ALL && c.patients?.wilaya !== filters.wilaya) return false;
      if (filters.commune !== ALL && c.patients?.commune !== filters.commune) return false;
      if (filters.cancer !== ALL && c.type_cancer !== filters.cancer) return false;
      if (filters.sex !== ALL && c.patients?.sexe !== filters.sex) return false;
      if (filters.ageMin || filters.ageMax) {
        if (!c.patients?.date_naissance) return false;
        const age = getAge(c.patients.date_naissance, c.date_diagnostic);
        if (filters.ageMin && age < +filters.ageMin) return false;
        if (filters.ageMax && age > +filters.ageMax) return false;
      }
      return true;
    });
  }, [cases, filters]);

  // Yearly history of filtered set
  const history = useMemo(() => {
    const byYear: Record<number, number> = {};
    filtered.forEach(c => {
      if (!c.date_diagnostic) return;
      const y = new Date(c.date_diagnostic).getFullYear();
      byYear[y] = (byYear[y] || 0) + 1;
    });
    return Object.entries(byYear).map(([y, v]) => ({ year: +y, value: v })).sort((a, b) => a.year - b.year);
  }, [filtered]);

  const forecast = useMemo(() => buildForecast(history, horizon), [history, horizon]);

  const locHistory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(c => {
      if (!c.date_diagnostic || !c.type_cancer) return;
      const y = new Date(c.date_diagnostic).getFullYear();
      const k = `${y}|${c.type_cancer}`;
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([k, v]) => {
      const [y, loc] = k.split('|');
      return { year: +y, location: loc, count: v };
    });
  }, [filtered]);

  const locForecasts = useMemo(() => locationForecasts(locHistory, horizon, 5), [locHistory, horizon]);

  const sexForecasts = useMemo(() => {
    const build = (sex: 'M' | 'F') => {
      const byYear: Record<number, number> = {};
      filtered.filter(c => c.patients?.sexe === sex).forEach(c => {
        if (!c.date_diagnostic) return;
        const y = new Date(c.date_diagnostic).getFullYear();
        byYear[y] = (byYear[y] || 0) + 1;
      });
      const pts = Object.entries(byYear).map(([y, v]) => ({ year: +y, value: v })).sort((a, b) => a.year - b.year);
      return buildForecast(pts, horizon);
    };
    return { male: build('M'), female: build('F') };
  }, [filtered, horizon]);

  // Per-wilaya forecast (when filter is "all wilayas" — national overview)
  const wilayaForecasts = useMemo(() => {
    if (filters.wilaya !== ALL) return [];
    const byWilayaYear: Record<string, Record<number, number>> = {};
    filtered.forEach(c => {
      if (!c.date_diagnostic || !c.patients?.wilaya) return;
      const y = new Date(c.date_diagnostic).getFullYear();
      const w = c.patients.wilaya;
      if (!byWilayaYear[w]) byWilayaYear[w] = {};
      byWilayaYear[w][y] = (byWilayaYear[w][y] || 0) + 1;
    });
    return Object.entries(byWilayaYear)
      .map(([wilaya, yMap]) => {
        const pts = Object.entries(yMap).map(([y, v]) => ({ year: +y, value: v })).sort((a, b) => a.year - b.year);
        const f = buildForecast(pts, horizon);
        return { wilaya, ...f, lastObserved: pts[pts.length - 1]?.value ?? 0 };
      })
      .filter(w => w.lastObserved > 0)
      .sort((a, b) => b.nextYearValue - a.nextYearValue)
      .slice(0, 10);
  }, [filtered, filters.wilaya, horizon]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'ageMin' || k === 'ageMax') return v !== '';
    return v !== ALL;
  }).length;

  if (history.length < 2) {
    return (
      <div className="space-y-4">
        <FilterBar filters={filters} setFilters={setFilters} wilayas={wilayas} communes={communeOptions} cancerTypes={cancerTypes} activeCount={activeFilterCount} />
        <div className="p-8 text-center bg-card rounded-xl border border-border">
          <AlertCircle className="mx-auto mb-3 text-warning" size={32} />
          <p className="text-sm text-muted-foreground">
            Au moins 2 années de données sont nécessaires. {activeFilterCount > 0 && 'Essayez d\'élargir les filtres.'}
          </p>
        </div>
      </div>
    );
  }

  const trend = forecast.apc;
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;
  const trendColor = trend > 2 ? 'text-destructive' : trend < -2 ? 'text-success' : 'text-warning';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-xl border border-border p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-primary" />
              <h2 className="text-lg font-display font-bold">Prédiction d'incidence</h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Modèles inspirés de GLOBOCAN (IARC), NORDCAN et SEER. Prédictions filtrables
              par wilaya, commune, type de cancer, sexe et âge — échelle nationale.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">Horizon</span>
            {HORIZONS.map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  horizon === h ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {h} ans
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} wilayas={wilayas} communes={communeOptions} cancerTypes={cancerTypes} activeCount={activeFilterCount} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Cas filtrés" value={filtered.length} sub={`${history.length} années`} icon={Target} color="text-primary" />
        <KPI label="Année prochaine" value={Math.round(forecast.nextYearValue)} sub="Cas attendus" icon={Sparkles} color="text-primary" />
        <KPI label={`Croissance ${horizon} ans`} value={`${forecast.growth5y > 0 ? '+' : ''}${forecast.growth5y}%`} sub="Vs dernière année" icon={TrendIcon} color={trendColor} />
        <KPI label="APC" value={`${forecast.apc > 0 ? '+' : ''}${forecast.apc}%`} sub={`R²=${forecast.r2.toFixed(2)}`} icon={Activity} color={trendColor} />
      </div>

      {/* Main forecast chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm">Projection d'incidence</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Zone grise = IC 95% Poisson · Pointillé = début de la projection
            </p>
          </div>
          <button onClick={() => setShowMethods(!showMethods)} className="text-[11px] text-primary hover:underline">
            {showMethods ? 'Masquer' : 'Afficher'} méthodes individuelles
          </button>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecast.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={history[history.length - 1].year} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Aujourd'hui", fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Area type="monotone" dataKey="ciHigh" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.08} name="IC 95% haut" />
              <Area type="monotone" dataKey="ciLow" stroke="none" fill="hsl(var(--card))" fillOpacity={1} name="IC 95% bas" />
              <Line type="monotone" dataKey="observed" stroke="hsl(213, 80%, 45%)" strokeWidth={2.5} dot={{ r: 4 }} name="Observés" connectNulls={false} />
              <Line type="monotone" dataKey="ensemble" stroke="hsl(280, 65%, 55%)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} name="Prédiction" connectNulls={false} />
              {showMethods && (
                <>
                  <Line type="monotone" dataKey="linear" stroke="hsl(170,60%,42%)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Linéaire" />
                  <Line type="monotone" dataKey="loglinear" stroke="hsl(38,92%,50%)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Log-linéaire" />
                  <Line type="monotone" dataKey="holt" stroke="hsl(0,72%,55%)" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Holt" />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sex stratified */}
      <div className="grid md:grid-cols-2 gap-4">
        <SexForecastCard label="Hommes" color="hsl(213, 80%, 45%)" data={sexForecasts.male} historyYear={history[history.length - 1].year} />
        <SexForecastCard label="Femmes" color="hsl(340, 65%, 55%)" data={sexForecasts.female} historyYear={history[history.length - 1].year} />
      </div>

      {/* Per-wilaya (only when no wilaya filter) */}
      {wilayaForecasts.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-sm mb-1">Top 10 wilayas projetées (année prochaine)</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Classement par cas attendus</p>
          <div className="space-y-2">
            {wilayaForecasts.map(w => (
              <div key={w.wilaya} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{w.wilaya}</p>
                  <p className="text-[11px] text-muted-foreground">{w.lastObserved} cas → {Math.round(w.nextYearValue)} cas attendus</p>
                </div>
                <div className={cn('text-xs font-bold tabular-nums px-2 py-1 rounded-md', w.apc > 2 ? 'bg-destructive/10 text-destructive' : w.apc < -2 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                  APC {w.apc > 0 ? '+' : ''}{w.apc}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top localisations */}
      {locForecasts.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-sm mb-1">Projection par localisation tumorale (Top 5)</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Cas attendus dans {horizon} an(s) vs dernière année observée</p>
          <div className="space-y-2.5">
            {locForecasts.map(lf => {
              const last = lf.series.find(s => s.observed != null && s.year === history[history.length - 1].year)?.observed ?? 0;
              const future = lf.series[lf.series.length - 1]?.ensemble ?? 0;
              const change = last > 0 ? ((future - last) / last) * 100 : 0;
              const apcColor = lf.apc > 2 ? 'text-destructive' : lf.apc < -2 ? 'text-success' : 'text-warning';
              return (
                <div key={lf.location} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lf.location}</p>
                    <p className="text-[11px] text-muted-foreground">{last} cas → <span className="font-semibold">{Math.round(future)} cas</span> en {lf.series[lf.series.length - 1]?.year}</p>
                  </div>
                  <div className={cn('text-xs font-bold tabular-nums', apcColor)}>APC {lf.apc > 0 ? '+' : ''}{lf.apc}%</div>
                  <div className={cn('text-xs font-bold tabular-nums px-2 py-1 rounded-md', change > 0 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success')}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-muted/30 rounded-xl border border-border p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Méthodologie:</strong> Ensemble de régression linéaire,
            log-linéaire (APC NCI/SEER) et lissage de Holt. Intervalles de confiance Poisson 95%
            (Byar). Méthodologie utilisée par <strong>NORDCAN</strong> et <strong>GLOBOCAN/IARC</strong>.
            Fiabilité optimale pour 5 années de données validées.
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ filters, setFilters, wilayas, communes, cancerTypes, activeCount }: any) {
  const update = (k: keyof Filters, v: string) => setFilters((f: Filters) => ({ ...f, [k]: v, ...(k === 'wilaya' ? { commune: ALL } : {}) }));

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-primary" />
          <h3 className="text-sm font-semibold">Filtres de prédiction</h3>
          {activeCount > 0 && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{activeCount} actif{activeCount > 1 ? 's' : ''}</span>}
        </div>
        {activeCount > 0 && (
          <button onClick={() => setFilters(DEFAULT)} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X size={11} /> Réinitialiser
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <Sel label="Wilaya" value={filters.wilaya} onChange={(v) => update('wilaya', v)} options={[{ value: ALL, label: 'Toutes' }, ...wilayas.map((w: string) => ({ value: w, label: w }))]} />
        <Sel label="Commune" value={filters.commune} onChange={(v) => update('commune', v)} options={[{ value: ALL, label: 'Toutes' }, ...communes.map((c: string) => ({ value: c, label: c }))]} />
        <Sel label="Cancer" value={filters.cancer} onChange={(v) => update('cancer', v)} options={[{ value: ALL, label: 'Tous' }, ...cancerTypes.map((c: string) => ({ value: c, label: c }))]} />
        <Sel label="Sexe" value={filters.sex} onChange={(v) => update('sex', v)} options={[{ value: ALL, label: 'Tous' }, { value: 'M', label: 'Hommes' }, { value: 'F', label: 'Femmes' }]} />
        <NumIn label="Âge min" value={filters.ageMin} onChange={(v) => update('ageMin', v)} />
        <NumIn label="Âge max" value={filters.ageMax} onChange={(v) => update('ageMax', v)} />
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 h-9 px-2 text-xs rounded-md border border-input bg-background hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30">
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function NumIn({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</label>
      <input type="number" min="0" max="120" value={value} onChange={e => onChange(e.target.value)} placeholder="—" className="w-full mt-1 h-9 px-2 text-xs rounded-md border border-input bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}

function KPI({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
        <Icon size={14} className={color} />
      </div>
      <p className={cn('text-2xl font-display font-bold tabular-nums', color)}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function SexForecastCard({ label, color, data, historyYear }: any) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{label}</h4>
        <span className="text-xs text-muted-foreground">APC <span className="font-bold" style={{ color }}>{data.apc > 0 ? '+' : ''}{data.apc}%</span></span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.series}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 11 }} />
            <ReferenceLine x={historyYear} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="observed" stroke={color} strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="ensemble" stroke={color} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2 }} connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
