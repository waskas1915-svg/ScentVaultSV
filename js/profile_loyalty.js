// profile_loyalty.js
import { auth, db } from "./firebase.js";
import { awardSocialPoints, redeemVaultPoints } from "./loyalty_helper.js";
import { showToast } from "./toast.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- ICONOS PERSONALIZADOS SCENTVAULT SV ---
const ICONS = {
    admirer: `<svg viewBox="0 0 100 100" width="80" height="80"><path d="M50 20 L50 35 M35 40 L65 40 L65 85 L35 85 Z" fill="none" stroke="#bfa36a" stroke-width="2.5"/><circle cx="50" cy="15" r="5" fill="#bfa36a"/><text x="50" y="65" font-size="12" text-anchor="middle" fill="#bfa36a" font-family="serif" font-weight="bold">SV</text></svg>`,
    lover: `<svg viewBox="0 0 100 100" width="80" height="80"><path d="M30 40 L70 40 L70 85 L30 85 Z" fill="none" stroke="#bfa36a" stroke-width="2.5"/><path d="M50 15 L50 40" stroke="#bfa36a" stroke-width="2.5"/><path d="M50 65 C40 50, 60 50, 50 65" fill="#bfa36a"/><path d="M45 10 L55 10 L55 20 L45 20 Z" fill="#bfa36a"/><path d="M20 50 Q10 40, 20 30" fill="none" stroke="#bfa36a" stroke-width="1.5" opacity="0.6"/><path d="M80 50 Q90 40, 80 30" fill="none" stroke="#bfa36a" stroke-width="1.5" opacity="0.6"/></svg>`,
    flexer: `<svg viewBox="0 0 100 100" width="80" height="80"><rect x="25" y="35" width="50" height="55" fill="none" stroke="#bfa36a" stroke-width="3"/><circle cx="50" cy="62" r="12" fill="none" stroke="#bfa36a" stroke-width="2"/><path d="M50 50 L50 74 M38 62 L62 62" stroke="#bfa36a" stroke-width="2"/><path d="M40 10 L50 25 L60 10" fill="none" stroke="#bfa36a" stroke-width="3"/><circle cx="50" cy="30" r="4" fill="#bfa36a"/><path d="M20 20 L25 25 M80 20 L75 25" stroke="#bfa36a" stroke-width="2"/></svg>`
};

// Configuración de recompensas
const REDEEM_OPTIONS = [
    { id: '5_fixed', label: '$5.00 OFF USD', points: 250, desc: 'Cupón Fijo', icon: '🎫' },
    { id: '5_percent', label: '5% OFF TOTAL', points: 300, desc: 'Descuento Porcentual', icon: '📉' },
    { id: '10_fixed', label: '$10.00 OFF USD', points: 550, desc: 'Cupón Fijo', icon: '🎫' },
    { id: '10_percent', label: '10% OFF TOTAL', points: 600, desc: 'Descuento Porcentual', icon: '📉' }
];

/**
 * Renderiza la vista de lealtad
 */
