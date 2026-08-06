/* ==========================================================================
   SEIMEI - SUNA : auth.js
   Comptes individuels des psychologues (psy_membres) — remplace l'ancien
   code d'accès partagé (PSY_ACCESS_CODE). Calque du pattern éprouvé sur
   le site jumeau hopital-suna (common.js) : sceau haché côté client,
   comparaison côté serveur via RPC security definer, jamais le hash en
   localStorage.
   ========================================================================== */

const PSY_SESSION_KEY = 'psy_suna_session';

// --- Hash du sceau (SHA-256) ---
async function hashSceauPsy(sceau) {
  const data = new TextEncoder().encode(sceau);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Session (jamais le hash) ---
function getCurrentUser() {
  const raw = localStorage.getItem(PSY_SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}
function saveCurrentUser(user) {
  localStorage.setItem(PSY_SESSION_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem(PSY_SESSION_KEY);
}
function logoutPsy() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

function hasAnyRole(user, roles) {
  return !!user && Array.isArray(roles) && roles.includes(user.role);
}

// --- Anti-bruteforce basique côté client (dissuasif seulement) ---
function makePsyLoginThrottle(storageKey, maxAttempts = 5, lockoutMs = 30000) {
  function state() {
    try { return JSON.parse(sessionStorage.getItem(storageKey)) || { count: 0, until: 0 }; }
    catch (_) { return { count: 0, until: 0 }; }
  }
  function save(s) { sessionStorage.setItem(storageKey, JSON.stringify(s)); }
  return {
    isLocked() { return state().until > Date.now(); },
    remainingSeconds() { return Math.max(0, Math.ceil((state().until - Date.now()) / 1000)); },
    registerFailure() {
      const s = state();
      s.count += 1;
      if (s.count >= maxAttempts) { s.until = Date.now() + lockoutMs; s.count = 0; }
      save(s);
    },
    registerSuccess() { save({ count: 0, until: 0 }); }
  };
}
const psyLoginThrottle = makePsyLoginThrottle('psy_suna_login_throttle');

// --- Connexion / Inscription (appels Supabase) ---
async function loginPsy(nom, prenom, sceau) {
  if (!sb) throw new Error('Configuration Supabase absente.');
  const hash = await hashSceauPsy(sceau);
  const { data, error } = await sb.rpc('verifier_sceau_psy', { p_nom: nom, p_prenom: prenom, p_sceau_hash: hash });
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Identifiants incorrects, ou compte pas encore activé par la Gérance.');
  return data[0];
}

async function registerPsy(nom, prenom, sceau) {
  if (!sb) throw new Error('Configuration Supabase absente.');
  const hash = await hashSceauPsy(sceau);
  const { data, error } = await sb.from('psy_membres')
    .insert([{ nom, prenom, sceau: hash, role: 'psychologue', categorie: 'branche_psy_uniquement', statut: 'en_attente' }])
    .select('id, nom, prenom, role, categorie, statut');
  if (error) {
    if (error.code === '23505') throw new Error('Un compte existe déjà avec ce nom et prénom.');
    throw new Error(error.message);
  }
  return data[0];
}

// --- Gate de connexion réutilisable sur toutes les pages internes ---
// Attend deux conteneurs dans le HTML de la page : #psy-auth-gate (vide)
// et #psy-app (le contenu protégé, caché tant que non connecté).
function renderAuthGate() {
  const gate = document.getElementById('psy-auth-gate');
  if (!gate) return;
  gate.innerHTML = `
    <section class="card card-glass" id="psy-auth-panel" style="max-width: 440px; margin: 40px auto;">
      <div class="card-title"><i class="fa-solid fa-lock"></i> Accès réservé — Branche Psychologique</div>
      <p style="color: var(--sand-dim); margin-bottom: 14px;">Connectez-vous avec votre compte de psychologue, ou créez un compte (il devra être activé par la Gérance avant votre première connexion).</p>

      <div class="tabs" style="display:flex; gap:8px; margin-bottom:14px;">
        <button type="button" class="btn btn-secondary btn-sm psy-auth-tab active" data-tab="login" style="flex:1; justify-content:center;">Connexion</button>
        <button type="button" class="btn btn-secondary btn-sm psy-auth-tab" data-tab="register" style="flex:1; justify-content:center;">Inscription</button>
      </div>

      <form id="psy-login-form" class="form-grid">
        <div class="form-group"><label>Nom</label><input type="text" id="psy-login-nom" autocomplete="off" required></div>
        <div class="form-group"><label>Prénom</label><input type="text" id="psy-login-prenom" autocomplete="off" required></div>
        <div class="form-group"><label>Mot de passe (sceau)</label><input type="password" id="psy-login-sceau" autocomplete="current-password" required></div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;"><i class="fa-solid fa-right-to-bracket"></i> Se connecter</button>
        <p id="psy-login-error" style="color:#e74c3c; font-size:13px; margin-top:6px;"></p>
      </form>

      <form id="psy-register-form" class="form-grid hidden">
        <div class="form-group"><label>Nom</label><input type="text" id="psy-reg-nom" autocomplete="off" required></div>
        <div class="form-group"><label>Prénom</label><input type="text" id="psy-reg-prenom" autocomplete="off" required></div>
        <div class="form-group"><label>Mot de passe (sceau)</label><input type="password" id="psy-reg-sceau" placeholder="6 caractères minimum" autocomplete="new-password" required minlength="6"></div>
        <div class="form-group"><label>Confirmer le mot de passe</label><input type="password" id="psy-reg-sceau2" autocomplete="new-password" required minlength="6"></div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;"><i class="fa-solid fa-user-plus"></i> Créer mon compte</button>
        <p id="psy-reg-error" style="color:#e74c3c; font-size:13px; margin-top:6px;"></p>
        <p id="psy-reg-success" style="color:#51cf66; font-size:13px; margin-top:6px;"></p>
      </form>
    </section>
  `;

  gate.querySelectorAll('.psy-auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      gate.querySelectorAll('.psy-auth-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('psy-login-form').classList.toggle('hidden', btn.dataset.tab !== 'login');
      document.getElementById('psy-register-form').classList.toggle('hidden', btn.dataset.tab !== 'register');
    });
  });

  document.getElementById('psy-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('psy-login-error');
    errEl.textContent = '';
    if (psyLoginThrottle.isLocked()) {
      errEl.textContent = `Trop de tentatives. Réessayez dans ${psyLoginThrottle.remainingSeconds()}s.`;
      return;
    }
    const nom = document.getElementById('psy-login-nom').value.trim();
    const prenom = document.getElementById('psy-login-prenom').value.trim();
    const sceau = document.getElementById('psy-login-sceau').value;
    try {
      const user = await loginPsy(nom, prenom, sceau);
      psyLoginThrottle.registerSuccess();
      saveCurrentUser(user);
      onAuthReady(user);
    } catch (err) {
      psyLoginThrottle.registerFailure();
      errEl.textContent = err.message;
    }
  });

  document.getElementById('psy-register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('psy-reg-error');
    const okEl = document.getElementById('psy-reg-success');
    errEl.textContent = ''; okEl.textContent = '';
    const nom = document.getElementById('psy-reg-nom').value.trim();
    const prenom = document.getElementById('psy-reg-prenom').value.trim();
    const sceau = document.getElementById('psy-reg-sceau').value;
    const sceau2 = document.getElementById('psy-reg-sceau2').value;
    if (!nom || !prenom) { errEl.textContent = 'Nom et prénom requis.'; return; }
    if (sceau.length < 6) { errEl.textContent = 'Le mot de passe doit faire au moins 6 caractères.'; return; }
    if (sceau !== sceau2) { errEl.textContent = 'Les mots de passe ne correspondent pas.'; return; }
    try {
      await registerPsy(nom, prenom, sceau);
      okEl.textContent = 'Compte créé. Il doit maintenant être activé par la Gérance avant votre première connexion.';
      document.getElementById('psy-register-form').reset();
    } catch (err) {
      errEl.textContent = err.message;
    }
  });
}

