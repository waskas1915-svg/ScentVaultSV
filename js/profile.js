// profile.js 

import { auth, db } from "./firebase.js"; 
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { showToast } from "./toast.js"; 

export async function renderProfilePage(activeTab = 'settings') {
    // Cambiamos 'main-content' por 'products' que es el que tú usas
    const mainContent = document.getElementById('products'); 
    
    if (!mainContent) {
        console.error("No se encontró el contenedor 'products'");
        return; 
    }

    const user = auth.currentUser;
    if (!user) return;

    // Cargamos datos de Firebase
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // 2. Estructura Limpia (Sin duplicados y sin onclick)
    mainContent.innerHTML = `
        <div class="profile-page-layout container">
            
            <aside class="profile-sidebar">
                <nav class="sidebar-nav">
                    <button class="nav-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
                        <span class="icon">📦</span> Overview
                    </button>
                    <button class="nav-item ${activeTab === 'history' ? 'active' : ''}" data-tab="history">
                        <span class="icon">🛍️</span> Purchase History
                    </button>
                    <button class="nav-item ${activeTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty">
                        <span class="icon">💳</span> Loyalty & Rewards
                    </button>

                    <div class="sidebar-menu-group">
                        <button class="nav-item" id="toggle-sidebar-settings">
                            <span class="icon">⚙️</span> CONFIGURACIÓN
                            <span class="plus-icon" id="sidebar-icon">${['settings', 'address', 'wishlist'].includes(activeTab) ? '−' : '+'}</span>
                        </button>
                        
                        <div class="sidebar-sub-menu ${['settings', 'address', 'wishlist'].includes(activeTab) ? 'open' : ''}" id="sidebar-sub-menu">
                            <div class="sub-item ${activeTab === 'settings' ? 'selected' : ''}" data-tab="settings">Perfil</div>
                            <div class="sub-item ${activeTab === 'address' ? 'selected' : ''}" data-tab="address">Mi dirección</div>
                            <div class="sub-item ${activeTab === 'wishlist' ? 'selected' : ''}" data-tab="wishlist">Wishlist</div>
                        </div>
                    </div>

                    <hr>
                    <button class="nav-item logout-red" id="page-logout">
                        <span class="icon">🚪</span> Sign Out
                    </button>
                </nav>
            </aside>

            <section class="profile-main-content">
                <div id="tab-content">
                    ${renderTabContent(activeTab, userData, user)}
                </div>
            </section>

            <div class="profile-sidebar-spacer"></div>
        </div>
    `;

    // --- LÓGICA DE EVENTOS (Adiós a los ReferenceErrors) ---

    // 3. Manejo de pestañas (Navegación interna)
    mainContent.querySelectorAll('[data-tab]').forEach(button => {
        button.onclick = () => {
            const targetTab = button.getAttribute('data-tab');
            renderProfilePage(targetTab); // Recarga la vista con la nueva pestaña
        };
    });

    // 4. Toggle del Acordeón de Configuración
    const sidebarToggle = document.getElementById('toggle-sidebar-settings');
    const sidebarSubMenu = document.getElementById('sidebar-sub-menu');
    const sidebarIcon = document.getElementById('sidebar-icon');

    if (sidebarToggle) {
        sidebarToggle.onclick = () => {
            const isOpen = sidebarSubMenu.classList.toggle('open');
            sidebarIcon.textContent = isOpen ? "−" : "+";
        };
    }

    // 5. Logout
    document.getElementById('page-logout').onclick = () => {
        signOut(auth).then(() => location.reload());
    };
}

