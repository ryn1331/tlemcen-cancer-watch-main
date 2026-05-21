// Assistant IA épidémiologique — accès complet aux statistiques agrégées du registre.
// Construit un snapshot riche (incidence, mortalité, géo, croisements, traitements,
// rechutes, qualité IARC) puis demande à Gemini Pro de répondre en mode épidémiologiste.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatMsg { role: "user" | "assistant"; content: string }

const top = (o: Record<string, number>, n = 15) =>
  Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([k, v]) => `${k}:${v}`).join(", ");

const pct = (a: number, b: number) => b > 0 ? ((a / b) * 100).toFixed(1) + "%" : "n/a";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json() as { messages: ChatMsg[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Fetch all relevant datasets in parallel
    const [casesRes, traitRes, rechutesRes, popRes] = await Promise.all([
      supabase.from("cancer_cases").select(
        "id, type_cancer, sous_type_cancer, code_icdo, topographie_icdo, morphologie_icdo, " +
        "date_diagnostic, statut, stade_tnm, grade, lateralite, comportement, base_diagnostic, " +
        "methode_diagnostic, milieu, tabagisme, alcool, sportif, profession, " +
        "statut_vital, date_deces, cause_deces, date_derniere_nouvelle, " +
        "patients(wilaya, commune, sexe, date_naissance)"
      ).limit(20000),
      supabase.from("traitements").select("type_traitement, protocole, efficacite, effets_secondaires, date_debut, date_fin").limit(20000),
      supabase.from("cancer_rechutes").select("type_evenement, date_evenement, localisation, stade_tnm").limit(20000),
      supabase.from("population_reference").select("annee, sexe, tranche_age, wilaya, population").limit(5000),
    ]);

    type Row = {
      id: string; type_cancer: string; sous_type_cancer: string | null; code_icdo: string | null;
      topographie_icdo: string | null; morphologie_icdo: string | null;
      date_diagnostic: string; statut: string | null; stade_tnm: string | null; grade: string | null;
      lateralite: string | null; comportement: string | null; base_diagnostic: string | null;
      methode_diagnostic: string | null; milieu: string | null; tabagisme: string | null;
      alcool: string | null; sportif: string | null; profession: string | null;
      statut_vital: string | null; date_deces: string | null; cause_deces: string | null;
      date_derniere_nouvelle: string | null;
      patients: { wilaya: string | null; commune: string | null; sexe: string | null; date_naissance: string | null } | null;
    };
    const records = (casesRes.data || []) as Row[];
    const traitements = traitRes.data || [];
    const rechutes = rechutesRes.data || [];
    const populations = popRes.data || [];

    // Aggregators
    const byType: Record<string, number> = {};
    const byWilaya: Record<string, number> = {};
    const byCommune: Record<string, number> = {};
    const byYear: Record<string, number> = {};
    const bySex: Record<string, number> = { M: 0, F: 0 };
    const byStage: Record<string, number> = {};
    const byGrade: Record<string, number> = {};
    const byMethod: Record<string, number> = {};
    const byBaseDiag: Record<string, number> = {};
    const byStatut: Record<string, number> = {};
    const byMilieu: Record<string, number> = {};
    const byTabac: Record<string, number> = {};
    const byAlcool: Record<string, number> = {};
    const byAgeGroup: Record<string, number> = {};
    const typeBySex: Record<string, { M: number; F: number }> = {};
    const typeByWilaya: Record<string, Record<string, number>> = {};
    const stageByType: Record<string, Record<string, number>> = {};
    const ages: number[] = [];
    let deces = 0, vivants = 0, perdusVue = 0;
    const causesDeces: Record<string, number> = {};
    const decesByType: Record<string, number> = {};
    const ageGroup = (a: number) =>
      a < 15 ? "0-14" : a < 30 ? "15-29" : a < 45 ? "30-44" : a < 60 ? "45-59" : a < 75 ? "60-74" : "75+";

    for (const r of records) {
      byType[r.type_cancer] = (byType[r.type_cancer] || 0) + 1;
      const w = r.patients?.wilaya || "Inconnue";
      byWilaya[w] = (byWilaya[w] || 0) + 1;
      if (r.patients?.commune) byCommune[r.patients.commune] = (byCommune[r.patients.commune] || 0) + 1;
      const y = (r.date_diagnostic || "").slice(0, 4);
      if (y) byYear[y] = (byYear[y] || 0) + 1;
      const s = r.patients?.sexe;
      if (s === "M" || s === "F") {
        bySex[s]++;
        typeBySex[r.type_cancer] ||= { M: 0, F: 0 };
        typeBySex[r.type_cancer][s]++;
      }
      if (r.stade_tnm) {
        byStage[r.stade_tnm] = (byStage[r.stade_tnm] || 0) + 1;
        stageByType[r.type_cancer] ||= {};
        stageByType[r.type_cancer][r.stade_tnm] = (stageByType[r.type_cancer][r.stade_tnm] || 0) + 1;
      }
      if (r.grade) byGrade[r.grade] = (byGrade[r.grade] || 0) + 1;
      if (r.methode_diagnostic) byMethod[r.methode_diagnostic] = (byMethod[r.methode_diagnostic] || 0) + 1;
      if (r.base_diagnostic) byBaseDiag[r.base_diagnostic] = (byBaseDiag[r.base_diagnostic] || 0) + 1;
      if (r.statut) byStatut[r.statut] = (byStatut[r.statut] || 0) + 1;
      if (r.milieu) byMilieu[r.milieu] = (byMilieu[r.milieu] || 0) + 1;
      if (r.tabagisme) byTabac[r.tabagisme] = (byTabac[r.tabagisme] || 0) + 1;
      if (r.alcool) byAlcool[r.alcool] = (byAlcool[r.alcool] || 0) + 1;
      typeByWilaya[r.type_cancer] ||= {};
      typeByWilaya[r.type_cancer][w] = (typeByWilaya[r.type_cancer][w] || 0) + 1;

      if (r.statut_vital === "decede") {
        deces++;
        decesByType[r.type_cancer] = (decesByType[r.type_cancer] || 0) + 1;
        if (r.cause_deces) causesDeces[r.cause_deces] = (causesDeces[r.cause_deces] || 0) + 1;
      } else if (r.statut_vital === "vivant") vivants++;
      else perdusVue++;

      const dn = r.patients?.date_naissance;
      if (dn && r.date_diagnostic) {
        const age = new Date(r.date_diagnostic).getFullYear() - new Date(dn).getFullYear();
        if (age > 0 && age < 110) {
          ages.push(age);
          byAgeGroup[ageGroup(age)] = (byAgeGroup[ageGroup(age)] || 0) + 1;
        }
      }
    }

    const meanAge = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : "n/a";
    const sortedAges = [...ages].sort((a, b) => a - b);
    const medianAge = sortedAges.length ? sortedAges[Math.floor(sortedAges.length / 2)].toString() : "n/a";

    // IARC quality indicators
    const mv = records.filter(r => r.base_diagnostic === "histologie" || r.methode_diagnostic === "histologie").length;
    const dco = records.filter(r => r.base_diagnostic === "dco").length;
    const stageKnown = records.filter(r => r.stade_tnm && r.stade_tnm !== "X" && r.stade_tnm !== "Inconnu").length;
    const mvPct = pct(mv, records.length);
    const dcoPct = pct(dco, records.length);
    const stagePct = pct(stageKnown, records.length);

    // Year trend
    const years = Object.keys(byYear).map(Number).sort();
    const trend = years.length >= 2
      ? `${years[0]}: ${byYear[years[0]]} → ${years[years.length - 1]}: ${byYear[years[years.length - 1]]} (${
          byYear[years[0]] ? (((byYear[years[years.length - 1]] - byYear[years[0]]) / byYear[years[0]]) * 100).toFixed(1) + "%" : "n/a"
        })`
      : "données insuffisantes";

    // Treatments
    const byTraitType: Record<string, number> = {};
    const byEfficacite: Record<string, number> = {};
    for (const t of traitements) {
      if (t.type_traitement) byTraitType[t.type_traitement] = (byTraitType[t.type_traitement] || 0) + 1;
      if (t.efficacite) byEfficacite[t.efficacite] = (byEfficacite[t.efficacite] || 0) + 1;
    }

    // Rechutes / metastases
    const byEvenement: Record<string, number> = {};
    for (const r of rechutes) {
      if (r.type_evenement) byEvenement[r.type_evenement] = (byEvenement[r.type_evenement] || 0) + 1;
    }

    // Top cancers x wilaya cross-tab (for top 5 cancers)
    const topCancers = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
    const crossTab = topCancers.map(c => {
      const w = typeByWilaya[c] || {};
      const wTop = Object.entries(w).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}=${v}`).join(", ");
      return `  • ${c}: ${wTop}`;
    }).join("\n");

    // Stage distribution for top 5 cancers
    const stageTab = topCancers.map(c => {
      const st = stageByType[c] || {};
      const stTop = Object.entries(st).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}=${v}`).join(", ");
      return `  • ${c}: ${stTop || "(non renseigné)"}`;
    }).join("\n");

    const sexRatio = bySex.F > 0 ? (bySex.M / bySex.F).toFixed(2) : "n/a";

    const snapshot = `
═══ SNAPSHOT REGISTRE DU CANCER — ALGÉRIE (${records.length} cas, généré ${new Date().toISOString().slice(0, 10)}) ═══

▌DÉMOGRAPHIE
• Effectif total : ${records.length} cas (validés=${byStatut.valide || 0}, en attente=${byStatut.en_attente || 0})
• Sexe : Hommes=${bySex.M} (${pct(bySex.M, bySex.M + bySex.F)}), Femmes=${bySex.F} (${pct(bySex.F, bySex.M + bySex.F)}), Sex-ratio M/F=${sexRatio}
• Âge au diagnostic : moyenne=${meanAge} ans, médiane=${medianAge} ans
• Groupes d'âge : ${top(byAgeGroup, 10)}
• Milieu : ${top(byMilieu)}

▌INCIDENCE & GÉOGRAPHIE
• Top 15 types de cancer : ${top(byType, 15)}
• Répartition par wilaya (top 20) : ${top(byWilaya, 20)}
• Top 15 communes : ${top(byCommune, 15)}
• Évolution annuelle : ${top(byYear, 20)}
• Tendance globale : ${trend}

▌STADE & SÉVÉRITÉ
• Stades TNM globaux : ${top(byStage)}
• Grades : ${top(byGrade)}
• Stade par top-5 cancers :
${stageTab}

▌MORTALITÉ & SUIVI
• Statut vital : Vivants=${vivants}, Décédés=${deces}, Inconnu/Perdu de vue=${perdusVue}
• Mortalité brute : ${pct(deces, records.length)}
• Décès par type : ${top(decesByType)}
• Causes de décès : ${top(causesDeces) || "non renseigné"}

▌QUALITÉ IARC
• Vérification microscopique (MV%) : ${mvPct} (cible IARC ≥ 75%)
• Cas DCO (Death Certificate Only) : ${dcoPct} (cible IARC ≤ 10%)
• Stade renseigné : ${stagePct} (cible ≥ 60%)
• Méthodes de diagnostic : ${top(byMethod)}
• Bases de diagnostic : ${top(byBaseDiag)}

▌FACTEURS DE RISQUE (déclaratifs)
• Tabagisme : ${top(byTabac)}
• Alcool : ${top(byAlcool)}

▌TRAITEMENTS (${traitements.length} enregistrés)
• Par type : ${top(byTraitType)}
• Efficacité rapportée : ${top(byEfficacite) || "non renseigné"}

▌ÉVÉNEMENTS POST-DIAGNOSTIC (${rechutes.length} enregistrés)
• ${top(byEvenement) || "aucun"}

▌CROISEMENT type × wilaya (top 5 cancers, top 5 wilayas)
${crossTab}

▌POPULATION DE RÉFÉRENCE : ${populations.length} strates âge×sexe×wilaya disponibles pour calculer les taux et ASR.
`.trim();

    const systemPrompt = `Tu es l'**Assistant Épidémiologique Senior** du Registre du Cancer d'Algérie. Tu travailles aux côtés des épidémiologistes, médecins de santé publique et chercheurs IARC. Tu réponds en français, ton scientifique mais accessible.

MISSION
1. **Répondre précisément** aux questions sur les données (incidence, mortalité, géographie, stades, qualité, tendances, croisements).
2. **Générer des hypothèses épidémiologiques** plausibles à partir des patterns observés (clusters géographiques, sur-représentation par sexe/âge, anomalies de stade ou de mortalité, retards diagnostiques).
3. **Proposer des analyses complémentaires** : calculs d'ASR, comparaisons inter-wilayas, analyses de survie Kaplan-Meier, tests de Joinpoint pour les tendances, autocorrélation spatiale de Moran si pertinent.
4. **Évaluer la qualité IARC** (MV%, DCO%, stade renseigné) et signaler les écarts vs cibles internationales.
5. **Suggérer des actions de santé publique** : campagnes de dépistage ciblées, audits de qualité, études cas-témoins, surveillance renforcée.

RÈGLES STRICTES
• Base-toi **UNIQUEMENT** sur le SNAPSHOT ci-dessous. Pas d'invention de chiffres. Si une donnée manque, dis-le et propose comment l'obtenir.
• Pour tout calcul, **montre la formule** (ex: sex-ratio = H/F = X/Y = Z).
• Structure tes réponses : **constat → interprétation → hypothèses → recommandations**.
• Cite systématiquement la source : *(Registre Cancer Algérie, ${records.length} cas)*.
• Mentionne le contexte IARC/OMS/GLOBOCAN quand pertinent (cibles de qualité, comparaisons internationales).
• **Confidentialité ANPDP** : tu n'évoques JAMAIS d'identité patient. Toutes les analyses sont agrégées.
• Sois proactif : si tu détectes un signal fort (cluster, sur-mortalité, dérive de qualité), **alerte explicitement** l'épidémiologiste.

${snapshot}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return new Response(JSON.stringify({ error: `AI error: ${r.status}`, detail: txt }), {
        status: r.status === 429 || r.status === 402 ? r.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || "(réponse vide)";
    return new Response(JSON.stringify({ reply, snapshot_size: records.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
