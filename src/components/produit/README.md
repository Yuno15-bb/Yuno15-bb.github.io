# Page produit — le format de référence

Validé par Dylan le 25/09/2026 sur la page GreyMatter : « ce format est absolument incroyable, on
garde absolument et on enregistre pour les prochaines ». Toute nouvelle page de projet se fait
avec ces briques. Exemple complet : `src/content/projects/fr/c-brain.mdx` (et `en/`).

## Passer une page au format

Dans l'en-tête du MDX :

```yaml
gabarit: produit   # sans ce champ, la page garde l'ancien gabarit « étude »
ton: nuit          # ton par défaut ; le visiteur bascule avec le bouton soleil/lune
```

Puis le corps, dans cet ordre (tiré de onze pages de devs relevées le 25/09, galerie dans
`DOCUMENTATION PROJETS (2026-09-25)/galerie-pages-produit.html`) :

| Brique | Rôle |
|---|---|
| `Ouverture` | icône de l'app (`logo`, recadrée sur sa plaque, 96 px, 64 sur téléphone), repères, promesse, phrase, deux boutons, pile, puis la vidéo du produit (slot) |
| `Preuves` | quatre chiffres, chacun avec son sens |
| `Section` + `Moment` | une rangée par interface : texte à gauche, visuel à droite |
| `Section` + `Capacites` | six fonctionnalités en cartes, badge si pas encore publiée |
| `Section` + `Figure`/`Flow` | l'architecture en étapes |
| `Section` + `AvantApres` | les décisions prises sur une mesure |
| `Installer` | les commandes, bouton « Copier », liens |
| `Fabrication` | rôle, cadre, résultat (depuis le frontmatter) |

`PageProduit` enveloppe le tout (branché par `pages/[lang]/projects/[slug].astro`) : lien retour,
apparition au défilement, copie, bascule nuit/jour. La direction visuelle et les jetons sont dans
`src/styles/produit.css`.

## Contrôles avant de pousser

- La vidéo de l'ouverture commence dans le premier écran, à 1440 × 900 **et** à 393 × 852.
- Zéro débordement horizontal à 393 px, dans les deux langues et les deux tons.
- `npx astro check` à 0 erreur, aucun nom de client dans les pages construites (`dist/`).

## Le ton d'écriture

Startup / dev pro, jamais « générique IA » (Dylan, 25/09). Dire ce que c'est et pour qui dès le
titre ; des titres de section qui nomment une fonction, pas des maximes ; les vrais outils et les
vraies commandes ; « vous » plutôt que « on » ; pas d'antithèse « X, pas Y », pas de triade, pas
d'image. Chaque affirmation se vérifie contre le code publié avant d'être écrite.
