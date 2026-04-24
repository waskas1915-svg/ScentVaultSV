// wishlist.js
import { db, auth } from "./firebase.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

// --- 1. OBTENER IDS ---
export async function getWishlistFromFirebase(userId) {
    if (!userId) return [];
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? (userSnap.data().wishlist || []) : [];
    } catch (error) {
        return [];
    }
}

// --- 2. CONTADOR ---
export function updateWishlistCounter(count) {
    const tabs = document.querySelectorAll('.tab-btn, .drawer-tab');
    tabs.forEach(tab => {
        if (tab.textContent.toUpperCase().includes('WISHLIST') || tab.dataset.tab === 'wishlist') {
            tab.innerHTML = `WISHLIST(${count})`;
        }
    });
}

// --- 3. ELIMINAR (Desde cualquier lugar) ---
export async function removeFromWishlist(productId) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { wishlist: arrayRemove(productId) });
        
        showToast("Eliminado de favoritos", "info");

        // Actualizar corazones en la tienda (si el producto está visible)
        const heartBtn = document.getElementById(`wish-btn-${productId}`);
        if (heartBtn) heartBtn.classList.remove('active');

        // Refrescar contenido
        const freshIds = await getWishlistFromFirebase(user.uid);
        
        // 1. Refrescar el Drawer si está abierto
        const drawer = document.getElementById('unifiedDrawer');
        if (drawer && drawer.classList.contains('show')) {
            renderWishlistItems(freshIds);
        }

        // 2. Refrescar el Perfil si el usuario está ahí
        if (document.querySelector('.profile-grid-layout') && window.renderProfilePage) {
            window.renderProfilePage('wishlist');
        }

    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}
window.removeFromWishlist = removeFromWishlist;

// --- 4. RENDERIZADO EN EL DRAWER (PRECIO ELIMINADO) ---
export function renderWishlistItems(items) {
    const container = document.getElementById('drawerContent');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = renderEmptyWishlist();
        updateWishlistCounter(0);
        return;
    }

    let html = '<div class="wishlist-items-list">';
    items.forEach(productId => {
        // Buscamos el producto en la lista global cargada en app.js
        const product = window.allProducts?.find(p => String(p.id) === String(productId));
        
        if (product) {
            html += `
                <div class="cart-item">
                    <img src="${product.image}" class="cart-item-img">
                    <div class="cart-item-info">
                        <p class="cart-name">${product.name}</p>
                        <button class="primary-btn gold-btn small-btn" 
                                onclick="viewProduct('${product.id}', window.allProducts)">
                            VER OPCIONES
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromWishlist('${product.id}')">✕</button>
                </div>`;
        }
    });
    html += '</div>';
    container.innerHTML = html;
    updateWishlistCounter(items.length);
}

// --- 5. ESTADO VACÍO ---
export function renderEmptyWishlist() {
    return `
        <div class="cart-empty-container">
            <img src="./images/emptycart2.png" class="cart-empty-img">
            <h2>TU LISTA ESTÁ VACÍA</h2>
            <p>No tienes fragancias guardadas.</p>
            <button class="primary-btn gold-btn" onclick="window.closeDrawer()">
                EXPLORAR TIENDA
            </button>
        </div>`;
}

// --- 6. BOTÓN CORAZÓN (TOGGLE) ---
export async function toggleWishlist(e, productId) {
    if (e && e.stopPropagation) { e.stopPropagation(); e.preventDefault(); }
    
    const user = auth.currentUser;
    if (!user) return showToast("Inicia sesión para guardar favoritos", "info");

    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const wishlist = userDoc.data()?.wishlist || [];

        if (wishlist.includes(productId)) {
            await updateDoc(userRef, { wishlist: arrayRemove(productId) });
            document.getElementById(`wish-btn-${productId}`)?.classList.remove('active');
            showToast("Eliminado de favoritos", "info");
        } else {
            await updateDoc(userRef, { wishlist: arrayUnion(productId) });
            document.getElementById(`wish-btn-${productId}`)?.classList.add('active');
            showToast("¡Añadido a favoritos!", "success");
        }
        
        const freshIds = await getWishlistFromFirebase(user.uid);
        updateWishlistCounter(freshIds.length);

        // Si el drawer está abierto en la pestaña wishlist, refrescarlo
        const drawer = document.getElementById('unifiedDrawer');
        if (drawer && drawer.classList.contains('show')) {
            const tabs = document.querySelectorAll('.tab-btn');
            const activeTab = Array.from(tabs).find(t => t.classList.contains('active-tab'));
            if (activeTab && activeTab.dataset.tab === 'wishlist') {
                renderWishlistItems(freshIds);
            }
        }
    } catch (err) { console.error(err); }
}
window.toggleWishlist = toggleWishlist;
