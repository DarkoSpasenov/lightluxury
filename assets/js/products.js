/* ============================================================
   LIGHT LUXURY — CATALOGUE BOUTIQUE / CONFIGURATEUR
   ------------------------------------------------------------
   Chaque "produit" pointe vers une prestation réelle de
   SERVICES_PRICING. Aucune prestation n'est inventée ici.
   ============================================================ */

const PRODUCTS_CATALOG = [
  {
    id: "star-headliner",
    category: "ciel-etoile",
    categoryLabel: "Ciels étoilés",
    name: "Ciel étoilé",
    shortDescription: "De 200 à 900 étoiles, avec options bicolore, scintillant, étoile filante et logo personnalisé.",
    image: "assets/images/ciels-etoiles/ciel-etoile-bmw-m3-multicolore.jpg",
    priceFrom: 150,
    configuratorUrl: "ciel-etoile.html"
  },
  {
    id: "roof-liner",
    category: "pavillon",
    categoryLabel: "Rénovation de pavillon",
    name: "Rénovation de pavillon",
    shortDescription: "5 formules exclusives : tissu OEM, Alcantara partiel ou intégral, changement de couleur ou passage complet en noir.",
    image: "assets/images/realisations/infographie-prix-pavillon.jpg",
    priceFrom: 280,
    configuratorUrl: "renovation-pavillon.html"
  },
  {
    id: "custom-steering-wheel",
    category: "volant",
    categoryLabel: "Volants sur mesure",
    name: "Volant sur mesure",
    shortDescription: "Carbone, Alcantara ou cuir, repère 12h, palettes, chauffant... confectionné sur mesure en Allemagne.",
    image: "assets/images/volants/volant-amg-carbone.jpg",
    priceFrom: null,
    configuratorUrl: "volants-sur-mesure.html"
  },
  {
    id: "ambient-lighting",
    category: "eclairage",
    categoryLabel: "Éclairage d’ambiance",
    name: "Éclairage d’ambiance",
    shortDescription: "Zones lumineuses personnalisées, couleur unique ou multicolore, avec ou sans animation.",
    image: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
    priceFrom: null,
    configuratorUrl: "eclairage-ambiance.html"
  },
  {
    id: "interior-customization",
    category: "personnalisation",
    categoryLabel: "Personnalisation intérieure",
    name: "Personnalisation intérieure",
    shortDescription: "Un projet spécial pour votre intérieur ? Décrivez-le, Light Luxury étudie sa faisabilité.",
    image: "assets/images/atelier/atelier-lamborghini-urus.jpg",
    priceFrom: null,
    configuratorUrl: "boutique.html",
    openModal: true
  },
  {
    id: "carplay-installation",
    category: "personnalisation",
    categoryLabel: "Personnalisation intérieure",
    name: "Installation de CarPlay",
    shortDescription: "Installation d’une solution Apple CarPlay et Android Auto compatible avec le système multimédia du véhicule. Une intégration propre permettant d’utiliser la navigation, la musique, les appels et les applications compatibles directement depuis l’écran du véhicule.",
    image: "assets/images/atelier/atelier-mercedes-g63.jpg",
    priceFrom: null,
    configuratorUrl: "boutique.html",
    openModal: true
  },
  {
    id: "angel-eyes-installation",
    category: "personnalisation",
    categoryLabel: "Personnalisation intérieure",
    name: "Installation d’Angel Eyes RGB ou jaunes",
    shortDescription: "Installation d’Angel Eyes personnalisés disponibles en version RGB multicolore ou en éclairage jaune. Une modification esthétique réalisée avec une intégration propre et adaptée au véhicule.",
    image: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
    priceFrom: null,
    configuratorUrl: "boutique.html",
    openModal: true
  }
];
