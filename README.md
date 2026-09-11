# AgriVoix Bénin 🌾🎙️

> **De la Parole des Agriculteurs au Conseil Agricole Accessible et aux Données Structurées**
> 
> *Projet développé pour le Hackathon Indaba Bénin 2026*
> Dépôt Git officiel : [https://github.com/Hope-land321/Hack_Indaba.git](https://github.com/Hope-land321/Hack_Indaba.git)  
> Basé sur les modèles AI : [https://huggingface.co/bivariant](https://huggingface.co/bivariant)

---

## 📌 1. Concept et Problématique

Au Bénin, l'agriculture représente **24,2 % du PIB** et emploie plus de **2,3 millions d'actifs** répartis dans environ 900 000 ménages. Le pays compte plus de 50 langues nationales pour une seule langue officielle (le français), et le taux d'alphabétisation des adultes en milieu rural reste faible (42 % à 51 %).

### Le Problème
Lorsqu'un problème survient sur une culture (jaunissement du maïs, attaque de chenilles légionnaires, ravageurs de stockage, mauvaise herbe parasitaire Striga), l'agriculteur a besoin d'une information **rapide et compréhensible**. 
Cependant, les ressources et fiches techniques agricoles officielles (ex: **INRAB** - Institut National des Recherches Agricoles du Bénin & **FAO**) sont majoritairement rédigées **en français et sous forme écrite**.

### Notre Solution : AgriVoix Bénin
AgriVoix Bénin permet à l'agriculteur d'**exprimer oralement son problème dans sa langue maternelle** (Fon, Baatonou, Yoruba, Mina, Dendi ou Français) et d'obtenir :
1. **Un conseil agricole adapté et compréhensible** restitué par **synthèse vocale (oral)** dans sa langue et sous forme de **pictogrammes visuels simples**.
2. **Une structuration automatique** de l'échange sous forme de données JSON standardisées, alimentant en temps réel une base de données nationale cartographiée pour la recherche, les ONG et les décideurs publics.

---

## 🛠️ 2. Architecture & Pipeline Technique

```
🎙️ Note vocale (Fon, Baatonou, Yoruba, Mina, Dendi, Français)
        ↓
🤖 ASR & Traduction (Modèles Hugging Face Bivariant)
   - bivariant/GRIOT-ASR-W-0.8-ALL
   - bivariant/Griot-MT-1.3B-ALL
   - bivariant/asr-baatonou
        ↓
📚 Moteur de Diagnostic & Conseils Agronomiques (Fiches Techniques INRAB / FAO 2018)
        ↓
🗣️ Restitution Vocale (Text-To-Speech) + 💡 Pictogrammes Visuels pour l'Agriculteur
        ↓
📊 Structuration Automatique en Données JSON & Export (CSV/JSON)
        ↓
🗺️ Carte Interactive des Alertes au Bénin (12 Départements) & Validation Expert
```

---

## 🌟 3. Fonctionnalités Clés du MVP

### 🎙️ 1. Interface Vocale Multilingue (Espace Agriculteur)
- **Enregistrement Audio direct** dans le navigateur (Web Audio API / MediaRecorder) ou sélection de témoignages réels.
- **Support des langues béninoises** : Fon (*Fɔ̀ngbe*), Baatonou (*Baa-to-num*), Yoruba (*Yorùbá*), Mina (*Gen-Gbe*), Dendi et Français.
- **Intégration Bivariant ASR** : Reconnaissance vocale automatique adaptée aux accents et langues d'Afrique de l'Ouest.

### 💡 2. Conseil Agricole Compréhensible & Restitution Vocale
- **Diagnostics basés sur la recherche béninoise** : Fiches techniques officielles INRAB/FAO (`ca2306fr.pdf` et `ca2313fr.pdf`).
- **Restitution Vocale (Text-To-Speech)** : L'agriculteur peu ou pas alphabétisé clique sur un bouton et **écoute** le traitement recommandé dans sa langue.
- **Mode Pictogrammes** : Instructions étape par étape (Lutte biologique, cendre/sable, rotation de culture, sacs hermétiques PICS).

### 📊 3. Structuration de Données JSON & Carte Nationale (12 Départements)
- Conversion automatique de la parole brute en schéma JSON enrichi :
  ```json
  {
    "id": "AGRI-BJ-8492",
    "date_signalement": "2026-09-11",
    "agriculteur_name": "Koffi Sèmèvo",
    "culture": "Maïs",
    "probleme": "Striure du Maïs (Maize Streak Virus)",
    "type_probleme": "Maladie virale",
    "zone_geographique": "Collines",
    "commune": "Dassa-Zoumé",
    "gravite_estimee": "Forte",
    "langue_originale": "fon",
    "transcription_brute": "Agbado ché e ɖò glé mɛ̀ Dassa ɔ́, ama lɔ́ blo sinmɛ̀ vɔvɔ̀...",
    "traduction_fr": "Mon champ de maïs à Dassa-Zoumé a des feuilles jaunes...",
    "conseil_fr": "Utiliser des variétés de maïs résistantes INRAB (TZPB, QPM)...",
    "confiance_transcription": 0.94
  }
  ```
- **Carte SVG du Bénin** : Visualisation géolocalisée des alertes par département (*Alibori, Atacora, Atlantique, Borgou, Collines, Couffo, Donga, Littoral, Mono, Ouémé, Plateau, Zou*).
- **Exports Data** : Téléchargement du dataset au format JSON et CSV.

### 🛡️ 4. Boucle de Validation par les Agents Agricoles (Human-in-the-Loop)
- Module dédié aux agents de vulgarisation agricole pour écouter l'audio original, vérifier les transcriptions Bivariant, valider les diagnostics et enrichir continuellement le corpus linguistique béninois.

---

## 🤖 4. Intégration des Modèles Hugging Face Bivariant

Notre solution s'appuie directement sur les travaux de l'organisation **Bivariant** ([huggingface.co/bivariant](https://huggingface.co/bivariant)) spécialisée dans l'IA pour les langues africaines :

| Modèle Hugging Face | Rôle dans AgriVoix Bénin |
|---|---|
| [`bivariant/GRIOT-ASR-W-0.8-ALL`](https://huggingface.co/bivariant/GRIOT-ASR-W-0.8-ALL) | Inférence ASR multilingue pour transcrire l'audio des agriculteurs |
| [`bivariant/Griot-MT-1.3B-ALL`](https://huggingface.co/bivariant/Griot-MT-1.3B-ALL) | Traduction automatique texte-à-texte langues africaines → français |
| [`bivariant/asr-baatonou`](https://huggingface.co/bivariant/asr-baatonou) | Inférence ASR spécialisée pour la langue Baatonou (Nord Bénin) |

---

## 🚀 5. Installation et Démarrage Rapide

### Prérequis
- **Node.js** v18+ 
- **npm** v9+

### Lancement en mode Développement
```bash
# Clonez le dépôt GitHub
git clone https://github.com/Hope-land321/Hack_Indaba.git
cd Hack_Indaba

# Installez les dépendances
npm install

# Lancez le serveur de développement Vite
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

### Build de Production
```bash
npm run build
npm run preview
```

---

## 📄 6. Sources et Références Agronomiques

- **INRAB (Institut National des Recherches Agricoles du Bénin)** : *Reconnaissance des maladies du maïs en culture au Bénin et méthodes de lutte*, Fiche Technique FAO, Cotonou, 2018 (Dr. Sikirou Rachidatou et al.).
- **INRAB / FAO** : *Reconnaissance des ravageurs du maïs en stockage au Bénin et méthodes de lutte*, Fiche Technique FAO, Cotonou, 2018.
- **Direction Générale du Trésor français** : *Bénin — Agriculture et politique agricole*, 2025.
- **ARCEP Bénin & GSMA** : *Rapports de couverture mobile 4G et pénétration mobile money au Bénin*.

---

## 👥 7. Équipe & Hackathon

**Hackathon Indaba Bénin 2026**  
Dépôt GitHub : [https://github.com/Hope-land321/Hack_Indaba.git](https://github.com/Hope-land321/Hack_Indaba.git)  
Licence : MIT
