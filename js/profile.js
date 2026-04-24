// profile.js 
import { auth, db } from "./firebase.js"; 
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { showToast } from "./toast.js"; 

export async function renderProfilePage(activeTab = 'settings') {
    const mainContent = document.getElementById('products'); 
    if (!mainContent) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data() || {};

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
            </div>
        `;

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

    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }
}

function renderTabContent(tab, userData, user) {
    const loyalty = userData?.loyalty || { vaultPoints: 0, bottlesRecycled: 0 };
    const points = loyalty.vaultPoints || 0;
    const bottles = loyalty.bottlesRecycled || 0;
    const cashValue = (points * 0.025).toFixed(2);
    const firstName = userData?.firstName || "Usuario";

    if (tab === 'settings') {
        return `
            <div class="settings-view animate-fade-in">
                <div class="profile-header-top" style="text-align: center; margin-bottom: 30px;">
                    <h2 class="playfair" style="font-size: 32px;">¡Bienvenido, ${firstName}!</h2>
                    <div class="vault-cash-badge" style="margin: 15px auto; width: fit-content; border: 1px solid #bfa36a; padding: 8px 20px;">
                        YOU HAVE <span class="gold-text">${points} VAULT POINTS</span>
                    </div>
                    <p style="font-size: 14px; color: #888;">Crédito disponible: <strong>$${cashValue} USD</strong></p>
                </div>

                <div class="loyalty-stats-row" style="display: flex; background: #f9f9f9; padding: 25px; border: 1px solid #eee; margin-bottom: 40px;">
                    <div style="flex: 1; text-align: center;">
                        <span style="display: block; font-size: 26px; font-weight: 700;">${bottles}</span>
                        <span style="font-size: 9px; color: #999; letter-spacing: 1px;">FRASCOS RECICLADOS</span>
                    </div>
                    <div style="width: 1px; background: #ddd; height: 40px;"></div>
                    <div style="flex: 1; text-align: center;">
                        <span style="display: block; font-size: 26px; font-weight: 700;">${points}</span>
                        <span style="font-size: 9px; color: #999; letter-spacing: 1px;">PUNTOS TOTALES</span>
                    </div>
                </div>

                <div class="settings-form-container">
                    <h1 class="playfair" style="font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 25px;">Configuración De Perfil</h1>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <label style="font-size: 11px; font-weight: 700;">PRIMER NOMBRE*</label>
                                <input type="text" id="edit-firstName" value="${userData.firstName || ''}" style="width: 100%; padding: 12px; border: 1px solid #ddd;">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 11px; font-weight: 700;">APELLIDO*</label>
                                <input type="text" id="edit-lastName" value="${userData.lastName || ''}" style="width: 100%; padding: 12px; border: 1px solid #ddd;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size: 11px; font-weight: 700;">CORREO ELECTRÓNICO*</label>
                            <input type="email" value="${user.email}" disabled style="width: 100%; padding: 12px; border: 1px solid #ddd; background: #f5f5f5; color: #888;">
                        </div>
                        <button class="primary-btn gold-btn" style="width: 100%; padding: 18px; font-weight: bold;">SAVE CHANGES</button>
                    </div>
                </div>
            </div>
        `;
    }

    else if (tab === 'address') {
        const addresses = userData?.addresses || [];
        return `
            <div class="address-view animate-fade-in">
                <h1 class="playfair" style="text-align: center; font-size: 28px;">Gestionar Direcciones</h1>
                <button class="primary-btn gold-btn" style="margin: 20px auto; display: block;" onclick="openAddressModal()">
                    + AGREGAR NUEVA DIRECCIÓN
                </button>
                <div class="saved-addresses-list">
                    ${addresses.length === 0 ? 
                        '<p style="text-align: center; color: #666; margin-top: 30px;">No tienes direcciones guardadas.</p>' : 
                        addresses.map((addr, index) => `
                            <div class="address-card" style="margin-bottom: 20px; padding: 20px; border: 1px solid #eee; background: #fff; position: relative;">
                                <strong style="font-size: 16px; color: #bfa36a; display: block; margin-bottom: 5px;">${addr.fullName}</strong>
                                <p style="margin: 2px 0;">${addr.colonia}, ${addr.street}</p>
                                <p style="margin: 2px 0;">${addr.municipality}, ${addr.department}</p>
                                <p style="font-style: italic; font-size: 12px; color: #888; margin-top: 8px;">Ref: ${addr.reference || 'Sin referencia'}</p>
                                <div style="margin-top: 15px; border-top: 1px solid #f9f9f9; padding-top: 10px; display: flex; gap: 15px;">
                                    <button class="edit-btn-link" style="color: #bfa36a; border: none; background: none; cursor: pointer;" onclick='openAddressModal(${JSON.stringify(addr).replace(/'/g, "&apos;")}, ${index})'>Editar</button>
                                    <button class="delete-btn-link" style="color: #ff4d4d; border: none; background: none; cursor: pointer;" onclick="deleteAddress(${index})">Eliminar</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }

    else if (tab === 'wishlist') {
        const wishlistIds = userData?.wishlist || [];

        if (wishlistIds.length === 0) {
            return `
                <div class="empty-state" style="text-align: center; padding: 60px 20px;">
                    <img src="./images/emptycart2.png" style="width: 120px; opacity: 0.3; margin-bottom: 20px;">
                    <h2 class="playfair">Tu lista está vacía</h2>
                    <p style="color: #666; margin-bottom: 25px;">No tienes fragancias guardadas.</p>
                    <button class="primary-btn gold-btn" onclick="resetToHome()">EXPLORAR COLECCIÓN</button>
                </div>`;
        }

        return `
            <div class="wishlist-view animate-fade-in">
                <nav class="breadcrumb-nav">MI CUENTA > WISHLIST</nav>
                <h1 class="playfair" style="text-align: center; margin-bottom: 10px;">Mis Favoritos</h1>
                <p style="text-align: center; color: #888; margin-bottom: 40px;">Fragancias que han capturado tu atención.</p>

                <div class="wishlist-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px;">
                    ${wishlistIds.map(id => {
                        const product = window.allProducts?.find(p => String(p.id) === String(id));
                        if (!product) return ''; 

                        return `
                            <div class="wishlist-item-card" style="border: 1px solid #eee; padding: 15px; position: relative; background: #fff; text-align: center;">
                                <button class="remove-wish-btn" 
                                        onclick="removeFromWishlist('${product.id}')" 
                                        style="position: absolute; top: 10px; right: 10px; z-index: 10; border: none; background: #fff; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                    ×
                                </button>
                                <div class="wishlist-img-container" style="height: 200px; overflow: hidden; margin-bottom: 15px;">
                                    <img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="wishlist-info">
                                    <h4 class="playfair" style="font-size: 16px; margin-bottom: 15px;">${product.name}</h4>
                                    <button class="primary-btn gold-btn" style="width: 100%; font-size: 11px; padding: 12px;" 
                                            onclick="viewProduct('${product.id}', window.allProducts)">
                                        VER OPCIONES
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    return `<h2>Sección ${tab}</h2>`;
}

window.openAddressModal = function(editData = null, index = null) {
    const modal = document.createElement('div');
    modal.className = 'address-modal-overlay animate-fade-in';
    
    const departamentos = [
        "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad", 
        "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador", 
        "San Vicente", "Santa Ana", "Sonsonate", "Usulután"
    ];

    modal.innerHTML = `
        <div class="address-modal-content" style="max-width: 500px; background: #fff; padding: 30px; margin: 50px auto; position: relative; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 class="playfair" style="margin-bottom: 20px; font-size: 24px;">${editData ? 'Editar Dirección' : 'Nueva Dirección'}</h2>
            <form id="address-form" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" id="addr-name" placeholder="Nombre de quien recibe" value="${editData?.fullName || ''}" required style="padding: 12px; border: 1px solid #ddd;">
                <div style="display: flex; gap: 10px;">
                    <select id="addr-dept" required style="flex: 1; padding: 12px; border: 1px solid #ddd; background: #fff;">
                        <option value="" disabled ${!editData ? 'selected' : ''}>Departamento</option>
                        ${departamentos.map(d => `<option value="${d}" ${editData?.department === d ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                    <input type="text" id="addr-muni" placeholder="Municipio" value="${editData?.municipality || ''}" required style="flex: 1; padding: 12px; border: 1px solid #ddd;">
                </div>
                <input type="text" id="addr-colonia" placeholder="Colonia o Residencial" value="${editData?.colonia || ''}" required style="padding: 12px; border: 1px solid #ddd;">
                <input type="text" id="addr-street" placeholder="Calle y # de Casa" value="${editData?.street || ''}" required style="padding: 12px; border: 1px solid #ddd;">
                <textarea id="addr-ref" placeholder="Referencia" rows="2" style="padding: 12px; border: 1px solid #ddd;">${editData?.reference || ''}</textarea>
                <input type="tel" id="addr-phone" placeholder="Teléfono" value="${editData?.phone || ''}" required style="padding: 12px; border: 1px solid #ddd;">
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button type="button" onclick="this.closest('.address-modal-overlay').remove()" style="flex: 1; padding: 15px; background: #eee; border: none; cursor: pointer;">CANCELAR</button>
                    <button type="submit" class="primary-btn gold-btn" style="flex: 2; padding: 15px;">${editData ? 'ACTUALIZAR' : 'GUARDAR'}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('address-form').onsubmit = async (e) => {
        e.preventDefault();
        const addressObj = {
            fullName: document.getElementById('addr-name').value,
            department: document.getElementById('addr-dept').value,
            municipality: document.getElementById('addr-muni').value,
            colonia: document.getElementById('addr-colonia').value,
            street: document.getElementById('addr-street').value,
            reference: document.getElementById('addr-ref').value,
            phone: document.getElementById('addr-phone').value,
            isDefault: editData ? editData.isDefault : false
        };

        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);

        try {
            const userDoc = await getDoc(userRef);
            let currentAddresses = userDoc.data()?.addresses || [];
            if (index !== null) currentAddresses[index] = addressObj;
            else currentAddresses.push(addressObj);

            await updateDoc(userRef, { addresses: currentAddresses });
            showToast("Dirección actualizada", "success");
            modal.remove();
            renderProfilePage('address'); 
        } catch (err) {
            showToast("Error al guardar", "error");
        }
    };
};

window.deleteAddress = async (index) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    try {
        const userDoc = await getDoc(userRef);
        let addresses = userDoc.data().addresses;
        addresses.splice(index, 1);
        await updateDoc(userRef, { addresses: addresses });
        showToast("Dirección eliminada", "info");
        renderProfilePage('address');
    } catch (err) {
        showToast("Error al eliminar", "error");
    }
};

window.renderProfilePage = renderProfilePage;