import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ALGERIA_WILAYAS } from '@/lib/algeria-wilayas';

interface Props {
  data: Record<string, number>;
  metric?: 'cases' | 'rate'; // rate per 100k
}

function colorFor(ratio: number) {
  if (ratio === 0) return '#e5e7eb';
  if (ratio < 0.2) return '#dbeafe';
  if (ratio < 0.4) return '#93c5fd';
  if (ratio < 0.6) return '#3b82f6';
  if (ratio < 0.8) return '#1d4ed8';
  return '#1e3a8a';
}

export default function AlgeriaAtlasMap({ data, metric = 'cases' }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [28.5, 2.5], zoom: 5, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 12, attribution: '© OpenStreetMap, © CARTO',
    }).addTo(map);
    mapInstanceRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();

    // compute values: cases or rate per 100k
    const valueOf = (w: { name: string; population2023: number }) => {
      const c = data[w.name] || 0;
      if (metric === 'rate') return w.population2023 > 0 ? (c / w.population2023) * 100000 : 0;
      return c;
    };

    const max = Math.max(1, ...ALGERIA_WILAYAS.map(valueOf));

    for (const w of ALGERIA_WILAYAS) {
      const v = valueOf(w);
      const ratio = v / max;
      const cases = data[w.name] || 0;
      const radius = 6 + Math.sqrt(ratio) * 22;

      const marker = L.circleMarker([w.lat, w.lng], {
        radius,
        fillColor: colorFor(ratio),
        color: '#1e40af',
        weight: 1,
        fillOpacity: cases > 0 ? 0.75 : 0.15,
      });

      const rate100k = w.population2023 > 0 ? ((cases / w.population2023) * 100000).toFixed(1) : '–';
      marker.bindTooltip(
        `<div style="font-family: Inter, sans-serif; font-size: 12px;">
          <strong>${w.name}</strong> <span style="color:#94a3b8;">(${w.code})</span><br/>
          <span style="color:#475569;">Cas:</span> <strong>${cases || '< 5 (masqué)'}</strong><br/>
          <span style="color:#475569;">Taux brut:</span> <strong>${rate100k}/100k</strong><br/>
          <span style="color:#94a3b8;font-size:10px;">Pop. ${w.population2023.toLocaleString('fr-FR')}</span>
        </div>`,
        { direction: 'top', offset: [0, -radius] }
      );
      marker.addTo(layerRef.current!);
    }
  }, [data, metric]);

  return <div ref={mapRef} className="w-full h-[480px] rounded-xl overflow-hidden border border-border" />;
}
