// profile_settings.js
import { auth, db } from "./firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

export function renderSettings({ userData, user }) {
    const hasBirthday = userData.birthday ? 'disabled' : '';
    
    return `
        <div class="profile-settings-view animate-fade-in">
            <h2 class="playfair">Configuración de Cuenta</h2>
            <div class="form-container-box">
                <div class="form-grid">
                    <div class="input-field">
                        <label>NOMBRE</label>
                        <input type="text" id="upd-firstName" value="${userData.firstName || ''}">
                    </div>
                    <div class="input-field">
                        <label>APELLIDO</label>
                        <input type="text" id="upd-lastName" value="${userData.lastName || ''}">
                    </div>
                    <div class="input-field">
                        <label>TELÉFONO</label>
                        <input type="tel" id="upd-phone" value="${userData.phone || ''}" placeholder="7000-0000">
                    </div>
                    <div class="input-field">
                        <label>EMAIL</label>
                        <input type="email" value="${user.email}" disabled class="disabled-input">
                    </div>
                </div>
                <div class="input-field" style="margin-top:20px;">
                    <label>FECHA DE NACIMIENTO 🎂</label>
                    <input type="date" id="upd-birthday" value="${userData.birthday || ''}" ${hasBirthday}>
                    <small>${!hasBirthday ? '* Se guarda solo una vez para tu regalo anual.' : '✓ Fecha verificada.'}</small>
                </div>
                <button class="primary-btn gold-btn" onclick="window.saveProfileInfo()">GUARDAR CAMBIOS</button>
            </div>
        </div>
    `;
}

window.saveProfileInfo = async () => {
    const birthdayInput = document.getElementById('upd-birthday');
    const updateData = {
        firstName: document.getElementById('upd-firstName').value.trim(),
        lastName: document.getElementById('upd-lastName').value.trim(),
        phone: document.getElementById('upd-phone').value.trim()
    };
    if (!birthdayInput.disabled && birthdayInput.value) updateData.birthday = birthdayInput.value;

    try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), updateData);
        showToast("Perfil actualizado", "success");
        window.renderProfilePage('settings');
    } catch (e) { showToast("Error", "error"); }
};