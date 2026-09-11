// Base de connaissances et d'échantillons agricoles issus des fiches INRAB & FAO (Bénin)
// Fiches de référence : ca2306fr.pdf (Ravageurs stockés) et ca2313fr.pdf (Maladies du maïs en culture)

export const BENIN_DEPARTMENTS = [
  { id: 'alibori', name: 'Alibori', chefLieu: 'Kandi', region: 'Nord', color: '#10b981' },
  { id: 'atacora', name: 'Atacora', chefLieu: 'Natitingou', region: 'Nord-Ouest', color: '#059669' },
  { id: 'atlantique', name: 'Atlantique', chefLieu: 'Allada', region: 'Sud', color: '#34d399' },
  { id: 'borgou', name: 'Borgou', chefLieu: 'Parakou', region: 'Nord-Est', color: '#16a34a' },
  { id: 'collines', name: 'Collines', chefLieu: 'Dassa-Zoumé', region: 'Centre', color: '#84cc16' },
  { id: 'couffo', name: 'Couffo', chefLieu: 'Dogbo', region: 'Sud-Ouest', color: '#65a30d' },
  { id: 'donga', name: 'Donga', chefLieu: 'Djougou', region: 'Nord-Ouest', color: '#22c55e' },
  { id: 'littoral', name: 'Littoral', chefLieu: 'Cotonou', region: 'Sud', color: '#15803d' },
  { id: 'mono', name: 'Mono', chefLieu: 'Lokossa', region: 'Sud-Ouest', color: '#4adede' },
  { id: 'oueme', name: 'Ouémé', chefLieu: 'Porto-Novo', region: 'Sud-Est', color: '#0ea5e9' },
  { id: 'plateau', name: 'Plateau', chefLieu: 'Pobè', region: 'Sud-Est', color: '#0284c7' },
  { id: 'zou', name: 'Zou', chefLieu: 'Abomey', region: 'Centre', color: '#eab308' }
];

export const BENIN_LANGUAGES = [
  { code: 'fon', name: 'Fon (Fɔ̀ngbe)', speakers: '1.7M', flag: '🇧🇯', sampleGreeting: 'Afo té wɛ̀?' },
  { code: 'baatonou', name: 'Baatonou (Baa-to-num)', speakers: '900K', flag: '🇧🇯', sampleGreeting: 'Gawani!' },
  { code: 'yoruba', name: 'Yoruba (Yorùbá)', speakers: '1.2M', flag: '🇧🇯', sampleGreeting: 'E kaaro!' },
  { code: 'mina', name: 'Mina (Gen-Gbe)', speakers: '500K', flag: '🇧🇯', sampleGreeting: 'Ndi lɔo!' },
  { code: 'dendi', name: 'Dendi', speakers: '250K', flag: '🇧🇯', sampleGreeting: 'Ay comi!' },
  { code: 'fr', name: 'Français (Bénin)', speakers: 'Officiel', flag: '🇫🇷', sampleGreeting: 'Bonjour!' }
];

