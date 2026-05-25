// ui.js
import { auth, db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { updateWishlistCounter, toggleWishlist } from "./wishlist.js";
import { initReviews } from "./reviews.js";
import { renderLandingPage } from './landingPage.js';
/**
 * Renderiza la grilla principal de productos
 */
export function showLandingPage(products, addToCart) {
    // We pass a callback function to renderLandingPage telling it what to do
    // when the user decides to click "Explorar Catálogo"
    renderLandingPage(() => {
        showProducts(products, addToCart);
    });
}

/**
 * Renderiza la grilla principal de productos
 */
export async function showProducts(products, addToCart) {
    const container = document.getElementById('products');
    if (!container) return;
    if (!history.state || history.state.view !== 'catalog') {
        history.pushState({ view: 'catalog' }, 'Catálogo', '#catalogo');
    }
    // Reset container view to clear out the landing page sections gracefully
    container.innerHTML = `<div id="productGrid" class="product-grid"></div>`;
    const grid = document.getElementById('productGrid');
    
    const user = auth.currentUser;
    let userWishlist = [];

    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                userWishlist = userDoc.data()?.wishlist || [];
            }
        } catch (e) { console.error("Error cargando wishlist:", e); }
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add("product-card");

        // Lógica de Stock: Si el envase original tiene menos de 5ml, no hay decants
        const hasStock = product.stock_ml >= 5; 
        const isFavorite = userWishlist.includes(String(product.id));

        div.innerHTML = `
            <div class="product-img-container ${!hasStock ? 'out-of-stock-filter' : ''}">
                <img src="${product.image}" class="product-img" loading="lazy">
                <button class="wishlist-overlay-btn ${isFavorite ? 'active' : ''}" 
                        onclick="window.toggleWishlist(event, '${product.id}')" 
                        id="wish-btn-${product.id}">
                    <svg class="heart-icon-svg" viewBox="0 0 24 24"> 
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                ${!hasStock ? '<div class="sold-out-badge">AGOTADO</div>' : ''}
            </div>
            <h3>${product.name}</h3>
            <div class="card-bottom">
                <p class="${hasStock ? 'in-stock' : 'out-of-stock'}">
                    ${hasStock ? 'En Inventario' : 'Agotado'}
                </p>
                <button class="primary-btn gold-btn" ${!hasStock ? 'disabled' : ''}>
                    ${hasStock ? 'Ver Opciones' : 'No disponible'}
                </button>
            </div>
        `;

        if (hasStock) {
            div.classList.add("clickable");
            div.onclick = () => viewProduct(product.id, products, addToCart);
            div.querySelector('.primary-btn').onclick = (e) => {
                e.stopPropagation();
                viewProduct(product.id, products, addToCart);
            };
        } else {
            div.classList.add("disabled-card");
        }

        grid.appendChild(div); 
    });

    if (typeof updateWishlistCounter === 'function') {
        updateWishlistCounter(userWishlist.length);
    }
}

/**
 * Renderiza la vista detallada de un producto (PDP)
 */
export function viewProduct(productId, products, addToCart) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    const container = document.getElementById('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const faqHtml = (product.faqs && product.faqs.length > 0) ? `
        <section class="product-faq-section animate-fade-in">
            <h3 class="playfair">Preguntas Frecuentes</h3>
            <div class="faq-accordion">
                ${product.faqs.map(f => `
                    <details class="faq-item">
                        <summary>${f.q}</summary>
                        <p>${f.a}</p>
                    </details>
                `).join('')}
            </div>
        </section>
    ` : '';

    const secondaryImagesHtml = (product.images && product.images.length > 1) ? `
        <div class="thumbnail-row">
            ${product.images.map(imgUrl => `
                <img src="${imgUrl}" class="thumbnail" onclick="document.getElementById('variant-image').src='${imgUrl}'">
            `).join('')}
        </div>
    ` : '';

    container.innerHTML = `
        <div class="product-view animate-fade-in">
            <div class="product-view-left">
                <h2 class="product-title-main playfair">${product.name}</h2>
                <div class="product-image-container">
                    <img id="variant-image" src="${product.image}" class="main-pdp-img">
                </div>
                ${secondaryImagesHtml}
            </div>
            <div class="product-info">
                <p class="select-size-label">SELECCIONA TAMAÑO (ML)</p>
                <div id="variantGrid" class="variant-selector-grid"></div>
                <div id="purchaseBox" class="purchase-action-box"></div>
                <div id="backContainer" class="back-nav-container"></div>
            </div>
        </div>

        <div class="pdp-marketing-fullwide">
            <header class="marketing-header">
                <h3 class="playfair">L'Essence de la Fragrance</h3>
                <p class="tagline">"${product.marketing?.tagline || ''}"</p>
                <p class="description-text">${product.description || 'Sin descripción disponible.'}</p>
            </header>
            
            <div class="specs-bar">
                <span>FAMILIA: ${product.marketing?.family || 'N/A'}</span>
                <span class="separator">|</span>
                <span>TIPO: ${product.marketing?.scent_type || 'N/A'}</span>
            </div>

            <section class="composition-section">
                <h3 class="playfair">Notas de la Fragancia</h3>
                <div class="notes-grid">
                    <div class="note-card"><strong>Salida</strong><span>${product.marketing?.notes?.opening || 'N/A'}</span></div>
                    <div class="note-card"><strong>Corazón</strong><span>${product.marketing?.notes?.heart || 'N/A'}</span></div>
                    <div class="note-card"><strong>Fondo</strong><span>${product.marketing?.notes?.foundation || 'N/A'}</span></div>
                </div>
            </section>

            ${faqHtml}

            <div id="reviews-container" class="reviews-container-wrapper"></div>
        </div>
    `;

    const vGrid = document.getElementById('variantGrid');
    const pBox = document.getElementById('purchaseBox');

    product.variants.forEach(variant => {
        const card = document.createElement('div');
        card.className = 'size-option';
        
        const mlValue = parseInt(variant.size);
        const isAvail = variant.in_stock && product.stock_ml >= mlValue;
        
        if (!isAvail) card.classList.add('out');

        const variantImgSrc = variant.image || product.image;

        card.innerHTML = `
            <img src="${variantImgSrc}" alt="${variant.size}" class="variant-thumb-img">
            <div class="variant-card-inner">
                <p class="v-size"><strong>${variant.size}</strong></p>
                <p class="price">$${variant.price}</p>
                ${!isAvail ? '<span class="v-status">Agotado</span>' : ''}
            </div>
        `;

        card.onclick = () => {
            if (!isAvail) return;
            
            document.getElementById('variant-image').src = variantImgSrc;
            document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            
            pBox.innerHTML = `<button id="addBtn" class="primary-btn gold-btn large-btn">AÑADIR A LA BOLSA</button>`;
            document.getElementById('addBtn').onclick = () => {
                addToCart(product.id, product.name, variant.size, variant.price, product.image, mlValue);
            };
        };
        vGrid.appendChild(card);
    });

    initReviews(product.id, document.getElementById('reviews-container'));

    const backBtn = document.createElement('button');
    backBtn.className = 'back-to-shop-link';
    backBtn.innerHTML = "← Volver a la colección";
    
    // CHANGED: Redirect directly to the catalog view instead of running global triggers
    backBtn.onclick = () => showProducts(products, addToCart); 
    document.getElementById('backContainer').appendChild(backBtn);
}

// EXPOSICIÓN GLOBAL PARA EVENTOS ONCLICK
window.viewProduct = viewProduct;
window.toggleWishlist = toggleWishlist;