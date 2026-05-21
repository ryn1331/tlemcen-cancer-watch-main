import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface AuditRow {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  diff: any;
  created_at: string;
}

const ENTITIES = ['cancer_cases', 'patients', 'traitements', 'patient_files'];
const ACTIONS = ['INSERT', 'UPDATE', 'DELETE'];

export default function AuditTrail() {
  const { role, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (!error && data) {
      setRows(data as AuditRow[]);
      const ids = Array.from(new Set(data.map((r: any) => r.user_id).filter(Boolean)));
      if (ids.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', ids as string[]);
        const map: Record<string, string> = {};
        profs?.forEach((p: any) => { map[p.user_id] = p.full_name || p.user_id.slice(0, 8); });
        setProfiles(map);
      }
    }
    setLoading(false);
  };

  useEffect(() => { if (role === 'admin') load(); }, [role]);

  const filtered = useMemo(() => rows.filter(r => {
    if (entityFilter !== 'all' && r.entity_type !== entityFilter) return false;
    if (actionFilter !== 'all' && r.action !== actionFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        r.entity_id?.toLowerCase().includes(s) ||
        (profiles[r.user_id || ''] || '').toLowerCase().includes(s) ||
        JSON.stringify(r.diff || {}).toLowerCase().includes(s)
      );
    }
    return true;
  }), [rows, entityFilter, actionFilter, search, profiles]);

  const exportCsv = () => {
    const header = ['date', 'utilisateur', 'action', 'entité', 'id_entité'];
    const lines = [header.join(',')];
    filtered.forEach(r => {
      lines.push([
        r.created_at,
        profiles[r.user_id || ''] || r.user_id || '',
        r.action,
        r.entity_type,
        r.entity_id || '',
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionColor = (a: string) =>
    a === 'INSERT' ? 'bg-success/10 text-success border-success/20'
      : a === 'UPDATE' ? 'bg-primary/10 text-primary border-primary/20'
        : 'bg-destructive/10 text-destructive border-destructive/20';

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="animate-spin" aria-hidden="true" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
  if (role !== 'admin') return <Navigate to="/" replace />;

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <header className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" aria-hidden="true" /> Journal d'audit
            </h1>
            <p className="text-muted-foreground mt-1">
              Conformité ANPDP — traçabilité complète des accès et modifications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}><RefreshCw size={14} className="mr-2" aria-hidden="true" />Actualiser</Button>
            <Button onClick={exportCsv}><Download size={14} className="mr-2" aria-hidden="true" />Export CSV</Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base" id="audit-filters-title">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3" role="group" aria-labelledby="audit-filters-title">
              <div className="relative">
                <label htmlFor="audit-search" className="sr-only">Rechercher dans le journal</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                <Input id="audit-search" placeholder="Recherche…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" autoCapitalize="none" spellCheck={false} />
              </div>
              <div>
                <label htmlFor="audit-entity" className="sr-only">Filtrer par entité</label>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger id="audit-entity" aria-label="Filtrer par entité"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes entités</SelectItem>
                    {ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="audit-action" className="sr-only">Filtrer par action</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger id="audit-action" aria-label="Filtrer par action"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes actions</SelectItem>
                    {ACTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base" aria-live="polite">
              {filtered.length} évènement{filtered.length > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8" role="status" aria-live="polite">
                <Loader2 className="animate-spin text-primary" aria-hidden="true" />
                <span className="sr-only">Chargement du journal…</span>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[600px] overflow-y-auto list-none p-0" aria-label="Évènements d'audit">
                {filtered.map(r => (
                  <li key={r.id}>
                    <details className="border rounded-lg p-3 hover:bg-muted/30">
                      <summary className="cursor-pointer flex items-center gap-3 text-sm flex-wrap">
                        <Badge variant="outline" className={actionColor(r.action)}>{r.action}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          <time dateTime={r.created_at}>{format(new Date(r.created_at), 'yyyy-MM-dd HH:mm:ss')}</time>
                        </span>
                        <span className="font-medium">{profiles[r.user_id || ''] || (r.user_id ? r.user_id.slice(0, 8) : 'système')}</span>
                        <span className="text-muted-foreground" aria-hidden="true">→</span>
                        <span className="sr-only">a effectué une action sur</span>
                        <span className="font-medium">{r.entity_type}</span>
                        {r.entity_id && <span className="font-mono text-xs text-muted-foreground">{r.entity_id.slice(0, 8)}</span>}
                      </summary>
                      <pre className="text-xs mt-3 p-3 bg-muted/50 rounded overflow-x-auto" aria-label="Détails de la modification">{JSON.stringify(r.diff, null, 2)}</pre>
                    </details>
                  </li>
                ))}
                {filtered.length === 0 && <li><p className="text-sm text-muted-foreground text-center py-8">Aucun évènement</p></li>}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
