# 📊 Fiche de Présentation — AgriVoix Bénin

**Hackathon Indaba Bénin 2026**  
**Sujet :** De la parole des agriculteurs aux conseils agricoles accessibles et aux données structurées  
**Dépôt GitHub :** [https://github.com/Hope-land321/Hack_Indaba.git](https://github.com/Hope-land321/Hack_Indaba.git)  
**Modèles AI Utilisés :** [https://huggingface.co/bivariant](https://huggingface.co/bivariant)

---

## 💡 Executive Summary

Au Bénin, la majorité des agriculteurs ruraux communiquent oralement dans leurs langues locales (Fon, Baatonou, Yoruba, Mina, Dendi). Lorsqu'une maladie ou un ravageur frappe leurs champs, l'accès au conseil agricole est bloqué par la barrière de la langue et de l'écrit (fiches INRAB/FAO rédigées en français).

**AgriVoix Bénin** résout ce problème à deux niveaux :
1. **Bénéfice immédiat pour l'agriculteur** : Il s'exprime par la voix dans sa langue. Le système (boosté par les modèles ASR/MT Bivariant) identifie le diagnostic selon les fiches INRAB/FAO et lui renvoie un **conseil agronomique oral (synthèse vocale) et visuel (pictogrammes)**.
2. **Bénéfice collectif pour le secteur agricole** : Chaque note vocale est automatiquement traduite et structurée en **données JSON**. Ces données alimentent une carte nationale des alertes (12 départements) consultable par les agents agricoles, les ONG et les chercheurs.

---

## 🎯 Alignement Strict avec la Problématique Indaba

| Exigence du Hackathon | Réponse apportée par AgriVoix Bénin |
|---|---|
| **Utilisateur Cible** | Agriculteur peu alphabétisé, locuteur d'une langue locale béninoise |
| **Canal d'Entrée** | Note vocale orale (Enregistrement micro Web Audio API / fichiers audio) |
| **Langues Couvertes** | Fon (Fɔ̀ngbe), Baatonum, Yorùbá, Gen-Gbe (Mina), Dendi, Français |
| **Inférence IA** | Intégration des modèles Hugging Face `bivariant/GRIOT-ASR-W-0.8-ALL`, `bivariant/Griot-MT-1.3B-ALL` et `bivariant/asr-baatonou` |
| **Conseil Agronomique** | Diagnostic & Solutions basés sur les fiches techniques INRAB / FAO 2018 |
| **Restitution Accessibles** | Synthèse Vocale (Text-To-Speech) + Mode Pictogrammes pour non-alphabétisés |
| **Enrichissement DB** | Generateur de Schéma JSON standardisé + Export CSV & JSON + Carte des 12 Départements |
| **Boucle de Validation** | Module Expert pour agents de vulgarisation agricole afin de valider et enrichir le corpus |

---

## 📈 Impact et Projections

- **Gain de Temps** : Diagnostic immédiat en moins de 5 secondes au lieu de plusieurs jours d'attente d'un agent de terrain.
- **Réduction des Pertes** : Prévention rapide contre la chenille légionnaire (*Spodoptera frugiperda*) et le Grand Capucin du maïs (*Prostephanus truncatus*).
- **Inclusion Numérique** : Zéro barrière liée à l'alphabétisation ou à la langue officielle.
- **Valorisation des Langues Locales** : Constitution continue d'un jeu de données vocal-texte béninois pour la recherche en NLP africain.

---

## 🚀 Équipe & Code Source

- **Dépôt GitHub :** [Hope-land321/Hack_Indaba](https://github.com/Hope-land321/Hack_Indaba.git)
- **Technologies :** React, Vite, Bivariant Hugging Face Inference API, Web Audio API, Web Speech Synthesis API.
