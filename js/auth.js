// auth.js
import { auth, db } from "./firebase.js"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

const urlParams = new URLSearchParams(window.location.search);
const refId = urlParams.get('ref');
if (refId) localStorage.setItem('pending_referrer', refId);

export async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const referrerId = localStorage.getItem('pending_referrer');

    const userData = {
        firstName: document.getElementById('reg-name').value,
        lastName: document.getElementById('reg-lastname').value,
        phone: document.getElementById('reg-phone').value || "",
        email: email,
        referredBy: referrerId || null,
        createdAt: new Date().toISOString(),
        loyalty: {
            vaultPoints: 0,
            totalSpent: 0,
            actionPoints: 0,
            socialRewards: {},
            lastBirthdayRewardYear: 0
        }
    };

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
        localStorage.removeItem('pending_referrer');
        window.location.href = "index.html";
    } catch (error) { showToast(error.message, "error"); }
}

export async function handleLogin(e) {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('login-email').value, document.getElementById('login-password').value);
        window.location.href = "index.html";
    } catch (error) { showToast("Credenciales inválidas", "error"); }
}