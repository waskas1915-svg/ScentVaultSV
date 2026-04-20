// drawer.js
import { renderCart } from "./cart.js";
import { auth } from "./firebase.js";
import { renderAccountView } from "./auth_status.js";
import { toggleWishlist, renderWishlistItems, renderEmptyWishlist, getWishlistFromFirebase } from "./wishlist.js";
import { handleCheckout } from "./app.js";

// Elementos del DOM (asegúrate de que los IDs coincidan con tu HTML)
const drawer = document.getElementById('unifiedDrawer');
const overlay = document.getElementById('drawerOverlay');
const contentContainer = document.getElementById('drawerContent');

/**
 * Abre el drawer en una pestaña específica
 */
export function openDrawer(tabName = 'account') {
    if (!drawer || !overlay) return;
    
    drawer.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
    
    switchTab(tabName);
}

/**
 * Cierra el drawer
 */
export function closeDrawer() {
    drawer.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = ''; // Devuelve el scroll
}

/**
 * Cambia el contenido y la pestaña activa
 */
export async function switchTab(tabName) {
    const contentContainer = document.getElementById('drawerContent');
    if (!contentContainer) return;

    // 1. Actualizar visualmente las pestañas
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.classList.toggle('active-tab', btn.dataset.tab === tabName);
    });

    // 2. Limpiar el contenedor antes de cargar contenido nuevo
    contentContainer.innerHTML = ""; 

    if (tabName === 'cart') {
        renderCart({ 
            closeCart: closeDrawer, 
            refreshCart: () => switchTab('cart'),
            onCheckout: handleCheckout // Asegúrate de que esta función esté disponible
        });

    } else if (tabName === 'account') {
        renderAccountView(); 

    } else if (tabName === 'wishlist') {
        // MEJORA: Aquí deberías decidir si jalar de Firebase o LocalStorage
        const user = auth.currentUser;
        let items = [];

        if (user) {
            // Lógica para obtener items de Firestore (opcional por ahora, o usar local)
            items = await getWishlistFromFirebase(user.uid); 
        } else {
            items = JSON.parse(localStorage.getItem("wishlist")) || [];
        }

        if (items.length === 0) {
            contentContainer.innerHTML = renderEmptyWishlist();
            
            // IMPORTANTE: El botón se busca DESPUÉS de inyectar el HTML
            const btn = document.getElementById("continueWishlistBtn");
            if (btn) btn.onclick = closeDrawer; 
            
        } else {
            // Esta es la función que dibujará los perfumes guardados
            renderWishlistItems(items); 
        }
    }
}

/**
 * Inicializa los eventos de cierre y clicks en pestañas
 */
export function initDrawer() {
    const closeBtn = document.getElementById('closeDrawerBtn');
    
    if (closeBtn) closeBtn.onclick = closeDrawer;
    if (overlay) overlay.onclick = closeDrawer;

    // Listeners para las pestañas de la cabecera del drawer
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });
}

export async function renderWishlist() {
    const container = document.getElementById('drawerContent');
    const user = auth.currentUser;
    let items = [];

    // Obtener los productos (ya sea de Local o Firebase)
    if (user) {
        const docSnap = await getDoc(doc(db, "wishlists", user.uid));
        items = docSnap.exists() ? docSnap.data().items : [];
    } else {
        items = JSON.parse(localStorage.getItem("wishlist")) || [];
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <img src="images/empty-wishlist.png" style="width:150px; opacity:0.5;">
                <p>Tu lista está vacía. ¡Explora nuestras fragancias!</p>
            </div>`;
        return;
    }

    // Aquí mapeamos los IDs a los datos reales de tus productos
    container.innerHTML = `<div class="wishlist-items">${renderWishlistCards(items)}</div>`;

    window.moveToCart = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        // 1. Añadir al carrito
        addToCart(product.id, product.name, product.defaultSize, product.price, product.image);
        // 2. Quitar de la wishlist
        toggleWishlist(productId); 
        // 3. Refrescar UI
        switchTab('cart'); 
    };
}