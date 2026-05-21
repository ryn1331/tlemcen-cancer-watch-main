import { useMemo, useState } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { joinpointRegression } from '@/lib/joinpoint';
import { calculateASR, casesToAgeMap, populationToAgeMap } from '@/lib/epidemiology';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function JoinpointAnalysis({ cases, population }: { cases: any[]; population: any[] }) {
  const [metric, setMetric] = useState<'count' | 'asr'>(population.length > 0 ? 'asr' : 'count');

  const series = useMemo(() => {
    const years = Array.from(new Set(cases.map(c => new Date(c.date_diagnostic).getFullYear()))).filter(y => y > 1900).sort();
    return years.map(year => {
      const yearCases = cases.filter(c => new Date(c.date_diagnostic).getFullYear() === year);
      if (metric === 'count') return { year, value: yearCases.length };
      const popMap = populationToAgeMap(population);
      const caseMap = casesToAgeMap(yearCases);
      const asr = calculateASR(caseMap, popMap);
      return { year, value: Math.round(asr * 100) / 100 };
    });
  }, [cases, population, metric]);

  const result = useMemo(() => joinpointRegression(series, 2), [series]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Analyse Joinpoint</h3>
          <p className="text-xs text-muted-foreground">Détection automatique des changements de tendance (NCI Joinpoint)</p>
        </div>
        <Select value={metric} onValueChange={(v: any) => setMetric(v)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="asr">ASR (Monde)</SelectItem>
            <SelectItem value="count">Nombre de cas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold text-primary">{result.aapc > 0 ? '+' : ''}{result.aapc}%</p>
          <p className="text-[10px] text-muted-foreground">AAPC global</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold">{result.joinpoints.length}</p>
          <p className="text-[10px] text-muted-foreground">Point(s) de jonction</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold">{result.segments.length}</p>
          <p className="text-[10px] text-muted-foreground">Segment(s)</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold">{series.length}</p>
          <p className="text-[10px] text-muted-foreground">Années observées</p>
        </div>
      </div>

      <div className="stat-card">
        <h4 className="font-medium mb-3 text-sm">Tendance avec segments détectés</h4>
        {series.length < 4 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Au moins 4 années de données nécessaires.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={result.fitted}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              {result.joinpoints.map(jy => (
                <ReferenceLine key={jy} x={jy} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: `JP ${jy}`, position: 'top', fill: 'hsl(var(--destructive))' }} />
              ))}
              <Scatter dataKey="value" fill="hsl(var(--primary))" name="Observé" />
              <Line type="monotone" dataKey="fitted" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Ajustement" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="stat-card">
        <h4 className="font-medium mb-3 text-sm">Segments et APC</h4>
        <div className="space-y-2">
          {result.segments.map((seg, i) => {
            const Icon = seg.apc > 0.5 ? TrendingUp : seg.apc < -0.5 ? TrendingDown : Minus;
            const color = seg.apc > 0.5 ? 'text-destructive' : seg.apc < -0.5 ? 'text-success' : 'text-muted-foreground';
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <Icon size={20} className={color} />
                  <div>
                    <p className="font-medium text-sm">Segment {i + 1} : {seg.startYear} → {seg.endYear}</p>
                    <p className="text-xs text-muted-foreground">IC95% [{seg.apcCiLow}% ; {seg.apcCiHigh}%]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-display font-bold ${color}`}>
                    {seg.apc > 0 ? '+' : ''}{seg.apc}%
                  </span>
                  {seg.significant && <Badge variant="secondary" className="text-[10px]">significatif</Badge>}
                </div>
              </div>
            );
          })}
          {result.segments.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aucun segment calculé.</p>}
        </div>
      </div>
    </div>
  );
}
