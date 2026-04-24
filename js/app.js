// app.js
import { auth, db } from "./firebase.js";
import { showProducts } from "./ui.js";
import { updateCartUI, addToCart } from "./cart.js";
import { initHeader } from "./header.js";
import { initDrawer, openDrawer } from "./drawer.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export let allProducts = [];

onAuthStateChanged(auth, async (user) => {
    try {
        if (allProducts.length === 0) {
            const querySnapshot = await getDocs(collection(db, "products"));
            allProducts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    // Usamos tu ID manual como principal para que coincida con ['511']
                    id: String(data.id), 
                    firebaseId: doc.id,
                    ...data
                };
            });
            // Hacemos la lista global para que otros archivos la lean
            window.allProducts = allProducts; 
        }
        
        // Dibujamos la tienda
        await showProducts(allProducts, handleAddToCart);
        
    } catch (err) {
        console.error("Error en el inicio:", err);
    }
});

async function init() {
    initHeader();
    initDrawer();
    updateCartUI(); 
}

function handleAddToCart(id, name, size, price, image, ml) {
    addToCart(id, name, size, price, image, ml, () => {
        openDrawer('cart'); 
    });
}

document.addEventListener("DOMContentLoaded", init);

export function resetToHome() {
    showProducts(allProducts, handleAddToCart);
    window.scrollTo(0, 0);
}

// Logo click
const logo = document.getElementById("logo");
if (logo) {
    logo.onclick = () => resetToHome();
}