import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Activity, FilePlus2, Users, TrendingUp } from 'lucide-react';

interface UserStat {
  user_id: string;
  full_name: string;
  inserts: number;
  updates: number;
  deletes: number;
  total: number;
}

export default function AdminActivityDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ totalActions: 0, activeUsers: 0, casesThisMonth: 0, avgPerDay: 0 });
  const [topUsers, setTopUsers] = useState<UserStat[]>([]);
  const [byDay, setByDay] = useState<Array<{ day: string; n: number }>>([]);
  const [byEntity, setByEntity] = useState<Array<{ entity: string; n: number }>>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const since = new Date();
        since.setDate(since.getDate() - 30);
        const sinceISO = since.toISOString();

        const [{ data: logs }, { data: profiles }, { data: monthCases }] = await Promise.all([
          supabase.from('audit_log').select('user_id, action, entity_type, created_at').gte('created_at', sinceISO).limit(5000),
          supabase.from('profiles').select('user_id, full_name'),
          supabase.from('cancer_cases').select('id', { count: 'exact', head: true }).gte('created_at', sinceISO),
        ]);

        const profileMap: Record<string, string> = {};
        for (const p of profiles || []) profileMap[p.user_id] = p.full_name || '(sans nom)';

        const all = logs || [];
        const byUser: Record<string, UserStat> = {};
        const dayMap: Record<string, number> = {};
        const entityMap: Record<string, number> = {};

        for (const l of all) {
          const uid = l.user_id || 'system';
          if (!byUser[uid]) byUser[uid] = { user_id: uid, full_name: profileMap[uid] || 'Système', inserts: 0, updates: 0, deletes: 0, total: 0 };
          byUser[uid].total++;
          if (l.action === 'INSERT') byUser[uid].inserts++;
          else if (l.action === 'UPDATE') byUser[uid].updates++;
          else if (l.action === 'DELETE') byUser[uid].deletes++;

          const day = (l.created_at || '').slice(0, 10);
          if (day) dayMap[day] = (dayMap[day] || 0) + 1;
          entityMap[l.entity_type] = (entityMap[l.entity_type] || 0) + 1;
        }

        const top = Object.values(byUser).sort((a, b) => b.total - a.total).slice(0, 10);
        const days = Object.entries(dayMap).sort((a, b) => a[0].localeCompare(b[0])).map(([day, n]) => ({ day, n }));
        const entities = Object.entries(entityMap).sort((a, b) => b[1] - a[1]).map(([entity, n]) => ({ entity, n }));

        setKpis({
          totalActions: all.length,
          activeUsers: Object.keys(byUser).filter(u => u !== 'system').length,
          casesThisMonth: (monthCases as any)?.count ?? 0,
          avgPerDay: Math.round(all.length / 30),
        });
        setTopUsers(top);
        setByDay(days);
        setByEntity(entities);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const maxDay = Math.max(1, ...byDay.map(d => d.n));

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Activity, label: 'Actions (30j)', value: kpis.totalActions },
          { icon: Users, label: 'Utilisateurs actifs', value: kpis.activeUsers },
          { icon: FilePlus2, label: 'Cas créés (30j)', value: kpis.casesThisMonth },
          { icon: TrendingUp, label: 'Moy. actions/jour', value: kpis.avgPerDay },
        ].map(k => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <k.icon size={14} /> {k.label}
            </div>
            <p className="font-display text-2xl font-bold text-primary mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Activity timeline */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-3 text-sm">Activité — 30 derniers jours</h3>
        {byDay.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Aucune activité.</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {byDay.map(d => (
              <div key={d.day} className="flex-1 group relative">
                <div
                  className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors"
                  style={{ height: `${(d.n / maxDay) * 100}%` }}
                />
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
                  {d.day} · {d.n}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-3 text-sm">Top utilisateurs (saisie & modifications)</h3>
          <table className="w-full text-xs">
            <thead className="text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 font-medium">Utilisateur</th>
                <th className="text-right font-medium">Créés</th>
                <th className="text-right font-medium">Modifs</th>
                <th className="text-right font-medium">Suppr.</th>
                <th className="text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map(u => (
                <tr key={u.user_id} className="border-b border-border/40">
                  <td className="py-2">{u.full_name}</td>
                  <td className="text-right text-success font-mono">{u.inserts}</td>
                  <td className="text-right font-mono">{u.updates}</td>
                  <td className="text-right text-destructive font-mono">{u.deletes}</td>
                  <td className="text-right font-bold font-mono">{u.total}</td>
                </tr>
              ))}
              {topUsers.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-muted-foreground italic">Aucune activité.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-3 text-sm">Activité par entité</h3>
          <div className="space-y-2">
            {byEntity.map(e => {
              const pct = (e.n / Math.max(1, byEntity[0].n)) * 100;
              return (
                <div key={e.entity}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{e.entity}</span>
                    <span className="font-mono text-muted-foreground">{e.n}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {byEntity.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune donnée.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
