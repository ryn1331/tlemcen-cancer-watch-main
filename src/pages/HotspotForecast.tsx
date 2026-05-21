import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Flame, TrendingUp, MapPin, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HotspotMap from '@/components/HotspotMap';
import { forecastHotspots, type HotspotPrediction } from '@/lib/hotspot-forecast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function HotspotForecast() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('cancer_cases')
      .select('date_diagnostic, patients(wilaya)')
      .eq('statut', 'valide')
      .then(({ data }) => { setCases(data || []); setLoading(false); });
  }, []);

  const result = useMemo(() => forecastHotspots(cases as any), [cases]);

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div></AppLayout>;

  const rising = result.predictions.filter(p => p.trend === 'rising').length;
  const falling = result.predictions.filter(p => p.trend === 'falling').length;
  const totalPredicted = result.predictions.reduce((s, p) => s + p.predictedNext12m, 0);

  return (
    <AppLayout>
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>
        <div className="hero-banner p-5 md:p-6 text-white">
          <div className="relative z-10 flex items-center gap-3">
            <Flame className="text-white/90" size={28} />
            <div>
              <p className="text-white/70 text-sm">Surveillance prédictive</p>
              <h1 className="font-display text-xl md:text-2xl font-bold mt-0.5">Hot-spots cancer — projection 12 mois</h1>
              <p className="text-white/60 text-xs mt-1">Modèle spatio-temporel · tendance × autocorrélation spatiale (rayon 250 km)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="kpi-card text-center">
            <MapPin size={18} className="mx-auto mb-1 text-primary" />
            <p className="text-2xl font-display font-bold text-primary">{totalPredicted.toLocaleString('fr-FR')}</p>
            <p className="text-[10px] text-muted-foreground">Cas projetés (Algérie, 12m)</p>
          </div>
          <div className="kpi-card text-center">
            <TrendingUp size={18} className="mx-auto mb-1 text-destructive" />
            <p className="text-2xl font-display font-bold text-destructive">{rising}</p>
            <p className="text-[10px] text-muted-foreground">Wilayas en hausse</p>
          </div>
          <div className="kpi-card text-center">
            <p className="text-2xl font-display font-bold text-success">{falling}</p>
            <p className="text-[10px] text-muted-foreground">Wilayas en baisse</p>
          </div>
          <div className="kpi-card text-center">
            <AlertTriangle size={18} className="mx-auto mb-1 text-warning" />
            <p className="text-2xl font-display font-bold text-warning">{result.topRising.length}</p>
            <p className="text-[10px] text-muted-foreground">Hot-spots prioritaires</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Flame size={16} className="text-destructive" />
              Carte de chaleur — Algérie {result.baseYear + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HotspotMap predictions={result.predictions} />
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: '#dc2626' }} /> En hausse</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }} /> Stable</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} /> En baisse</span>
              <span className="ml-auto">Taille = score hot-spot · Couche chaleur = intensité prédite</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 wilayas à surveiller en priorité</CardTitle>
          </CardHeader>
          <CardContent>
            {result.topRising.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Pas assez de données historiques pour identifier des hot-spots. Saisir au moins 2 années de cas par wilaya.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b">
                      <th className="py-2">Rang</th>
                      <th>Wilaya</th>
                      <th className="text-right">Observé {result.baseYear}</th>
                      <th className="text-right">Prédit +12m</th>
                      <th className="text-right">Δ</th>
                      <th className="text-right">Taux/100k</th>
                      <th className="text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.topRising.map((p, i) => {
                      const delta = p.predictedNext12m - p.observedLastYear;
                      const deltaPct = p.observedLastYear > 0 ? (delta / p.observedLastYear) * 100 : 0;
                      return (
                        <tr key={p.code} className="border-b last:border-0">
                          <td className="py-2"><Badge variant={i < 3 ? 'destructive' : 'secondary'}>{i + 1}</Badge></td>
                          <td className="font-medium">{p.wilaya} <span className="text-muted-foreground text-xs">({p.code})</span></td>
                          <td className="text-right">{p.observedLastYear}</td>
                          <td className="text-right font-semibold text-destructive">{p.predictedNext12m}</td>
                          <td className={cn('text-right font-mono text-xs', delta > 0 ? 'text-destructive' : 'text-success')}>
                            {delta > 0 ? '+' : ''}{delta} ({deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(0)}%)
                          </td>
                          <td className="text-right">{p.predictedRate100k.toFixed(1)}</td>
                          <td className="text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-destructive" style={{ width: `${p.hotspotScore * 100}%` }} />
                              </div>
                              <span className="text-xs font-mono">{(p.hotspotScore * 100).toFixed(0)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-3">
              📊 Score combiné: 60% taux d'incidence prédit + 40% pente de la tendance. Lissage spatial 250 km (autocorrélation Tobler).
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
