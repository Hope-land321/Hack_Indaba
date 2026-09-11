# Documentation du projet
## De la parole des agriculteurs aux données structurées
**Hackathon — Bénin**

---

## 1. Résumé exécutif

Au Bénin, une grande partie de l'information de terrain agricole (maladies, ravageurs, aléas climatiques) reste orale, faute d'un moyen simple de la transformer en données exploitables. Ce projet propose un système qui transforme automatiquement une note vocale d'agriculteur en données structurées, exploitables par les agents agricoles, ONG, coopératives et chercheurs.

**Pipeline du MVP :**

```
🎙️ Note vocale (français / langue locale)
        ↓
📝 Transcription automatique
        ↓
🧠 Extraction d'informations (NLP)
        ↓
📊 Données structurées (JSON)
        ↓
📈 Agrégation en dataset exploitable
```

Le projet ne se limite pas à traiter une note vocale isolée : chaque témoignage accumulé alimente un **dataset agricole béninois** qui n'existe pas aujourd'hui, et qui permet de détecter des tendances, cibler l'aide et informer les politiques publiques.

---

## 2. Contexte

L'agriculture représente **24,2 % du PIB du Bénin (2024)** et emploie **2,3 millions d'actifs (35 % de la population active)**, répartis dans environ 900 000 ménages. Le pays compte plus de 50 langues nationales pour une seule langue officielle (le français), et le taux d'alphabétisation des adultes reste faible (42-51 % selon les sources). À l'inverse, la couverture mobile progresse vite : 88 % du territoire est couvert en 4G, dont 63 % des zones rurales, et le mobile money atteint 89 % de pénétration.

**Constat :** le canal de communication le plus accessible pour un agriculteur béninois est la voix, pas l'écrit — mais les systèmes numériques actuels sont presque tous conçus pour ingérer du texte structuré.

| Indicateur | Valeur |
|---|---|
| Part de l'agriculture dans le PIB | 24,2 % |
| Actifs agricoles | 2,3 M (35 % pop. active) |
| Ménages agricoles | ~900 000 |
| Langues nationales | > 50 |
| Alphabétisation adultes | 42-51 % |
| Couverture 4G (rural) | 63 % |
| Pénétration mobile money | 89 % |

---

## 3. Problématique

> Une grande partie de la connaissance de terrain agricole au Bénin existe uniquement sous forme orale et se perd, faute d'un moyen simple de la transformer en données exploitables par les structures d'accompagnement.

**Question du projet :** comment permettre à un agriculteur de transformer rapidement un témoignage vocal en données structurées et exploitables, sans compétence technique ni saisie manuelle ?

---

## 4. Objectifs du MVP

1. Capturer une note vocale (upload ou enregistrement direct).
2. Transcrire la parole en texte.
3. Extraire automatiquement les informations agricoles clés via NLP.
4. Structurer ces informations selon un schéma de données prédéfini.
5. Agréger plusieurs témoignages dans un mini tableau de bord.
6. Mesurer la qualité du pipeline (transcription, extraction, temps gagné).

**Hors périmètre du MVP (assumé et annoncé) :**
- Couverture exhaustive des 50+ langues béninoises (le MVP couvre le français et/ou une langue locale ciblée).
- Génération de conseils personnalisés à l'agriculteur.
- Analyse d'image des cultures.
- Fonctionnement hors ligne.

---

## 5. Solution proposée

### 5.1 Pipeline fonctionnel

L'agriculteur envoie une note vocale (type message WhatsApp). Le système :

1. **Transcrit** la parole en texte.
2. **Extrait** les informations importantes (culture, problème, période, zone...).
3. **Structure** ces informations dans un format standardisé.
4. **Ajoute** l'entrée à un dataset consultable par les professionnels.

### 5.2 Exemple concret

Note vocale reçue :
> *"Cette semaine mes plants de maïs ont commencé à jaunir après les dernières pluies..."*

Donnée structurée produite :
```json
{
  "culture": "maïs",
  "probleme": "jaunissement",
  "periode": "après fortes pluies",
  "zone": null
}
```

### 5.3 Architecture technique

| Étape | Outil recommandé | Justification |
|---|---|---|
| Transcription (ASR) | Whisper (OpenAI) | Robuste sur le français oral avec accent ; pas d'entraînement nécessaire |
| Extraction NLP | LLM (Claude, GPT) guidé par un prompt avec schéma cible | Plus réaliste en 24h qu'un modèle NER entraîné from scratch |
| Stockage | Base légère (SQLite / Airtable / JSON) | Suffisant pour un MVP de démonstration |
| Restitution | Interface web simple | Tableau + agrégation par culture/zone/problème |

### 5.4 Points de vigilance techniques

- Qualité audio variable (bruit ambiant, réseau) → prévoir un pré-traitement audio basique.
- Vocabulaire agricole local mal reconnu par les LLM généralistes → constituer un petit lexique de correction.
- Langage oral spontané (hésitations, répétitions) → le prompt d'extraction doit être tolérant à un texte imparfait.

---

## 6. Schéma de données

```json
{
  "id": "uuid",
  "date_signalement": "2026-09-11",
  "agriculteur_id": null,
  "culture": "maïs",
  "probleme": "jaunissement des feuilles",
  "type_probleme": "maladie | ravageur | climat | sol | autre",
  "periode": "après fortes pluies",
  "zone_geographique": null,
  "commune": null,
  "gravite_estimee": "faible | moyenne | forte",
  "langue_originale": "français / fon / yoruba...",
  "transcription_brute": "texte transcrit complet",
  "confiance_transcription": 0.0,
  "confiance_extraction": 0.0
}
```

