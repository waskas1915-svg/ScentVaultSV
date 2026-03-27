fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const container = document.getElementById('products');

    products.forEach(product => {
      const div = document.createElement('div');

      let buttonHTML = "";

      if (product.in_stock) {
        const message = `Hello! I want to buy ${product.name} for $${product.price}`;
        const whatsappLink = `https://wa.me/50376017160?text=${encodeURIComponent(message)}`;

        buttonHTML = `
          <a href="${whatsappLink}" target="_blank">
            Buy via WhatsApp
          </a>
        `;
      } else {
        buttonHTML = `
          <p style="color:red;"><strong>Out of Stock</strong></p>
        `;
      }

      div.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" width="200">
        <p>${product.size || ""}</p>
        <p>${product.description}</p>
        <p><strong>$${product.price}</strong></p>
        ${buttonHTML}
      `;

      container.appendChild(div);
    });
  });