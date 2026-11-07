/* =========================================================
   PRODUCTS.JS — Boutique Winterfell38
   Produits, catégories, médias, vidéo et avis
   ========================================================= */

/* INFORMATIONS DE LA BOUTIQUE */

const SHOP = {
  name: "WINTERFELL38 ❄️",
  telegram: "https://t.me/Winterfell388",
  whatsapp: "33773921125",
  currency: "EUR"
};

/* WEBHOOK MAKE (facultatif : laissez vide pour désactiver l'envoi) */

const MAKE_WEBHOOK_URL = "";

/* VIDÉO PRINCIPALE DE LA BOUTIQUE
   IMPORTANT : le conteneur doit être du .mp4 (H.264 + AAC).
   Les navigateurs ne lisent PAS le .mov — ils proposent le téléchargement.
   Conversion : ffmpeg -i video.mov -c:v libx264 -crf 23 -c:a aac \
                       -movflags +faststart video.mp4 */

const VIDEO = {
  type: "file",                    /* "file" | "youtube" | "vimeo" */
  src: "assets/video.mp4",
  fallback: "",
  poster: "",
  title: "Découvrez notre plug"
};

/* CATÉGORIES */

const CATEGORIES = [
  "❄️ Neige",
  "🤯 Synthèse"
];

/* =========================================================
   PRODUITS
   media    : photos et vidéos de la fiche produit (carrousel)
              → conteneur .mp4 obligatoire pour les vidéos
   variants : nom + prix (price: null = prix du produit)
   ========================================================= */

const PRODUCTS = [

  /* PRODUIT 1 — ÉCAILLE */

  {
    id: 1,
    name: "Écaille 🇨🇴",
    category: "❄️ Neige",
    price: 40,
    featured: 1,
    emoji: "❄️🇨🇴",
    desc: "Très bon produit, goût et effets garantis ✅.",
    media: [
      {
        type: "video",
        src: "assets/video/ecaillev.mov",
        poster: "assets/img/ecaill.JPEG",
        alt: "Vidéo du produit"
      }
    ],
    variants: [
      { name: "0,5G", price: 20 },
      { name: "1G", price: 40 },
      { name: "3G", price: 100 },
      { name: "5G", price: 170 },
      { name: "10G", price: 300 }
    ]
  },

  /* PRODUIT 2 — OLIVE */

  {
    id: 11,
    name: "Olive 🇸🇷",
    category: "❄️ Neige",
    price: 50,
    featured: 2,
    emoji: "❄️🇸🇷",
    desc: "Très bon produit, goût et effets garantis ✅.",
    media: [
      {
        type: "video",
        src: "assets/video/olivecv.mov",
        poster: "assets/img/olive.JPG",
        alt: "Vidéo du produit"
      }
    ],
    variants: [
      { name: "1G", price: 50 },
      { name: "3G", price: 130 },
      { name: "5G", price: 200 },
      { name: "10G", price: 380 }
    ]
  },

  /* PRODUIT 3 — TAZ */

  {
    id: 12,
    name: "Taz 🍬",
    category: "🤯 Synthèse",
    price: 3,
    featured: 12,
    emoji: "🍬🇳🇱",
    desc: "Taz 320Mg ✅.",
    media: [
      {
        type: "video",
        src: "assets/video/tazv.mov",
        poster: "assets/img/taaz.JPG",
        alt: "Vidéo du produit"
      }
    ],
    variants: [
      { name: "1", price: 10 },
      { name: "5", price: 30 },
      { name: "10", price: 50 },
      { name: "20", price: 70 }
    ]
  },

  /* PRODUIT 4 — KÉTAMINE */

  {
    id: 4,
    name: "Kétamine",
    category: "🤯 Synthèse",
    price: 20,
    featured: 4,
    emoji: "🤯🇳🇱",
    desc: "Très bon produit, goût et effets garantis ✅.",
    media: [
      {
        type: "video",
        src: "assets/video/kv.mov",
        poster: "assets/img/ke.JPEG",
        alt: "Vidéo du produit"
      }
    ],
    variants: [
      { name: "1G", price: 20 },
      { name: "3G", price: 50 },
      { name: "5G", price: 80 },
      { name: "10G", price: 110 }
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
    name: "juju383",
    rating: 5,
    text: "Contact et livreur au top bravo 👏",
    sample: true
  }

];
