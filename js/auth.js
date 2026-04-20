
import { auth, db } from "./firebase.js"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";

// --- REGISTRO ---
export async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const userData = {
        firstName: document.getElementById('reg-name').value,
        lastName: document.getElementById('reg-lastname').value,
        phone: document.getElementById('reg-phone').value || "Not provided",
        address: document.getElementById('reg-address').value,
        email: email,
        createdAt: new Date().toISOString()
    };

    try {
        // 1. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Guardar datos extra en Firestore usando el UID del usuario
        await setDoc(doc(db, "users", user.uid), userData);

        showToast("Account created successfully! ✨", "success");
        window.location.href = "index.html";
    } catch (error) {
        showToast(error.message, "error");
    }
}

// --- LOGIN ---
export async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Welcome back!", "success");
        window.location.href = "index.html";
    } catch (error) {
        showToast("Invalid credentials", "error");
    }
}