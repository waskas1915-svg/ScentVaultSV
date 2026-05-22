// checkout.js
import { db, auth } from "./firebase.js";
import { 
    collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment, query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getCart, clearCart } from "./cart.js";
import { showSuccessScreen } from "./successpage.js";
import { showToast } from "./toast.js";

let appliedCoupon = null;

/**
 * Genera un código de orden corto y legible
 */
function generateOrderCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SV-${code}`;
}

/**
 * Actualiza el stock en mililitros de la botella principal
 */
async function deductStock(items) {
    const promises = items.map(async (item) => {
        const mlValue = parseInt(item.size);
        if (isNaN(mlValue)) return;
        const productRef = doc(db, "products", item.id);
        try {
            await updateDoc(productRef, {
                stock_ml: increment(-(mlValue * (item.quantity || 1)))
            });
        } catch (error) {
            console.error(`Error actualizando stock para ${item.id}:`, error);
        }
    });
    await Promise.all(promises);
}

/**
 * Registra la orden en Firestore y maneja inventario
 */
export async function createOrder(items, total, shippingAddress, discount = 0, couponCode = null) {
    const user = auth.currentUser;
    const orderCode = generateOrderCode();
    
    const orderData = {
        orderCode: orderCode,
        userId: user ? user.uid : "GUEST_USER",
        userEmail: user ? user.email : "guest@scentvaultsv.com",
        items: items.map(item => ({
            id: String(item.id),
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.qty || 1,
            image: item.image
        })),
        subtotal: parseFloat(total + discount), 
        discount: parseFloat(discount),
        couponUsed: couponCode,
        total: parseFloat(total),
        shippingAddress: shippingAddress,
        status: "pendiente",
        createdAt: serverTimestamp(),
        isGuest: !user 
    };

    try {
        const orderDoc = await addDoc(collection(db, "orders"), orderData);
        await deductStock(orderData.items);

        if (couponCode && appliedCoupon) {
            const couponRef = doc(db, "coupons", appliedCoupon.firebaseId);
            await updateDoc(couponRef, {
                used: true,
                orderId: orderDoc.id,
                usedAt: serverTimestamp()
            });
        }

        return orderCode;
    } catch (error) {
        console.error("Fallo al registrar pedido:", error);
        showToast("Hubo un error con la base de datos", "error");
        throw error; 
    }
}

/**
 * Prepara el mensaje y lanza la pantalla de éxito con la data completa
 */
export async function sendOrderWhatsApp({ subtotal, shipping, discount, total, name, phone, address, orderCode }) {
    const cart = getCart();
    
    // Construcción del mensaje para WhatsApp
    let message = `*SCENTVAULT SV - NUEVA ORDEN*\n`;
    message += `*REFERENCIA: ${orderCode}*\n`;
    message += `--------------------------\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Teléfono:* ${phone}\n`;
    message += `*Dirección:* ${address}\n\n`;
    message += `*PRODUCTOS:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} (${item.size}) x${item.qty || 1} - $${(item.price * (item.qty || 1)).toFixed(2)}\n`;
    });

    message += `\n--------------------------\n`;
    message += `*Subtotal:* $${subtotal.toFixed(2)}\n`;
    if (discount > 0) message += `*Descuento:* -$${discount.toFixed(2)}\n`;
    message += `*Envío:* ${shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}\n`;
    message += `*TOTAL:* $${total.toFixed(2)}\n\n`;
    message += `_Confirmo mi pedido generado en la web._`;

    const whatsappLink = `https://wa.me/50373042594?text=${encodeURIComponent(message)}`;

    // Objeto consolidado para el Recibo/PDF en success.js
    const fullOrderDetails = {
        orderCode,
        customer: { name, phone, address },
        items: cart,
        totals: { subtotal, shipping, discount, total },
        date: new Date().toLocaleDateString()
    };

    clearCart();

    // Mostramos la pantalla de éxito pasando la data y la función de redirección
    showSuccessScreen({
        orderData: fullOrderDetails,
        onContinue: () => {
            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappLink, '_blank');
        }
    });
}

/**
 * Renderiza la interfaz de Checkout
 */
