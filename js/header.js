// header.js
import { checkUserStatus } from "./auth_status.js";
import { openDrawer } from "./drawer.js";

export function initHeader() {
    const isLegalPage = window.location.pathname.includes('legal.html') || window.location.pathname.includes('t&c_legal.html');
    const header = document.querySelector('header');
    if (!header) return;

    header.className = 'main-navbar';

    header.innerHTML = `
        <div class="header-content">
            <div class="logo-wrapper" id="logoLink" style="cursor: pointer;">
                <img src="images/logo_rb2.png" alt="Logo" id="logo">
            </div>
            
            ${!isLegalPage ? `
                <div class="header-right">
                    <div id="auth-status">
                        <a href="#" class="nav-link" id="loginLink">
                            <span class="user-icon">👤</span> CUENTA
                        </a>
                    </div>
                    <button id="cartBtn" class="cart-button">
                        🛒 (<span id="cart-count">0</span>)
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    // 1. Delegación de eventos para CUENTA y CARRITO
    header.addEventListener('click', (e) => {
        // Detectar clic en el link de Cuenta (o sus hijos como el icono)
        const loginBtn = e.target.closest('#loginLink');
        if (loginBtn) {
            e.preventDefault();
            console.log("Abriendo Cuenta...");
            openDrawer('account');
            return;
        }

        // Detectar clic en el botón del Carrito
        const cartBtn = e.target.closest('#cartBtn');
        if (cartBtn) {
            e.preventDefault();
            console.log("Abriendo Carrito...");
            openDrawer('cart');
            return;
        }

        // Detectar clic en el Logo
        const logo = e.target.closest('#logoLink');
        if (logo) {
            window.location.href = 'index.html';
        }
    });

    if (!isLegalPage) {
        checkUserStatus();
    }
}