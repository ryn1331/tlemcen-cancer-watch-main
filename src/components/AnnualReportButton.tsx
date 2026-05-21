import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateAnnualReport } from '@/lib/annual-report';

export default function AnnualReportButton() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await generateAnnualReport({ year: Number(year) });
      toast.success(`Rapport annuel ${year} généré`);
    } catch (e: any) {
      toast.error(e.message || 'Erreur génération PDF');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div>
        <h3 className="font-display font-semibold flex items-center gap-2">
          <FileDown size={16} className="text-primary" /> Rapport annuel PDF
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Synthèse complète : KPI, types, géographie, démographie, indicateurs IARC.
        </p>
      </div>
      <div className="flex gap-2">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }, (_, i) => currentYear - i).map(y => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={busy} className="gap-1.5 flex-1">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
          Générer le rapport {year}
        </Button>
      </div>
    </div>
  );
}
