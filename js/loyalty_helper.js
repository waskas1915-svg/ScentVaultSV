// loyalty_helper.js
import { db } from "./firebase.js";
import { 
    doc, getDoc, updateDoc, increment, collection, query, where, getDocs, arrayUnion, addDoc, serverTimestamp, limit 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

/**
 * 1. Sincroniza puntos por compras y bonos de primer pedido
 */
export async function syncVaultPoints(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const q = query(collection(db, "orders"), where("userId", "==", userId), where("status", "==", "completado"));
        const snap = await getDocs(q);
        
        let totalSpent = 0;
        let completedCount = 0;
        snap.forEach(orderDoc => {
            totalSpent += parseFloat(orderDoc.data().total) || 0;
            completedCount++;
        });

        let bonus = 0;
        // Blindaje: Solo 100 pts en la primera orden completada
        if (completedCount >= 1 && !userData.loyalty?.firstPurchaseBonusClaimed) {
            bonus = 100;
            await updateDoc(userRef, { "loyalty.firstPurchaseBonusClaimed": true });
            showToast("🎁 ¡Bono de primera compra: +100 Vault Points!", "success");
        }

        const validatedPoints = Math.floor(totalSpent) + (userData.loyalty?.actionPoints || 0) + bonus;
        await updateDoc(userRef, { 
            "loyalty.vaultPoints": validatedPoints, 
            "loyalty.totalSpent": totalSpent 
        });

        return { validatedPoints, totalSpent };
    } catch (e) { 
        console.error("Error en lealtad:", e);
        return { validatedPoints: 0, totalSpent: 0 }; 
    }
}

/**
 * 2. Otorga puntos por redes sociales (Protección contra clics repetidos)
 */
export async function awardSocialPoints(userId, platform, points) {
    const userRef = doc(db, "users", userId);
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.data().loyalty?.socialRewards?.[platform]) return false;

        await updateDoc(userRef, {
            "loyalty.actionPoints": increment(points),
            [`loyalty.socialRewards.${platform}`]: true
        });
        showToast(`+${points} Vault Points obtenidos!`, "success");
        return true;
    } catch (e) { return false; }
}

/**
 * 3. Otorga puntos por reviews (Protección: Solo si compró y es la 1ra review del item)
 */
export async function awardReviewPoints(userId, productId) {
    const userRef = doc(db, "users", userId);
    try {
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData.loyalty?.reviewedProducts?.includes(productId)) return false;

        const q = query(collection(db, "orders"), where("userId", "==", userId), where("status", "==", "completado"));
        const ordersSnap = await getDocs(q);
        
        let hasBought = false;
        ordersSnap.forEach(order => {
            if (order.data().items.some(item => String(item.id) === String(productId))) hasBought = true;
        });

        if (hasBought) {
            await updateDoc(userRef, {
                "loyalty.actionPoints": increment(20),
                "loyalty.reviewedProducts": arrayUnion(productId)
            });
            showToast("✍️ ¡Gracias! +20 Vault Points por tu reseña.", "success");
            return true;
        }
        return false;
    } catch (e) { return false; }
}

/**
 * 4. Verifica y otorga premio de cumpleaños anual
 */
export async function checkBirthdayReward(userId, userData) {
    if (!userData.birthday) return;
    const today = new Date();
    const currentYear = today.getFullYear();
    const [y, m, d] = userData.birthday.split('-');
    const isToday = today.getMonth() + 1 === parseInt(m) && today.getDate() === parseInt(d);
    
    if (isToday && (userData.loyalty?.lastBirthdayRewardYear || 0) < currentYear) {
        await updateDoc(doc(db, "users", userId), {
            "loyalty.actionPoints": increment(50),
            "loyalty.lastBirthdayRewardYear": currentYear
        });
        showToast("🎂 ¡Feliz Cumpleaños! Recibiste 50 Vault Points.", "success");
    }
}

// Cupones

const REWARDS_CONFIG = {
    '5_fixed': { points: 250, value: 5, type: 'fixed', label: '$5.00 OFF' },
    '5_percent': { points: 300, value: 0.05, type: 'percent', label: '5% OFF' },
    '10_fixed': { points: 550, value: 10, type: 'fixed', label: '$10.00 OFF' },
    '10_percent': { points: 600, value: 0.10, type: 'percent', label: '10% OFF' }
};

/**
 * Genera un cupón único y resta los puntos del usuario
 */
export async function redeemVaultPoints(userId, rewardId) {
    const reward = REWARDS_CONFIG[rewardId];
    if (!reward) return { success: false, msg: "Recompensa no válida" };

    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const currentPoints = userSnap.data()?.loyalty?.vaultPoints || 0;

        if (currentPoints < reward.points) {
            return { success: false, msg: "No tienes suficientes Vault Points." };
        }

        // 1. Generar código único aleatorio
        const randomCode = `SV-${reward.label.replace(' ', '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // 2. Crear el cupón en Firebase
        await addDoc(collection(db, "coupons"), {
            code: randomCode,
            userId: userId,
            type: reward.type,
            value: reward.value,
            pointsSpent: reward.points,
            used: false,
            orderId: null, // Se llenará al usarse
            createdAt: serverTimestamp()
        });

        // 3. Restar los puntos (Usamos actionPoints negativo para balancear el total)
        await updateDoc(userRef, {
            "loyalty.actionPoints": increment(-reward.points)
        });

        // Sincronizamos para que el UI se actualice
        await syncVaultPoints(userId);

        return { success: true, code: randomCode };
    } catch (e) {
        console.error(e);
        return { success: false, msg: "Error en el servidor." };
    }
}