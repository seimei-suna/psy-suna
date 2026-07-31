/* ==========================================================================
   SEIMEI - SUNA : AUTO-TEST PATIENT
   Tri auto-administré, sans psychologue. Le patient répond seul aux
   critères et mises en situation (même référentiel que l'outil psy),
   mais ne voit jamais son score — uniquement le message qualitatif
   associé à sa tranche, issu du même barème que data.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const SCENARIOS_BANK = (typeof FULL_100_SCENARIOS_BANK !== 'undefined') ? FULL_100_SCENARIOS_BANK : [];

    let sb = null;
    try {
        if (typeof SUPABASE_URL !== 'undefined' && typeof window.supabase !== 'undefined') {
            sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (e) { console.error('Client Supabase indisponible :', e); sb = null; }

    const state = {
        identity: { name: '', grade: 'Chunin', age: 19, gender: 'M' },
        criteriaScores: {},
        activeScenarios: [],
        scenarioScores: {}
    };

    CRITERIA_DATA.forEach(c => { state.criteriaScores[c.id] = 3; });

    const shuffled = [...SCENARIOS_BANK].sort(() => 0.5 - Math.random());
    state.activeScenarios = shuffled.slice(0, BAREME.NB_SCENARIOS);
    state.activeScenarios.forEach(sc => { state.scenarioScores[sc.id] = 0; });

    // ── Navigation entre étapes ──
    function goToStep(stepId) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.getElementById('at-btn-start').addEventListener('click', () => goToStep('at-step-identity'));

    document.getElementById('at-btn-to-criteria').addEventListener('click', () => {
        const name = document.getElementById('at-name').value.trim();
        if (!name) {
            document.getElementById('at-name').focus();
            return;
        }
        state.identity.name = name;
        state.identity.grade = document.getElementById('at-grade').value;
        state.identity.age = parseInt(document.getElementById('at-age').value) || null;
        state.identity.gender = document.getElementById('at-gender').value;
        renderCriteria();
        goToStep('at-step-criteria');
    });

    document.getElementById('at-btn-to-scenarios').addEventListener('click', () => {
        renderScenarios();
        goToStep('at-step-scenarios');
    });

    document.getElementById('at-btn-submit').addEventListener('click', submitAutoTest);

    // ── Rendu des critères (auto-évaluation) ──
    function renderCriteria() {
        const container = document.getElementById('at-criteria-container');
        container.innerHTML = CRITERIA_DATA.map(c => {
            const currentVal = state.criteriaScores[c.id] ?? 3;
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
                </div>
            `;
        }).join('');

        container.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                state.criteriaScores[id] = parseInt(btn.getAttribute('data-pts'));
                renderCriteria();
            });
        });
    }

    // ── Rendu des mises en situation (sans indices réservés au psychologue) ──
    function renderScenarios() {
        const container = document.getElementById('at-scenarios-container');
        container.innerHTML = state.activeScenarios.map(sc => {
            const val = state.scenarioScores[sc.id] ?? 0;
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
                </div>
                <div class="scenario-scoring">
                    <span class="scenario-scoring-label"><i class="fa-solid fa-star-half-stroke"></i> Votre réaction</span>
                    <div class="scenario-rate-group">${notesHtml}<span class="scenario-rate-max">/ 3</span></div>
                </div>
            </div>`;
        }).join('');

        container.querySelectorAll('.scenario-rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.scenarioScores[btn.getAttribute('data-sc')] = parseInt(btn.getAttribute('data-pts'));
                renderScenarios();
            });
        });
    }

    // ── Calcul et envoi ──
    async function submitAutoTest() {
        const btn = document.getElementById('at-btn-submit');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

        const criteriaTotal = CRITERIA_DATA.reduce((sum, c) => sum + (state.criteriaScores[c.id] ?? 0), 0);
        const scenariosTotal = state.activeScenarios.reduce((sum, sc) => sum + (state.scenarioScores[sc.id] ?? 0), 0);
        const scoreFinal = criteriaTotal + scenariosTotal;
        const decision = getDecisionForScore(scoreFinal);

        const reponses = {
            criteres: CRITERIA_DATA.map(c => ({
                id: c.id,
                titre: c.title,
                note: state.criteriaScores[c.id] ?? 0
            })),
            mises_en_situation: state.activeScenarios.map(sc => ({
                id: sc.id,
                categorie: sc.category,
                titre: sc.title,
                note: state.scenarioScores[sc.id] ?? 0
            }))
        };

        const row = {
            patient_nom: state.identity.name,
            patient_grade: state.identity.grade,
            patient_age: state.identity.age,
            patient_sexe: state.identity.gender,
            score_criteres: criteriaTotal,
            score_situations: scenariosTotal,
            score_final: scoreFinal,
            decision: decision.title,
            reponses: reponses
        };

        try {
            if (sb) {
                const res = await sb.from('psy_autotests').insert([row]);
                if (res.error) throw new Error(res.error.message);
            }
        } catch (e) {
            console.error('Échec de l\'enregistrement de l\'auto-test :', e);
            // Le message affiché au patient ne dépend jamais de la réussite de l'envoi
        }

        document.getElementById('at-result-message').textContent = decision.patientMessage;
        goToStep('at-step-result');
    }
});
