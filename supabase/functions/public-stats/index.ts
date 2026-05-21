// API publique - Statistiques agrégées et anonymisées (k≥5)
// Conforme à la loi ANPDP algérienne 18-07 / 25-11
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const K_ANON = 5;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const endpoint = url.searchParams.get("endpoint") || "summary";
  const year = url.searchParams.get("year");
  const cancerType = url.searchParams.get("cancer_type");
  const sexFilter = url.searchParams.get("sex");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    let q = supabase
      .from("cancer_cases")
      .select("type_cancer, date_diagnostic, statut, patient_id, patients!inner(wilaya, sexe, date_naissance)")
      .eq("statut", "valide");

    if (year) q = q.gte("date_diagnostic", `${year}-01-01`).lte("date_diagnostic", `${year}-12-31`);
    if (cancerType) q = q.eq("type_cancer", cancerType);
    if (sexFilter) q = q.eq("patients.sexe", sexFilter);

    const { data: rows, error } = await q;
    if (error) throw error;

    type Row = { type_cancer: string; date_diagnostic: string; patients: { wilaya: string; sexe: string; date_naissance: string | null } };
    const records: Row[] = (rows || []) as any;

    const apply = (groups: Record<string, number>) => {
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(groups)) {
        if (v >= K_ANON) out[k] = v;
      }
      return out;
    };

    let body: any;
    if (endpoint === "by_wilaya") {
      const g: Record<string, number> = {};
      for (const r of records) {
        const w = r.patients?.wilaya || "Inconnue";
        g[w] = (g[w] || 0) + 1;
      }
      body = { unit: "cases", k_anonymity: K_ANON, year: year || "all", data: apply(g) };
    } else if (endpoint === "by_type") {
      const g: Record<string, number> = {};
      for (const r of records) g[r.type_cancer] = (g[r.type_cancer] || 0) + 1;
      body = { unit: "cases", k_anonymity: K_ANON, year: year || "all", data: apply(g) };
    } else if (endpoint === "by_sex") {
      const g: Record<string, number> = {};
      for (const r of records) {
        const s = r.patients?.sexe || "?";
        g[s] = (g[s] || 0) + 1;
      }
      body = { unit: "cases", k_anonymity: K_ANON, year: year || "all", data: apply(g) };
    } else if (endpoint === "by_age_group") {
      const buckets = ["0-14", "15-29", "30-44", "45-59", "60-74", "75+"];
      const g: Record<string, number> = Object.fromEntries(buckets.map(b => [b, 0]));
      for (const r of records) {
        const dn = r.patients?.date_naissance;
        if (!dn) continue;
        const age = new Date(r.date_diagnostic).getFullYear() - new Date(dn).getFullYear();
        const b = age < 15 ? "0-14" : age < 30 ? "15-29" : age < 45 ? "30-44" : age < 60 ? "45-59" : age < 75 ? "60-74" : "75+";
        g[b]++;
      }
      body = { unit: "cases", k_anonymity: K_ANON, year: year || "all", data: apply(g) };
    } else if (endpoint === "by_year") {
      const g: Record<string, number> = {};
      for (const r of records) {
        const y = (r.date_diagnostic || "").slice(0, 4);
        if (y) g[y] = (g[y] || 0) + 1;
      }
      body = { unit: "cases", k_anonymity: K_ANON, data: apply(g) };
    } else {
      // summary
      const total = records.length;
      const byWilaya = apply(records.reduce<Record<string, number>>((a, r) => {
        const w = r.patients?.wilaya || "Inconnue"; a[w] = (a[w] || 0) + 1; return a;
      }, {}));
      const byType = apply(records.reduce<Record<string, number>>((a, r) => {
        a[r.type_cancer] = (a[r.type_cancer] || 0) + 1; return a;
      }, {}));
      body = {
        registry: "Registre Cancer Algérie",
        version: "1.0",
        license: "CC-BY-4.0",
        k_anonymity: K_ANON,
        total_cases: total >= K_ANON ? total : 0,
        wilayas_covered: Object.keys(byWilaya).length,
        cancer_types: Object.keys(byType).length,
        endpoints: ["summary", "by_wilaya", "by_type", "by_sex", "by_age_group", "by_year"],
        usage: "GET /functions/v1/public-stats?endpoint=by_wilaya&year=2024",
      };
    }

    return new Response(JSON.stringify(body, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
