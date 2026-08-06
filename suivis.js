/* ==========================================================================
   SEIMEI - SUNA : suivis.js — Suivi Psychologique + Rapports de Séance
   ========================================================================== */

let suivisState = { rows: [], patients: [], currentSuivi: null, rapports: [], pendingStatut: null };

function nowIso() { return new Date().toISOString(); }
function currentUserLabel() {
    const u = getCurrentUser();
    return u ? `${u.prenom} ${u.nom}` : '—';
}

async function loadSuivis() {
    const statusEl = document.getElementById('suivis-status');
    const listEl = document.getElementById('suivis-list');
    if (!sb) { statusEl.textContent = 'Configuration Supabase absente.'; return; }
    statusEl.textContent = 'Chargement des suivis...';
    try {
        const res = await sb.from('psy_suivis').select('*').order('updated_at', { ascending: false }).limit(500);
        if (res.error) throw new Error(res.error.message);
        suivisState.rows = res.data || [];
        renderSuivisList();
    } catch (e) {
        console.error(e);
        statusEl.textContent = 'Erreur de chargement : ' + escapeHtml(e.message);
        listEl.innerHTML = '';
    }
}

async function loadPatientsList() {
    if (!sb) return;
    try {
        const res = await sb.from('psy_patients').select('id, nom').order('nom', { ascending: true }).limit(500);
        if (res.error) throw new Error(res.error.message);
        suivisState.patients = res.data || [];
        const dl = document.getElementById('suivis-patient-list');
        if (dl) dl.innerHTML = suivisState.patients.map(p => `<option value="${escapeHtml(p.nom)}">`).join('');
    } catch (e) { console.warn('Chargement patients impossible :', e); }
}

function renderSuivisList() {
    const listEl = document.getElementById('suivis-list');
    const statusEl = document.getElementById('suivis-status');
    const q = document.getElementById('suivis-search').value.trim().toLowerCase();
    const statutFilter = document.getElementById('suivis-filter-statut').value;

    let rows = suivisState.rows;
    if (q) rows = rows.filter(r => (r.patient_nom || '').toLowerCase().includes(q));
    if (statutFilter) rows = rows.filter(r => r.statut === statutFilter);

    const actifs = suivisState.rows.filter(r => r.statut === 'actif').length;
    const pauses = suivisState.rows.filter(r => r.statut === 'pause').length;
    statusEl.innerHTML = `<strong>${rows.length}</strong> suivi(s) affiché(s) · <strong>${actifs}</strong> actif(s) · <strong>${pauses}</strong> en pause`;

    if (rows.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucun suivi ne correspond aux filtres.</div>';
        return;
    }

    listEl.innerHTML = rows.map(r => `
        <div class="dossier-card">
            <div class="dossier-head">
                <span class="dossier-name">${escapeHtml(r.patient_nom)}</span>
                <span class="suivi-badge ${SUIVI_STATUT_CLASS[r.statut] || ''}">${SUIVI_STATUT_LABELS[r.statut] || r.statut}</span>
            </div>
            <div class="dossier-meta">Référent : ${escapeHtml(r.psy_referent_nom || '—')}</div>
            <div class="dossier-meta">Début : ${formatDateFr(r.date_debut)}${r.date_cloture ? ' · Clôturé le ' + formatDateFr(r.date_cloture) : ''}</div>
            <div class="dossier-actions">
                <button type="button" class="btn btn-secondary btn-sm suivi-open-btn" data-id="${r.id}">
                    <i class="fa-solid fa-folder-open"></i> Ouvrir la fiche
                </button>
            </div>
        </div>
    `).join('');

    listEl.querySelectorAll('.suivi-open-btn').forEach(btn => {
        btn.addEventListener('click', () => openSuivi(parseInt(btn.dataset.id)));
    });
}

function switchToListView() {
    document.getElementById('suivi-detail-view').classList.remove('active');
    document.getElementById('suivis-list-view').classList.add('active');
    suivisState.currentSuivi = null;
}

function switchToDetailView() {
    document.getElementById('suivis-list-view').classList.remove('active');
    document.getElementById('suivi-detail-view').classList.add('active');
}

async function openSuivi(id) {
    const r = suivisState.rows.find(x => x.id === id);
    if (!r) return;
    suivisState.currentSuivi = r;
    switchToDetailView();
    renderSuiviDetail();
    await loadRapports(id);
}

