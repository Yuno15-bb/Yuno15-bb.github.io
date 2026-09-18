/**
 * Les technologies, leurs vrais logos, et la liste de l'accueil. DONNÉES SEULES.
 *
 * ⚠ CE FICHIER NE FAIT RIEN AU CHARGEMENT, et c'est tout son intérêt. Le catalogue vivait
 * dans `scripts/logos-de-la-pile.mjs`, qui télécharge les logos au moment où on l'exécute.
 * Or Astro l'IMPORTAIT pour lire le catalogue : chaque `npm run build` relançait donc les
 * téléchargements — mesuré le 18/09, « 22 logo(s) téléchargé(s) » à chaque build, écrits à
 * côté du module empaqueté et non dans `public/logos/`, donc invisibles et refaits la fois
 * d'après. Le build du site dépendait d'un CDN pour rien, y compris en CI.
 * Les données sont ici, l'outil qui va les chercher est resté dans `scripts/`.
 */

export const LOGOS = {
  'Python': 'python',
  'Bash': 'gnubash',
  'Electron': 'electron',
  'WebGL': 'webgl',
  'GitHub Actions': 'githubactions',
  'Apache 2.0': 'apache',
  'Supabase': 'supabase',
  'PostgreSQL': 'postgresql',
  'FastAPI': 'fastapi',
  'JavaScript': 'javascript',
  'Gmail': 'gmail',
  'PWA': 'pwa',
  'Claude': 'claude',
  'Microsoft Graph': 'microsoft',
  'Service Worker': null,
  'PDF': null,
  'RLS': null,
  'GPS': null,

  /* Ajoutés le 18/09 pour la bande de l'accueil : ils sont dans le CV mais pas (encore)
     dans une étude de cas. Tous ont un vrai logo de marque chez Simple Icons — vérifié
     un par un, 200 sur chacun. */
  'TypeScript': 'typescript',
  'React': 'react',
  'Node.js': 'nodedotjs',
  'Playwright': 'playwright',
  'pytest': 'pytest',
  'Git': 'git',
  'Railway': 'railway',
  'Sentry': 'sentry',
};

/* ============================================================
   LA BANDE DE L'ACCUEIL — la liste vient du CV, pas des études de cas.
   (Dylan, 18/09 : « je doute que les skills citent absolument tout les skills cités
   dans mes profils », et « tout ce qui n'a pas d'icône, enlève-le ».)

   D'où elle vient : la section « Compétences » du CV, lue dans
   `AUDIT PORTFOLIO (2026-09-18)/dossier/05-identite/CV FR — source.html` — langages,
   IA, back-end, front-end, qualité/livraison. Déduire la bande des deux études de cas,
   comme au premier jet, ne montrait que ce que ces deux projets emploient : ni React,
   ni TypeScript, ni Playwright, ni pytest, ni Git, ni Railway, ni Sentry n'y figuraient.

   CE QUI N'A PAS DE LOGO N'ENTRE PAS. La règle est mécanique, pas manuelle : l'accueil
   filtre sur `LOGOS[nom]`, donc une compétence sans marque — SQL, RAG, Webhooks,
   « API REST », « Service Worker », « Test Automation », « CI/CD » — ne peut pas
   apparaître même si on l'ajoute ici par distraction. Ce sont des savoir-faire réels,
   mais une bande de logos n'est pas l'endroit où les dire : ils vivent dans le CV et
   dans les études de cas, en toutes lettres.

   L'ORDRE EST CELUI DU CV, par famille : on lit les langages, puis le front, puis le
   back, puis l'IA et les intégrations, puis la qualité et la livraison. Une bande qui
   défile n'a pas de début visible, mais elle a un rythme.
   ============================================================ */
export const COMPETENCES = [
  'Python', 'TypeScript', 'JavaScript', 'Bash',
  'React', 'PWA', 'Electron', 'WebGL',
  'FastAPI', 'PostgreSQL', 'Supabase', 'Node.js',
  'Claude', 'Gmail', 'Microsoft Graph',
  'Playwright', 'pytest', 'Git', 'GitHub Actions', 'Railway', 'Sentry',
];
