// profile_overview.js
export function renderOverview({ userData, user, history }) {
    const lastOrder = history && history.length > 0 ? history[0] : null;
    const points = userData?.loyalty?.vaultPoints || 0;
    const defaultAddr = userData?.addresses && userData.addresses.length > 0 ? userData.addresses[0] : null;

    // Iconos SVG Premium con el dorado característico de ScentVault
    const icons = {
        activity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bfa36a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        rewards: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bfa36a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a4.95 4.95 0 0 0-4.95 4.95C7.05 10 9.5 14 12 14s4.95-4 4.95-7.05A4.95 4.95 0 0 0 12 2z"></path></svg>`,
        address: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bfa36a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
    };

    return `
        <div class="dashboard-view animate-fade-in">
            <h2 class="playfair dashboard-title">Mi Cuenta</h2>
            
            <div class="dashboard-card main-card">
                <div class="card-header">
                    <div class="header-flex-title">
                        ${icons.activity}
                        <h3>ÚLTIMA ACTIVIDAD</h3>
                    </div>
                </div>
                <div class="card-body">
                    ${lastOrder ? `
                        <div class="recent-order-row">
                            <img src="${lastOrder.items && lastOrder.items[0] ? lastOrder.items[0].image : './images/fahrenheit.png'}" class="dashboard-mini-img" alt="Producto pedido">
                            <div class="order-details">
                                <p><strong>${lastOrder.orderCode || 'ORDEN'}</strong></p>
                                <span class="status-badge status-${String(lastOrder.status).toLowerCase()}">${lastOrder.status}</span>
                            </div>
                            <div class="total-side">$${typeof lastOrder.total === 'number' ? lastOrder.total.toFixed(2) : lastOrder.total}</div>
                        </div>
                    ` : '<p class="empty-dashboard-text">No hay pedidos recientes.</p>'}
                </div>
            </div>

            <div class="dashboard-grid-row">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="header-flex-title">
                            ${icons.rewards}
                            <h3>RECOMPENSAS</h3>
                        </div>
                    </div>
                    <div class="card-body center-val">
                        <span class="big-val">${points}</span>
                        <small>VAULT POINTS</small>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="header-flex-title">
                            ${icons.address}
                            <h3>DIRECCIÓN</h3>
                        </div>
                    </div>
                    <div class="card-body">
                        ${defaultAddr ? `
                            <p class="addr-street"><strong>${defaultAddr.fullName || user?.displayName || 'Destinatario'}</strong></p>
                            <p class="addr-details">${defaultAddr.colonia || ''}, ${defaultAddr.municipality || ''}</p>
                            ${defaultAddr.reference ? `<p class="addr-ref">Ref: ${defaultAddr.reference}</p>` : ''}
                        ` : '<p class="empty-dashboard-text">Sin dirección predeterminada guardada.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}