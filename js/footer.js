export function initFooter() {
    
    if (document.querySelector('.main-footer')) return;

    const footer = document.createElement('footer');
    footer.className = 'main-footer';

    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-brand-text">
                <p>ScentVaultSV</p>
                <span class="brand-subtext">Boutique de Perfumería</span>
            </div>
            <p class="copyright">&copy; ${new Date().getFullYear()} - Boutique de Perfumería Exclusiva en El Salvador.</p>
            <div class="footer-legal-links">
                <a href="t&c_legal.html?page=terminos" class="footer-link">Términos y Condiciones</a>
                <span class="footer-divider">|</span>
                <a href="t&c_legal.html?page=privacidad" class="footer-link">Política de Privacidad</a>
            </div>
        </div>
    `;

    document.body.appendChild(footer);
}