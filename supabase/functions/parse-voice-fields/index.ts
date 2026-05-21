import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es un assistant médical pour un registre du cancer au CHU Tlemcen, Algérie.
L'utilisateur dicte des informations sur un patient. Extrais les champs pertinents.

Champs JSON possibles :
- nom, prenom, dateNaissance (YYYY-MM-DD), sexe ("M" ou "F"), telephone, numDossier
- commune (Tlemcen, Mansourah, Chetouane, Remchi, Ghazaouet, Maghnia, Sebdou, Hennaya, Nedroma, Beni Snous, Ouled Mimoun, Ain Tallout, Bab El Assa, Honaine)
- milieu ("urbain"|"rural"|"semi-urbain"), profession
- typeCancer (Poumon, Colorectal, Sein, Prostate, Vessie, Estomac, Foie, Pancréas, Rein, Thyroïde, Leucémie, Lymphome, Mélanome, Col utérin, Ovaire, Cavité buccale, Larynx, Œsophage, Cerveau/SNC, Sarcome, Myélome, Autre)
- dateDiagnostic (YYYY-MM-DD), sourceInfo, baseDiagnostic
- topographieIcdo (ex C34.1), codeIcdo, lateralite (Droite|Gauche|Bilatéral|Non applicable)
- morphologieIcdo (ex 8140/3), sousTypeCancer, grade, comportement
- stadeTnm (ex T2N1M0), stadeChiffre (I..IV), anomaliesMoleculaires
- medecinAnapath, dateAnapath, refAnapath, resultatAnapath
- biologieFns, biologieGlobules, biologieDate
- notes

Règles strictes :
- Retourne UNIQUEMENT un JSON valide, pas d'explication, pas de markdown
- Ne mets QUE les champs identifiés avec certitude
- Darija/arabe : "rajel"→M, "mra"→F
- Ne remplace jamais un champ déjà rempli (currentForm) sauf correction explicite`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transcript, currentForm } = await req.json();
    if (!transcript) throw new Error("No transcript provided");

    const apiKey = Deno.env.get("MISTRAL_API_KEY");
    if (!apiKey) throw new Error("MISTRAL_API_KEY not configured");

    const userMessage = `Transcription : "${transcript}"
Champs déjà remplis : ${JSON.stringify(currentForm || {})}
Retourne uniquement le JSON des champs extraits.`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Mistral error:", response.status, err);
      throw new Error(`Mistral API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    let fields: Record<string, string> = {};
    try {
      fields = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) fields = JSON.parse(m[0]);
    }

    return new Response(JSON.stringify({ fields }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-voice-fields error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message, fields: {} }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
