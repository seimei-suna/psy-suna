/* ==========================================================================
   SEIMEI - SUNA : gerance.js — Membres de la branche & suivi d'activité
   La fiche d'un membre (activité jour par jour) est une vraie page,
   accessible via gerance.html?membre=<id> — navigation réelle (URL,
   bouton retour du navigateur), pas un panneau qui s'affiche en JS.
   L'activité n'est jamais saisie ici : elle est uniquement lue depuis
   psy_activity_log, alimentée automatiquement par les triggers Postgres.
   ========================================================================== */

let geranceState = { membres: [], currentMembre: null, activity: [] };

function getMembreIdFromUrl() {
    return new URLSearchParams(location.search).get('membre');
}

async function loadMembres() {
    if (!sb) return;
    try {
        const res = await sb.from('psy_membres').select('*').order('nom', { ascending: true });
        if (res.error) throw new Error(res.error.message);
        geranceState.membres = res.data || [];
        renderMembres();
    } catch (e) {
        console.error(e);
    }
}

function membreRowHtml(m) {
    return `
        <div class="membre-row" data-id="${m.id}">
            <div class="membre-row-info">
                <span class="membre-row-name">${escapeHtml(m.prenom)} ${escapeHtml(m.nom)}</span>
                <div class="membre-row-tags">
                    <span class="role-badge-${m.role}">${ROLE_LABELS[m.role] || m.role}</span>
                    <span class="categorie-badge">${CATEGORIE_LABELS[m.categorie] || m.categorie}</span>
                    <span class="categorie-badge">${STATUT_MEMBRE_LABELS[m.statut] || m.statut}</span>
                    ${m.camp_redressement_affilie ? '<span class="categorie-badge" style="color:var(--gold);"><i class="fa-solid fa-shield-halved"></i> Camp de redressement</span>' : ''}
                </div>
            </div>
            <div class="membre-row-actions">
                <button type="button" class="btn btn-secondary btn-sm mc-role-btn" data-id="${m.id}" data-role="psychologue" title="Psychologue">Psy</button>
                <button type="button" class="btn btn-secondary btn-sm mc-role-btn" data-id="${m.id}" data-role="gerance_psy" title="Gérance Branche Psy">Gérance</button>
                <button type="button" class="btn btn-secondary btn-sm mc-role-btn" data-id="${m.id}" data-role="seimei" title="Seimei">Seimei</button>
                <button type="button" class="btn btn-secondary btn-sm mc-role-btn" data-id="${m.id}" data-role="fudan_sho" title="Fudan Shō — accès aux résultats Camp de Redressement uniquement">Fudan Shō</button>
                <button type="button" class="btn btn-secondary btn-sm mc-cat-btn" data-id="${m.id}" data-cat="${m.categorie === 'seimei_medical_psy' ? 'branche_psy_uniquement' : 'seimei_medical_psy'}" title="Basculer la catégorie">
                    <i class="fa-solid fa-repeat"></i>
                </button>
                <button type="button" class="btn btn-secondary btn-sm mc-camp-btn" data-id="${m.id}" data-camp="${m.camp_redressement_affilie ? 'false' : 'true'}" title="Affilier / retirer du Camp de redressement">
                    <i class="fa-solid fa-shield-halved"></i> ${m.camp_redressement_affilie ? 'Retirer' : 'Affilier'}
                </button>
                ${m.statut === 'actif'
                    ? `<button type="button" class="btn btn-danger btn-sm mc-statut-btn" data-id="${m.id}" data-statut="inactif">Désactiver</button>`
                    : `<button type="button" class="btn btn-primary btn-sm mc-statut-btn" data-id="${m.id}" data-statut="actif">Activer</button>`}
            </div>
        </div>
    `;
}

function renderMembres() {
    const q = (document.getElementById('gerance-search').value || '').trim().toLowerCase();
    const matches = m => !q || `${m.prenom} ${m.nom}`.toLowerCase().includes(q);

    const enAttente = geranceState.membres.filter(m => m.statut === 'en_attente' && matches(m));
    const seimei = geranceState.membres.filter(m => m.statut !== 'en_attente' && m.categorie === 'seimei_medical_psy' && matches(m));
    const branche = geranceState.membres.filter(m => m.statut !== 'en_attente' && m.categorie === 'branche_psy_uniquement' && matches(m));

    document.getElementById('gerance-en-attente-card').classList.toggle('hidden', enAttente.length === 0);
    document.getElementById('gerance-en-attente-list').innerHTML = enAttente.map(membreRowHtml).join('');
    document.getElementById('gerance-groupe-seimei').innerHTML = seimei.map(membreRowHtml).join('') || '<div class="dossiers-empty">Aucun membre.</div>';
    document.getElementById('gerance-groupe-branche').innerHTML = branche.map(membreRowHtml).join('') || '<div class="dossiers-empty">Aucun membre.</div>';

    bindMembreRowEvents();
}

