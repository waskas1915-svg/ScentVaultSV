// app.js
import { auth, db } from "./firebase.js";
// CHANGED: Added showLandingPage to handle the view orchestration
import { showProducts, showLandingPage } from "./ui.js"; 
import { updateCartUI, addToCart } from "./cart.js";
import { initHeader } from "./header.js";
import { initDrawer, openDrawer } from "./drawer.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Mantenemos la exportación para que otros módulos puedan importar la lista
export let allProducts = [];

/**
 * Escucha el estado de autenticación y carga los productos iniciales
 */
onAuthStateChanged(auth, async (user) => {
    try {
        // Solo cargamos productos si la lista está vacía para evitar peticiones extra
        if (allProducts.length === 0) {
            const querySnapshot = await getDocs(collection(db, "products"));
            
            allProducts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    // 1. Esparcimos los datos del documento (trae el id manual, ej: 212)
                    ...data, 
                    // 2. SOBREESCRIBIMOS el id con el ID real de Firebase (ej: Lz7g1OHp...)
                    // Esto es VITAL para que la resta de stock en checkout.js funcione.
                    id: doc.id, 
                    // 3. Guardamos tu ID manual como referencia por si lo necesitas
                    manualId: String(data.id) 
                };
            });

            // Publicamos la lista globalmente para que cart.js y ui.js validen el stock
            window.allProducts = allProducts; 
        }
        
        // CHANGED: Now rendering the educational landing page view first instead of the grid directly
        showLandingPage(allProducts, handleAddToCart);
        
    } catch (err) {
        console.error("Error crítico en el inicio de la App:", err);
    }
});

/**
 * Inicialización de componentes de la interfaz
 */
async function init() {
    initHeader();
    initDrawer();
    updateCartUI(); // Sincroniza el contador del carrito al cargar la página
}

/**
 * Lógica puente para añadir productos y abrir el drawer del carrito
 */
function handleAddToCart(id, name, size, price, image, ml) {
    addToCart(id, name, size, price, image, ml, () => {
        openDrawer('cart'); 
    });
}

// Ejecutar init cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);

/**
 * Función global para regresar al inicio (Home) y limpiar filtros
 * CHANGED: Pointing this to showLandingPage to keep routing UX fluid
 */
export function resetToHome() {
    if (window.allProducts) {
        showLandingPage(window.allProducts, handleAddToCart);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Vinculación global para que el HTML pueda llamar a resetToHome()
window.resetToHome = resetToHome;

// Configuración del clic en el logo de ScentVaultSV
const logo = document.getElementById("logo");
if (logo) {
    logo.onclick = (e) => {
        e.preventDefault();
        resetToHome();
    };
}

window.addEventListener('popstate', (event) => {
    // Si el estado es nulo o no registra la vista del catálogo, significa que volvió al inicio
    if (!event.state || event.state.view !== 'catalog') {
        
        // Ejecuta aquí la función nativa que vuelve a pintar tu Landing Page por defecto
        // Por ejemplo, si tu función se llama renderLandingPage, la invocas:
        if (typeof renderLandingPage === 'function') {
            renderLandingPage();
        } else {
            // Si recargas el index.html por defecto para volver a la landing:
            window.location.reload(); 
        }
    }
});

// Al cargar la página por primera vez, aseguramos el estado inicial de la Landing
if (!history.state) {
    history.replaceState({ view: 'landing' }, 'Inicio', ' ');
}