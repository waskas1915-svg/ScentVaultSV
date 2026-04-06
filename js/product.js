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
}