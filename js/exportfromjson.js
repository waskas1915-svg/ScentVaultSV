//Export products from json
import { db } from "./firebase.js";

export async function uploadProducts() {
  try {
    const res = await fetch("products.json");
    const products = await res.json();

    for (const product of products) {
      await addDoc(collection(db, "products"), product);
      console.log("Uploaded:", product.name);
    }

    console.log("✅ All products uploaded!");
  } catch (err) {
    console.error("❌ Upload error:", err);
  }
} 