// Catalogue des problèmes phytosanitaires INRAB / FAO
export const INRAB_DIAGNOSTICS = [
  {
    id: "striure-mais",
    name: "Striure du Maïs (Maize Streak Virus - MSV)",
    culture: "Maïs",
    type: "Maladie virale",
    vecteur: "Cigale du maïs (Cicadulina mbila)",
    symptomes: "Lignes ou striures jaunes longitudinales continues le long des nervures des feuilles. Nanisme si attaque précoce.",
    severite: "Forte",
    source: "Fiche Technique INRAB/FAO 2018 (ca2313fr.pdf)",
    conseil_fr: "Utiliser des variétés de maïs résistantes développées par l'INRAB (ex: TZPB, QPM, DMR-ESR). Éliminer les plants infectés au début de l'attaque et détruire les repousses.",
    conseil_fon: "Zán agbado sun-ɖokpo e INRAB blo bɔ azɔn ma nɔ wli e (TZPB alo QPM). Mɛ̀ agbado e ɖó azɔn ɔ sɔ́ sɔ́ bo fyɔ́ ɛ.",
    conseil_baatonou: "Baa dere giru ka maaze gbee ye INRAB daa (TZPB). Ye a wa ga daa a sun so maaze wi.",
    conseil_yoruba: "Alo agbado to ni agbara lati gegbon aisan (variétés résistantes INRAB). Yo agbado to ban je kuro ki o sun un.",
    pictogrammes: ["🌱 Seed resistance", "🔥 Burn infected plants", "🚫 No chemical overkill"]
  },
  {
    id: "chenille-legionnaire",
    name: "Chenille Légionnaire d'Automne (Spodoptera frugiperda)",
    culture: "Maïs",
    type: "Ravageur des cultures",
    vecteur: "Larve de papillon nocturne",
    symptomes: "Trous irréguliers dans le cornet des feuilles, présence de sciure (excréments) humide et chenilles à tête marquée d'un Y inversé.",
    severite: "Très Forte",
    source: "Fiche Technique INRAB/FAO (INRAB Bénin)",
    conseil_fr: "Appliquer du sable sec ou de la cendre de bois au cœur du cornet des jeunes plants. En cas de forte attaque, pulvériser un insecticide biologique à base de Bacillus thuringiensis ou d'huile de Neem.",
    conseil_fon: "Sɔ́ afín alo sàkí mɛ̀ d'agbado lɔ́ mɛ̀. Ɖó atín amasyɛ́ (Neem) dó wǔ ní.",
    conseil_baatonou: "A ya somu bee dondo so maaze gbee garu mɛ. A sun bii Neem bi.",
    conseil_yoruba: "Fi labulabu eeru si inu agbado naa. Fi ewe Neem fún awon obikun.",
    pictogrammes: ["🪨 Ash/Sand in whorl", "🌿 Neem Leaf extract", "🐛 Manual collection"]
  },
  {
    id: "grand-capucin-stockage",
    name: "Grand Capucin du Maïs (Prostephanus truncatus)",
    culture: "Maïs (Stocké)",
    type: "Ravageur de stockage",
    vecteur: "Insecte coléoptère",
    symptomes: "Grains réduits en poudre farineuse très fine, trous nets dans les épis et les sacs de stockage.",
    severite: "Forte",
    source: "Fiche Technique INRAB/FAO 2018 (ca2306fr.pdf)",
    conseil_fr: "Bien sécher le maïs à moins de 12% d'humidité. Utiliser des tentes PICS (sacs hermétiques) ou traiter les grains avec de la poudre d'huile de neem/piment avant l'engrangement.",
    conseil_fon: "Xú agbado lɔ́ ganji cobɔ a ni dó kpè (Sac PICS) mɛ̀. Sɔ́ takín ma d'ɛ́.",
    conseil_baatonou: "A ya maaze wi kuawa a ma so sac PICS mɛ. A daa nira fine.",
    conseil_yoruba: "Gbe agbado naa daadaa ko to fi si apo PICS. Fi ata gbigbe tabi neem si i.",
    pictogrammes: ["☀️ High sun drying", "🛍️ PICS Hermetic bag", "🌶️ Pepper powder mix"]
  },
  {
    id: "carence-azote",
    name: "Carence en Azote (N)",
    culture: "Maïs",
    type: "Problème de sol / Nutrition",
    vecteur: "Épuisement du sol / Pluies lessivantes",
    symptomes: "Jaunissement caractéristique en forme de V inversé partant de la pointe des feuilles inférieures vers la nervure centrale.",
    severite: "Moyenne",
    source: "Guide Sol INRAB Bénin",
    conseil_fr: "Apporter de l'Urée (46% N) en enfouissement léger au moment du sarclage (30 jours après semis) ou incorporer du fumier bien décomposé / compost.",
    conseil_fon: "Sɔ́ myɔngbán (compost) alo engrais Urée dó atín lɔ́ glɔ́ hweenu e a ɖò nùxá wɛ.",
    conseil_baatonou: "A so fumiere ka engrais Urée so maaze ma.",
    conseil_yoruba: "Fi fumiere tabi engrais Urée si idi agbado ni ojo ogbon lẹyin gbingbin.",
    pictogrammes: ["💩 Compost / Manure", "🧪 Urea application", "🌱 Weed removal"]
  },
  {
    id: "striga-hermonthica",
    name: "Striga (Striga hermonthica - Plante parasite)",
    culture: "Maïs / Sorgho",
    type: "Plante parasite",
    vecteur: "Graines dans le sol",
    symptomes: "Petites fleurs roses/violettes au pied du maïs. Maïs rabougri, feuilles flétries comme en période de sécheresse.",
    severite: "Forte",
    source: "Fiche Technique INRAB/FAO (ca2313fr.pdf)",
    conseil_fr: "Arracher les plants de Striga avant la floraison et les brûler. Pratiquer la rotation avec le niébé ou le soja qui provoquent la germination suicide du Striga.",
    conseil_fon: "Sùn nǔ nyanyá e nɔ̀ nyí Striga ɔ́ hweenu e é ma ɖò folon blo wɛ ɔ́ bo fyɔ́ ɛ. Ɖɔn ayinɔn / soja dó glé lɔ́ mɛ̀.",
    conseil_baatonou: "A ya Striga wi yora gbee a ma bo bi. A ya niébé so garu mɛ.",
    conseil_yoruba: "Fa ewure Striga yii kuro ki o to tan ewe, sise yii. Gbin ewe eree tabi soja lẹyin naa.",
    pictogrammes: ["✋ Pull by hand early", "🔥 Burn before seeds", "🔄 Crop rotation (Cowpea)"]
  }
];

