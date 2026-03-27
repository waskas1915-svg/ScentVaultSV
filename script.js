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

  container.innerHTML = `<h2>${product.name}</h2>`;

  product.variants.forEach(variant => {
    let buttonHTML = "";

    if (variant.in_stock) {
      const message = `Hello! I want ${variant.size} of ${product.name} for $${variant.price}`;
      const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

      buttonHTML = `<a href="${whatsappLink}" target="_blank">Buy ${variant.size}</a>`;
    } else {
      buttonHTML = `<p style="color:red;">Out of Stock</p>`;
    }

    const div = document.createElement('div');

    div.innerHTML = `
      <p><strong>${variant.size}</strong> - $${variant.price}</p>
      ${buttonHTML}
    `;

    container.appendChild(div);
  });

  // Back button
  const back = document.createElement('button');
  back.innerText = "⬅ Back";
  back.onclick = showProducts;
  container.appendChild(back);
}