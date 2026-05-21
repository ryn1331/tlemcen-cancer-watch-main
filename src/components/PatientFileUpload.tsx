import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Upload, FileText, Image as ImageIcon, X, Eye, Trash2, Loader2,
  FolderOpen, Download, FileSpreadsheet, FileCheck, Search,
  Activity, Brain, ScanLine, Pill, ClipboardList, Microscope,
  Camera, FileSignature, Building2, Filter,
} from 'lucide-react';

interface PatientFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string | null;
  notes: string | null;
  created_at: string;
}

type CategoryDef = { label: string; icon: React.ElementType; color: string; chip: string };

const FILE_CATEGORIES: Record<string, CategoryDef> = {
  compte_rendu: { label: 'Compte-rendu', icon: ClipboardList, color: 'text-sky-600 bg-sky-50 border-sky-200', chip: 'bg-sky-100 text-sky-700' },
  scanner: { label: 'Scanner / TDM', icon: ScanLine, color: 'text-violet-600 bg-violet-50 border-violet-200', chip: 'bg-violet-100 text-violet-700' },
  irm: { label: 'IRM', icon: Brain, color: 'text-purple-600 bg-purple-50 border-purple-200', chip: 'bg-purple-100 text-purple-700' },
  radiographie: { label: 'Radiographie', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200', chip: 'bg-blue-100 text-blue-700' },
  biologie: { label: 'Analyse biologique', icon: FileSpreadsheet, color: 'text-orange-600 bg-orange-50 border-orange-200', chip: 'bg-orange-100 text-orange-700' },
  anapath: { label: 'Anatomopathologie', icon: Microscope, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', chip: 'bg-emerald-100 text-emerald-700' },
  ordonnance: { label: 'Ordonnance', icon: Pill, color: 'text-pink-600 bg-pink-50 border-pink-200', chip: 'bg-pink-100 text-pink-700' },
  administratif: { label: 'Administratif', icon: Building2, color: 'text-slate-600 bg-slate-50 border-slate-200', chip: 'bg-slate-100 text-slate-700' },
  consentement: { label: 'Consentement', icon: FileSignature, color: 'text-rose-600 bg-rose-50 border-rose-200', chip: 'bg-rose-100 text-rose-700' },
  image: { label: 'Image médicale', icon: ImageIcon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', chip: 'bg-indigo-100 text-indigo-700' },
  photo: { label: 'Photo clinique', icon: Camera, color: 'text-teal-600 bg-teal-50 border-teal-200', chip: 'bg-teal-100 text-teal-700' },
  autre: { label: 'Autre', icon: FileText, color: 'text-muted-foreground bg-muted border-border', chip: 'bg-muted text-muted-foreground' },
};

function classifyFile(name: string, mime: string): string {
  const lower = name.toLowerCase();
  if (/anapath|patho|histo|cyto|morpho/i.test(lower)) return 'anapath';
  if (/irm|mri/i.test(lower)) return 'irm';
  if (/scanner|scan|tdm|pet|ct[\s_-]/i.test(lower)) return 'scanner';
  if (/radio|rx|xray/i.test(lower)) return 'radiographie';
  if (/echo|us[\s_-]/i.test(lower)) return 'radiographie';
  if (/biops|slide|lame/i.test(lower)) return 'anapath';
  if (/bilan|sang|biolog|fns|nfs|hemato|labo/i.test(lower)) return 'biologie';
  if (/ordonnance|prescript/i.test(lower)) return 'ordonnance';
  if (/consent/i.test(lower)) return 'consentement';
  if (/admin|facture|carte|securite|cnas/i.test(lower)) return 'administratif';
  if (/cr[\s_-]|compte|rapport|report/i.test(lower)) return 'compte_rendu';
  if (/photo|clinique/i.test(lower)) return 'photo';
  if (/dicom|dcm/i.test(lower)) return 'scanner';
  if (mime.startsWith('image/')) return 'image';
  if (mime === 'application/pdf') return 'compte_rendu';
  return 'autre';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  patientId: string;
  caseId?: string;
  compact?: boolean;
}

export default function PatientFileUpload({ patientId, caseId, compact }: Props) {
  const { user, role } = useAuth();
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; status: 'pending' | 'success' | 'error' }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = role === 'medecin' || role === 'admin' || role === 'assistante' || role === 'anapath';
  const canDelete = role === 'admin';

  useEffect(() => { fetchFiles(); }, [patientId]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data } = await supabase.from('patient_files').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
    setFiles((data as PatientFile[]) || []);
    setLoading(false);
  };

  const uploadFiles = async (fileList: FileList | File[]) => {
    if (!user) return;
    if (!selectedType) {
      toast.error('Sélectionnez d\'abord un type de document');
      return;
    }
    setUploading(true);
    const arr = Array.from(fileList);
    setUploadProgress(arr.map(f => ({ name: f.name, status: 'pending' })));
    let successCount = 0;

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 20 MB`);
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        continue;
      }

      const fileType = selectedType;
      const storagePath = `${patientId}/${fileType}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage.from('patient-files').upload(storagePath, file);
      if (uploadErr) {
        toast.error(`Erreur upload ${file.name}`);
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        continue;
      }

      const { error: dbErr } = await supabase.from('patient_files').insert({
        patient_id: patientId, case_id: caseId || null,
        file_name: file.name, file_path: storagePath, file_type: fileType,
        file_size: file.size, mime_type: file.type, uploaded_by: user.id,
      });

      if (dbErr) {
        toast.error(`Erreur enregistrement ${file.name}`);
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
      } else {
        successCount++;
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'success' } : p));
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} fichier(s) uploadé(s) en « ${FILE_CATEGORIES[selectedType]?.label} »`);
      fetchFiles();
    }
    setUploading(false);
    setTimeout(() => setUploadProgress([]), 2500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!selectedType) {
      toast.error('Sélectionnez d\'abord un type de document');
      return;
    }
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }, [patientId, caseId, user, selectedType]);

  const handlePreview = async (file: PatientFile) => {
    const { data } = await supabase.storage.from('patient-files').createSignedUrl(file.file_path, 300);
    if (data?.signedUrl) {
      if (file.mime_type?.startsWith('image/') || file.mime_type === 'application/pdf') {
        setPreviewUrl(data.signedUrl); setPreviewName(file.file_name);
      } else window.open(data.signedUrl, '_blank');
    }
  };

  const handleDownload = async (file: PatientFile) => {
    const { data } = await supabase.storage.from('patient-files').createSignedUrl(file.file_path, 60);
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl; a.download = file.file_name; a.click();
    }
  };

  const handleDelete = async (file: PatientFile) => {
    if (!confirm(`Supprimer ${file.file_name} ?`)) return;
    await supabase.storage.from('patient-files').remove([file.file_path]);
    await supabase.from('patient_files').delete().eq('id', file.id);
    toast.success('Fichier supprimé');
    fetchFiles();
  };

  const filtered = useMemo(() => files.filter(f => {
    if (filter !== 'all' && f.file_type !== filter) return false;
    if (search && !f.file_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [files, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    files.forEach(f => { c[f.file_type] = (c[f.file_type] || 0) + 1; });
    return c;
  }, [files]);

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <FolderOpen size={16} className="text-primary" />
            Fichiers ({files.length})
          </h3>
          {canUpload && (
            <>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => e.target.files && uploadFiles(e.target.files)} />
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span className="ml-1.5">Upload</span>
              </Button>
            </>
          )}
        </div>
        {files.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aucun fichier</p>
        ) : (
          <div className="space-y-1">
            {files.slice(0, 5).map(f => {
              const cat = FILE_CATEGORIES[f.file_type] || FILE_CATEGORIES.autre;
              return (
                <div key={f.id} className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => handlePreview(f)}>
                  <cat.icon size={14} className={cat.color.split(' ')[0]} />
                  <span className="flex-1 truncate">{f.file_name}</span>
                  <span className="text-muted-foreground">{formatSize(f.file_size)}</span>
                </div>
              );
            })}
            {files.length > 5 && <p className="text-[10px] text-muted-foreground text-center">+{files.length - 5} autres</p>}
          </div>
        )}
      </div>
    );
  }

  const totalSize = files.reduce((s, f) => s + f.file_size, 0);

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-3">
          <div className="flex items-center gap-2 text-primary"><FolderOpen size={15} /><span className="text-[10px] uppercase tracking-wider font-semibold">Total</span></div>
          <p className="text-2xl font-display font-bold mt-1">{files.length}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-transparent p-3">
          <div className="flex items-center gap-2 text-emerald-600"><FileCheck size={15} /><span className="text-[10px] uppercase tracking-wider font-semibold">Volume</span></div>
          <p className="text-2xl font-display font-bold mt-1">{formatSize(totalSize)}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-purple-500/5 to-transparent p-3">
          <div className="flex items-center gap-2 text-purple-600"><Microscope size={15} /><span className="text-[10px] uppercase tracking-wider font-semibold">Anapath</span></div>
          <p className="text-2xl font-display font-bold mt-1">{counts.anapath || 0}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-violet-500/5 to-transparent p-3">
          <div className="flex items-center gap-2 text-violet-600"><ScanLine size={15} /><span className="text-[10px] uppercase tracking-wider font-semibold">Imagerie</span></div>
          <p className="text-2xl font-display font-bold mt-1">{(counts.scanner || 0) + (counts.irm || 0) + (counts.radiographie || 0)}</p>
        </div>
      </div>

      {/* Type selector + Drop zone */}
      {canUpload && (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">1</span>
              Sélectionnez le type de document
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(FILE_CATEGORIES).map(([key, cat]) => {
                const active = selectedType === key;
                return (
                  <button key={key} type="button" onClick={() => setSelectedType(key)}
                    className={cn('px-2.5 py-1.5 text-[11px] rounded-full font-medium transition-all border flex items-center gap-1.5',
                      active ? 'bg-primary text-primary-foreground border-primary shadow-sm' : `${cat.chip} border-transparent hover:border-current`
                    )}>
                    <cat.icon size={12} /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold',
                selectedType ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>2</span>
              Glissez vos fichiers
            </p>
            <div
              onDragOver={e => { e.preventDefault(); if (selectedType) setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all group',
                !selectedType
                  ? 'border-border/40 bg-muted/20 opacity-60 cursor-not-allowed'
                  : dragOver
                    ? 'border-primary bg-primary/5 scale-[1.005] shadow-md cursor-pointer'
                    : 'border-border/60 hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer'
              )}
              onClick={() => selectedType && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.dcm,.dicom,.xls,.xlsx,.doc,.docx"
                onChange={e => e.target.files && uploadFiles(e.target.files)} />
              <div className={cn('w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-all',
                dragOver ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:scale-110'
              )}>
                {uploading ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
              </div>
              <p className="font-display font-semibold text-base">
                {uploading
                  ? 'Upload en cours...'
                  : !selectedType
                    ? 'Choisissez d\'abord un type ci-dessus'
                    : `Déposez vos « ${FILE_CATEGORIES[selectedType]?.label} »`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedType && <>ou <span className="text-primary font-medium underline-offset-2 group-hover:underline">parcourir</span> · </>}
                PDF · Image · DICOM · Max 20 MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploadProgress.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5">
          {uploadProgress.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {p.status === 'pending' && <Loader2 size={13} className="animate-spin text-primary" />}
              {p.status === 'success' && <FileCheck size={13} className="text-emerald-600" />}
              {p.status === 'error' && <X size={13} className="text-destructive" />}
              <span className="flex-1 truncate">{p.name}</span>
              <Badge variant="outline" className={cn('text-[9px]',
                p.status === 'success' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                p.status === 'error' && 'bg-red-50 text-red-700 border-red-200',
              )}>
                {p.status === 'pending' ? 'Envoi…' : p.status === 'success' ? 'Reçu' : 'Échec'}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Search & filters */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un document..." className="pl-9 h-9" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter size={13} /> {filtered.length} / {files.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setFilter('all')}
              className={cn('px-2.5 py-1 text-[11px] rounded-full font-medium transition-all border',
                filter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'
              )}>
              Tous · {files.length}
            </button>
            {Object.entries(counts).map(([type, count]) => {
              const cat = FILE_CATEGORIES[type] || FILE_CATEGORIES.autre;
              const active = filter === type;
              return (
                <button key={type} type="button" onClick={() => setFilter(type)}
                  className={cn('px-2.5 py-1 text-[11px] rounded-full font-medium transition-all border flex items-center gap-1.5',
                    active ? 'bg-primary text-primary-foreground border-primary' : `${cat.chip} border-transparent hover:border-current`
                  )}>
                  <cat.icon size={11} /> {cat.label} · {count}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* File grid */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border/40 rounded-2xl">
          <FolderOpen size={44} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucun document</p>
          <p className="text-xs mt-1">Glissez vos premiers fichiers ci-dessus</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">Aucun résultat pour ces critères</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(f => {
            const cat = FILE_CATEGORIES[f.file_type] || FILE_CATEGORIES.autre;
            const isImage = f.mime_type?.startsWith('image/');
            return (
              <div key={f.id} className={cn(
                'group relative rounded-xl border bg-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5',
                cat.color.includes('border-') ? cat.color.split(' ').filter(c => c.startsWith('border-')).join(' ') : 'border-border/60'
              )}>
                {/* Preview area */}
                <div className="relative h-28 bg-muted/40 cursor-pointer overflow-hidden" onClick={() => handlePreview(f)}>
                  {isImage ? (
                    <FilePreviewThumb file={f} />
                  ) : (
                    <div className={cn('w-full h-full flex items-center justify-center', cat.color)}>
                      <cat.icon size={36} strokeWidth={1.4} />
                    </div>
                  )}
                  <Badge className={cn('absolute top-2 left-2 text-[9px] uppercase tracking-wider font-bold border-0', cat.chip)}>
                    {cat.label}
                  </Badge>
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <p className="text-xs font-semibold truncate" title={f.file_name}>{f.file_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatSize(f.file_size)} · {new Date(f.created_at).toLocaleDateString('fr-DZ')}
                  </p>
                </div>
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm" onClick={() => handlePreview(f)} title="Prévisualiser">
                    <Eye size={12} />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm" onClick={() => handleDownload(f)} title="Télécharger">
                    <Download size={12} />
                  </Button>
                  {canDelete && (
                    <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm text-destructive" onClick={() => handleDelete(f)} title="Supprimer">
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={open => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye size={18} className="text-primary" />
              {previewName}
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            previewUrl.includes('.pdf') || previewName.endsWith('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-[70vh] rounded-lg" />
            ) : (
              <img src={previewUrl} alt={previewName} className="w-full max-h-[70vh] object-contain rounded-lg" />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilePreviewThumb({ file }: { file: PatientFile }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from('patient-files').createSignedUrl(file.file_path, 300).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [file.file_path]);
  if (!url) return <div className="w-full h-full bg-muted animate-pulse" />;
  return <img src={url} alt="" className="w-full h-full object-cover" />;
}
