let allProducts = [];

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    showProducts();
  });

function showProducts() {
  const container = document.getElementById('products');
  container.innerHTML = "";
  
  allProducts.forEach(product => {
    const div = document.createElement('div');

    const hasStock = product.variants.some(variant => variant.in_stock);

    div.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image}" width="200">
      <p>${product.description}</p>
      <p style="color:${hasStock ? 'green' : 'red'};">
        ${hasStock ? 'In Stock' : 'Out of Stock'}
      </p>
      <button onclick="viewProduct(${product.id})">
        View Options
      </button>
    `;

    container.appendChild(div);
  });
}

function viewProduct(productId) {

  const product = allProducts.find(p => p.id === productId);
  const container = document.getElementById('products');

  let selectedVariant = null;

  container.innerHTML = `
  <div style="max-width:600px; margin:0 auto; text-align:center;">
    <h2>${product.name}</h2>

    <img id="variant-image" 
      src="${product.image}" 
      onerror="this.src='./images/noimage.png'"
      style="width:220px; border-radius:10px; margin-bottom:15px;">

    <div id="variantGrid" style="
      display:grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 150px));
      justify-content:center;
      gap:15px;
      margin:20px 0;
    "></div>

    <div id="purchaseBox" style="margin-top:20px;"></div>
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

        
        document.getElementById("variant-image").src = variant.image || product.image;

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
    document.getElementById("variant-image").src = firstAvailable.image || product.image;
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
    container.innerHTML = ""; // clear current view
    showProducts();
    };

  back.style.marginTop = "20px";
  back.style.padding = "10px 15px";
  back.style.borderRadius = "6px";
  back.style.border = "none";
  back.style.background = "#28a745";
  back.style.color = "white";
  back.style.cursor = "pointer";
  back.style.fontSize = "14px";
  back.onmouseover = () => back.style.background = "#218838";
  back.onmouseout = () => back.style.background = "#28a745";
  const backWrapper = document.createElement('div');
  backWrapper.style.textAlign = "center";
  backWrapper.style.marginTop = "20px";

  backWrapper.appendChild(back);
  container.appendChild(backWrapper);
}