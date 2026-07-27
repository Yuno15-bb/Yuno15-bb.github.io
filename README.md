# Portfolio Yuno15

Site portfolio interactif — direction artistique **« Suisse éditorial + couche générative »**.
Cadrage complet : [`docs/cadrage-portfolio.md`](docs/cadrage-portfolio.md).

## Stack
- **Astro** (statique, SEO, rapide) + îlots interactifs (React/GSAP/WebGL — lots suivants).
- **i18n natif** FR + EN (`/fr`, `/en`).
- Contenu en **MDX / content collections** → *ajouter un projet = 1 fichier MDX, zéro code*.

## Démarrer
```bash
npm install
npm run dev        # http://localhost:4321  (redirige vers /fr)
npm run build      # build statique dans dist/
npm run ci         # astro check + build (ce que fait la CI)
```

## Ajouter un projet
Créer `src/content/projects/fr/<slug>.mdx` **et** `src/content/projects/en/<slug>.mdx`.
Frontmatter attendu (schéma dans `src/content.config.ts`) :

```yaml
titre, pitch, audience: [xr | business], role, stack: [...], annee,
resultat, cover?, medias: [...], liens: [...], nda: bool, featured: bool, ordre
```
> **NDA** : pour un projet client réel (`nda: true`), n'exposer que des **visuels maquettés** —
> aucune donnée réelle. Un bandeau l'indique automatiquement.

## Structure
```
src/
  content/projects/{fr,en}/*.mdx   contenu (contrat = content.config.ts)
  i18n/ui.ts                       chaînes FR/EN
  layouts/Base.astro               <head>, header, footer, switch langue
  components/ProjectCard.astro     carte projet (grille)
  pages/[lang]/index.astro         home filtrable par audience
  pages/[lang]/projects/[slug]     étude de cas
  styles/tokens.css                design tokens (source de vérité)
  styles/global.css                base + grille + a11y
docs/cadrage-portfolio.md          le design-doc (lots L0→L4)
```

## Feuille de route (lots)
- **L0** *(fait)* — scaffold Astro + i18n + MDX + tokens + CI.
- **L1** — home éditoriale, DGC Suivi complet, polices réelles, a11y AA. *v1 publiable.*
- **L2** — hero WebGL génératif (îlot React + ogl/three) + poster fallback.
- **L3** — moments interactifs GSAP (Flip / reveals) par étude de cas.
- **L4** — OG images, perf (Lighthouse ≥ 90), CTA + analytics, SEO, mise en ligne.
