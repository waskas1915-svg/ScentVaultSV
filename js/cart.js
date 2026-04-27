// cart.js
import { showToast } from "./toast.js";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Añadir al carrito respetando el stock disponible
 */
export function addToCart(id, name, size, price, image, ml, refreshCart) {
    // IMPORTANTE: 'id' DEBE SER EL ID LARGO DE FIREBASE
    const existing = cart.find(item => item.id === id && item.size === size);

    // Buscamos el producto en la lista global para saber cuánto stock real queda
    const productData = window.allProducts?.find(p => String(p.id) === String(id));
    const stockDisponible = productData ? productData.stock_ml : 999;
    const mlNecesarios = parseInt(size);

    if (existing) {
        // Validamos si añadir uno más supera el stock de la botella
        if ((existing.qty + 1) * mlNecesarios > stockDisponible) {
            showToast("No hay suficiente stock en el Vault para añadir más", "error");
            return;
        }
        existing.qty += 1;
    } else {
        // Validamos si el primer decant cabe en el stock
        if (mlNecesarios > stockDisponible) {
            showToast("Lo sentimos, este tamaño ya no está disponible", "error");
            return;
        }
        cart.push({ id, name, size, price, image, ml, qty: 1 });
    }

    // Animación del botón
    const btn = document.getElementById("cartBtn");
    if (btn) {
        btn.classList.add("cart-bounce");
        setTimeout(() => btn.classList.remove("cart-bounce"), 300);
    }

    saveCart();
    updateCartUI();
    showToast("Añadido al carrito 🛒", "success");
    if (refreshCart) refreshCart();
}

/**
 * Cambiar cantidad validando stock
 */
export function changeQty(index, amount, refreshCart) {
    if (!cart[index]) return;

    const item = cart[index];
    const productData = window.allProducts?.find(p => String(p.id) === String(item.id));
    const stockDisponible = productData ? productData.stock_ml : 999;
    const mlPorUnidad = parseInt(item.size);

    const nuevaQty = item.qty + amount;

    // Si intenta subir cantidad, revisamos si hay ML suficientes en la botella
    if (amount > 0 && (nuevaQty * mlPorUnidad) > stockDisponible) {
        showToast("Límite de inventario alcanzado", "info");
        return;
    }

    item.qty = nuevaQty;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
    if (refreshCart) refreshCart();
}

export function removeFromCart(index, refreshCart) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast("Eliminado del carrito", "error");
    if (refreshCart) refreshCart();
}

export function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    
    const btn = document.getElementById("cart-count");
    if (btn) btn.innerText = totalItems;

    const tabBag = document.getElementById("bag-count");
    if (tabBag) tabBag.innerText = totalItems;
}

export function renderCart({ refreshCart, closeCart, onCheckout }) {
    const contentContainer = document.getElementById("drawerContent"); 
    if (!contentContainer) return;

    contentContainer.innerHTML = ""; 

    if (cart.length === 0) {
        contentContainer.innerHTML = renderEmptyCart();
        const continueBtn = document.getElementById("continueShoppingBtn");
        if (continueBtn) continueBtn.onclick = closeCart;
        return;
    }

    let itemsHtml = '<div class="cart-items">';
    let total = 0;
    cart.forEach((item, index) => {
        const qty = item.qty || 1;
        total += item.price * qty;
        itemsHtml += `
            <div class="cart-item">
                <img src="${item.image}" class="cart-item-img">
                <div class="cart-item-info">
                    <p class="cart-name">${item.name}</p>
                    <p class="cart-size">${item.size}</p>
                    <p class="cart-price">$${item.price}</p>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="window.changeQty(${index}, -1)">−</button>
                        <span>${qty}</span>
                        <button class="qty-btn" onclick="window.changeQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="window.removeFromCart(${index})">Remove</button>
                </div>
            </div>`;
    });
    itemsHtml += '</div>';

    let footerHtml = `
        <div class="cart-footer">
            <p class="cart-total"><strong>Subtotal: $${total.toFixed(2)}</strong></p>
            <button id="checkoutBtn" class="primary-btn black-btn">CHECKOUT</button>
        </div>
    `;

    contentContainer.innerHTML = itemsHtml + footerHtml;

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.onclick = onCheckout;
}

// Hacer globales para los onclick
window.changeQty = (index, amount) => changeQty(index, amount, () => window.switchTab('cart'));
window.removeFromCart = (index) => removeFromCart(index, () => window.switchTab('cart'));

export function getCart() { return cart; }

export function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartUI();
}

export function renderEmptyCart() {
    return `
        <div class="cart-empty-container">
            <img src="./images/emptycart2.png" class="cart-empty-img">
            <h2>Tu bolsa está vacía</h2>
            <button id="continueShoppingBtn" class="primary-btn continue-shopping">
                Continuar comprando
            </button>
        </div>`;
}