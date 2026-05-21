import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedFields {
  topographie_icdo?: string;
  morphologie_icdo?: string;
  type_cancer?: string;
  sous_type_cancer?: string;
  grade?: string;
  comportement?: string;
  stade_tnm?: string;
  lateralite?: string;
  ref_anapath?: string;
  date_anapath?: string;
  medecin_anapath?: string;
  anomalies_moleculaires?: string;
  resume?: string;
}

interface Props {
  initialText?: string;
  onApply: (fields: ExtractedFields) => void;
}

const FIELD_LABELS: Record<keyof ExtractedFields, string> = {
  topographie_icdo: 'Topographie',
  morphologie_icdo: 'Morphologie',
  type_cancer: 'Type cancer',
  sous_type_cancer: 'Sous-type',
  grade: 'Grade',
  comportement: 'Comportement',
  stade_tnm: 'TNM',
  lateralite: 'Latéralité',
  ref_anapath: 'Réf. CR',
  date_anapath: 'Date CR',
  medecin_anapath: 'Médecin',
  anomalies_moleculaires: 'Bio. moléculaire',
  resume: 'Résumé',
};

export default function AnapathExtractor({ initialText = '', onApply }: Props) {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedFields | null>(null);

  const run = async () => {
    if (text.trim().length < 10) {
      toast.error('Collez le compte-rendu anapath (≥ 10 caractères)');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-anapath-ner', {
        body: { text },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setExtracted(data.extracted || {});
      toast.success('Champs extraits — vérifiez avant d\'appliquer');
    } catch (e: any) {
      toast.error(e.message || 'Erreur d\'extraction');
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!extracted) return;
    onApply(extracted);
    toast.success('Champs appliqués au formulaire');
  };

  const filledEntries = extracted
    ? (Object.entries(extracted) as [keyof ExtractedFields, string][]).filter(([, v]) => v && v.trim())
    : [];

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <h3 className="font-medium text-sm">Extraction IA depuis compte-rendu anapath</h3>
        <Badge variant="outline" className="ml-auto text-[10px]">NER · Gemini Flash</Badge>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Collez ici le compte-rendu d'anatomopathologie (texte libre)..."
        rows={4}
        className="text-xs font-mono"
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={run} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Extraire les champs
        </Button>
        {extracted && filledEntries.length > 0 && (
          <Button type="button" size="sm" variant="outline" onClick={apply} className="gap-1.5">
            <Check size={14} /> Appliquer ({filledEntries.length})
          </Button>
        )}
      </div>

      {extracted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2">
          {filledEntries.length === 0 && (
            <p className="text-xs text-muted-foreground italic col-span-2">Aucun champ extrait.</p>
          )}
          {filledEntries.map(([k, v]) => (
            <div key={k} className="text-xs bg-background rounded px-2 py-1 border border-border/40">
              <span className="text-muted-foreground">{FIELD_LABELS[k]}:</span>{' '}
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
