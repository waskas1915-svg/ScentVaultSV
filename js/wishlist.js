import { db, auth } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";
import { addToCart } from "./cart.js";

let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// --- AGREGAR / QUITAR (Toggle) ---
export async function toggleWishlist(productId) {
    const user = auth.currentUser;

    if (!user) {
        // Lógica para invitados
        const index = localWishlist.indexOf(productId);
        if (index === -1) {
            localWishlist.push(productId);
            showToast("Guardado en tu lista local", "success");
        } else {
            localWishlist.splice(index, 1);
            showToast("Eliminado de tu lista", "info");
        }
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        updateWishlistUI();
        return;
    }

    // Lógica para usuarios logueados (Firestore)
    const wishlistRef = doc(db, "wishlists", user.uid);
    try {
        const docSnap = await getDoc(wishlistRef);
        if (docSnap.exists() && docSnap.data().items.includes(productId)) {
            await updateDoc(wishlistRef, { items: arrayRemove(productId) });
            showToast("Eliminado de tu cuenta", "info");
        } else {
            await setDoc(wishlistRef, { items: arrayUnion(productId) }, { merge: true });
            showToast("Guardado en tu cuenta ✨", "success");
        }
        updateWishlistUI();
    } catch (error) {
        console.error("Error en wishlist:", error);
    }
}

// --- SINCRONIZACIÓN AL INICIAR SESIÓN ---
export async function syncWishlistAfterLogin(userId) {
    if (localWishlist.length === 0) return;

    const wishlistRef = doc(db, "wishlists", userId);
    try {
        await setDoc(wishlistRef, { items: arrayUnion(...localWishlist) }, { merge: true });
        localWishlist = [];
        localStorage.removeItem("wishlist");
        updateWishlistUI();
    } catch (error) {
        console.log("Error sincronizando:", error);
    }
}

// --- ACTUALIZAR CONTADOR ---
export function updateWishlistUI() {
    const user = auth.currentUser;
    // Aquí podrías obtener el conteo de Firestore si el usuario está logueado
    const count = user ? "..." : localWishlist.length; 
    
    const wishlistTab = document.querySelector('[data-tab="wishlist"]');
    if (wishlistTab) {
        wishlistTab.innerText = `Wishlist(${localWishlist.length})`;
    }
}

export function renderWishlistItems(items) {
    const container = document.getElementById('drawerContent');
    let html = '<div class="wishlist-items-list">';

    items.forEach(productId => {
        // Buscamos los datos del producto en tu array global de productos
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        html += `
            <div class="cart-item">
                <img src="${product.image}" class="cart-item-img">
                <div class="cart-item-info">
                    <p class="cart-name">${product.name}</p>
                    <p class="cart-price">$${product.price}</p>
                    <button class="primary-btn black-btn small-btn" onclick="moveToCart('${product.id}')">
                        AÑADIR A LA BOLSA
                    </button>
                </div>
                <button class="remove-btn" onclick="removeFromWishlist('${product.id}')">✕</button>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

export function renderEmptyWishlist(closeDrawer) {
    return `
        <div class="cart-empty-container">
            <img src="./images/emptycart2.png" class="cart-empty-img" alt="Empty Wishlist">
            <h2>Tu lista de deseos está vacía</h2>
            <p>No tienes fragancias guardadas. ¡Explora nuestra colección y guarda tus favoritas!</p>
            <button id="continueWishlistBtn" class="primary-btn continue-shopping">
                CONTINUAR COMPRANDO
            </button>
        </div>
    `;
}

export async function getWishlistFromFirebase(userId) {
    if (!userId) return [];

    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Retornamos el array de wishlist o uno vacío si no tiene nada
            return userSnap.data().wishlist || [];
        }
        return [];
    } catch (error) {
        console.error("Error al obtener la Wishlist:", error);
        return [];
    }
}