  // Import other js scripts

import { loadProducts } from "./product.js";
import { showProducts } from "./ui.js";
import { 
  renderCart, 
  updateCartUI, 
  addToCart 
} from "./cart.js";
import { checkout, sendOrderWhatsApp } from "./checkout.js";
import { showToast } from "./toast.js";

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
  const overlay = document.getElementById("cartOverlay");
  if (overlay) {
    // Usamos addEventListener en lugar de .onclick
    overlay.addEventListener('click', () => {
      console.log("Cerrando desde overlay...");
      closeCart();
    });
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
  if (!preview?.classList.contains("show")) {
    lockScroll();
    preview?.classList.add("show");
    overlay?.classList.add("show");
  }

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
  const logo = document.getElementById("logo");
    if (logo) {
      logo.onclick = () => {
        showProducts(allProducts, handleAddToCart);
        window.scrollTo(0, 0);
      };
    }
  const btn = document.getElementById("cartBtn");
  const overlay = document.getElementById("cartOverlay");

  if (btn) btn.onclick = refreshCart;
  if (overlay) overlay.onclick = closeCart;
});

