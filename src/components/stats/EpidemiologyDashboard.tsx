import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, Percent, Calendar, BarChart3 } from 'lucide-react';
import AgePyramid from './AgePyramid';
import TopLocationsTable from './TopLocationsTable';
import {
  type CaseWithPatient, type PopulationRow,
  groupByAgeAndSex, topLocations, casesToAgeMap, populationToAgeMap,
  calculateASR, crudeRate, sexRatio,
  cumulativeRate074, SEGI_WEIGHTS, SEGI_TOTAL,
  EUROPEAN_WEIGHTS, WHO2000_WEIGHTS, WHO2000_TOTAL,
  truncatedASR, asrWithCI, medianAge, meanAge,
  asrByCancerType, annualPercentChange,
} from '@/lib/epidemiology';
import { cn } from '@/lib/utils';

interface Props {
  cases: CaseWithPatient[];
  population: PopulationRow[];
}

export default function EpidemiologyDashboard({ cases, population }: Props) {
  const totalPop = useMemo(() => population.reduce((s, r) => s + r.population, 0), [population]);
  const totalCases = cases.length;

  const casesByAge = useMemo(() => casesToAgeMap(cases), [cases]);
  const popByAge = useMemo(() => populationToAgeMap(population), [population]);

  const asrWorldData = useMemo(() => asrWithCI(casesByAge, popByAge, SEGI_WEIGHTS, SEGI_TOTAL), [casesByAge, popByAge]);
  const asrEurope = useMemo(() => calculateASR(casesByAge, popByAge, EUROPEAN_WEIGHTS, 100000), [casesByAge, popByAge]);
  const asrWHO = useMemo(() => calculateASR(casesByAge, popByAge, WHO2000_WEIGHTS, WHO2000_TOTAL), [casesByAge, popByAge]);
  const cumRisk = useMemo(() => cumulativeRate074(casesByAge, popByAge), [casesByAge, popByAge]);
  const tasr3564 = useMemo(() => truncatedASR(casesByAge, popByAge), [casesByAge, popByAge]);

  const maleCount = cases.filter(c => c.patients?.sexe === 'M').length;
  const femaleCount = cases.filter(c => c.patients?.sexe === 'F').length;
  const mfRatio = sexRatio(maleCount, femaleCount);

  const medAge = useMemo(() => medianAge(cases), [cases]);
  const mAge = useMemo(() => meanAge(cases), [cases]);

  const ageData = useMemo(() => groupByAgeAndSex(cases), [cases]);
  const top10 = useMemo(() => topLocations(cases, 10), [cases]);

  // ASR by cancer type
  const asrByType = useMemo(() => asrByCancerType(cases, popByAge), [cases, popByAge]);

  // Evolution by year with APC
  const evolution = useMemo(() => {
    const yearCounts: Record<string, number> = {};
    cases.forEach(c => {
      const y = new Date(c.date_diagnostic).getFullYear().toString();
      yearCounts[y] = (yearCounts[y] || 0) + 1;
    });
    return Object.entries(yearCounts).sort().map(([year, cas]) => ({
      year,
      cas,
      rate: totalPop > 0 ? parseFloat(((cas / totalPop) * 100000).toFixed(1)) : 0,
    }));
  }, [cases, totalPop]);

  const apc = useMemo(() => {
    if (evolution.length < 3) return null;
    return annualPercentChange(evolution.map(e => ({ year: parseInt(e.year), rate: e.rate })));
  }, [evolution]);

  const kpis = [
    { label: 'Total Cas', value: totalCases, icon: Users, color: 'text-primary', sub: `H: ${maleCount} · F: ${femaleCount}` },
    { label: 'Ratio M/F', value: mfRatio === Infinity ? '∞' : mfRatio.toFixed(2), icon: Users, color: 'text-chart-5', sub: `Médiane: ${medAge.toFixed(0)} ans` },
    { label: 'Risque cumulé 0-74', value: cumRisk.toFixed(2) + '%', icon: Percent, color: 'text-destructive', sub: `TASR 35-64: ${tasr3564.toFixed(1)}` },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="kpi-card text-center w-full">
            <k.icon size={18} className={cn('mx-auto mb-1', k.color)} />
            <p className={cn('text-xl md:text-2xl font-display font-bold', k.color)}>{k.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{k.label}</p>
            <p className="text-[9px] text-muted-foreground/70 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ASR by Cancer Type — GLOBOCAN style */}
      <div className="stat-card">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-primary" />
          Incidence par Localisation — ASR (Monde) pour 100 000
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground text-xs">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Cancer</th>
                <th className="pb-2 font-medium text-center">Cas</th>
                <th className="pb-2 font-medium text-center">%</th>
                <th className="pb-2 font-medium text-center">ASR (Monde)</th>
                <th className="pb-2 font-medium text-center">ASR ♂</th>
                <th className="pb-2 font-medium text-center">ASR ♀</th>
                <th className="pb-2 font-medium text-center">Âge médian</th>
                <th className="pb-2 font-medium w-28"></th>
              </tr>
            </thead>
            <tbody>
              {asrByType.map((row, i) => {
                const maxASR = Math.max(...asrByType.map(r => r.asr), 1);
                return (
                  <tr key={row.type} className="border-b border-border/30 hover:bg-muted/30 transition-colors text-xs">
                    <td className="py-2 font-bold text-muted-foreground">{i + 1}</td>
                    <td className="py-2 font-medium">{row.type}</td>
                    <td className="py-2 text-center font-semibold">{row.count}</td>
                    <td className="py-2 text-center text-muted-foreground">{row.percentage}%</td>
                    <td className="py-2 text-center font-bold text-primary">{row.asr.toFixed(1)}</td>
                    <td className="py-2 text-center" style={{ color: 'hsl(213, 80%, 50%)' }}>{row.asrMale.toFixed(1)}</td>
                    <td className="py-2 text-center" style={{ color: 'hsl(340, 65%, 55%)' }}>{row.asrFemale.toFixed(1)}</td>
                    <td className="py-2 text-center">{row.medianAge > 0 ? row.medianAge.toFixed(0) : '—'}</td>
                    <td className="py-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${(row.asr / maxASR) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 10 + Pyramid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">🏆 Top 10 Localisations Tumorales</h3>
          <TopLocationsTable data={top10} />
        </div>
        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">📊 Pyramide des Âges</h3>
          <AgePyramid data={ageData} />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="stat-card">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          Résumé Démographique
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { l: 'Population totale', v: totalPop.toLocaleString('fr-FR') },
            { l: 'Âge médian diagnostic', v: `${medAge.toFixed(1)} ans` },
            { l: 'Âge moyen diagnostic', v: `${mAge.toFixed(1)} ans` },
            { l: 'ASR tronqué (35-64)', v: tasr3564.toFixed(1) },
            { l: 'Localisations distinctes', v: asrByType.length.toString() },
          ].map(item => (
            <div key={item.l} className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-lg font-bold font-display">{item.v}</p>
              <p className="text-[10px] text-muted-foreground">{item.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution with APC */}
      {evolution.length > 1 && (
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Évolution Temporelle
            </h3>
            {apc && (
              <div className={cn(
                'text-xs font-medium px-3 py-1 rounded-full',
                apc.significant
                  ? apc.apc > 0 ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'
                  : 'bg-muted text-muted-foreground'
              )}>
                APC: {apc.apc > 0 ? '+' : ''}{apc.apc}%/an
                {apc.significant ? ' *' : ' (NS)'}
              </div>
            )}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="cas" stroke="hsl(213, 80%, 50%)" strokeWidth={2.5} dot={{ r: 4 }} name="Nombre de cas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {apc && (
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              * APC (Annual Percent Change) calculé par régression log-linéaire — Méthode NCI/SEER.
              {apc.significant ? ' Tendance statistiquement significative (p&lt;0.05).' : ' Tendance non significative.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