function bindMembreRowEvents() {
    document.querySelectorAll('.membre-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            location.href = 'gerance.html?membre=' + encodeURIComponent(row.dataset.id);
        });
    });
    document.querySelectorAll('.mc-role-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); updateMembreField(btn.dataset.id, { role: btn.dataset.role }); });
    });
    document.querySelectorAll('.mc-cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); updateMembreField(btn.dataset.id, { categorie: btn.dataset.cat }); });
    });
    document.querySelectorAll('.mc-camp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); updateMembreField(btn.dataset.id, { camp_redressement_affilie: btn.dataset.camp === 'true' }); });
    });
    document.querySelectorAll('.mc-statut-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); updateMembreField(btn.dataset.id, { statut: btn.dataset.statut }); });
    });
}

async function updateMembreField(id, patch) {
    try {
        const res = await sb.from('psy_membres').update(patch).eq('id', id);
        if (res.error) throw new Error(res.error.message);
        await loadMembres();
    } catch (e) {
        alert('Mise à jour impossible : ' + e.message);
    }
}

// --- Vue fiche membre (gerance.html?membre=ID) ---

async function loadMembreDetail(id) {
    document.getElementById('gerance-list-view').classList.remove('active');
    document.getElementById('gerance-detail-view').classList.add('active');

    try {
        const res = await sb.from('psy_membres').select('*').eq('id', id).single();
        if (res.error) throw new Error(res.error.message);
        geranceState.currentMembre = res.data;
    } catch (e) {
        document.getElementById('gerance-detail-name').textContent = 'Membre introuvable';
        return;
    }

    const m = geranceState.currentMembre;
    document.getElementById('gerance-detail-name').textContent = `${m.prenom} ${m.nom}`;
    document.getElementById('gerance-detail-badges').innerHTML = `
        <span class="role-badge-${m.role}">${ROLE_LABELS[m.role] || m.role}</span>
        <span class="categorie-badge" style="margin-left:6px;">${CATEGORIE_LABELS[m.categorie] || m.categorie}</span>
    `;

    await loadActivity();
}

async function loadActivity() {
    const m = geranceState.currentMembre;
    if (!m) return;
    const logEl = document.getElementById('gerance-activity-log');
    const summaryEl = document.getElementById('gerance-activity-summary');
    logEl.innerHTML = '<p class="detail-text">Chargement...</p>';

    const days = parseInt(document.getElementById('gerance-activity-period').value);
    try {
        let query = sb.from('psy_activity_log').select('*').eq('membre_id', m.id).order('created_at', { ascending: false }).limit(500);
        if (days > 0) {
            const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
            query = query.gte('created_at', cutoff);
        }
        const res = await query;
        if (res.error) throw new Error(res.error.message);
        geranceState.activity = res.data || [];

        const today = new Date().toISOString().slice(0, 10);
        const todayCount = geranceState.activity.filter(r => (r.created_at || '').slice(0, 10) === today).length;
        summaryEl.innerHTML = `<strong>${geranceState.activity.length}</strong> action(s) sur la période · <strong>${todayCount}</strong> aujourd'hui`;

        renderActivity();
    } catch (e) {
        logEl.innerHTML = `<p class="detail-text" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</p>`;
    }
}

function renderActivity() {
    const logEl = document.getElementById('gerance-activity-log');
    const rows = geranceState.activity;

    if (rows.length === 0) {
        logEl.innerHTML = '<div class="dossiers-empty">Aucune activité sur la période sélectionnée.</div>';
        return;
    }

    const byDay = {};
    rows.forEach(r => {
        const day = (r.created_at || '').slice(0, 10);
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(r);
    });

    const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));
    const todayStr = new Date().toISOString().slice(0, 10);

    logEl.innerHTML = days.map(day => {
        const dayLabel = day === todayStr ? "Aujourd'hui" : formatDateFr(day);
        const rowsHtml = byDay[day].map(r => {
            const link = activityTargetLink(r);
            const time = new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="activity-row">
                    <div class="activity-row-icon"><i class="fa-solid ${ACTION_TYPE_ICONS[r.action_type] || 'fa-circle'}"></i></div>
                    <div class="activity-row-body">
                        <div class="activity-row-title">${escapeHtml(ACTION_TYPE_LABELS[r.action_type] || r.action_type)}${r.patient_nom ? ' — ' + escapeHtml(r.patient_nom) : ''}</div>
                        <div class="activity-row-meta">${escapeHtml(r.resume || '')} ${link ? `· <a href="${link}" style="color: var(--sand-primary);">Voir</a>` : ''}</div>
                    </div>
                    <div class="activity-row-time">${time}</div>
                </div>
            `;
        }).join('');
        return `<div class="activity-day-group"><div class="activity-day-label">${dayLabel}</div>${rowsHtml}</div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth((user) => {
        if (!requireRole(user, ['gerance_psy', 'seimei'])) return;

        const membreId = getMembreIdFromUrl();
        if (membreId) {
            loadMembreDetail(membreId);
        } else {
            document.getElementById('gerance-list-view').classList.add('active');
            loadMembres();
        }
    });

    document.getElementById('gerance-search').addEventListener('input', renderMembres);
    document.getElementById('gerance-search-btn').addEventListener('click', renderMembres);
    document.getElementById('gerance-activity-period').addEventListener('change', loadActivity);
});
