// UI.js

    import { showToast } from "./toast.js";

    //Show products
    export function showProducts(products, addToCart) {
        const container = document.getElementById('products');

        // Create grid container
        container.innerHTML = `<div id="productGrid"></div>`;

        const grid = document.getElementById('productGrid');

        products.forEach(product => {
            const div = document.createElement('div');
            div.classList.add("product-card");

            const hasStock = product.stock_ml > 0;
            div.innerHTML = `
                <img src="${product.image}" class="product-img">
                <h3>${product.name}</h3>

                <div class="card-bottom">
                    <p class="${hasStock ? 'in-stock' : 'out-of-stock'}">
                        ${hasStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <button class="primary-btn" ${!hasStock ? "disabled" : ""}>
                        View Options
                    </button>
                </div>
            `;
                const btn = div.querySelector('button');
                if (hasStock) {
                    btn.onclick = () => viewProduct(product.id, products, addToCart);
                }

            grid.appendChild(div); 
        });
    }

    //View products

    export function viewProduct(productId, products, addToCart) {
            const product = products.find(p => p.id === productId);
                if (!product) return;
            const container = document.getElementById('products');
            let selectedVariant = null;

            container.innerHTML = `
                <div class="product-title">
                    <h2>${product.name}</h2>
                </div>

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
        function setMainImage(src) {
            const mainImg = document.getElementById("variant-image");
            if (mainImg) {
                mainImg.src = src;
            }
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

        console.log("FULL PRODUCT:", product);
        console.log("VARIANTS:", product.variants);       
        //variants

        product.variants.forEach((variant, index) => {
            const card = document.createElement('div');
                card.classList.add('size-option');
            const variantML = parseInt(variant.size); // "3ML" → 3
            const isAvailable = variant.in_stock && product.stock_ml >= variantML
                if (!isAvailable) {
                    card.classList.add('out');
                }

                card.innerHTML = `
                    <img src="${variant.image}" width="80"
                    onerror="this.src='./images/noimage.png'">
                    <p><strong>${variant.size}</strong></p>
                    <p class="price">$${variant.price}</p>
                    ${!isAvailable ? '<p class="out-of-stock-label">Out of Stock</p>' : ''}
                `;
                
            // click logic
            card.onclick = () => {
                if (!isAvailable) {
                    showToast("This option is out of stock", "error");
                    return;
                }
                clearSelection();
                selectedVariant = variant;
                const img = variant.image || product.image || './images/noimage.png';
                setMainImage(img);
                updateActiveThumbnail(img);

                card.classList.add('selected');
                updatePurchaseBox();
            };
            grid.appendChild(card);
                    
        });    

        const firstAvailable = product.variants.find(
            v => v.in_stock && product.stock_ml >= v.ml
        );
            if (!firstAvailable) {
                // No variants available
                    grid.innerHTML = `
                        <div class="out-of-stock-box">
                            <p class="out-of-stock-message">
                                All variants are out of stock
                            </p>
                        </div>
                    `;
                    purchaseBox.innerHTML = ""
                return; // stop further execution
            }

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
            


        function updatePurchaseBox() {
            if (!selectedVariant) return;

            purchaseBox.innerHTML = `
                <div class="purchase-box">
                    <h3>Selected: ${selectedVariant.size}</h3>
                    <p><strong>Price: $${selectedVariant.price}</strong></p>
                        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                            <button id="addCartBtn" class="primary-btn">Add to Cart</button>
                        </div>    
                </div>
            `;
            const addBtn = document.getElementById("addCartBtn");
                if (addBtn) {
                    addBtn.onclick = () => {
                        if (!selectedVariant) {
                            showToast("Please select an option", "error");
                            return;
                        }

                        addToCart(
                            product.id,
                            product.name,
                            selectedVariant.size,
                            selectedVariant.price,
                            product.image,
                            selectedVariant.ml
                        );

                        showToast("Added to cart 🛒", "success");

                        // trigger CSS animation
                        addBtn.classList.add("added");
                        setTimeout(() => addBtn.classList.remove("added"), 300);
                    };
                }

        }

        // Back button
        const back = document.createElement('button');
        back.innerText = "⬅ Back";

        back.onclick = () => {
            showProducts(products, addToCart);
        };

        back.classList.add("secondary-btn");
        document.getElementById("backContainer").appendChild(back);

    }
