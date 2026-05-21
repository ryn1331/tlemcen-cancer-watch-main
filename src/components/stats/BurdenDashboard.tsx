import { useMemo } from 'react';
import { burdenFromCases } from '@/lib/burden';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Heart, Clock, TrendingDown } from 'lucide-react';

export default function BurdenDashboard({ cases }: { cases: any[] }) {
  const result = useMemo(() => burdenFromCases(cases), [cases]);
  const top = result.byCancer.slice(0, 10);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold">Fardeau de la maladie (DALYs)</h3>
        <p className="text-xs text-muted-foreground">Méthode GBD/OMS — Années de Vie Perdues (YLL) + Années Vécues avec Incapacité (YLD)</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'YLL — Années perdues', value: result.yll.toLocaleString('fr-FR'), icon: Clock, color: 'text-destructive' },
          { label: 'YLD — Années avec maladie', value: result.yld.toLocaleString('fr-FR'), icon: Heart, color: 'text-warning' },
          { label: 'DALYs — Charge totale', value: result.daly.toLocaleString('fr-FR'), icon: TrendingDown, color: 'text-primary' },
        ].map(k => (
          <div key={k.label} className="kpi-card text-center">
            <k.icon size={20} className={`mx-auto mb-1 ${k.color}`} />
            <p className={`text-2xl font-display font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="stat-card">
        <h4 className="font-medium mb-3 text-sm">Top 10 cancers par DALYs perdues</h4>
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Données de mortalité requises pour calculer les DALYs.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(280, top.length * 30)}>
            <BarChart data={top} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="type" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} width={110} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar dataKey="yll" stackId="a" fill="hsl(var(--destructive))" name="YLL" />
              <Bar dataKey="yld" stackId="a" fill="hsl(var(--warning))" name="YLD" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
