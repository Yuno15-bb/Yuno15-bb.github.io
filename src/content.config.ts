import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Contrat contenu (cf docs/cadrage-portfolio.md).
// Un projet = 1 fichier MDX par langue : src/content/projects/<lang>/<slug>.mdx
// => l'id de l'entree est "<lang>/<slug>". Ajouter un projet = 1 MDX, zero code.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    titre: z.string(),
    pitch: z.string(), // 1 phrase
    audience: z.array(z.enum(['xr', 'business'])).min(1),
    // Surtitre public de l'etude (ex. "Client work · anonymized"). Quand il est
    // absent, le gabarit retombe sur `audience`.
    contexte: z.string().optional(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    annee: z.number().int(),
    resultat: z.string(), // mesurable / observable
    cover: z.string().optional(),  // chemin relatif dans /public (rempli plus tard)
    cover2: z.string().optional(), // seconde maquette, posee a cote de la premiere
    // Vignette montrée EN ENTIER, sans rognage : une planche de plusieurs appareils
    // perd son sens si on lui coupe les bords (Dylan, 17/09).
    coverEntier: z.boolean().optional(),
    medias: z.array(z.string()).default([]),
    liens: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    nda: z.boolean().default(false), // client reel -> captures maquettees, aucune vraie data
    featured: z.boolean().default(false),
    ordre: z.number().int().default(100),
    // GABARIT DE PAGE (25/09). « etude » : l'étude de cas d'origine, filets sur le champ
    // animé. « produit » : une page de présentation produit — promesse, preuve, démonstration,
    // installation —, sur fond opaque. Dylan, 25/09 : « on refait toute la documentation de
    // zéro, elle n'est pas bonne comme présentation produit, même open source ».
    gabarit: z.enum(['etude', 'produit']).default('etude'),
    // Ton de la page produit : nuit (fond sombre) ou jour (fond clair).
    ton: z.enum(['nuit', 'jour']).default('nuit'),
  }),
});

export const collections = { projects };
