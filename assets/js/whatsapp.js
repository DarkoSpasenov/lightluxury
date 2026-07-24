/* ============================================================
   LIGHT LUXURY — GÉNÉRATION DU MESSAGE WHATSAPP
   ============================================================ */

const WhatsAppModule = (() => {
  function isConfigured() {
    return typeof ContactHelpers !== "undefined" && ContactHelpers.hasWhatsapp();
  }

  function buildQuoteMessage({ client, vehicle, deliveryMode, message, cartItems, totals, hasCustomLogo }) {
    let lines = [];
    lines.push(`Bonjour Light Luxury,`);
    lines.push("");
    lines.push("Je souhaite recevoir un devis pour les prestations suivantes :");
    lines.push("");

    cartItems.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.serviceName}${item.packageName ? " – " + item.packageName : ""}`);
      if (item.vehicle && (item.vehicle.brand || item.vehicle.model)) {
        lines.push(`Véhicule : ${item.vehicle.brand || ""} ${item.vehicle.model || ""} ${item.vehicle.year || ""}`.trim());
      }
      if (item.details) {
        Object.entries(item.details).forEach(([k, v]) => {
          if (v !== "" && v !== null && v !== undefined && v !== false) {
            lines.push(`${k} : ${v === true ? "Oui" : v}`);
          }
        });
      }
      if (item.options && item.options.length) {
        lines.push("Options :");
        item.options.forEach((o) => lines.push(`- ${o.name} : ${formatCHF(o.price)}`));
      }
      const total = CartModule.lineTotal(item);
      lines.push(`Prix : ${total === null ? "Sur devis" : formatCHF(total)}`);
      lines.push("");
    });

    lines.push(`Sous-total des prestations tarifées : ${formatCHF(totals.pricedSubtotal)}`);
    lines.push(`Prestations sur devis : ${totals.quoteOnlyCount}`);
    lines.push("");

    if (vehicle && (vehicle.brand || vehicle.model)) {
      lines.push("Véhicule principal :");
      lines.push(`Marque : ${vehicle.brand || ""}`);
      lines.push(`Modèle : ${vehicle.model || ""}`);
      lines.push(`Année : ${vehicle.year || ""}`);
      lines.push("");
    }

    lines.push("Client :");
    lines.push(`Nom : ${client.firstName || ""} ${client.lastName || ""}`.trim());
    lines.push(`Téléphone : ${client.phone || ""}`);
    if (client.email) lines.push(`E-mail : ${client.email}`);
    lines.push("");

    if (deliveryMode) {
      lines.push(`Mode souhaité : ${deliveryMode}`);
      lines.push("");
    }

    if (message) {
      lines.push("Message :");
      lines.push(message);
      lines.push("");
    }

    if (hasCustomLogo) {
      lines.push("Une image ou un logo sera envoyé séparément dans cette conversation.");
      lines.push("");
    }

    lines.push("Je comprends que cette demande ne constitue pas une commande ou un rendez-vous définitif.");
    lines.push("");
    lines.push("Merci.");

    return lines.join("\n");
  }

  function sendMessage(message) {
    if (!isConfigured()) {
      showConfigWarning();
      return false;
    }
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function showConfigWarning() {
    alert("Le numéro WhatsApp doit être configuré dans assets/js/config.js.");
  }

  function defaultContactMessage() {
    return "Bonjour Light Luxury, je vous contacte depuis votre site internet et j’aimerais obtenir des informations.";
  }

  return { buildQuoteMessage, sendMessage, isConfigured, showConfigWarning, defaultContactMessage };
})();

/* ------------------------------------------------------------
   Bouton WhatsApp flottant (présent sur toutes les pages)
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const floatBtn = document.getElementById("whatsapp-float-btn");
  if (floatBtn) {
    floatBtn.addEventListener("click", (e) => {
      e.preventDefault();
      WhatsAppModule.sendMessage(WhatsAppModule.defaultContactMessage());
    });
  }
});
