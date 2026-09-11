# 🏗️ Architecture Technique & Fonctionnement — AgriVoix Bénin

Ce document détaille l'architecture technique globale, les composants d'Intelligence Artificielle et le flux d'exécution pas à pas de la plateforme **AgriVoix Bénin**.

---

## 1. Vue d'Ensemble de l'Architecture Technique

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ESPACE AGRICULTEUR (FRONTEND)                           │
│  - Interface minimaliste type WhatsApp (0 Inscription / 0 Saisie de Texte)              │
│  - Bouton Micro unique + Lecture Vocale Automatique en Langue Fon                       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Enregistrement Audio (Web Audio API)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             PIPELINE IA & RECONNAISSANCE VOCALE                         │
│  1. Inférence ASR : bivariant/GRIOT-ASR-W-0.8-ALL / bivariant/asr-baatonou              │
│     ➔ Transcription brute de la parole béninoise (Fon, Baatonum, Yoruba, Mina, Dendi)   │
│  2. Inférence MT  : bivariant/Griot-MT-1.3B-ALL                                         │
│     ➔ Traduction vers le français agronomique                                           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Texte Traduit & Mots-clés Phytosanitaires
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MOTEUR RAG STRICT (0 HALLUCINATION)                             │
│  - Corpus d'Experts : ca2306fr.pdf (Ravageurs stockés) & ca2313fr.pdf (Maladies maïs)   │
│  - Recherche vectorielle / sémantique sur la base d'extraits verbatims INRAB/FAO       │
│  - Extraction du protocole de traitement homologué                                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Protocole INRAB & Conseil en Fon
                                            ▼
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│                       RESTITUTION VOCALE & STRUCTURATION AUTOMATIQUE                   │
│                                                                                        │
│ 🔊 Synthèse Vocale Fon (facebook/mms-tts-fon)   📊 Enregistrement DB Automatique        │
│ ➔ Génération & Lecture orale immédiate         ➔ Structuration JSON sans action         │
│    du conseil en Fon pour l'agriculteur           manuelle de l'agriculteur              │
│                                                ➔ Notification & Carte des 12 Départements │
│                                                   pour l'Agent Agricole / Admin        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Derrière les Coulisses : Comment Tout Se Passe Pas à Pas

### Étape 1 : Capture Audio (Côté Agriculteur)
1. L'agriculteur (peu alphabétisé) accède à la plateforme et voit uniquement un **bouton micro vert géant (Style Note Vocale WhatsApp)** avec le drapeau Fon 🇧🇯.
2. Il appuie sur le bouton pour enregistrer son problème de culture (ex: *"Agbado ché e ɖò glé mɛ̀ Dassa, ama lɔ́ blo sinmɛ̀ vɔvɔ̀..."*).
3. Dès qu'il réappuie pour arrêter, **aucune action manuelle ou validation texte n'est demandée**.

### Étape 2 : Traitement ASR & Traduction (Bivariant AI Models)
1. L'audio enregistré est transmis au modèle `bivariant/GRIOT-ASR-W-0.8-ALL` (ou `bivariant/asr-baatonou` pour le Baatonum) pour transcrire le signal audio en texte local.
2. Le modèle `bivariant/Griot-MT-1.3B-ALL` traduit ensuite cette transcription orale en français agronomique pour l'analyse NLP.

### Étape 3 : Recherche RAG Strict — Anti-Hallucination (Moteur INRAB / FAO)
1. La requête traduite interroge le moteur RAG (`src/services/ragEngine.js`).
2. Le moteur RAG effectue une recherche sémantique sur l'index des fiches techniques officielles **INRAB** (*Institut National des Recherches Agricoles du Bénin*) et **FAO** (`ca2306fr.pdf` et `ca2313fr.pdf`).
3. Il extrait **la réponse exacte et le protocole agronomique vérifié**, garantissant **0 hallucination** (pas de recommandation chimique risquée ou inventée).

### Étape 4 : Synthèse Vocale Fon Automatique (`facebook/mms-tts-fon`)
1. Le conseil agronomique en Fon est automatiquement envoyé au modèle de synthèse vocale **Meta MMS Fon** (`facebook/mms-tts-fon`).
2. L'audio généré est **joué immédiatement à voix haute** dans le haut-parleur du téléphone de l'agriculteur.
3. Des pictogrammes visuels simples accompagnent l'audio pour renforcer la compréhension.

### Étape 5 : Inscription & Structuration Automatique en Arrière-Plan (Côté Admin)
1. En arrière-plan (sans qu'aucun bouton ne gêne l'agriculteur), l'échange est **automatiquement structuré au format JSON** et enregistré dans le dataset national.
2. L'administrateur / Agent de vulgarisation agricole reçoit une alerte sur son tableau de bord :
   - Mise à jour de la **carte des alertes phytosanitaires des 12 départements du Bénin**.
   - Possibilité d'écouter l'audio original, de valider la traduction et d'exporter les données en **JSON / CSV** pour la recherche.

---

## 3. Composants Techniques Clés

- **Frontend :** React 19 + Vite + Glassmorphism Styling.
- **Audio Web API :** MediaRecorder API pour la capture du micro.
- **Modèle ASR / NMT :** `bivariant/GRIOT-ASR-W-0.8-ALL`, `bivariant/Griot-MT-1.3B-ALL`, `bivariant/asr-baatonou`.
- **Modèle TTS Fon :** `facebook/mms-tts-fon` (Hugging Face Inference API).
- **Moteur RAG :** Index sémantique sur `ca2306fr.pdf` & `ca2313fr.pdf` (INRAB/FAO 2018).
