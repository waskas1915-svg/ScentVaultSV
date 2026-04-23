// profile.js 

import { auth, db } from "./firebase.js"; 
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { showToast } from "./toast.js"; 

export async function renderProfilePage(activeTab = 'settings') {
    const mainContent = document.getElementById('products'); // Asegúrate que este ID es el correcto
    if (!mainContent) return;

    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // ESTRUCTURA LIMPIA: Un solo contenedor con 3 hijos directos
    mainContent.innerHTML = `
        <div class="profile-grid-layout">
            
            <aside class="profile-sidebar">
                <nav class="sidebar-nav">
                    <button class="nav-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
                        <span class="icon">📦</span> Overview
                    </button>
                    <button class="nav-item ${activeTab === 'history' ? 'active' : ''}" data-tab="history">
                        <span class="icon">🛍️</span> Historial
                    </button>
                    <button class="nav-item ${activeTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty">
                        <span class="icon">💳</span> Recompensas
                    </button>

                    <div class="sidebar-menu-group">
                        <button class="nav-item" id="toggle-sidebar-settings">
                            CONFIGURACIÓN
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

            <div class="profile-grid-spacer"></div>
        </div>
    `;

    // --- LOGICA DE NAVEGACIÓN ---
    mainContent.querySelectorAll('[data-tab]').forEach(btn => {
        btn.onclick = () => renderProfilePage(btn.getAttribute('data-tab'));
    });

    const sidebarToggle = document.getElementById('toggle-sidebar-settings');
    if (sidebarToggle) {
        sidebarToggle.onclick = () => {
            const menu = document.getElementById('sidebar-sub-menu');
            const icon = document.getElementById('sidebar-icon');
            const isOpen = menu.classList.toggle('open');
            icon.textContent = isOpen ? "−" : "+";
        };
    }

    document.getElementById('page-logout').onclick = () => signOut(auth).then(() => location.reload());
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
        // 1. Obtenemos el array (si no existe, usamos uno vacío)
        const addresses = userData?.addresses || [];

        return `
            <div class="address-view">
                <h1 class="page-title">Gestionar Direcciones</h1>
                <button class="add-address-btn" onclick="openAddressModal()">+ AGREGAR NUEVA DIRECCIÓN</button>

                <div class="saved-addresses-section">
                    ${addresses.length === 0 ? 
                        '<p>No tienes direcciones guardadas.</p>' : 
                        addresses.map((addr, index) => `
                            <div class="address-card">
                                <div class="address-details">
                                    <strong>${addr.fullName}</strong>
                                    <p>${addr.colonia}, ${addr.street}</p>
                                    <p>${addr.municipality}, ${addr.department}</p>
                                    <p>T: ${addr.phone}</p>
                                </div>
                                <div class="address-footer">
                                    <button class="edit-btn-link" onclick='openAddressModal(${JSON.stringify(addr)}, ${index})'>Editar</button>
                                    <button class="delete-btn-link" onclick='deleteAddress(${index})'>Eliminar</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }
    return `<h2>Sección ${tab}</h2>`;
}

function openAddressModal(userData) {
    const modal = document.createElement('div');
    modal.className = 'address-modal-overlay animate-fade-in';
    
    // Lista de los 14 departamentos de El Salvador
    const departamentos = [
        "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", 
        "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador", 
        "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
    ];

    modal.innerHTML = `
        <div class="address-modal-content">
            <h2 class="playfair">Nueva Dirección</h2>
            <form id="address-form" class="settings-form">
                <div class="input-group">
                    <label>Nombre de quien recibe</label>
                    <input type="text" id="addr-name" placeholder="Ej. Kevin Santamaria" required>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label>Departamento</label>
                        <select id="addr-dept" required>
                            <option value="" disabled selected>Selecciona un departamento</option>
                            ${departamentos.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Municipio / Distrito</label>
                        <input type="text" id="addr-muni" placeholder="Ej. Santa Tecla" required>
                    </div>
                </div>

                <div class="input-group">
                    <label>Colonia, Residencial o Barrio</label>
                    <input type="text" id="addr-colonia" placeholder="Ej. Residencial Santa Teresa" required>
                </div>

                <div class="input-group">
                    <label>Calle, Pasaje y # de Casa</label>
                    <input type="text" id="addr-street" placeholder="Ej. Calle El Boquerón, Pasaje 3, Casa #12" required>
                </div>

                <div class="input-group">
                    <label>Punto de Referencia (Opcional pero recomendado)</label>
                    <textarea id="addr-ref" placeholder="Ej. Frente a la tienda de la esquina, portón color negro" rows="2"></textarea>
                </div>

                <div class="input-group">
                    <label>Teléfono de Contacto</label>
                    <input type="tel" id="addr-phone" placeholder="7000 0000" required>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="cancel-btn" id="close-modal">CANCELAR</button>
                    <button type="submit" class="primary-btn gold-btn">GUARDAR DIRECCIÓN</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-modal').onclick = () => modal.remove();

    document.getElementById('address-form').onsubmit = async (e) => {
        e.preventDefault();
        const newAddress = {
            fullName: document.getElementById('addr-name').value,
            department: document.getElementById('addr-dept').value,
            municipality: document.getElementById('addr-muni').value,
            colonia: document.getElementById('addr-colonia').value,
            street: document.getElementById('addr-street').value,
            reference: document.getElementById('addr-ref').value,
            phone: document.getElementById('addr-phone').value,
            isDefault: false,
            createdAt: new Date().toISOString()
        };

        await saveAddressToFirebase(newAddress);
        modal.remove();
    };
}

// Save to firebase

import { arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function saveAddressToFirebase(addressData) {
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);

    try {
        await updateDoc(userRef, {
            addresses: arrayUnion(addressData) // Agrega al array sin sobrescribir
        });
        
        showToast("Dirección guardada con éxito", "success");
        
        // Refrescamos la vista de direcciones inmediatamente
        renderProfilePage('address'); 
    } catch (error) {
        console.error("Error al guardar dirección:", error);
        showToast("Hubo un error al guardar", "error");
    }
}

window.deleteAddress = async (index) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) return;

    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    
    try {
        const userDoc = await getDoc(userRef);
        const addresses = userDoc.data().addresses;
        const addressToRemove = addresses[index];

        await updateDoc(userRef, {
            addresses: arrayRemove(addressToRemove)
        });

        showToast("Dirección eliminada", "success");
        renderProfilePage('address'); // Refrescar vista
    } catch (error) {
        console.error("Error al eliminar:", error);
        showToast("No se pudo eliminar", "error");
    }
};

window.openAddressModal = openAddressModal;
window.deleteAddress = deleteAddress;
window.renderProfilePage = renderProfilePage;