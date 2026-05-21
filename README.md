# Tlemcen Cancer Watch

Plateforme web dédiée au registre du cancer de la wilaya de Tlemcen. L'application regroupe la saisie, l'analyse, la cartographie et le suivi des cas pour faciliter le travail du registre et la production de rapports.

## Fonctionnalités

- Gestion des fiches patients et des cas.
- Tableau de bord de suivi et de statistiques.
- Cartographie et visualisation des hotspots.
- Export, reporting et contrôles de qualité des données.
- Outils d'assistance pour l'équipe du registre.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

## Démarrage

```sh
npm install
npm run dev
```

## Scripts

```sh
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Structure

- `src/pages` contient les écrans principaux.
- `src/components` regroupe les composants réutilisables.
- `src/lib` contient la logique métier et les utilitaires.
- `supabase` contient les fonctions et migrations côté backend.

## Déploiement

Avant la mise en production, lancer un build puis vérifier le rendu final avec `npm run build` et `npm run preview`.

## Notes

Le projet est maintenu localement dans ce dépôt et les contenus d'interface, de métadonnées et de documentation ont été adaptés à l'identité du projet.
