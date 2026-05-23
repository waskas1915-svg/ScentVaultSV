// profile_history.js
export function renderHistory({ history }) {
    if (!history || history.length === 0) {
        return `<div class="empty-state">No hay pedidos registrados en tu historial.</div>`;
    }
    
    return `
        <div class="history-view animate-fade-in">
            <h2 class="playfair dashboard-title">Historial de Compras</h2>
            <div class="orders-table-list">
                ${history.map(order => {
                    const orderDate = order.createdAt?.toDate 
                        ? order.createdAt.toDate().toLocaleDateString() 
                        : (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '---');
                    
                    const orderStatus = (order.status || 'PENDIENTE').toUpperCase();

                    return `
                        <div class="order-row-card">
                            <div class="o-head">
                                <div class="o-meta-left">
                                    <span class="o-code">${order.orderCode || 'ORDEN'}</span>
                                    <span class="o-date">${orderDate}</span>
                                </div>
                                <span class="status-badge status-${(order.status || 'pendiente').toLowerCase()}">${orderStatus}</span>
                            </div>
                            
                            <div class="o-body">
                                <div class="o-products-list">
                                    ${order.items.map(item => `
                                        <div class="o-product-item">
                                            <div class="o-thumb-wrapper">
                                                <img src="${item.image}" alt="${item.name || 'Perfume'}" class="o-product-thumb">
                                            </div>
                                            <div class="o-product-details">
                                                <p class="o-product-name">${item.name || 'Fragancia Premium'}</p>
                                                <p class="o-product-qty">Cant: ${item.quantity || 1}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="o-footer">
                                <span class="o-total-label">Total del Pedido</span>
                                <span class="total">$${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}