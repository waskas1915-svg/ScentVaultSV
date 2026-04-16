// cart.js
    import { showToast } from "./toast.js";

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    }

    // cart function

    export function addToCart(id, name, size, price, image, ml, refreshCart) {
        const existing = cart.find(item => item.id === id && item.size === size);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, size, price, image, ml, qty: 1 });
        }

        const btn = document.getElementById("cartBtn");
            if (btn) {
                btn.classList.add("cart-bounce");
                setTimeout(() => btn.classList.remove("cart-bounce"), 300);
            }
        saveCart();
        updateCartUI();
        showToast("Added to cart 🛒", "success");
        if (refreshCart) refreshCart();
    }

    // Remove Items from the cart

    export function removeFromCart(index, refreshCart) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        showToast("Item removed", "error");
        if (refreshCart) refreshCart();
    }

    // Quantity control

    export function changeQty(index, amount, refreshCart) {
        if (!cart[index]) return;

        cart[index].qty = (cart[index].qty || 1) + amount;

        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }

        saveCart();
        updateCartUI();
        if (refreshCart) refreshCart();

        // Animate quantity
        const items = document.querySelectorAll(".cart-item");
            if (items[index]) {
                items[index].classList.add("updated");
                setTimeout(() => {
                    items[index].classList.remove("updated");
                }, 300);
            }
        // animated total quantity
        const totalEl = document.querySelector(".cart-total");
            if (totalEl) {
                totalEl.classList.add("updated");
                setTimeout(() => totalEl.classList.remove("updated"), 200);
            }
    }

    //update cart

    export function updateCartUI() {
        const btn = document.getElementById("cartBtn");
        if (!btn) return;

        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        btn.innerText = `🛒 (${totalItems})`;
    }

    //Rendercart

    function bindEmptyCartEvents(closeCart) {
    const btn = document.getElementById("continueShoppingBtn");
    if (btn) btn.onclick = closeCart;
}
    
    export function renderCart({ refreshCart, closeCart, onCheckout }) {
        const preview = document.getElementById("cartPreview");
        if (!preview) return;

        // ✅ handle empty cart FIRST
        if (cart.length === 0) {
            preview.innerHTML = renderEmptyCart();
            bindEmptyCartEvents(closeCart);   
            return;
        }

        let html = `
            <div class="cart-header">
                <h3>Cart</h3>
                <button id="closeCartBtn">✕</button>
            </div>
        `;
        
        let total = 0;

        cart.forEach((item, index) => {
            const qty = item.qty || 1;
            const itemTotal = item.price * qty;
            total += itemTotal;

            html += `
                <div class="cart-item">
                    <img src="${item.image}" 
                        class="cart-item-img"
                        onerror="this.src='./images/noimage.png'">

                    <div class="cart-item-info">
                        <p class="cart-name">${item.name}</p>
                        <p class="cart-size">${item.size}</p>
                        <p class="cart-price">$${item.price}</p>

                        <div class="qty-controls">
                            <button class="qty-btn" data-index="${index}" data-change="-1">−</button>
                            <span>${qty}</span>
                            <button class="qty-btn" data-index="${index}" data-change="1">+</button>
                        </div>

                        <button class="remove-btn" data-index="${index}">
                            Remove
                        </button>
                    </div>
                </div>
            `;
         });

         html += `
            <div class="cart-footer">
                <p class="cart-total">Subtotal: $${total.toFixed(2)}</p>
                <button id="checkoutBtn" class="primary-btn">
                    Checkout
                </button>
            </div>
        `;
        preview.innerHTML = html;
        document.getElementById("closeCartBtn").onclick = closeCart;
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.onclick = () => {
                const index = Number(btn.dataset.index);
                removeFromCart(index, refreshCart);
            };
        });
        document.querySelectorAll(".qty-btn").forEach(btn => {
            btn.onclick = () => {
                const index = Number(btn.dataset.index);
                const change = Number(btn.dataset.change);
                changeQty(index, change, refreshCart);
            };
        });
        const checkoutBtn = document.getElementById("checkoutBtn");
            if (checkoutBtn) {
                checkoutBtn.onclick = onCheckout;
            }
    }


    export function getCart() {
        return cart;
    }

   export function clearCart() {
        cart = [];
        localStorage.removeItem("cart");
        updateCartUI();
    }

    function renderEmptyCart() {
    return `
            <div class="cart-empty-state">
                <div class="empty-icon"> <img src="./images/emptycart2.png" class="empty-icon-img"> </div>

                <h2>Your shopping bag is empty</h2>
                <p>You have no items in your shopping bag. Let’s go buy something!</p>

                <button id="continueShoppingBtn" class="primary-btn">
                    Continue Shopping
                </button>
            </div>
        `;
    }