// profile_overview.js 

export function renderOverview({ userData, user, history }) {
    const lastOrder = history[0];
    const points = userData.loyalty?.vaultPoints || 0;
    const defaultAddr = userData.addresses?.[0];

    return `
        <div class="dashboard-view animate-fade-in">
            <h2 class="playfair dashboard-title">Mi Cuenta</h2>
            
            <div class="dashboard-card main-card">
                <div class="card-header"><h3>📜 ÚLTIMA ACTIVIDAD</h3></div>
                <div class="card-body">
                    ${lastOrder ? `
                        <div class="recent-order-row">
                            <img src="${lastOrder.items[0].image}" class="dashboard-mini-img">
                            <div class="order-details">
                                <p><strong>${lastOrder.orderCode || 'ORDEN'}</strong></p>
                                <span class="status-badge status-${lastOrder.status}">${lastOrder.status}</span>
                            </div>
                            <div class="total-side">$${lastOrder.total.toFixed(2)}</div>
                        </div>
                    ` : '<p>No hay pedidos recientes.</p>'}
                </div>
            </div>

            <div class="dashboard-grid-row">
                <div class="dashboard-card">
                    <div class="card-header"><h3>💎 RECOMPENSAS</h3></div>
                    <div class="card-body center-val">
                        <span class="big-val">${points}</span>
                        <small>VAULT POINTS</small>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><h3>🏠 DIRECCIÓN</h3></div>
                    <div class="card-body">
                        ${defaultAddr ? `<p>${defaultAddr.colonia}, ${defaultAddr.municipality}</p>` : '<p>Sin dirección guardada.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}