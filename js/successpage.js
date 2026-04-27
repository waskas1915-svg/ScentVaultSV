export function showSuccessScreen({ orderData, onContinue }) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = `
    <div class="success-screen animate-fade-in">
      <div class="success-card no-print">
        <div class="success-icon">🎉</div>
        <h2>¡Orden Enviada con Éxito!</h2>
        <p>Tu código de referencia es: <strong>${orderData.orderCode}</strong></p>
        
        <div class="action-buttons">
            <button id="whatsappBtn" class="primary-btn whatsapp-btn">
               Confirmar en WhatsApp
            </button>
            <button id="printBtn" class="secondary-btn">
               Descargar Recibo (PDF)
            </button>
        </div>
        
        <p class="footer-note">Puedes cerrar esta ventana después de confirmar tu pedido.</p>
      </div>

      <div id="receipt-view" class="receipt-container">
        <div class="receipt-header">
          <h1>SCENTVAULT SV</h1>
          <p>Comprobante de Orden Simple</p>
          <p>San Salvador, El Salvador</p>
        </div>
        
        <div class="receipt-info">
          <p><strong>Referencia:</strong> ${orderData.orderCode}</p>
          <p><strong>Fecha:</strong> ${orderData.date}</p>
          <p><strong>Cliente:</strong> ${orderData.customer.name}</p>
          <p><strong>Tel:</strong> ${orderData.customer.phone}</p>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>Cant.</th>
              <th>Producto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(item => `
              <tr>
                <td>${item.qty || 1}x</td>
                <td>${item.name} (${item.size})</td>
                <td>$${(item.price * (item.qty || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="receipt-totals">
          <p>Subtotal: $${orderData.totals.subtotal.toFixed(2)}</p>
          ${orderData.totals.discount > 0 ? `<p>Descuento: -$${orderData.totals.discount.toFixed(2)}</p>` : ''}
          <p>Envío: $${orderData.totals.shipping.toFixed(2)}</p>
          <h2 class="total-line">TOTAL: $${orderData.totals.total.toFixed(2)}</h2>
        </div>
        
        <div class="receipt-footer">
          <p>Gracias por confiar en la Bóveda de Fragancias.</p>
          <p>Este es un recibo administrativo no contable.</p>
        </div>
      </div>
    </div>

    <style>
      .success-screen { display: flex; flex-direction: column; align-items: center; padding: 20px; }
      .success-card { background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 400px; }
      .action-buttons { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
      .whatsapp-btn { background: #25D366 !important; border: none; color: white; }
      
      /* Estilos del Recibo */
      .receipt-container { 
        background: white; width: 100%; max-width: 500px; padding: 40px; 
        margin-top: 20px; border: 1px solid #eee; font-family: 'Courier New', Courier, monospace;
        color: #333;
      }
      .receipt-header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; }
      .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      .receipt-table th { text-align: left; border-bottom: 1px solid #ddd; }
      .receipt-totals { text-align: right; border-top: 2px solid #333; padding-top: 10px; }
      .total-line { font-size: 24px; margin-top: 10px; }

      /* LOGICA DE IMPRESIÓN */
      @media screen {
        .receipt-container { display: none; } /* Oculto en web normal */
      }

      @media print {
        .no-print { display: none !important; }
        .receipt-container { display: block !important; border: none; }
        body { background: white; }
      }
    </style>
  `;

  // Lógica de botones
  document.getElementById("whatsappBtn").onclick = onContinue;
  
  document.getElementById("printBtn").onclick = () => {
    window.print(); // Esto abrirá el diálogo de PDF nativo del navegador/móvil
  };

  // Auto-confirmación (opcional): Abrir WhatsApp automáticamente después de 3 seg
  setTimeout(() => {
     onContinue();
  }, 3000);
}