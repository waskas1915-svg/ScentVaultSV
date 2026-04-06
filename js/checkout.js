// checkout page

import { getCart, clearCart } from "./js/cart.js";
import { showSuccessScreen } from "./js/successpage.js";
import { showToast } from "./js/toast.js";

export function checkout({ closeCart, onSendOrder, onBack }) {
  const cart = getCart();

  closeCart();
  window.scrollTo(0, 0);

  if (cart.length === 0) {
    showToast("Cart is empty", "error");
    return;
  }

    const saved = JSON.parse(localStorage.getItem("customer")) || {};
    const container = document.getElementById("products");

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
    );

  const shipping = subtotal >= 50 ? 0 : 3.99;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="checkout-wrapper">

      <div class="checkout-left">
        <button id="backBtn" class="back-btn">← Continue Shopping</button>

        <h2>Shipping Address</h2>

        <div class="checkout-form">
          <input id="custName" placeholder="Full Name" value="${saved.name || ''}" required>
          <input id="custPhone" placeholder="Phone Number" value="${saved.phone || ''}" required>
          <textarea id="custAddress" placeholder="Delivery Address" required>${saved.address || ''}</textarea>
        </div>

        <button id="continueBtn" class="primary-btn checkout-btn">
          Continue
        </button>
      </div>

      <div class="checkout-right">
        <h3>Order Summary</h3>

        ${cart.map(item => {
          const qty = item.qty || 1;
          return `
            <div class="checkout-item">
              <img src="${item.image}" class="checkout-item-img"
              onerror="this.src='./images/noimage.png'">
              <div>
                <p><strong>${item.name}</strong></p>
                <p>${item.size}</p>
                <p>$${item.price} × ${qty}</p>
              </div>
            </div>
          `;
        }).join("")}

        <hr>

        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</p>
        <h3>Total: $${total.toFixed(2)}</h3>
      </div>
    </div>
  `;

  // ✅ Events (NO inline onclick)

    const backBtn = document.getElementById("backBtn");
    if (backBtn) backBtn.onclick = onBack;

    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) continueBtn.onclick = async () => {
        const btn = continueBtn;

        btn.classList.add("loading");
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            await onSendOrder({ subtotal, shipping, total });
        } catch (err) {
            btn.classList.remove("loading");
            btn.innerText = "Continue";
            btn.disabled = false;
        }
    };
}

// send to whatsapp
    let isSending = false;
export async function sendOrderWhatsApp({ subtotal, shipping, total }) {
        if (isSending) return;
        isSending = true;
    const cart = getCart();
    const nameInput = document.getElementById("custName");
    const phoneInput = document.getElementById("custPhone");
    const addressInput = document.getElementById("custAddress");
        if (!nameInput || !phoneInput || !addressInput) {
            console.error("Missing form inputs");
            showToast("Something went wrong. Please try again.", "error")
            isSending = false;
            return;
        }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    try {
            if (!name || !phone || !address) {
                showToast("Please fill all fields", "error");
                isSending = false;
                return;
            }

        localStorage.setItem("customer", JSON.stringify({ name, phone, address }));

        let message = "Hola, me gustaría ordenar:\n\n";

        cart.forEach(item => {
            const qty = item.qty || 1;
            message += `• ${item.name} - ${item.size} x${qty} ($${(item.price * qty).toFixed(2)})\n`;
        });

        message += `\nSubtotal: $${subtotal.toFixed(2)}`;
        message += `\nEnvío: ${shipping === 0 ? "GRATIS" : `$${shipping.toFixed(2)}`}`;
        message += `\nTotal: $${total.toFixed(2)}`;
        message += "\n\nGracias!";

        const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

        // ✅ clear cart
        clearCart();
        showToast("Order sent successfully! 🎉", "success");
        // show success screen
        showSuccessScreen({
        onContinue: () => {
            window.location.href = whatsappLink;
        }
        });

    } catch (err) {
        console.error(err);
        showToast("Something went wrong. Please try again.", "error")
    } finally {
        isSending = false;
    }
}

