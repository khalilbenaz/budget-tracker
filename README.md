# Budget Tracker

Application web de suivi de budget personnel, entièrement en français, construite avec React 18, TypeScript et Tailwind CSS v3.

## Fonctionnalités

- **Ajout de transaction** : libellé, montant, type (Revenu / Dépense), catégorie (Alimentation, Transport, Logement, Loisirs, Santé, Salaire, Autre), date.
- **Liste des transactions** triées par date décroissante avec suppression individuelle et badge couleur par type (vert = revenu, rouge = dépense).
- **Cartes résumé** : total Revenus (vert), total Dépenses (rouge), Solde net — montants formatés en euros (Intl.NumberFormat `fr-FR`).
- **Filtre par mois** via un sélecteur dans l'en-tête.
- **Graphique donut SVG inline** + barres horizontales : répartition des dépenses par catégorie avec pourcentages.
- **Export CSV** (bouton dans l'en-tête, génère et télécharge `transactions.csv` avec séparateur `;` et BOM UTF-8).
- **Persistance localStorage** ; données d'exemple pré-chargées si aucune transaction sauvegardée.
- **UI responsive** (mobile-first) avec accents emerald/rose, police Inter, fond clair épuré.

## Installation et développement

```bash
npm install
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

## Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

## Déploiement sur Cloudflare Pages

```bash
npm run deploy
```

Cette commande enchaîne `npm run build` puis déploie automatiquement le dossier `dist/` via Wrangler sur le projet Cloudflare Pages `budget-tracker`.

Prérequis : être authentifié avec `npx wrangler login`.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework UI | React 18 |
| Langage | TypeScript 5 (strict) |
| Bundler | Vite 5 |
| Styles | Tailwind CSS v3 |
| Graphiques | SVG inline (aucune dépendance) |
| Persistance | localStorage |
| Déploiement | Cloudflare Pages (Wrangler) |

## Licence

MIT — voir le fichier [LICENSE](./LICENSE).
