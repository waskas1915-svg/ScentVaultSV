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
    <h2>${product.name}</h2>
    <div id="variantGrid" style="
      display:grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap:10px;
      margin:20px 0;
    "></div>

    <div id="purchaseBox" style="margin-top:20px;"></div>
  `;

  const grid = document.getElementById('variantGrid');
  const purchaseBox = document.getElementById('purchaseBox');

  product.variants.forEach((variant, index) => {
    const card = document.createElement('div');

    card.style = `
      border:2px solid #ccc;
      padding:10px;
      cursor:${variant.in_stock ? 'pointer' : 'not-allowed'};
      opacity:${variant.in_stock ? '1' : '0.5'};
      border-radius:8px;
    `;

    card.innerHTML = `
      <p><strong>${variant.size}</strong></p>
      <p>$${variant.price}</p>
      ${variant.in_stock ? '' : '<p style="color:red;">Out of Stock</p>'}
    `;

    card.onmouseover = () => {
      if (variant.in_stock) {
        card.style.border = "2px solid #888";
      }
    };

    card.onmouseout = () => {
      if (variant.in_stock && selectedVariant !== variant) {
        card.style.border = "2px solid #ccc";
      }
    };

    if (variant.in_stock) {
      card.onclick = () => {
        selectedVariant = variant;

        // remove previous selection
        document.querySelectorAll('#variantGrid div').forEach(el => {
          el.style.border = "2px solid #ccc";
        });

        // highlight selected
        card.style.border = "2px solid green";

        updatePurchaseBox();
      };
    }

    grid.appendChild(card);
  });

    const firstAvailable = product.variants.find(v => v.in_stock);

  if (firstAvailable) {
    selectedVariant = firstAvailable;

    // highlight the first available card
    const cards = document.querySelectorAll('#variantGrid div');
    const index = product.variants.indexOf(firstAvailable);

    if (cards[index]) {
      cards[index].style.border = "2px solid green";
    }

    updatePurchaseBox();
  }


  function updatePurchaseBox() {
    if (!selectedVariant) return;

    const message = `Hello! I want ${selectedVariant.size} of ${product.name} for $${selectedVariant.price}`;
    const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

    purchaseBox.innerHTML = `
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
    `;
  }

  // Back button
  const back = document.createElement('button');
  back.innerText = "⬅ Back";
  back.style.marginTop = "20px";
  back.onclick = showProducts;
  container.appendChild(back);
}