function renderTabContent(tab, userData, user) {
    const loyalty = userData?.loyalty || { vaultPoints: 0, bottlesRecycled: 0 };
    const points = loyalty.vaultPoints || 0;
    const bottles = loyalty.bottlesRecycled || 0;
    const cashValue = (points * 0.025).toFixed(2);
    const firstName = userData?.firstName || "Usuario";

    if (tab === 'settings') {
        return `
            <div class="settings-view animate-fade-in" style="width: 100%;">
                
                <div class="profile-header-top" style="text-align: center; margin-bottom: 30px;">
                    <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 10px;">¡Bienvenido, ${firstName}!</h2>
                    
                    <div class="vault-cash-badge" style="margin: 15px auto; width: fit-content; border: 1px solid #bfa36a; padding: 8px 20px;">
                        YOU HAVE <span class="gold-text">${points} VAULT POINTS</span>
                    </div>
                    
                    <p style="font-size: 14px; color: #888;">
                        Crédito disponible: <strong>$${cashValue} USD</strong>
                    </p>
                </div>

                <div class="loyalty-stats-row" style="display: flex; align-items: center; background: #f9f9f9; padding: 25px; border-radius: 4px; border: 1px solid #eee; margin-bottom: 50px;">
                    <div style="flex: 1; text-align: center;">
                        <span style="display: block; font-size: 26px; font-weight: 700; color: #1a1a1a;">${bottles}</span>
                        <span style="font-size: 9px; color: #999; letter-spacing: 1px; text-transform: uppercase;">FRASCOS RECICLADOS</span>
                    </div>
                    <div style="width: 1px; background: #ddd; height: 40px; margin: 0 10px;"></div>
                    <div style="flex: 1; text-align: center;">
                        <span style="display: block; font-size: 26px; font-weight: 700; color: #1a1a1a;">${points}</span>
                        <span style="font-size: 9px; color: #999; letter-spacing: 1px; text-transform: uppercase;">PUNTOS TOTALES</span>
                    </div>
                </div>

                <div class="settings-form-container">
                    <nav style="font-size: 10px; color: #aaa; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;">Perfil > Configuracion De Perfil</nav>
                    <h1 style="font-family: 'Playfair Display', serif; font-size: 26px; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Configuracion De Perfil</h1>

                    <div style="display: flex; flex-direction: column; gap: 25px;">
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #333;">PRIMER NOMBRE*</label>
                                <input type="text" id="edit-firstName" value="${userData.firstName}" style="width: 100%; padding: 12px; border: 1px solid #ddd; font-size: 14px;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #333;">APELLIDO*</label>
                                <input type="text" id="edit-lastName" value="${userData.lastName}" style="width: 100%; padding: 12px; border: 1px solid #ddd; font-size: 14px;">
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #333;">CONTRASEÑA*</label>
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="password" value="************" disabled style="width: 100%; padding: 12px; border: 1px solid #ddd; background: #f5f5f5; color: #888;">
                                <button style="position: absolute; right: 10px; background: none; border: none; color: #bfa36a; cursor: pointer;">✎</button>
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #333;">CORREO ELECTRÓNICO*</label>
                            <input type="email" value="${user.email}" disabled style="width: 100%; padding: 12px; border: 1px solid #ddd; background: #f5f5f5; color: #888;">
                        </div>

                        <div>
                            <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #333;">NUMERO DE TELTEFONO*</label>
                            <div style="display: flex; gap: 10px;">
                                <div style="background: #f5f5f5; padding: 12px; border: 1px solid #ddd; font-size: 14px; color: #666; min-width: 80px; text-align: center;">
                                    🇸🇻 +503
                                </div>
                                <input type="tel" id="edit-phone" value="${userData.phone || ''}" placeholder="7000 0000" style="flex: 1; padding: 12px; border: 1px solid #ddd;">
                            </div>
                        </div>

                        <button class="primary-btn gold-btn" style="width: 100%; padding: 18px; margin-top: 20px; font-weight: bold; letter-spacing: 1px; cursor: pointer;">
                            SAVE CHANGES
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    else if (tab === 'address') {
        // Simulamos una dirección guardada (luego la traerás de Firebase)
        const address = userData?.address || {
            fullName: `${userData.firstName} ${userData.lastName}`,
            street: "7343 NW 79th Ter, Suite 503 KS3405",
            city: "Medley",
            state: "Florida",
            zip: "33195",
            country: "US",
            phone: userData.phone || "(305) 999-7380"
        };

        return `
            <div class="address-view animate-fade-in" style="width: 100%; max-width: 700px; margin: 0 auto;">
                <nav class="breadcrumb-nav">MI CUENTA > LIBRETA DE DIRECCIONES</nav>
                <h1 class="page-title">Gestionar Direcciones</h1>
                <p class="section-subtitle">Guarda tus direcciones de envío y facturación para un proceso de compra más rápido.</p>

                <button class="primary-btn black-btn add-address-btn">
                    <span class="plus-icon">+</span> AGREGAR NUEVA DIRECCIÓN
                </button>

                <div class="saved-addresses-section">
                    <h3 class="sub-title-gold">Direcciones Guardadas</h3>
                    
                    <div class="address-card">
                        <div class="address-details">
                            <strong>${address.fullName}</strong>
                            <p>${address.street}</p>
                            <p>${address.city}, ${address.state}, ${address.zip} ${address.country}</p>
                            <p>T: ${address.phone}</p>
                        </div>
                        <div class="address-footer">
                            <span class="address-label">Dirección de Envío Predeterminada</span>
                            <button class="edit-btn-link" onclick="openAddressModal()">Editar</button>
                        </div>
                    </div>

                    <div class="address-card">
                        <div class="address-details">
                            <strong>${address.fullName}</strong>
                            <p>${address.street}</p>
                            <p>${address.city}, ${address.state}, ${address.zip} ${address.country}</p>
                            <p>T: ${address.phone}</p>
                        </div>
                        <div class="address-footer">
                            <span class="address-label">Dirección de Facturación Predeterminada</span>
                            <button class="edit-btn-link" onclick="openAddressModal()">Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    return `<h2>Sección ${tab}</h2>`;
}