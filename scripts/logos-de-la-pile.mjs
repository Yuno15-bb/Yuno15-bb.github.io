/* Télécharge les VRAIS logos des technologies citées dans les études de cas.
 *
 *   node scripts/logos-de-la-pile.mjs
 *
 * Source : Simple Icons (https://simpleicons.org) — les logos officiels des marques, en SVG
 * monochrome, sous CC0. On ne redessine rien : redessiner un logo de marque, c'est en fabriquer
 * une imitation. Les fichiers sont copiés dans public/logos/ ; on ne pointe jamais vers un CDN
 * pour un élément d'identité (il change sans prévenir, et le site doit tenir hors ligne).
 *
 * TOUTES LES TECHNOLOGIES N'ONT PAS DE LOGO, et on n'en invente pas. « Service Worker », « RLS »,
 * « GPS » et « PDF » sont des standards ou des mécanismes, pas des marques : leur badge sort en
 * texte seul. Un trou nommé vaut mieux qu'un trou comblé au jugé.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* Le catalogue est une DONNÉE : il vit dans src/data/logos.ts, que le site importe sans
   effet de bord. Ce script-ci est l'outil qui va chercher les fichiers — on ne le charge
   jamais depuis une page. */
import { LOGOS } from '../src/data/logos.ts';

const ICI = dirname(fileURLToPath(import.meta.url));
const SORTIE = join(ICI, '..', 'public', 'logos');
const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons';

// Le nom tel qu'il est écrit dans les .mdx → le nom du logo chez Simple Icons.
// `null` = pas de marque, badge en texte seul.


mkdirSync(SORTIE, { recursive: true });
let pris = 0, deja = 0;
const rates = [];

for (const [nom, slug] of Object.entries(LOGOS)) {
  if (!slug) continue;
  const cible = join(SORTIE, `${slug}.svg`);
  if (existsSync(cible)) { deja++; continue; }
  const r = await fetch(`${CDN}/${slug}.svg`);
  if (!r.ok) { rates.push(`${nom} (${slug}) → ${r.status}`); continue; }
  let svg = await r.text();
  // Simple Icons livre un chemin noir. On le rend héritable : `currentColor` laisse le CSS
  // décider, et le badge suit le thème sans qu'on duplique un fichier par couleur.
  svg = svg.replace(/<svg /, '<svg fill="currentColor" ').replace(/fill="#[0-9a-fA-F]{3,6}"/g, '');
  writeFileSync(cible, svg, 'utf8');
  pris++;
}

console.log(`${pris} logo(s) téléchargé(s), ${deja} déjà là → public/logos/`);
if (rates.length) {
  console.error('\nIntrouvables — leur badge sortira en texte seul :');
  for (const r of rates) console.error('  ·', r);
}
const sans = Object.entries(LOGOS).filter(([, s]) => !s).map(([n]) => n);
console.log(`Sans logo, par nature (standard ou mécanisme, pas une marque) : ${sans.join(', ')}`);
