/* ============================================================
   LIGHT LUXURY — CONFIGURATEURS DE PRESTATIONS
   ============================================================ */

const ConfiguratorModule = (() => {
  /* ---------- CIEL ÉTOILÉ ---------- */
  function initStarHeadliner(formEl, summaryEl) {
    if (!formEl) return;
    const pricing = SERVICES_PRICING.starHeadliner;

    const packageSelect = formEl.querySelector("#star-package");
    packageSelect.innerHTML = pricing.packages
      .map((p) => `<option value="${p.id}">${p.name} — ${formatCHF(p.price)}</option>`)
      .join("");

    const optionEls = {};
    pricing.options.forEach((opt) => {
      const el = formEl.querySelector(`[data-option="${opt.id}"]`);
      if (el) optionEls[opt.id] = el;
    });

    const twoColourField = formEl.querySelector("#field-second-colour");
    const logoField = formEl.querySelector("#field-logo");
    const logoUpload = formEl.querySelector("#logo-upload");
    const logoPreview = formEl.querySelector("#logo-preview");

    function toggleConditionalFields() {
      if (optionEls["two-colour"]) {
        twoColourField.style.display = optionEls["two-colour"].checked ? "block" : "none";
      }
      if (optionEls["custom-logo"]) {
        logoField.style.display = optionEls["custom-logo"].checked ? "block" : "none";
      }
    }

    if (logoUpload) {
      logoUpload.addEventListener("change", () => {
        const file = logoUpload.files[0];
        if (file && logoPreview) {
          const reader = new FileReader();
          reader.onload = (e) => {
            logoPreview.src = e.target.result;
            logoPreview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
    }

    function computeTotal() {
      const pkg = pricing.packages.find((p) => p.id === packageSelect.value) || pricing.packages[0];
      let total = pkg.price;
      const chosenOptions = [];
      pricing.options.forEach((opt) => {
        const el = optionEls[opt.id];
        if (el && el.checked) {
          total += opt.price;
          chosenOptions.push(opt);
        }
      });
      return { pkg, chosenOptions, total };
    }

    function renderSummary() {
      const { pkg, chosenOptions, total } = computeTotal();
      if (!summaryEl) return;
      summaryEl.innerHTML = `
        <div class="config-summary-line"><span>${pkg.name}</span><span>${formatCHF(pkg.price)}</span></div>
        ${chosenOptions.map((o) => `<div class="config-summary-line"><span>${o.name}</span><span>${formatCHF(o.price)}</span></div>`).join("")}
        <div class="config-summary-total"><span>Total indicatif</span><span>${formatCHF(total)}</span></div>
      `;
    }

    formEl.addEventListener("change", () => {
      toggleConditionalFields();
      renderSummary();
    });
    toggleConditionalFields();
    renderSummary();

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const { pkg, chosenOptions, total } = computeTotal();
      const fd = new FormData(formEl);
      const hasLogo = optionEls["custom-logo"] && optionEls["custom-logo"].checked;

      CartModule.addItem({
        serviceId: pricing.id,
        serviceName: pricing.name,
        packageId: pkg.id,
        packageName: pkg.name,
        unitPrice: pkg.price,
        options: chosenOptions,
        quote: false,
        image: pricing.image,
        vehicle: {
          brand: fd.get("brand") || "",
          model: fd.get("model") || "",
          year: fd.get("year") || "",
          bodyType: fd.get("bodyType") || ""
        },
        details: {
          "Couleur principale": fd.get("primaryColour") || "",
          "Deuxième couleur": fd.get("secondColour") || "",
          "Type de toit": fd.get("roofType") || "",
          "Description du logo": fd.get("logoDescription") || "",
          "Commentaires": fd.get("comments") || ""
        },
        hasCustomLogo: !!hasLogo
      });

      showAddedFeedback(formEl);
    });
  }

  /* ---------- RÉNOVATION DE PAVILLON ---------- */
  function initRoofLiner(formEl, summaryEl) {
    if (!formEl) return;
    const pricing = SERVICES_PRICING.roofLiner;
    const packageSelect = formEl.querySelector("#roof-package");
    packageSelect.innerHTML = pricing.packages
      .map((p) => `<option value="${p.id}">${p.name} — ${formatCHF(p.price)}</option>`)
      .join("");

    function renderSummary() {
      const pkg = pricing.packages.find((p) => p.id === packageSelect.value) || pricing.packages[0];
      if (summaryEl) {
        summaryEl.innerHTML = `
          <div class="config-summary-line"><span>${pkg.name}</span><span>${formatCHF(pkg.price)}</span></div>
          <div class="config-summary-total"><span>Total indicatif</span><span>${formatCHF(pkg.price)}</span></div>
        `;
      }
      return pkg;
    }
    formEl.addEventListener("change", renderSummary);
    renderSummary();

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const pkg = renderSummary();
      const fd = new FormData(formEl);
      CartModule.addItem({
        serviceId: pricing.id,
        serviceName: pricing.name,
        packageId: pkg.id,
        packageName: pkg.name,
        unitPrice: pkg.price,
        options: [],
        quote: false,
        image: pricing.image,
        vehicle: {
          brand: fd.get("brand") || "",
          model: fd.get("model") || "",
          year: fd.get("year") || "",
          bodyType: fd.get("bodyType") || ""
        },
        details: {
          "Type de toit": fd.get("roofType") || "",
          "Couleur actuelle": fd.get("currentColour") || "",
          "Couleur souhaitée": fd.get("desiredColour") || "",
          "Élément déjà démonté": fd.get("alreadyRemoved") ? true : "",
          "Élément déjà nettoyé": fd.get("alreadyCleaned") ? true : "",
          "Commentaires": fd.get("comments") || ""
        }
      });
      showAddedFeedback(formEl);
    });
  }

  /* ---------- PRESTATIONS SUR DEVIS (volant, éclairage, personnalisation) ---------- */
  function initQuoteOnlyService(formEl, serviceKey, detailFields) {
    if (!formEl) return;
    const pricing = SERVICES_PRICING[serviceKey];

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(formEl);
      const details = {};
      detailFields.forEach(({ key, label }) => {
        const val = fd.get(key);
        if (val !== null) details[label] = fd.getAll(key).join(", ") || val;
      });

      CartModule.addItem({
        serviceId: pricing.id,
        serviceName: pricing.name,
        packageId: null,
        packageName: fd.get("configLabel") || "",
        unitPrice: null,
        options: [],
        quote: true,
        image: pricing.image,
        vehicle: {
          brand: fd.get("brand") || "",
          model: fd.get("model") || "",
          year: fd.get("year") || ""
        },
        details
      });
      showAddedFeedback(formEl);
    });
  }

  function showAddedFeedback(formEl) {
    let toast = document.getElementById("add-to-cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "add-to-cart-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = "Ajouté à votre demande de devis ✓";
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 2600);
    CartModule.updateCartCounters();
  }

  return { initStarHeadliner, initRoofLiner, initQuoteOnlyService };
})();
