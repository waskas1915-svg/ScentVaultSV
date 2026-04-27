// profile.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { syncVaultPoints, checkBirthdayReward } from "./loyalty_helper.js";

// Vistas
import { renderOverview } from "./profile_overview.js";
import { renderHistory } from "./profile_history.js";
import { renderLoyalty } from "./profile_loyalty.js";
import { renderSettings } from "./profile_settings.js";
import { renderAddress } from "./profile_address.js";
import { renderWishlistTab } from "./profile_wishlist.js";

export async function renderProfilePage(activeTab = 'overview') {
    const mainContent = document.getElementById('products');
    if (!mainContent || !auth.currentUser) return;

    const user = auth.currentUser;
    
    // 1. Sincronizar puntos y verificar cumpleaños
    await syncVaultPoints(user.uid);
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data() || {};
    await checkBirthdayReward(user.uid, userData);

    // 2. Cargar historial si es necesario
    let purchaseHistory = [];
    if (['overview', 'history'].includes(activeTab)) {
        try {
            const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            purchaseHistory = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.warn("Esperando índice de Firebase..."); }
    }

    const isConfigOpen = ['settings', 'address', 'wishlist'].includes(activeTab);

    // 3. Dibujar Estructura Principal
    mainContent.innerHTML = `
        <div class="profile-grid-layout animate-fade-in">
            <aside class="profile-sidebar">
                <nav class="sidebar-nav">
                    <button class="nav-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📊 Overview</button>
                    <button class="nav-item ${activeTab === 'history' ? 'active' : ''}" data-tab="history">🛍️ Mis Pedidos</button>
                    <button class="nav-item ${activeTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty">✨ Vault Rewards</button>
                    <div class="nav-group">
                        <button class="nav-item collapsible-trigger" id="btn-toggle-config">
                            ⚙️ AJUSTES <span class="arrow-icon">${isConfigOpen ? '−' : '+'}</span>
                        </button>
                        <div class="sidebar-sub-menu ${isConfigOpen ? 'open' : ''}" id="submenu-config">
                            <div class="sub-item ${activeTab === 'settings' ? 'selected' : ''}" data-tab="settings">Perfil</div>
                            <div class="sub-item ${activeTab === 'address' ? 'selected' : ''}" data-tab="address">Direcciones</div>
                            <div class="sub-item ${activeTab === 'wishlist' ? 'selected' : ''}" data-tab="wishlist">Favoritos</div>
                        </div>
                    </div>
                    <button class="nav-item logout-red" id="page-logout">🚪 Cerrar Sesión</button>
                </nav>
            </aside>
            <section class="profile-main-content" id="profile-tab-container"></section>
        </div>
    `;

    const container = document.getElementById('profile-tab-container');
    const params = { userData, user, history: purchaseHistory };

    // 4. Inyección de Pestaña (IMPORTANTE: renderLoyalty es async)
    switch (activeTab) {
        case 'overview': container.innerHTML = renderOverview(params); break;
        case 'history':  container.innerHTML = renderHistory(params); break;
        case 'loyalty':  container.innerHTML = await renderLoyalty(params); break; 
        case 'settings': container.innerHTML = renderSettings(params); break;
        case 'address':  container.innerHTML = renderAddress(params); break;
        case 'wishlist': container.innerHTML = renderWishlistTab(params); break;
    }

    // Eventos de navegación
    mainContent.querySelectorAll('[data-tab]').forEach(btn => {
        btn.onclick = () => renderProfilePage(btn.getAttribute('data-tab'));
    });

    const configBtn = document.getElementById('btn-toggle-config');
    if (configBtn) {
        configBtn.onclick = () => {
            const sub = document.getElementById('submenu-config');
            const arrow = document.querySelector('.arrow-icon');
            const isOpen = sub.classList.toggle('open');
            arrow.textContent = isOpen ? "−" : "+";
        };
    }

    document.getElementById('page-logout').onclick = () => signOut(auth).then(() => location.reload());
}

export async function renderOrdersHistory() { renderProfilePage('history'); }
window.renderProfilePage = renderProfilePage;