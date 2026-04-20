import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    createUserWithEmailAndPassword, 
    updateProfile,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { showToast } from "./toast.js";
import { 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
import { switchTab, openDrawer } from "./drawer.js";

export function checkUserStatus() {
    const authStatus = document.getElementById('auth-status');
    if (!authStatus) return;

    // 1. DELEGACIÓN DE EVENTOS: Escuchamos el clic en el contenedor padre
    // Esto funciona aunque el contenido interno cambie mil veces
    authStatus.onclick = (e) => {
        // Buscamos si lo que se clickeó es el link de cuenta o algo dentro de él
        const trigger = e.target.closest('#accountTrigger');
        if (trigger) {
            e.preventDefault();
            console.log("Abriendo panel de cuenta...");
            
            // Llamamos a la función para abrir el drawer
            // Asegúrate de que esta función sea accesible aquí
            if (typeof openDrawer === 'function') {
                openDrawer('account');
            } else {
                // Si usas switchTab, asegúrate de abrir también el contenedor visual
                switchTab('account');
                document.getElementById('notification-drawer')?.classList.add('open');
            }
        }
    };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.data();
                const name = userData?.firstName || user.displayName?.split(' ')[0] || "Usuario";

                authStatus.innerHTML = `
                    <a href="#" class="nav-link" id="accountTrigger">
                        <span class="user-icon">👤</span> HOLA, ${name.toUpperCase()}
                    </a>
                `;
            } catch (error) {
                console.error("Error al actualizar header:", error);
            }
        } else {
            authStatus.innerHTML = `
                <a href="#" class="nav-link" id="accountTrigger">
                    <span class="user-icon">👤</span> CUENTA
                </a>
            `;
        }
    });
}

export function renderAccountView() {
    const user = auth.currentUser;

    if (user) {
        // Si hay usuario, mostramos la estructura tipo "JomaShop"
        renderProfileView(user);
    } else {
        // Si no hay nadie, mostramos tu estructura original de login
        renderLoginView();
    }
}

export function renderLoginView() {
    const container = document.getElementById('drawerContent');
    if (!container) return;

    container.innerHTML = `
        <div class="auth-drawer-container">
            <div class="auth-header-section">
                <h2>Iniciar sesión / Crear cuenta</h2>
                <p>Ingresa tu correo electrónico para iniciar sesión o crear una cuenta</p>
            </div>

            <div class="auth-form-group">
                <input type="email" id="auth-email-input" placeholder="Email" class="scent-input">
                <button id="btn-continue" class="primary-btn gold-btn full-width">CONTINUAR</button>
            </div>

            <div class="scent-divider"><span>O</span></div>

            <div class="auth-social-group">
                <button class="social-btn outline" id="btn-google">
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style="width:18px;">
                    Continuar con Google
                </button>
                <button class="social-btn outline">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style="width: 16px;">
                    Continuar con Apple
                </button>
            </div>

            <p class="auth-legal-text">
                Al seleccionar 'Continuar', aceptas nuestra 
                <a href="legal.html">Política de Privacidad</a> y 
                <a href="t&c_legal.html">Términos y Condiciones</a>.
            </p>

            <div class="auth-drawer-footer">
                <div class="footer-item">
                    <span class="footer-icon">📦</span> Rastrear pedido <span class="footer-arrow">›</span>
                </div>
                <div class="footer-item">
                    <span class="footer-icon">💬</span> Centro de ayuda <span class="footer-arrow">›</span>
                </div>
                <div class="footer-alert-box">
                    <span class="footer-icon">✉️</span> Todo al día! &nbsp;<strong>0 mensajes nuevos</strong> <span class="footer-arrow">›</span>
                </div>
            </div>
        </div>
    `;

    // --- LÓGICA DE CONTINUAR ---
    const btnContinue = document.getElementById('btn-continue');
    const emailInput = document.getElementById('auth-email-input');

    btnContinue.onclick = async () => {
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            alert("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        // Cambiamos el texto del botón para dar feedback de carga
        btnContinue.innerText = "VERIFICANDO...";
        btnContinue.disabled = true;

        try {
            // Verificamos si el email ya tiene una cuenta en Firebase
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.length > 0) {
                // EL USUARIO YA EXISTE -> Mostrar pantalla de Password (Welcome Back)
                renderWelcomeBack(email);
            } else {
                // ES UN USUARIO NUEVO -> Mostrar formulario de Registro
                renderRegisterForm(email);
            }
        } catch (error) {
            console.error("Error al verificar email:", error);
            btnContinue.innerText = "CONTINUAR";
            btnContinue.disabled = false;
        }
    };
    const googleBtn = document.getElementById('btn-google');
    if (googleBtn) {
        googleBtn.onclick = loginWithGoogle;
    }
}

