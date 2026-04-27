// profile_history.js
export function renderHistory({ history }) {
    if (history.length === 0) return `<div class="empty-state">No hay pedidos registrados.</div>`;
    
    return `
        <div class="history-view animate-fade-in">
            <h2 class="playfair">Historial de Compras</h2>
            <div class="orders-table-list">
                ${history.map(order => `
                    <div class="order-row-card">
                        <div class="o-head">
                            <strong>${order.orderCode || 'ORDEN'}</strong>
                            <span>${order.createdAt?.toDate().toLocaleDateString()}</span>
                        </div>
                        <div class="o-imgs">${order.items.map(i => `<img src="${i.image}">`).join('')}</div>
                        <div class="o-footer">
                            <span class="status-badge status-${order.status}">${order.status}</span>
                            <span class="total">$${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}