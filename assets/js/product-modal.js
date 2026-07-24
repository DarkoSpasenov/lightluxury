/* ============================================================
   LIGHT LUXURY — CONFIGURATEUR EN FENÊTRE MODALE
   ------------------------------------------------------------
   Utilisé par la boutique (et la page produit) pour les
   prestations qui n'ont pas de page de configurateur dédiée :
   Personnalisation intérieure, Installation de CarPlay,
   Installation d'Angel Eyes.
   ============================================================ */

const ProductModalModule = (() => {
  let modalEl = null;
  let lastFocusedEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.id = "product-modal";
    modalEl.className = "product-modal";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.innerHTML = `
      <div class="product-modal-backdrop" data-modal-close></div>
      <div class="product-modal-panel">
        <button type="button" class="product-modal-close" aria-label="Fermer le configurateur" data-modal-close>✕</button>
        <div class="product-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", close);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl.classList.contains("is-open")) close();
    });
    return modalEl;
  }

  function fieldRow(serviceId) {
    return `
      <div class="field-row">
        <div class="field-group"><label for="pm-brand">Marque *</label><input type="text" id="pm-brand" name="brand" required /></div>
        <div class="field-group"><label for="pm-model">Modèle *</label><input type="text" id="pm-model" name="model" required /></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label for="pm-year">Année</label><input type="text" id="pm-year" name="year" /></div>
      </div>`;
  }

  function buildBody(service) {
    const isVariant = service.type === "variant-quote" && Array.isArray(service.variants);
    const variantHtml = isVariant
      ? `<div class="field-group">
          <label>Choix (obligatoire)</label>
          <div class="field-row">
            ${service.variants
              .map(
                (v, i) => `
              <label class="checkbox-field">
                <input type="radio" name="variant" value="${v.id}" data-variant-name="${v.name}" ${i === 0 ? "required" : ""} />
                ${v.name}
              </label>`
              )
              .join("")}
          </div>
        </div>`
      : "";

    return `
      <span class="eyebrow">${service.priceLabel || "Sur devis"}</span>
      <h3>${service.name}</h3>
      <p class="form-note" style="margin-bottom:1rem;">${SERVICES_CONTENT[service.id] ? SERVICES_CONTENT[service.id].description : ""}</p>
      <form id="pm-form" class="config-form" novalidate>
        ${fieldRow(service.id)}
        ${variantHtml}
        <div class="field-group">
          <label for="pm-comments">Commentaires</label>
          <textarea id="pm-comments" name="comments" placeholder="Précisions utiles sur votre projet"></textarea>
        </div>
        <div class="info-panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <p>Prix sur devis. Un acompte de 50 % est demandé pour confirmer la prestation. Paiement : Cash ou TWINT.</p>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Ajouter à ma demande</button>
      </form>
    `;
  }

  function open(serviceId) {
    const service = getServiceById(serviceId);
    if (!service) return;
    const modal = ensureModal();
    const body = modal.querySelector(".product-modal-body");
    body.innerHTML = buildBody(service);

    const form = modal.querySelector("#pm-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll("[required]").forEach((el) => {
        if (el.type === "radio") {
          const group = form.querySelectorAll(`[name="${el.name}"]`);
          const checked = Array.from(group).some((r) => r.checked);
          if (!checked) valid = false;
        } else if (!el.value) {
          valid = false;
          el.closest(".field-group")?.classList.add("has-error");
        } else {
          el.closest(".field-group")?.classList.remove("has-error");
        }
      });
      if (!valid) return;

      const fd = new FormData(form);
      const details = {};
      if (service.type === "variant-quote") {
        const checkedVariant = form.querySelector('input[name="variant"]:checked');
        if (checkedVariant) details["Variante"] = checkedVariant.dataset.variantName;
      }
      if (fd.get("comments")) details["Commentaires"] = fd.get("comments");

      CartModule.addItem({
        serviceId: service.id,
        serviceName: service.name,
        packageId: null,
        packageName: "",
        unitPrice: null,
        options: [],
        quote: true,
        image: service.image,
        vehicle: {
          brand: fd.get("brand") || "",
          model: fd.get("model") || "",
          year: fd.get("year") || ""
        },
        details
      });

      close();
      showToast("Ajouté à votre demande de devis ✓");
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lastFocusedEl = document.activeElement;
    const firstField = modal.querySelector("input, textarea, select, button");
    if (firstField) firstField.focus();
  }

  function close() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
  }

  function showToast(text) {
    let toast = document.getElementById("add-to-cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "add-to-cart-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 2600);
    if (typeof CartModule !== "undefined") CartModule.updateCartCounters();
  }

  function bindTriggers(root = document) {
    root.querySelectorAll("[data-open-product-modal]").forEach((btn) => {
      if (btn._pmBound) return;
      btn._pmBound = true;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        open(btn.getAttribute("data-open-product-modal"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => bindTriggers());

  return { open, close, bindTriggers };
})();
