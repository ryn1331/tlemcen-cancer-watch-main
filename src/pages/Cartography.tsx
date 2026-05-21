import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Loader2, Filter, BarChart3, Download, Save, Plus, Trash2,
  Layers, MapPin, X, SlidersHorizontal, Globe, Activity, Users,
  TrendingUp, FolderOpen, Combine, GitMerge, Search, Check,
  ChevronRight, Eye, Copy, Beaker, Lightbulb, Flame, AlertTriangle, ArrowUpRight,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ALGERIA_WILAYAS, TLEMCEN_COMMUNES, COLOR_SCALES, getColorForValue } from '@/lib/algeria-wilayas';

/* ─── Types ─── */
interface RawCase {
  id: string; type_cancer: string; date_diagnostic: string; statut: string;
  stade_tnm: string | null; resultat_anapath: string | null; code_icdo: string | null;
  milieu: string | null; methode_diagnostic: string | null; sous_type_cancer: string | null;
  topographie_icdo: string | null; morphologie_icdo: string | null;
  tabagisme: string | null; alcool: string | null; statut_vital: string | null;
  patients: { sexe: string | null; date_naissance: string | null; commune: string | null; wilaya: string | null } | null;
}

interface SavedMap {
  id: string; name: string; description: string | null;
  config: any; created_at: string; updated_at: string;
}

interface ZoneGroup {
  id: string; name: string; description: string | null;
  color: string; created_at: string;
  items?: { zone_code: string; zone_name: string }[];
}

interface MapFilters {
  sexe: string; ageMin: string; ageMax: string; yearStart: string; yearEnd: string;
  typeCancer: string; stade: string; milieu: string; statut_vital: string;
  wilaya: string; tabagisme: string; alcool: string;
}

const DEFAULT_FILTERS: MapFilters = {
  sexe: 'Tous', ageMin: '', ageMax: '', yearStart: '', yearEnd: '',
  typeCancer: 'Tous', stade: 'Tous', milieu: 'Tous', statut_vital: 'Tous',
  wilaya: 'Tous', tabagisme: 'Tous', alcool: 'Tous',
};

type VizMode = 'choropleth' | 'points' | 'heatmap' | 'circles';

type AppMode = 'explore' | 'zone-create' | 'map-compare';

