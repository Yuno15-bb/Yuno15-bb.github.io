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
    medias: z.array(z.string()).default([]),
    liens: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    nda: z.boolean().default(false), // client reel -> captures maquettees, aucune vraie data
    featured: z.boolean().default(false),
    ordre: z.number().int().default(100),
  }),
});

export const collections = { projects };
