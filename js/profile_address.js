// profile_address.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

export function renderAddress({ userData }) {
    const addresses = userData.addresses || [];
    return `
        <div class="address-view animate-fade-in">
            <h2 class="playfair">Mis Direcciones</h2>
            <button class="primary-btn gold-btn" onclick="window.openAddressModal()">+ AGREGAR</button>
            <div class="address-grid">
                ${addresses.map((addr, i) => `
                    <div class="address-card">
                        <strong>${addr.fullName}</strong>
                        <p>${addr.colonia}, ${addr.street}</p>
                        <div class="actions">
                            <button onclick='window.openAddressModal(${JSON.stringify(addr).replace(/'/g, "&apos;")}, ${i})'>Editar</button>
                            <button onclick="window.deleteAddress(${i})">Borrar</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.deleteAddress = async (index) => {
    if (!confirm("¿Eliminar?")) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);
    let list = snap.data().addresses;
    list.splice(index, 1);
    await updateDoc(ref, { addresses: list });
    location.reload();
};