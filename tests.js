/* ==========================================================================
   SEIMEI - SUNA : tests.js — Registre des Tests Psychologiques
   Fusionne psy_tests (Kensatsu / Camp de redressement / BDM / Autre) et
   psy_evaluations (entretien clinique complet, barème /52) dans une seule
   vue filtrable.
   ========================================================================== */

let testsState = { rows: [], patients: [] };

function unifyTestRow(r) {
    if (r.__source === 'evaluation') {
        return {
            id: r.id,
            source: 'evaluation',
            patient_nom: r.patient_nom,
            type: 'evaluation',
            typeLabel: 'Entretien clinique complet',
            date: r.date_evaluation || (r.created_at || '').slice(0, 10),
            psy_nom: r.evaluateur,
            statutLabel: r.decision || '—',
            statutClass: '',
            score: `${r.score_final} / ${BAREME.MAX_TOTAL}`,
            motif: null,
            resultat: null,
            piece_jointe_url: null
        };
    }
    return {
        id: r.id,
        source: 'test',
        patient_nom: r.patient_nom,
        type: r.type,
        typeLabel: TEST_TYPE_LABELS[r.type] || r.type,
        date: r.date_passation || (r.created_at || '').slice(0, 10),
        psy_nom: r.psy_nom,
        statutLabel: TEST_STATUT_LABELS[r.statut] || r.statut,
        statutClass: TEST_STATUT_CLASS[r.statut] || '',
        score: null,
        motif: r.motif,
        resultat: r.resultat,
        piece_jointe_url: r.piece_jointe_url
    };
}

async function loadTests() {
    const statusEl = document.getElementById('tests-status');
    const listEl = document.getElementById('tests-list');
    if (!sb) { statusEl.textContent = 'Configuration Supabase absente.'; return; }
    statusEl.textContent = 'Chargement du registre...';
    try {
        const [testsRes, evalRes] = await Promise.all([
            sb.from('psy_tests').select('*').order('date_passation', { ascending: false }).limit(300),
            sb.from('psy_evaluations').select('id, patient_nom, date_evaluation, evaluateur, decision, score_final, created_at').order('created_at', { ascending: false }).limit(300)
        ]);
        if (testsRes.error) throw new Error(testsRes.error.message);
        if (evalRes.error) throw new Error(evalRes.error.message);

        const testsRows = (testsRes.data || []).map(unifyTestRow);
        const evalRows = (evalRes.data || []).map(r => unifyTestRow({ ...r, __source: 'evaluation' }));
        testsState.rows = [...testsRows, ...evalRows].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        renderTests();
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
        testsState.patients = res.data || [];
        const dl = document.getElementById('tests-patient-list');
        if (dl) dl.innerHTML = testsState.patients.map(p => `<option value="${escapeHtml(p.nom)}">`).join('');
    } catch (e) { console.warn('Chargement patients impossible :', e); }
}

function renderTests() {
    const listEl = document.getElementById('tests-list');
    const statusEl = document.getElementById('tests-status');
    const q = document.getElementById('tests-search').value.trim().toLowerCase();
    const typeFilter = document.getElementById('tests-filter-type').value;
    const statutFilter = document.getElementById('tests-filter-statut').value;

    let rows = testsState.rows;
    if (q) rows = rows.filter(r => (r.patient_nom || '').toLowerCase().includes(q));
    if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
    if (statutFilter) rows = rows.filter(r => r.source === 'test' && r.statutLabel === TEST_STATUT_LABELS[statutFilter]);

    statusEl.innerHTML = `<strong>${rows.length}</strong> test(s) affiché(s) sur <strong>${testsState.rows.length}</strong> au total`;

    if (rows.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucun test ne correspond aux filtres.</div>';
        return;
    }

    listEl.innerHTML = rows.map(r => `
        <div class="dossier-card">
            <div class="dossier-head">
                <span class="dossier-name">${escapeHtml(r.patient_nom)}</span>
                <span class="dossier-score ${r.statutClass}">${r.score ? escapeHtml(r.score) : escapeHtml(r.statutLabel)}</span>
            </div>
            <div class="dossier-decision">${escapeHtml(r.typeLabel)}</div>
            <div class="dossier-meta">Le ${formatDateFr(r.date)}${r.psy_nom ? ' — ' + escapeHtml(r.psy_nom) : ''}</div>
            ${r.source === 'test' ? `<div class="dossier-meta">${escapeHtml(r.statutLabel)}</div>` : ''}
            <div class="dossier-actions">
                <button type="button" class="btn btn-secondary btn-sm test-detail-btn" data-id="${r.id}" data-source="${r.source}">
                    <i class="fa-solid fa-eye"></i> Voir le détail
                </button>
            </div>
        </div>
    `).join('');

    listEl.querySelectorAll('.test-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => openTestDetail(btn.dataset.id, btn.dataset.source));
    });
}

