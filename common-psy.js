/* ==========================================================================
   SEIMEI - SUNA : common-psy.js
   Fonctions partagées entre toutes les pages internes du back-office
   (index, tests, suivis, formation, procedures, tarifs, gerance) :
   client Supabase, échappement HTML, sidebar commune, libellés de rôles.
   Chargé après supabase.js/config.js et avant auth.js.
   ========================================================================== */

// --- Client Supabase partagé (une seule instance par page) ---
var sb = null;
try {
  if (typeof SUPABASE_URL !== 'undefined' && typeof window.supabase !== 'undefined') {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) { console.error('Client Supabase indisponible :', e); sb = null; }

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text == null ? '' : String(text);
  return d.innerHTML;
}

function formatDateFr(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('fr-FR');
}

function formatDateTimeFr(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// --- Libellés partagés ---
const ROLE_LABELS = { psychologue: 'Psychologue', gerance_psy: 'Gérance Branche Psy', seimei: 'Seimei' };
const CATEGORIE_LABELS = { seimei_medical_psy: 'Seimei médical & psy', branche_psy_uniquement: 'Branche psychologie uniquement' };
const STATUT_MEMBRE_LABELS = { en_attente: 'En attente', actif: 'Actif', inactif: 'Inactif' };

const TEST_TYPE_LABELS = { kensatsu: 'Kensatsu', camp_redressement: 'Camp de redressement', bdm: 'BDM', autre: 'Autre' };
const TEST_STATUT_LABELS = { apte: 'Apte', inapte: 'Inapte', a_revoir: 'À revoir', sous_surveillance: 'Sous surveillance' };
const TEST_STATUT_CLASS = { apte: 'dec-maintien', inapte: 'dec-retrogradation', a_revoir: 'dec-restrictions', sous_surveillance: 'dec-suspension' };

const SUIVI_STATUT_LABELS = { actif: 'Actif', pause: 'En pause', inactif: 'Inactif / Clôturé' };
const SUIVI_STATUT_CLASS = { actif: 'suivi-actif', pause: 'suivi-pause', inactif: 'suivi-inactif' };

const HUMEUR_LABELS = { stable: 'Stable', instable: 'Instable', degradee: 'Dégradée', en_amelioration: 'En amélioration' };
const RISQUE_LABELS = { aucun: 'Aucun', a_surveiller: 'À surveiller', preoccupant: 'Préoccupant', urgent: 'Urgent' };
const RISQUE_CLASS = { aucun: 'risque-aucun', a_surveiller: 'risque-surveiller', preoccupant: 'risque-preoccupant', urgent: 'risque-urgent' };

const ACTION_TYPE_LABELS = {
  test: 'Test psychologique',
  evaluation: 'Entretien clinique complet',
  suivi_creation: 'Ouverture de suivi',
  suivi_statut: 'Changement de statut de suivi',
  rapport_seance: 'Rapport de séance',
  autotest_traite: 'Auto-test traité'
};
const ACTION_TYPE_ICONS = {
  test: 'fa-vial-circle-check',
  evaluation: 'fa-file-contract',
  suivi_creation: 'fa-heart-pulse',
  suivi_statut: 'fa-rotate',
  rapport_seance: 'fa-pen-to-square',
  autotest_traite: 'fa-clipboard-check'
};

// --- Navigation commune ---
const PSY_NAV_ITEMS = [
  { id: 'accueil', href: 'index.html', icon: 'fa-user-shield', label: 'Évaluation clinique' },
  { id: 'tests', href: 'tests.html', icon: 'fa-vial-circle-check', label: 'Registre des Tests' },
  { id: 'suivis', href: 'suivis.html', icon: 'fa-heart-pulse', label: 'Suivi Psychologique' },
  { id: 'formation', href: 'formation.html', icon: 'fa-graduation-cap', label: 'Formation & Communications' },
  { id: 'procedures', href: 'procedures.html', icon: 'fa-diagram-project', label: 'Procédures' },
  { id: 'tarifs', href: 'tarifs.html', icon: 'fa-coins', label: 'Tarifs' },
  { id: 'referentiel', href: 'referentiel.html', icon: 'fa-book', label: 'Référentiel' },
  { id: 'gerance', href: 'gerance.html', icon: 'fa-users-gear', label: 'Gérance', minRoles: ['gerance_psy', 'seimei'] }
];

// Construit le lien "voir" d'une ligne du journal d'activité (Gérance)
// vers l'élément concerné (test, suivi, évaluation...).
function activityTargetLink(row) {
  if (!row.target_id) return null;
  switch (row.target_table) {
    case 'psy_tests': return `tests.html?openTest=${row.target_id}&source=test`;
    case 'psy_evaluations': return `tests.html?openTest=${row.target_id}&source=evaluation`;
    case 'psy_suivis': return `suivis.html?openSuivi=${row.target_id}`;
    case 'psy_autotests': return 'index.html';
    default: return null;
  }
}

function canSee(item, user) {
  if (!item.minRoles) return true;
  return !!user && item.minRoles.includes(user.role);
}

function renderSidebar(activeId) {
  const el = document.getElementById('psy-sidebar');
  if (!el) return;
  const user = getCurrentUser();
  const itemsHtml = PSY_NAV_ITEMS.filter(it => canSee(it, user)).map(it => `
    <a class="psy-nav-link ${it.id === activeId ? 'active' : ''}" href="${it.href}">
      <i class="fa-solid ${it.icon}"></i> <span>${it.label}</span>
    </a>
  `).join('');

  el.innerHTML = `
    <div class="psy-sidebar-brand">
      <i class="fa-solid fa-staff-snake"></i>
      <span>SEIMEI 葉</span>
    </div>
    <nav class="psy-sidebar-nav">${itemsHtml}</nav>
    ${user ? `
      <div class="psy-sidebar-user">
        <div class="psy-sidebar-user-name">${escapeHtml(user.prenom)} ${escapeHtml(user.nom)}</div>
        <div class="psy-sidebar-user-role role-badge-${user.role}">${ROLE_LABELS[user.role] || user.role}</div>
        <button type="button" class="btn btn-secondary btn-sm" id="psy-logout-btn" style="width:100%; justify-content:center; margin-top:10px;">
          <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
        </button>
      </div>` : ''}
  `;

  const logoutBtn = document.getElementById('psy-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { logoutPsy(); });
}
