/**
 * French and Portuguese pages, served at /fr/... and /pt/...
 *
 * Each page names its English equivalent (enPath) so every language version
 * carries hreflang links to the others and the language switcher can move
 * between them. Content is written for francophone and lusophone markets and
 * makes no claims beyond the English site.
 */
export type SiteLang = "en" | "fr" | "pt";
export type LocalLang = Exclude<SiteLang, "en">;

export interface LocalizedSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface LocalizedPage {
  lang: LocalLang;
  /** Path after /fr/ or /pt/ ("" for the language home page) */
  slug: string;
  /** English equivalent */
  enPath: string;
  group: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  sections: LocalizedSection[];
  faqs: { q: string; a: string }[];
}

export const LOCALIZED_PAGES: LocalizedPage[] = [
  {
    slug: "",
    enPath: "/",
    group: "home",
    title:
      "Géosynthétiques en Afrique | Fourniture, pose et contrôle qualité — Geosynthetics Africa",
    description:
      "Géomembranes PEHD, GCL, géotextiles, géogrilles et gabions : fourniture, pose et contrôle qualité pour les mines, l'eau et les infrastructures en Afrique francophone.",
    eyebrow: "Geosynthetics Africa",
    heading: "Fourniture, pose et contrôle qualité de géosynthétiques en Afrique",
    intro:
      "Un seul partenaire pour vos projets d'étanchéité, de renforcement et de drainage : matériaux certifiés, équipes de pose mobiles et dossiers de contrôle qualité complets, de Dakar à Lubumbashi.",
    sections: [
      {
        heading: "Ce que nous faisons",
        bullets: [
          "Fourniture de géomembranes PEHD et PEBDL, GCL, géotextiles, géogrilles, géocellules et gabions",
          "Pose par soudure thermique avec essais non destructifs et destructifs des soudures",
          "Contrôle qualité selon les normes GRI et ASTM, avec dossier de récolement remis en fin de chantier",
          "Logistique porte-à-chantier : transport maritime, dédouanement et livraison sur site",
        ],
      },
      {
        heading: "Secteurs desservis",
        bullets: [
          "Mines : parcs à résidus, lixiviation en tas, bassins de procédé",
          "Eau : réservoirs, barrages, canaux d'irrigation",
          "Déchets : centres de stockage et bassins de lixiviats",
          "Infrastructures : routes, talus, ouvrages de soutènement et protection côtière",
        ],
      },
      {
        heading: "Documentation en français",
        body: "Devis, fiches techniques, plans de pose et rapports de contrôle qualité peuvent être fournis en français.",
      },
    ],
    faqs: [
      {
        q: "Intervenez-vous en Afrique francophone ?",
        a: "Oui. Nous livrons et posons en Afrique de l'Ouest et centrale, au Maghreb et à Madagascar. Consultez la liste des pays ci-dessous.",
      },
      {
        q: "Comment obtenir un devis ?",
        a: "Envoyez-nous votre devis quantitatif (DQE), les plans ou une description du projet à sales@geosyntheticsafrica.com. Nous répondons sous 24 heures ouvrées.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geomembranes-pehd",
    enPath: "/products/geomembrane-liners",
    group: "produits",
    title: "Géomembranes PEHD et PEBDL | Fourniture et pose en Afrique",
    description:
      "Géomembranes PEHD lisses et texturées, PEBDL, PVC et EPDM pour l'étanchéité des mines, bassins, réservoirs et centres de stockage. Pose et contrôle qualité en Afrique.",
    eyebrow: "Géomembranes",
    heading: "Géomembranes PEHD, PEBDL, PVC et EPDM",
    intro:
      "La géomembrane est la barrière d'étanchéité de référence pour contenir l'eau, les solutions de procédé et les lixiviats. Nous fournissons et posons les principales familles de géomembranes, avec un contrôle qualité complet des soudures.",
    sections: [
      {
        heading: "Gamme",
        bullets: [
          "PEHD lisse et texturée (épaisseurs courantes 0,75 à 3,0 mm), conforme GRI-GM13",
          "PEBDL plus souple pour les supports irréguliers, conforme GRI-GM17",
          "PVC, EPDM et polypropylène flexible pour les ouvrages spécifiques",
          "Géomembranes pour couvertures flottantes de réservoirs",
        ],
      },
      {
        heading: "Applications",
        bullets: [
          "Parcs à résidus miniers et aires de lixiviation en tas",
          "Bassins de procédé, d'eaux pluviales et d'évaporation",
          "Réservoirs d'eau et canaux d'irrigation",
          "Centres de stockage de déchets et bassins de lixiviats",
        ],
      },
      {
        heading: "Pose et contrôle qualité",
        body: "Soudure par coin chaud double et par extrusion, essais à la pression d'air (ASTM D5820) et à la cloche à vide (ASTM D5641), essais destructifs de cisaillement et de pelage (ASTM D6392) et plan de calepinage de récolement.",
      },
    ],
    faqs: [
      {
        q: "Quelle épaisseur choisir ?",
        a: "Elle dépend de l'ouvrage, du support, de la charge et de l'exposition. Pour les parcs à résidus et la lixiviation en tas, 1,5 à 2,0 mm sont courants ; nous vous conseillons selon le cahier des charges.",
      },
      {
        q: "Lisse ou texturée ?",
        a: "La géomembrane texturée augmente le frottement sur les talus et sous les couches de couverture ; la lisse convient aux fonds plats et aux réservoirs.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-bentonitiques-gcl",
    enPath: "/products/geosynthetic-clay-liners-gcl",
    group: "produits",
    title: "Géosynthétiques bentonitiques (GCL) | Fourniture et pose en Afrique",
    description:
      "GCL à bentonite sodique renforcés et GCL revêtus PEHD pour étanchéités composites, barrages et centres de stockage. Pose selon ASTM D6102.",
    eyebrow: "GCL",
    heading: "Géosynthétiques bentonitiques (GCL)",
    intro:
      "Le GCL associe une couche de bentonite sodique à des géotextiles. Hydraté, il forme une barrière de très faible perméabilité, souvent posée sous une géomembrane pour constituer une étanchéité composite.",
    sections: [
      {
        heading: "Gamme",
        bullets: [
          "GCL renforcés aiguilletés à bentonite sodique, conformes GRI-GCL3",
          "GCL revêtus d'un film PEHD pour une barrière renforcée",
        ],
      },
      {
        heading: "Applications",
        bullets: [
          "Étanchéité composite sous géomembrane (mines, déchets)",
          "Barrages, bassins et canaux",
          "Couvertures de centres de stockage",
        ],
      },
      {
        heading: "Bonnes pratiques",
        body: "Stockage au sec selon ASTM D5888, pose selon ASTM D6102 avec recouvrements et bentonite d'appoint, et recouvrement le jour même pour éviter l'hydratation prématurée.",
      },
    ],
    faqs: [
      {
        q: "Le GCL remplace-t-il l'argile compactée ?",
        a: "Il est souvent utilisé comme équivalent d'une couche d'argile dans les étanchéités composites, sous réserve de validation par l'ingénieur et la réglementation locale.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geotextiles",
    enPath: "/products/geotextile-fabrics",
    group: "produits",
    title: "Géotextiles non tissés et tissés | Fourniture en Afrique",
    description:
      "Géotextiles non tissés et tissés en polypropylène pour séparation, filtration, drainage et protection des géomembranes. Livraison dans toute l'Afrique.",
    eyebrow: "Géotextiles",
    heading: "Géotextiles non tissés et tissés",
    intro:
      "Les géotextiles assurent la séparation, la filtration, le drainage et la protection. Nous fournissons des géotextiles non tissés aiguilletés et tissés en polypropylène, de la protection de géomembrane au renforcement de plateformes.",
    sections: [
      {
        heading: "Fonctions",
        bullets: [
          "Séparation entre sol support et couche de forme",
          "Filtration et drainage",
          "Protection des géomembranes contre le poinçonnement",
          "Renforcement (géotextiles tissés)",
        ],
      },
      {
        heading: "Caractéristiques contrôlées",
        bullets: [
          "Masse surfacique",
          "Résistance à la traction (ISO 10319)",
          "Poinçonnement CBR (ISO 12236)",
          "Ouverture de filtration",
        ],
      },
      {
        heading: "Autres produits",
        bullets: [
          "Barrières anti-sédiments (silt fence)",
          "Barrières anti-racines",
          "Toiles de paillage",
        ],
      },
    ],
    faqs: [
      {
        q: "Quel grammage pour protéger une géomembrane ?",
        a: "Il dépend de la granulométrie du matériau de couverture et de la charge ; un calcul de protection est recommandé. Nous vous aidons à le dimensionner.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geogrilles",
    enPath: "/products/geogrids-interlayers",
    group: "produits",
    title: "Géogrilles biaxiales, triaxiales et uniaxiales | Afrique",
    description:
      "Géogrilles pour renforcement de chaussées, plateformes, talus et murs en sol renforcé, et grilles anti-fissuration pour enrobés. Fourniture en Afrique.",
    eyebrow: "Géogrilles",
    heading: "Géogrilles et grilles anti-fissuration",
    intro:
      "Les géogrilles renforcent les sols et les couches granulaires : chaussées sur sols mous, plateformes de travail, talus raidis et murs en sol renforcé. Les grilles en fibre de verre retardent la remontée des fissures dans les enrobés.",
    sections: [
      {
        heading: "Gamme",
        bullets: [
          "Géogrilles biaxiales et triaxiales pour couches de base",
          "Géogrilles uniaxiales et bandes pour murs et talus renforcés",
          "Géogrilles composites (grille + géotextile)",
          "Grilles en fibre de verre et complexes anti-fissuration pour enrobés",
        ],
      },
      {
        heading: "Applications",
        bullets: [
          "Routes, pistes minières et plateformes",
          "Murs en sol renforcé et talus raidis",
          "Réhabilitation de chaussées",
        ],
      },
    ],
    faqs: [
      {
        q: "Quelle géogrille pour une piste minière sur sol mou ?",
        a: "Une géogrille biaxiale ou triaxiale, souvent associée à un géotextile de séparation ; le choix dépend du CBR du sol et du trafic.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "gabions",
    enPath: "/products/gabion-baskets",
    group: "produits",
    title: "Gabions et matelas Reno | Fourniture et pose en Afrique",
    description:
      "Gabions en grillage double torsion et électrosoudés, matelas Reno pour protection de berges, soutènement et lutte contre l'érosion.",
    eyebrow: "Gabions",
    heading: "Gabions et matelas Reno",
    intro:
      "Les gabions sont des cages en grillage métallique remplies de pierres, utilisées pour les murs de soutènement, la protection des berges et des ouvrages hydrauliques. Les matelas Reno protègent les fonds et talus de cours d'eau.",
    sections: [
      {
        heading: "Gamme",
        bullets: [
          "Gabions double torsion galvanisés (EN 10223-3 / ASTM A975)",
          "Gabions électrosoudés (ASTM A974)",
          "Matelas Reno pour revêtements de berges et de canaux",
          "Revêtements zinc-aluminium et gaine PVC sur demande",
        ],
      },
      {
        heading: "Pose",
        body: "Assemblage d'équerre, ligatures sur toutes les arêtes, remplissage par couches avec tirants internes et géotextile filtrant à l'arrière des ouvrages.",
      },
    ],
    faqs: [
      {
        q: "Quelle pierre utiliser ?",
        a: "Une pierre dure et durable, de dimension supérieure à la maille ; la granulométrie dépend du type d'unité et de l'ouvrage.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "controle-erosion-geocellules",
    enPath: "/products/erosion-control-geocells",
    group: "produits",
    title: "Contrôle de l'érosion et géocellules | Afrique",
    description:
      "Nattes anti-érosion en jute, coco et paille, géocellules PEHD pour talus, canaux et chaussées. Fourniture et conseils de pose.",
    eyebrow: "Érosion",
    heading: "Contrôle de l'érosion et géocellules",
    intro:
      "Les nattes biodégradables protègent les talus le temps que la végétation s'installe ; les géocellules confinent le sol, le gravier ou le béton pour stabiliser talus, canaux et plateformes.",
    sections: [
      {
        heading: "Gamme",
        bullets: [
          "Nattes en jute, coco, paille et laine",
          "Géocellules PEHD et polypropylène",
          "Solutions de génie végétal",
        ],
      },
      {
        heading: "Applications",
        bullets: [
          "Talus routiers et miniers",
          "Canaux et fossés",
          "Plateformes et accès sur sols meubles",
        ],
      },
    ],
    faqs: [
      {
        q: "Combien de temps dure une natte en jute ?",
        a: "En général une à deux saisons, le temps que la végétation se développe ; la coco dure plus longtemps.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "etancheite-parcs-a-residus-miniers",
    enPath: "/applications/tailings-storage-facility-lining",
    group: "applications",
    title: "Étanchéité des parcs à résidus miniers | Géomembrane et GCL",
    description:
      "Étanchéité des parcs à résidus (TSF) par géomembrane PEHD et GCL, drainage et contrôle qualité. Fourniture et pose pour les mines africaines.",
    eyebrow: "Mines",
    heading: "Étanchéité des parcs à résidus miniers",
    intro:
      "Les parcs à résidus doivent protéger les eaux souterraines pendant toute la durée d'exploitation et après fermeture. Nous fournissons et posons les systèmes d'étanchéité, de drainage et de détection de fuites.",
    sections: [
      {
        heading: "Système type",
        bullets: [
          "Géomembrane PEHD lisse ou texturée",
          "GCL ou argile compactée en étanchéité composite",
          "Géocomposite de drainage et de détection de fuites",
          "Géotextile de protection",
        ],
      },
      {
        heading: "Contrôle qualité",
        body: "Essais de soudure à 100 %, essais destructifs à la fréquence du plan d'assurance qualité, relevé électrique de fuites si spécifié et dossier de récolement.",
      },
    ],
    faqs: [
      {
        q: "Respectez-vous les exigences GISTM ?",
        a: "Nous fournissons la documentation qualité (certificats, essais, récolement) attendue par les exploitants et leurs ingénieurs de dossier.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "lixiviation-en-tas",
    enPath: "/applications/heap-leach-pad-lining",
    group: "applications",
    title: "Étanchéité des aires de lixiviation en tas | Afrique de l'Ouest",
    description:
      "Géomembranes PEHD/PEBDL et GCL pour aires de lixiviation en tas et bassins de solutions, avec pose et contrôle qualité.",
    eyebrow: "Mines d'or",
    heading: "Étanchéité des aires de lixiviation en tas",
    intro:
      "Les aires de lixiviation en tas sont soumises à de fortes charges et à des solutions agressives. L'étanchéité doit résister au poinçonnement et rester continue sous des dizaines de mètres de minerai.",
    sections: [
      {
        heading: "Système type",
        bullets: [
          "Géomembrane PEHD ou PEBDL texturée",
          "GCL ou couche d'argile en sous-face",
          "Couche de drainage et de protection",
        ],
      },
      {
        heading: "Points de vigilance",
        bullets: [
          "Préparation et réception du support",
          "Choix de l'épaisseur selon la hauteur de tas",
          "Essais de soudure et réparations documentés",
        ],
      },
    ],
    faqs: [
      {
        q: "PEHD ou PEBDL pour la lixiviation ?",
        a: "Le PEBDL supporte mieux les déformations du support ; le PEHD offre une meilleure résistance chimique. Le choix dépend de la conception.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "bassins-et-reservoirs",
    enPath: "/applications/reservoir-dam-lining",
    group: "applications",
    title: "Étanchéité de bassins, réservoirs et barrages | Afrique",
    description:
      "Géomembranes et GCL pour bassins d'eau, réservoirs agricoles et barrages, avec couvertures flottantes. Fourniture et pose.",
    eyebrow: "Eau",
    heading: "Étanchéité de bassins, réservoirs et barrages",
    intro:
      "Une étanchéité bien conçue évite les pertes d'eau par infiltration, préserve la ressource et protège les ouvrages. Nous réalisons des bassins agricoles, réservoirs d'eau potable et barrages.",
    sections: [
      {
        heading: "Solutions",
        bullets: [
          "Géomembrane PEHD ou PEBDL",
          "GCL en étanchéité composite",
          "Couvertures flottantes contre l'évaporation et la contamination",
          "Géotextile de protection et ancrages en tranchée",
        ],
      },
    ],
    faqs: [
      {
        q: "Peut-on couvrir un réservoir d'eau potable ?",
        a: "Oui, avec une couverture flottante adaptée au contact avec l'eau potable.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "centres-de-stockage-dechets",
    enPath: "/applications/landfill-ash-bund-lining",
    group: "applications",
    title: "Étanchéité des centres de stockage de déchets | Afrique",
    description:
      "Étanchéité composite, drainage des lixiviats et couvertures de centres de stockage de déchets. Fourniture, pose et contrôle qualité.",
    eyebrow: "Déchets",
    heading: "Étanchéité des centres de stockage de déchets",
    intro:
      "Les centres de stockage doivent contenir les lixiviats et protéger les nappes. Nous fournissons et posons les étanchéités composites, les géocomposites de drainage et les couvertures finales.",
    sections: [
      {
        heading: "Système type",
        bullets: [
          "Géomembrane PEHD",
          "GCL ou argile compactée",
          "Géocomposite de drainage des lixiviats",
          "Géotextile de protection et de filtration",
        ],
      },
    ],
    faqs: [
      {
        q: "Fournissez-vous les bassins de lixiviats ?",
        a: "Oui : étanchéité simple ou double avec détection de fuites.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "pose-de-geomembranes",
    enPath: "/services/geomembrane-liner-installation-africa",
    group: "services",
    title: "Pose de géomembranes en Afrique | Soudure et contrôle qualité",
    description:
      "Pose de géomembranes PEHD, PEBDL et PVC par équipes mobiles : soudure, essais non destructifs et destructifs, récolement.",
    eyebrow: "Services",
    heading: "Pose de géomembranes",
    intro:
      "Nos équipes de pose se déplacent sur les sites miniers, hydrauliques et environnementaux. Chaque chantier suit un plan d'assurance qualité, du support à la réception.",
    sections: [
      {
        heading: "Prestations",
        bullets: [
          "Réception du support et calepinage",
          "Soudure par coin chaud double et extrusion",
          "Essais à l'air (ASTM D5820) et à la cloche à vide (ASTM D5641)",
          "Essais destructifs (ASTM D6392)",
          "Dossier de récolement : plans, registres de soudures et réparations",
        ],
      },
    ],
    faqs: [
      {
        q: "Pouvez-vous mobiliser une équipe dans mon pays ?",
        a: "Oui. Indiquez-nous le site, les quantités et le planning : nous préparons un plan de mobilisation.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "controle-qualite",
    enPath: "/quality-assurance",
    group: "services",
    title: "Contrôle qualité des géosynthétiques | Normes GRI et ASTM",
    description:
      "Contrôle qualité des matériaux et de la pose : certificats, essais de soudure, relevés de fuites et dossiers de récolement selon GRI et ASTM.",
    eyebrow: "Qualité",
    heading: "Contrôle qualité et assurance qualité",
    intro:
      "La performance d'une étanchéité dépend autant de la pose que du matériau. Notre contrôle qualité couvre la conformité des matériaux, les essais de soudure et la documentation remise au maître d'ouvrage.",
    sections: [
      {
        heading: "Normes de référence",
        bullets: [
          "GRI-GM13 / GRI-GM17 (géomembranes)",
          "GRI-GM19 et ASTM D6392 (soudures)",
          "ASTM D5820 et D5641 (essais non destructifs)",
          "GRI-GCL3, ASTM D5888 et D6102 (GCL)",
          "ISO 10319 et ISO 12236 (géotextiles)",
        ],
      },
    ],
    faqs: [],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-cote-divoire",
    enPath: "/cote-divoire-geosynthetics-supplier-contact",
    group: "pays",
    title: "Géosynthétiques en Côte d'Ivoire | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles en Côte d'Ivoire. Livraison via les ports d'Abidjan et de San-Pédro.",
    eyebrow: "Côte d'Ivoire",
    heading: "Géosynthétiques en Côte d'Ivoire",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques en Côte d'Ivoire, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports d'Abidjan et de San-Pédro, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "L'or (lixiviation en tas, parcs à résidus)",
          "L'agro-industrie et la transformation du cacao",
          "Les routes et infrastructures urbaines",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous en Côte d'Ivoire ?",
        a: "Oui, via les ports d'Abidjan et de San-Pédro, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-senegal",
    enPath: "/senegal-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Sénégal | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Sénégal. Livraison via le port de Dakar.",
    eyebrow: "Sénégal",
    heading: "Géosynthétiques au Sénégal",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Sénégal, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via le port de Dakar, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "L'or dans la région de Kédougou",
          "Les phosphates et les sables minéralisés",
          "La protection côtière et les réservoirs d'eau",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Sénégal ?",
        a: "Oui, via le port de Dakar, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-mali",
    enPath: "/mali-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Mali | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Mali. Livraison via les corridors de Dakar et d'Abidjan.",
    eyebrow: "Mali",
    heading: "Géosynthétiques au Mali",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Mali, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les corridors de Dakar et d'Abidjan, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: ["Les mines d'or", "Les réservoirs et l'irrigation", "Les routes"],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Mali ?",
        a: "Oui, via les corridors de Dakar et d'Abidjan, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-burkina-faso",
    enPath: "/burkina-faso-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Burkina Faso | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Burkina Faso. Livraison via les ports d'Abidjan, Tema ou Lomé puis la route.",
    eyebrow: "Burkina Faso",
    heading: "Géosynthétiques au Burkina Faso",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Burkina Faso, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports d'Abidjan, Tema ou Lomé puis la route, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Les mines d'or",
          "Les retenues d'eau et l'irrigation",
          "Les routes et plateformes",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Burkina Faso ?",
        a: "Oui, via les ports d'Abidjan, Tema ou Lomé puis la route, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-guinee",
    enPath: "/guinea-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques en Guinée | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles en Guinée. Livraison via les ports de Conakry et de Kamsar.",
    eyebrow: "Guinée",
    heading: "Géosynthétiques en Guinée",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques en Guinée, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports de Conakry et de Kamsar, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "La bauxite et le minerai de fer",
          "Les pistes minières et plateformes",
          "L'or dans la région de Siguiri",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous en Guinée ?",
        a: "Oui, via les ports de Conakry et de Kamsar, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-cameroun",
    enPath: "/cameroon-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Cameroun | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Cameroun. Livraison via les ports de Douala et de Kribi.",
    eyebrow: "Cameroun",
    heading: "Géosynthétiques au Cameroun",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Cameroun, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports de Douala et de Kribi, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Les routes et les ports",
          "L'eau et les déchets",
          "Les industries extractives et agro-industrielles",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Cameroun ?",
        a: "Oui, via les ports de Douala et de Kribi, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-rd-congo",
    enPath: "/drc-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques en RD Congo | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles en RD Congo. Livraison via la route depuis l'Afrique du Sud via Kasumbalesa, ou le port de Matadi.",
    eyebrow: "République démocratique du Congo",
    heading: "Géosynthétiques en RD Congo",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques en RD Congo, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via la route depuis l'Afrique du Sud via Kasumbalesa, ou le port de Matadi, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Le cuivre et le cobalt du Katanga",
          "Les parcs à résidus et bassins de procédé",
          "Les routes et pistes minières",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous en RD Congo ?",
        a: "Oui, via la route depuis l'Afrique du Sud via Kasumbalesa, ou le port de Matadi, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-gabon",
    enPath: "/gabon-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Gabon | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Gabon. Livraison via les ports d'Owendo et de Port-Gentil.",
    eyebrow: "Gabon",
    heading: "Géosynthétiques au Gabon",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Gabon, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports d'Owendo et de Port-Gentil, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Le manganèse autour de Moanda",
          "Le pétrole et le gaz",
          "Les routes sur sols mous",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Gabon ?",
        a: "Oui, via les ports d'Owendo et de Port-Gentil, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-madagascar",
    enPath: "/madagascar-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques à Madagascar | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles à Madagascar. Livraison via les ports de Toamasina, Ehoala et Mahajanga.",
    eyebrow: "Madagascar",
    heading: "Géosynthétiques à Madagascar",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques à Madagascar, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports de Toamasina, Ehoala et Mahajanga, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Les mines (nickel, ilménite, graphite)",
          "L'eau et l'agriculture",
          "La protection côtière",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous à Madagascar ?",
        a: "Oui, via les ports de Toamasina, Ehoala et Mahajanga, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-maroc",
    enPath: "/morocco-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques au Maroc | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles au Maroc. Livraison via les ports de Tanger Med, Casablanca et Jorf Lasfar.",
    eyebrow: "Maroc",
    heading: "Géosynthétiques au Maroc",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques au Maroc, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports de Tanger Med, Casablanca et Jorf Lasfar, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: [
          "Les bassins d'irrigation agricoles",
          "Les phosphates",
          "Le dessalement et les infrastructures",
        ],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous au Maroc ?",
        a: "Oui, via les ports de Tanger Med, Casablanca et Jorf Lasfar, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "geosynthetiques-mauritanie",
    enPath: "/mauritania-geosynthetics-supplier-installer",
    group: "pays",
    title: "Géosynthétiques en Mauritanie | Géomembranes, géotextiles et géogrilles",
    description:
      "Fourniture, pose et contrôle qualité de géomembranes PEHD, GCL, géotextiles et géogrilles en Mauritanie. Livraison via les ports de Nouakchott et de Nouadhibou.",
    eyebrow: "Mauritanie",
    heading: "Géosynthétiques en Mauritanie",
    intro:
      "Geosynthetics Africa fournit, pose et contrôle des systèmes géosynthétiques en Mauritanie, avec des devis et des rapports qualité en français.",
    sections: [
      {
        heading: "Logistique",
        body: "Les matériaux sont acheminés via les ports de Nouakchott et de Nouadhibou, puis livrés sur chantier avec les documents d'expédition, certificats d'usine et certificats d'origine.",
      },
      {
        heading: "Secteurs principaux",
        bullets: ["L'or et le minerai de fer", "Le stockage de l'eau", "Les routes sur sable"],
      },
      {
        heading: "Nos prestations",
        bullets: [
          "Fourniture de géomembranes, GCL, géotextiles, géogrilles et gabions",
          "Pose par équipes mobiles avec essais de soudure",
          "Dossier de contrôle qualité et de récolement",
        ],
      },
    ],
    faqs: [
      {
        q: "Livrez-vous en Mauritanie ?",
        a: "Oui, via les ports de Nouakchott et de Nouadhibou, avec dédouanement et livraison sur site.",
      },
      {
        q: "Les documents sont-ils disponibles en français ?",
        a: "Oui : devis, fiches techniques et rapports de contrôle qualité.",
      },
    ],
    lang: "fr",
  },
  {
    slug: "",
    enPath: "/",
    group: "home",
    title:
      "Geossintéticos em África | Fornecimento, instalação e controlo de qualidade — Geosynthetics Africa",
    description:
      "Geomembranas PEAD, GCL, geotêxteis, geogrelhas e gabiões: fornecimento, instalação e controlo de qualidade para mineração, água e infraestruturas em Angola, Moçambique e em toda a África.",
    eyebrow: "Geosynthetics Africa",
    heading: "Fornecimento, instalação e controlo de qualidade de geossintéticos em África",
    intro:
      "Um único parceiro para impermeabilização, reforço e drenagem: materiais certificados, equipas de instalação móveis e dossiês de controlo de qualidade completos.",
    sections: [
      {
        heading: "O que fazemos",
        bullets: [
          "Fornecimento de geomembranas PEAD e PEBDL, GCL, geotêxteis, geogrelhas, geocélulas e gabiões",
          "Instalação por soldadura térmica com ensaios não destrutivos e destrutivos",
          "Controlo de qualidade segundo normas GRI e ASTM, com dossiê final entregue ao cliente",
          "Logística porta-a-obra: transporte, desalfandegamento e entrega no local",
        ],
      },
      {
        heading: "Setores",
        bullets: [
          "Mineração: barragens de rejeitos, lixiviação em pilha, bacias de processo",
          "Água: reservatórios, barragens, canais de irrigação",
          "Resíduos: aterros sanitários e bacias de lixiviados",
          "Infraestruturas: estradas, taludes, muros de suporte e proteção costeira",
        ],
      },
      {
        heading: "Documentação em português",
        body: "Orçamentos, fichas técnicas, planos de instalação e relatórios de controlo de qualidade podem ser fornecidos em português.",
      },
    ],
    faqs: [
      {
        q: "Trabalham em Angola e Moçambique?",
        a: "Sim. Fornecemos e instalamos em Angola, Moçambique e em toda a África Austral.",
      },
      {
        q: "Como pedir um orçamento?",
        a: "Envie a lista de quantidades, desenhos ou uma descrição do projeto para sales@geosyntheticsafrica.com. Respondemos em 24 horas úteis.",
      },
    ],
    lang: "pt",
  },
  {
    slug: "geomembranas-pead",
    enPath: "/products/geomembrane-liners",
    group: "produtos",
    title: "Geomembranas PEAD e PEBDL | Fornecimento e instalação em África",
    description:
      "Geomembranas PEAD lisas e texturadas, PEBDL, PVC e EPDM para impermeabilização de minas, reservatórios e aterros. Instalação e controlo de qualidade.",
    eyebrow: "Geomembranas",
    heading: "Geomembranas PEAD, PEBDL, PVC e EPDM",
    intro:
      "A geomembrana é a barreira de impermeabilização de referência para conter água, soluções de processo e lixiviados. Fornecemos e instalamos as principais famílias, com controlo de qualidade completo das soldaduras.",
    sections: [
      {
        heading: "Gama",
        bullets: [
          "PEAD lisa e texturada (espessuras comuns de 0,75 a 3,0 mm), conforme GRI-GM13",
          "PEBDL mais flexível para bases irregulares, conforme GRI-GM17",
          "PVC, EPDM e polipropileno flexível",
          "Coberturas flutuantes para reservatórios",
        ],
      },
      {
        heading: "Instalação e controlo de qualidade",
        body: "Soldadura por cunha quente dupla e por extrusão, ensaios de pressão de ar (ASTM D5820) e de caixa de vácuo (ASTM D5641), ensaios destrutivos de corte e arrancamento (ASTM D6392) e planta de painéis final.",
      },
    ],
    faqs: [
      {
        q: "Que espessura escolher?",
        a: "Depende da obra, da base, da carga e da exposição. Em barragens de rejeitos e lixiviação em pilha são comuns 1,5 a 2,0 mm.",
      },
    ],
    lang: "pt",
  },
  {
    slug: "geocompostos-bentoniticos-gcl",
    enPath: "/products/geosynthetic-clay-liners-gcl",
    group: "produtos",
    title: "Geocompostos bentoníticos (GCL) | África",
    description:
      "GCL de bentonite sódica reforçados e GCL revestidos a PEAD para impermeabilizações compostas, barragens e aterros.",
    eyebrow: "GCL",
    heading: "Geocompostos bentoníticos (GCL)",
    intro:
      "O GCL combina uma camada de bentonite sódica com geotêxteis. Hidratado, forma uma barreira de muito baixa permeabilidade, frequentemente instalada sob uma geomembrana.",
    sections: [
      {
        heading: "Boas práticas",
        body: "Armazenamento seco segundo ASTM D5888, instalação segundo ASTM D6102 com sobreposições e bentonite adicional, e cobertura no mesmo dia.",
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "geotexteis",
    enPath: "/products/geotextile-fabrics",
    group: "produtos",
    title: "Geotêxteis não tecidos e tecidos | África",
    description:
      "Geotêxteis de polipropileno para separação, filtração, drenagem e proteção de geomembranas.",
    eyebrow: "Geotêxteis",
    heading: "Geotêxteis não tecidos e tecidos",
    intro:
      "Os geotêxteis asseguram separação, filtração, drenagem e proteção, da proteção de geomembranas ao reforço de plataformas.",
    sections: [
      {
        heading: "Funções",
        bullets: [
          "Separação entre o solo e a camada de base",
          "Filtração e drenagem",
          "Proteção de geomembranas contra punçoamento",
          "Reforço (geotêxteis tecidos)",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "geogrelhas",
    enPath: "/products/geogrids-interlayers",
    group: "produtos",
    title: "Geogrelhas biaxiais, triaxiais e uniaxiais | África",
    description:
      "Geogrelhas para reforço de pavimentos, plataformas, taludes e muros de solo reforçado.",
    eyebrow: "Geogrelhas",
    heading: "Geogrelhas",
    intro:
      "As geogrelhas reforçam solos e camadas granulares: estradas sobre solos moles, plataformas de trabalho, taludes e muros de solo reforçado.",
    sections: [
      {
        heading: "Gama",
        bullets: [
          "Geogrelhas biaxiais e triaxiais",
          "Geogrelhas uniaxiais para muros e taludes",
          "Grelhas de fibra de vidro para misturas betuminosas",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "gabioes",
    enPath: "/products/gabion-baskets",
    group: "produtos",
    title: "Gabiões e colchões Reno | África",
    description:
      "Gabiões de malha hexagonal de dupla torção e eletrossoldados, colchões Reno para proteção de margens e muros de suporte.",
    eyebrow: "Gabiões",
    heading: "Gabiões e colchões Reno",
    intro:
      "Os gabiões são caixas de malha metálica cheias de pedra, usadas em muros de suporte, proteção de margens e obras hidráulicas.",
    sections: [
      {
        heading: "Gama",
        bullets: [
          "Gabiões de dupla torção galvanizados (EN 10223-3 / ASTM A975)",
          "Gabiões eletrossoldados (ASTM A974)",
          "Colchões Reno para revestimento de margens e canais",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "barragens-de-rejeitos",
    enPath: "/applications/tailings-storage-facility-lining",
    group: "aplicações",
    title: "Impermeabilização de barragens de rejeitos | Geomembrana e GCL",
    description:
      "Impermeabilização de barragens de rejeitos com geomembrana PEAD e GCL, drenagem e controlo de qualidade para minas em África.",
    eyebrow: "Mineração",
    heading: "Impermeabilização de barragens de rejeitos",
    intro:
      "As barragens de rejeitos devem proteger as águas subterrâneas durante a operação e após o encerramento. Fornecemos e instalamos sistemas de impermeabilização, drenagem e deteção de fugas.",
    sections: [
      {
        heading: "Sistema típico",
        bullets: [
          "Geomembrana PEAD lisa ou texturada",
          "GCL ou argila compactada",
          "Geocomposto de drenagem e deteção de fugas",
          "Geotêxtil de proteção",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "reservatorios-e-barragens",
    enPath: "/applications/reservoir-dam-lining",
    group: "aplicações",
    title: "Impermeabilização de reservatórios e barragens | África",
    description:
      "Geomembranas e GCL para reservatórios de água, irrigação e barragens, com coberturas flutuantes.",
    eyebrow: "Água",
    heading: "Impermeabilização de reservatórios e barragens",
    intro:
      "Uma impermeabilização bem concebida evita perdas de água por infiltração e protege as obras.",
    sections: [
      {
        heading: "Soluções",
        bullets: [
          "Geomembrana PEAD ou PEBDL",
          "GCL em impermeabilização composta",
          "Coberturas flutuantes contra evaporação e contaminação",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "instalacao-de-geomembranas",
    enPath: "/services/geomembrane-liner-installation-africa",
    group: "serviços",
    title: "Instalação de geomembranas em África | Soldadura e controlo de qualidade",
    description:
      "Instalação de geomembranas PEAD, PEBDL e PVC por equipas móveis: soldadura, ensaios e dossiê final.",
    eyebrow: "Serviços",
    heading: "Instalação de geomembranas",
    intro:
      "As nossas equipas de instalação deslocam-se a minas, obras hidráulicas e ambientais, seguindo um plano de garantia de qualidade da base à receção.",
    sections: [
      {
        heading: "Serviços",
        bullets: [
          "Receção da base e planta de painéis",
          "Soldadura por cunha quente dupla e extrusão",
          "Ensaios de ar e de caixa de vácuo",
          "Ensaios destrutivos (ASTM D6392)",
          "Dossiê final com registos de soldaduras e reparações",
        ],
      },
    ],
    faqs: [],
    lang: "pt",
  },
  {
    slug: "geossinteticos-angola",
    enPath: "/angola-geosynthetics-supplier-installer",
    group: "países",
    title: "Geossintéticos em Angola | Geomembranas, geotêxteis e geogrelhas",
    description:
      "Fornecimento, instalação e controlo de qualidade de geomembranas PEAD, GCL, geotêxteis e geogrelhas em Angola. Entrega através de os portos de Luanda e do Lobito, ou por estrada através da Namíbia.",
    eyebrow: "Angola",
    heading: "Geossintéticos em Angola",
    intro:
      "A Geosynthetics Africa fornece, instala e controla sistemas geossintéticos em Angola, com orçamentos e relatórios de qualidade em português.",
    sections: [
      {
        heading: "Logística",
        body: "Os materiais são encaminhados através de os portos de Luanda e do Lobito, ou por estrada através da Namíbia e entregues em obra com documentos de expedição, certificados de fábrica e certificados de origem.",
      },
      {
        heading: "Setores principais",
        bullets: [
          "Mineração de diamantes e minerais",
          "Petróleo e gás",
          "Abastecimento de água e agricultura",
        ],
      },
      {
        heading: "Serviços",
        bullets: [
          "Fornecimento de geomembranas, GCL, geotêxteis, geogrelhas e gabiões",
          "Instalação por equipas móveis com ensaios de soldadura",
          "Dossiê de controlo de qualidade",
        ],
      },
    ],
    faqs: [
      {
        q: "Entregam em Angola?",
        a: "Sim, através de os portos de Luanda e do Lobito, ou por estrada através da Namíbia, com desalfandegamento e entrega em obra.",
      },
      {
        q: "A documentação está disponível em português?",
        a: "Sim: orçamentos, fichas técnicas e relatórios de controlo de qualidade.",
      },
    ],
    lang: "pt",
  },
  {
    slug: "geossinteticos-mocambique",
    enPath: "/mozambique-geosynthetics-supplier-contact",
    group: "países",
    title: "Geossintéticos em Moçambique | Geomembranas, geotêxteis e geogrelhas",
    description:
      "Fornecimento, instalação e controlo de qualidade de geomembranas PEAD, GCL, geotêxteis e geogrelhas em Moçambique. Entrega através de os portos de Maputo, Beira e Nacala, ou por estrada a partir da África do Sul (Ressano Garcia).",
    eyebrow: "Moçambique",
    heading: "Geossintéticos em Moçambique",
    intro:
      "A Geosynthetics Africa fornece, instala e controla sistemas geossintéticos em Moçambique, com orçamentos e relatórios de qualidade em português.",
    sections: [
      {
        heading: "Logística",
        body: "Os materiais são encaminhados através de os portos de Maputo, Beira e Nacala, ou por estrada a partir da África do Sul (Ressano Garcia) e entregues em obra com documentos de expedição, certificados de fábrica e certificados de origem.",
      },
      {
        heading: "Setores principais",
        bullets: [
          "Carvão em Tete, grafite e areias minerais",
          "Gás natural e infraestruturas",
          "Água, irrigação e proteção costeira",
        ],
      },
      {
        heading: "Serviços",
        bullets: [
          "Fornecimento de geomembranas, GCL, geotêxteis, geogrelhas e gabiões",
          "Instalação por equipas móveis com ensaios de soldadura",
          "Dossiê de controlo de qualidade",
        ],
      },
    ],
    faqs: [
      {
        q: "Entregam em Moçambique?",
        a: "Sim, através de os portos de Maputo, Beira e Nacala, ou por estrada a partir da África do Sul (Ressano Garcia), com desalfandegamento e entrega em obra.",
      },
      {
        q: "A documentação está disponível em português?",
        a: "Sim: orçamentos, fichas técnicas e relatórios de controlo de qualidade.",
      },
    ],
    lang: "pt",
  },
];

export const LANG_LABELS: Record<SiteLang, { name: string; hreflang: string }> = {
  en: { name: "English", hreflang: "en" },
  fr: { name: "Français", hreflang: "fr" },
  pt: { name: "Português", hreflang: "pt" },
};

export const UI: Record<LocalLang, Record<string, string>> = {
  fr: {
    quote: "Demander un devis",
    contact: "Nous contacter",
    faqs: "Questions fréquentes",
    explore: "Découvrir",
    english: "Version anglaise détaillée",
    groupHome: "Accueil",
    produits: "Produits",
    applications: "Applications",
    services: "Services",
    pays: "Pays",
    allPages: "Nos pages en français",
    ctaTitle: "Un projet en cours ?",
    ctaBody:
      "Envoyez votre DQE, vos plans ou une description du projet : réponse sous 24 heures ouvrées.",
  },
  pt: {
    quote: "Pedir orçamento",
    contact: "Contactar",
    faqs: "Perguntas frequentes",
    explore: "Ver",
    english: "Versão detalhada em inglês",
    groupHome: "Início",
    produtos: "Produtos",
    aplicações: "Aplicações",
    serviços: "Serviços",
    países: "Países",
    allPages: "As nossas páginas em português",
    ctaTitle: "Tem um projeto?",
    ctaBody:
      "Envie a lista de quantidades, desenhos ou uma descrição do projeto: resposta em 24 horas úteis.",
  },
};

export function localizedPath(page: Pick<LocalizedPage, "lang" | "slug">): string {
  return page.slug ? `/${page.lang}/${page.slug}` : `/${page.lang}`;
}

export function getLocalizedPage(lang: string, slug: string): LocalizedPage | undefined {
  return LOCALIZED_PAGES.find((p) => p.lang === lang && p.slug === slug);
}

export function langFromPath(pathname: string): SiteLang {
  const first = pathname.split("/")[1];
  return first === "fr" || first === "pt" ? first : "en";
}

function normalise(pathname: string): string {
  const p = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return p || "/";
}

/** English path that a page (in any language) belongs to, or null. */
export function englishPathFor(pathname: string): string | null {
  const path = normalise(pathname);
  const lang = langFromPath(path);
  if (lang === "en") return path;
  const slug = path.split("/").slice(2).join("/");
  return getLocalizedPage(lang, slug)?.enPath ?? null;
}

/** Every language version of the page at `pathname`, including itself. */
export function alternatesFor(pathname: string): { lang: SiteLang; path: string }[] {
  const en = englishPathFor(pathname);
  if (!en) return [];
  const versions = LOCALIZED_PAGES.filter((p) => p.enPath === en).map((p) => ({
    lang: p.lang as SiteLang,
    path: localizedPath(p),
  }));
  if (versions.length === 0) return [];
  return [{ lang: "en", path: en }, ...versions];
}

/** Where the language switcher should go for `lang` from `pathname`. */
export function switchLanguagePath(pathname: string, lang: SiteLang): string {
  const target = alternatesFor(pathname).find((a) => a.lang === lang);
  if (target) return target.path;
  if (lang === "en") return englishPathFor(pathname) ?? "/";
  return `/${lang}`;
}
