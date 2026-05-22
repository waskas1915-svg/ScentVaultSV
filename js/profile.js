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
    
    if (typeof syncVaultPoints === 'function') await syncVaultPoints(user.uid);
    let userData = {};
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        userData = userDoc.data() || {};
        if (typeof checkBirthdayReward === 'function') await checkBirthdayReward(user.uid, userData);
    } catch (e) {
        console.error("Error al cargar datos de usuario:", e);
    }

    let purchaseHistory = [];
    if (['overview', 'history'].includes(activeTab)) {
        try {
            const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            purchaseHistory = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { 
            console.warn("Error en historial:", e); 
        }
    }

    const isConfigOpen = ['settings', 'address', 'wishlist'].includes(activeTab);

    const sidebarIcons = {
        overview: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        history: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
        loyalty: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
        settings: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        logout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
        hamburger: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
        close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };

    mainContent.innerHTML = `
        <button id="menu-toggle-btn" class="menu-toggle-btn montserrat">
            ${sidebarIcons.hamburger}
            <span>Menú de Cuenta</span>
        </button>

        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <div class="profile-grid-layout animate-fade-in montserrat">
            <aside class="account-sidebar" id="account-sidebar">
                <div class="sidebar-mobile-header">
                    <h3>Navegación</h3>
                    <button id="menu-close-btn" aria-label="Cerrar menú">${sidebarIcons.close}</button>
                </div>
                <nav class="sidebar-menu">
                    <button class="menu-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
                        ${sidebarIcons.overview}
                        <span>Overview</span>
                    </button>
                    <button class="menu-item ${activeTab === 'history' ? 'active' : ''}" data-tab="history">
                        ${sidebarIcons.history}
                        <span>Mis Pedidos</span>
                    </button>
                    <button class="menu-item ${activeTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty">
                        ${sidebarIcons.loyalty}
                        <span>Vault Rewards</span>
                    </button>
                    
                    <div class="menu-separator"></div>
                    
                    <div class="nav-group">
                        <button class="menu-item menu-sub-header" id="btn-toggle-config">
                            ${sidebarIcons.settings}
                            <span>AJUSTES</span>
                            <span class="arrow-icon" style="margin-left: auto; font-weight: bold;">${isConfigOpen ? '−' : '+'}</span>
                        </button>
                        <div class="sidebar-sub-menu ${isConfigOpen ? 'open' : ''}" id="submenu-config">
                            <div class="sub-item ${activeTab === 'settings' ? 'selected' : ''}" data-tab="settings">Perfil</div>
                            <div class="sub-item ${activeTab === 'address' ? 'selected' : ''}" data-tab="address">Direcciones</div>
                            <div class="sub-item ${activeTab === 'wishlist' ? 'selected' : ''}" data-tab="wishlist">Favoritos</div>
                        </div>
                    </div>
                    
                    <button class="menu-item menu-logout" id="page-logout">
                        ${sidebarIcons.logout}
                        <span>Cerrar Sesión</span>
                    </button>
                </nav>
            </aside>
            <section class="profile-main-content-v2" id="profile-tab-container"></section>
        </div>
    `;

    const container = document.getElementById('profile-tab-container');
    const params = { userData, user, history: purchaseHistory };

    if (container) {
        switch (activeTab) {
            case 'overview': if (typeof renderOverview === 'function') container.innerHTML = renderOverview(params); break;
            case 'history':  if (typeof renderHistory === 'function') container.innerHTML = renderHistory(params); break;
            case 'loyalty':  if (typeof renderLoyalty === 'function') container.innerHTML = await renderLoyalty(params); break; 
            case 'settings': if (typeof renderSettings === 'function') container.innerHTML = renderSettings(params); break;
            case 'address':  if (typeof renderAddress === 'function') container.innerHTML = renderAddress(params); break;
            case 'wishlist': if (typeof renderWishlistTab === 'function') container.innerHTML = renderWishlistTab(params); break;
        }
    }

    const sidebar = document.getElementById('account-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('menu-close-btn');

    const openMenu = () => {
        if (sidebar && overlay) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        }
    };

    const closeMenu = () => {
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    };

    if (toggleBtn) toggleBtn.onclick = openMenu;
    if (closeBtn) closeBtn.onclick = closeMenu;
    if (overlay) overlay.onclick = closeMenu;

    mainContent.querySelectorAll('[data-tab]').forEach(btn => {
        btn.onclick = () => {
            closeMenu();
            const targetTab = btn.getAttribute('data-tab');
            renderProfilePage(targetTab);
        };
    });

    const configBtn = document.getElementById('btn-toggle-config');
    if (configBtn) {
        configBtn.onclick = (e) => {
            e.stopPropagation();
            const sub = document.getElementById('submenu-config');
            const arrow = configBtn.querySelector('.arrow-icon');
            if (sub && arrow) {
                const isOpen = sub.classList.toggle('open');
                arrow.textContent = isOpen ? "−" : "+";
            }
        };
    }

    const logoutBtn = document.getElementById('page-logout');
    if (logoutBtn) {
        logoutBtn.onclick = () => signOut(auth).then(() => location.reload());
    }
}