/* ─── Main Component ─── */
export default function Cartography() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allCases, setAllCases] = useState<RawCase[]>([]);
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [vizMode, setVizMode] = useState<VizMode>('choropleth');
  const [showFilters, setShowFilters] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<'map' | 'filters' | 'stats'>('map');
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [zoneGroups, setZoneGroups] = useState<ZoneGroup[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [mapName, setMapName] = useState('');
  const [mapDesc, setMapDesc] = useState('');
  const [colorScale, setColorScale] = useState<string>('cancer');
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [sideTab, setSideTab] = useState('filters');

  // Zone creation state
  const [appMode, setAppMode] = useState<AppMode>('explore');
  const [zoneName, setZoneName] = useState('');
  const [zoneDesc, setZoneDesc] = useState('');
  const [zoneColor, setZoneColor] = useState('#3b82f6');
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>([]);

  // Map comparison / union state
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedMapsForOp, setSelectedMapsForOp] = useState<string[]>([]);
  const [mapOperation, setMapOperation] = useState<'union' | 'intersection' | 'difference'>('union');
  const [comparisonResult, setComparisonResult] = useState<{ name: string; caseIds: Set<string> } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Load data
  useEffect(() => {
    Promise.all([
      supabase.from('cancer_cases').select('id, type_cancer, date_diagnostic, statut, stade_tnm, resultat_anapath, code_icdo, milieu, methode_diagnostic, sous_type_cancer, topographie_icdo, morphologie_icdo, tabagisme, alcool, statut_vital, patients(sexe, date_naissance, commune, wilaya)'),
      (supabase.from('geo_saved_maps') as any).select('*').order('updated_at', { ascending: false }),
      (supabase.from('geo_zone_groups') as any).select('*, geo_zone_group_items(zone_code, zone_name)').order('created_at', { ascending: false }),
    ]).then(([cRes, mRes, zRes]) => {
      setAllCases((cRes.data as RawCase[]) || []);
      setSavedMaps((mRes.data as SavedMap[]) || []);
      const groups = (zRes.data || []).map((z: any) => ({
        ...z,
        items: z.geo_zone_group_items || [],
      }));
      setZoneGroups(groups);
      setLoading(false);
    });
  }, []);

  // Apply filters to get filtered cases
  const applyFilters = useCallback((cases: RawCase[], f: MapFilters) => {
    const now = new Date();
    return cases.filter(c => {
      if (f.sexe !== 'Tous') {
        const s = f.sexe === 'Homme' ? 'M' : 'F';
        if (c.patients?.sexe !== s) return false;
      }
      if (f.ageMin && c.patients?.date_naissance) {
        const age = now.getFullYear() - new Date(c.patients.date_naissance).getFullYear();
        if (age < parseInt(f.ageMin)) return false;
      }
      if (f.ageMax && c.patients?.date_naissance) {
        const age = now.getFullYear() - new Date(c.patients.date_naissance).getFullYear();
        if (age > parseInt(f.ageMax)) return false;
      }
      if (f.yearStart) {
        const year = new Date(c.date_diagnostic).getFullYear();
        if (year < parseInt(f.yearStart)) return false;
      }
      if (f.yearEnd) {
        const year = new Date(c.date_diagnostic).getFullYear();
        if (year > parseInt(f.yearEnd)) return false;
      }
      if (f.typeCancer !== 'Tous' && c.type_cancer !== f.typeCancer) return false;
      if (f.stade !== 'Tous' && c.stade_tnm !== f.stade) return false;
      if (f.milieu !== 'Tous' && c.milieu !== f.milieu) return false;
      if (f.statut_vital !== 'Tous' && c.statut_vital !== f.statut_vital) return false;
      if (f.wilaya !== 'Tous' && c.patients?.wilaya !== f.wilaya) return false;
      if (f.tabagisme !== 'Tous' && c.tabagisme !== f.tabagisme) return false;
      if (f.alcool !== 'Tous' && c.alcool !== f.alcool) return false;
      return true;
    });
  }, []);

  const filtered = useMemo(() => {
    if (comparisonResult) {
      return allCases.filter(c => comparisonResult.caseIds.has(c.id));
    }
    return applyFilters(allCases, filters);
  }, [allCases, filters, applyFilters, comparisonResult]);

  // Aggregate by wilaya
  const wilayaStats = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(c => {
      const w = c.patients?.wilaya || 'Inconnu';
      map.set(w, (map.get(w) || 0) + 1);
    });
    return map;
  }, [filtered]);

  const communeStats = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(c => {
      if (c.patients?.commune) map.set(c.patients.commune, (map.get(c.patients.commune) || 0) + 1);
    });
    return map;
  }, [filtered]);

  const maxCases = useMemo(() => Math.max(1, ...Array.from(wilayaStats.values())), [wilayaStats]);

  const cancerTypes = useMemo(() => {
    const set = new Set(allCases.map(c => c.type_cancer));
    return ['Tous', ...Array.from(set).sort()];
  }, [allCases]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const male = filtered.filter(c => c.patients?.sexe === 'M').length;
    const female = filtered.filter(c => c.patients?.sexe === 'F').length;
    const deceased = filtered.filter(c => c.statut_vital === 'decede').length;
    const typeCounts = new Map<string, number>();
    filtered.forEach(c => typeCounts.set(c.type_cancer, (typeCounts.get(c.type_cancer) || 0) + 1));
    const topCancers = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const yearCounts = new Map<number, number>();
    filtered.forEach(c => {
      const y = new Date(c.date_diagnostic).getFullYear();
      yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
    });
    const yearTrend = Array.from(yearCounts.entries()).sort((a, b) => a[0] - b[0]);
    return { total, male, female, deceased, topCancers, yearTrend };
  }, [filtered]);

  // ─── Top wilayas table with crude rate per 100k ───
  const wilayaTable = useMemo(() => {
    const totalPop = ALGERIA_WILAYAS.reduce((s, w) => s + w.population2023, 0);
    const totalCases = filtered.length;
    const nationalRate = totalCases > 0 ? (totalCases / totalPop) * 100000 : 0;
    return ALGERIA_WILAYAS.map(w => {
      const count = wilayaStats.get(w.name) || 0;
      const rate = (count / w.population2023) * 100000;
      const ratio = nationalRate > 0 ? rate / nationalRate : 0;
      return { ...w, count, rate, ratio };
    }).sort((a, b) => b.rate - a.rate);
  }, [wilayaStats, filtered.length]);

  // ─── Auto-generated epidemiological hypotheses ───
  const insights = useMemo(() => {
    const out: { type: 'hotspot' | 'sex' | 'age' | 'trend' | 'milieu' | 'rare'; title: string; detail: string; severity: 'high' | 'medium' | 'low' }[] = [];
    if (filtered.length < 10) return out;

    // Hotspots: wilayas with rate > 1.8x national average
    const top = wilayaTable.filter(w => w.count >= 3 && w.ratio >= 1.8).slice(0, 3);
    top.forEach(w => {
      out.push({
        type: 'hotspot',
        severity: w.ratio >= 3 ? 'high' : 'medium',
        title: `Cluster détecté — ${w.name}`,
        detail: `Taux ${w.rate.toFixed(1)}/100k (×${w.ratio.toFixed(1)} vs national). ${w.count} cas observés. Hypothèse : exposition environnementale ou biais de captation à investiguer.`,
      });
    });

    // Sex ratio anomaly
    const total = stats.male + stats.female;
    if (total > 20) {
      const ratioM = stats.male / total;
      if (ratioM > 0.7) out.push({ type: 'sex', severity: 'medium', title: 'Surreprésentation masculine', detail: `${(ratioM * 100).toFixed(0)}% d'hommes. Hypothèse : exposition professionnelle ou tabagisme à étudier.` });
      else if (ratioM < 0.3) out.push({ type: 'sex', severity: 'medium', title: 'Surreprésentation féminine', detail: `${((1 - ratioM) * 100).toFixed(0)}% de femmes. Hypothèse : facteurs hormonaux/dépistage organisé à examiner.` });
    }

    // Trend
    if (stats.yearTrend.length >= 3) {
      const first = stats.yearTrend[0][1];
      const last = stats.yearTrend[stats.yearTrend.length - 1][1];
      const change = first > 0 ? ((last - first) / first) * 100 : 0;
      if (Math.abs(change) >= 30) {
        out.push({
          type: 'trend',
          severity: Math.abs(change) >= 60 ? 'high' : 'medium',
          title: change > 0 ? `Tendance à la hausse (+${change.toFixed(0)}%)` : `Tendance à la baisse (${change.toFixed(0)}%)`,
          detail: `Entre ${stats.yearTrend[0][0]} et ${stats.yearTrend[stats.yearTrend.length - 1][0]}. Hypothèse : amélioration du diagnostic, changement d'exposition, ou variation démographique.`,
        });
      }
    }

    // Milieu skew
    const urban = filtered.filter(c => c.milieu === 'urbain').length;
    const rural = filtered.filter(c => c.milieu === 'rural').length;
    if (urban + rural > 20) {
      const ru = rural / (urban + rural);
      if (ru >= 0.6) out.push({ type: 'milieu', severity: 'medium', title: 'Excès rural', detail: `${(ru * 100).toFixed(0)}% des cas en milieu rural. Hypothèse : pesticides, eau, accès tardif au soin.` });
      else if (ru <= 0.15 && urban + rural >= 30) out.push({ type: 'milieu', severity: 'low', title: 'Concentration urbaine', detail: `${((1 - ru) * 100).toFixed(0)}% urbains. Hypothèse : pollution, mode de vie, biais d'accès.` });
    }

    // Rare cancer concentration
    if (stats.topCancers.length >= 1) {
      const [topType, topCount] = stats.topCancers[0];
      const share = topCount / filtered.length;
      if (share >= 0.4 && filtered.length >= 30) {
        out.push({ type: 'rare', severity: 'high', title: `Concentration sur "${topType}"`, detail: `${(share * 100).toFixed(0)}% des cas filtrés. Hypothèse : cluster diagnostique ou facteur de risque commun à explorer.` });
      }
    }

    return out;
  }, [filtered, wilayaTable, stats]);

  // Initialize map
  useEffect(() => {
    if (loading || !mapRef.current) return;
    // Clean up previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    const container = mapRef.current;
    const map = L.map(container, {
      center: [28.0, 2.5], zoom: 5, zoomControl: false, attributionControl: false,
      maxBounds: [[15, -10], [38, 14]], minZoom: 4,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    map.fitBounds([[19, -8.7], [37.1, 12]], { padding: [10, 10] });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;
    // Force size recalculation after layout settles
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 500);
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);
    return () => { resizeObserver.disconnect(); map.remove(); mapInstanceRef.current = null; };
  }, [loading]);

  // Update map markers
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    const scale = COLOR_SCALES[colorScale as keyof typeof COLOR_SCALES] || COLOR_SCALES.cancer;

    if (vizMode === 'choropleth' || vizMode === 'circles') {
      ALGERIA_WILAYAS.forEach(w => {
        const count = wilayaStats.get(w.name) || 0;
        const isSelected = selectedWilaya === w.code;
        const isInZoneSelection = appMode === 'zone-create' && selectedWilayas.includes(w.code);

        if (vizMode === 'choropleth') {
          const hasData = count > 0;
          const color = hasData ? getColorForValue(count, maxCases, scale) : '#e9eef5';
          const circle = L.circleMarker([w.lat, w.lng], {
            radius: hasData ? 9 : 5,
            fillColor: isInZoneSelection ? '#f59e0b' : color,
            color: isSelected ? '#ef4444' : (isInZoneSelection ? '#d97706' : (hasData ? '#475569' : '#cbd5e1')),
            weight: isSelected ? 2.5 : (isInZoneSelection ? 2 : 0.8),
            opacity: 0.9, fillOpacity: hasData ? 0.85 : 0.4,
          });
          circle.bindTooltip(
            `<div class="text-xs font-semibold">${w.name}</div>
             <div class="text-[10px]">${count} cas</div>
             <div class="text-[10px]">Pop: ${(w.population2023 / 1000).toFixed(0)}k</div>
             ${count > 0 ? `<div class="text-[10px]">Taux: ${((count / w.population2023) * 100000).toFixed(1)}/100k</div>` : ''}
             ${isInZoneSelection ? '<div class="text-[10px] font-bold text-amber-600">✓ Sélectionnée</div>' : ''}`,
            { direction: 'top', className: 'leaflet-tooltip-custom' }
          );
          circle.on('click', () => {
            if (appMode === 'zone-create') {
              setSelectedWilayas(prev =>
                prev.includes(w.code) ? prev.filter(c => c !== w.code) : [...prev, w.code]
              );
            } else {
              setSelectedWilaya(prev => prev === w.code ? null : w.code);
            }
          });
          circle.addTo(layer);
          if (count > 0) {
            const label = L.divIcon({
              className: 'wilaya-label',
              html: `<span style="font-size:9px;font-weight:600;color:#333;text-shadow:1px 1px 2px white">${w.code}</span>`,
              iconSize: [20, 12], iconAnchor: [10, 6],
            });
            L.marker([w.lat, w.lng], { icon: label, interactive: false }).addTo(layer);
          }
        } else {
          if (count === 0) return;
          const radius = Math.max(5, Math.sqrt(count / maxCases) * 40);
          const circle = L.circleMarker([w.lat, w.lng], {
            radius, fillColor: scale[Math.floor(scale.length * 0.6)],
            color: '#fff', weight: 2, opacity: 0.9, fillOpacity: 0.6,
          });
          circle.bindTooltip(`<strong>${w.name}</strong><br/>${count} cas`);
          circle.addTo(layer);
        }
      });

      // Show Tlemcen communes drill-down
      if (selectedWilaya === '13' || filters.wilaya === 'Tlemcen') {
        TLEMCEN_COMMUNES.forEach(c => {
          const count = communeStats.get(c.name) || 0;
          if (count === 0 && vizMode !== 'choropleth') return;
          const communeMax = Math.max(1, ...Array.from(communeStats.values()));
          const color = count > 0 ? getColorForValue(count, communeMax, scale) : '#e8e8e8';
          const marker = L.circleMarker([c.lat, c.lng], {
            radius: 10, fillColor: color, color: '#999', weight: 1, fillOpacity: 0.8,
          });
          marker.bindTooltip(`<strong>${c.name}</strong><br/>${count} cas`);
          marker.addTo(layer);
        });
      }

      // Highlight zone groups on map
      zoneGroups.forEach(zg => {
        (zg.items || []).forEach(item => {
          const w = ALGERIA_WILAYAS.find(w => w.code === item.zone_code);
          if (!w) return;
          L.circleMarker([w.lat, w.lng], {
            radius: 22, fillColor: 'transparent', color: zg.color,
            weight: 2, opacity: 0.6, fillOpacity: 0, dashArray: '4 4',
          }).bindTooltip(`Zone: ${zg.name}`).addTo(layer);
        });
      });

    } else if (vizMode === 'points') {
      filtered.forEach(c => {
        const commune = c.patients?.commune;
        const coords = TLEMCEN_COMMUNES.find(tc => tc.name === commune);
        if (!coords) return;
        const offset = () => (Math.random() - 0.5) * 0.02;
        L.circleMarker([coords.lat + offset(), coords.lng + offset()], {
          radius: 4, fillColor: c.patients?.sexe === 'M' ? '#3b82f6' : '#ec4899',
          color: '#fff', weight: 1, fillOpacity: 0.7,
        }).bindTooltip(`${c.type_cancer}<br/>${commune}`).addTo(layer);
      });
    } else if (vizMode === 'heatmap') {
      ALGERIA_WILAYAS.forEach(w => {
        const count = wilayaStats.get(w.name) || 0;
        if (count === 0) return;
        const intensity = count / maxCases;
        L.circle([w.lat, w.lng], {
          radius: 30000 + intensity * 80000,
          fillColor: `hsl(${(1 - intensity) * 60}, 90%, 50%)`,
          color: 'transparent', fillOpacity: 0.35,
        }).addTo(layer);
      });
    }
  }, [filtered, wilayaStats, communeStats, vizMode, maxCases, colorScale, selectedWilaya, selectedWilayas, appMode, zoneGroups, filters.wilaya]);

  // Zoom
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (selectedWilaya === '13' || filters.wilaya === 'Tlemcen') {
      map.setView([34.88, -1.32], 10, { animate: true });
    } else if (selectedWilaya) {
      const w = ALGERIA_WILAYAS.find(w => w.code === selectedWilaya);
      if (w) map.setView([w.lat, w.lng], 8, { animate: true });
    }
  }, [selectedWilaya, filters.wilaya]);

  // Save map
  const handleSaveMap = async () => {
    if (!user || !mapName.trim()) return;
    const config = { filters, vizMode, colorScale, selectedWilaya };
    const { error } = await (supabase.from('geo_saved_maps') as any).insert({
      user_id: user.id, name: mapName, description: mapDesc || null, config,
    });
    if (error) { toast.error('Erreur de sauvegarde'); return; }
    toast.success('Carte sauvegardée');
    setSaveDialogOpen(false); setMapName(''); setMapDesc('');
    refreshSavedMaps();
  };

  const refreshSavedMaps = async () => {
    const { data } = await (supabase.from('geo_saved_maps') as any).select('*').order('updated_at', { ascending: false });
    setSavedMaps((data as SavedMap[]) || []);
  };

  const refreshZoneGroups = async () => {
    const { data } = await (supabase.from('geo_zone_groups') as any).select('*, geo_zone_group_items(zone_code, zone_name)').order('created_at', { ascending: false });
    const groups = (data || []).map((z: any) => ({ ...z, items: z.geo_zone_group_items || [] }));
    setZoneGroups(groups);
  };

  const loadSavedMap = (map: SavedMap) => {
    setComparisonResult(null);
    const c = map.config;
    if (c.filters) setFilters(c.filters);
    if (c.vizMode) setVizMode(c.vizMode);
    if (c.colorScale) setColorScale(c.colorScale);
    if (c.selectedWilaya) setSelectedWilaya(c.selectedWilaya);
    toast.success(`Carte "${map.name}" chargée`);
  };

  const duplicateSavedMap = async (map: SavedMap) => {
    if (!user) return;
    const { error } = await (supabase.from('geo_saved_maps') as any).insert({
      user_id: user.id, name: `${map.name} (copie)`, description: map.description, config: map.config,
    });
    if (!error) { toast.success('Carte dupliquée'); refreshSavedMaps(); }
  };

  const deleteSavedMap = async (id: string) => {
    await (supabase.from('geo_saved_maps') as any).delete().eq('id', id);
    setSavedMaps(prev => prev.filter(m => m.id !== id));
    toast.success('Carte supprimée');
  };

  // Zone creation
  const startZoneCreation = () => {
    setAppMode('zone-create');
    setSelectedWilayas([]);
    setZoneName(''); setZoneDesc(''); setZoneColor('#3b82f6');
    setSideTab('zones');
    setMobilePanel('map');
  };

  const cancelZoneCreation = () => {
    setAppMode('explore');
    setSelectedWilayas([]);
  };

  const handleSaveZoneGroup = async () => {
    if (!user || !zoneName.trim() || selectedWilayas.length === 0) return;
    const { data: group, error } = await (supabase.from('geo_zone_groups') as any).insert({
      user_id: user.id, name: zoneName, description: zoneDesc || null, color: zoneColor,
    }).select().single();
    if (error || !group) { toast.error('Erreur'); return; }
    const items = selectedWilayas.map(code => {
      const w = ALGERIA_WILAYAS.find(w => w.code === code);
      return { group_id: group.id, zone_type: 'wilaya', zone_code: code, zone_name: w?.name || code };
    });
    await (supabase.from('geo_zone_group_items') as any).insert(items);
    toast.success('Zone personnalisée créée');
    setAppMode('explore'); setSelectedWilayas([]);
    setZoneName(''); setZoneDesc('');
    refreshZoneGroups();
  };

  const deleteZoneGroup = async (id: string) => {
    await (supabase.from('geo_zone_group_items') as any).delete().eq('group_id', id);
    await (supabase.from('geo_zone_groups') as any).delete().eq('id', id);
    setZoneGroups(prev => prev.filter(z => z.id !== id));
    toast.success('Zone supprimée');
  };

  // ─── Map operations (union / intersection / difference) ───
  const getCaseIdsForMap = (map: SavedMap): Set<string> => {
    const f = map.config?.filters || DEFAULT_FILTERS;
    const cases = applyFilters(allCases, f);
    return new Set(cases.map(c => c.id));
  };

  const executeMapOperation = () => {
    if (selectedMapsForOp.length < 2) { toast.error('Sélectionnez au moins 2 cartes'); return; }
    const maps = selectedMapsForOp.map(id => savedMaps.find(m => m.id === id)!).filter(Boolean);
    const sets = maps.map(m => getCaseIdsForMap(m));

    let resultIds: Set<string>;
    const opLabel = mapOperation === 'union' ? 'Union' : mapOperation === 'intersection' ? 'Intersection' : 'Différence';

    if (mapOperation === 'union') {
      resultIds = new Set<string>();
      sets.forEach(s => s.forEach(id => resultIds.add(id)));
    } else if (mapOperation === 'intersection') {
      resultIds = new Set(sets[0]);
      for (let i = 1; i < sets.length; i++) {
        resultIds = new Set([...resultIds].filter(id => sets[i].has(id)));
      }
    } else {
      // difference: cases in first but not in others
      resultIds = new Set(sets[0]);
      for (let i = 1; i < sets.length; i++) {
        sets[i].forEach(id => resultIds.delete(id));
      }
    }

    const mapNames = maps.map(m => m.name).join(` ${mapOperation === 'union' ? '∪' : mapOperation === 'intersection' ? '∩' : '−'} `);
    setComparisonResult({ name: `${opLabel}: ${mapNames}`, caseIds: resultIds });
    setCompareDialogOpen(false);
    setSelectedMapsForOp([]);
    toast.success(`${opLabel} calculée : ${resultIds.size} cas`);
  };

  const clearComparison = () => setComparisonResult(null);

  // Export CSV
  const exportCSV = () => {
    const headers = ['Wilaya', 'Cas', 'Population', 'Taux/100k'];
    const rows = ALGERIA_WILAYAS.map(w => {
      const count = wilayaStats.get(w.name) || 0;
      return [w.name, count, w.population2023, ((count / w.population2023) * 100000).toFixed(2)];
    }).filter(r => (r[1] as number) > 0);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `carte_cancer_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Export CSV généré');
  };

  const activeFilterCount = Object.entries(filters).filter(([, v]) => v !== '' && v !== 'Tous').length;

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold flex items-center gap-2">
              <Globe size={24} className="text-primary hidden sm:block" />
              <Globe size={20} className="text-primary sm:hidden" />
              Cartographie Épidémiologique
            </h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} cas · {ALGERIA_WILAYAS.length} wilayas · Standards IARC/OMS
              {activeFilterCount > 0 && <Badge className="ml-2 bg-primary/10 text-primary text-[10px]">{activeFilterCount} filtre(s)</Badge>}
              {comparisonResult && (
                <Badge className="ml-2 bg-accent text-accent-foreground text-[10px] gap-1">
                  <Beaker size={10} /> {comparisonResult.name}
                  <button onClick={clearComparison}><X size={10} /></button>
                </Badge>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => { setSideTab('maps'); setSaveDialogOpen(true); }}>
              <Save size={14} className="mr-1" /> <span className="hidden sm:inline">Sauvegarder</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCompareDialogOpen(true)}>
              <GitMerge size={14} className="mr-1" /> <span className="hidden sm:inline">Opérations</span>
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download size={14} className="mr-1" /> <span className="hidden sm:inline">CSV</span>
            </Button>
          </div>
        </div>

        {/* Comparison result banner */}
        {comparisonResult && (
          <div className="rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Beaker size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Résultat de l'opération</p>
              <p className="text-sm font-semibold truncate">{comparisonResult.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {comparisonResult.caseIds.size} cas trouvés · affichés sur la carte ci-dessous
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearComparison}>
              <X size={14} className="mr-1" /> Effacer
            </Button>
          </div>
        )}


        {/* Zone creation banner */}
        {appMode === 'zone-create' && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-3">
            <MapPin size={18} className="text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Mode création de zone — Cliquez sur les wilayas pour les sélectionner
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {selectedWilayas.length} wilaya(s) sélectionnée(s)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={cancelZoneCreation}>Annuler</Button>
          </div>
        )}

        {/* ─── Desktop world-class layout ─── */}
        <div className="grid gap-3 xl:[grid-template-columns:280px_minmax(0,1fr)_340px]" style={{ height: 'calc(100vh - 170px)', minHeight: '520px' }}>

          {/* LEFT — Filters / Maps / Zones */}
          <div className="overflow-y-auto pr-1 space-y-3 min-h-0">
            <Tabs value={sideTab} onValueChange={setSideTab}>
              <TabsList className="w-full grid grid-cols-3 h-8">
                <TabsTrigger value="filters" className="text-[11px]">Filtres</TabsTrigger>
                <TabsTrigger value="maps" className="text-[11px]">Cartes</TabsTrigger>
                <TabsTrigger value="zones" className="text-[11px]">Zones</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="mt-2 space-y-3">
                <div className="stat-card !p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                      <Filter size={14} className="text-primary" /> Filtres
                    </h3>
                    {activeFilterCount > 0 && (
                      <button onClick={() => { setFilters(DEFAULT_FILTERS); setComparisonResult(null); }}
                        className="text-[10px] text-muted-foreground hover:text-destructive">Réinitialiser</button>
                    )}
                  </div>
                  <FilterSelect label="Sexe" value={filters.sexe} options={['Tous', 'Homme', 'Femme']}
                    onChange={v => setFilters(f => ({ ...f, sexe: v }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Âge min</Label>
                      <Input type="number" className="h-8 text-xs" value={filters.ageMin}
                        onChange={e => setFilters(f => ({ ...f, ageMin: e.target.value }))} placeholder="0" />
                    </div>
                    <div><Label className="text-xs">Âge max</Label>
                      <Input type="number" className="h-8 text-xs" value={filters.ageMax}
                        onChange={e => setFilters(f => ({ ...f, ageMax: e.target.value }))} placeholder="99" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Année début</Label>
                      <Input type="number" className="h-8 text-xs" value={filters.yearStart}
                        onChange={e => setFilters(f => ({ ...f, yearStart: e.target.value }))} placeholder="2020" />
                    </div>
                    <div><Label className="text-xs">Année fin</Label>
                      <Input type="number" className="h-8 text-xs" value={filters.yearEnd}
                        onChange={e => setFilters(f => ({ ...f, yearEnd: e.target.value }))} placeholder="2026" />
                    </div>
                  </div>
                  <FilterSelect label="Type de cancer" value={filters.typeCancer} options={cancerTypes}
                    onChange={v => setFilters(f => ({ ...f, typeCancer: v }))} />
                  <FilterSelect label="Milieu" value={filters.milieu} options={['Tous', 'urbain', 'rural', 'semi-urbain']}
                    onChange={v => setFilters(f => ({ ...f, milieu: v }))} />
                  <FilterSelect label="Statut vital" value={filters.statut_vital} options={['Tous', 'vivant', 'decede', 'perdu_de_vue']}
                    onChange={v => setFilters(f => ({ ...f, statut_vital: v }))} />
                  <FilterSelect label="Tabagisme" value={filters.tabagisme} options={['Tous', 'oui', 'non', 'ancien']}
                    onChange={v => setFilters(f => ({ ...f, tabagisme: v }))} />
                  <FilterSelect label="Alcool" value={filters.alcool} options={['Tous', 'oui', 'non']}
                    onChange={v => setFilters(f => ({ ...f, alcool: v }))} />
                  <FilterSelect label="Wilaya" value={filters.wilaya}
                    options={['Tous', ...ALGERIA_WILAYAS.map(w => w.name)]}
                    onChange={v => setFilters(f => ({ ...f, wilaya: v }))} />
                </div>

                <div className="stat-card !p-3 space-y-3">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                    <Layers size={14} className="text-primary" /> Visualisation
                  </h3>
                  <div className="space-y-1">
                    {([
                      { id: 'choropleth' as VizMode, label: 'Choroplèthe', icon: '🗺️' },
                      { id: 'circles' as VizMode, label: 'Cercles proportionnels', icon: '⭕' },
                      { id: 'points' as VizMode, label: 'Points individuels', icon: '📍' },
                      { id: 'heatmap' as VizMode, label: 'Carte de chaleur', icon: '🔥' },
                    ]).map(mode => (
                      <button key={mode.id} onClick={() => setVizMode(mode.id)}
                        className={cn('w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors',
                          vizMode === mode.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted')}>
                        <span>{mode.icon}</span> {mode.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label className="text-xs">Palette</Label>
                    <Select value={colorScale} onValueChange={setColorScale}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.keys(COLOR_SCALES).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="maps" className="mt-2 space-y-3">
                {saveDialogOpen ? (
                  <div className="stat-card !p-3 space-y-3 border-primary/30 bg-primary/5">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-1.5 text-primary">
                      <Save size={14} /> Sauvegarder la carte
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Configuration actuelle : <span className="font-medium text-foreground">{activeFilterCount}</span> filtre(s), visualisation <span className="font-medium text-foreground">{vizMode}</span>.
                    </p>
                    <div>
                      <Label className="text-xs">Nom</Label>
                      <Input value={mapName} onChange={e => setMapName(e.target.value)} placeholder="Ex: Incidence sein 2025" className="h-8 text-xs mt-1" autoFocus />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea value={mapDesc} onChange={e => setMapDesc(e.target.value)} placeholder="Optionnelle..." className="text-xs mt-1 resize-none" rows={2} />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => { setSaveDialogOpen(false); setMapName(''); setMapDesc(''); }}>Annuler</Button>
                      <Button size="sm" className="flex-1 text-xs h-8" onClick={handleSaveMap} disabled={!mapName.trim()}>
                        <Check size={12} className="mr-1" /> Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="stat-card !p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                        <FolderOpen size={14} className="text-primary" /> Cartes sauvegardées
                        {savedMaps.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{savedMaps.length}</Badge>
                        )}
                      </h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                        onClick={() => setSaveDialogOpen(true)} title="Sauvegarder la carte actuelle">
                        <Plus size={12} />
                      </Button>
                    </div>
                    {savedMaps.length === 0 ? (
                      <div className="text-center py-6 px-2 rounded-lg border border-dashed border-border/60 bg-muted/30">
                        <FolderOpen size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">Aucune carte sauvegardée</p>
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setSaveDialogOpen(true)}>
                          <Plus size={11} className="mr-1" /> Créer la première
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 -mr-1">
                        {savedMaps.map(m => (
                          <div key={m.id} className="p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/60 group transition-all">
                            <div className="flex items-center gap-1">
                              <button className="flex-1 text-left text-xs font-medium truncate min-w-0" onClick={() => loadSavedMap(m)} title={m.name}>{m.name}</button>
                              <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary p-0.5 shrink-0" onClick={() => duplicateSavedMap(m)} title="Dupliquer"><Copy size={11} /></button>
                              <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 shrink-0" onClick={() => deleteSavedMap(m.id)} title="Supprimer"><Trash2 size={11} /></button>
                            </div>
                            {m.description && <p className="text-[10px] text-muted-foreground mt-0.5 truncate" title={m.description}>{m.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {savedMaps.length >= 2 && !saveDialogOpen && (
                  <div className="stat-card !p-3 space-y-2">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                      <Beaker size={14} className="text-primary" /> Croisements
                    </h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Combinez des cartes pour générer de nouvelles hypothèses épidémiologiques.</p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => setCompareDialogOpen(true)}>
                      <GitMerge size={12} className="mr-1" /> Union / Intersection / Différence
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="zones" className="mt-2 space-y-3">
                {appMode === 'zone-create' ? (
                  <div className="stat-card !p-3 space-y-3 border-amber-300 bg-amber-50/30">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-1.5 text-amber-700">
                      <MapPin size={14} /> Nouvelle zone
                    </h3>
                    <div>
                      <Label className="text-xs">Nom</Label>
                      <Input value={zoneName} onChange={e => setZoneName(e.target.value)} placeholder="Ex: Zone industrielle ouest" className="h-8 text-xs mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea value={zoneDesc} onChange={e => setZoneDesc(e.target.value)} placeholder="Objectif d'analyse..." className="text-xs mt-1 resize-none" rows={2} />
                    </div>
                    <div>
                      <Label className="text-xs">Couleur</Label>
                      <Input type="color" value={zoneColor} onChange={e => setZoneColor(e.target.value)} className="mt-1 h-8 w-16 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Wilayas sélectionnées ({selectedWilayas.length})</Label>
                      <div className="flex flex-wrap gap-1 mt-1 max-h-[120px] overflow-y-auto">
                        {selectedWilayas.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground italic py-1">Cliquez sur les wilayas de la carte pour les ajouter…</p>
                        ) : selectedWilayas.map(code => {
                          const w = ALGERIA_WILAYAS.find(w => w.code === code);
                          return (
                            <Badge key={code} variant="secondary" className="text-[10px] gap-1 bg-amber-100 text-amber-800 hover:bg-amber-200">
                              {w?.name || code}
                              <button onClick={() => setSelectedWilayas(prev => prev.filter(c => c !== code))} className="hover:text-destructive">
                                <X size={8} />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={cancelZoneCreation}>Annuler</Button>
                      <Button size="sm" className="flex-1 text-xs h-8" onClick={handleSaveZoneGroup} disabled={!zoneName.trim() || selectedWilayas.length === 0}>
                        <Check size={12} className="mr-1" /> Créer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="stat-card !p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-primary" /> Zones personnalisées
                        {zoneGroups.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{zoneGroups.length}</Badge>
                        )}
                      </h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 hover:text-primary" onClick={startZoneCreation} title="Créer une zone">
                        <Plus size={12} />
                      </Button>
                    </div>
                    {zoneGroups.length === 0 ? (
                      <div className="text-center py-6 px-2 rounded-lg border border-dashed border-border/60 bg-muted/30">
                        <MapPin size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">Aucune zone définie</p>
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={startZoneCreation}>
                          <Plus size={11} className="mr-1" /> Créer une zone
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 -mr-1">
                        {zoneGroups.map(z => (
                          <div key={z.id} className="p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/60 group transition-all">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shrink-0 ring-2 ring-background" style={{ backgroundColor: z.color }} />
                              <span className="flex-1 text-xs font-medium truncate min-w-0" title={z.name}>{z.name}</span>
                              <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 shrink-0" onClick={() => deleteZoneGroup(z.id)} title="Supprimer">
                                <Trash2 size={11} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1 ml-5">
                              {(z.items || []).slice(0, 4).map(item => (
                                <Badge key={item.zone_code} variant="outline" className="text-[9px] h-4 px-1.5">{item.zone_name}</Badge>
                              ))}
                              {(z.items || []).length > 4 && (
                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-muted">+{(z.items || []).length - 4}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* CENTER — Big map */}
          <div className="flex flex-col min-h-[400px] gap-2">
            {/* KPI strip ABOVE map (no overlap) */}
            <div className="grid grid-cols-5 gap-1.5 shrink-0">
              {[
                { label: 'Cas', value: stats.total, color: 'text-primary' },
                { label: 'Hommes', value: stats.male, color: 'text-chart-1' },
                { label: 'Femmes', value: stats.female, color: 'text-chart-5' },
                { label: 'Décès', value: stats.deceased, color: 'text-destructive' },
                { label: 'Wilayas', value: Array.from(wilayaStats.values()).filter(v => v > 0).length, color: 'text-accent' },
              ].map(k => (
                <div key={k.label} className="bg-card rounded-lg border border-border/50 px-2 py-1.5 shadow-sm text-center">
                  <p className={cn('text-base font-display font-bold leading-none tabular-nums', k.color)}>{k.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{k.label}</p>
                </div>
              ))}
            </div>
            <div className="relative flex-1 min-h-[350px]">
              <div ref={mapRef} className="absolute inset-0 rounded-xl border border-border/50 shadow-sm" />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 p-3 shadow-lg z-[1000]">
              <p className="text-[10px] font-semibold mb-1">Légende — {vizMode}</p>
              <div className="flex items-center gap-1">
                {(COLOR_SCALES[colorScale as keyof typeof COLOR_SCALES] || COLOR_SCALES.cancer).map((c, i) => (
                  <div key={i} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-muted-foreground mt-0.5">
                <span>0</span><span>{maxCases} cas</span>
              </div>
            </div>

            {selectedWilaya && appMode === 'explore' && (() => {
              const w = ALGERIA_WILAYAS.find(w => w.code === selectedWilaya);
              const row = wilayaTable.find(r => r.code === selectedWilaya);
              if (!w || !row) return null;
              return (
                <div className="absolute top-20 left-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border/50 p-3 shadow-lg z-[1000] max-w-[230px]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold">{w.name}</p>
                    <button onClick={() => setSelectedWilaya(null)} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
                  </div>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Cas</span><span className="font-semibold">{row.count}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Population</span><span>{(w.population2023 / 1000).toFixed(0)}k</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Taux/100k</span><span className="font-semibold">{row.rate.toFixed(1)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">vs national</span><span className={cn('font-semibold', row.ratio > 1.5 ? 'text-destructive' : row.ratio < 0.5 ? 'text-success' : 'text-foreground')}>×{row.ratio.toFixed(2)}</span></div>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>

          {/* RIGHT — Insights / Hotspots / Top wilayas */}
          <div className="overflow-y-auto pl-1 space-y-3 min-h-0">
            {/* Auto-generated hypotheses */}
            <div className="stat-card !p-3 space-y-2">
              <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                <Lightbulb size={14} className="text-warning" /> Hypothèses générées
                <Badge variant="secondary" className="text-[9px] ml-auto">{insights.length}</Badge>
              </h3>
              {insights.length === 0 ? (
                <p className="text-[11px] text-muted-foreground py-2">Aucun signal détecté avec les filtres actuels. Élargissez la sélection ou réduisez les critères.</p>
              ) : insights.map((ins, i) => (
                <div key={i} className={cn('rounded-lg p-2 border-l-2 text-[11px] space-y-0.5',
                  ins.severity === 'high' ? 'bg-destructive/5 border-destructive' :
                  ins.severity === 'medium' ? 'bg-warning/5 border-warning' :
                  'bg-muted/40 border-muted-foreground/30')}>
                  <div className="flex items-center gap-1.5 font-semibold">
                    {ins.type === 'hotspot' && <Flame size={11} className="text-destructive" />}
                    {ins.type === 'sex' && <Users size={11} />}
                    {ins.type === 'trend' && <TrendingUp size={11} />}
                    {ins.type === 'milieu' && <MapPin size={11} />}
                    {ins.type === 'rare' && <AlertTriangle size={11} />}
                    {ins.type === 'age' && <Activity size={11} />}
                    <span>{ins.title}</span>
                  </div>
                  <p className="text-muted-foreground leading-snug">{ins.detail}</p>
                </div>
              ))}
            </div>

            {/* Top wilayas leaderboard */}
            <div className="stat-card !p-3 space-y-2">
              <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                <Flame size={14} className="text-destructive" /> Hotspots — Top 10
              </h3>
              <div className="space-y-1">
                <div className="grid grid-cols-[20px_1fr_40px_50px] gap-1 text-[9px] uppercase text-muted-foreground font-semibold pb-1 border-b">
                  <span>#</span><span>Wilaya</span><span className="text-right">Cas</span><span className="text-right">/100k</span>
                </div>
                {wilayaTable.filter(w => w.count > 0).slice(0, 10).map((w, i) => (
                  <button key={w.code}
                    onClick={() => setSelectedWilaya(w.code)}
                    className={cn('w-full grid grid-cols-[20px_1fr_40px_50px] gap-1 text-[11px] items-center py-1 rounded hover:bg-muted/50 transition-colors text-left',
                      selectedWilaya === w.code && 'bg-primary/10')}>
                    <span className={cn('font-mono text-[10px]', i < 3 ? 'text-destructive font-bold' : 'text-muted-foreground')}>{i + 1}</span>
                    <span className="truncate font-medium">{w.name}</span>
                    <span className="text-right tabular-nums">{w.count}</span>
                    <span className={cn('text-right tabular-nums font-semibold',
                      w.ratio >= 1.8 ? 'text-destructive' : w.ratio >= 1.2 ? 'text-warning' : 'text-foreground')}>
                      {w.rate.toFixed(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top cancers */}
            <div className="stat-card !p-3 space-y-2">
              <h3 className="font-display font-semibold text-sm">Top Cancers</h3>
              <div className="space-y-1">
                {stats.topCancers.map(([type, count], i) => {
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={type} className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-3 text-muted-foreground font-mono text-[9px]">{i + 1}</span>
                        <span className="font-medium truncate flex-1">{type}</span>
                        <span className="text-muted-foreground tabular-nums">{count} · {pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden ml-4">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Year trend sparkline */}
            {stats.yearTrend.length >= 2 && (
              <div className="stat-card !p-3 space-y-2">
                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" /> Tendance temporelle
                </h3>
                <div className="flex items-end gap-1 h-16">
                  {stats.yearTrend.map(([year, count]) => {
                    const max = Math.max(...stats.yearTrend.map(([, c]) => c));
                    const h = (count / max) * 100;
                    return (
                      <div key={year} className="flex-1 flex flex-col items-center gap-0.5 group">
                        <div className="w-full bg-primary/70 hover:bg-primary rounded-t transition-colors relative" style={{ height: `${h}%` }}>
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] opacity-0 group-hover:opacity-100 bg-foreground text-background px-1 rounded whitespace-nowrap">{count}</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground">{String(year).slice(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Map: rendered inline in the "Cartes" tab to keep the map visible/interactive */}

      {/* Map Operations Dialog (Union / Intersection / Difference) */}
      <Dialog
        open={compareDialogOpen}
        onOpenChange={(o) => {
          setCompareDialogOpen(o);
          // Leaflet needs a resize after layout changes to repaint tiles properly
          setTimeout(() => mapInstanceRef.current?.invalidateSize(), 250);
          setTimeout(() => mapInstanceRef.current?.invalidateSize(), 600);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto z-[10000] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Beaker size={18} className="text-primary" /> Opérations entre cartes
            </DialogTitle>
            <DialogDescription className="text-xs">Combinez des cartes sauvegardées pour tester des hypothèses épidémiologiques.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Combinez les filtres de vos cartes sauvegardées pour tester des hypothèses épidémiologiques.
              Par exemple : <strong>Union</strong> de "Fumeurs zone industrielle" et "Exposition mer" pour identifier les populations à risque cumulé.
            </p>

            <div>
              <Label className="text-sm font-medium">Opération</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {([
                  { id: 'union' as const, label: 'Union (∪)', desc: 'Tous les cas des cartes', icon: Combine },
                  { id: 'intersection' as const, label: 'Intersection (∩)', desc: 'Cas communs', icon: GitMerge },
                  { id: 'difference' as const, label: 'Différence (−)', desc: 'Cas de A sauf B', icon: X },
                ]).map(op => (
                  <button key={op.id} onClick={() => setMapOperation(op.id)}
                    className={cn('p-2 rounded-lg border text-center transition-all',
                      mapOperation === op.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/30')}>
                    <op.icon size={16} className={cn('mx-auto mb-1', mapOperation === op.id ? 'text-primary' : 'text-muted-foreground')} />
                    <p className="text-xs font-medium">{op.label}</p>
                    <p className="text-[9px] text-muted-foreground">{op.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Sélectionnez les cartes ({selectedMapsForOp.length} sélectionnées)</Label>
              {savedMaps.length < 2 ? (
                <p className="text-xs text-muted-foreground mt-2">
                  Vous devez avoir au moins 2 cartes sauvegardées. Sauvegardez d'abord des cartes avec des filtres différents.
                </p>
              ) : (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                  {savedMaps.map(m => {
                    const isSelected = selectedMapsForOp.includes(m.id);
                    const order = isSelected ? selectedMapsForOp.indexOf(m.id) : -1;
                    const count = getCaseIdsForMap(m).size;
                    return (
                      <button key={m.id}
                        onClick={() => setSelectedMapsForOp(prev =>
                          isSelected ? prev.filter(id => id !== m.id) : [...prev, m.id]
                        )}
                        className={cn('w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all',
                          isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted border border-transparent')}>
                        <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 text-[10px] font-bold',
                          isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30')}>
                          {isSelected ? String.fromCharCode(65 + order) : ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{m.name}</p>
                          {m.description && <p className="text-[10px] text-muted-foreground truncate">{m.description}</p>}
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">{count} cas</Badge>
                      </button>
                    );
                  })}
                </div>
              )}
              {mapOperation === 'difference' && selectedMapsForOp.length >= 2 && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  Différence = cas dans <strong>A</strong> mais pas dans {selectedMapsForOp.slice(1).map((_, i) => String.fromCharCode(66 + i)).join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => { setCompareDialogOpen(false); setSelectedMapsForOp([]); }}>Annuler</Button>
            <Button onClick={executeMapOperation} disabled={selectedMapsForOp.length < 2}>
              <Beaker size={14} className="mr-1" /> Exécuter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

/* ─── Helper: FilterSelect ─── */
function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
