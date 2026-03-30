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
      const images = product.images || [];
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
        <a href="${whatsappLink}" target="_blank">
          <button class="primary-btn">
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

  back.classList.add("secondary-btn");
  document.getElementById("backContainer").appendChild(back);
}