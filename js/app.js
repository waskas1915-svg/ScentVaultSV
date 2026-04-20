// app.js
import { loadProducts } from "./product.js";
import { showProducts } from "./ui.js";
import { renderCart, updateCartUI, addToCart } from "./cart.js";
import { checkUserStatus } from "./auth_status.js";
import { checkout, sendOrderWhatsApp } from "./checkout.js";
import { showToast } from "./toast.js";
import { initHeader } from "./header.js";
import { initDrawer, openDrawer } from "./drawer.js"; // Importamos el nuevo Drawer

let allProducts = [];

async function init() {
    try {
        allProducts = await loadProducts();
        showProducts(allProducts, handleAddToCart);
        
        // Inicializamos los componentes modulares
        initHeader();
        initDrawer();
        
        updateCartUI(); // Actualiza contadores iniciales
    } catch (err) {
        console.error(err);
        showToast("Failed to load products", "error");
    }
}

// Esta función ahora es mucho más simple
function handleAddToCart(id, name, size, price, image, ml) {
    addToCart(id, name, size, price, image, ml, () => {
        // En lugar de refreshCart manual, usamos el Drawer
        openDrawer('cart'); 
    });
}

export function handleCheckout() {
    checkout({
        closeCart: () => { /* Aquí podrías llamar a closeDrawer de drawer.js */ },
        onSendOrder: handleSendOrder,
        onBack: () => {
            showProducts(allProducts, handleAddToCart);
            window.scrollTo(0, 0);
        }
    });
}

function handleSendOrder({ subtotal, shipping, total }) {
    sendOrderWhatsApp({ subtotal, shipping, total });
}

document.addEventListener("DOMContentLoaded", () => {
    init();

    // El logo ahora es más simple
    const logo = document.getElementById("logo");
    if (logo) {
        logo.onclick = () => {
            showProducts(allProducts, handleAddToCart);
            window.scrollTo(0, 0);
        };
    }
});