import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Loader2, Shield, Users, UserPlus, Settings2, Trash2, Plus, Edit2, Save, XCircle, CheckCircle2, Circle,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type AppRole = 'admin' | 'medecin' | 'epidemiologiste' | 'anapath' | 'assistante' | 'medecin_valideur';

interface UserRow { user_id: string; full_name: string; role: string; }
interface FormConfigRow { id: string; category: string; label: string; value: string; sort_order: number; is_active: boolean; }
interface CustomFieldRow { id: string; field_name: string; field_label: string; field_type: string; tab_id: string; is_required: boolean; is_active: boolean; sort_order: number; options: any; }

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur', medecin: 'Médecin', epidemiologiste: 'Épidémiologiste',
  anapath: 'Anatomopathologiste', assistante: 'Assistante Médicale',
  medecin_valideur: 'Médecin valideur',
};

const CONFIG_CATEGORIES = [
  { key: 'cancer_type', label: 'Types de cancer' },
  { key: 'cancer_subtype', label: 'Sous-types' },
  { key: 'commune', label: 'Communes' },
  { key: 'methode_diagnostic', label: 'Méthodes diagnostic' },
  { key: 'grade', label: 'Grades' },
  { key: 'traitement_type', label: 'Types traitement' },
  { key: 'source_info', label: 'Sources info' },
];

const TAB_OPTIONS = [
  { value: 'identite', label: 'Identité' },
  { value: 'epidemio', label: 'Épidémiologie' },
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'topographie', label: 'Topographie' },
  { value: 'morphologie', label: 'Morphologie' },
  { value: 'stade', label: 'Stade' },
  { value: 'traitement', label: 'Traitement' },
  { value: 'suivi', label: 'Suivi' },
];

