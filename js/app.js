  // Import other js scripts

import { loadProducts } from "./js/products.js";
import { showProducts } from "./js/ui.js";
import { 
  renderCart, 
  updateCartUI, 
  addToCart 
} from "./js/cart.js";
import { checkout, sendOrderWhatsApp } from "./js/checkout.js";
import { showToast } from "./js/toast.js";

let allProducts = [];

async function init() {
  try {
    allProducts = await loadProducts();

    showProducts(allProducts, handleAddToCart);
    updateCartUI();
  } catch (err) {
    console.error(err);
    showToast("Failed to load products", "error");
  }
}

function handleAddToCart(id, name, size, price, image, ml) {
  addToCart(id, name, size, price, image, ml, refreshCart);
}

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "auto";
}

function refreshCart() {
  const preview = document.getElementById("cartPreview");
  const overlay = document.getElementById("cartOverlay");
  if (preview?.classList.contains("show")) return;

  lockScroll();

  preview?.classList.add("show");
  overlay?.classList.add("show");

  renderCart({
    refreshCart,
    closeCart,
    onCheckout: handleCheckout
  });
}

function closeCart() {
  const preview = document.getElementById("cartPreview");
  const overlay = document.getElementById("cartOverlay");

  unlockScroll();

  preview?.classList.remove("show");
  overlay?.classList.remove("show");
}

function handleCheckout() {
  checkout({
    closeCart,
    onSendOrder: handleSendOrder,
    onBack: () => {
      showProducts(allProducts, handleAddToCart);
      window.scrollTo(0, 0);
    }
  });
}

function handleSendOrder({ subtotal, shipping, total }) {
  sendOrderWhatsApp({
    subtotal,
    shipping,
    total
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  const btn = document.getElementById("cartBtn");
  const overlay = document.getElementById("cartOverlay");

  if (btn) btn.onclick = refreshCart;
  if (overlay) overlay.onclick = closeCart;
});