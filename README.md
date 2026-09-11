# AgriVoix Bénin 🌾🎙️

> **Système RAG Agricole Invariable & Restitution Vocale en Langues Locales (Fon)**
> 
> *Projet développé pour le Hackathon Indaba Bénin 2026*  
> Dépôt Git officiel : [https://github.com/Hope-land321/Hack_Indaba.git](https://github.com/Hope-land321/Hack_Indaba.git)  
> Modèle Vocal Fon : [`facebook/mms-tts-fon`](https://huggingface.co/facebook/mms-tts-fon)  
> Modèles ASR / MT : [`bivariant`](https://huggingface.co/bivariant)

---

## 📌 1. Concept et Workflow Agriculteur (Zéro Inscription)

Au Bénin, la majorité des agriculteurs ruraux s'expriment oralement dans leurs langues nationales (**Fon, Baatonou, Yoruba, Mina, Dendi**). Les fiches techniques agricoles de référence (**INRAB** - Institut National des Recherches Agricoles du Bénin & **FAO**) étant écrites et en français, l'accès à l'information est un défi majeur.

### Principes Directeurs d'AgriVoix Bénin :
1. **Sans Inscription / Zéro Formulaire** : L'agriculteur n'a pas besoin de créer un compte. Il clique sur le microphone, exprime son problème de culture à haute voix et relâche.
2. **Système RAG (Retrieval-Augmented Generation) Strict - ZÉRO Hallucination** : Le système n'invente rien. Il effectue une recherche RAG sur le corpus vectoriel des fiches techniques officielles de l'INRAB/FAO (`ca2306fr.pdf` et `ca2313fr.pdf`).
3. **Réponse Vocale Directe en Fon (`facebook/mms-tts-fon`)** : Dès que l'enregistrement se termine, le conseil agricole s'exécute et est lu **immédiatement à voix haute en langue Fon** via le modèle `facebook/mms-tts-fon`.

---

## 🛠️ 2. Architecture RAG & Pipeline Vocale

```
🎙️ Note Vocale de l'Agriculteur (Fon, Baatonou, Yoruba, Mina, Dendi, Français)
        ↓
🤖 Inférence ASR & Translation (Bivariant AI)
   - bivariant/GRIOT-ASR-W-0.8-ALL
   - bivariant/Griot-MT-1.3B-ALL
        ↓
🧠 Moteur RAG INRAB / FAO (Strict 0 Hallucination)
   - Indexation des fiches techniques ca2306fr.pdf (Ravageurs stockés) & ca2313fr.pdf (Maladies du maïs)
   - Extraction des protocoles officiels et citations verbatims
        ↓
🔊 Synthèse Vocale Fon (facebook/mms-tts-fon)
   - Génération de l'audio en Fon et lecture automatique immédiate
        ↓
📊 Structuration Automatique en Données JSON & Carte Nationale des Alertes (12 Départements)
```

---

## 🤖 3. Modèles d'Intelligence Artificielle Intégrés

| Rôle dans AgriVoix Bénin | Modèle d'IA / Source | Description |
|---|---|---|
| **Synthèse Vocale Fon (TTS)** | [`facebook/mms-tts-fon`](https://huggingface.co/facebook/mms-tts-fon) | Modèle vocal Meta MMS dédié à la langue Fon (*Fɔ̀ngbe*) pour la réponse orale directe |
| **ASR Multilingue** | [`bivariant/GRIOT-ASR-W-0.8-ALL`](https://huggingface.co/bivariant/GRIOT-ASR-W-0.8-ALL) | Transcription automatique des accents et langues béninoises |
| **Traduction Automatique** | [`bivariant/Griot-MT-1.3B-ALL`](https://huggingface.co/bivariant/Griot-MT-1.3B-ALL) | NMT texte-à-texte pour la structuration JSON |
| **Moteur RAG** | Moteur Interne INRAB/FAO | Recherche vectorielle sur `ca2306fr.pdf` et `ca2313fr.pdf` avec garanties 0 hallucination |

---

## 🌟 4. Fonctionnalités Clés du MVP

### 🎙️ 1. Enregistrement Vocal Direct sans Inscription
- Bouton unique de capture audio Web Audio API.
- Réponse vocale automatique instantanée dès la fin du message audio.

### 🛡️ 2. Moteur RAG Anti-Hallucination
- Toutes les recommandations proviennent exclusivement des protocoles homologués par l'INRAB.
- Affichage de la source exacte (ex: *INRAB / FAO 2018 - Fiche Technique ca2313fr.pdf Page 12-14*).

### 📊 3. Base de Données Structurée & Carte des 12 Départements
- Conversion automatique de la parole en format JSON standardisé.
- Visualisation interactive par département (*Alibori, Atacora, Atlantique, Borgou, Collines, Couffo, Donga, Littoral, Mono, Ouémé, Plateau, Zou*).
- Exportation des datasets aux formats JSON et CSV.

---

## 🚀 5. Installation et Lancement

```bash
git clone https://github.com/Hope-land321/Hack_Indaba.git
cd Hack_Indaba
npm install
npm run dev
```

---

## 👥 6. Développé pour le Hackathon Indaba 2026

- **GitHub :** [https://github.com/Hope-land321/Hack_Indaba.git](https://github.com/Hope-land321/Hack_Indaba.git)
- **Licence :** MIT
