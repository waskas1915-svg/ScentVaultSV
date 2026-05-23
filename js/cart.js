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
    // 1. Asegurar que el ID sea un String limpio para evitar fallos de tipo (Number vs String)
    const productId = String(id);
    const existing = cart.find(item => String(item.id) === productId && item.size === size);

    // 2. Validación de Stock robusta
    const productData = window.allProducts?.find(p => String(p.id) === productId);
    const stockDisponible = productData ? parseInt(productData.stock_ml) : 999;
    const mlNecesarios = parseInt(size);

    if (existing) {
        if ((existing.qty + 1) * mlNecesarios > stockDisponible) {
            showToast("No hay suficiente stock en el Vault para añadir más", "error");
            return;
        }
        existing.qty += 1;
    } else {
        if (mlNecesarios > stockDisponible) {
            showToast("Lo sentimos, este tamaño ya no está disponible", "error");
            return;
        }
        // Insertamos el nuevo decant asegurando que qty empiece en 1 explícitamente
        cart.push({ id: productId, name, size, price: parseFloat(price), image, ml, qty: 1 });
    }

    // 3. Persistencia Inmediata
    saveCart();
    updateCartUI();

    // 4. Animación sutil del botón de la bolsa
    const btn = document.getElementById("cartBtn");
    if (btn) {
        btn.classList.add("cart-bounce");
        setTimeout(() => btn.classList.remove("cart-bounce"), 300);
    }

    showToast("Añadido al carrito 🛒", "success");

    // 5. TRUCO DE ORO: Forzamos un micro-timeout para que el DOM respire 
    // y el render del drawer lea el array del carrito perfectamente actualizado
    if (refreshCart) {
        setTimeout(() => {
            refreshCart();
        }, 50); 
    }
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

    // --- ENVOLTORIO FLEXBOX PRINCIPAL ---
    let cartHtml = `<div class="cart-drawer-view animate-fade-in">`;

    // 1. Zona de productos
    cartHtml += '<div class="cart-items">';
    let total = 0;
    cart.forEach((item, index) => {
        const qty = item.qty || 1;
        total += item.price * qty;
        cartHtml += `
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
    cartHtml += '</div>'; // Cierre de .cart-items

    // 2. Zona de Footer Fijo
    cartHtml += `
        <div class="cart-footer">
            <p class="cart-total"><span>Subtotal:</span> <span>$${total.toFixed(2)}</span></p>
            <button id="checkoutBtn" class="primary-btn black-btn">CHECKOUT</button>
        </div>
    `;

    cartHtml += `</div>`; // Cierre de .cart-drawer-view

    contentContainer.innerHTML = cartHtml;

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.onclick = onCheckout;
}

// Hacer globales para los onclick
window.changeQty = (index, amount) => {
    changeQty(index, amount, () => {
        setTimeout(() => window.switchTab('cart'), 30);
    });
};
window.removeFromCart = (index) => {
    removeFromCart(index, () => {
        setTimeout(() => window.switchTab('cart'), 30);
    });
};
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