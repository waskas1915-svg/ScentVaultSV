export function initHeader() {
    // Verificamos en qué página estamos
    const isLegalPage = window.location.pathname.includes('legal.html');

    const header = document.querySelector('header');
    if (!header) return;

    // ASIGNACIÓN DE CLASE ÚNICA: Esto evita que choque con los estilos de legal.css
    header.className = 'main-navbar';

    header.innerHTML = `
        <div class="header-content">
            <div class="logo-wrapper" id="logoLink" style="cursor: pointer;">
                <img src="images/logo_removebg.png" alt="ScentVaultSV Logo" id="logo">
            </div>
            
            ${!isLegalPage ? `
                <button id="cartBtn" class="cart-button">
                    🛒 (<span id="cart-count">0</span>)
                </button>
            ` : ''}
        </div>
    `;

    // Hacer que el logo siempre regrese al index
    document.getElementById('logoLink').onclick = () => {
        window.location.href = 'index.html';
    };
}