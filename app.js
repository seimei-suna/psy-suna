/* ==========================================================================
   SEIMEI - SUNA: RÉFÉRENTIEL CLINIQUE D'ÉVALUATION PSYCHOLOGIQUE
   Application Logic & State Management (Connected to 100 Scenarios Bank)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DATABASES & CONSTANTS
    // CRITERIA_DATA, RATING_LEVELS, BAREME, MALUS_DATA, BONUS_DATA et
    // DECISIONS viennent du référentiel partagé data.js (chargé avant ce
    // fichier) — ne pas les redéclarer ici, sous peine de désynchronisation
    // avec l'auto-test patient et la page de référence gérance.
    // ==========================================

    const SCENARIOS_BANK = (typeof FULL_100_SCENARIOS_BANK !== 'undefined') ? FULL_100_SCENARIOS_BANK : [];

    // ==========================================
    // 2. APPLICATION STATE
    // ==========================================

    let appState = {
        patient: {
            name: '',
            unit: '',
            grade: 'Chunin',
            age: 19,
            gender: 'M',
            evalDate: new Date().toISOString().split('T')[0],
            evaluator: 'Dr. SEIMEI'
        },
        qualitativeObs: {
            comm: true,
            coher: true,
            emotions: true,
            corporel: true,
            sincerite: true,
            silences: false,
            sensibles: false
        },
        activeScenarios: [],
        criteriaScores: {},   // { 1: 5, 2: 3, ... } — 0 à 5 points par critère
        scenarioScores: {},   // { 'sc-12': 2, ... } — 0 à 3 points par mise en situation
        firstImpression: 0,   // première impression clinique : -1, 0 ou +1
        selectedMalus: [],
        selectedBonus: [],
        customAdjustments: [],
        malusJustification: '',
        bonusJustification: '',
        viewIsShinobi: false,
        evaluationsHistory: []
    };

    // Valeur par défaut : « Moyen » (3/5) — l'évaluateur doit se prononcer
    CRITERIA_DATA.forEach(c => {
        appState.criteriaScores[c.id] = 3;
    });

    // 3 mises en situation tirées au sort dans la banque
    selectRandomScenarios(BAREME.NB_SCENARIOS);

    // Load History from LocalStorage if available
    loadHistoryFromStorage();

    // Set today's date in form
    document.getElementById('eval-date').value = appState.patient.evalDate;

    // Pré-remplit le psychologue évaluateur avec le compte connecté (auth.js)
    const loggedInPsy = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (loggedInPsy) {
        appState.patient.evaluator = `${loggedInPsy.prenom} ${loggedInPsy.nom}`;
        const evaluatorInput = document.getElementById('evaluator-name');
        if (evaluatorInput) evaluatorInput.value = appState.patient.evaluator;
    }

    // Helper for formatting score out of 10
    function formatScoreOutOf10(val) {
        if (val > 0) return `+${val} / 10`;
        if (val < 0) return `${val} / 10`;
        return `0 / 10`;
    }

    // ==========================================
    // 3. UI RENDERING FUNCTIONS
    // ==========================================

    function renderCriteriaSection() {
        const container = document.getElementById('criteria-cards-container');
        if (!container) return;

        container.innerHTML = CRITERIA_DATA.map(c => {
            const currentVal = appState.criteriaScores[c.id] ?? 3;
            const subItemsHtml = c.subItems.map(item => `<li><i class="fa-solid fa-check-double"></i> ${item}</li>`).join('');
            const buttonsHtml = RATING_LEVELS.map(lvl => `
                <button type="button" class="rate-btn ${lvl.cls} ${currentVal === lvl.pts ? 'selected' : ''}"
                        data-pts="${lvl.pts}" data-id="${c.id}" title="${lvl.desc}">
                    <span>${lvl.label}</span>
                    <span class="pts">${lvl.pts} / 5</span>
                </button>
            `).join('');

            return `
                <div class="criterion-card" data-id="${c.id}">
                    <div class="criterion-header">
                        <div class="criterion-number-title">
                            <span class="criterion-num">${c.id}</span>
                            <div>
                                <h3 class="criterion-name">${c.title}</h3>
                                <p class="criterion-desc">${c.desc}</p>
                            </div>
                        </div>
                        <div class="criterion-rating-buttons">
                            ${buttonsHtml}
                        </div>
                    </div>
                    <ul class="thresholds-reference-table" style="margin-top: 6px; opacity: 0.85;">
                        <li style="padding: 4px 8px; font-size: 12px; background: transparent; border: none; flex-wrap: wrap; gap: 15px;">
                            ${subItemsHtml}
                        </li>
                    </ul>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                appState.criteriaScores[id] = parseInt(btn.getAttribute('data-pts'));
                renderCriteriaSection();
                updateCalculations();
            });
        });
    }

    function renderScenariosSection() {
        const container = document.getElementById('active-scenarios-container');
        const countBadge = document.getElementById('scenarios-count');
        const filterSelect = document.getElementById('filter-scenario-cat');
        if (!container) return;

        const catFilter = filterSelect ? filterSelect.value : 'all';
        let scenariosToDisplay = appState.activeScenarios;

        if (catFilter !== 'all') {
            scenariosToDisplay = scenariosToDisplay.filter(s => s.category === catFilter);
        }

        countBadge.textContent = `${appState.activeScenarios.length} scénario(s) tiré(s) (Banque de ${SCENARIOS_BANK.length} scénarios)`;

        container.innerHTML = scenariosToDisplay.map(sc => {
            const val = appState.scenarioScores[sc.id] ?? 0;
            const notesHtml = [0, 1, 2, 3].map(n => `
                <button type="button" class="scenario-rate-btn ${val === n ? 'selected' : ''}"
                        data-sc="${sc.id}" data-pts="${n}">${n}</button>
            `).join('');
            return `
            <div class="scenario-card">
                <div>
                    <span class="scenario-category">${sc.category}</span>
                    <h3 class="scenario-title" style="margin-top: 6px;">${sc.title}</h3>
                    <p class="scenario-desc" style="margin-top: 8px;">${sc.desc}</p>
                    ${sc.attendu ? `<div class="scenario-expected"><strong><i class="fa-solid fa-clipboard-check"></i> Réponse attendue :</strong> ${sc.attendu}</div>` : ''}
                </div>
                <div class="scenario-eval-tips">
                    <strong><i class="fa-solid fa-microscope"></i> Diagnostic évaluateur :</strong> ${sc.evalTips}
                </div>
                <div class="scenario-scoring">
                    <span class="scenario-scoring-label"><i class="fa-solid fa-star-half-stroke"></i> Note de la mise en situation</span>
                    <div class="scenario-rate-group">${notesHtml}<span class="scenario-rate-max">/ 3</span></div>
                </div>
            </div>
        `;
        }).join('');

        container.querySelectorAll('.scenario-rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                appState.scenarioScores[btn.getAttribute('data-sc')] = parseInt(btn.getAttribute('data-pts'));
                renderScenariosSection();
                updateCalculations();
            });
        });
    }

    function renderDiagnosticsSection() {
        const renderPills = (list, containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = list.map(item => {
                const isSelected = appState.selectedMalus.includes(item.id);
                return `
                    <div class="diag-pill ${isSelected ? 'selected' : ''}" data-id="${item.id}">
                        ${item.label} (-${item.pts} pts)
                    </div>
                `;
            }).join('');

            container.querySelectorAll('.diag-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    const id = pill.getAttribute('data-id');
                    if (appState.selectedMalus.includes(id)) {
                        appState.selectedMalus = appState.selectedMalus.filter(m => m !== id);
                    } else {
                        appState.selectedMalus.push(id);
                    }
                    renderDiagnosticsSection();
                    updateCalculations();
                });
            });
        };

        renderPills(MALUS_DATA.light, 'diag-light-options');
        renderPills(MALUS_DATA.moderate, 'diag-moderate-options');
        renderPills(MALUS_DATA.severe, 'diag-severe-options');

        // Render Bonus List
        const bonusContainer = document.getElementById('bonus-options');
        if (bonusContainer) {
            bonusContainer.innerHTML = BONUS_DATA.map(b => {
                const isSelected = appState.selectedBonus.includes(b.id);
                return `
                    <div class="bonus-pill ${isSelected ? 'selected' : ''}" data-id="${b.id}">
                        <div>
                            <strong>${b.label}</strong>
                            <div style="font-size: 12px; opacity: 0.8;">${b.desc}</div>
                        </div>
                        <span class="highlight-pos">+${b.pts} pts</span>
                    </div>
                `;
            }).join('');

            bonusContainer.querySelectorAll('.bonus-pill').forEach(pill => {
                pill.addEventListener('click', () => {
                    const id = pill.getAttribute('data-id');
                    if (appState.selectedBonus.includes(id)) {
                        appState.selectedBonus = appState.selectedBonus.filter(b => b !== id);
                    } else {
                        appState.selectedBonus.push(id);
                    }
                    renderDiagnosticsSection();
                    updateCalculations();
                });
            });
        }

        renderCustomAdjustmentsList();
    }

    function renderCustomAdjustmentsList() {
        const container = document.getElementById('custom-adjustments-list');
        if (!container) return;

        if (appState.customAdjustments.length === 0) {
            container.innerHTML = `<div style="font-size: 13px; opacity: 0.6; font-style: italic;">Aucun ajustement personnalisé "Autre" ajouté pour le moment.</div>`;
            return;
        }

        container.innerHTML = appState.customAdjustments.map(adj => {
            const isAdd = adj.type === 'add';
            return `
                <div class="bonus-pill" style="margin-bottom: 8px; border-color: ${isAdd ? 'var(--status-green)' : 'var(--status-red)'};">
                    <div>
                        <strong style="color: ${isAdd ? '#abebc6' : '#ff8a80'};">
                            <i class="fa-solid ${isAdd ? 'fa-plus' : 'fa-minus'}"></i> ${adj.label}
                        </strong>
                        <span style="font-size: 12px; opacity: 0.7; margin-left: 8px;">(${isAdd ? 'Bonus Autre' : 'Malus Autre'})</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="${isAdd ? 'highlight-pos' : 'highlight-neg'}" style="font-weight: 700;">
                            ${isAdd ? '+' : '-'}${adj.pts} pts
                        </span>
                        <button type="button" class="btn btn-danger btn-sm del-adj-btn" data-id="${adj.id}" style="padding: 4px 8px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.del-adj-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                appState.customAdjustments = appState.customAdjustments.filter(a => a.id !== id);
                renderCustomAdjustmentsList();
                updateCalculations();
            });
        });
    }

    // ==========================================
    // 4. SCORING & DECISION CALCULATOR
    // ==========================================

    function calculateScores() {
        // 8 critères × 5 points = 40 points maximum
        let criteriaTotal = 0;
        Object.values(appState.criteriaScores).forEach(val => { criteriaTotal += val; });
        criteriaTotal = Math.max(0, Math.min(BAREME.MAX_CRITERIA, criteriaTotal));

        // 3 mises en situation × 3 points = 9 points maximum
        let scenariosTotal = 0;
        appState.activeScenarios.forEach(sc => {
            scenariosTotal += appState.scenarioScores[sc.id] ?? 0;
        });
        scenariosTotal = Math.max(0, Math.min(BAREME.MAX_SCENARIOS, scenariosTotal));

        // Première impression clinique : -1 / 0 / +1
        const impressionTotal = Math.max(-1, Math.min(1, appState.firstImpression ?? 0));

        // Malus diagnostiques (cumulables) : -2 / -4 / -6
        let malusTotal = 0;
        const allMalusItems = [...MALUS_DATA.light, ...MALUS_DATA.moderate, ...MALUS_DATA.severe];
        appState.selectedMalus.forEach(id => {
            const found = allMalusItems.find(m => m.id === id);
            if (found) malusTotal += found.pts;
        });

        // Bonus cliniques : +1 chacun, plafonnés à +2
        let rawBonus = 0;
        appState.selectedBonus.forEach(id => {
            const found = BONUS_DATA.find(b => b.id === id);
            if (found) rawBonus += found.pts;
        });
        const bonusTotal = Math.min(BAREME.MAX_BONUS, rawBonus);

        // Ajustements « Autre » (hors référentiel, à justifier)
        let customAdjustmentsTotal = 0;
        appState.customAdjustments.forEach(adj => {
            customAdjustmentsTotal += (adj.type === 'add') ? adj.pts : -adj.pts;
        });

        // 6.3 — (Critères) + (Mises en situation) + (Impression) + (Bonus) - (Malus)
        const rawFinal = criteriaTotal + scenariosTotal + impressionTotal
                       + bonusTotal - malusTotal + customAdjustmentsTotal;
        const finalScore = Math.max(0, Math.min(BAREME.MAX_TOTAL, rawFinal));

        // Décision déterminée via le référentiel partagé (data.js)
        const decision = getDecisionForScore(finalScore);

        return {
            criteriaTotal,
            scenariosTotal,
            impressionTotal,
            malusTotal,
            bonusTotal,
            customAdjustmentsTotal,
            finalScore,
            decision
        };
    }

    function updateCalculations() {
        const scores = calculateScores();

        // Update Tab 3 summary
        document.getElementById('bareme-score-display').textContent = `${scores.criteriaTotal} / 40 pts`;
        document.getElementById('bareme-progress').style.width = `${(scores.criteriaTotal / 40) * 100}%`;
        document.getElementById('bareme-status-text').textContent = scores.criteriaTotal >= 30 ? "Évaluation solide" : "Point d'attention clinique";

        // Score circle & breakdown
        document.getElementById('final-score-val').textContent = scores.finalScore;
        document.getElementById('breakdown-crit-val').textContent = `${scores.criteriaTotal} / ${BAREME.MAX_CRITERIA} pts`;
        const scEl = document.getElementById('breakdown-scenarios-val');
        if (scEl) scEl.textContent = `+${scores.scenariosTotal} / ${BAREME.MAX_SCENARIOS} pts`;
        const impEl = document.getElementById('breakdown-impression-val');
        if (impEl) impEl.textContent = `${scores.impressionTotal >= 0 ? '+' : ''}${scores.impressionTotal} pt`;
        document.getElementById('breakdown-total-val').textContent = `${scores.finalScore} / ${BAREME.MAX_TOTAL}`;

        // Update decision card
        const badge = document.getElementById('decision-badge');
        badge.className = `decision-status-badge ${scores.decision.statusClass}`;
        badge.textContent = scores.decision.title;

        document.getElementById('decision-title').textContent = scores.decision.title;
        document.getElementById('decision-description').textContent = scores.decision.description;

        // Render printable report
        renderPrintableReport();
    }

    // ==========================================
    // HISTORIQUE PATIENTS (base partagée Supabase)
    // ==========================================
    // Client Supabase partagé (créé une seule fois dans common-psy.js) —
    // évite l'avertissement "Multiple GoTrueClient instances" et garantit
    // une session cohérente sur toute la page.
    const sb = (typeof window.sb !== 'undefined') ? window.sb : null;

    let dossiersState = { rows: [], loading: false, seq: 0 };
    let dossiersSearchTimer = null;

    function escapeHtml(t) {
        const d = document.createElement('div');
        d.textContent = t == null ? '' : t;
        return d.innerHTML;
    }

    function setDossiersStatus(html, isError) {
        const el = document.getElementById('dossiers-status');
        if (!el) return;
        el.innerHTML = html;
        el.classList.toggle('is-error', !!isError);
    }

    // Enregistre l'évaluation courante dans la base partagée
    async function saveEvaluationToDatabase(scores) {
        if (!sb) throw new Error('Configuration Supabase absente.');
        const p = appState.patient;
        const allMalus = [...MALUS_DATA.light, ...MALUS_DATA.moderate, ...MALUS_DATA.severe];

        const reponses = {
            criteres: CRITERIA_DATA.map(c => ({
                id: c.id,
                titre: c.title,
                note: appState.criteriaScores[c.id] ?? 0,
                appreciation: (RATING_LEVELS.find(l => l.pts === (appState.criteriaScores[c.id] ?? 0)) || {}).label || ''
            })),
            mises_en_situation: appState.activeScenarios.map(sc => ({
                id: sc.id,
                categorie: sc.category,
                titre: sc.title,
                note: appState.scenarioScores[sc.id] ?? 0
            })),
            premiere_impression: appState.firstImpression ?? 0,
            observations_entretien: appState.qualitativeObs,
            diagnostics: appState.selectedMalus
                .map(id => allMalus.find(m => m.id === id))
                .filter(Boolean)
                .map(m => ({ label: m.label, malus: m.pts })),
            bonus: appState.selectedBonus
                .map(id => BONUS_DATA.find(b => b.id === id))
                .filter(Boolean)
                .map(b => ({ label: b.label, bonus: b.pts })),
            ajustements_autre: appState.customAdjustments,
            justification_malus: appState.malusJustification,
            justification_bonus: appState.bonusJustification
        };

        const row = {
            patient_nom: p.name,
            patient_grade: p.grade,
            patient_unite: p.unit || null,
            patient_age: parseInt(p.age) || null,
            patient_sexe: p.gender || null,
            evaluateur: p.evaluator || null,
            psy_id: (typeof getCurrentUser === 'function' && getCurrentUser()) ? getCurrentUser().id : null,
            date_evaluation: p.evalDate || null,
            score_criteres: scores.criteriaTotal,
            score_situations: scores.scenariosTotal,
            score_impression: scores.impressionTotal,
            total_bonus: scores.bonusTotal,
            total_malus: scores.malusTotal,
            total_ajustements: scores.customAdjustmentsTotal,
            score_final: scores.finalScore,
            decision: scores.decision.title,
            reponses: reponses
        };

        // Rattache (ou crée) la fiche patient unique, partagée avec les
        // registres de tests / suivis, sans jamais dupliquer un patient.
        try {
            const pr = await sb.rpc('find_or_create_psy_patient', {
                p_nom: p.name, p_grade: p.grade, p_unite: p.unit || null,
                p_age: parseInt(p.age) || null, p_sexe: p.gender || null
            });
            if (!pr.error) row.patient_id = pr.data;
        } catch (e) { console.warn('Liaison fiche patient impossible :', e); }

        const res = await sb.from('psy_evaluations').insert([row]);
        if (res.error) throw new Error(res.error.message);
    }

    async function loadDossiers() {
        const listEl = document.getElementById('dossiers-list');
        if (!listEl) return;
        if (!sb) {
            setDossiersStatus('Configuration Supabase absente — impossible de charger les dossiers.', true);
            listEl.innerHTML = '';
            return;
        }
        const seq = ++dossiersState.seq;
        dossiersState.loading = true;
        setDossiersStatus('Chargement des dossiers...');
        try {
            const q = document.getElementById('dossiers-search').value.trim();
            let query = sb.from('psy_evaluations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(300);
            if (q.length >= 2) query = query.ilike('patient_nom', '%' + q + '%');
            const res = await query;
            if (seq !== dossiersState.seq) return;
            if (res.error) throw new Error(res.error.message);
            dossiersState.rows = res.data || [];
            renderDossiers();
        } catch (e) {
            if (seq !== dossiersState.seq) return;
            console.error(e);
            setDossiersStatus('Erreur de chargement : ' + escapeHtml(e.message), true);
            listEl.innerHTML = '';
        } finally {
            if (seq === dossiersState.seq) dossiersState.loading = false;
        }
    }

    function renderDossiers() {
        const listEl = document.getElementById('dossiers-list');
        const decisionFilter = document.getElementById('dossiers-filter-decision').value;
        let rows = dossiersState.rows;
        if (decisionFilter) rows = rows.filter(r => r.decision === decisionFilter);

        // Un patient peut avoir plusieurs évaluations : on compte les patients distincts
        const patientsDistincts = new Set(dossiersState.rows.map(r => (r.patient_nom || '').toLowerCase())).size;
        setDossiersStatus('<strong>' + dossiersState.rows.length + '</strong> évaluation(s) enregistrée(s) · '
            + '<strong>' + patientsDistincts + '</strong> patient(s) suivi(s)');

        if (rows.length === 0) {
            listEl.innerHTML = '<div class="dossiers-empty">Aucun dossier ne correspond aux filtres.</div>';
            return;
        }

        listEl.innerHTML = rows.map(r => {
            const date = r.date_evaluation || (r.created_at || '').slice(0, 10);
            const cls = decisionClass(r.decision);
            return `
                <div class="dossier-card">
                    <div class="dossier-head">
                        <span class="dossier-name">${escapeHtml(r.patient_nom)}</span>
                        <span class="dossier-score ${cls}">${r.score_final} / ${BAREME.MAX_TOTAL}</span>
                    </div>
                    <div class="dossier-decision ${cls}">${escapeHtml(r.decision || '—')}</div>
                    <div class="dossier-meta">${escapeHtml(r.patient_grade || '—')}${r.patient_unite ? ' · ' + escapeHtml(r.patient_unite) : ''}</div>
                    <div class="dossier-meta">Évalué le ${escapeHtml(date)}${r.evaluateur ? ' par ' + escapeHtml(r.evaluateur) : ''}</div>
                    <div class="dossier-actions">
                        <button type="button" class="btn btn-secondary dossier-detail-btn" data-id="${r.id}">
                            <i class="fa-solid fa-eye"></i> Voir les réponses
                        </button>
                    </div>
                </div>`;
        }).join('');

        listEl.querySelectorAll('.dossier-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => openDossierDetail(parseInt(btn.dataset.id)));
        });
    }

    // Retrouve la classe CSS d'une décision à partir de son titre stocké en base
    // (fonctionne aussi pour les anciens dossiers enregistrés avec les libellés
    // précédents, via une table de correspondance de secours).
    const LEGACY_DECISION_CLASS = {
        'MAINTIEN AVEC SUIVI': 'status-recommandations',
        'RESTRICTION TEMPORAIRE': 'status-restrictions',
        'SUSPENSION TEMPORAIRE': 'status-suspension',
        'RÉTROGRADATION TEMPORAIRE': 'status-retrogradation'
    };
    function decisionClass(decisionTitle) {
        const found = DECISIONS.find(d => d.title === decisionTitle);
        if (found) return found.statusClass.replace('status-', 'dec-');
        const legacy = LEGACY_DECISION_CLASS[decisionTitle];
        return legacy ? legacy.replace('status-', 'dec-') : '';
    }

    function openDossierDetail(id) {
        const r = dossiersState.rows.find(x => x.id === id);
        if (!r) return;
        const rep = r.reponses || {};
        const body = document.getElementById('dossier-modal-body');

        const criteres = (rep.criteres || []).map(c =>
            `<li><span>${escapeHtml(c.titre)}</span><strong>${c.note} / 5 — ${escapeHtml(c.appreciation)}</strong></li>`).join('');
        const situations = (rep.mises_en_situation || []).map(s =>
            `<li><span>${escapeHtml(s.titre)} <em>(${escapeHtml(s.categorie)})</em></span><strong>${s.note} / 3</strong></li>`).join('');
        const diagnostics = (rep.diagnostics || []).map(d =>
            `<span class="detail-chip neg">${escapeHtml(d.label)} (-${d.malus})</span>`).join('') || '<em>Aucun</em>';
        const bonus = (rep.bonus || []).map(b =>
            `<span class="detail-chip pos">${escapeHtml(b.label)} (+${b.bonus})</span>`).join('') || '<em>Aucun</em>';

        document.getElementById('dossier-modal-title').textContent =
            r.patient_nom + ' — ' + r.score_final + ' / ' + BAREME.MAX_TOTAL + ' (' + (r.decision || '—') + ')';

        body.innerHTML = `
            <div class="detail-grid">
                <div><span>Grade</span><strong>${escapeHtml(r.patient_grade || '—')}</strong></div>
                <div><span>Unité</span><strong>${escapeHtml(r.patient_unite || '—')}</strong></div>
                <div><span>Âge</span><strong>${r.patient_age ?? '—'}</strong></div>
                <div><span>Sexe</span><strong>${escapeHtml(r.patient_sexe || '—')}</strong></div>
                <div><span>Évaluateur</span><strong>${escapeHtml(r.evaluateur || '—')}</strong></div>
                <div><span>Date</span><strong>${escapeHtml(r.date_evaluation || (r.created_at || '').slice(0, 10))}</strong></div>
            </div>

            <h4 class="detail-title">Critères cliniques — ${r.score_criteres} / ${BAREME.MAX_CRITERIA}</h4>
            <ul class="detail-list">${criteres || '<li><em>Aucun critère enregistré</em></li>'}</ul>

            <h4 class="detail-title">Mises en situation — ${r.score_situations} / ${BAREME.MAX_SCENARIOS}</h4>
            <ul class="detail-list">${situations || '<li><em>Aucune mise en situation enregistrée</em></li>'}</ul>

            <h4 class="detail-title">Première impression</h4>
            <p class="detail-text">${rep.premiere_impression > 0 ? '+1 (favorable)' : rep.premiere_impression < 0 ? '-1 (défavorable)' : '0 (neutre)'}</p>

            <h4 class="detail-title">Diagnostics retenus — total ${r.total_malus} pts de malus</h4>
            <div class="detail-chips">${diagnostics}</div>
            ${rep.justification_malus ? `<p class="detail-text"><em>${escapeHtml(rep.justification_malus)}</em></p>` : ''}

            <h4 class="detail-title">Bonus cliniques — +${r.total_bonus} pts</h4>
            <div class="detail-chips">${bonus}</div>
            ${rep.justification_bonus ? `<p class="detail-text"><em>${escapeHtml(rep.justification_bonus)}</em></p>` : ''}

            <h4 class="detail-title">Calcul final</h4>
            <p class="detail-text">
                ${r.score_criteres} (critères) + ${r.score_situations} (situations)
                ${r.score_impression >= 0 ? '+' : ''}${r.score_impression} (impression)
                + ${r.total_bonus} (bonus) − ${r.total_malus} (malus)
                ${r.total_ajustements ? (r.total_ajustements >= 0 ? '+' : '') + r.total_ajustements + ' (ajustements)' : ''}
                = <strong>${r.score_final} / ${BAREME.MAX_TOTAL}</strong>
            </p>`;

        document.getElementById('dossier-modal').classList.add('open');
    }

    function closeDossierModal() {
        document.getElementById('dossier-modal').classList.remove('open');
    }

    document.getElementById('dossiers-search').addEventListener('input', () => {
        clearTimeout(dossiersSearchTimer);
        dossiersSearchTimer = setTimeout(loadDossiers, 300);
    });
    document.getElementById('dossiers-filter-decision').addEventListener('change', renderDossiers);
    document.getElementById('dossiers-refresh').addEventListener('click', loadDossiers);
    document.getElementById('dossier-modal-close').addEventListener('click', closeDossierModal);
    document.getElementById('dossier-modal').addEventListener('click', function (e) {
        if (e.target === this) closeDossierModal();
    });

    // ==========================================
    // AUTO-TESTS (résultats des tris auto-administrés par les patients)
    // ==========================================
    let autotestsState = { rows: [], loading: false, seq: 0 };
    let autotestsSearchTimer = null;

    function setAutotestsStatus(html, isError) {
        const el = document.getElementById('autotests-status');
        if (!el) return;
        el.innerHTML = html;
        el.classList.toggle('is-error', !!isError);
    }

    async function loadAutotests() {
        const listEl = document.getElementById('autotests-list');
        if (!listEl) return;
        if (!sb) {
            setAutotestsStatus('Configuration Supabase absente — impossible de charger les auto-tests.', true);
            listEl.innerHTML = '';
            return;
        }
        const seq = ++autotestsState.seq;
        setAutotestsStatus('Chargement des auto-tests...');
        try {
            const q = document.getElementById('autotests-search').value.trim();
            let query = sb.from('psy_autotests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(300);
            if (q.length >= 2) query = query.ilike('patient_nom', '%' + q + '%');
            const res = await query;
            if (seq !== autotestsState.seq) return;
            if (res.error) throw new Error(res.error.message);
            autotestsState.rows = res.data || [];
            renderAutotests();
        } catch (e) {
            if (seq !== autotestsState.seq) return;
            console.error(e);
            setAutotestsStatus('Erreur de chargement : ' + escapeHtml(e.message), true);
            listEl.innerHTML = '';
        }
    }

    function renderAutotests() {
        const listEl = document.getElementById('autotests-list');
        const decisionFilter = document.getElementById('autotests-filter-decision').value;
        const traiteFilter = document.getElementById('autotests-filter-traite').value;
        let rows = autotestsState.rows;
        if (decisionFilter) rows = rows.filter(r => r.decision === decisionFilter);
        if (traiteFilter === 'oui') rows = rows.filter(r => r.traite);
        if (traiteFilter === 'non') rows = rows.filter(r => !r.traite);

        const nonTraites = autotestsState.rows.filter(r => !r.traite && r.decision !== 'MAINTIEN DU GRADE').length;
        setAutotestsStatus('<strong>' + autotestsState.rows.length + '</strong> auto-test(s) reçu(s) · '
            + '<strong>' + nonTraites + '</strong> cas à surveiller non traités');

        if (rows.length === 0) {
            listEl.innerHTML = '<div class="dossiers-empty">Aucun auto-test ne correspond aux filtres.</div>';
            return;
        }

        listEl.innerHTML = rows.map(r => {
            const date = (r.created_at || '').slice(0, 10);
            const cls = decisionClass(r.decision);
            const maxAuto = BAREME.MAX_CRITERIA + BAREME.MAX_SCENARIOS;
            return `
                <div class="dossier-card">
                    <div class="dossier-head">
                        <span class="dossier-name">${escapeHtml(r.patient_nom)}</span>
                        <span class="dossier-score ${cls}">${r.score_final} / ${maxAuto}</span>
                    </div>
                    <div class="dossier-decision ${cls}">${escapeHtml(r.decision || '—')}</div>
                    <div class="dossier-meta">${escapeHtml(r.patient_grade || '—')}${r.patient_age ? ' · ' + r.patient_age + ' ans' : ''}${r.patient_sexe ? ' · ' + escapeHtml(r.patient_sexe) : ''}</div>
                    <div class="dossier-meta">Auto-test du ${escapeHtml(date)} — ${r.traite ? '<strong>Traité</strong>' + (r.traite_par ? ' par ' + escapeHtml(r.traite_par) : '') : '<strong>Non traité</strong>'}</div>
                    <div class="dossier-actions" style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" class="btn btn-secondary autotest-detail-btn" data-id="${r.id}">
                            <i class="fa-solid fa-eye"></i> Voir les réponses
                        </button>
                        ${!r.traite ? `<button type="button" class="btn btn-primary autotest-traite-btn" data-id="${r.id}">
                            <i class="fa-solid fa-check"></i> Marquer comme traité
                        </button>` : ''}
                    </div>
                </div>`;
        }).join('');

        listEl.querySelectorAll('.autotest-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => openAutotestDetail(parseInt(btn.dataset.id)));
        });
        listEl.querySelectorAll('.autotest-traite-btn').forEach(btn => {
            btn.addEventListener('click', () => markAutotestTraite(parseInt(btn.dataset.id)));
        });
    }

    function openAutotestDetail(id) {
        const r = autotestsState.rows.find(x => x.id === id);
        if (!r) return;
        const rep = r.reponses || {};
        const body = document.getElementById('autotest-modal-body');
        const maxAuto = BAREME.MAX_CRITERIA + BAREME.MAX_SCENARIOS;

        const criteres = (rep.criteres || []).map(c =>
            `<li><span>${escapeHtml(c.titre)}</span><strong>${c.note} / 5</strong></li>`).join('');
        const situations = (rep.mises_en_situation || []).map(s =>
            `<li style="flex-direction: column; align-items: flex-start; gap: 4px;">
                <span style="display:flex; justify-content:space-between; width:100%;">
                    <span>${escapeHtml(s.titre)} <em>(${escapeHtml(s.categorie)})</em></span>
                    <strong>${s.note} / 3</strong>
                </span>
                ${s.reponse_choisie ? `<span style="font-size:12px; color: var(--sand-dim);">Réponse choisie : ${escapeHtml(s.reponse_choisie)}</span>` : ''}
            </li>`).join('');

        document.getElementById('autotest-modal-title').textContent =
            r.patient_nom + ' — ' + r.score_final + ' / ' + maxAuto + ' (' + (r.decision || '—') + ')';

        body.innerHTML = `
            <div class="detail-grid">
                <div><span>Grade</span><strong>${escapeHtml(r.patient_grade || '—')}</strong></div>
                <div><span>Âge</span><strong>${r.patient_age ?? '—'}</strong></div>
                <div><span>Sexe</span><strong>${escapeHtml(r.patient_sexe || '—')}</strong></div>
                <div><span>Date</span><strong>${escapeHtml((r.created_at || '').slice(0, 10))}</strong></div>
                <div><span>Statut</span><strong>${r.traite ? 'Traité' + (r.traite_par ? ' par ' + escapeHtml(r.traite_par) : '') : 'Non traité'}</strong></div>
            </div>

            <h4 class="detail-title">Critères — ${r.score_criteres} / ${BAREME.MAX_CRITERIA}</h4>
            <ul class="detail-list">${criteres || '<li><em>Aucun critère enregistré</em></li>'}</ul>

            <h4 class="detail-title">Mises en situation — ${r.score_situations} / ${BAREME.MAX_SCENARIOS}</h4>
            <ul class="detail-list">${situations || '<li><em>Aucune mise en situation enregistrée</em></li>'}</ul>

            <h4 class="detail-title">Calcul final</h4>
            <p class="detail-text">
                ${r.score_criteres} (critères) + ${r.score_situations} (situations)
                = <strong>${r.score_final} / ${maxAuto}</strong>
                — auto-test sans impression clinique ni bonus/malus (jugement non disponible en auto-évaluation).
            </p>`;

        document.getElementById('autotest-modal').classList.add('open');
    }

    function closeAutotestModal() {
        document.getElementById('autotest-modal').classList.remove('open');
    }

    async function markAutotestTraite(id) {
        if (!sb) return;
        const evaluateur = document.getElementById('evaluator-name') ? document.getElementById('evaluator-name').value : '';
        const loggedInUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
        try {
            const res = await sb.from('psy_autotests')
                .update({
                    traite: true,
                    traite_par: evaluateur || null,
                    traite_par_id: loggedInUser ? loggedInUser.id : null,
                    traite_le: new Date().toISOString()
                })
                .eq('id', id);
            if (res.error) throw new Error(res.error.message);
            await loadAutotests();
        } catch (e) {
            console.error(e);
            alert('Impossible de marquer ce dossier comme traité : ' + e.message);
        }
    }

    document.getElementById('autotests-search').addEventListener('input', () => {
        clearTimeout(autotestsSearchTimer);
        autotestsSearchTimer = setTimeout(loadAutotests, 300);
    });
    document.getElementById('autotests-filter-decision').addEventListener('change', renderAutotests);
    document.getElementById('autotests-filter-traite').addEventListener('change', renderAutotests);
    document.getElementById('autotests-refresh').addEventListener('click', loadAutotests);
    document.getElementById('autotest-modal-close').addEventListener('click', closeAutotestModal);
    document.getElementById('autotest-modal').addEventListener('click', function (e) {
        if (e.target === this) closeAutotestModal();
    });

    // Première impression clinique (-1 / 0 / +1)
    document.querySelectorAll('.impression-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            appState.firstImpression = parseInt(btn.getAttribute('data-imp'));
            document.querySelectorAll('.impression-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            updateCalculations();
        });
    });

    // Filter scenarios listener
    const filterSelect = document.getElementById('filter-scenario-cat');
    if (filterSelect) {
        filterSelect.addEventListener('change', renderScenariosSection);
    }

    // ==========================================
    // 5. REPORT & DOUBLE VIEW RENDERING
    // ==========================================

    function renderPrintableReport() {
        const reportContainer = document.getElementById('printable-report');
        if (!reportContainer) return;

        const scores = calculateScores();
        const p = appState.patient;

        if (appState.viewIsShinobi) {
            // SECTION 8: CE QUE VOIT LE SHINOBI (PATIENT VIEW)
            reportContainer.innerHTML = `
                <div class="doc-header">
                    <div>
                        <h2>FICHE CLINIQUE SHINOBI — SUNAGAKURE</h2>
                        <div style="font-size: 13px; color: #555;">UNITÉ MÉDICALE SEIMEI • DOCUMENT DE NOTIFICATION</div>
                    </div>
                    <div class="doc-shinobi-stamp">VOLET SHINOBI</div>
                </div>

                <div class="doc-grid-info">
                    <div><strong>Shinobi :</strong> ${p.name || 'Non spécifié'}</div>
                    <div><strong>Grade :</strong> ${p.grade}</div>
                    <div><strong>Unité :</strong> ${p.unit || 'Non renseignée (Indépendante)'}</div>
                    <div><strong>Date d'Évaluation :</strong> ${p.evalDate}</div>
                    <div><strong>Évaluateur :</strong> ${p.evaluator}</div>
                    <div><strong>Réévaluation :</strong> Dans ${scores.decision.reevalDate}</div>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">1. DIAGNOSTIC GÉNÉRAL DE SANTÉ MENTALE</div>
                    <p style="font-size: 15px; font-weight: bold; color: #3d0c11; margin-top: 6px;">
                        ${scores.decision.generalDiagnosis}
                    </p>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">2. DÉCISION FINALE INSTITUTIONNELLE</div>
                    <div style="background: #e9decb; border: 2px solid #3d0c11; padding: 16px; border-radius: 6px; text-align: center; margin-top: 10px;">
                        <h3 style="font-size: 20px; color: #3d0c11; font-family: 'Cinzel', serif;">${scores.decision.title}</h3>
                        <p style="font-size: 14px; margin-top: 6px;">${scores.decision.description}</p>
                    </div>
                </div>

                <div class="doc-section" style="margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    <div style="font-size: 12px; color: #666;">
                        <p><strong>Note relative à la confidentialité clinique (Article 18) :</strong></p>
                        <p>Conformément aux directives de l'unité SEIMEI, les détails des sous-coefficients, calculs internes et appréciations détaillées du psychologue demeurent strictement confidentiels et archivés au bureau médical central de Sunagakure.</p>
                    </div>
                </div>
            `;
        } else {
            // SECTION 9: RAPPORT CLINIQUE (CONFIDENTIEL - PSYCHOLOGUE)
            const criteriaRowsHtml = CRITERIA_DATA.map(c => {
                const pts = appState.criteriaScores[c.id] ?? 0;
                const formattedScore = formatScoreOutOf10(pts);
                return `
                    <tr>
                        <td><strong>${c.id}. ${c.title}</strong></td>
                        <td><strong style="color: ${pts < 0 ? '#c94a4a' : '#2d8a6e'};">${formattedScore}</strong></td>
                        <td>${pts >= 5 ? 'Satisfaction Élevée' : pts >= 0 ? 'Moyen / Normal' : 'Vigilance / Deficit constatée'}</td>
                    </tr>
                `;
            }).join('');

            reportContainer.innerHTML = `
                <div class="doc-header">
                    <div>
                        <h2>RAPPORT CLINIQUE CONFIDENTIEL — SEIMEI - SUNA</h2>
                        <div style="font-size: 13px; color: #555;">ÉVALUATION DES APTITUDES PSYCHOLOGIQUES AU COMBAT</div>
                    </div>
                    <div class="doc-confidential-stamp">CONFIDENTIEL MÉDICAL</div>
                </div>

                <div class="doc-grid-info">
                    <div><strong>Shinobi :</strong> ${p.name || 'Non renseigné'}</div>
                    <div><strong>Unité :</strong> ${p.unit || 'Non renseignée (Indépendante)'}</div>
                    <div><strong>Grade :</strong> ${p.grade} (Âge: ${p.age}, Sexe: ${p.gender})</div>
                    <div><strong>Date d'Évaluation :</strong> ${p.evalDate}</div>
                    <div><strong>Psychologue :</strong> ${p.evaluator}</div>
                    <div><strong>Score Global :</strong> ${scores.finalScore} / ${BAREME.MAX_TOTAL} pts</div>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">1. RÉSUMÉ DE L'ENTRETIEN ET OBSERVATIONS QUALITATIVES</div>
                    <p style="font-size: 13px; font-style: italic;">
                        L'impression initiale qualitative confirme la bonne communication et la sincérité du shinobi lors des échanges libres et dirigés.
                    </p>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">2. DÉTAIL DES 8 CRITÈRES CLINIQUES (BARÈME DE -10 À +10 PTS)</div>
                    <table class="doc-table">
                        <thead>
                            <tr>
                                <th>Critère d'Appréciation</th>
                                <th>Note Attribuée (-10 à +10 pts)</th>
                                <th>Appréciation Internes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${criteriaRowsHtml}
                        </tbody>
                    </table>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">3. DÉCISION FINALE & RECOMMANDATIONS CLINIQUES</div>
                    <div style="background: #e9decb; border-left: 4px solid #3d0c11; padding: 12px 16px; margin-top: 6px;">
                        <h4 style="font-size: 16px; color: #3d0c11;">${scores.decision.title} (Score: ${scores.finalScore} / ${BAREME.MAX_TOTAL})</h4>
                        <p style="font-size: 13px; margin-top: 4px;">${scores.decision.description}</p>
                    </div>
                </div>

                <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #555;">
                    <div>Signature du Shinobi pour prise de connaissance</div>
                    <div>Cachet et Signature du Psychologue Évaluateur</div>
                </div>
            `;
        }
    }

    // ==========================================
    // 6. EVENT HANDLERS & HELPERS
    // ==========================================

    function selectRandomScenarios(count = BAREME.NB_SCENARIOS) {
        const shuffled = [...SCENARIOS_BANK].sort(() => 0.5 - Math.random());
        appState.activeScenarios = shuffled.slice(0, count);
        // Un nouveau tirage repart de zéro : les notes précédentes ne valent plus
        appState.scenarioScores = {};
        appState.activeScenarios.forEach(sc => { appState.scenarioScores[sc.id] = 0; });
        renderScenariosSection();
        updateCalculations();
    }

    // Navigation Tabs Switcher — les 5 étapes de l'entretien ne sont plus
    // des onglets cliquables (boutons cachés) : on avance avec Suivant /
    // Précédent. Patients et Historique restent des onglets classiques.
    const STEP_LABELS = { 1: 'Étape 1 / 5 — Patient & Entretien', 2: 'Étape 2 / 5 — Mises en Situation', 3: 'Étape 3 / 5 — Barème Clinique', 4: 'Étape 4 / 5 — Calcul & Synthèse', 5: 'Étape 5 / 5 — Rapport & Vues' };

    function switchToTab(tabTarget) {
        // Plusieurs boutons peuvent cibler le même onglet (ex. le bouton
        // "Évaluation" et le bouton d'étape 1, tous deux vers tab-patient).
        const matchingBtns = document.querySelectorAll(`.nav-btn[data-tab="${tabTarget}"]`);
        const btn = document.querySelector(`.nav-btn[data-tab="${tabTarget}"][data-step]`) || matchingBtns[0];
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        matchingBtns.forEach(b => b.classList.add('active'));
        const targetPane = document.getElementById(tabTarget);
        if (targetPane) targetPane.classList.add('active');

        // L'annuaire n'est chargé qu'à la première ouverture de son onglet
        if (tabTarget === 'tab-patients') loadDossiers();
        if (tabTarget === 'tab-autotests') loadAutotests();

        const step = btn ? parseInt(btn.getAttribute('data-step')) : null;
        const stepNavBar = document.getElementById('step-nav-bar');
        if (step) {
            stepNavBar.style.display = 'flex';
            document.getElementById('step-nav-label').textContent = STEP_LABELS[step] || '';
            document.getElementById('btn-step-prev').disabled = (step === 1);
            document.getElementById('btn-step-next').style.visibility = (step === 5) ? 'hidden' : 'visible';
        } else {
            stepNavBar.style.display = 'none';
        }
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchToTab(btn.getAttribute('data-tab')));
    });

    document.getElementById('btn-step-prev').addEventListener('click', () => {
        const current = document.querySelector('.nav-btn.active[data-step]');
        const step = current ? parseInt(current.getAttribute('data-step')) : 1;
        if (step > 1) {
            const prevBtn = document.querySelector(`.nav-btn[data-step="${step - 1}"]`);
            if (prevBtn) switchToTab(prevBtn.getAttribute('data-tab'));
        }
    });
    document.getElementById('btn-step-next').addEventListener('click', () => {
        const current = document.querySelector('.nav-btn.active[data-step]');
        const step = current ? parseInt(current.getAttribute('data-step')) : 1;
        if (step < 5) {
            const nextBtn = document.querySelector(`.nav-btn[data-step="${step + 1}"]`);
            if (nextBtn) switchToTab(nextBtn.getAttribute('data-tab'));
        }
    });
    document.getElementById('btn-step-start').addEventListener('click', () => {
        const firstBtn = document.querySelector('.nav-btn[data-step="1"]');
        if (firstBtn) switchToTab(firstBtn.getAttribute('data-tab'));
    });

    // Affiche la barre "Suivant / Précédent" dès le chargement (étape 1 active).
    switchToTab('tab-patient');

    // Form Binding
    const updatePatientStateFromInputs = () => {
        appState.patient.name = document.getElementById('patient-name').value;
        appState.patient.unit = document.getElementById('patient-unit').value;
        appState.patient.grade = document.getElementById('patient-grade').value;
        appState.patient.age = document.getElementById('patient-age').value;
        appState.patient.gender = document.getElementById('patient-gender').value;
        appState.patient.evalDate = document.getElementById('eval-date').value;
        appState.patient.evaluator = document.getElementById('evaluator-name').value;
        updateCalculations();
    };

    ['patient-name', 'patient-unit', 'patient-grade', 'patient-age', 'patient-gender', 'eval-date', 'evaluator-name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePatientStateFromInputs);
    });

    // Scenario Generator Button
    document.getElementById('btn-generate-scenarios').addEventListener('click', () => {
        selectRandomScenarios(Math.floor(Math.random() * 2) + 2);
    });

    // Custom Scenario Modal Events
    const modal = document.getElementById('modal-custom-scenario');
    document.getElementById('btn-custom-scenario').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    document.getElementById('btn-cancel-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    document.getElementById('btn-save-custom-scenario').addEventListener('click', () => {
        const title = document.getElementById('custom-title').value;
        const cat = document.getElementById('custom-cat').value;
        const desc = document.getElementById('custom-desc').value;
        const evalTips = document.getElementById('custom-eval').value;

        if (title && desc) {
            appState.activeScenarios.unshift({
                id: 'custom-' + Date.now(),
                category: cat,
                title: title,
                desc: desc,
                evalTips: evalTips || 'Évaluation libre du raisonnement clinique.'
            });
            renderScenariosSection();
            modal.classList.add('hidden');
            document.getElementById('custom-title').value = '';
            document.getElementById('custom-desc').value = '';
        }
    });

    // Toggle View Switcher (Psychologue vs Shinobi)
    document.getElementById('toggle-view-shinobi').addEventListener('change', (e) => {
        appState.viewIsShinobi = e.target.checked;
        renderPrintableReport();
    });

    // Print Button
    document.getElementById('btn-print-report').addEventListener('click', () => {
        window.print();
    });

    // Enregistrement du dossier : base partagée + copie locale de secours
    document.getElementById('btn-save-patient').addEventListener('click', async () => {
        if (!appState.patient.name) {
            alert("Veuillez renseigner le nom du shinobi avant d'enregistrer le dossier.");
            return;
        }

        const btn = document.getElementById('btn-save-patient');
        const scores = calculateScores();

        const evalRecord = {
            id: Date.now(),
            date: appState.patient.evalDate,
            name: appState.patient.name,
            grade: appState.patient.grade,
            unit: appState.patient.unit,
            score: scores.finalScore,
            decision: scores.decision.title,
            evaluator: appState.patient.evaluator,
            fullState: JSON.parse(JSON.stringify(appState))
        };
        appState.evaluationsHistory.unshift(evalRecord);
        saveHistoryToStorage();
        renderHistoryTable();

        btn.disabled = true;
        try {
            await saveEvaluationToDatabase(scores);
            alert(`Dossier clinique de ${appState.patient.name} enregistré (${scores.finalScore} / ${BAREME.MAX_TOTAL} — ${scores.decision.title}).`);
            loadDossiers();
        } catch (e) {
            console.error(e);
            alert("Le dossier est enregistré localement, mais l'envoi vers la base partagée a échoué :\n" + e.message);
        } finally {
            btn.disabled = false;
        }
    });

    // Storage Helpers
    function saveHistoryToStorage() {
        localStorage.setItem('seimei_suna_history', JSON.stringify(appState.evaluationsHistory));
    }

    function loadHistoryFromStorage() {
        const stored = localStorage.getItem('seimei_suna_history');
        if (stored) {
            try {
                appState.evaluationsHistory = JSON.parse(stored);
                renderHistoryTable();
            } catch (e) {
                appState.evaluationsHistory = [];
            }
        }
    }

    function renderHistoryTable() {
        const tbody = document.getElementById('history-table-body');
        if (!tbody) return;

        if (appState.evaluationsHistory.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; opacity: 0.6;">Aucune évaluation enregistrée dans l'historique local.</td></tr>`;
            return;
        }

        tbody.innerHTML = appState.evaluationsHistory.map(item => `
            <tr>
                <td>${item.date}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.grade}</td>
                <td>${item.unit || '-'}</td>
                <td><strong style="color: var(--sand-primary);">${item.score} / ${BAREME.MAX_TOTAL}</strong></td>
                <td><span class="count-badge">${item.decision}</span></td>
                <td>${item.evaluator}</td>
                <td>
                    <button class="btn btn-secondary btn-sm load-hist-btn" data-id="${item.id}" title="Recharger ce dossier">
                        <i class="fa-solid fa-folder-open"></i>
                    </button>
                    <button class="btn btn-danger btn-sm del-hist-btn" data-id="${item.id}" title="Supprimer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.load-hist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const found = appState.evaluationsHistory.find(h => h.id === id);
                if (found) {
                    appState = JSON.parse(JSON.stringify(found.fullState));
                    if (!appState.customAdjustments) appState.customAdjustments = [];
                    // Re-sync form
                    document.getElementById('patient-name').value = appState.patient.name;
                    document.getElementById('patient-unit').value = appState.patient.unit;
                    document.getElementById('patient-grade').value = appState.patient.grade;
                    document.getElementById('patient-age').value = appState.patient.age;
                    document.getElementById('patient-gender').value = appState.patient.gender;
                    document.getElementById('eval-date').value = appState.patient.evalDate;
                    document.getElementById('evaluator-name').value = appState.patient.evaluator;

                    renderCriteriaSection();
                    renderScenariosSection();
                    renderDiagnosticsSection();
                    updateCalculations();
                    alert(`Dossier de ${appState.patient.name} rechargé dans le système.`);
                }
            });
        });

        tbody.querySelectorAll('.del-hist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                appState.evaluationsHistory = appState.evaluationsHistory.filter(h => h.id !== id);
                saveHistoryToStorage();
                renderHistoryTable();
            });
        });
    }

    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm("Êtes-vous sûr de vouloir effacer l'ensemble de l'historique ?")) {
            appState.evaluationsHistory = [];
            saveHistoryToStorage();
            renderHistoryTable();
        }
    });

    // ==========================================
    // INITIALIZATION RENDER
    // ==========================================
    renderCriteriaSection();
    renderScenariosSection();
    renderDiagnosticsSection();
    updateCalculations();

    // Lien direct depuis la sidebar (index.html?tab=autotests) : ouvre
    // directement l'onglet Auto-tests au lieu de l'onglet Patient par défaut
    // (ce n'est plus un onglet visible dans la barre interne, uniquement
    // accessible via ce lien direct).
    const requestedTab = new URLSearchParams(location.search).get('tab');
    if (requestedTab && document.getElementById(`tab-${requestedTab}`)) {
        switchToTab(`tab-${requestedTab}`);
    }
});
