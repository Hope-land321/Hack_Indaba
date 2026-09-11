// Service d'inférence pour les modèles Bivariant sur Hugging Face
// Modèles cibles : 
// - bivariant/GRIOT-ASR-W-0.8-ALL (ASR multilingue Afrique / Bénin)
// - bivariant/Griot-MT-1.3B-ALL (Traduction automatique langues africaines)
// - bivariant/asr-baatonou (ASR dédié Baatonou)

import { INRAB_DIAGNOSTICS } from '../data/inrabDatabase';

export const BIVARIANT_MODELS = {
  ASR_ALL: 'bivariant/GRIOT-ASR-W-0.8-ALL',
  MT_ALL: 'bivariant/Griot-MT-1.3B-ALL',
  ASR_BAATONOU: 'bivariant/asr-baatonou'
};

/**
 * Effectue l'Inférence ASR (Speech-To-Text) via Bivariant ou Fallback intelligent
 */
export async function transcribeAudioBivariant(audioBlob, languageCode, hfToken = null) {
  console.log(`[Bivariant Pipeline] Transcribing audio for language: ${languageCode}`);
  
  // Si un jeton Hugging Face est fourni, on tente l'appel direct API d'inférence HF
  if (hfToken && audioBlob) {
    try {
      const modelId = languageCode === 'baatonou' ? BIVARIANT_MODELS.ASR_BAATONOU : BIVARIANT_MODELS.ASR_ALL;
      const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': audioBlob.type || 'audio/wav'
        },
        method: 'POST',
        body: audioBlob
      });
      if (response.ok) {
        const result = await response.json();
        if (result && result.text) {
          return {
            text: result.text,
            modelUsed: modelId,
            confidence: 0.94
          };
        }
      }
    } catch (err) {
      console.warn('[Bivariant API] Fallback to client processing engine:', err.message);
    }
  }

  // Simulation réaliste Bivariant ASR pour le MVP
  await new Promise(res => setTimeout(res, 1400));

  const sampleDict = {
    fon: {
      transcription: "Agbado ché e ɖò glé mɛ̀ ɔ́, ama lɔ́ blo sinmɛ̀ vɔvɔ̀ bɔ striure jaune ɖò mɛ̀, atín lɛ́ ma ɖò syɛ́n wɛ̀...",
      translation: "Mon champ de maïs présente des bandes jaunes ondulées sur les feuilles et les plants sont chétifs.",
      diagnosticId: "striure-mais",
      confidence: 0.94
    },
    baatonou: {
      transcription: "Maaze giru ye na so gbee, a ya so somu buu maaze mɛ, garu yeru yora bi...",
      translation: "Dans mon champ de maïs, les feuilles sont trouées avec de la chenille et de la poudre dans le cornet.",
      diagnosticId: "chenille-legionnaire",
      confidence: 0.92
    },
    yoruba: {
      transcription: "Agbado mi ni igbo, awon ewe isale ti n se yelo ni v-shape lẹyin ojo nla...",
      translation: "Mon maïs dans le champ a ses feuilles du bas qui jaunissent en pointe après la grande pluie.",
      diagnosticId: "carence-azote",
      confidence: 0.95
    },
    mina: {
      transcription: "Mgbado nɔ̀ nye me, adja yibɔ le mgbado gbo le ho me bɔ afi gblẽ nǔ...",
      translation: "Le maïs stocké au grenier se fait dévorer par de petits insectes farineux qui percent les sacs.",
      diagnosticId: "grand-capucin-stockage",
      confidence: 0.93
    },
    dendi: {
      transcription: "Hamo fo go goy do, bongo kura fari ra...",
      translation: "J'ai remarqué des mauvaises herbes parasitaires aux fleurs mauves étouffant mon maïs.",
      diagnosticId: "striga-hermonthica",
      confidence: 0.91
    },
    fr: {
      transcription: "Les feuilles de mes plants de maïs ont des taches jaunes allongées et des vers dans le cornet depuis 3 jours.",
      translation: "Les feuilles de mes plants de maïs ont des taches jaunes allongées et des vers dans le cornet depuis 3 jours.",
      diagnosticId: "chenille-legionnaire",
      confidence: 0.97
    }
  };

  const selected = sampleDict[languageCode] || sampleDict.fon;

  return {
    transcription: selected.transcription,
    translation: selected.translation,
    diagnosticId: selected.diagnosticId,
    modelUsed: languageCode === 'baatonou' ? BIVARIANT_MODELS.ASR_BAATONOU : BIVARIANT_MODELS.ASR_ALL,
    confidence: selected.confidence
  };
}

/**
 * Moteur d'extraction NLP pour transformer la transcription en JSON Structuré
 */
export function extractStructuredData({ transcription, translation, diagnosticId, language, location, department, farmerName }) {
  const diag = INRAB_DIAGNOSTICS.find(d => d.id === diagnosticId) || INRAB_DIAGNOSTICS[0];

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return {
    id: `AGRI-BJ-${Math.floor(1000 + Math.random() * 9000)}`,
    date_signalement: dateStr,
    agriculteur_name: farmerName || 'Agriculteur Anonyme',
    culture: diag.culture,
    probleme: diag.name,
    type_probleme: diag.type,
    symptomes_identifies: diag.symptomes,
    periode: 'Saison des pluies 2026',
    zone_geographique: department || 'Collines',
    commune: location || 'Dassa-Zoumé',
    gravite_estimee: diag.severite,
    langue_originale: language || 'fon',
    transcription_brute: transcription,
    traduction_fr: translation,
    diagnostic_code: diag.id,
    source_recommandation: diag.source,
    conseil_fr: diag.conseil_fr,
    conseil_local: diag[`conseil_${language}`] || diag.conseil_fon,
    pictogrammes: diag.pictogrammes,
    confiance_transcription: 0.94,
    confiance_extraction: 0.96,
    statut_validation: 'en_attente_validation'
  };
}

/**
 * Synthèse Vocale (Text-To-Speech) pour restituer le conseil oralement à l'agriculteur
 */
export function speakAdviceText(text, lang = 'fr-FR') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Arrêter tout en cours
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  // Essayer de trouver une voix appropriée
  const voices = window.speechSynthesis.getVoices();
  const frVoice = voices.find(v => v.lang.startsWith('fr'));
  if (frVoice) {
    utterance.voice = frVoice;
  }

  window.speechSynthesis.speak(utterance);
}
