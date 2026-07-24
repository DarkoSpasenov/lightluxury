/* ============================================================
   LIGHT LUXURY — CONTENU DES PRESTATIONS
   ============================================================ */

const SERVICES_CONTENT = {
  "star-headliner": {
    title: "Ciel étoilé",
    tagline: "Un ciel étoilé sur mesure, directement dans votre habitacle",
    description:
      "Le ciel étoilé transforme votre pavillon en une véritable voûte céleste grâce à des centaines de fibres optiques intégrées. Le nombre d’étoiles, les couleurs et les options sont choisis selon vos envies et la configuration de votre véhicule.",
    heroImage: "assets/images/ciels-etoiles/ciel-etoile-bmw-m3-multicolore.jpg",
    gallery: [
      "assets/images/ciels-etoiles/ciel-etoile-bmw-m3-multicolore.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-bmw-bleu-vert.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-bleu-turquoise.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-urus-blanc.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-violet-rose.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-violet-bmw-m4.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-audi-rs-panoramique.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-bmw-m4-orange.jpg"
    ],
    faq: [
      {
        q: "Combien d’étoiles choisir ?",
        a: "Cela dépend de la taille de votre pavillon et de l’effet recherché. Un rendu discret se fait généralement avec 200 à 400 étoiles, tandis qu’un ciel plus dense et immersif se situe entre 600 et 900 étoiles."
      },
      {
        q: "Peut-on choisir les couleurs ?",
        a: "Oui. Une couleur principale est incluse dans chaque formule. L’option bicolore permet d’ajouter une deuxième couleur."
      },
      {
        q: "Peut-on ajouter un logo ?",
        a: "Oui, avec l’option logo personnalisé. Vous pouvez décrire le logo souhaité et joindre une image en prévisualisation ; le fichier définitif sera transmis séparément lors de l’échange WhatsApp."
      },
      {
        q: "Est-ce compatible avec un toit ouvrant ou panoramique ?",
        a: "La compatibilité dépend du type de toit et de la configuration du véhicule. Précisez-le dans le configurateur : Light Luxury confirmera la faisabilité dans le devis."
      },
      {
        q: "Comment confirmer le projet ?",
        a: "Une fois votre configuration envoyée sur WhatsApp, Light Luxury revient vers vous pour confirmer le devis, la disponibilité et l’acompte de 50 % nécessaire à la réservation."
      }
    ]
  },

  "roof-liner": {
    title: "Rénovation de pavillon",
    tagline: "Redonnez une seconde vie à votre pavillon",
    description:
      "Changement de tissu, passage en Alcantara ou changement de couleur : chaque formule de rénovation de pavillon est réalisée avec soin dans notre atelier, en respectant les lignes d’origine de votre véhicule.",
    heroImage: "assets/images/atelier/atelier-mercedes-g63.jpg",
    gallery: [
      "assets/images/atelier/atelier-mercedes-g63.jpg",
      "assets/images/atelier/atelier-lamborghini-urus.jpg",
      "assets/images/realisations/infographie-prix-pavillon.jpg"
    ],
    faq: [
      {
        q: "Le prix peut-il changer ?",
        a: "Une adaptation du tarif peut être proposée lorsque l’élément est déjà démonté et éventuellement nettoyé. Le montant définitif est confirmé dans le devis."
      },
      {
        q: "Puis-je choisir n’importe quelle couleur ?",
        a: "Les couleurs disponibles dépendent du matériau choisi. Indiquez votre couleur actuelle et souhaitée dans le formulaire : Light Luxury vous confirme la faisabilité."
      }
    ]
  },

  "custom-steering-wheel": {
    title: "Volants sur mesure",
    tagline: "Un volant unique, confectionné pour votre véhicule",
    description:
      "Tous nos volants sont confectionnés sur mesure en Allemagne. Pour établir une proposition, nous avons besoin de la marque, du modèle, de l’année et de la configuration souhaitée. Le délai indicatif est de trois à quatre semaines. Une livraison à domicile ou une installation dans notre atelier peut être organisée.",
    heroImage: "assets/images/volants/volant-amg-carbone.jpg",
    gallery: [
      "assets/images/volants/volant-amg-carbone.jpg",
      "assets/images/volants/volant-bmw-m-carbone.jpg",
      "assets/images/volants/volant-detail.jpg"
    ],
    faq: [
      {
        q: "Quel est le délai de fabrication ?",
        a: "Le délai indicatif est de trois à quatre semaines à partir de la confirmation du projet."
      },
      {
        q: "Puis-je reprendre mon volant d’origine ?",
        a: "Oui, la reprise du volant d’origine peut être proposée. Indiquez-le dans le configurateur."
      },
      {
        q: "Livraison ou installation ?",
        a: "Une livraison à domicile ou une installation dans notre atelier peuvent être organisées selon votre préférence."
      }
    ]
  },

  "ambient-lighting": {
    title: "Éclairage d’ambiance",
    tagline: "Une ambiance lumineuse personnalisée pour votre habitacle",
    description:
      "L’éclairage d’ambiance met en valeur l’intérieur de votre véhicule grâce à des zones lumineuses personnalisées, en couleur unique ou multicolore, avec ou sans animation.",
    heroImage: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
    gallery: [
      "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
      "assets/images/ciels-etoiles/ciel-etoile-bleu-turquoise.jpg"
    ],
    faq: [
      {
        q: "Quelles zones peuvent être éclairées ?",
        a: "Portières, plancher, console centrale, contours de tableau de bord... précisez vos zones souhaitées dans le configurateur, Light Luxury étudiera la faisabilité."
      }
    ]
  },

  "interior-customization": {
    title: "Personnalisation intérieure",
    tagline: "Votre projet, sur mesure",
    description:
      "Une catégorie dédiée aux projets spéciaux de personnalisation intérieure qui ne rentrent pas dans une prestation standard. Décrivez votre idée, Light Luxury étudie sa faisabilité.",
    heroImage: "assets/images/atelier/atelier-lamborghini-urus.jpg",
    gallery: ["assets/images/atelier/atelier-lamborghini-urus.jpg"],
    faq: []
  },

  "carplay-installation": {
    title: "Installation de CarPlay",
    tagline: "Apple CarPlay et Android Auto, intégrés proprement",
    description:
      "Installation d’une solution Apple CarPlay et Android Auto compatible avec le système multimédia du véhicule. Une intégration propre permettant d’utiliser la navigation, la musique, les appels et les applications compatibles directement depuis l’écran du véhicule.",
    heroImage: "assets/images/atelier/atelier-mercedes-g63.jpg",
    gallery: ["assets/images/atelier/atelier-mercedes-g63.jpg"],
    faq: []
  },

  "angel-eyes-installation": {
    title: "Installation d’Angel Eyes RGB ou jaunes",
    tagline: "RGB multicolore ou jaune, au choix",
    description:
      "Installation d’Angel Eyes personnalisés disponibles en version RGB multicolore ou en éclairage jaune. Une modification esthétique réalisée avec une intégration propre et adaptée au véhicule.",
    heroImage: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg",
    gallery: ["assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg"],
    faq: []
  }
};
