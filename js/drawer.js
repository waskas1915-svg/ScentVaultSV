// drawer.js
import { renderCart } from "./cart.js";
import { auth } from "./firebase.js";
import { renderAccountView } from "./auth_status.js";
import { 
    renderWishlistItems, 
    renderEmptyWishlist, 
    getWishlistFromFirebase 
} from "./wishlist.js";
import { checkout } from "./checkout.js";
import { renderProfilePage } from "./profile.js";

const drawer = document.getElementById('unifiedDrawer');
const overlay = document.getElementById('drawerOverlay');

/**
 * Abre el drawer en una pestaña específica
 */
export function openDrawer(tabName = 'account') {
    if (!drawer || !overlay) return;
    
    drawer.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; 
    
    switchTab(tabName);
}

/**
 * Cierra el drawer por completo
 */
export function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = ''; 
}

/**
 * Gestiona el cambio de pestañas internas del Drawer (Cart, Account, Wishlist)
 */
export async function switchTab(tabName) {
    const contentContainer = document.getElementById('drawerContent');
    if (!contentContainer) return;

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active-tab', isActive);
    });

    contentContainer.innerHTML = ""; 

    switch (tabName) {
        case 'cart':
            // --- CAMBIO AQUÍ: onBack simplemente reabre la pestaña del carrito de forma fluida ---
            renderCart({ 
                closeCart: closeDrawer, 
                refreshCart: () => switchTab('cart'),
                onCheckout: () => {
                    checkout({ 
                        closeCart: closeDrawer, 
                        onBack: () => {
                            closeDrawer();
                        } 
                    });
                }
            });
            break;

        case 'account':
            renderAccountView(); 
            break;

        case 'wishlist':
            const user = auth.currentUser;
            let items = [];

            if (user) {
                items = await getWishlistFromFirebase(user.uid); 
            } else {
                items = JSON.parse(localStorage.getItem("wishlist")) || [];
            }

            if (items.length === 0) {
                contentContainer.innerHTML = renderEmptyWishlist();
                const btn = document.getElementById("continueWishlistBtn");
                if (btn) btn.onclick = closeDrawer; 
            } else {
                renderWishlistItems(items); 
            }
            break;
            
        default:
            console.warn(`La pestaña ${tabName} no existe.`);
            renderAccountView();
    }
}

/**
 * Navegación desde el Drawer hacia el Perfil de Usuario
 */
window.goToProfileTab = (tabName) => {
    closeDrawer(); 
    if (typeof renderProfilePage === 'function') {
        renderProfilePage(tabName);
    } else {
        console.error("La función renderProfilePage no está disponible.");
    }
};

/**
 * Inicializa los eventos base del Drawer
 */
export function initDrawer() {
    const closeBtn = document.getElementById('closeDrawerBtn');
    if (closeBtn) closeBtn.onclick = closeDrawer;
    
    if (overlay) overlay.onclick = closeDrawer;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });
}

window.closeDrawer = closeDrawer;
window.switchTab = switchTab;
window.openDrawer = openDrawer;