export default function Admin() {
  const { role, user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [formConfig, setFormConfig] = useState<FormConfigRow[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Create user form
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'medecin' as AppRole });
  const [creatingUser, setCreatingUser] = useState(false);

  // Password reset dialog
  const [pwdResetUser, setPwdResetUser] = useState<UserRow | null>(null);
  const [pwdResetValue, setPwdResetValue] = useState('');

  // Config form
  const [selectedCategory, setSelectedCategory] = useState('cancer_type');
  const [newConfigLabel, setNewConfigLabel] = useState('');
  const [newConfigValue, setNewConfigValue] = useState('');
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  // Custom field form
  const [newField, setNewField] = useState({ field_name: '', field_label: '', field_type: 'text', tab_id: 'suivi', is_required: false });

  useEffect(() => {
    if (role === 'admin') fetchData();
  }, [role]);

  if (role && role !== 'admin') return <Navigate to="/" replace />;

  const fetchData = async () => {
    const [usersRes, configRes, fieldsRes] = await Promise.all([
      supabase.from('profiles').select('user_id, full_name'),
      supabase.from('form_config').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('custom_fields').select('*').order('sort_order'),
    ]);

    if (usersRes.data) {
      const rolesRes = await supabase.from('user_roles').select('user_id, role');
      const roleMap: Record<string, string> = {};
      rolesRes.data?.forEach((r: any) => { roleMap[r.user_id] = r.role; });
      setUsers(usersRes.data.map((p: any) => ({ user_id: p.user_id, full_name: p.full_name, role: roleMap[p.user_id] || 'medecin' })));
    }

    setFormConfig((configRes.data as any) || []);
    setCustomFields((fieldsRes.data as any) || []);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('user_roles').update({ role: newRole as any }).eq('user_id', userId);
    if (error) { toast.error('Erreur: ' + error.message); return; }
    toast.success('Rôle mis à jour');
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error('Tous les champs sont requis'); return;
    }
    setCreatingUser(true);
    try {
      const res = await supabase.functions.invoke('create-user', { body: newUser });
      if (res.error) throw res.error;
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(`Compte créé pour ${newUser.full_name}`);
      setNewUser({ email: '', password: '', full_name: '', role: 'medecin' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur de création');
    } finally {
      setCreatingUser(false);
    }
  };

  const deleteUser = async (u: UserRow) => {
    try {
      const res = await supabase.functions.invoke('manage-user', { body: { action: 'delete', user_id: u.user_id } });
      if (res.error) throw res.error;
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(`Compte supprimé : ${u.full_name}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur de suppression');
    }
  };

  const submitPasswordReset = async () => {
    if (!pwdResetUser) return;
    try {
      const res = await supabase.functions.invoke('manage-user', {
        body: { action: 'update_password', user_id: pwdResetUser.user_id, new_password: pwdResetValue },
      });
      if (res.error) throw res.error;
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(`Mot de passe modifié pour ${pwdResetUser.full_name}`);
      setPwdResetUser(null);
      setPwdResetValue('');
    } catch (err: any) {
      toast.error(err.message || 'Erreur');
    }
  };

  const addConfigItem = async () => {
    if (!newConfigLabel.trim()) return;
    const val = newConfigValue.trim() || newConfigLabel.trim();
    const maxOrder = formConfig.filter(c => c.category === selectedCategory).length;
    const { error } = await supabase.from('form_config').insert({
      category: selectedCategory, label: newConfigLabel.trim(), value: val, sort_order: maxOrder + 1,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Élément ajouté');
    setNewConfigLabel(''); setNewConfigValue('');
    fetchData();
  };

  const updateConfigItem = async (id: string) => {
    const { error } = await supabase.from('form_config').update({ label: editLabel }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Modifié');
    setEditingConfigId(null);
    fetchData();
  };

  const deleteConfigItem = async (id: string) => {
    const { error } = await supabase.from('form_config').update({ is_active: false }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Supprimé');
    fetchData();
  };

  const addCustomField = async () => {
    if (!newField.field_name || !newField.field_label) { toast.error('Nom et libellé requis'); return; }
    const { error } = await supabase.from('custom_fields').insert({
      ...newField, sort_order: customFields.length + 1,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Champ ajouté');
    setNewField({ field_name: '', field_label: '', field_type: 'text', tab_id: 'suivi', is_required: false });
    fetchData();
  };

  const toggleCustomField = async (id: string, active: boolean) => {
    await supabase.from('custom_fields').update({ is_active: !active }).eq('id', id);
    fetchData();
  };

  const deleteCustomField = async (id: string) => {
    await supabase.from('custom_fields').delete().eq('id', id);
    toast.success('Champ supprimé');
    fetchData();
  };

  const categoryItems = formConfig.filter(c => c.category === selectedCategory);

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20" role="status" aria-live="polite">
        <Loader2 className="animate-spin text-primary" size={32} aria-hidden="true" />
        <span className="sr-only">Chargement de l'administration…</span>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={24} />
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Administration</h1>
            <p className="text-muted-foreground text-sm">Gestion des comptes et configuration du formulaire</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="users" className="gap-1.5"><Users size={14} /> Utilisateurs</TabsTrigger>
            <TabsTrigger value="config" className="gap-1.5"><Settings2 size={14} /> Listes</TabsTrigger>
            <TabsTrigger value="fields" className="gap-1.5"><Plus size={14} /> Champs</TabsTrigger>
          </TabsList>

          {/* ========== USERS TAB ========== */}
          <TabsContent value="users" className="space-y-4">
            <div className="stat-card space-y-3">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <UserPlus size={18} className="text-primary" /> Créer un compte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="new-user-name" required>Nom complet</Label>
                  <Input id="new-user-name" value={newUser.full_name} onChange={e => setNewUser(p => ({ ...p, full_name: e.target.value }))} placeholder="Dr. Ahmed Benali" className="mt-1" autoComplete="name" autoCapitalize="words" aria-required="true" />
                </div>
                <div>
                  <Label htmlFor="new-user-email" required>Email</Label>
                  <Input id="new-user-email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="email@chu-tlemcen.dz" className="mt-1" aria-required="true" />
                </div>
                <div>
                  <Label htmlFor="new-user-pwd" required>Mot de passe</Label>
                  <Input id="new-user-pwd" type="password" autoComplete="new-password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 caractères" className="mt-1" aria-required="true" aria-describedby="new-user-pwd-hint" />
                  <span id="new-user-pwd-hint" className="sr-only">Minimum 6 caractères</span>
                </div>
                <div>
                  <Label htmlFor="new-user-role">Rôle</Label>
                  <Select value={newUser.role} onValueChange={v => setNewUser(p => ({ ...p, role: v as AppRole }))}>
                    <SelectTrigger id="new-user-role" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={createUser} disabled={creatingUser} aria-busy={creatingUser} className="gap-1.5">
                {creatingUser ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <UserPlus size={14} aria-hidden="true" />}
                Créer le compte
              </Button>
            </div>

            <div className="stat-card">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Users size={18} className="text-primary" /> Comptes existants ({users.length})
              </h3>
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.user_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {u.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <span className="font-medium text-sm">{u.full_name || 'Sans nom'}</span>
                        {u.user_id === user?.id && <Badge variant="secondary" className="ml-2 text-[10px]">Vous</Badge>}
                        <p className="text-xs text-muted-foreground">{ROLE_LABELS[u.role] || u.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={u.role} onValueChange={v => updateRole(u.user_id, v)} disabled={u.user_id === user?.id}>
                        <SelectTrigger className="w-44" aria-label={`Modifier le rôle de ${u.full_name || 'utilisateur'}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm" variant="outline"
                        disabled={u.user_id === user?.id}
                        onClick={() => { setPwdResetUser(u); setPwdResetValue(''); }}
                        aria-label={`Réinitialiser le mot de passe de ${u.full_name}`}
                      >
                        <Edit2 size={12} className="mr-1" /> Mot de passe
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive" disabled={u.user_id === user?.id} aria-label={`Supprimer ${u.full_name}`}>
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Le compte « {u.full_name} » sera définitivement supprimé (authentification, profil et rôle). Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteUser(u)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Password reset dialog */}
            <AlertDialog open={!!pwdResetUser} onOpenChange={(o) => { if (!o) { setPwdResetUser(null); setPwdResetValue(''); } }}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nouveau mot de passe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Définir un nouveau mot de passe pour <strong>{pwdResetUser?.full_name}</strong>. L'utilisateur devra l'utiliser à sa prochaine connexion.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                  <Label htmlFor="pwd-reset">Mot de passe (min. 6 caractères)</Label>
                  <Input id="pwd-reset" type="text" value={pwdResetValue} onChange={e => setPwdResetValue(e.target.value)} placeholder="••••••••" className="mt-1" />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={submitPasswordReset} disabled={pwdResetValue.length < 6}>Enregistrer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* ========== CONFIG TAB (Lists) ========== */}
          <TabsContent value="config" className="stat-card space-y-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Settings2 size={18} className="text-primary" /> Gestion des listes déroulantes
            </h3>

            <div className="flex flex-wrap gap-2">
              {CONFIG_CATEGORIES.map(cat => (
                <Button key={cat.key} variant={selectedCategory === cat.key ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.key)}>
                  {cat.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Label htmlFor="cfg-label" className="sr-only">Libellé</Label>
              <Input id="cfg-label" value={newConfigLabel} onChange={e => { setNewConfigLabel(e.target.value); if (!newConfigValue) setNewConfigValue(e.target.value); }} placeholder="Libellé (ex: Sarcome)" className="flex-1" />
              <Label htmlFor="cfg-value" className="sr-only">Valeur technique</Label>
              <Input id="cfg-value" value={newConfigValue} onChange={e => setNewConfigValue(e.target.value)} placeholder="Valeur technique" className="w-40 hidden md:block" />
              <Button onClick={addConfigItem} size="sm" className="gap-1"><Plus size={14} aria-hidden="true" /> Ajouter</Button>
            </div>

            <ul className="space-y-1 max-h-80 overflow-y-auto" aria-label="Éléments de la catégorie">
              {categoryItems.map(item => (
                <li key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50">
                  {editingConfigId === item.id ? (
                    <>
                      <Label htmlFor={`edit-${item.id}`} className="sr-only">Modifier le libellé</Label>
                      <Input id={`edit-${item.id}`} value={editLabel} onChange={e => setEditLabel(e.target.value)} className="flex-1 h-8" autoFocus />
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => updateConfigItem(item.id)} aria-label={`Enregistrer ${item.label}`}><Save size={14} aria-hidden="true" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingConfigId(null)} aria-label="Annuler la modification"><XCircle size={14} aria-hidden="true" /></Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">{item.value}</Badge>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditingConfigId(item.id); setEditLabel(item.label); }} aria-label={`Modifier ${item.label}`}><Edit2 size={12} aria-hidden="true" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" aria-label={`Supprimer ${item.label}`}><Trash2 size={12} aria-hidden="true" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
                            <AlertDialogDescription>« {item.label} » ne sera plus proposé dans les listes déroulantes.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteConfigItem(item.id)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </li>
              ))}
              {categoryItems.length === 0 && <li><p className="text-muted-foreground text-sm text-center py-4">Aucun élément dans cette catégorie</p></li>}
            </ul>
          </TabsContent>

          {/* ========== CUSTOM FIELDS TAB ========== */}
          <TabsContent value="fields" className="stat-card space-y-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Plus size={18} className="text-primary" /> Champs personnalisés du formulaire
            </h3>
            <p className="text-xs text-muted-foreground">Ajoutez des champs supplémentaires au formulaire de saisie. Ils apparaîtront dans l'onglet choisi.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <Label htmlFor="cf-name" required>Nom technique</Label>
                <Input id="cf-name" value={newField.field_name} onChange={e => setNewField(p => ({ ...p, field_name: e.target.value.replace(/\s/g, '_').toLowerCase() }))} placeholder="groupe_sanguin" className="mt-1 font-mono text-sm" autoCapitalize="none" spellCheck={false} aria-required="true" aria-describedby="cf-name-hint" />
                <span id="cf-name-hint" className="sr-only">Identifiant interne, sans espaces, en minuscules</span>
              </div>
              <div>
                <Label htmlFor="cf-label" required>Libellé affiché</Label>
                <Input id="cf-label" value={newField.field_label} onChange={e => setNewField(p => ({ ...p, field_label: e.target.value }))} placeholder="Groupe sanguin" className="mt-1" aria-required="true" />
              </div>
              <div>
                <Label htmlFor="cf-type">Type</Label>
                <Select value={newField.field_type} onValueChange={v => setNewField(p => ({ ...p, field_type: v }))}>
                  <SelectTrigger id="cf-type" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="textarea">Zone de texte</SelectItem>
                    <SelectItem value="select">Liste déroulante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cf-tab">Onglet</Label>
                <Select value={newField.tab_id} onValueChange={v => setNewField(p => ({ ...p, tab_id: v }))}>
                  <SelectTrigger id="cf-tab" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TAB_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addCustomField} className="gap-1 w-full"><Plus size={14} aria-hidden="true" /> Ajouter</Button>
              </div>
            </div>

            <ul className="space-y-2" aria-label="Champs personnalisés">
              {customFields.map(f => (
                <li key={f.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{f.field_label}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{f.field_name} · {f.field_type} · {TAB_OPTIONS.find(t => t.value === f.tab_id)?.label || f.tab_id}</p>
                  </div>
                  <Button
                    type="button"
                    variant={f.is_active ? 'default' : 'secondary'}
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => toggleCustomField(f.id, f.is_active)}
                    aria-pressed={f.is_active}
                    aria-label={`${f.field_label} : ${f.is_active ? 'actif, cliquer pour désactiver' : 'inactif, cliquer pour activer'}`}
                  >
                    {f.is_active
                      ? <><CheckCircle2 size={12} aria-hidden="true" /> Actif</>
                      : <><Circle size={12} aria-hidden="true" /> Inactif</>}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" aria-label={`Supprimer le champ ${f.field_label}`}>
                        <Trash2 size={12} aria-hidden="true" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce champ ?</AlertDialogTitle>
                        <AlertDialogDescription>Le champ « {f.field_label} » sera retiré du formulaire de saisie. Action irréversible.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteCustomField(f.id)}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
              {customFields.length === 0 && <li><p className="text-muted-foreground text-sm text-center py-4">Aucun champ personnalisé</p></li>}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