Ce schéma est extensible (20 à 50 catégories possibles selon la culture ciblée) : stade de croissance, quantité de pluie perçue, besoin en intrants, ravageurs spécifiques, etc.

---

## 7. Utilité du dataset généré

Le projet ne se limite pas à une démonstration technique : chaque note vocale traitée enrichit un dataset qui prend de la valeur avec l'échelle.

| Acteur | Utilité |
|---|---|
| **Agent agricole / vulgarisateur** | Réagir plus vite en repérant des signalements groupés dans une zone |
| **ONG / coopérative** | Cibler l'aide (semences, intrants) là où le besoin est démontré par les données, pas supposé |
| **Chercheur** | Étudier la saisonnalité des maladies, la propagation géographique, l'effet du climat sur les cultures |
| **Décideur public** | Justifier des politiques agricoles sur des preuves de terrain réelles |
| **Recherche NLP** | Constituer un corpus linguistique agricole en langues béninoises, quasi inexistant aujourd'hui |

**Message clé :** individuellement, chaque note vocale aide un agriculteur à faire remonter une information. Collectivement, elle nourrit un dataset qui permet de voir des tendances qu'aucun acteur ne pouvait observer avant.

---

## 8. Utilisateurs cibles

| Utilisateur | Besoin couvert |
|---|---|
| Agriculteur | Signaler un problème sans écrire |
| Agent agricole | Centraliser les remontées de terrain sans ressaisie manuelle |
| Coopérative / ONG | Avoir une vue agrégée des alertes par zone et culture |
| Chercheur / décideur public | Disposer de données quantifiables sur les problématiques agricoles |

---

## 9. Indicateurs de succès

| Indicateur | Mode de mesure |
|---|---|
| Qualité de transcription | Comparaison manuelle sur un échantillon de notes vocales test |
| Précision de l'extraction | % de champs correctement remplis vs vérité terrain |
| Compréhension des termes locaux | Taux de reconnaissance du vocabulaire agricole spécifique |
| Temps gagné | Temps de saisie manuelle vs pipeline automatisé |
| Utilisabilité | Nombre d'étapes nécessaires pour un utilisateur non technique |

---

## 10. Limites assumées du MVP

- Couverture linguistique restreinte (français et/ou une langue locale ciblée, pas les 50+ langues du pays).
- Pas de fonctionnement hors ligne.
- Jeu de test limité (échantillon constitué par l'équipe, pas un dataset existant).
- Pas de boucle de retour vers l'agriculteur dans cette version (voir perspectives ci-dessous).

---

## 11. Perspectives futures

Deux extensions naturelles n'ont pas été développées dans le MVP, faute de temps, mais structurent la suite du projet :

### 11.1 Conseils personnalisés à l'agriculteur

Une fois le problème identifié et structuré, le système pourrait renvoyer un conseil pratique à l'agriculteur (ex. : traitement recommandé, bonnes pratiques), fermant ainsi la boucle entre collecte de données et bénéfice direct pour l'utilisateur. Cela renforcerait aussi l'incitation à utiliser régulièrement l'outil.

### 11.2 Diagnostic par image

L'agriculteur pourrait fournir une photo de sa culture en complément de la note vocale. Un modèle de vision analyserait l'image pour affiner le diagnostic (ex. : distinguer une carence en azote d'une maladie fongique) et enrichir la donnée structurée avec un champ `diagnostic_visuel`.

```
🎙️ Note vocale → 📝 Transcription → 🧠 Extraction → 📊 Données structurées
                                                              ↓
                                          📷 (futur) Photo de la culture
                                                              ↓
                                          🧠 (futur) Analyse visuelle
                                                              ↓
                                          💡 (futur) Conseil personnalisé
```

Ces deux briques sont volontairement écartées du périmètre actuel : elles demandent un second pipeline (vision), un second prompt à calibrer, et une prudence particulière car un conseil erroné a des conséquences réelles sur la récolte. Elles constituent la feuille de route naturelle du projet au-delà du hackathon.

---

## 12. Conclusion

Ce projet ne cherche pas à traduire une langue béninoise, mais à transformer la connaissance orale du terrain agricole en données exploitables. Le MVP, volontairement circonscrit à la transcription, l'extraction et la structuration, démontre la faisabilité technique du concept tout en posant les bases d'une infrastructure de données qui peut grandir bien au-delà du hackathon — vers le conseil personnalisé, le diagnostic par image, et plus largement vers d'autres domaines (santé, administration) où l'oral reste le principal frein à la numérisation de l'information de terrain.

---

## 13. Sources

- Direction générale du Trésor français, *Bénin — Agriculture et politique agricole*, novembre 2025
- Banque mondiale, *Vue d'ensemble Bénin* (data360.worldbank.org)
- Réseau FAR, *Fiche pays Bénin — Formation agricole et rurale*, novembre 2024
- ARCEP Bénin, rapport d'activités 2023 ; tableau de bord Internet
- GSMA, données de couverture mobile Bénin 2020–2024
- INSAE / PNUD, données démographiques et linguistiques du Bénin
