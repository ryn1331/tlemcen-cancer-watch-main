// Détection automatique d'anomalies épidémiologiques
// Calcule sex-ratio, pic d'incidence z-score, qualité MV%/DCO% et insère dans quality_alerts.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CaseRow {
  id: string;
  date_diagnostic: string | null;
  type_cancer: string | null;
  base_diagnostic: string | null;
  cause_deces: string | null;
  statut_vital: string | null;
  patient_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    const { data: cases } = await supabase
      .from("cancer_cases")
      .select("id, date_diagnostic, type_cancer, base_diagnostic, cause_deces, statut_vital, patient_id")
      .returns<CaseRow[]>();
    const { data: patients } = await supabase.from("patients").select("id, sexe");

    if (!cases || !patients) throw new Error("Pas de données");

    const sexById: Record<string, string> = {};
    patients.forEach((p: any) => { sexById[p.id] = p.sexe; });

    const alerts: any[] = [];
    const N = cases.length;

    // --- 1. Sex-ratio par type de cancer (alerte si extrême sur >=20 cas) ---
    const byType: Record<string, { M: number; F: number }> = {};
    cases.forEach(c => {
      const t = c.type_cancer || "Inconnu";
      const s = sexById[c.patient_id];
      if (!byType[t]) byType[t] = { M: 0, F: 0 };
      if (s === "M") byType[t].M++;
      else if (s === "F") byType[t].F++;
    });
    Object.entries(byType).forEach(([type, sr]) => {
      const total = sr.M + sr.F;
      if (total < 20) return;
      const ratio = sr.M / Math.max(1, sr.F);
      // Sein chez homme > 5%, prostate chez femme = anomalies évidentes
      if (type.toLowerCase().includes("sein") && sr.M / total > 0.05) {
        alerts.push({
          alert_type: "sex_ratio",
          severity: "warn",
          title: `Sex-ratio anormal — ${type}`,
          message: `${sr.M} cas masculins (${(sr.M / total * 100).toFixed(1)}%) sur ${total} cas. Vérifier les codifications.`,
          metrics: { type, M: sr.M, F: sr.F, ratio },
        });
      }
      if (type.toLowerCase().includes("prostate") && sr.F > 0) {
        alerts.push({
          alert_type: "sex_ratio",
          severity: "error",
          title: `Erreur de sexe — ${type}`,
          message: `${sr.F} cas féminins de prostate détectés. Codification à vérifier.`,
          metrics: { type, M: sr.M, F: sr.F },
        });
      }
    });

    // --- 2. Pic d'incidence par mois (z-score > 2) ---
    const byMonth: Record<string, number> = {};
    cases.forEach(c => {
      if (!c.date_diagnostic) return;
      const m = c.date_diagnostic.slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    const counts = Object.values(byMonth);
    if (counts.length >= 6) {
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      const sd = Math.sqrt(counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length);
      Object.entries(byMonth).forEach(([m, c]) => {
        const z = sd > 0 ? (c - mean) / sd : 0;
        if (z > 2.5) {
          alerts.push({
            alert_type: "incidence_spike",
            severity: "warn",
            title: `Pic d'incidence — ${m}`,
            message: `${c} cas en ${m} (moyenne ${mean.toFixed(1)}, z=${z.toFixed(2)}). Vérifier source.`,
            metrics: { month: m, count: c, mean, sd, z_score: z },
          });
        }
      });
    }

    // --- 3. Qualité IARC : DCO% et MV% sur les 12 derniers mois ---
    const recent = cases.filter(c => {
      if (!c.date_diagnostic) return false;
      const d = new Date(c.date_diagnostic);
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 12);
      return d >= cutoff;
    });
    if (recent.length >= 50) {
      const dco = recent.filter(c => (c.base_diagnostic || "").toLowerCase().includes("certificat")).length;
      const mv = recent.filter(c => ["histologie", "cytologie"].includes((c.base_diagnostic || "").toLowerCase())).length;
      const dcoPct = (dco / recent.length) * 100;
      const mvPct = (mv / recent.length) * 100;

      if (dcoPct > 15) {
        alerts.push({
          alert_type: "iarc_quality",
          severity: "error",
          title: "DCO% trop élevé (qualité IARC)",
          message: `${dcoPct.toFixed(1)}% de cas DCO sur 12 mois (seuil IARC: <10%).`,
          metrics: { dco_pct: dcoPct, n: recent.length },
        });
      }
      if (mvPct < 70) {
        alerts.push({
          alert_type: "iarc_quality",
          severity: "warn",
          title: "MV% sous le seuil IARC",
          message: `${mvPct.toFixed(1)}% de vérification microscopique (seuil IARC: >75%).`,
          metrics: { mv_pct: mvPct, n: recent.length },
        });
      }
    }

    // --- Insert dedup: skip if a non-resolved alert with same type+title exists ---
    const { data: existing } = await supabase
      .from("quality_alerts")
      .select("title, alert_type")
      .eq("resolved", false);
    const existingKeys = new Set((existing || []).map((a: any) => `${a.alert_type}|${a.title}`));
    const toInsert = alerts.filter(a => !existingKeys.has(`${a.alert_type}|${a.title}`));

    if (toInsert.length) await supabase.from("quality_alerts").insert(toInsert);

    return new Response(JSON.stringify({
      total_cases: N,
      alerts_generated: toInsert.length,
      alerts_skipped_duplicate: alerts.length - toInsert.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
