/* ============================================================
   LIGHT LUXURY — GRILLE TARIFAIRE
   ------------------------------------------------------------
   ATTENTION : ces prix sont fournis par Light Luxury.
   Ne pas modifier sans consigne explicite du client.
   ============================================================ */

const SERVICES_PRICING = {
  starHeadliner: {
    id: "star-headliner",
    name: "Ciel étoilé",
    slug: "ciel-etoile",
    type: "configurable",
    image: "assets/images/ciels-etoiles/ciel-etoile-bmw-m3-multicolore.jpg",
    packages: [
      { id: "stars-200", name: "200 étoiles", stars: 200, price: 150 },
      { id: "stars-300", name: "300 étoiles", stars: 300, price: 250 },
      { id: "stars-400", name: "400 étoiles", stars: 400, price: 350 },
      { id: "stars-500", name: "500 étoiles", stars: 500, price: 450 },
      { id: "stars-600", name: "600 étoiles", stars: 600, price: 530 },
      { id: "stars-700", name: "700 étoiles", stars: 700, price: 640 },
      { id: "stars-800", name: "800 étoiles", stars: 800, price: 700 },
      { id: "stars-900", name: "900 étoiles", stars: 900, price: 830 }
    ],
    options: [
      { id: "shooting-star", name: "Étoile filante", price: 80 },
      { id: "twinkle", name: "Effet scintillant", price: 50 },
      { id: "two-colour", name: "Configuration bicolore", price: 100 },
      { id: "custom-logo", name: "Logo personnalisé", price: 130 }
    ]
  },

  roofLiner: {
    id: "roof-liner",
    name: "Rénovation de pavillon",
    slug: "renovation-pavillon",
    type: "exclusive-package",
    image: "assets/images/realisations/infographie-prix-pavillon.jpg",
    packages: [
      { id: "oem-fabric", name: "Changement de tissu, couleur OEM", price: 390 },
      { id: "alcantara-roof-only", name: "Passage du pavillon en Alcantara, uniquement le toit", price: 330 },
      { id: "full-alcantara", name: "Passage intégral en Alcantara", price: 430 },
      { id: "roof-colour-change", name: "Changement de couleur du pavillon uniquement", price: 280 },
      { id: "complete-black-conversion", name: "Changement complet en noir avec les éléments du pavillon", price: 480 }
    ]
  },

  customSteeringWheel: {
    id: "custom-steering-wheel",
    name: "Volants sur mesure",
    slug: "volants-sur-mesure",
    type: "quote-only",
    image: "assets/images/volants/volant-amg-carbone.jpg",
    price: null,
    priceLabel: "Sur devis"
  },

  ambientLighting: {
    id: "ambient-lighting",
    name: "Éclairage d’ambiance",
    slug: "eclairage-ambiance",
    type: "quote-only",
    image: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
    price: null,
    priceLabel: "Sur devis"
  },

  interiorCustomization: {
    id: "interior-customization",
    name: "Personnalisation intérieure",
    slug: "personnalisation-interieure",
    type: "quote-only",
    image: "assets/images/atelier/atelier-mercedes-g63.jpg",
    price: null,
    priceLabel: "Sur devis"
  },

  /* ----------------------------------------------------------------
     NOUVELLES PRESTATIONS — emplacement prêt à compléter.
     Pour ajouter le prix définitif : remplacer `price: null` par le
     montant en CHF (nombre). Pour changer la photo : remplacer la
     valeur de `image` par le chemin de la photo dédiée une fois
     disponible dans assets/images/.
     ---------------------------------------------------------------- */
  carPlayInstallation: {
    id: "carplay-installation",
    name: "Installation de CarPlay",
    slug: "installation-carplay",
    type: "quote-only",
    image: "assets/images/atelier/atelier-mercedes-g63.jpg", // TODO: remplacer par une photo dédiée CarPlay
    price: null, // TODO: ajouter le prix une fois communiqué
    priceLabel: "Sur devis"
  },

  angelEyesInstallation: {
    id: "angel-eyes-installation",
    name: "Installation d’Angel Eyes RGB ou jaunes",
    slug: "installation-angel-eyes",
    type: "variant-quote",
    image: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg", // TODO: remplacer par une photo dédiée Angel Eyes
    price: null, // TODO: ajouter le prix une fois communiqué
    priceLabel: "Sur devis",
    variants: [
      { id: "rgb", name: "RGB multicolore" },
      { id: "yellow", name: "Jaune" }
    ]
  }
};

/* ------------------------------------------------------------
   Formatage des prix au format suisse : CHF 390.–  /  CHF 1’190.–
   ------------------------------------------------------------ */
function formatCHF(amount) {
  if (amount === null || amount === undefined) return "Sur devis";
  const rounded = Math.round(amount);
  const withApostrophe = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  return `CHF ${withApostrophe}.–`;
}

/* Récupère une prestation par son id */
function getServiceById(id) {
  return Object.values(SERVICES_PRICING).find((s) => s.id === id) || null;
}
