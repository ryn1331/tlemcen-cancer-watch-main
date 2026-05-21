// Détection sémantique de doublons via embeddings (Lovable AI Gateway)
// Compare un patient candidat à la liste existante. Combine fuzzy nom/prénom + similarité d'embedding.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1]
      ? dp[i - 1][j - 1]
      : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  }
  return dp[m][n];
}
const sim = (a: string, b: string) => {
  const max = Math.max(a.length, b.length);
  if (!max) return 1;
  return 1 - levenshtein(a.toLowerCase().trim(), b.toLowerCase().trim()) / max;
};

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  sexe: string | null;
  commune: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    const { candidate, threshold = 0.85 } = await req.json();
    if (!candidate?.nom || !candidate?.prenom) throw new Error("nom + prenom requis");

    const { data: patients } = await supabase
      .from("patients")
      .select("id, nom, prenom, date_naissance, sexe, commune")
      .returns<Patient[]>();

    if (!patients || patients.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Pre-filter via fuzzy on nom+prenom (top 30 candidates)
    const scored = patients
      .filter(p => p.id !== candidate.id)
      .map(p => {
        const nomS = sim(p.nom, candidate.nom);
        const prenomS = sim(p.prenom, candidate.prenom);
        const dobMatch = p.date_naissance && candidate.date_naissance && p.date_naissance === candidate.date_naissance ? 1 : 0;
        const sexeMatch = p.sexe && candidate.sexe && p.sexe === candidate.sexe ? 1 : 0;
        const fuzzy = (nomS * 0.4 + prenomS * 0.4 + dobMatch * 0.15 + sexeMatch * 0.05);
        return { patient: p, fuzzy };
      })
      .sort((a, b) => b.fuzzy - a.fuzzy)
      .slice(0, 30);

    // Use AI gateway to refine top candidates with semantic comparison
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    let aiBoosted: any[] = [];
    if (apiKey && scored.length > 0) {
      const candidateStr = `${candidate.nom} ${candidate.prenom} ${candidate.date_naissance || ''} ${candidate.commune || ''}`;
      const list = scored.slice(0, 10).map((s, i) =>
        `${i}: ${s.patient.nom} ${s.patient.prenom} ${s.patient.date_naissance || ''} ${s.patient.commune || ''}`
      ).join("\n");

      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: `Tu compares un patient candidat à une liste. Tiens compte des variantes phonétiques arabes/françaises (ex: Mohammed/Mohamed, Abderrahmane/Abderrahman). Retourne JSON {"matches":[{"index":0,"score":0.95,"reason":"..."}]}. Score 0-1.` },
            { role: "user", content: `Candidat: ${candidateStr}\n\nListe:\n${list}` },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (r.ok) {
        const data = await r.json();
        try { aiBoosted = JSON.parse(data.choices?.[0]?.message?.content || "{}").matches || []; }
        catch { aiBoosted = []; }
      }
    }

    // Combine fuzzy + AI score
    const matches = scored.slice(0, 10).map((s, i) => {
      const ai = aiBoosted.find((m: any) => m.index === i);
      const aiScore = ai?.score ?? s.fuzzy;
      const combined = s.fuzzy * 0.6 + aiScore * 0.4;
      return {
        patient: s.patient,
        fuzzy_score: s.fuzzy,
        ai_score: aiScore,
        combined_score: combined,
        ai_reason: ai?.reason || null,
      };
    }).filter(m => m.combined_score >= threshold)
      .sort((a, b) => b.combined_score - a.combined_score);

    return new Response(JSON.stringify({ matches }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