export function renderWelcomeBack(email) {
    const container = document.getElementById('drawerContent');
    container.innerHTML = `
        <div class="auth-drawer-container animate-fade-in">
            <div class="auth-header-section">
                <h2>¡Qué bueno verte!</h2>
                <p>Ingresa tu contraseña para entrar a tu cuenta de <strong>${email}</strong></p>
            </div>

            <div class="auth-form-group">
                <input type="password" id="login-password" placeholder="Contraseña" class="scent-input">
                <button id="btn-login-final" class="primary-btn gold-btn full-width">INICIAR SESIÓN</button>
            </div>

            <div style="text-align: center; margin-top: 15px;">
                <a href="#" class="forgot-pass" id="reset-pass">¿Olvidaste tu contraseña?</a>
            </div>
            
            <button class="back-btn-text" id="go-back">
                ← Usar otro correo
            </button>
        </div>
    `;

    // Botón Volver
    document.getElementById('go-back').onclick = renderAccountView;

    // Lógica de Login Final
    document.getElementById('btn-login-final').onclick = async () => {
        const password = document.getElementById('login-password').value;
        // Aquí llamarás a signInWithEmailAndPassword(auth, email, password)
    };
}

export function renderRegisterForm(email) {
    const container = document.getElementById('drawerContent');
    if (!container) return;

    // 1. Inyectamos el HTML (con los campos de password actualizados y el botón de "ojo")
    container.innerHTML = `
        <div class="auth-drawer-container animate-fade-in">
            <div class="auth-header-section">
                <h2>¡Bienvenido!</h2>
                <p>Ingresa tu información para crear tu cuenta</p>
            </div>

            <div class="auth-form-group">
                <input type="email" value="${email}" class="scent-input disabled-input" readonly>

                <div class="scent-input-row">
                    <input type="text" id="reg-name" placeholder="Nombre" class="scent-input">
                    <input type="text" id="reg-lastname" placeholder="Apellido" class="scent-input">
                </div>

                <div class="password-wrapper">
                    <input type="password" id="reg-password" placeholder="Contraseña" class="scent-input">
                    <button type="button" class="toggle-password" data-target="reg-password">👁️</button>
                </div>

                <div class="password-wrapper">
                    <input type="password" id="reg-confirm" placeholder="Confirmar contraseña" class="scent-input">
                    <button type="button" class="toggle-password" data-target="reg-confirm">👁️</button>
                </div>

                <p class="auth-legal-text small">
                    Al crear una cuenta, aceptas nuestra <a href="legal.html">Política de Privacidad</a>.
                </p>

                <button id="btn-create-account" class="primary-btn gold-btn full-width">CREAR CUENTA</button>
            </div>
            <div class="auth-footer-login">
                <p>¿Ya tienes una cuenta? <a href="#" id="link-to-login">Iniciar sesión</a></p>
            </div>
        </div>
    `;

    // 2. Lógica para los "Ojos" (Mostrar/Ocultar contraseña)
    // Esto se pone aquí para que se active justo después de crear el HTML
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.onclick = () => {
            const inputId = button.getAttribute('data-target');
            const input = document.getElementById(inputId);
            input.type = input.type === "password" ? "text" : "password";
            button.textContent = input.type === "password" ? "👁️" : "🔒";
        };
    });

    // 3. Lógica del botón CREAR CUENTA
    document.getElementById('btn-create-account').onclick = async () => {
        const name = document.getElementById('reg-name').value.trim();
        const lastname = document.getElementById('reg-lastname').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        // Requisitos: Mayúscula, Número, Símbolo, Min 7
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;

        if (!name || !lastname || !password) {
            showToast("Completa todos los campos", "error");
            return;
        }

        if (password !== confirm) {
            showToast("Las contraseñas no coinciden", "error");
            return;
        }

        if (!passwordRegex.test(password)) {
            showToast("Contraseña débil: requiere Mayúscula, Número y Símbolo (Min. 7)", "error");
            return;
        }

        const btn = document.getElementById('btn-create-account');
        btn.innerText = "VERIFICANDO...";
        btn.disabled = true;

        try {
            // A. Crear usuario
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // B. ENVIAR CORREO DE VERIFICACIÓN (La parte nueva)
            await sendEmailVerification(user);

            // C. Actualizar perfil
            await updateProfile(user, { displayName: `${name} ${lastname}` });

            // D. Guardar en Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: name,
                lastName: lastname,
                email: email,
                createdAt: new Date().toISOString(),
                wishlist: []
            });

            showToast("✨ ¡Cuenta creada! Revisa tu email para verificarla.", "success");
            
            // Recargamos para que el sistema reconozca el estado (o podrías hacer logout para forzar la verificación)
            setTimeout(() => location.reload(), 2000);

        } catch (error) {
            console.error(error);
            btn.innerText = "CREAR CUENTA";
            btn.disabled = false;
            showToast("Error al crear la cuenta", "error");
        }
    };

    // Link para volver al login
    document.getElementById('link-to-login').onclick = (e) => {
        e.preventDefault();
        renderAccountView();
    };
}

