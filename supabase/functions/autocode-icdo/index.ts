// Autocodage CIM-O-3 assisté par IA (Lovable AI Gateway)
// Retourne top 3 suggestions de topographie + morphologie avec niveau de confiance.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Tu es un expert en codification CIM-O-3 (Classification Internationale des Maladies pour l'Oncologie).
À partir d'une description clinique/anapath en français, tu retournes UNIQUEMENT un JSON :
{
  "suggestions": [
    {
      "topographie": "C50.4",
      "topographie_label": "Quadrant supéro-externe du sein",
      "morphologie": "8500/3",
      "morphologie_label": "Carcinome canalaire infiltrant",
      "comportement": "3",
      "grade": "II",
      "confidence": 0.92,
      "rationale": "..."
    }
  ]
}
Règles:
- Max 3 suggestions, triées par confidence décroissante.
- Codes valides CIM-O-3 (topographie C00-C97, morphologie ####/#).
- Comportement: /0 bénin, /1 incertain, /2 in situ, /3 invasif, /6 métastase.
- Pas de markdown, JSON pur.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { description } = await req.json();
    if (!description) throw new Error("description requise");

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY non configurée");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: description },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "Quota IA dépassé" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "Crédits IA épuisés" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) throw new Error(`AI gateway: ${r.status}`);

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