export async function checkout({ closeCart, onBack }) {
    const cart = getCart();
    const user = auth.currentUser;
    appliedCoupon = null; 

    if (cart.length === 0) return;
    if (typeof closeCart === 'function') closeCart();
    window.scrollTo(0, 0);

    let savedAddresses = [];
    let savedCustomer = JSON.parse(localStorage.getItem("customer")) || {};

    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) savedAddresses = userDoc.data().addresses || [];
        } catch (err) { console.error(err); }
    }

    const container = document.getElementById("products");
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
    const shipping = subtotal >= 50 ? 0 : 3.99;
    
    const updateSummaryUI = (discountValue = 0) => {
        const finalTotal = subtotal + shipping - discountValue;
        const summaryArea = document.getElementById("summary-area");
        if (summaryArea) {
            summaryArea.innerHTML = `
                <p>Subtotal: <span>$${subtotal.toFixed(2)}</span></p>
                ${discountValue > 0 ? `<p style="color: #d9534f; font-weight: bold;">Descuento: <span>-$${discountValue.toFixed(2)}</span></p>` : ''}
                <p>Envío: <span>${shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}</span></p>
                <h3 class="total-summary-line">
                    Total: $${finalTotal.toFixed(2)}
                </h3>
            `;
        }
    };

    container.innerHTML = `
    <div class="checkout-wrapper animate-fade-in">
      <div class="checkout-left">
        <button id="backBtn" class="back-btn">← Continuar Comprando</button>
        <h2 class="playfair">Información de Envío</h2>
        <div class="checkout-form">
          ${savedAddresses.length > 0 ? `
            <div class="input-group" style="margin-bottom: 20px;">
                <label class="checkout-label">Dirección Guardada</label>
                <select id="addressSelector" class="checkout-select">
                    <option value="">-- Seleccionar dirección --</option>
                    ${savedAddresses.map((addr, index) => `<option value="${index}">${addr.colonia} (${addr.fullName})</option>`).join('')}
                </select>
            </div>
          ` : ''}
          <input id="custName" placeholder="Nombre completo" value="${savedCustomer.name || ''}" required>
          <input id="custPhone" placeholder="Teléfono" value="${savedCustomer.phone || ''}" required>
          <textarea id="custAddress" placeholder="Dirección exacta y departamento" required>${savedCustomer.address || ''}</textarea>
          
          <div class="coupon-box">
            <label class="checkout-label">¿Tienes un cupón de la Bóveda?</label>
            <div style="display: flex; gap: 10px; margin-top: 5px;">
                <input id="couponField" placeholder="SV-XXXX-XXXX" style="margin-bottom: 0;">
                <button id="applyCouponBtn" class="gold-btn">APLICAR</button>
            </div>
          </div>
        </div>
        <button id="continueBtn" class="primary-btn gold-btn checkout-btn">FINALIZAR PEDIDO</button>
      </div>
      <div class="checkout-right">
        <h3 class="playfair">Resumen de Orden</h3>
        <div class="checkout-items-list">
            ${cart.map(item => `
                <div class="checkout-item">
                    <img src="${item.image}" class="checkout-item-img">
                    <div>
                        <p><strong>${item.name}</strong></p>
                        <p style="font-size: 12px; color: #666;">${item.size} x${item.qty || 1}</p>
                        <p style="font-weight: bold;">$${(item.price * (item.qty || 1)).toFixed(2)}</p>
                    </div>
                </div>
            `).join("")}
        </div>
        <hr>
        <div id="summary-area" class="summary-totals"></div>
      </div>
    </div>
    `;

    updateSummaryUI(0);

    // Eventos
    const selector = document.getElementById("addressSelector");
    if (selector) {
        selector.onchange = (e) => {
            const index = e.target.value;
            if (index !== "") {
                const addr = savedAddresses[index];
                document.getElementById("custName").value = addr.fullName;
                document.getElementById("custPhone").value = addr.phone;
                document.getElementById("custAddress").value = `${addr.colonia}, ${addr.street}. Ref: ${addr.reference || 'N/A'}`;
            }
        };
    }

    document.getElementById('applyCouponBtn').onclick = async () => {
        const code = document.getElementById('couponField').value.trim().toUpperCase();
        if (!code) return;
        try {
            if (!user) return showToast("Debes iniciar sesión para usar cupones", "error");
            const q = query(collection(db, "coupons"), where("code", "==", code), where("userId", "==", user.uid));
            const snap = await getDocs(q);
            if (snap.empty) return showToast("Cupón no válido", "error");
            const cData = snap.docs[0].data();
            if (cData.used) return showToast("Cupón ya utilizado", "error");
            
            let discountValue = cData.type === 'fixed' ? cData.value : subtotal * cData.value;
            appliedCoupon = { firebaseId: snap.docs[0].id, code: code, amount: discountValue };
            updateSummaryUI(discountValue);
            showToast("¡Cupón aplicado!", "success");
            document.getElementById('couponField').disabled = true;
            document.getElementById('applyCouponBtn').disabled = true;
        } catch (e) { console.error(e); }
    };

    document.getElementById("backBtn").onclick = onBack;

    const continueBtn = document.getElementById("continueBtn");
    continueBtn.onclick = async () => {
        const name = document.getElementById("custName").value.trim();
        const phone = document.getElementById("custPhone").value.trim();
        const address = document.getElementById("custAddress").value.trim();

        if (!name || !phone || !address) {
            showToast("Completa los datos de envío", "error");
            return;
        }

        continueBtn.innerText = "Procesando...";
        continueBtn.disabled = true;

        try {
            const shippingInfo = { fullName: name, phone, fullAddress: address };
            const discount = appliedCoupon ? appliedCoupon.amount : 0;
            const finalTotal = subtotal + shipping - discount;
            const couponCode = appliedCoupon ? appliedCoupon.code : null;

            const orderCode = await createOrder(cart, finalTotal, shippingInfo, discount, couponCode);
            localStorage.setItem("customer", JSON.stringify({ name, phone, address }));
            
            await sendOrderWhatsApp({ 
                subtotal, shipping, discount, total: finalTotal, name, phone, address, orderCode 
            });

        } catch (err) {
            console.error(err);
            continueBtn.innerText = "FINALIZAR PEDIDO";
            continueBtn.disabled = false;
        }
    };
}

window.checkout = checkout;