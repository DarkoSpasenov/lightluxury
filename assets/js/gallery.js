/* ============================================================
   LIGHT LUXURY — RÉALISATIONS (GALERIE + LIGHTBOX)
   ============================================================ */

const REALISATIONS = [
  { id: "r1", category: "ciel-etoile", title: "Ciel étoilé multicolore — BMW M3", image: "assets/images/ciels-etoiles/ciel-etoile-bmw-m3-multicolore.jpg" },
  { id: "r2", category: "ciel-etoile", title: "Ciel étoilé bleu et vert — Intérieur BMW", image: "assets/images/ciels-etoiles/ciel-etoile-bmw-bleu-vert.jpg" },
  { id: "r3", category: "ciel-etoile", title: "Ciel étoilé bleu turquoise", image: "assets/images/ciels-etoiles/ciel-etoile-bleu-turquoise.jpg" },
  { id: "r4", category: "ciel-etoile", title: "Ciel étoilé blanc — Lamborghini Urus", image: "assets/images/ciels-etoiles/ciel-etoile-urus-blanc.jpg" },
  { id: "r5", category: "ciel-etoile", title: "Ciel étoilé bleu classique", image: "assets/images/ciels-etoiles/ciel-etoile-bleu-classique.jpg" },
  { id: "r6", category: "ciel-etoile", title: "Ciel étoilé violet et rose", image: "assets/images/ciels-etoiles/ciel-etoile-violet-rose.jpg" },
  { id: "r7", category: "ciel-etoile", title: "Ciel étoilé violet — Intérieur BMW M4", image: "assets/images/ciels-etoiles/ciel-etoile-violet-bmw-m4.jpg" },
  { id: "r8", category: "ciel-etoile", title: "Ciel étoilé panoramique — Intérieur Audi RS", image: "assets/images/ciels-etoiles/ciel-etoile-audi-rs-panoramique.jpg" },
  { id: "r9", category: "ciel-etoile", title: "Ciel étoilé bleu et vert — Intérieur BMW M4", image: "assets/images/ciels-etoiles/ciel-etoile-bmw-m4-orange.jpg" },
  { id: "r10", category: "ciel-etoile", title: "Ciel étoilé visible — Intérieur Audi", image: "assets/images/ciels-etoiles/ciel-etoile-audi-habitacle.jpg" },
  { id: "r11", category: "volant", title: "Volant sur mesure AMG carbone", image: "assets/images/volants/volant-amg-carbone.jpg" },
  { id: "r12", category: "volant", title: "Volant sur mesure BMW M carbone", image: "assets/images/volants/volant-bmw-m-carbone.jpg" },
  { id: "r13", category: "volant", title: "Détail volant sur mesure", image: "assets/images/volants/volant-detail.jpg" },
  { id: "r14", category: "atelier", title: "Projet Light Luxury — Lamborghini Urus", image: "assets/images/atelier/atelier-lamborghini-urus.jpg" },
  { id: "r15", category: "atelier", title: "Projet Light Luxury — Mercedes-AMG G63", image: "assets/images/atelier/atelier-mercedes-g63.jpg" },
  { id: "r16", category: "pavillon", title: "Grille tarifaire — Rénovation de pavillon", image: "assets/images/realisations/infographie-prix-pavillon.jpg" }
];

const GalleryModule = (() => {
  let currentList = [];
  let currentIndex = 0;

  function renderGrid(containerEl, filter = "all") {
    if (!containerEl) return;
    const list = filter === "all" ? REALISATIONS : REALISATIONS.filter((r) => r.category === filter);
    currentList = list;
    containerEl.innerHTML = list
      .map(
        (item, i) => `
      <div class="slider-slide">
        <figure class="gallery-item" data-index="${i}" tabindex="0" role="button" aria-label="Agrandir : ${item.title}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" width="600" height="600" />
          <figcaption>${item.title}</figcaption>
        </figure>
      </div>`
      )
      .join("");

    containerEl.querySelectorAll(".gallery-item").forEach((el) => {
      el.addEventListener("click", () => openLightbox(parseInt(el.dataset.index, 10)));
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") openLightbox(parseInt(el.dataset.index, 10));
      });
    });

    const sliderRoot = containerEl.closest(".slider");
    if (sliderRoot && typeof SliderModule !== "undefined") {
      SliderModule.mount(sliderRoot);
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    updateLightbox();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const item = currentList[currentIndex];
    if (!item) return;
    const img = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");
    if (img) { img.src = item.image; img.alt = item.title; }
    if (caption) caption.textContent = item.title;
    if (counter) counter.textContent = `${currentIndex + 1} / ${currentList.length}`;
  }

  function next() {
    currentIndex = (currentIndex + 1) % currentList.length;
    updateLightbox();
  }
  function prev() {
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    updateLightbox();
  }

  function initLightboxControls() {
    const closeBtn = document.getElementById("lightbox-close");
    const nextBtn = document.getElementById("lightbox-next");
    const prevBtn = document.getElementById("lightbox-prev");
    const overlay = document.getElementById("lightbox");

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      const lb = document.getElementById("lightbox");
      if (!lb || !lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  function initFilters(filterBarEl, gridEl) {
    if (!filterBarEl || !gridEl) return;
    filterBarEl.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBarEl.querySelectorAll("[data-filter]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderGrid(gridEl, btn.dataset.filter);
      });
    });
  }

  return { renderGrid, initLightboxControls, initFilters };
})();
