import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { kaplanMeier, recordsFromCases, survivalAt, netSurvivalAt } from '@/lib/survival';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { topLocations } from '@/lib/epidemiology';
import { TrendingDown, Activity, Target, Filter } from 'lucide-react';

export default function SurvivalAnalysis({ cases }: { cases: any[] }) {
  const locations = useMemo(() => ['Tous', ...topLocations(cases, 12).map(l => l.location)], [cases]);
  const wilayas = useMemo(() => {
    const s = new Set<string>();
    cases.forEach(c => { if (c.patients?.wilaya) s.add(c.patients.wilaya); });
    return ['Toutes', ...Array.from(s).sort()];
  }, [cases]);

  const [loc, setLoc] = useState('Tous');
  const [wilaya, setWilaya] = useState('Toutes');
  const [tabac, setTabac] = useState<'tous' | 'oui' | 'non'>('tous');
  const [alcool, setAlcool] = useState<'tous' | 'oui' | 'non'>('tous');
  const [sport, setSport] = useState<'tous' | 'oui' | 'non'>('tous');
  const [horizonY, setHorizonY] = useState<number>(5);

  const filtered = useMemo(() => cases.filter(c => {
    if (loc !== 'Tous' && c.type_cancer !== loc) return false;
    if (wilaya !== 'Toutes' && c.patients?.wilaya !== wilaya) return false;
    if (tabac !== 'tous' && (c.tabagisme || 'non') !== tabac) return false;
    if (alcool !== 'tous' && (c.alcool || 'non') !== alcool) return false;
    if (sport !== 'tous' && (c.sportif || 'non') !== sport) return false;
    return true;
  }), [cases, loc, wilaya, tabac, alcool, sport]);

  const records = useMemo(() => recordsFromCases(filtered), [filtered]);
  const km = useMemo(() => kaplanMeier(records), [records]);

  const horizonMonths = horizonY * 12;
  const sH = survivalAt(km, horizonMonths);
  const s1 = survivalAt(km, 12);
  const s3 = survivalAt(km, 36);
  const netH = netSurvivalAt(records, horizonMonths);

  const chartData = useMemo(() => km
    .filter(p => p.time <= horizonMonths)
    .map(p => ({
      months: p.time,
      survival: Math.round(p.survival * 1000) / 10,
      ciLow: Math.round(p.ciLow * 1000) / 10,
      ciHigh: Math.round(p.ciHigh * 1000) / 10,
    })), [km, horizonMonths]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Analyse de survie (Kaplan-Meier + Ederer II)</h3>
          <p className="text-xs text-muted-foreground">Filtres : type, wilaya, mode de vie · horizon configurable</p>
        </div>
      </div>

      {/* Filters */}
      <div className="stat-card p-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
          <Filter size={13} /> Filtres
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <div>
            <label className="text-[10px] text-muted-foreground">Type cancer</label>
            <Select value={loc} onValueChange={setLoc}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Wilaya</label>
            <Select value={wilaya} onValueChange={setWilaya}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{wilayas.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Tabagisme</label>
            <Select value={tabac} onValueChange={(v: any) => setTabac(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="oui">Oui</SelectItem>
                <SelectItem value="non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Alcool</label>
            <Select value={alcool} onValueChange={(v: any) => setAlcool(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="oui">Oui</SelectItem>
                <SelectItem value="non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Activité sportive</label>
            <Select value={sport} onValueChange={(v: any) => setSport(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="oui">Oui</SelectItem>
                <SelectItem value="non">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground">Horizon (années)</label>
            <Select value={String(horizonY)} onValueChange={v => setHorizonY(Number(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7, 10, 15].map(y => <SelectItem key={y} value={String(y)}>{y} an{y > 1 ? 's' : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Survie 1 an', value: (s1.survival * 100).toFixed(1) + '%', icon: Activity, color: 'text-primary' },
          { label: 'Survie 3 ans', value: (s3.survival * 100).toFixed(1) + '%', icon: TrendingDown, color: 'text-warning' },
          { label: `Survie ${horizonY} an${horizonY > 1 ? 's' : ''}`, value: (sH.survival * 100).toFixed(1) + '%', icon: TrendingDown, color: 'text-destructive' },
          { label: `Survie nette ${horizonY} an${horizonY > 1 ? 's' : ''}`, value: (netH * 100).toFixed(1) + '%', icon: Target, color: 'text-success' },
        ].map(k => (
          <div key={k.label} className="kpi-card text-center">
            <k.icon size={18} className={`mx-auto mb-1 ${k.color}`} />
            <p className={`text-xl font-display font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="stat-card">
        <h4 className="font-medium mb-3 text-sm">
          Courbe de survie observée — {loc} / {wilaya} ({records.length} patients · horizon {horizonY} an{horizonY > 1 ? 's' : ''})
        </h4>
        {records.length < 5 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Données de suivi insuffisantes pour ce filtre. Élargissez les critères ou renseignez date_deces / date_derniere_nouvelle.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="months" label={{ value: 'Mois depuis diagnostic', position: 'insideBottom', offset: -5 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} label={{ value: 'Survie (%)', angle: -90, position: 'insideLeft' }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="stepAfter" dataKey="survival" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Survie %" />
              <Line type="stepAfter" dataKey="ciLow" stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="3 3" dot={false} name="IC95% bas" />
              <Line type="stepAfter" dataKey="ciHigh" stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="3 3" dot={false} name="IC95% haut" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
