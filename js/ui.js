// ui.js
import { auth, db } from './firebase.js';
import { showToast } from "./toast.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { updateWishlistCounter } from "./wishlist.js"; 

export async function showProducts(products, addToCart) {
    const container = document.getElementById('products');
    container.innerHTML = `<div id="productGrid"></div>`;
    const grid = document.getElementById('productGrid');
    
    const user = auth.currentUser;
    let userWishlist = [];

    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userWishlist = userDoc.data()?.wishlist || [];
        }
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add("product-card");

        const hasStock = product.stock_ml > 0;
        const isFavorite = userWishlist.includes(String(product.id));

        div.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" class="product-img">
                <button class="wishlist-overlay-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleWishlist(event, '${product.id}')" 
                        id="wish-btn-${product.id}">
                    <svg class="heart-icon-svg" viewBox="0 0 24 24"> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
            <h3>${product.name}</h3>
            <div class="card-bottom">
                <p class="${hasStock ? 'in-stock' : 'out-of-stock'}">
                    ${hasStock ? 'In Stock' : 'Out of Stock'}
                </p>
                <button class="primary-btn gold-btn">
                    View Options
                </button>
            </div>
        `;

        // Click en toda la card o en el botón
        if (hasStock) {
            div.classList.add("clickable");
            const action = () => viewProduct(product.id, products, addToCart);
            div.onclick = action;
            div.querySelector('.primary-btn').onclick = (e) => {
                e.stopPropagation();
                action();
            };
        } else {
            div.classList.add("out-of-stock-card");
        }

        grid.appendChild(div); 
    });

    if (typeof updateWishlistCounter === 'function') {
        updateWishlistCounter(userWishlist.length);
    }
}

export function viewProduct(productId, products, addToCart) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    const container = document.getElementById('products');
    window.scrollTo(0, 0);

    container.innerHTML = `
        <div class="product-view">
            <div class="product-view-left">
                <h2 class="product-title-main">${product.name}</h2>
                <div class="product-image-container">
                    <img id="variant-image" src="${product.image}">
                </div>
                <div id="thumbnailRow" class="thumbnail-row"></div>
            </div>
            <div class="product-info">
                <div id="variantGrid"></div>
                <div id="purchaseBox"></div>
                <div id="backContainer"></div>
            </div>
        </div>

        <div class="pdp-marketing-fullwide">
            <header class="marketing-header">
                <h3>L'Essence de la Fragrance</h3>
                <p class="tagline">"${product.marketing?.tagline || ''}"</p>
                <p class="description-text">${product.description || ''}</p>
            </header>
            <div class="specs-bar">
                <span>FAMILIA: ${product.marketing?.family || 'N/A'}</span>
                <span class="separator">|</span>
                <span>TIPO: ${product.marketing?.scent_type || 'N/A'}</span>
            </div>
            <section class="composition-section">
                <h3>Notas de la Fragancia</h3>
                <div class="notes-grid">
                    <div class="note-card"><strong>Salida</strong><span>${product.marketing?.notes?.opening || 'N/A'}</span></div>
                    <div class="note-card"><strong>Corazón</strong><span>${product.marketing?.notes?.heart || 'N/A'}</span></div>
                    <div class="note-card"><strong>Fondo</strong><span>${product.marketing?.notes?.foundation || 'N/A'}</span></div>
                </div>
            </section>
        </div>
    `;

    // Lógica de Variantes
    const vGrid = document.getElementById('variantGrid');
    const pBox = document.getElementById('purchaseBox');
    let selectedVariant = null;

    product.variants.forEach(variant => {
        const card = document.createElement('div');
        card.className = 'size-option';
        const isAvail = variant.in_stock && product.stock_ml >= parseInt(variant.size);
        if (!isAvail) card.classList.add('out');

        card.innerHTML = `
            <img src="${variant.image || product.image}" width="80">
            <p><strong>${variant.size}</strong></p>
            <p class="price">$${variant.price}</p>
        `;

        card.onclick = () => {
            if (!isAvail) return;
            document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            selectedVariant = variant;
            document.getElementById('variant-image').src = variant.image || product.image;
            
            pBox.innerHTML = `<button id="addBtn" class="primary-btn">Add to Cart</button>`;
            document.getElementById('addBtn').onclick = () => {
                addToCart(product.id, product.name, variant.size, variant.price, product.image, variant.ml);
                showToast("Added to cart 🛒", "success");
            };
        };
        vGrid.appendChild(card);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'secondary-btn';
    backBtn.innerText = "⬅ Back to Shop";
    backBtn.onclick = () => showProducts(products, addToCart);
    document.getElementById('backContainer').appendChild(backBtn);
}

// Hacemos la función global para que el HTML la encuentre
window.viewProduct = viewProduct;