// Product .js

import { db } from "./firebase.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let cachedProducts = null;

export async function loadProducts() {
  if (cachedProducts) return cachedProducts;

  try {
    const snapshot = await getDocs(collection(db, "products"));

    cachedProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return cachedProducts;

  } catch (err) {
    console.error("Error loading products:", err);
    return [];
  }

  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({
      id: doc.id,           // <-- Este es el ID largo (7x9WzL2...)
      numberId: doc.data().id, // Guardamos tu número (511) por si lo usas para otra cosa
      ...doc.data()         // Trae el resto: name, image, price, etc.
  }));

}