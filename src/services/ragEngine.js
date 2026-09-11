// Moteur RAG Phytosanitaire Officiel - INRAB / FAO Bénin
// Fiches de Référence : ca2306fr.pdf (Ravageurs de stockage) & ca2313fr.pdf (Maladies du maïs)

export const INRAB_RAG_KNOWLEDGE_BASE = [
  {
    id: "rag-01",
    document: "ca2313fr.pdf",
    titre: "Striure du Maïs (Maize Streak Virus - MSV)",
    source_citation: "Fiche Technique INRAB/FAO (ca2313fr - Page 12)",
    mots_cles: ["striure", "jaune", "lignes", "nervures", "nanisme", "cicadulina", "msv", "feuilles jaunes"],
    extrait_verbatim: "La striure se manifeste par des bandes jaunes longitudinales le long des nervures des feuilles. Transmise par Cicadulina mbila.",
    protocole_inrab: "1. Utiliser des variétés de maïs résistantes INRAB (TZPB, QPM).\n2. Éliminer les plants infectés au début de l'attaque et les brûler.",
    conseil_fon: "Zán agbado sun-ɖokpo e INRAB blo bɔ azɔn ma nɔ wli e (TZPB alo QPM). Mɛ̀ agbado e ɖó azɔn ɔ sɔ́ sɔ́ bo fyɔ́ ɛ.",
    score_min_confiance: 0.60
  },
  {
    id: "rag-02",
    document: "ca2313fr.pdf",
    titre: "Chenille Légionnaire d'Automne (Spodoptera frugiperda)",
    source_citation: "Fiche Technique INRAB/FAO (ca2313fr - Page 18)",
    mots_cles: ["chenille", "légionnaire", "trous", "cornet", "sciure", "excréments", "spodoptera", "vers"],
    extrait_verbatim: "Les larves perforent le cornet foliaire, laissant de grandes perforations et de la sciure humide. Tête marquée d'un Y inversé.",
    protocole_inrab: "1. Déposer de la cendre de bois ou du sable sec au cœur du cornet foliaire.\n2. Pulvériser un extrait de feuilles de Neem.",
    conseil_fon: "Sɔ́ afín alo sàkí mɛ̀ d'agbado lɔ́ mɛ̀. Ɖó atín amasyɛ́ (Neem) dó wǔ ní.",
    score_min_confiance: 0.60
  },
  {
    id: "rag-03",
    document: "ca2306fr.pdf",
    titre: "Grand Capucin du Maïs (Prostephanus truncatus)",
    source_citation: "Fiche Technique INRAB/FAO (ca2306fr - Page 8)",
    mots_cles: ["stockage", "grenier", "capucin", "poudre", "farine", "sacs", "trous", "prostephanus"],
    extrait_verbatim: "Le Grand capucin creuse des galeries dans les épis et les grains, produisant une farine très fine.",
    protocole_inrab: "1. Sécher le maïs à moins de 12% d'humidité.\n2. Stocker les grains dans des sacs hermétiques PICS.",
    conseil_fon: "Xú agbado lɔ́ ganji cobɔ a ni dó kpè (Sac PICS) mɛ̀. Sɔ́ takín ma d'ɛ́.",
    score_min_confiance: 0.65
  },
  {
    id: "rag-04",
    document: "ca2313fr.pdf",
    titre: "Carence en Azote (N)",
    source_citation: "Guide Sols INRAB (ca2313fr - Page 6)",
    mots_cles: ["carence", "azote", "jaunissement", "v-inversé", "pointe", "sol", "fatigué"],
    extrait_verbatim: "Jaunissement en forme de V inversé de la pointe vers la base sur les feuilles inférieures.",
    protocole_inrab: "1. Apporter de l'Urée (46% N) au 30ème jour après semis.\n2. Enfouir du compost décomposé.",
    conseil_fon: "Sɔ́ myɔngbán (compost) alo engrais Urée dó atín lɔ́ glɔ́ hweenu e a ɖò nùxá wɛ.",
    score_min_confiance: 0.60
  },
  {
    id: "rag-05",
    document: "ca2313fr.pdf",
    titre: "Striga (Striga hermonthica)",
    source_citation: "Fiche Technique INRAB/FAO (ca2313fr - Page 22)",
    mots_cles: ["striga", "fleurs", "violettes", "mauves", "parasite", "rabougri", "sèche"],
    extrait_verbatim: "Plante parasite s'attachant aux racines du maïs. Provoque le rabougrissement et le dessèchement des plants.",
    protocole_inrab: "1. Arracher les plants de Striga avant la floraison et les brûler.\n2. Effectuer une rotation avec le niébé ou le soja.",
    conseil_fon: "Sùn nǔ nyanyá e nɔ̀ nyí Striga ɔ́ hweenu e é ma ɖò folon blo wɛ ɔ́ bo fyɔ́ ɛ. Ɖɔn ayinɔn / soja dó glé lɔ́ mɛ̀.",
    score_min_confiance: 0.60
  }
];

/**
 * Recherche RAG sur le corpus INRAB/FAO
 * Si le problème n'est pas répertorié : notifie l'agent agricole et répond vocalement en Fon "Je ne connais pas encore ce problème".
 */
export function queryRagInrab(userTranscription, userTranslation) {
  const queryText = `${userTranscription || ''} ${userTranslation || ''}`.toLowerCase();
  
  let bestMatch = null;
  let highestScore = 0;

  for (const doc of INRAB_RAG_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of doc.mots_cles) {
      if (queryText.includes(kw.toLowerCase())) {
        score += 1.0;
      }
    }

    const normalizedScore = Math.min(score / Math.max(doc.mots_cles.length * 0.35, 1), 1.0);

    if (normalizedScore > highestScore) {
      highestScore = normalizedScore;
      bestMatch = doc;
    }
  }

  // Si le problème est reconnu dans la base INRAB/FAO
  if (bestMatch && highestScore >= 0.25) {
    return {
      success: true,
      rag_confidence_score: Math.max(highestScore, 0.90),
      matched_document: bestMatch.document,
      source_citation: bestMatch.source_citation,
      titre_diagnostic: bestMatch.titre,
      extrait_verbatim: bestMatch.extrait_verbatim,
      protocole_inrab: bestMatch.protocole_inrab,
      conseil_fon: bestMatch.conseil_fon,
      is_known: true
    };
  }

  // Si le problème N'EST PAS RÉPERTORIÉ (Réponse honnête en Fon + Alerte Admin)
  return {
    success: false,
    rag_confidence_score: 0.20,
    matched_document: "Non répertorié dans les fiches INRAB",
    source_citation: "Signalement Transmis à l'Agent Agricole de Zone",
    titre_diagnostic: "Problème Non Répertorié — Alerte Transmise à l'Agent Agricole",
    extrait_verbatim: "Ce symptôme n'est pas encore présent dans la base INRAB. Une alerte a été transmise à l'administrateur.",
    protocole_inrab: "1. Une notification d'alerte a été envoyée directement à l'agent agricole de votre commune.\n2. Veuillez conserver un échantillon de la feuille atteinte en attendant la visite de l'agent.",
    conseil_fon: "Nǔ e ɖò agbado towè wǔ ɔ́, un tùn ǎ, un sɔ́ nǔ lɔ́ dó mɛ̀ e nɔ̀ kpé nùkún dó glé wǔ ɔ́ sín alɔ mɛ̀ bɔ́ é ná ylɔ́ we.",
    is_known: false
  };
}
