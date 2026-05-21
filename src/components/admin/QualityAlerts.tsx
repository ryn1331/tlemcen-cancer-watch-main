import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Check, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Alert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warn' | 'error';
  title: string;
  message: string;
  metrics: any;
  resolved: boolean;
  created_at: string;
}

const SEV_STYLE: Record<string, string> = {
  info: 'border-l-primary bg-primary/5',
  warn: 'border-l-warning bg-warning/5',
  error: 'border-l-destructive bg-destructive/5',
};
const SEV_BADGE: Record<string, string> = {
  info: 'bg-primary/10 text-primary border-primary/20',
  warn: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function QualityAlerts() {
  const { user, role } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const canResolve = role === 'admin' || role === 'epidemiologiste';

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('quality_alerts')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(20);
    setAlerts((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runDetection = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke('anomaly-detection');
    setRunning(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${data?.alerts_generated || 0} nouvelle(s) alerte(s)`);
    load();
  };

  const resolve = async (id: string) => {
    const { error } = await supabase.from('quality_alerts').update({
      resolved: true, resolved_by: user?.id, resolved_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    setAlerts(a => a.filter(x => x.id !== id));
  };

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary" size={20} /></div>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="text-primary" size={18} />
            Alertes qualité IA <Badge variant="secondary">{alerts.length}</Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={runDetection} disabled={running}>
            {running ? <Loader2 className="animate-spin mr-2" size={14} /> : <RefreshCw size={14} className="mr-2" />}
            Lancer la détection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Aucune anomalie détectée — registre conforme aux seuils IARC ✓
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {alerts.map(a => (
              <div key={a.id} className={`border-l-4 p-3 rounded-r-lg ${SEV_STYLE[a.severity]}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={14} className="text-muted-foreground" />
                      <span className="font-medium text-sm">{a.title}</span>
                      <Badge variant="outline" className={SEV_BADGE[a.severity]}>{a.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.message}</p>
                  </div>
                  {canResolve && (
                    <Button size="sm" variant="ghost" onClick={() => resolve(a.id)}>
                      <Check size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
