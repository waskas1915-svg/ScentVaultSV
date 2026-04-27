// profile_wishlist.js
import { renderEmptyWishlist } from "./wishlist.js";

export function renderWishlistTab({ userData }) {
    const wishlistIds = userData.wishlist || [];
    if (wishlistIds.length === 0) return renderEmptyWishlist();

    return `
        <div class="wishlist-page animate-fade-in">
            <h2 class="playfair">Mis Favoritos</h2>
            <div class="product-grid">
                ${wishlistIds.map(id => {
                    const p = window.allProducts?.find(prod => String(prod.id) === String(id));
                    if (!p) return '';
                    return `
                        <div class="product-card">
                            <img src="${p.image}">
                            <h3>${p.name}</h3>
                            <button class="primary-btn gold-btn" onclick="window.viewProduct('${p.id}', window.allProducts)">VER</button>
                        </div>`;
                }).join('')}
            </div>
        </div>
    `;
}