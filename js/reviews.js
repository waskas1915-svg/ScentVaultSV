// reviews.js
import { db, auth } from './firebase.js';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showToast } from "./toast.js";
import { awardReviewPoints } from "./loyalty_helper.js";

/**
 * Renderiza la sección de reseñas en el contenedor provisto
 */
export async function initReviews(productId, container) {
    if (!container) return;

    const user = auth.currentUser;
    
    container.innerHTML = `
        <div class="reviews-section animate-fade-in">
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
        initInteractiveStars();
        setupFormListener(productId);
    }
}

function renderReviewForm() {
    return `
        <form id="review-form" class="review-form">
            <h4>Escribe tu reseña</h4>
            
            <div class="rating-input-wrapper">
                <label>Tu calificación:</label>
                <div class="star-rating" id="interactive-stars">
                    <span class="star" data-value="1">★</span>
                    <span class="star" data-value="2">★</span>
                    <span class="star" data-value="3">★</span>
                    <span class="star" data-value="4">★</span>
                    <span class="star" data-value="5">★</span>
                </div>
                <input type="hidden" id="rev-rating" value="5" required>
            </div>

            <div class="textarea-wrapper">
                <textarea id="rev-text" placeholder="¿Qué te pareció este aroma? Habla sobre su duración, estela y notas..." required></textarea>
            </div>
            
            <button type="submit" class="primary-btn gold-btn large-btn btn-review-submit">PUBLICAR RESEÑA</button>
            <p class="small-disclaimer">* Solo las reseñas de productos comprados otorgan Vault Points.</p>
        </form>
    `;
}

// Maneja la interactividad visual de las estrellas al hacer clic
function initInteractiveStars() {
    const starsContainer = document.getElementById('interactive-stars');
    const ratingInput = document.getElementById('rev-rating');
    if (!starsContainer) return;

    const stars = starsContainer.querySelectorAll('.star');
    
    // Iluminar las 5 por defecto
    highlightStars(5, stars);

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            ratingInput.value = val;
            highlightStars(val, stars);
        });
    });
}

function highlightStars(rating, stars) {
    stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-value'));
        if (starVal <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
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
            // Genera estrellas doradas fijas para la tarjeta
            const goldStars = '★'.repeat(r.rating);
            const emptyStars = '☆'.repeat(5 - r.rating);
            
            return `
                <div class="review-card animate-fade-in">
                    <div class="rev-header">
                        <div class="rev-user-info">
                            <span class="rev-avatar">👤</span>
                            <strong>${r.userName}</strong>
                        </div>
                        <div class="rev-stars" title="${r.rating} de 5 estrellas">
                            <span class="gold-stars">${goldStars}</span><span class="empty-stars">${emptyStars}</span>
                        </div>
                    </div>
                    <p class="rev-text">"${r.text}"</p>
                    <div class="rev-footer">
                        <small class="rev-date">${r.createdAt?.toDate().toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' }) || 'Reciente'}</small>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        list.innerHTML = `<p class="empty-reviews">No se pudieron cargar las reseñas.</p>`;
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
            await addDoc(collection(db, "reviews"), {
                productId,
                userId: user.uid,
                userName: user.displayName || "Cliente SV",
                text,
                rating: parseInt(rating),
                createdAt: serverTimestamp()
            });

            await awardReviewPoints(user.uid, productId);

            showToast("¡Reseña publicada!", "success");
            loadReviewsList(productId);
            form.reset();
            
            // Reiniciar a 5 estrellas visualmente
            const stars = document.querySelectorAll('#interactive-stars .star');
            highlightStars(5, stars);
            document.getElementById('rev-rating').value = 5;

        } catch (error) {
            showToast("Error al publicar reseña", "error");
        }
    };
}