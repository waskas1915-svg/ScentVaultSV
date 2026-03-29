let allProducts = [];

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    showProducts();
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

    div.style = `
      border:1px solid #ddd;
      border-radius:10px;
      padding:15px;
      text-align:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.1);
      transition:0.2s;
    `;

    div.onmouseover = () => div.style.transform = "scale(1.03)";
    div.onmouseout = () => div.style.transform = "scale(1)";

    div.innerHTML = `
      <img src="${product.image}" width="150" style="border-radius:8px;">
      <h3>${product.name}</h3>
      <p style="color:${hasStock ? 'green' : 'red'};">
        ${hasStock ? 'In Stock' : 'Out of Stock'}
      </p>
      <button onclick="viewProduct(${product.id})" style="
        margin-top:10px;
        padding:8px 12px;
        border:none;
        border-radius:6px;
        background:#28a745;
        color:white;
        cursor:pointer;
      ">
        View Options
      </button>
    `;

    grid.appendChild(div); // ✅ IMPORTANT (not container!)
  });
}

document.getElementById("logo").onclick = () => {
  showProducts();
};

function viewProduct(productId) {

  const product = allProducts.find(p => p.id === productId);
  const container = document.getElementById('products');

  let selectedVariant = null;

  
  container.innerHTML = `
  <div style="
    max-width:900px;
    margin:0 auto;
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:30px;
    align-items:start;
  ">

    <!-- LEFT: IMAGE -->
    <div style="text-align:center;">
      <h2>${product.name}</h2>

      <img id="variant-image" 
        src="${product.image}" 
        onerror="this.src='./images/noimage.png'"
        style="width:100%; max-width:300px; border-radius:10px; transition:0.3s;">
    </div>

    <!-- RIGHT: VARIANTS + BUY -->
    <div>
      <div id="variantGrid" style="
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap:15px;
        margin-bottom:20px;
      "></div>

      <div id="purchaseBox"></div>

      <div id="backContainer" style="margin-top:20px;"></div>
    </div>

  </div>
  `;

  const grid = document.getElementById('variantGrid');
  const purchaseBox = document.getElementById('purchaseBox');

  function resetCards() {
  for (let el of grid.children) {
    el.style.border = "2px solid #ccc";
    el.style.background = "white";
  }
}

  product.variants.forEach((variant, index) => {
    const card = document.createElement('div');

    card.style = `
      transition: all 0.2s ease;
      border:2px solid #ccc;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      padding:10px;
      cursor:${variant.in_stock ? 'pointer' : 'not-allowed'};
      opacity:${variant.in_stock ? '1' : '0.5'};
      border-radius:8px;
    `;

      card.innerHTML = `
    <img src="${variant.image}" 
     width="80" 
     style="margin-bottom:5px;"
     onerror="this.src='./images/noimage.png'">
    <p><strong>${variant.size}</strong></p>
    <p>$${variant.price}</p>
    ${variant.in_stock ? '' : '<p style="color:red;">Out of Stock</p>'}
  `;

        card.onmouseover = () => {
      if (variant.in_stock) {
        card.style.border = "2px solid #888";
        card.style.background = "#f0fff0";
        card.style.transform = "scale(1.03)";
      }
    };

    card.onmouseout = () => {
      if (variant.in_stock && selectedVariant !== variant) {
        card.style.border = "2px solid #ccc";
        card.style.background = "white";
      }
      card.style.transform = "scale(1)";
    };

    if (variant.in_stock) {
        card.onclick = () => {
        selectedVariant = variant;

        
        document.getElementById("variant-image").src = variant.image || product.image || './images/noimage.png';

        // remove previous selection
        resetCards();

        // highlight selected
        card.style.border = "2px solid green";
        card.style.background = "#e6ffe6";

        updatePurchaseBox();
      };
    }

    grid.appendChild(card);
  });

    const firstAvailable = product.variants.find(v => v.in_stock);

  if (firstAvailable) {
    document.getElementById("variant-image").src = firstAvailable.image || product.image || './images/noimage.png';
    selectedVariant = firstAvailable;

    // highlight the first available card
    const cards = grid.children;
    resetCards();

    const index = product.variants.indexOf(firstAvailable);

    if (cards[index]) {
      cards[index].style.border = "2px solid green";
      cards[index].style.background = "#e6ffe6";
    }

    updatePurchaseBox();
  }


  function updatePurchaseBox() {
    if (!selectedVariant) return;

    const message = `Hello! I want ${selectedVariant.size} of ${product.name} for $${selectedVariant.price}`;
    const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

    purchaseBox.innerHTML = `
    <div style="text-align:center;">
        <h3>Selected: ${selectedVariant.size}</h3>
        <p><strong>Price: $${selectedVariant.price}</strong></p>
        <a href="${whatsappLink}" target="_blank">
          <button style="
            background:green;
            color:white;
            padding:12px 20px;
            font-size:16px;
            border:none;
            border-radius:6px;
            cursor:pointer;
          ">
            Buy Now
          </button>
        </a>
      </div>
    `;
  }

  // Back button
  const back = document.createElement('button');
  back.innerText = "⬅ Back";

  back.onclick = () => {
  showProducts();
  };

  back.style.padding = "10px 15px";
  back.style.borderRadius = "6px";
  back.style.border = "none";
  back.style.background = "#28a745";
  back.style.color = "white";
  back.style.cursor = "pointer";

  back.onmouseover = () => back.style.background = "#218838";
  back.onmouseout = () => back.style.background = "#28a745";
  document.getElementById("backContainer").appendChild(back);
}