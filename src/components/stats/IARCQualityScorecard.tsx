import { useMemo } from 'react';
import { buildScorecard, globalGrade } from '@/lib/iarc-quality';
import { CheckCircle2, AlertCircle, XCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const colors: Record<string, string> = { good: 'text-success', acceptable: 'text-warning', poor: 'text-destructive' };
const bgColors: Record<string, string> = { good: 'bg-success/10 border-success/30', acceptable: 'bg-warning/10 border-warning/30', poor: 'bg-destructive/10 border-destructive/30' };
const Icons: Record<string, any> = { good: CheckCircle2, acceptable: AlertCircle, poor: XCircle };

export default function IARCQualityScorecard({ cases }: { cases: any[] }) {
  const indicators = useMemo(() => buildScorecard(cases), [cases]);
  const grade = useMemo(() => globalGrade(indicators), [indicators]);

  const gradeColor = grade.grade === 'A' ? 'text-success' : grade.grade === 'B' ? 'text-warning' : 'text-destructive';

  return (
    <div className="space-y-4">
      <div className="stat-card flex items-center gap-6 p-6">
        <div className={cn('flex flex-col items-center justify-center w-28 h-28 rounded-full border-4', gradeColor.replace('text-', 'border-'))}>
          <Award className={cn('mb-1', gradeColor)} size={28} />
          <p className={cn('font-display text-4xl font-bold', gradeColor)}>{grade.grade}</p>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold">Score qualité IARC CI5</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Score global : <span className="font-semibold text-foreground">{grade.score}/100</span>
            <span className="ml-2">— {grade.grade === 'A' ? 'Excellent (publiable IARC CI5)' : grade.grade === 'B' ? 'Acceptable, marges d\'amélioration' : 'Insuffisant pour publication'}</span>
          </p>
          <Progress value={grade.score} className="mt-3 h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {indicators.map(ind => {
          const Icon = Icons[ind.status];
          return (
            <div key={ind.key} className={cn('p-4 rounded-lg border-2', bgColors[ind.status])}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={colors[ind.status]} />
                  <h4 className="font-medium text-sm">{ind.label}</h4>
                </div>
                <span className={cn('text-2xl font-display font-bold', colors[ind.status])}>
                  {ind.value.toFixed(ind.key === 'mi' ? 2 : 1)}{ind.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{ind.description}</p>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>Cible: {ind.higherIsBetter ? '≥' : '≤'} {ind.threshold.good}{ind.unit}</span>
                <span>Acceptable: {ind.higherIsBetter ? '≥' : '≤'} {ind.threshold.acceptable}{ind.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