async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Verificamos si es un usuario nuevo para crearlo en Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // Si es nuevo, guardamos sus datos básicos
            await setDoc(userRef, {
                firstName: user.displayName.split(' ')[0] || "Usuario",
                lastName: user.displayName.split(' ')[1] || "",
                email: user.email,
                createdAt: new Date().toISOString(),
                wishlist: []
            });
        }

        showToast(`¡Bienvenido, ${user.displayName}! ✨`, "success");
        
        // Recargamos para actualizar el header
        setTimeout(() => location.reload(), 1500);

    } catch (error) {
        console.error("Error Google Login:", error);
        if (error.code !== 'auth/cancelled-popup-request') {
            showToast("Error al conectar con Google", "error");
        }
    }
}

async function renderProfileView(user) {
    const container = document.getElementById('drawerContent');
    
    // Obtenemos datos de Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    const firstName = userData?.firstName || user.displayName?.split(' ')[0] || "Usuario";

    container.innerHTML = `
        <div class="profile-drawer-wrapper animate-fade-in">
            
            <div class="profile-section-header">
                <h2>¡Bienvenido, ${firstName}!</h2>
                <div class="vault-cash-badge">
                    YOU HAVE <span class="gold-text">$0.00 VAULT CASH</span>
                </div>
            </div>

            <hr class="profile-divider">

            <div class="profile-menu-list">
                <div class="menu-item-row">
                    <div class="item-label">VISTA GENERAL</div>
                    <span class="plus-symbol">→</span>
                </div>

                <div class="menu-item-row">
                    <div class="item-label">HISTORIAL DE COMPRAS</div>
                    <span class="plus-symbol">→</span>
                </div>

                <div class="menu-item-row">
                    <div class="item-label">PREMIOS Y LEALTAD</div>
                    <span class="plus-symbol">+</span>
                </div>

                <div class="menu-item-row">
                    <div class="item-label">CONFIGURACIÓN</div>
                    <span class="plus-symbol">+</span>
                </div>
            </div>

            <div class="profile-footer-action">
                <button id="btn-logout" class="primary-btn gold-btn full-width">CERRAR SESIÓN</button>
            </div>

        </div>
    `;

    document.getElementById('btn-logout').onclick = async () => {
        await signOut(auth);
        location.reload(); 
    };
}