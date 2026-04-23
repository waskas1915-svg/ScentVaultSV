import { db, auth } from "./firebase.js";
import { doc, updateDoc, arrayUnion, increment, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function awardPointsForReview(productId) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Verificamos si el producto ya fue reseñado por este usuario anteriormente
    if (userData.loyalty?.reviewedProducts?.includes(productId)) {
        console.log("Sistema: Puntos por reseña ya otorgados para este producto.");
        return { success: false, message: "Ya recibiste puntos por este producto." };
    }

    try {
        await updateDoc(userRef, {
            "loyalty.vaultPoints": increment(20), // 20 VP por reseña
            "loyalty.totalEarned": increment(20),
            "loyalty.reviewedProducts": arrayUnion(productId) // Marcamos el producto como "reseñado"
        });
        return { success: true, points: 20 };
    } catch (error) {
        console.error("Error al asignar puntos:", error);
    }
}