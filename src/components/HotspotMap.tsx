import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import type { HotspotPrediction } from '@/lib/hotspot-forecast';

interface Props {
  predictions: HotspotPrediction[];
}

export default function HotspotMap({ predictions }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<any>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      center: [28.5, 2.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 10,
      worldCopyJump: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 12, attribution: '© OpenStreetMap, © CARTO',
    }).addTo(map);
    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);
    // Force resize once mounted inside flex/grid containers
    setTimeout(() => map.invalidateSize(), 100);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;
    markers.clearLayers();
    if (heatRef.current) { map.removeLayer(heatRef.current); heatRef.current = null; }

    if (!predictions.length) return;

    const maxVal = Math.max(1, ...predictions.map(p => p.predictedNext12m));

    // Heat layer — based on predicted volume so something always shows when data exists
    const heatPoints = predictions
      .filter(p => p.predictedNext12m > 0 || p.observedLastYear > 0)
      .map(p => {
        const intensity = Math.max(p.predictedNext12m, p.observedLastYear) / maxVal;
        return [p.lat, p.lng, Math.max(0.15, intensity)] as [number, number, number];
      });

    if (heatPoints.length) {
      heatRef.current = (L as any).heatLayer(heatPoints, {
        radius: 55,
        blur: 40,
        maxZoom: 8,
        max: 1.0,
        minOpacity: 0.35,
        gradient: { 0.2: '#bfdbfe', 0.4: '#60a5fa', 0.6: '#f59e0b', 0.8: '#ef4444', 1.0: '#7f1d1d' },
      }).addTo(map);
    }

    // Markers — lower threshold so map is never empty
    for (const p of predictions) {
      if (p.predictedNext12m < 1 && p.observedLastYear < 1) continue;
      const color = p.trend === 'rising' ? '#dc2626' : p.trend === 'falling' ? '#10b981' : '#3b82f6';
      const radius = 5 + Math.sqrt(Math.max(p.hotspotScore, p.predictedNext12m / maxVal)) * 18;
      const m = L.circleMarker([p.lat, p.lng], {
        radius, fillColor: color, color: '#1e3a8a', weight: 1, fillOpacity: 0.75,
      });
      m.bindTooltip(`
        <div style="font-family:Inter;font-size:12px;min-width:180px;">
          <strong>${p.wilaya}</strong> <span style="color:#94a3b8">(${p.code})</span><br/>
          <span style="color:#475569">Observé ${new Date().getFullYear() - 1}:</span> <strong>${p.observedLastYear}</strong><br/>
          <span style="color:#475569">Prédit 12 mois:</span> <strong style="color:${color}">${p.predictedNext12m}</strong><br/>
          <span style="color:#475569">Taux:</span> <strong>${p.predictedRate100k.toFixed(1)}/100k</strong><br/>
          <span style="color:#475569">Tendance:</span> ${p.trend === 'rising' ? '📈 Hausse' : p.trend === 'falling' ? '📉 Baisse' : '➡️ Stable'}<br/>
          <span style="color:#94a3b8;font-size:10px;">Score: ${(p.hotspotScore * 100).toFixed(0)}/100</span>
        </div>
      `, { direction: 'top', offset: [0, -radius] });
      m.addTo(markers);
    }

    setTimeout(() => map.invalidateSize(), 50);
  }, [predictions]);

  return <div ref={ref} className="w-full h-[520px] rounded-xl overflow-hidden border border-border" style={{ background: '#f8fafc' }} />;
}