export async function renderLoyalty({ userData, user }) {
    const points = userData?.loyalty?.vaultPoints || 0;
    const social = userData?.loyalty?.socialRewards || {};
    const firstName = userData?.firstName?.toUpperCase() || "USUARIO";
    const firstBonus = userData?.loyalty?.firstPurchaseBonusClaimed || false;
    
    // Lógica de Tiers
    let currentTier = "Iniciado";
    let pointsToNext = 2000 - points;
    let progressPercent = Math.min((points / 2000) * 100, 100);
    let nextTier = "Custodio";

    if (points >= 2000 && points < 10000) {
        currentTier = "Custodio";
        pointsToNext = 10000 - points;
        progressPercent = ((points - 2000) / 8000) * 100;
        nextTier = "Legado SV";
    } else if (points >= 10000) {
        currentTier = "Legado SV";
        pointsToNext = 0;
        progressPercent = 100;
        nextTier = "Máximo Estatus";
    }

    // Cargar cupones activos del usuario
    let myCoupons = [];
    try {
        const q = query(collection(db, "coupons"), where("userId", "==", user.uid), where("used", "==", false));
        const snap = await getDocs(q);
        myCoupons = snap.docs.map(d => d.data());
    } catch (e) {
        console.error("Error cargando cupones:", e);
    }

    const referralLink = `${window.location.origin}/index.html?ref=${user.uid.slice(0, 8)}`;

    return `
        <div class="loyalty-container animate-fade-in">
            
            <section class="loyalty-welcome-section">
                <h1 class="loyalty-main-title">VAULT REWARDS, <span class="gold-text">${firstName}</span></h1>
                <p class="loyalty-subtitle">Tu lealtad es la llave de nuestra bóveda. Cada compra y acción te acerca a fragancias exclusivas.</p>
            </section>

            <section class="loyalty-tiers-grid">
                <div class="tier-item ${points < 2000 ? 'active' : ''}">
                    <div class="tier-icon-wrapper">${ICONS.admirer}</div>
                    <h3>Iniciado</h3>
                    <p class="range">0 - 1,999 pts</p>
                </div>
                <div class="tier-item ${points >= 2000 && points < 10000 ? 'active' : ''} ${points < 2000 ? 'locked' : ''}">
                    <div class="tier-icon-wrapper">${ICONS.lover}</div>
                    <h3>Custodio</h3>
                    <p class="range">2,000 - 9,999 pts</p>
                </div>
                <div class="tier-item ${points >= 10000 ? 'active' : ''} ${points < 10000 ? 'locked' : ''}">
                    <div class="tier-icon-wrapper">${ICONS.flexer}</div>
                    <h3>Legado SV</h3>
                    <p class="range">10,000+ pts</p>
                </div>
            </section>

            <section class="loyalty-progress-card">
                <div class="progress-info">
                    <p><strong>Estatus: ${currentTier}</strong></p>
                    ${pointsToNext > 0 ? `<p>Te faltan <span class="gold-text">${pointsToNext.toLocaleString()}</span> puntos para el nivel <span class="gold-text">${nextTier}</span></p>` : `<p>¡Has alcanzado el estatus Legado SV!</p>`}
                </div>
                <div class="custom-progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="balance-display">
                    <div class="points-badge">${points} <span>Vault Points</span></div>
                    <button class="primary-btn gold-btn" onclick="window.openRedeemModal('${user.uid}', ${points})">CANJEA TUS CUPONES</button>
                </div>
            </section>

            ${myCoupons.length > 0 ? `
            <section class="active-coupons-section animate-fade-in">
                <h3 class="playfair">Mis Cupones Disponibles</h3>
                <div class="coupons-flex">
                    ${myCoupons.map(c => `
                        <div class="coupon-ticket">
                            <div class="ticket-info">
                                <span class="t-code">${c.code}</span>
                                <span class="t-desc">${c.type === 'fixed' ? '$'+c.value : (c.value*100)+'%'} de descuento</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>` : ''}

            <h2 class="section-title-premium">¿Cómo ganar más puntos?</h2>
            <div class="earn-grid-premium">
                <div class="earn-card ${firstBonus ? 'claimed' : ''}">
                    <div class="pts-badge">+100</div>
                    <span class="icon">${firstBonus ? '✅' : '🛍️'}</span>
                    <h4>Primer Pedido</h4>
                    <p>${firstBonus ? 'Bono reclamado' : 'Completa tu primer compra y recibe 100 pts.'}</p>
                </div>
                <div class="earn-card">
                    <div class="pts-badge">+20</div>
                    <span class="icon">✍️</span>
                    <h4>Review Real</h4>
                    <p>Puntos por reseñar productos que has comprado.</p>
                </div>
                <div class="earn-card ${social.instagram ? 'claimed' : ''}" onclick="window.handleSocialReward('instagram', 15, 'https://instagram.com/scentvaultsv')">
                    <div class="pts-badge">+15</div>
                    <span class="icon">${social.instagram ? '✅' : '📸'}</span>
                    <h4>Instagram</h4>
                    <p>${social.instagram ? '¡Ya nos sigues!' : 'Síguenos para obtener el bono.'}</p>
                </div>
                <div class="earn-card">
                    <div class="pts-badge">+250</div>
                    <span class="icon">🤝</span>
                    <h4>Referidos</h4>
                    <p>Gana puntos cuando tu amigo complete su primer pedido.</p>
                </div>
                <div class="earn-card locked-card">
                    <span class="icon">🔒</span>
                    <h4>Coming Soon</h4>
                    <p>Nuevos desafíos en camino.</p>
                </div>
            </div>

            <section class="referral-box-premium">
                <div class="referral-content">
                    <h2 class="playfair">Invite a Friend</h2>
                    <p>Comparte tu código secreto. Tu amigo recibe un <strong>descuento de $5.00</strong> (en compras > $25) y tú recibes <strong>250 Vault Points</strong> cuando complete su primera compra.</p>
                    <div class="referral-action">
                        <input type="text" value="${referralLink}" readonly id="ref-link-input">
                        <button class="gold-btn" onclick="window.copyReferralLink()">COPIAR LINK</button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// --- LÓGICA DEL POP-UP DE CANJE ---

window.openRedeemModal = (uid, points) => {
    const container = document.getElementById('redemptionModalContainer');
    if (!container) return;

    container.innerHTML = `
        <div id="redemptionModalOverlay" class="redeem-modal-overlay show" onclick="window.closeRedemptionModal()">
            <div class="redeem-modal-panel animate-slide-in-right" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="playfair">Canjea tus puntos</h3>
                    <button class="close-icon" onclick="window.closeRedemptionModal()">✕</button>
                </div>
                <div class="points-balance-header">
                    <p>Tienes <strong class="gold-text">${points} Vault Points</strong></p>
                </div>
                <div class="redeem-options-list">
                    ${REDEEM_OPTIONS.map(opt => `
                        <div class="redeem-option-item ${points < opt.points ? 'insufficient' : ''}">
                            <div class="option-info">
                                <span class="opt-icon">${opt.icon}</span>
                                <div>
                                    <p class="opt-label">${opt.label}</p>
                                    <p class="opt-pts">${opt.points} Vault Points</p>
                                    ${points < opt.points ? `<p class="pts-needed">Te faltan ${opt.points - points} pts</p>` : ''}
                                </div>
                            </div>
                            <button 
                                id="btn-redeem-${opt.id}" 
                                class="redeem-action-btn ${points < opt.points ? 'disabled' : 'gold-btn'}"
                                onclick="${points >= opt.points ? `window.handleModalRedeem('${uid}', '${opt.id}')` : ''}"
                                ${points < opt.points ? 'disabled' : ''}>
                                ${points < opt.points ? 'BLOQUEADO' : 'CANJEAR'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.style.overflow = 'hidden';
};

window.closeRedemptionModal = () => {
    const container = document.getElementById('redemptionModalContainer');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
};

window.handleModalRedeem = async (uid, rewardId) => {
    const btn = document.getElementById(`btn-redeem-${rewardId}`);
    if (!btn || !confirm("¿Confirmas que deseas canjear tus puntos por este cupón único?")) return;
    
    btn.innerHTML = `<span class="loading-circle">🌀</span> PROCESANDO`;
    btn.classList.add('processing');
    btn.disabled = true;

    const result = await redeemVaultPoints(uid, rewardId);

    if (result.success) {
        showToast(`¡Éxito! Tu código es: ${result.code}`, "success");
        window.closeRedemptionModal();
        window.renderProfilePage('loyalty');
    } else {
        showToast(result.msg, "error");
        btn.innerHTML = "CANJEAR";
        btn.classList.remove('processing');
        btn.disabled = false;
    }
};

window.handleSocialReward = async (platform, pts, url) => {
    const success = await awardSocialPoints(auth.currentUser.uid, platform, pts);
    window.open(url, '_blank');
    if (success) window.renderProfilePage('loyalty');
};

window.copyReferralLink = () => {
    const input = document.getElementById("ref-link-input");
    input.select();
    navigator.clipboard.writeText(input.value);
    showToast("¡Link copiado! Envíalo a un amigo.", "success");
};