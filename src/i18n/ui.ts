// Dictionnaire i18n minimal (L0). Etendu au fil des lots.
export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

/* Le meme interrupteur, en deux lettres. Sur un telephone de 393 px, « English »
   coutait 77 px d'une barre qui n'en avait que 329 : l'en-tete debordait de 57 px
   et le mot etait coupe a l'ecran (mesure du 19/09). Deux lettres en coutent 28 et
   se lisent aussi bien — c'est la forme habituelle d'un selecteur de langue sur
   telephone. Le mot entier reste affiche des qu'il y a la place. */
export const languageCodes = {
  fr: 'FR',
  en: 'EN',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  fr: {
    'site.role': 'AI Engineer · développeur full-stack',
    'nav.work': 'Travaux',
    'nav.contact': 'Contact',
    'skip': 'Aller au contenu',
    'home.intro': 'Développeur et concepteur produit. Du premier écran jusqu’à la production.',
    'home.work.title': 'Projets',
    'home.stack': 'Ce avec quoi je construis',
    'home.filter.label': 'Filtrer par domaine',
    'home.filter.all': 'Tout',
    'home.filter.business': 'Produit / IA',
    'home.empty': 'Aucun projet dans ce domaine pour l’instant — d’autres arrivent.',
    'home.contact.title': 'Travaillons ensemble',
    'home.contact.body': 'Un système à construire, un produit à livrer ? Écrivez-moi.',
    'project.role': 'Rôle',
    'project.stack': 'Stack',
    'project.year': 'Année',
    'project.result': 'Résultat',
    'project.nda': 'Client réel — visuels maquettés, aucune donnée réelle exposée.',
    'project.mockup': 'Interface réelle du produit, reconstruite fidèlement — données volontairement fictives (confidentialité client).',
    'project.back': '← Tous les travaux',
    'ton.clair': 'Passer en clair',
    'ton.sombre': 'Passer en sombre',
    'cta.contact': 'Me contacter',
    'contact.email': 'Écrivez-moi',
    'contact.copy': 'Copier',
    'contact.copied': 'Adresse copiée ✓',
    'story.title': 'Comment ça marche',
    'story.hint': 'Faites défiler — chaque écran de l’app se dévoile.',
    'story.s1.t': '1 · Le terrain, dans la poche',
    'story.s1.b': 'L’accueil du technicien : la mission en cours avec sa carte et son itinéraire, les prochaines interventions, les actions rapides. Tout s’ouvre même sans réseau — le carnet papier tient dans un téléphone.',
    'story.s2.t': '2 · Le bureau voit tout',
    'story.s1.dev': 'Terrain · téléphone',
    'story.s2.dev': 'Bureau · ordinateur',
    'story.s2.b': 'Un tableau de bord unique : les équipes en direct sur la carte, les compteurs, les conclusions urgentes, les interventions récentes. Ce qui se perdait entre le chantier et le bureau devient une source de vérité.',
  },
  en: {
    'site.role': 'AI Engineer · Full-Stack Developer',
    'nav.work': 'Work',
    'nav.contact': 'Contact',
    'skip': 'Skip to content',
    'home.intro': 'Developer and product designer. From the first screen to production.',
    'home.work.title': 'Projects',
    'home.stack': 'What I build with',
    'home.filter.label': 'Filter by field',
    'home.filter.all': 'All',
    'home.filter.business': 'Product / AI',
    'home.empty': 'No project in this field yet — more coming.',
    'home.contact.title': 'Let’s work together',
    'home.contact.body': 'A system to build, a product to ship? Drop me a line.',
    'project.role': 'Role',
    'project.stack': 'Stack',
    'project.year': 'Year',
    'project.result': 'Result',
    'project.nda': 'Real client — mocked visuals, no real data exposed.',
    'project.mockup': 'The product’s real interface, faithfully rebuilt — data deliberately fictional (client confidentiality).',
    'project.back': '← All work',
    'ton.clair': 'Switch to light',
    'ton.sombre': 'Switch to dark',
    'cta.contact': 'Get in touch',
    'contact.email': 'Write to me',
    'contact.copy': 'Copy',
    'contact.copied': 'Address copied ✓',
    'story.title': 'How it works',
    'story.hint': 'Scroll — each screen of the app reveals itself.',
    'story.s1.t': '1 · The field, in your pocket',
    'story.s1.b': 'The technician’s home screen: the current job with its map and route, the upcoming jobs, the quick actions. Everything opens even with no signal — the paper logbook now fits in a phone.',
    'story.s2.t': '2 · The office sees everything',
    'story.s1.dev': 'Field · phone',
    'story.s2.dev': 'Office · desktop',
    'story.s2.b': 'One dashboard: live crews on the map, counters, urgent findings, recent jobs. What used to get lost between the job site and the office is now a single source of truth.',
  },
} as const;

export function t(lang: Lang) {
  return (key: keyof (typeof ui)['fr']) => ui[lang][key];
}
