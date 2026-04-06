export function showSuccessScreen({ onContinue }) {
  const container = document.getElementById("products");
    if (!container) return;

  let hasRedirected = false;

  function handleContinue() {
    if (hasRedirected) return;
    hasRedirected = true;
    onContinue();
  }

  container.innerHTML = `
    <div class="success-screen">
      <div class="success-card">
        <h2>🎉 Order Sent Successfully!</h2>
        <p>Your order has been prepared.</p>
        <p>You will be redirected to WhatsApp to confirm.</p>

        <button id="continueShoppingBtn" class="primary-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  `;

  // Manual click
  const btn = document.getElementById("continueShoppingBtn");
  if (btn) btn.onclick = handleContinue;

  // Auto redirect after 2 seconds
  setTimeout(() => {
    handleContinue();
  }, 2000);
}