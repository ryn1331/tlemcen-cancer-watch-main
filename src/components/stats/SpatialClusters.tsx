import { useMemo } from 'react';
import { globalMoran, localMoran, type AreaPoint } from '@/lib/spatial-stats';
import { ALGERIA_WILAYAS } from '@/lib/algeria-wilayas';
import { calculateASR, casesToAgeMap, populationToAgeMap } from '@/lib/epidemiology';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const clusterLabels: Record<string, { label: string; color: string }> = {
  HH: { label: 'Hot spot (haut-haut)', color: 'bg-destructive/15 text-destructive border-destructive/40' },
  LL: { label: 'Cold spot (bas-bas)', color: 'bg-primary/15 text-primary border-primary/40' },
  HL: { label: 'Outlier (haut-bas)', color: 'bg-warning/15 text-warning border-warning/40' },
  LH: { label: 'Outlier (bas-haut)', color: 'bg-warning/15 text-warning border-warning/40' },
  NS: { label: 'Non significatif', color: 'bg-muted text-muted-foreground border-border' },
};

export default function SpatialClusters({ cases, population }: { cases: any[]; population: any[] }) {
  const areas = useMemo<AreaPoint[]>(() => {
    const popMap = populationToAgeMap(population);
    return ALGERIA_WILAYAS.map(w => {
      const wCases = cases.filter(c => c.patients?.wilaya === w.name);
      if (wCases.length === 0) return null;
      const caseMap = casesToAgeMap(wCases);
      const asr = calculateASR(caseMap, popMap);
      return { code: w.code, name: w.name, lat: w.lat, lng: w.lng, rate: asr };
    }).filter((a): a is AreaPoint => a !== null);
  }, [cases, population]);

  const moran = useMemo(() => globalMoran(areas), [areas]);
  const lisa = useMemo(() => localMoran(areas), [areas]);
  const significant = lisa.filter(l => l.cluster !== 'NS').sort((a, b) => a.pValue - b.pValue);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold">Clusters spatiaux (Moran's I + LISA)</h3>
        <p className="text-xs text-muted-foreground">Détection d'agrégats géographiques anormaux d'incidence</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold text-primary">{moran.I}</p>
          <p className="text-[10px] text-muted-foreground">Moran's I global</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-2xl font-display font-bold">{moran.zScore}</p>
          <p className="text-[10px] text-muted-foreground">Z-score</p>
        </div>
        <div className="kpi-card text-center">
          <p className={cn('text-2xl font-display font-bold', moran.pValue < 0.05 ? 'text-destructive' : 'text-muted-foreground')}>{moran.pValue}</p>
          <p className="text-[10px] text-muted-foreground">p-value</p>
        </div>
        <div className="kpi-card text-center">
          <p className="text-sm font-medium">
            {moran.interpretation === 'clustered' && <><AlertTriangle className="inline text-destructive mb-1" size={20} /><br/>Clustering significatif</>}
            {moran.interpretation === 'dispersed' && <><CheckCircle className="inline text-success mb-1" size={20} /><br/>Distribution dispersée</>}
            {moran.interpretation === 'random' && <><CheckCircle className="inline text-muted-foreground mb-1" size={20} /><br/>Aléatoire</>}
          </p>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Clusters locaux significatifs (LISA, p&lt;0.05)</h4>
          <Badge variant="secondary">{significant.length} wilaya(s)</Badge>
        </div>
        {significant.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Aucun cluster significatif détecté.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {significant.map(l => (
              <div key={l.code} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{l.name}</p>
                    <p className="text-[10px] text-muted-foreground">ASR {l.rate.toFixed(1)} · z={l.zScore} · p={l.pValue}</p>
                  </div>
                </div>
                <Badge className={cn('text-[10px] border', clusterLabels[l.cluster].color)} variant="outline">
                  {clusterLabels[l.cluster].label}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
