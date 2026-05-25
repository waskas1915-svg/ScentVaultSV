// js/landingPage.js
export function renderLandingPage(onCatalogClick) {
    const container = document.getElementById('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    container.innerHTML = `
        <header class="hero-section">
            <video autoplay muted loop playsinline class="hero-video">
                <source src="media/hero4.mp4" type="video/mp4">
            </video>
            <div class="hero-overlay"></div>

            <div class="hero-content">
                <span class="tagline animate-fade-entry">El Arte del Perfume, a tu Medida</span>
                <h1 class="animate-fade-entry">No Compres a Ciegas.<br>Colecciona <span class="gold-text">Experiencias</span>.</h1>
                <p class="animate-fade-entry">Descubre por qué los decants son la forma más inteligente de usar alta perfumería de diseñador y marcas orientales en El Salvador.</p>
                <button id="btn-discover" class="btn-primary animate-fade-entry">Descubrir Ventajas</button>
            </div>
        </header>

        <section id="proposito" class="features-section animate-fade-in">
            <div class="features-divider-line"></div>
            <h2 class="playfair section-title">¿Por Qué Elegir un Decant?</h2>
            <div class="features-divider-line"></div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="feature-icon">
                            <path d="M19 5L5 19M19 5c.7-.7.7-1.9 0-2.6s-1.9-.7-2.6 0L19 5zm-3.5.9l1.6 1.6M10 9.5l4 4M7.5 14l1.5 1.5"/>
                            <path d="M4.3 16.3c-.4.4-.4 1 0 1.4l2 2c.4.4 1 .4 1.4 0l1.4-1.4-4.8-4.8-1.4 1.4z"/>
                        </svg>
                    </div>
                    <h3>Lujo Inteligente</h3>
                    <p>Usa fragancias de diseñador y nicho sin pagar el precio de una botella completa.</p>
                </div>

                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="feature-icon">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="M9 11l2 2 4-4"/>
                        </svg>
                    </div>
                    <h3>Cero Compras a Ciegas</h3>
                    <p>Pruébalo en tu propia piel. Evalúa su duración y evolución antes de comprometerte.</p>
                </div>

                <div class="feature-card">
                    <div class="icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="feature-icon">
                            <path d="M12 22a5 5 0 005-5V9a5 5 0 00-10 0v8a5 5 0 005 5zM12 4V2M9 4h6"/>
                            <path d="M12 9v4M10 11h4"/>
                        </svg>
                    </div>
                    <h3>Variedad Portátil</h3>
                    <p>Lleva tu perfume favorito al gimnasio, la oficina o de viaje de forma cómoda y ligera.</p>
                </div>
            </div>
        </section>

        <section class="cta-closure-section">
            <div class="cta-closure-overlay"></div>
            
            <div class="cta-closure-content">
                <span class="cta-tagline">Calidad Garantizada</span>
                <h2 class="playfair">De Nuestra Bóveda a tus Manos</h2>
                <p class="cta-description">
                    Cada decant es extraído directamente de la botella original utilizando herramientas esterilizadas de alta precisión bajo un entorno controlado. Recibes una fragancia 100% auténtica, pura y lista para usar.
                </p>
                
                <button id="btn-explore-final" class="primary-btn gold-btn large-btn final-cta-btn">
                    Explorar Catálogo Completamente
                </button>
            </div>
        </section>
    `;

    // Internal navigation within the landing page
    document.getElementById('btn-discover').addEventListener('click', () => {
        document.getElementById('proposito').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // FIXED: Cambiado 'btn-go-catalog' por el ID real 'btn-explore-final'
    document.getElementById('btn-explore-final').addEventListener('click', onCatalogClick);

    // Initialize your Scroll Animations here
    initScrollAnimations();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));
}