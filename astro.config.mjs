// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Site public. Le workflow Pages fixe SITE_URL au build ; ce repli sert au dev local.
const SITE = process.env.SITE_URL ?? 'https://yuno15-bb.github.io';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // « DGC System » avait ete scindee en deux le 25/08/2026 — l'agent IA d'un cote,
  // l'application terrain de l'autre. DECISION INVERSE le 07/09/2026 (Dylan) : c'est
  // un seul systeme chez un seul client, l'agent remplit les fiches que la plateforme
  // affiche, et deux etudes separees racontaient deux produits la ou il n'y en a qu'un.
  // Les trois anciennes adresses restent vivantes plutot que de tomber en 404.
  redirects: {
    '/en/projects/dgc-system': '/en/projects/field-operations-platform',
    '/fr/projects/dgc-system': '/fr/projects/field-operations-platform',
    '/en/projects/ai-operations-agent': '/en/projects/field-operations-platform',
    '/fr/projects/ai-operations-agent': '/fr/projects/field-operations-platform',
  },
  // i18n natif EN + FR. Les deux langues sont prefixees (/en, /fr).
  // ⚠ C'est CE defaultLocale qui decide de la redirection de la racine `/`,
  // pas la page src/pages/index.astro : Astro genere la redirection lui-meme.
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      // false : la redirection generee par Astro attend 2 s (meta refresh), soit
      // 2 s d'ecran blanc a l'arrivee. On la fait nous-memes, instantanee, dans
      // src/pages/index.astro.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [mdx(), sitemap()],
});
