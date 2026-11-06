/* =========================================================
   PRODUCTS.JS — Boutique Corner69
   Produits, catégories, médias, vidéo et avis
   ========================================================= */


/* INFORMATIONS DE LA BOUTIQUE */

const SHOP = {
  name: "CORNER69 🛍️",
  telegram: "https://t.me/@Sully9647",
  whatsapp: "33637104035",            /* ex. "33612345678" : indicatif pays, sans +, sans espaces */
  currency: "EUR"
};


/* WEBHOOK MAKE (facultatif : laissez vide pour désactiver l'envoi) */

const MAKE_WEBHOOK_URL = "";


/* VIDÉO PRINCIPALE DE LA BOUTIQUE */

const VIDEO = {
  type: "file",            /* "file" | "youtube" | "vimeo" */
  src: "assets/video.mp4",
  fallback: "",
  poster: "",
  title: "Découvrez notre plug"
};


/* CATÉGORIES
   Les noms doivent correspondre exactement à ceux des produits. */

const CATEGORIES = [
  "🧽 Mousse",
  "🍫 Choco",
  "🍀 Weed",
  "❄️ Neige",
  "🤯 Synthèse"
];


/* =========================================================
   PRODUITS
   media  : photos et vidéos de la fiche produit (carrousel)
   variants : nom + prix (price: null = prix du produit)
   ========================================================= */

