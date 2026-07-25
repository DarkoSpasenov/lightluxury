/* ============================================================
   LIGHT LUXURY — CONFIGURATION CENTRALE
   ------------------------------------------------------------
   Modifiez UNIQUEMENT ce fichier pour mettre à jour :
   - les coordonnées de l'entreprise
   - le numéro WhatsApp
   - les liens réseaux sociaux
   - les horaires d'ouverture
   ============================================================ */

const BUSINESS_CONFIG = {
  businessName: "Light Luxury",
  legalName: "[RAISON SOCIALE À COMPLÉTER]",

  // Format international SANS le "+" ni espaces, ex: 41791234567
  phone: "41764966638",
  whatsapp: "", // ex: "41791234567" — laisser vide tant que non configuré

  email: "contact@light-luxury.ch",

  address: "[ADRESSE À COMPLÉTER]",
  postalCode: "[CODE POSTAL À COMPLÉTER]",
  city: "[VILLE À COMPLÉTER]",
  canton: "[CANTON À COMPLÉTER]",
  country: "Suisse",

  instagram: "", // ex: "https://instagram.com/light.luxury"
  googleReviewsUrl: "", // ex: lien Google Business

  openingHours: {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
  },

  paymentMethods: ["Cash", "TWINT"],
  depositPercent: 50,

  since: 2023
};

/* ------------------------------------------------------------
   Helpers de coordonnées — n'affichent jamais de fausses infos.
   Retourne null si l'info n'est pas encore configurée.
   ------------------------------------------------------------ */
const ContactHelpers = {
  hasWhatsapp() {
    return typeof BUSINESS_CONFIG.whatsapp === "string" && BUSINESS_CONFIG.whatsapp.trim().length > 0;
  },
  hasPhone() {
    return BUSINESS_CONFIG.phone && !BUSINESS_CONFIG.phone.includes("À COMPLÉTER");
  },
  hasEmail() {
    return BUSINESS_CONFIG.email && !BUSINESS_CONFIG.email.includes("À COMPLÉTER");
  },
  hasAddress() {
    return BUSINESS_CONFIG.address && !BUSINESS_CONFIG.address.includes("À COMPLÉTER");
  },
  hasInstagram() {
    return typeof BUSINESS_CONFIG.instagram === "string" && BUSINESS_CONFIG.instagram.trim().length > 0;
  },
  hasGoogleReviews() {
    return typeof BUSINESS_CONFIG.googleReviewsUrl === "string" && BUSINESS_CONFIG.googleReviewsUrl.trim().length > 0;
  },
  hasOpeningHours() {
    return Object.values(BUSINESS_CONFIG.openingHours).some((v) => v && v.trim().length > 0);
  }
};
