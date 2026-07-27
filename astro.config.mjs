// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Site public — a renseigner avant mise en ligne (L4). Placeholder pour le sitemap.
const SITE = process.env.SITE_URL ?? 'https://portfolio-dylan.example';

// https://astro.build/config
export default defineConfig({
  site: SITE,
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
  integrations: [mdx(), react(), sitemap()],
});