function showApp(user) {
  const gate = document.getElementById('psy-auth-gate');
  const app = document.getElementById('psy-app');
  if (gate) gate.classList.add('hidden');
  if (app) app.classList.remove('hidden');
  renderSidebar(document.body.getAttribute('data-page') || '');
}

// Callback surchargeable par chaque page pour lancer son propre chargement
// de données une fois l'utilisateur authentifié.
let onAuthReadyCallback = null;
function onAuthReady(user) {
  showApp(user);
  if (typeof onAuthReadyCallback === 'function') onAuthReadyCallback(user);
}

// À appeler au chargement de chaque page protégée.
function requireAuth(callback) {
  onAuthReadyCallback = callback || null;
  const user = getCurrentUser();
  if (user) {
    onAuthReady(user);
  } else {
    renderAuthGate();
  }
}

// Pour les pages réservées à la Gérance/Seimei (gerance.html) : à appeler
// dans le callback de requireAuth(). Affiche un message et bloque le
// rendu du contenu si le rôle ne convient pas (barrière côté client,
// cohérente avec le reste du site — voir SECURITY.md).
function requireRole(user, roles, containerId) {
  if (hasAnyRole(user, roles)) return true;
  const el = document.getElementById(containerId || 'psy-app');
  if (el) {
    el.innerHTML = `<div class="card card-glass" style="max-width:520px; margin:60px auto; text-align:center;">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:28px; color:#e74c3c;"></i>
      <p style="margin-top:12px;">Cet espace est réservé à la Gérance de la branche psychologique et à la Seimei.</p>
    </div>`;
  }
  return false;
}
