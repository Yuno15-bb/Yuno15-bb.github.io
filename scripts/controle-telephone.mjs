/* Le garde-fou du TÉLÉPHONE. Il rougit sur les quatre défauts trouvés le 19/09, et sur eux
 * seuls — chacun a été vu à l'écran avant d'être écrit ici, et chacun a une valeur mesurée.
 *
 *   node scripts/controle-telephone.mjs            # sert dist/ et contrôle
 *   node scripts/controle-telephone.mjs http://…   # contrôle un site déjà servi
 *
 * POURQUOI CE FICHIER EXISTE. Le 18/09, la pastille LinkedIn est entrée dans un en-tête qui
 * était déjà à 16 px de sa limite. Personne n'a rien vu : `astro check` et `astro build`
 * passent au vert, et le bureau — la seule largeur qu'on regarde en travaillant — n'a jamais
 * eu le problème. Le défaut est parti en ligne et y est resté jusqu'à ce que Dylan note le
 * format iPhone 1/10. Un contrôle qui ne regarde qu'une largeur ne protège qu'une largeur.
 *
 * CE QU'IL NE FAIT PAS : juger. Il ne dit pas si la page est belle, ni si le récit tient. Il
 * mesure quatre choses chiffrables. Le reste se regarde, en capture, une par une.
 *
 * ⚠ Playwright est emprunté à dgc-suivi, comme le fait déjà `recolter.mjs` du dossier d'audit.
 * Ce dépôt n'a pas de navigateur à lui : si ce chemin disparaît, le contrôle ne tourne plus.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/Users/mac/Desktop/DG CHARPENTE/dgc-suivi/node_modules/playwright/index.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RACINE, 'dist');
const LARGEUR = 393;   // iPhone 15/16/17 Pro
const HAUTEUR = 852;

const VOIES = [
  ['accueil', '/fr/'],
  ['accueil (en)', '/en/'],
  ['GreyMatter', '/fr/projects/c-brain/'],
  ['Field Ops', '/fr/projects/field-operations-platform/'],
];

/* Le plancher de lisibilité vient de quatre sites de lecture longue mesurés le 19/09 à
   393 px : MDN 37,8 signes par ligne, Smashing Magazine 38,6, web.dev 42,5, Nielsen Norman
   Group 46,9. Aucun ne descend sous 37. Le seuil est posé à 30 — en dessous, on n'est plus
   dans la même famille : le portfolio était à 25 avant la correction. */
const SIGNES_MINIMUM = 30;

const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.webm':'video/webm',
  '.woff2':'font/woff2', '.woff':'font/woff', '.xml':'application/xml', '.ico':'image/x-icon' };

