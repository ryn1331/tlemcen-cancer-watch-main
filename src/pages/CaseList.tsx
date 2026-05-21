import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Trash2, Loader2, FileX, FilePlus2, User, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface CaseRow {
  id: string;
  type_cancer: string;
  stade_tnm: string | null;
  date_diagnostic: string;
  statut: string;
  created_at: string;
  patients: {
    nom: string;
    prenom: string;
    sexe: string;
    date_naissance: string | null;
    commune: string | null;
  } | null;
}

export default function CaseList() {
  const { role } = useAuth();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSexe, setFilterSexe] = useState('all');
  const [pendingDelete, setPendingDelete] = useState<CaseRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cancer_cases')
      .select('id, type_cancer, stade_tnm, date_diagnostic, statut, created_at, patients(nom, prenom, sexe, date_naissance, commune)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } else {
      setCases((data as any) || []);
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase.from('cancer_cases').delete().eq('id', pendingDelete.id);
    setDeleting(false);
    if (error) {
      toast.error('Erreur de suppression');
    } else {
      toast.success('Cas supprimé');
      setCases((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      setPendingDelete(null);
    }
  };

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = q === '' ||
      c.type_cancer.toLowerCase().includes(q) ||
      c.patients?.nom?.toLowerCase().includes(q) ||
      c.patients?.prenom?.toLowerCase().includes(q);
    const matchType = filterType === 'all' || c.type_cancer === filterType;
    const matchSexe = filterSexe === 'all' || c.patients?.sexe === filterSexe;
    return matchSearch && matchType && matchSexe;
  });

  const uniqueTypes = [...new Set(cases.map((c) => c.type_cancer))];

  const sexeLabel = (s: string | undefined) => s === 'M' ? 'Masculin' : s === 'F' ? 'Féminin' : 'Inconnu';

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Liste des Cas</h1>
            <p className="text-muted-foreground text-sm" aria-live="polite" aria-atomic="true">
              {loading ? 'Chargement…' : `${filtered.length} cas trouvé${filtered.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link to="/nouveau-cas" className="w-full sm:w-auto">
            <Button className="h-11 w-full sm:w-auto gap-1">
              <Plus size={16} aria-hidden="true" /> Nouveau Cas
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3" role="search" aria-label="Filtres de la liste">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Label htmlFor="case-search" className="sr-only">Rechercher un cas</Label>
            <Input
              id="case-search"
              placeholder="Rechercher par nom, prénom ou type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              type="search"
              aria-controls="case-results"
            />
          </div>
          <div>
            <Label htmlFor="filter-type" className="sr-only">Filtrer par type de cancer</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="w-full sm:w-48"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {uniqueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-sexe" className="sr-only">Filtrer par sexe</Label>
            <Select value={filterSexe} onValueChange={setFilterSexe}>
              <SelectTrigger id="filter-sexe" className="w-full sm:w-36"><SelectValue placeholder="Sexe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results region */}
        <div id="case-results">
          {loading ? (
            <div className="flex justify-center py-12" role="status" aria-label="Chargement des cas">
              <Loader2 className="animate-spin text-primary" size={32} aria-hidden="true" />
              <span className="sr-only">Chargement…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border/60 bg-muted/20">
              <FileX size={40} className="mx-auto text-muted-foreground mb-3" aria-hidden="true" />
              <p className="text-base font-medium text-foreground">Aucun cas trouvé</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search || filterType !== 'all' || filterSexe !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par enregistrer un nouveau cas'}
              </p>
              <Link to="/nouveau-cas" className="inline-block mt-4">
                <Button variant="outline" className="gap-1">
                  <FilePlus2 size={16} aria-hidden="true" /> Ajouter un cas
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-border/40 bg-card">
                <table className="w-full text-sm">
                  <caption className="sr-only">
                    Liste des cas enregistrés — {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                  </caption>
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th scope="col" className="px-4 py-3 font-medium">Patient</th>
                      <th scope="col" className="px-4 py-3 font-medium">Type</th>
                      <th scope="col" className="px-4 py-3 font-medium">Stade</th>
                      <th scope="col" className="px-4 py-3 font-medium">Date Diag.</th>
                      <th scope="col" className="px-4 py-3 font-medium text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const fullName = `${c.patients?.nom ?? ''} ${c.patients?.prenom ?? ''}`.trim() || 'Patient inconnu';
                      return (
                        <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 focus-within:bg-muted/30 transition-colors">
                          <th scope="row" className="px-4 py-3 font-normal text-left">
                            <p className="font-medium text-foreground">{fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              <span aria-label={sexeLabel(c.patients?.sexe)}>{c.patients?.sexe === 'M' ? '♂' : '♀'}</span>
                              <span aria-hidden="true"> · </span>
                              {c.patients?.commune || 'Commune non renseignée'}
                            </p>
                          </th>
                          <td className="px-4 py-3">{c.type_cancer}</td>
                          <td className="px-4 py-3 font-mono text-xs">{c.stade_tnm || '—'}</td>
                          <td className="px-4 py-3">
                            <time dateTime={c.date_diagnostic}>
                              {new Date(c.date_diagnostic).toLocaleDateString('fr-DZ')}
                            </time>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-end">
                              <Link to={`/patient?case=${c.id}&tab=patient`} aria-label={`Dossier patient ${fullName}`}>
                                <Button variant="outline" size="sm" className="h-9 gap-1" tabIndex={-1}>
                                  <User size={13} aria-hidden="true" /> Patient
                                </Button>
                              </Link>
                              <Link to={`/patient?case=${c.id}&tab=cancer`} aria-label={`Dossier cancer ${fullName}`}>
                                <Button variant="secondary" size="sm" className="h-9 gap-1" tabIndex={-1}>
                                  <Activity size={13} aria-hidden="true" /> Cancer
                                </Button>
                              </Link>
                              {role === 'admin' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:bg-destructive/10"
                                  onClick={() => setPendingDelete(c)}
                                  aria-label={`Supprimer le cas de ${fullName}`}
                                >
                                  <Trash2 size={14} aria-hidden="true" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <ul className="md:hidden space-y-3" aria-label="Liste des cas">
                {filtered.map((c) => {
                  const fullName = `${c.patients?.nom ?? ''} ${c.patients?.prenom ?? ''}`.trim() || 'Patient inconnu';
                  return (
                    <li key={c.id} className="stat-card">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            <span aria-label={sexeLabel(c.patients?.sexe)}>{c.patients?.sexe === 'M' ? '♂' : '♀'}</span>
                            <span aria-hidden="true"> · </span>
                            {c.patients?.commune || 'N/A'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{c.stade_tnm || '—'}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{c.type_cancer}</p>
                          <p className="text-xs text-muted-foreground">
                            <time dateTime={c.date_diagnostic}>
                              {new Date(c.date_diagnostic).toLocaleDateString('fr-DZ')}
                            </time>
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                          <Link to={`/patient?case=${c.id}&tab=patient`} aria-label={`Dossier patient ${fullName}`}>
                            <Button variant="outline" size="sm" className="h-9 gap-1" tabIndex={-1}>
                              <User size={13} aria-hidden="true" /> Patient
                            </Button>
                          </Link>
                          <Link to={`/patient?case=${c.id}&tab=cancer`} aria-label={`Dossier cancer ${fullName}`}>
                            <Button variant="secondary" size="sm" className="h-9 gap-1" tabIndex={-1}>
                              <Activity size={13} aria-hidden="true" /> Cancer
                            </Button>
                          </Link>
                          {role === 'admin' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-destructive"
                              onClick={() => setPendingDelete(c)}
                              aria-label={`Supprimer le cas de ${fullName}`}
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Accessible delete confirmation */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est <strong>irréversible</strong>. Le cas
              {pendingDelete?.patients && (
                <> de <strong>{pendingDelete.patients.nom} {pendingDelete.patients.prenom}</strong></>
              )}
              {' '}sera définitivement supprimé du registre.
              <br /><br />
              Conformément à la loi 25-11 ANPDP, cette suppression sera tracée dans le journal d'audit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 size={14} className="animate-spin mr-1" aria-hidden="true" />}
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
