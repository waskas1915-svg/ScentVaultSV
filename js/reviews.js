// reviews.js
import { db, auth } from './firebase.js';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";
import { awardReviewPoints } from "./loyalty_helper.js"; // Importamos el helper de puntos

/**
 * Renderiza la sección de reseñas en el contenedor provisto
 */
export async function initReviews(productId, container) {
    if (!container) return;

    const user = auth.currentUser;
    
    container.innerHTML = `
        <div class="reviews-section">
            <h3 class="playfair">Opiniones de la Comunidad</h3>
            <div id="reviews-list" class="reviews-list">Cargando reseñas...</div>
            <hr class="soft-divider">
            <div id="review-form-container">
                ${user ? renderReviewForm() : '<p class="login-msg-reviews">Debes <span onclick="window.switchTab(\'account\')" class="gold-text link">iniciar sesión</span> para dejar una reseña.</p>'}
            </div>
        </div>
    `;

    loadReviewsList(productId);

    if (user) {
        setupFormListener(productId);
    }
}

function renderReviewForm() {
    return `
        <form id="review-form" class="review-form animate-fade-in">
            <h4>Escribe tu reseña</h4>
            <div class="rating-input">
                <select id="rev-rating" required>
                    <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                    <option value="4">⭐⭐⭐⭐ (Muy bueno)</option>
                    <option value="3">⭐⭐⭐ (Bueno)</option>
                    <option value="2">⭐⭐ (Regular)</option>
                    <option value="1">⭐ (Pobre)</option>
                </select>
            </div>
            <textarea id="rev-text" placeholder="¿Qué te pareció este aroma? Habla sobre su duración, estela y notas..." required></textarea>
            <button type="submit" class="primary-btn gold-btn small-btn">PUBLICAR RESEÑA</button>
            <p class="small-disclaimer">* Solo las reseñas de productos comprados otorgan Vault Points.</p>
        </form>
    `;
}

async function loadReviewsList(productId) {
    const list = document.getElementById('reviews-list');
    try {
        const q = query(collection(db, "reviews"), where("productId", "==", productId), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        
        if (snap.empty) {
            list.innerHTML = `<p class="empty-reviews">Sé el primero en compartir su experiencia con esta fragancia.</p>`;
            return;
        }

        list.innerHTML = snap.docs.map(doc => {
            const r = doc.data();
            return `
                <div class="review-card">
                    <div class="rev-header">
                        <strong>${r.userName}</strong>
                        <span class="rev-stars">${'⭐'.repeat(r.rating)}</span>
                    </div>
                    <p class="rev-text">"${r.text}"</p>
                    <small class="rev-date">${r.createdAt?.toDate().toLocaleDateString() || 'Reciente'}</small>
                </div>
            `;
        }).join('');
    } catch (e) {
        list.innerHTML = `<p>No se pudieron cargar las reseñas.</p>`;
    }
}

function setupFormListener(productId) {
    const form = document.getElementById('review-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const text = document.getElementById('rev-text').value;
        const rating = document.getElementById('rev-rating').value;

        try {
            // 1. Guardar la reseña en Firestore
            await addDoc(collection(db, "reviews"), {
                productId,
                userId: user.uid,
                userName: user.displayName || userData?.firstName || "Cliente SV",
                text,
                rating: parseInt(rating),
                createdAt: serverTimestamp()
            });

            // 2. Intentar dar puntos (El helper validará si el producto fue comprado)
            await awardReviewPoints(user.uid, productId);

            showToast("¡Reseña publicada!", "success");
            loadReviewsList(productId);
            form.reset();
        } catch (error) {
            showToast("Error al publicar reseña", "error");
        }
    };
}