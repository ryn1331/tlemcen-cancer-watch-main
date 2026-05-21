import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Send, Loader2, MessageSquare, Search, Video, Calendar, Clock, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string } | null;
}

interface CaseInfo {
  id: string;
  type_cancer: string;
  patients: { nom: string; prenom: string } | null;
}

export default function Discussion() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case');
  const [cases, setCases] = useState<CaseInfo[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(caseId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Meet scheduling dialog
  const [meetOpen, setMeetOpen] = useState(false);
  const [meetTheme, setMeetTheme] = useState('');
  const [meetAgenda, setMeetAgenda] = useState('');
  const [meetDate, setMeetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [meetTime, setMeetTime] = useState(() => {
    const d = new Date(); d.setMinutes(d.getMinutes() + 15);
    return d.toTimeString().slice(0, 5);
  });
  const [meetLink, setMeetLink] = useState('');
  const [meetPosting, setMeetPosting] = useState(false);

  const filteredCases = useMemo(() => {
    if (!search.trim()) return cases;
    const s = search.toLowerCase();
    return cases.filter(c =>
      `${c.patients?.nom || ''} ${c.patients?.prenom || ''}`.toLowerCase().includes(s) ||
      (c.type_cancer || '').toLowerCase().includes(s)
    );
  }, [cases, search]);

  const resetMeetDialog = () => {
    setMeetTheme(''); setMeetAgenda(''); setMeetLink('');
  };

  const createNewMeet = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
    toast.info('Copiez le lien généré par Google Meet et collez-le ci-dessous');
  };

  const pasteFromClipboard = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setMeetLink(t);
    } catch { toast.error('Accès au presse-papiers refusé'); }
  };

  const publishMeet = async () => {
    if (!selectedCase || !user) return;
    if (!meetTheme.trim()) { toast.error('Saisissez un thème'); return; }
    const link = meetLink.trim();
    if (!/^https?:\/\/(meet\.google\.com|meet\.)/i.test(link)) {
      toast.error('Lien Meet invalide'); return;
    }
    setMeetPosting(true);
    const when = new Date(`${meetDate}T${meetTime}`).toLocaleString('fr-DZ', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const card = [
      '📹 **Réunion RCP planifiée**',
      `🎯 *Thème :* ${meetTheme.trim()}`,
      `🗓️ *Quand :* ${when}`,
      meetAgenda.trim() ? `📋 *Ordre du jour :* ${meetAgenda.trim()}` : '',
      `🔗 ${link}`,
    ].filter(Boolean).join('\n');

    const { error } = await supabase.from('case_comments').insert({
      case_id: selectedCase, user_id: user.id, content: card,
    });
    setMeetPosting(false);
    if (error) { toast.error('Erreur publication'); return; }
    toast.success('Réunion partagée — le lien est cliquable dans la discussion');
    setMeetOpen(false);
    resetMeetDialog();
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      fetchComments();
      // Realtime subscription
      const channel = supabase
        .channel(`comments-${selectedCase}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'case_comments', filter: `case_id=eq.${selectedCase}` },
          (payload) => {
            setComments((prev) => [...prev, payload.new as Comment]);
            setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100);
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedCase]);

  const fetchCases = async () => {
    const { data } = await supabase.from('cancer_cases').select('id, type_cancer, patients(nom, prenom)').order('created_at', { ascending: false });
    setCases((data as any) || []);
    if (!selectedCase && data && data.length > 0) setSelectedCase(data[0].id);
    setLoading(false);
  };

  const fetchComments = async () => {
    if (!selectedCase) return;
    const { data } = await supabase
      .from('case_comments')
      .select('id, content, created_at, user_id')
      .eq('case_id', selectedCase)
      .order('created_at', { ascending: true });
    setComments(data || []);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 100);
  };

  const sendComment = async () => {
    if (!newComment.trim() || !selectedCase || !user) return;
    setSending(true);
    const { error } = await supabase.from('case_comments').insert({
      case_id: selectedCase,
      user_id: user.id,
      content: newComment.trim(),
    });
    if (error) toast.error('Erreur envoi');
    else setNewComment('');
    setSending(false);
  };

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Discussion RCP</h1>
            <p className="text-muted-foreground text-sm">Réunion de Concertation Pluridisciplinaire</p>
          </div>
          <Dialog open={meetOpen} onOpenChange={(o) => { setMeetOpen(o); if (!o) resetMeetDialog(); }}>
            <DialogTrigger asChild>
              <Button
                disabled={!selectedCase}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20"
              >
                <Video size={16} /> Planifier une réunion RCP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px]">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md shadow-primary/20">
                    <Video className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">Planifier une réunion RCP</DialogTitle>
                    <DialogDescription className="text-xs">
                      Créez ou rejoignez un Google Meet et partagez le lien dans la discussion
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="meet-theme" className="text-xs font-semibold">Thème de la réunion *</Label>
                  <Input
                    id="meet-theme"
                    value={meetTheme}
                    onChange={(e) => setMeetTheme(e.target.value)}
                    placeholder="Ex: RCP cancer du sein — dossier complexe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="meet-date" className="text-xs font-semibold flex items-center gap-1.5">
                      <Calendar size={12} /> Date
                    </Label>
                    <Input id="meet-date" type="date" value={meetDate} onChange={(e) => setMeetDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meet-time" className="text-xs font-semibold flex items-center gap-1.5">
                      <Clock size={12} /> Heure
                    </Label>
                    <Input id="meet-time" type="time" value={meetTime} onChange={(e) => setMeetTime(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meet-agenda" className="text-xs font-semibold">Ordre du jour (optionnel)</Label>
                  <Textarea
                    id="meet-agenda"
                    value={meetAgenda}
                    onChange={(e) => setMeetAgenda(e.target.value)}
                    placeholder="Points à aborder…"
                    rows={2}
                  />
                </div>

                {/* Lien Meet — Créer ou Rejoindre */}
                <div className="space-y-1.5">
                  <Label htmlFor="meet-link" className="text-xs font-semibold">Lien Google Meet *</Label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button type="button" variant="outline" size="sm" onClick={createNewMeet} className="gap-1.5">
                      <ExternalLink size={13} /> Créer
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={pasteFromClipboard} className="gap-1.5">
                      <Copy size={13} /> Rejoindre (coller)
                    </Button>
                  </div>
                  <Input
                    id="meet-link"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="font-mono text-sm"
                  />
                  {meetLink && /^https?:\/\//.test(meetLink) && (
                    <a href={meetLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
                      <ExternalLink size={11} /> Tester le lien
                    </a>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button onClick={publishMeet} disabled={meetPosting} className="gap-2 w-full sm:w-auto">
                  {meetPosting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Partager dans la discussion
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-260px)] lg:h-[calc(100vh-220px)]">
          {/* Case List */}
          <div className="stat-card overflow-hidden lg:col-span-1 flex flex-col max-h-64 lg:max-h-none">
            <h3 className="font-display font-semibold mb-3 text-sm">Cas</h3>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou cancer…"
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="space-y-1 overflow-y-auto flex-1">
              {filteredCases.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun cas</p>
              ) : filteredCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCase === c.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                >
                  <p className="font-medium truncate">{c.patients?.nom} {c.patients?.prenom}</p>
                  <p className="text-xs text-muted-foreground">{c.type_cancer}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="stat-card flex flex-col lg:col-span-2 min-h-0">
            {selectedCase ? (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <MessageSquare size={32} className="mb-2" />
                      <p className="text-sm">Aucun commentaire</p>
                      <p className="text-xs">Commencez la discussion</p>
                    </div>
                  ) : comments.map((c) => (
                    <div key={c.id} className={`flex ${c.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-2 ${c.user_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {c.content.split(/(\bhttps?:\/\/\S+)/g).map((part, i) =>
                            /^https?:\/\//.test(part) ? (
                              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-medium">{part}</a>
                            ) : <span key={i}>{part}</span>
                          )}
                        </p>
                        <p className="text-[10px] opacity-60 mt-1">
                          {new Date(c.created_at).toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendComment()}
                    placeholder="Votre commentaire..."
                    className="flex-1"
                  />
                  <Button onClick={sendComment} disabled={sending} className="h-10 w-10 p-0" size="icon">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">Sélectionnez un cas pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