function renderSuiviDetail() {
    const r = suivisState.currentSuivi;
    if (!r) return;
    document.getElementById('suivi-detail-name').textContent = r.patient_nom;
    document.getElementById('suivi-detail-badge').innerHTML =
        `<span class="suivi-badge ${SUIVI_STATUT_CLASS[r.statut] || ''}">${SUIVI_STATUT_LABELS[r.statut] || r.statut}</span>`;

    document.getElementById('suivi-detail-info').innerHTML = `
        <div><span>Référent</span><strong>${escapeHtml(r.psy_referent_nom || '—')}</strong></div>
        <div><span>Co-référent</span><strong>${escapeHtml(r.co_referent_nom || '—')}</strong></div>
        <div><span>Fréquence prévue</span><strong>${escapeHtml(r.frequence || '—')}</strong></div>
        <div><span>Date de début</span><strong>${formatDateFr(r.date_debut)}</strong></div>
        <div><span>Date de clôture</span><strong>${r.date_cloture ? formatDateFr(r.date_cloture) : '—'}</strong></div>
        <div><span>Motif d'entrée</span><strong>${escapeHtml(r.motif_entree || '—')}</strong></div>
        ${r.statut === 'pause' && r.motif_pause ? `<div><span>Motif de la pause</span><strong>${escapeHtml(r.motif_pause)}</strong></div>` : ''}
        ${r.statut === 'inactif' && r.motif_cloture ? `<div><span>Motif de clôture</span><strong>${escapeHtml(r.motif_cloture)}</strong></div>` : ''}
    `;

    const historique = Array.isArray(r.historique_statuts) ? r.historique_statuts : [];
    const histoHtml = [...historique].reverse().map(h => `
        <li>
            <span>${SUIVI_STATUT_LABELS[h.statut] || h.statut}${h.motif ? ' — ' + escapeHtml(h.motif) : ''}</span>
            <strong>${formatDateTimeFr(h.date)} · ${escapeHtml(h.par || '—')}</strong>
        </li>
    `).join('');
    document.getElementById('suivi-detail-historique').innerHTML = histoHtml || '<li><em>Aucun historique</em></li>';

    // Boutons de statut : on désactive celui déjà actif
    ['actif', 'pause', 'inactif'].forEach(s => {
        const btn = document.getElementById(`btn-statut-${s}`);
        if (btn) btn.disabled = (r.statut === s);
    });
}

function openStatutModal(statut) {
    suivisState.pendingStatut = statut;
    const titles = { actif: 'Réactiver le suivi', pause: 'Mettre le suivi en pause', inactif: 'Clôturer le suivi' };
    document.getElementById('modal-statut-title').textContent = titles[statut] || 'Changer le statut';
    const motifLabel = document.getElementById('modal-statut-motif-label');
    const motifInput = document.getElementById('statut-motif');
    motifInput.value = '';
    document.getElementById('modal-statut-error').textContent = '';
    motifLabel.textContent = statut === 'pause' ? 'Motif de la mise en pause (obligatoire)'
        : statut === 'inactif' ? 'Motif de clôture (obligatoire)'
        : 'Note (optionnelle)';
    document.getElementById('modal-statut-change').classList.remove('hidden');
}

async function confirmStatutChange() {
    const statut = suivisState.pendingStatut;
    const motif = document.getElementById('statut-motif').value.trim();
    const errEl = document.getElementById('modal-statut-error');
    if ((statut === 'pause' || statut === 'inactif') && !motif) {
        errEl.textContent = 'Le motif est obligatoire pour ce changement de statut.';
        return;
    }
    const r = suivisState.currentSuivi;
    if (!r) return;

    const historique = Array.isArray(r.historique_statuts) ? r.historique_statuts : [];
    historique.push({ statut, date: nowIso(), par: currentUserLabel(), motif: motif || null });

    const patch = {
        statut,
        historique_statuts: historique,
        updated_at: nowIso(),
        motif_pause: statut === 'pause' ? motif : (statut === 'actif' ? null : r.motif_pause),
        motif_cloture: statut === 'inactif' ? motif : r.motif_cloture,
        date_cloture: statut === 'inactif' ? new Date().toISOString().split('T')[0] : (statut === 'actif' ? null : r.date_cloture)
    };

    try {
        const res = await sb.from('psy_suivis').update(patch).eq('id', r.id).select('*').single();
        if (res.error) throw new Error(res.error.message);
        suivisState.currentSuivi = res.data;
        const idx = suivisState.rows.findIndex(x => x.id === r.id);
        if (idx >= 0) suivisState.rows[idx] = res.data;
        document.getElementById('modal-statut-change').classList.add('hidden');
        renderSuiviDetail();
    } catch (e) {
        errEl.textContent = e.message;
    }
}