async function servir() {
  const serveur = createServer(async (req, res) => {
    let chemin = join(DIST, decodeURIComponent(req.url.split('?')[0]));
    try {
      if ((await stat(chemin)).isDirectory()) chemin = join(chemin, 'index.html');
    } catch { res.writeHead(404).end(); return; }
    try {
      const corps = await readFile(chemin);
      res.writeHead(200, { 'content-type': TYPES[extname(chemin)] ?? 'application/octet-stream' }).end(corps);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((ok) => serveur.listen(0, '127.0.0.1', ok));
  return { base: `http://127.0.0.1:${serveur.address().port}`, fermer: () => serveur.close() };
}

const echecs = [];
const rate = (page, quoi, mesure) => echecs.push(`${page} — ${quoi}\n     mesuré : ${mesure}`);

const donne = process.argv[2];
const serveur = donne ? null : await servir();
const BASE = (donne || serveur.base).replace(/\/$/, '');

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({
  viewport: { width: LARGEUR, height: HAUTEUR }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
});
const page = await ctx.newPage();

for (const [nom, voie] of VOIES) {
  await page.goto(BASE + voie, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const m = await page.evaluate(() => {
    const V = document.documentElement.clientWidth;
    const tete = document.querySelector('.site-head');

    /* Ce qui dépasse VRAIMENT du cadre. Un élément à l'intérieur d'un bloc qui défile
       horizontalement n'est pas un débordement de page : on remonte ses parents et on
       l'écarte si l'un d'eux défile. */
    const defile = (e) => {
      for (let p = e.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll' || o === 'hidden') return true;
      }
      return false;
    };
    const debordent = [...document.querySelectorAll('body *')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > V + 1 && !defile(e); })
      .slice(0, 6)
      .map((e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().trim().split(/\s+/)[0]} ` +
                  `(jusqu'à ${Math.round(e.getBoundingClientRect().right)} px)`);

    /* La longueur de ligne, sur les huit premiers vrais paragraphes.
       ⚠ « VRAI » paragraphe : rien d'autre que du texte dedans. Premier jet du 19/09 :
       la liste des cartes d'accueil passait le filtre — un `li` qui contient une image,
       un titre et un pitch a bien « plus de 15 mots », et sa hauteur divisée par une
       hauteur de ligne donnait 21 « lignes » à 10 signes. Le contrôle accusait la page
       d'un défaut qui était dans l'instrument. On écarte donc tout élément qui contient
       un autre bloc. */
    const ps = [...document.querySelectorAll('p, dd')].filter((p) => {
      if (p.querySelector('p, div, img, video, figure, ul, ol, h1, h2, h3, h4, h5, h6')) return false;
      /* Un surtitre mono en capitales n'est pas du texte de lecture : il est court par
         dessein, il se compte en signes larges, et le juger au mètre du paragraphe ferait
         rougir le contrôle sur une intention. `.eyebrow` est la classe que le site donne
         à tous ses surtitres. */
      if (p.classList.contains('eyebrow')) return false;
      const t = (p.textContent || '').trim(); const b = p.getBoundingClientRect();
      /* 25 mots et non 15 : en dessous, on attrape des accroches de carte — trois lignes
         de teaser, écrites courtes exprès — au lieu de vrais paragraphes de fond. */
      return t.split(/\s+/).length >= 25 && b.width > 150 && b.height >= 30;
    }).slice(0, 8);
    const signes = ps.map((p) => {
      const cs = getComputedStyle(p); const b = p.getBoundingClientRect();
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
      const l = Math.max(1, Math.round(b.height / lh));
      return { n: (p.textContent || '').trim().length / l,
               ou: `${p.tagName.toLowerCase()}.${(p.className || '').toString().trim().split(/\s+/)[0]}` };
    });
    /* ⚠ ON JUGE SUR LE PIRE PARAGRAPHE, PAS SUR LA MOYENNE. Sabotage du 19/09 : en
       remettant la marge du cadre sur téléphone — le vrai défaut, 262 px de colonne au
       lieu de 312 — la moyenne de Field Ops ne bougeait pas d'un dixième et le contrôle
       restait vert. Les paragraphes larges du début noyaient le passage étroit. Une page
       se lit à l'endroit le plus dur, pas en moyenne. */
    const pire = signes.length ? signes.reduce((a, b) => (b.n < a.n ? b : a)) : null;

    /* Les cibles tactiles : 44 px est le minimum d'Apple comme de Google. */
    const petites = [...document.querySelectorAll('a, button')].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 44 && getComputedStyle(e).position !== 'fixed';
    }).slice(0, 6).map((e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().trim().split(/\s+/)[0]} ` +
                              `(${Math.round(e.getBoundingClientRect().height)} px)`);

    return {
      viewport: V,
      pageLargeur: document.documentElement.scrollWidth,
      teteDispo: tete ? Math.round(tete.getBoundingClientRect().width) : null,
      teteBesoin: tete ? tete.scrollWidth : null,
      debordent,
      signesParLigne: pire ? +pire.n.toFixed(1) : null,
      signesOu: pire ? pire.ou : null,
      signesMoyenne: signes.length ? +(signes.reduce((a, b) => a + b.n, 0) / signes.length).toFixed(1) : null,
      paragraphes: signes.length,
      petites,
    };
  });

  if (m.pageLargeur > m.viewport)
    rate(nom, 'la page glisse sur le côté', `${m.pageLargeur} px de large pour un écran de ${m.viewport}`);
  if (m.teteBesoin > m.teteDispo)
    rate(nom, "l'en-tête ne tient pas sur sa ligne", `${m.teteBesoin} px demandés, ${m.teteDispo} offerts`);
  if (m.debordent.length)
    rate(nom, 'des éléments sortent du cadre', m.debordent.join(' · '));
  if (m.signesParLigne !== null && m.signesParLigne < SIGNES_MINIMUM)
    rate(nom, 'les lignes de lecture sont trop courtes',
         `${m.signesParLigne} signes par ligne dans ${m.signesOu} — le passage le plus étroit ` +
         `sur ${m.paragraphes} paragraphes (moyenne ${m.signesMoyenne}), plancher ${SIGNES_MINIMUM}`);
  if (m.petites.length)
    rate(nom, 'des cibles tactiles sous 44 px', m.petites.join(' · '));

  console.log(
    `${nom.padEnd(14)} page ${m.pageLargeur} px · en-tête ${m.teteBesoin}/${m.teteDispo} · ` +
    `${m.signesParLigne ?? '—'} signes/ligne au plus étroit dans ${m.signesOu ?? '—'} ` +
    `(moyenne ${m.signesMoyenne ?? '—'})`);
}

await navigateur.close();
serveur?.fermer();

if (echecs.length) {
  console.error(`\n✗ ${echecs.length} défaut(s) sur téléphone (${LARGEUR} px) :\n`);
  echecs.forEach((e, i) => console.error(`  ${i + 1}. ${e}\n`));
  process.exit(1);
}
console.log(`\n✓ téléphone ${LARGEUR} px : rien ne déborde, l'en-tête tient, les lignes se lisent.`);
