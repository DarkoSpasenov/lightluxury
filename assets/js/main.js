/* ============================================================
   LIGHT LUXURY — MAIN.JS
   Fond étoilé animé + navigation + recherche + utilitaires
   ============================================================ */

/* ------------------------------------------------------------
   1. FOND ÉTOILÉ (canvas léger, performant)
   ------------------------------------------------------------ */
(function starfield() {
  const canvases = document.querySelectorAll("[data-starfield]");
  if (!canvases.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const density = parseInt(canvas.dataset.density || "140", 10);
    const shootingStars = canvas.dataset.shootingStars !== "false" && !reduceMotion;
    let width, height, stars, comets = [];
    let rafId;

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function makeStars() {
      const count = Math.round((density * (width * height)) / (1920 * 1080));
      stars = Array.from({ length: Math.max(count, 40) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.003,
        hue: Math.random() > 0.82 ? "blue" : "white"
      }));
    }

    function maybeSpawnComet() {
      if (!shootingStars) return;
      if (Math.random() < 0.0035 && comets.length < 2) {
        const y0 = Math.random() * height * 0.5;
        comets.push({
          x: Math.random() * width * 0.4,
          y: y0,
          len: 90 + Math.random() * 90,
          speed: 9 + Math.random() * 6,
          angle: Math.PI / 5,
          life: 1
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        const twinkle = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.25;
        const alpha = Math.max(0.15, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.fillStyle = s.hue === "blue" ? `rgba(72,167,255,${alpha})` : `rgba(245,245,245,${alpha})`;
        ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduceMotion) {
        maybeSpawnComet();
        comets.forEach((c) => {
          const dx = Math.cos(c.angle) * c.len;
          const dy = Math.sin(c.angle) * c.len;
          const grad = ctx.createLinearGradient(c.x, c.y, c.x - dx, c.y - dy);
          grad.addColorStop(0, `rgba(255,255,255,${0.85 * c.life})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x - dx, c.y - dy);
          ctx.stroke();

          c.x += Math.cos(c.angle) * c.speed;
          c.y += Math.sin(c.angle) * c.speed;
          c.life -= 0.012;
        });
        comets = comets.filter((c) => c.life > 0 && c.x < width + 200 && c.y < height + 200);
      }

      if (!reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    makeStars();
    window.addEventListener("resize", () => {
      resize();
      makeStars();
    });

    if (reduceMotion) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  });
})();

/* ------------------------------------------------------------
   2. NAVIGATION — sticky, dropdown, menu mobile
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const burger = document.getElementById("burger-btn");
  const mobileNav = document.getElementById("mobile-nav");

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll(".has-dropdown > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".has-dropdown");
      const isOpen = parent.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".has-dropdown.is-open").forEach((el) => {
      if (!el.contains(e.target)) {
        el.classList.remove("is-open");
        el.querySelector("button")?.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Coordonnées dynamiques */
  hydrateContactInfo();

  /* Recherche site */
  initSiteSearch();

  /* Galerie + lightbox (page d'accueil et page réalisations) */
  if (typeof GalleryModule !== "undefined") {
    GalleryModule.initLightboxControls();
    const homeGrid = document.getElementById("home-gallery-grid");
    const homeBar = document.getElementById("home-filter-bar");
    if (homeGrid) {
      GalleryModule.renderGrid(homeGrid, "all");
      GalleryModule.initFilters(homeBar, homeGrid);
    }
    const mainGrid = document.getElementById("gallery-grid");
    const mainBar = document.getElementById("gallery-filter-bar");
    if (mainGrid) {
      GalleryModule.renderGrid(mainGrid, "all");
      GalleryModule.initFilters(mainBar, mainGrid);
    }
  }

  /* Boutique / catalogue */
  if (typeof ShopModule !== "undefined" && document.getElementById("shop-grid")) {
    ShopModule.initCatalogPage({
      gridEl: document.getElementById("shop-grid"),
      searchInput: document.getElementById("shop-search"),
      categorySelect: document.getElementById("shop-category"),
      sortSelect: document.getElementById("shop-sort")
    });
  }
});

/* ------------------------------------------------------------
   3. COORDONNÉES DYNAMIQUES (jamais de fausses infos)
   ------------------------------------------------------------ */
function hydrateContactInfo() {
  document.querySelectorAll("[data-contact='phone']").forEach((el) => {
    el.textContent = ContactHelpers.hasPhone() ? BUSINESS_CONFIG.phone : "Coordonnées prochainement disponibles";
    if (ContactHelpers.hasPhone()) el.setAttribute("href", "tel:" + BUSINESS_CONFIG.phone.replace(/\s/g, ""));
  });
  document.querySelectorAll("[data-contact='email']").forEach((el) => {
    el.textContent = ContactHelpers.hasEmail() ? BUSINESS_CONFIG.email : "Coordonnées prochainement disponibles";
    if (ContactHelpers.hasEmail()) el.setAttribute("href", "mailto:" + BUSINESS_CONFIG.email);
  });
  document.querySelectorAll("[data-contact='address']").forEach((el) => {
    el.textContent = ContactHelpers.hasAddress()
      ? `${BUSINESS_CONFIG.address}, ${BUSINESS_CONFIG.postalCode} ${BUSINESS_CONFIG.city}`
      : "Adresse prochainement disponible";
  });
  document.querySelectorAll("[data-contact='legal-name']").forEach((el) => {
    el.textContent = (BUSINESS_CONFIG.legalName && !BUSINESS_CONFIG.legalName.includes("À COMPLÉTER"))
      ? BUSINESS_CONFIG.legalName
      : "Raison sociale prochainement disponible";
  });
  document.querySelectorAll("[data-contact='instagram']").forEach((el) => {
    if (ContactHelpers.hasInstagram()) {
      el.setAttribute("href", BUSINESS_CONFIG.instagram);
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });
  document.querySelectorAll("[data-contact='google-reviews']").forEach((el) => {
    if (ContactHelpers.hasGoogleReviews()) {
      el.setAttribute("href", BUSINESS_CONFIG.googleReviewsUrl);
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });
  document.querySelectorAll("[data-contact='hours']").forEach((el) => {
    if (!ContactHelpers.hasOpeningHours()) {
      el.textContent = "Horaires communiqués prochainement";
      return;
    }
    const labels = { monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi", friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche" };
    el.innerHTML = Object.entries(BUSINESS_CONFIG.openingHours)
      .filter(([, v]) => v)
      .map(([k, v]) => `<div class="hours-row"><span>${labels[k]}</span><span>${v}</span></div>`)
      .join("");
  });
}

/* ------------------------------------------------------------
   4. RECHERCHE LOCALE (sans serveur)
   ------------------------------------------------------------ */
function initSiteSearch() {
  const input = document.getElementById("site-search-input");
  const resultsEl = document.getElementById("site-search-results");
  const toggleBtn = document.getElementById("search-toggle-btn");
  const searchPanel = document.getElementById("search-panel");

  if (toggleBtn && searchPanel) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = searchPanel.classList.toggle("is-open");
      if (isOpen && input) input.focus();
    });
  }

  if (!input || !resultsEl) return;

  const index = [
    ...((typeof PRODUCTS_CATALOG !== "undefined") ? PRODUCTS_CATALOG.map((p) => ({
      title: p.name, desc: p.shortDescription, url: p.configuratorUrl, tag: p.categoryLabel
    })) : []),
    ...((typeof REALISATIONS !== "undefined") ? REALISATIONS.map((r) => ({
      title: r.title, desc: "Réalisation Light Luxury", url: "realisations.html", tag: "Réalisation"
    })) : []),
    { title: "Ciel étoilé", desc: "200 à 900 étoiles, options bicolore, scintillant, logo", url: "ciel-etoile.html", tag: "Prestation" },
    { title: "Rénovation de pavillon", desc: "Alcantara, tissu OEM, changement de couleur", url: "renovation-pavillon.html", tag: "Prestation" },
    { title: "Volants sur mesure", desc: "Carbone, Alcantara, cuir — sur devis", url: "volants-sur-mesure.html", tag: "Prestation" },
    { title: "Éclairage d’ambiance", desc: "Zones lumineuses personnalisées", url: "eclairage-ambiance.html", tag: "Prestation" },
    { title: "BMW", desc: "Projets réalisés sur BMW", url: "realisations.html", tag: "Marque" },
    { title: "Audi", desc: "Projets réalisés sur Audi", url: "realisations.html", tag: "Marque" },
    { title: "Mercedes", desc: "Projets réalisés sur Mercedes", url: "realisations.html", tag: "Marque" },
    { title: "Lamborghini", desc: "Projets réalisés sur Lamborghini", url: "realisations.html", tag: "Marque" },
    { title: "Carbone", desc: "Volants en carbone brillant ou mat", url: "volants-sur-mesure.html", tag: "Matériau" },
    { title: "Alcantara", desc: "Pavillons et volants en Alcantara", url: "renovation-pavillon.html", tag: "Matériau" }
  ];

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    if (term.length < 2) {
      resultsEl.innerHTML = "";
      return;
    }
    const matches = index.filter(
      (it) => it.title.toLowerCase().includes(term) || it.desc.toLowerCase().includes(term)
    ).slice(0, 8);

    resultsEl.innerHTML = matches.length
      ? matches.map((m) => `<a class="search-result" href="${m.url}"><span class="tag">${m.tag}</span><strong>${m.title}</strong><span>${m.desc}</span></a>`).join("")
      : `<p class="empty-state">Aucun résultat pour « ${input.value} ».</p>`;
  });
}