async function loadRapports(suiviId) {
    const listEl = document.getElementById('rapports-list');
    listEl.innerHTML = '<p class="detail-text">Chargement...</p>';
    try {
        const res = await sb.from('psy_rapports_seance').select('*').eq('suivi_id', suiviId).order('date_seance', { ascending: false });
        if (res.error) throw new Error(res.error.message);
        suivisState.rapports = res.data || [];
        renderRapports();
    } catch (e) {
        listEl.innerHTML = `<p class="detail-text" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</p>`;
    }
}

function renderRapports() {
    const listEl = document.getElementById('rapports-list');
    const rapports = suivisState.rapports;

    if (rapports.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucun rapport de séance pour ce suivi.</div>';
        return;
    }

    const lastAlert = rapports.find(r => r.niveau_risque === 'preoccupant' || r.niveau_risque === 'urgent');
    const alertHtml = lastAlert ? `
        <div class="alert alert-info" style="border-color: var(--status-red); margin-bottom: 14px;">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span><strong>Vigilance :</strong> risque « ${escapeHtml(RISQUE_LABELS[lastAlert.niveau_risque])} » relevé le ${formatDateFr(lastAlert.date_seance)}.</span>
        </div>` : '';

    listEl.innerHTML = alertHtml + rapports.map(r => `
        <div class="doc-list-item">
            <div class="dossier-head">
                <h3 style="margin:0;">Séance du ${formatDateFr(r.date_seance)}${r.duree_minutes ? ' — ' + r.duree_minutes + ' min' : ''}</h3>
                <span class="risque-badge ${RISQUE_CLASS[r.niveau_risque] || ''}">${RISQUE_LABELS[r.niveau_risque] || r.niveau_risque}</span>
            </div>
            <div class="dossier-meta">Par ${escapeHtml(r.psy_nom || '—')} · Humeur : ${escapeHtml(HUMEUR_LABELS[r.humeur] || '—')}</div>
            ${r.coherence_discours ? `<p class="detail-text" style="margin-top:6px;"><em>Cohérence du discours :</em> ${escapeHtml(r.coherence_discours)}</p>` : ''}
            ${r.resume ? `<p class="detail-text" style="margin-top:6px;"><strong>Résumé :</strong> ${escapeHtml(r.resume)}</p>` : ''}
            ${r.objectifs_abordes ? `<p class="detail-text" style="margin-top:6px;"><strong>Objectifs abordés :</strong> ${escapeHtml(r.objectifs_abordes)}</p>` : ''}
            ${r.recommandations ? `<p class="detail-text" style="margin-top:6px;"><strong>Recommandations :</strong> ${escapeHtml(r.recommandations)}</p>` : ''}
            ${r.prochaine_seance ? `<p class="detail-text" style="margin-top:6px;"><strong>Prochaine séance :</strong> ${formatDateFr(r.prochaine_seance)}</p>` : ''}
        </div>
    `).join('');
}

function initNewSuiviModal() {
    const modal = document.getElementById('modal-new-suivi');
    document.getElementById('btn-open-new-suivi').addEventListener('click', () => {
        document.getElementById('new-suivi-date-debut').value = new Date().toISOString().split('T')[0];
        document.getElementById('new-suivi-referent').value = currentUserLabel();
        document.getElementById('new-suivi-error').textContent = '';
        modal.classList.remove('hidden');
    });
    document.getElementById('btn-close-new-suivi').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btn-cancel-new-suivi').addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('btn-save-new-suivi').addEventListener('click', async () => {
        const errEl = document.getElementById('new-suivi-error');
        errEl.textContent = '';
        const patientNom = document.getElementById('new-suivi-patient').value.trim();
        if (!patientNom) { errEl.textContent = 'Le nom du patient est requis.'; return; }
        const user = getCurrentUser();
        const btn = document.getElementById('btn-save-new-suivi');
        btn.disabled = true;
        try {
            const pr = await sb.rpc('find_or_create_psy_patient', { p_nom: patientNom });
            if (pr.error) throw new Error(pr.error.message);

            const referentNom = document.getElementById('new-suivi-referent').value.trim() || currentUserLabel();
            const row = {
                patient_id: pr.data,
                patient_nom: patientNom,
                psy_referent_id: user ? user.id : null,
                psy_referent_nom: referentNom,
                co_referent_nom: document.getElementById('new-suivi-coreferent').value.trim() || null,
                motif_entree: document.getElementById('new-suivi-motif').value.trim() || null,
                frequence: document.getElementById('new-suivi-frequence').value.trim() || null,
                statut: 'actif',
                date_debut: document.getElementById('new-suivi-date-debut').value || null,
                historique_statuts: [{ statut: 'actif', date: nowIso(), par: currentUserLabel(), motif: 'Ouverture du suivi' }]
            };
            const res = await sb.from('psy_suivis').insert([row]);
            if (res.error) throw new Error(res.error.message);

            modal.classList.add('hidden');
            ['new-suivi-patient', 'new-suivi-coreferent', 'new-suivi-motif', 'new-suivi-frequence'].forEach(id => document.getElementById(id).value = '');
            await Promise.all([loadSuivis(), loadPatientsList()]);
        } catch (e) {
            errEl.textContent = e.message;
        } finally {
            btn.disabled = false;
        }
    });
}