function openTestDetail(id, source) {
    const r = testsState.rows.find(x => String(x.id) === String(id) && x.source === source);
    if (!r) return;
    document.getElementById('test-modal-title').textContent = `${r.patient_nom} — ${r.typeLabel}`;

    if (r.source === 'evaluation') {
        document.getElementById('test-modal-body').innerHTML = `
            <p class="detail-text">Cet enregistrement provient de l'outil d'évaluation clinique complète (barème /52).</p>
            <div class="detail-grid">
                <div><span>Date</span><strong>${formatDateFr(r.date)}</strong></div>
                <div><span>Psychologue</span><strong>${escapeHtml(r.psy_nom || '—')}</strong></div>
                <div><span>Score</span><strong>${escapeHtml(r.score)}</strong></div>
                <div><span>Décision</span><strong>${escapeHtml(r.statutLabel)}</strong></div>
            </div>
            <p class="detail-text" style="margin-top:12px;">Pour le détail complet des critères, ouvrez le dossier dans l'<a href="index.html" style="color: var(--sand-primary);">outil d'évaluation clinique</a> (onglet Patients).</p>
        `;
    } else {
        document.getElementById('test-modal-body').innerHTML = `
            <div class="detail-grid">
                <div><span>Type</span><strong>${escapeHtml(r.typeLabel)}</strong></div>
                <div><span>Date</span><strong>${formatDateFr(r.date)}</strong></div>
                <div><span>Psychologue</span><strong>${escapeHtml(r.psy_nom || '—')}</strong></div>
                <div><span>Statut</span><strong>${escapeHtml(r.statutLabel)}</strong></div>
            </div>
            <h4 class="detail-title">Motif</h4>
            <p class="detail-text">${escapeHtml(r.motif || 'Non renseigné')}</p>
            <h4 class="detail-title">Résultat / conclusion</h4>
            <p class="detail-text">${escapeHtml(r.resultat || 'Non renseigné')}</p>
            ${r.piece_jointe_url ? `<h4 class="detail-title">Pièce jointe</h4><p class="detail-text"><a href="${escapeHtml(r.piece_jointe_url)}" target="_blank" rel="noopener" style="color: var(--sand-primary);">${escapeHtml(r.piece_jointe_url)}</a></p>` : ''}
        `;
    }
    document.getElementById('test-modal').classList.add('open');
}

function initNewTestModal() {
    const modal = document.getElementById('modal-new-test');
    const open = () => {
        document.getElementById('new-test-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('new-test-error').textContent = '';
        modal.classList.remove('hidden');
    };
    const close = () => modal.classList.add('hidden');

    document.getElementById('btn-open-new-test').addEventListener('click', open);
    document.getElementById('btn-close-new-test').addEventListener('click', close);
    document.getElementById('btn-cancel-new-test').addEventListener('click', close);

    document.getElementById('btn-save-new-test').addEventListener('click', async () => {
        const errEl = document.getElementById('new-test-error');
        errEl.textContent = '';
        const patientNom = document.getElementById('new-test-patient').value.trim();
        if (!patientNom) { errEl.textContent = 'Le nom du patient est requis.'; return; }
        const user = getCurrentUser();
        const btn = document.getElementById('btn-save-new-test');
        btn.disabled = true;
        try {
            const pr = await sb.rpc('find_or_create_psy_patient', { p_nom: patientNom });
            if (pr.error) throw new Error(pr.error.message);

            const row = {
                patient_id: pr.data,
                patient_nom: patientNom,
                type: document.getElementById('new-test-type').value,
                date_passation: document.getElementById('new-test-date').value || null,
                psy_id: user ? user.id : null,
                psy_nom: user ? `${user.prenom} ${user.nom}` : null,
                motif: document.getElementById('new-test-motif').value.trim() || null,
                resultat: document.getElementById('new-test-resultat').value.trim() || null,
                statut: document.getElementById('new-test-statut').value,
                piece_jointe_url: document.getElementById('new-test-piece').value.trim() || null
            };
            const res = await sb.from('psy_tests').insert([row]);
            if (res.error) throw new Error(res.error.message);

            modal.classList.add('hidden');
            document.getElementById('new-test-patient').value = '';
            document.getElementById('new-test-motif').value = '';
            document.getElementById('new-test-resultat').value = '';
            document.getElementById('new-test-piece').value = '';
            await Promise.all([loadTests(), loadPatientsList()]);
        } catch (e) {
            errEl.textContent = e.message;
        } finally {
            btn.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth(async () => {
        await loadTests();
        loadPatientsList();
        const params = new URLSearchParams(location.search);
        const openId = params.get('openTest');
        const source = params.get('source');
        if (openId && source) openTestDetail(openId, source);
    });

    initNewTestModal();

    let searchTimer = null;
    document.getElementById('tests-search').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderTests, 200);
    });
    document.getElementById('tests-filter-type').addEventListener('change', renderTests);
    document.getElementById('tests-filter-statut').addEventListener('change', renderTests);
    document.getElementById('tests-refresh').addEventListener('click', loadTests);

    document.getElementById('test-modal-close').addEventListener('click', () => document.getElementById('test-modal').classList.remove('open'));
    document.getElementById('test-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });
});
