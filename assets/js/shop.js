/* ============================================================
   LIGHT LUXURY — BOUTIQUE / CATALOGUE DE PRESTATIONS
   ============================================================ */

const ShopModule = (() => {
  function renderCards(containerEl, products) {
    if (!containerEl) return;
    if (!products.length) {
      containerEl.innerHTML = `<p class="empty-state">Aucune prestation ne correspond à votre recherche.</p>`;
      const emptySliderRoot = containerEl.closest(".slider");
      if (emptySliderRoot && emptySliderRoot._sliderInstance) emptySliderRoot._sliderInstance.destroy();
      return;
    }
    containerEl.innerHTML = products
      .map((p) => {
        const configureBtn = p.openModal
          ? `<button type="button" class="btn btn-outline btn-sm" data-open-product-modal="${p.id}">Configurer</button>`
          : `<a href="${p.configuratorUrl}" class="btn btn-outline btn-sm">Configurer</a>`;
        const mediaLink = p.openModal ? "javascript:void(0)" : p.configuratorUrl;
        return `
      <div class="slider-slide">
        <article class="product-card">
          <a href="${mediaLink}" class="product-card-media" ${p.openModal ? `data-open-product-modal="${p.id}"` : ""}>
            <img src="${p.image}" alt="${p.name}" loading="lazy" width="500" height="380" />
          </a>
          <div class="product-card-body">
            <span class="eyebrow">${p.categoryLabel}</span>
            <h3>${p.name}</h3>
            <p>${p.shortDescription}</p>
            <div class="product-card-footer">
              <span class="price">${p.priceFrom ? "Dès " + formatCHF(p.priceFrom) : "Sur devis"}</span>
              ${configureBtn}
            </div>
          </div>
        </article>
      </div>`;
      })
      .join("");

    const sliderRoot = containerEl.closest(".slider");
    if (sliderRoot && typeof SliderModule !== "undefined") {
      SliderModule.mount(sliderRoot);
    }
    if (typeof ProductModalModule !== "undefined") {
      ProductModalModule.bindTriggers(containerEl);
    }
  }

  function initCatalogPage({ gridEl, searchInput, categorySelect, sortSelect }) {
    if (!gridEl) return;

    function apply() {
      let list = [...PRODUCTS_CATALOG];
      const term = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      const category = (categorySelect && categorySelect.value) || "all";
      const sort = (sortSelect && sortSelect.value) || "default";

      if (term) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.shortDescription.toLowerCase().includes(term) ||
            p.categoryLabel.toLowerCase().includes(term)
        );
      }
      if (category !== "all") {
        list = list.filter((p) => p.category === category);
      }
      if (sort === "price-asc") {
        list.sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity));
      } else if (sort === "price-desc") {
        list.sort((a, b) => (b.priceFrom ?? -Infinity) - (a.priceFrom ?? -Infinity));
      } else if (sort === "alpha") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
      renderCards(gridEl, list);
    }

    [searchInput, categorySelect, sortSelect].forEach((el) => {
      if (el) el.addEventListener("input", apply);
    });
    apply();
  }

  return { renderCards, initCatalogPage };
})();
