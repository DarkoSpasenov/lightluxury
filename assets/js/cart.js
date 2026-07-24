/* ============================================================
   LIGHT LUXURY — PANIER DE DEMANDE DE DEVIS (localStorage)
   ------------------------------------------------------------
   Le panier ne sert qu'à préparer une demande de devis envoyée
   sur WhatsApp. Aucun paiement, aucune commande réelle.
   ============================================================ */

const CART_STORAGE_KEY = "lightluxury_cart_v1";

const CartModule = (() => {
  function readCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erreur de lecture du panier :", e);
      return [];
    }
  }

  function writeCart(items) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erreur d'écriture du panier :", e);
    }
    updateCartCounters();
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
  }

  /**
   * item = {
   *   serviceId, serviceName, packageId, packageName, unitPrice (number|null),
   *   options: [{id,name,price}], quote: bool,
   *   vehicle: {brand, model, year, bodyType},
   *   details: { ... champs libres selon prestation },
   *   image
   * }
   */
  function addItem(item) {
    const items = readCart();
    const cartItem = {
      cartId: "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      addedAt: new Date().toISOString(),
      quantity: 1,
      ...item
    };
    items.push(cartItem);
    writeCart(items);
    return cartItem;
  }

  function removeItem(cartId) {
    const items = readCart().filter((i) => i.cartId !== cartId);
    writeCart(items);
  }

  function updateItem(cartId, patch) {
    const items = readCart().map((i) => (i.cartId === cartId ? { ...i, ...patch } : i));
    writeCart(items);
  }

  function clearCart() {
    writeCart([]);
  }

  function getItems() {
    return readCart();
  }

  function getCount() {
    return readCart().reduce((sum, i) => sum + (i.quantity || 1), 0);
  }

  function lineTotal(item) {
    if (item.unitPrice === null || item.unitPrice === undefined) return null;
    const optionsTotal = (item.options || []).reduce((s, o) => s + (o.price || 0), 0);
    return (item.unitPrice + optionsTotal) * (item.quantity || 1);
  }

  function getTotals() {
    const items = readCart();
    let pricedSubtotal = 0;
    let quoteOnlyCount = 0;
    items.forEach((item) => {
      const total = lineTotal(item);
      if (total === null) {
        quoteOnlyCount += 1;
      } else {
        pricedSubtotal += total;
      }
    });
    return { pricedSubtotal, quoteOnlyCount, itemCount: items.length };
  }

  function updateCartCounters() {
    const count = getCount();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = count;
      el.classList.toggle("is-empty", count === 0);
    });
  }

  return {
    addItem,
    removeItem,
    updateItem,
    clearCart,
    getItems,
    getCount,
    getTotals,
    lineTotal,
    updateCartCounters
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  CartModule.updateCartCounters();
});
