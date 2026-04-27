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

// IMPORTANTE: Importamos las funciones de navegación del perfil para los accesos directos
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
    document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo
    
    switchTab(tabName);
}

/**
 * Cierra el drawer por completo
 */
export function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = ''; // Libera scroll
}

/**
 * Gestiona el cambio de pestañas internas del Drawer (Cart, Account, Wishlist)
 */
export async function switchTab(tabName) {
    const contentContainer = document.getElementById('drawerContent');
    if (!contentContainer) return;

    // Gestión visual de botones superiores
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active-tab', isActive);
    });

    contentContainer.innerHTML = ""; // Limpiar contenido previo

    switch (tabName) {
        case 'cart':
            renderCart({ 
                closeCart: closeDrawer, 
                refreshCart: () => switchTab('cart'),
                onCheckout: () => {
                    checkout({ 
                        closeCart: closeDrawer, 
                        onBack: () => switchTab('cart') 
                    });
                }
            });
            break;

        case 'account':
            // renderAccountView() dibujará el menú de perfil si hay sesión
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
 * FUNCIÓN CLAVE: Navegación desde el Drawer hacia el Perfil de Usuario
 * Esta función es la que llaman los botones "Vista General", "Pedidos", etc.
 */
window.goToProfileTab = (tabName) => {
    closeDrawer(); // 1. Cerramos el panel lateral
    
    // 2. Ejecutamos el renderizado de la pestaña específica en la página principal
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
    
    // Cerrar al hacer clic en el fondo oscuro
    if (overlay) overlay.onclick = closeDrawer;

    // Vincular botones de pestañas del drawer
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => switchTab(btn.dataset.tab);
    });
}

// Exposición global para botones generados dinámicamente en otros archivos (como auth_status.js)
window.closeDrawer = closeDrawer;
window.switchTab = switchTab;
window.openDrawer = openDrawer;