function initNewRapportModal() {
    const modal = document.getElementById('modal-new-rapport');
    document.getElementById('btn-open-new-rapport').addEventListener('click', () => {
        if (!suivisState.currentSuivi) return;
        document.getElementById('new-rapport-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('new-rapport-error').textContent = '';
        modal.classList.remove('hidden');
    });
    document.getElementById('btn-close-new-rapport').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btn-cancel-new-rapport').addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('btn-save-new-rapport').addEventListener('click', async () => {
        const errEl = document.getElementById('new-rapport-error');
        errEl.textContent = '';
        const r = suivisState.currentSuivi;
        if (!r) return;
        const user = getCurrentUser();
        const btn = document.getElementById('btn-save-new-rapport');
        btn.disabled = true;
        try {
            const row = {
                suivi_id: r.id,
                patient_id: r.patient_id,
                patient_nom: r.patient_nom,
                psy_id: user ? user.id : null,
                psy_nom: currentUserLabel(),
                date_seance: document.getElementById('new-rapport-date').value || null,
                duree_minutes: parseInt(document.getElementById('new-rapport-duree').value) || null,
                humeur: document.getElementById('new-rapport-humeur').value,
                niveau_risque: document.getElementById('new-rapport-risque').value,
                coherence_discours: document.getElementById('new-rapport-coherence').value.trim() || null,
                resume: document.getElementById('new-rapport-resume').value.trim() || null,
                objectifs_abordes: document.getElementById('new-rapport-objectifs').value.trim() || null,
                recommandations: document.getElementById('new-rapport-recommandations').value.trim() || null,
                prochaine_seance: document.getElementById('new-rapport-prochaine').value || null
            };
            const res = await sb.from('psy_rapports_seance').insert([row]);
            if (res.error) throw new Error(res.error.message);

            modal.classList.add('hidden');
            ['new-rapport-coherence', 'new-rapport-resume', 'new-rapport-objectifs', 'new-rapport-recommandations', 'new-rapport-prochaine'].forEach(id => document.getElementById(id).value = '');
            await loadRapports(r.id);
        } catch (e) {
            errEl.textContent = e.message;
        } finally {
            btn.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth(async () => {
        await loadSuivis();
        loadPatientsList();
        const openId = new URLSearchParams(location.search).get('openSuivi');
        if (openId) openSuivi(parseInt(openId));
    });

    initNewSuiviModal();
    initNewRapportModal();

    let searchTimer = null;
    document.getElementById('suivis-search').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderSuivisList, 200);
    });
    document.getElementById('suivis-filter-statut').addEventListener('change', renderSuivisList);
    document.getElementById('suivis-refresh').addEventListener('click', loadSuivis);
    document.getElementById('btn-back-to-list').addEventListener('click', switchToListView);

    ['actif', 'pause', 'inactif'].forEach(s => {
        document.getElementById(`btn-statut-${s}`).addEventListener('click', () => openStatutModal(s));
    });
    document.getElementById('btn-close-statut-modal').addEventListener('click', () => document.getElementById('modal-statut-change').classList.add('hidden'));
    document.getElementById('btn-cancel-statut-modal').addEventListener('click', () => document.getElementById('modal-statut-change').classList.add('hidden'));
    document.getElementById('btn-confirm-statut-modal').addEventListener('click', confirmStatutChange);
});