const PRODUCTS = [

  /* PRODUIT 1 — BLUE LOBSTER */

  {
    id: 1,
    name: "Blue Lobster - Mousse premium 🧽🇲🇦",
    category: "🧽 Mousse",
    price: 50,
    featured: 3,
    poster: "assets/img/moussec.webp",
    cover: "assets/img/moussec.webp",              /* vignette du catalogue : format portrait 3/4 (facultatif) */
    desc: "Très bon produit cultivé dans les montagnes du Rif, sa qualité et son prix réunissent un bon compromis 🤝✅",
    media: [
    
     {
        type: "video",
        src: "assets/video/moussev1.mov",
        poster: "assets/img/moussec.webp",
        alt: "Vidéo du produit"
      }

      /*
      Pour ajouter une deuxième photo :

      {
        type: "image",
        src: "assets/img/mousse2.jpg",
        alt: "Deuxième photo"
      }
      */
    ],
    variants: [
      { name: "12G", price: 50 },
      { name: "24G", price: 100 },
      { name: "36G", price: 140 },
      { name: "48G", price: 170 },
      { name: "100G", price: 300 }
    ]
  },


  /* PRODUIT 2 — OLIVE */

  {
    id: 2,
    name: "Olive - 3x filtré 🫒🍫 - Underbranded",
    category: "🍫 Choco",
    price: 70,
    featured: 2,
    emoji: "🍫",
    desc: "Olive 3x filtré no farm, prix et qualité au rendez-vous 🤝🇲🇦.",
    media: [

   {
        type: "video",
        src: "assets/video/olive.mp4",
        poster: "assets/img/oc.JPG",
        alt: "Vidéo du produit"
   }

    ],
    variants: [
      { name: "12G", price: 50 },
      { name: "20G", price: 120 },
      { name: "30G", price: 180 },
      { name: "50G", price: 240 },
      { name: "100G", price: 450 }
    ]
  },


  /* PRODUIT 4 — DRY SIFT */

  {
    id: 4,
    name: "Dry Sift - Underbranded 🥇",
    category: "🍫 Choco",
    price: 200,
    featured: 4,
    emoji: "🍫🇲🇦",
    desc: "Dry Sift no farm, prix et qualité au rendez-vous 🤝🇲🇦 .",
    media: [

         {
        type: "video",
        src: "assets/video/dryv.mov",
        poster: "assets/img/ddc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "50G", price: 200 },
      { name: "100G", price: 350 },
      { name: "1kG", price: 2700 }
    ]
  },


  /* PRODUIT 5 — VVS 3X FILTRÉ */

  {
    id: 5,
    name: "VVS - 3x filtré 🏆",
    category: "🍫 Choco",
    price: 80,
    featured: 5,
    emoji: "🇲🇦",
    desc: "3x filtré de la celebre farm VVS, produit de qualité premium 🤯.",
    media: [

       {
        type: "video",
        src: "assets/video/vvsv.mov",
        poster: "assets/img/vvsc.JPG",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "10G", price: 80 },
      { name: "20G", price: 140 },
      { name: "30G", price: 200 },
      { name: "50G", price: 340 }
    ]
  },


  /* PRODUIT 6 — PLASMA STATIC */

  {
    id: 6,
    name: "Plasma Static - White Truffle 🍯",
    category: "🍫 Choco",
    price: 100,
    featured: 6,
    emoji: "🍯",
    desc: "Plasma Static - White Truffle,  produit premium de haute qualité du vrai miel 🍯.",
    media: [
         {
        type: "video",
        src: "assets/video/plasmav.mp4",
        poster: "assets/img/ppc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
       { name: "5G", price: 100 },
      { name: "10G", price: 180 },
      { name: "25G", price: 300 },
      { name: "50G", price: 550 }
    ]
  },
   
   /* PRODUIT 7 — AMNÉSIA */

  {
    id: 7,
    name: "Amnésia 🇳🇱",
    category: "🍀 Weed",
    price: 70,
    featured: 7,
    emoji: "🇳🇱",
    desc: "Amnésia Haze, Gout et effets assurés ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/amnesiav.mov",
        poster: "assets/img/ac.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "10G", price: 70 },
      { name: "20G", price: 130 },
      { name: "30G", price: 150 },
      { name: "50G", price: 280 }
    ]
   },
   
   /* PRODUIT 8 — CALI SPAIN */

  {
    id: 8,
    name: "Cali Spain 🇪🇸 - Zkittles 🍭",
    category: "🍀 Weed",
    price: 80,
    featured: 8,
    emoji: "🇪🇸",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/calisv.mov",
        poster: "assets/img/csc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "10G", price: 80 },
      { name: "20G", price: 150 },
      { name: "30G", price: 200 },
      { name: "50G", price: 300 }
    ]
   },
   /* PRODUIT 9 — CALI USA */

  {
    id: 9,
    name: "Cali USA 🇺🇸 - Blue Magic",
    category: "🍀 Weed",
    price: 80,
    featured: 9,
    emoji: "🇺🇸",
    desc: "Trés bon produit importé des Etats-unis, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/Caliuv.mov",
        poster: "assets/img/cuc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "5G", price: 80 },
      { name: "10G", price: 150 },
      { name: "25G", price: 250 },
      { name: "50G", price: 500 }
    ]
   },
   

   /* PRODUIT 10 — ÉCAILLE */

  {
    id: 10,
    name: "Écaille 🇨🇴",
    category: "❄️ Neige",
    price: 60,
    featured: 10,
    emoji: "❄️🇨🇴",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/ecaillev.mov",
        poster: "assets/img/ec.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "1G", price: 60 },
      { name: "3G", price: 160 },
      { name: "5G + 1G Offert", price: 300 },
      { name: "10G + 2G Offerts", price: 600 }
    ]
   },
     /* PRODUIT 11 — OLIVE */

  {
    id: 11,
    name: "Olive 🇸🇷",
    category: "❄️ Neige",
    price: 60,
    featured: 11,
    emoji: "❄️🇸🇷",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/olivecv.mov",
        poster: "assets/img/occ.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "1G", price: 60 },
      { name: "3G", price: 160 },
      { name: "5G + 1G Offert", price: 300 },
      { name: "10G + 2G Offerts", price: 600 }
    ]
   },
     /* PRODUIT 12 - TAZ */

  {
    id: 12,
    name: "Taz 🍬",
    category: "🤯 Synthèse",
    price: 50,
    featured: 12,
    emoji: "🍬🇳🇱",
    desc: "Taz 320Mg ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/tazv.mov",
        poster: "assets/img/tc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "10", price: 50 },
      { name: "20", price: 70 },
      { name: "50", price: 130 },
      { name: "100", price: 220 }
    ]
   },
     /* PRODUIT 3 — KETAMINE */

  {
    id: 3,
    name: "Kétamine",
    category: "🤯 Synthèse",
    price: 30,
    featured: 13,
    emoji: "🤯🇳🇱",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/kv.mov",
        poster: "assets/img/kc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "1G", price: 30 },
      { name: "3G", price: 70 },
      { name: "5G", price: 100 },
      { name: "10G", price: 140 }
    ]
   },
    
   /* PRODUIT 14 — 3M */

  {
    id: 13,
    name: "3M 🇳🇱",
    category: "🤯 Synthèse",
    price: 60,
    featured: 14,
    emoji: "🇳🇱",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
     {
        type: "video",
        src: "assets/video/mdv.mov",
        poster: "assets/img/3mc.webp",
        alt: "Vidéo du produit"
     }

    ],
    variants: [
      { name: "1G", price: 30 },
      { name: "3G", price: 70 },
      { name: "5G", price: 100 },
      { name: "10G", price: 140 }
    ]
   },
   /* PRODUIT 14 — MD */

  {
    id: 14,
    name: "MD 🇳🇱",
    category: "🤯 Synthèse",
    price: 60,
    featured: 15,
    emoji: "🇳🇱",
    desc: "Trés bon produit, gout et effets garantis ✅.",
    media: [
         {
        type: "video",
        src: "assets/video/mdv.mov",
        poster: "assets/img/mdc.webp",
        alt: "Vidéo du produit"
      }

    ],
    variants: [
      { name: "1G", price: 30 },
      { name: "3G", price: 70 },
      { name: "5G", price: 100 },
      { name: "10G", price: 140 }
    ]
   }
   
];


/* =========================================================
   AVIS
   ========================================================= */

const SAMPLE_REVIEWS = [

  {
    name: "MarionD",
    rating: 4,
    text: "Super, merci !",
    sample: true
  },

  {
    name: "juju693",
    rating: 5,
    text: "Contact et livreur au top bravo 👏",
    sample: true
  }

];
