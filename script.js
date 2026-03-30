let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    showProducts();
    updateCartUI();
  });

function showProducts() {
  const container = document.getElementById('products');

  // Create grid container
  container.innerHTML = `<div id="productGrid"></div>`;

  const grid = document.getElementById('productGrid');

  allProducts.forEach(product => {
    const div = document.createElement('div');
    div.classList.add("product-card");

    const hasStock = product.variants.some(v => v.in_stock);
        div.innerHTML = `
        <img src="${product.image}" class="product-img">
        <h3>${product.name}</h3>

        <div class="card-bottom">
          <p class="${hasStock ? 'in-stock' : 'out-of-stock'}">
            ${hasStock ? 'In Stock' : 'Out of Stock'}
          </p>
          <button class="primary-btn">View Options</button>
        </div>
      `;
        const btn = div.querySelector('button');
        btn.onclick = () => viewProduct(product.id);

    grid.appendChild(div); // ✅ IMPORTANT (not container!)
  });
}

document.getElementById("logo").onclick = () => {
  showProducts();
};

function setMainImage(src) {
  document.getElementById("variant-image").src =
    src || './images/noimage.png';
}

function viewProduct(productId) {

  const product = allProducts.find(p => p.id === productId);
    if (!product) return;
  const container = document.getElementById('products');
  let selectedVariant = null;

container.innerHTML = `
  <h2>${product.name}</h2>

    <div class="product-view">

    <!-- LEFT -->
    <div>
      <img id="variant-image" 
        src="${product.images?.[0] || product.image}"
        onerror="this.src='./images/noimage.png'">

      <div id="thumbnailRow" class="thumbnail-row"></div>
    </div>

    <!-- RIGHT -->
    <div class="product-info">
      <div id="variantGrid"></div>
      <div id="purchaseBox"></div>
      <div id="backContainer"></div>
    </div>

  </div>
`;

  const grid = document.getElementById('variantGrid');
  const purchaseBox = document.getElementById('purchaseBox');
  const thumbnailRow = document.getElementById('thumbnailRow');
  const thumbnails = thumbnailRow.children;
  const sizeOptions = grid.children;
  function clearSelection() {
    Array.from(sizeOptions).forEach(el => {
      el.classList.remove('selected');
        });
      }
  function updateActiveThumbnail(image) {
      Array.from(thumbnails).forEach(t => {
        t.classList.toggle('active', t.getAttribute('src') === image)
      });
    }
// create thumbnails
      const images = product.images?.length ? product.images : [product.image];
       images.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.src = img;
      thumb.classList.add('thumbnail');
      thumb.onclick = () => {
        setMainImage(img);
        updateActiveThumbnail(img);
      };
      thumbnailRow.appendChild(thumb);
      if (i === 0) thumb.classList.add('active');
    });

    
    //variants

    product.variants.forEach((variant, index) => {
      const card = document.createElement('div');
      card.classList.add('size-option');

      if (!variant.in_stock) {
        card.classList.add('out');
      }

        card.innerHTML = `
    <img src="${variant.image}" width="80"
      onerror="this.src='./images/noimage.png'">
    <p><strong>${variant.size}</strong></p>
    <p class="price">$${variant.price}</p>
    ${variant.in_stock ? '' : '<p class="out-of-stock">Out of Stock</p>'}
  `;
  
        // click logic
      card.onclick = () => {
        if (!variant.in_stock) return;
        clearSelection();
        updateActiveThumbnail(variant.image || product.image || './images/noimage.png');
        selectedVariant = variant;
        setMainImage(variant.image || product.image);
        card.classList.add('selected');

        updatePurchaseBox();
      };
      grid.appendChild(card);
           
  });

    const firstAvailable = product.variants.find(v => v.in_stock);

  if (firstAvailable) {
    selectedVariant = firstAvailable;

  const defaultImage = product.images?.[0] || product.image;
  setMainImage(defaultImage);
  updateActiveThumbnail(defaultImage);

    // highlight the first available card
    const index = product.variants.indexOf(firstAvailable);
    const cards = grid.children;
    if (cards[index]) {
      cards[index].classList.add('selected');
    }
    updatePurchaseBox();
  }


  function updatePurchaseBox() {
    if (!selectedVariant) return;

    const message = `Hello! I want ${selectedVariant.size} of ${product.name} for $${selectedVariant.price}`;
    const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

    purchaseBox.innerHTML = `
      <div class="purchase-box">
        <h3>Selected: ${selectedVariant.size}</h3>
        <p><strong>Price: $${selectedVariant.price}</strong></p>

        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">

          <button class="primary-btn" onclick="addToCart('${product.name}', '${selectedVariant.size}', ${selectedVariant.price})">
            Add to Cart
          </button>

          <a href="${whatsappLink}" target="_blank">
            <button class="primary-btn">
              Buy Now
            </button>
          </a>

        </div>
      </div>
    `;
  }

    // Back button
  const back = document.createElement('button');
  back.innerText = "⬅ Back";

  back.onclick = () => {
  showProducts();
  };

  back.classList.add("secondary-btn");
  document.getElementById("backContainer").appendChild(back);

}
// cart preview logic

function toggleCartPreview() {
  const preview = document.getElementById("cartPreview");
  if (!preview) return;

  preview.classList.toggle("show");

  if (!preview.classList.contains("show")) return;

  // Populate cart content
  if (cart.length === 0) {
    preview.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  let total = 0;
  let html = "<h4>Cart</h4>";

  cart.forEach((item, index) => {
    total += item.price;
    html += `
      <p>
        ${item.name} (${item.size}) - $${item.price}
        <button onclick="removeFromCart(${index})">❌</button>
      </p>
    `;
  });

  html += `<p><strong>Total: $${total}</strong></p>`;
  html += `<button onclick="buyCart()" class="primary-btn">Checkout</button>`;

  preview.innerHTML = html;
}

document.addEventListener("click", (e) => {
  const preview = document.getElementById("cartPreview");
  const btn = document.getElementById("cartBtn");
  if (!preview || !btn) return;

  if (!preview.contains(e.target) && !btn.contains(e.target)) {
    preview.classList.remove("show");
  }
});

//update cart

function updateCartUI() {
  const btn = document.getElementById("cartBtn");
  btn.innerText = `🛒 (${cart.length})`;
}


// cart function

  function addToCart(name, size, price) {
  cart.push({ name, size, price });
  localStorage.setItem("cart", JSON.stringify(cart));

  console.log("Cart:", cart);
  updateCartUI();

  console.log(`${name} (${size}) added to cart`);
  toggleCartPreview()
}

// Remove Items from the cart

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI();
  toggleCartPreview(); // refresh view
}

// Buy cart logic

function buyCart() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  if (!confirm("¿Deseas enviar este pedido por WhatsApp?")) return;

  let message = "Hola, me gustaría ordenar:\n\n";
  let total = 0;

  cart.forEach(item => {
    message += `• ${item.name} - ${item.size} ($${item.price})\n`;
    total += item.price;
  });

  message += `\nTotal: $${total}`;

  const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

  cart = [];
  localStorage.removeItem("cart");
  updateCartUI();
  window.open(whatsappLink, "_blank");
}

window.onload = () => {
  document.getElementById("cartBtn").onclick = toggleCartPreview;

  const preview = document.getElementById("cartPreview");

  if (preview) {
    preview.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
};