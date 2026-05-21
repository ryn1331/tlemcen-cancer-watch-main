// NER pour comptes-rendus anatomopathologiques (Lovable AI Gateway)
// Extrait des champs structurés depuis un texte libre d'anapath.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      throw new Error("Texte d'anapath requis (≥ 10 caractères)");
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY manquant");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant d'extraction NER spécialisé en anatomopathologie oncologique (standards IARC/OMS).
À partir d'un compte-rendu en français/arabe, extrais STRICTEMENT les champs suivants en JSON:
{
  "topographie_icdo": "Cxx.x ou ''",
  "morphologie_icdo": "8xxx/x ou ''",
  "type_cancer": "ex: Cancer du sein, Cancer du poumon, ...",
  "sous_type_cancer": "ex: Carcinome canalaire infiltrant",
  "grade": "I|II|III|IV ou ''",
  "comportement": "/0|/1|/2|/3|/6 ou ''",
  "stade_tnm": "ex: pT2N1M0 ou ''",
  "lateralite": "droit|gauche|bilateral|na ou ''",
  "ref_anapath": "numéro ou référence du CR ou ''",
  "date_anapath": "YYYY-MM-DD ou ''",
  "medecin_anapath": "nom du Dr signataire ou ''",
  "anomalies_moleculaires": "ex: HER2+, EGFR muté, ... ou ''",
  "resume": "1-2 phrases résumant le diagnostic"
}
Si une info n'est pas présente, mets une chaîne vide. Ne devine pas les codes ICD-O sans certitude.`,
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      if (r.status === 429) throw new Error("Limite de requêtes atteinte. Réessayez dans un instant.");
      if (r.status === 402) throw new Error("Crédits Lovable AI épuisés.");
      throw new Error(`AI Gateway: ${errText}`);
    }

    const data = await r.json();
    let extracted: Record<string, string> = {};
    try {
      extracted = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    } catch {
      extracted = {};
    }

    return new Response(JSON.stringify({ extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