// Échantillons de notes vocales pré-enregistrées
export const SAMPLE_AUDIO_NOTES = [
  {
    id: "sample-01",
    farmerName: "Koffi Sèmèvo",
    location: "Dassa-Zoumé",
    department: "Collines",
    language: "fon",
    langLabel: "Fon (Fɔ̀ngbe)",
    audioDuration: "00:18",
    audioUrl: null,
    transcription_brute: "Agbado ché e ɖò glé mɛ̀ Dassa ɔ́, ama lɔ́ blo sinmɛ̀ vɔvɔ̀ bɔ striure jaune ɖò mɛ̀, atín lɛ́ ma ɖò syɛ́n wɛ̀...",
    traduction_fr: "Mon champ de maïs à Dassa-Zoumé a des feuilles avec des lignes jaunes longitudinales et les plants ne grandissent plus bien...",
    diagnostic_matched: "striure-mais",
    date: "11 Septembre 2026",
    status: "transcribed_and_structured",
    confidence: 0.94
  },
  {
    id: "sample-02",
    farmerName: "Gounou Bio",
    location: "Bembèrèkè",
    department: "Borgou",
    language: "baatonou",
    langLabel: "Baatonou",
    audioDuration: "00:22",
    audioUrl: null,
    transcription_brute: "Maaze giru ye na so Bembèrèkè gbee, gbee garu yeru yora bi, a ya so somu buu maaze mɛ...",
    traduction_fr: "Dans mon champ de maïs vers Bembèrèkè, les feuilles ont des trous et il y a de la poudre et des chenilles dans le cornet...",
    diagnostic_matched: "chenille-legionnaire",
    date: "11 Septembre 2026",
    status: "transcribed_and_structured",
    confidence: 0.92
  },
  {
    id: "sample-03",
    farmerName: "Bio Sabi",
    location: "Kandi",
    department: "Alibori",
    language: "baatonou",
    langLabel: "Baatonou",
    audioDuration: "00:15",
    audioUrl: null,
    transcription_brute: "Agbado ye ma daa agbano mɛ Kandi gbee, a nira fine bi, somu wura daa a mɛ...",
    traduction_fr: "Le maïs stocké au magasin à Kandi est devenu de la farine avec de petits trous partout dans les sacs...",
    diagnostic_matched: "grand-capucin-stockage",
    date: "10 Septembre 2026",
    status: "transcribed_and_structured",
    confidence: 0.96
  },
  {
    id: "sample-04",
    farmerName: "Ayaba Adadjè",
    location: "Pobè",
    department: "Plateau",
    language: "yoruba",
    langLabel: "Yoruba",
    audioDuration: "00:19",
    audioUrl: null,
    transcription_brute: "Agbado mi ni Pobè, awon ewe isale ti n se yelo ni w-shape, e kosi nkan ti a fi si i...",
    traduction_fr: "Mon maïs à Pobè a les feuilles du bas qui jaunissent en forme de V depuis les pluies, la terre semble fatiguée...",
    diagnostic_matched: "carence-azote",
    date: "11 Septembre 2026",
    status: "transcribed_and_structured",
    confidence: 0.95
  },
  {
    id: "sample-05",
    farmerName: "Marius Houndékon",
    location: "Allada",
    department: "Atlantique",
    language: "fr",
    langLabel: "Français (Bénin)",
    audioDuration: "00:24",
    audioUrl: null,
    transcription_brute: "Bonjour l'agent agricole, j'ai remarqué dans mon champ à Allada de petites fleurs violettes au pied du maïs et le maïs sèche sur place...",
    traduction_fr: "Bonjour l'agent agricole, j'ai remarqué dans mon champ à Allada de petites fleurs violettes au pied du maïs et le maïs sèche sur place...",
    diagnostic_matched: "striga-hermonthica",
    date: "09 Septembre 2026",
    status: "transcribed_and_structured",
    confidence: 0.98
  }
];
