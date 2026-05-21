import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Suggestion {
  topographie: string;
  topographie_label: string;
  morphologie: string;
  morphologie_label: string;
  comportement: string;
  grade: string;
  confidence: number;
  rationale: string;
}

interface Props {
  initialDescription?: string;
  onApply?: (s: Suggestion) => void;
}

export default function IcdoSuggester({ initialDescription = '', onApply }: Props) {
  const [text, setText] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const run = async () => {
    if (!text.trim()) { toast.error('Saisis une description clinique'); return; }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('autocode-icdo', {
      body: { description: text },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSuggestions(data?.suggestions || []);
    if (!data?.suggestions?.length) toast.info('Aucune suggestion');
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={16} />
          <h3 className="font-semibold text-sm">Autocodage CIM-O-3 par IA</h3>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Carcinome canalaire infiltrant du quadrant supéro-externe du sein gauche, grade SBR II…"
          rows={3}
          className="text-sm"
        />
        <Button onClick={run} disabled={loading} size="sm" className="w-full">
          {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles size={14} className="mr-2" />}
          Suggérer les codes CIM-O-3
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {suggestions.map((s, i) => (
              <div key={i} className="border rounded-lg p-3 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="font-mono">{s.topographie}</Badge>
                    <Badge variant="secondary" className="font-mono">{s.morphologie}</Badge>
                    {s.grade && <Badge variant="outline">Grade {s.grade}</Badge>}
                    <Badge className="bg-success/10 text-success border-success/20">
                      {(s.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  {onApply && (
                    <Button size="sm" variant="ghost" onClick={() => onApply(s)}>
                      <Check size={14} className="mr-1" />Appliquer
                    </Button>
                  )}
                </div>
                <p className="text-xs"><strong>{s.topographie_label}</strong> · {s.morphologie_label}</p>
                {s.rationale && <p className="text-xs text-muted-foreground mt-1">{s.rationale}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
