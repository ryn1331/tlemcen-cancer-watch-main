import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Sparkles, User, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Msg { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  "Quelle wilaya a le plus de cas de cancer du sein ?",
  "Quelle est la répartition par sexe dans le registre ?",
  "Quel est le top 5 des cancers les plus fréquents ?",
  "L'incidence augmente-t-elle ces dernières années ?",
  "Quel est l'âge moyen au diagnostic ?",
];

export default function RegistryChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const newMsgs: Msg[] = [...messages, { role: 'user', content }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('registry-assistant', {
        body: { messages: newMsgs },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('429')) toast.error('Trop de requêtes. Patientez quelques secondes.');
      else if (msg.includes('402')) toast.error('Crédits IA épuisés. Contactez l\'administrateur.');
      else toast.error('Erreur: ' + msg);
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Erreur de communication avec l\'IA. Réessayez.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>
        <div className="hero-banner p-5 md:p-6 text-white">
          <div className="relative z-10 flex items-center gap-3">
            <Sparkles className="text-white/90" size={28} />
            <div>
              <p className="text-white/70 text-sm">Assistant IA — Parle au Registre</p>
              <h1 className="font-display text-xl md:text-2xl font-bold mt-0.5">Pose ta question en langage naturel</h1>
              <p className="text-white/60 text-xs mt-1">
                Assistant de consultation du registre · Données agrégées et anonymisées (conforme ANPDP 18-07)
              </p>
            </div>
          </div>
        </div>

        <Card className="flex flex-col h-[600px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="text-primary" size={32} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">Bonjour 👋</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Je suis l'assistant du Registre du Cancer. Pose-moi une question sur les statistiques épidémiologiques du registre.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-sm p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      💬 {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-primary" />}
                </div>
                <div className={cn(
                  'rounded-2xl px-4 py-2.5 max-w-[80%] text-sm',
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'
                )}>
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-muted/50 flex items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={14} />
                  <span className="text-xs text-muted-foreground">Analyse du registre...</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-3 flex gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Pose ta question... (Entrée pour envoyer)"
              rows={2}
              className="resize-none"
              disabled={loading}
            />
            <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon" className="h-auto">
              <Send size={16} />
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
