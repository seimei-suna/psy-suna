/* ==========================================================================
   SEIMEI - SUNA: RÉFÉRENTIEL CLINIQUE D'ÉVALUATION PSYCHOLOGIQUE
   Application Logic & State Management (Connected to 100 Scenarios Bank)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DATABASES & CONSTANTS
    // ==========================================

    const CRITERIA_DATA = [
        {
            id: 1,
            title: "Stabilité émotionnelle perçue",
            desc: "Capacité du shinobi à conserver un équilibre émotionnel face aux événements vécus.",
            subItems: ["Maîtrise de soi", "Variations émotionnelles", "Capacité à verbaliser son vécu", "Gestion du stress", "Récupération après situation difficile"]
        },
        {
            id: 2,
            title: "Fiabilité opérationnelle",
            desc: "Capacité à rester efficace dans des conditions changeantes.",
            subItems: ["Attention et concentration", "Résistance à la pression", "Rigueur dans l'exécution", "Respect des consignes"]
        },
        {
            id: 3,
            title: "Engagement envers Sunagakure",
            desc: "Nature et sincérité de la volonté de servir le village et de protéger ses alliés.",
            subItems: ["Motivation et engagement", "Loyauté perçue", "Sens du devoir", "Raisons personnelles"]
        },
        {
            id: 4,
            title: "Discernement sous pression",
            desc: "Capacité à prendre des décisions adaptées malgré le stress, l'urgence ou l'incertitude.",
            subItems: ["Jugement tactique", "Contrôle de l'impulsivité", "Analyse des conséquences", "Choix cohérents et adaptés"]
        },
        {
            id: 5,
            title: "Cohésion avec la hiérarchie",
            desc: "Qualité des relations professionnelles et respect de la chaîne de commandement.",
            subItems: ["Communication", "Travail d'équipe", "Respect de la hiérarchie", "Confiance inspirée", "Coopération"]
        },
        {
            id: 6,
            title: "Capacité d'adaptation",
            desc: "Capacité à ajuster son comportement face aux imprévus ou aux changements de situation.",
            subItems: ["Réactivité", "Souplesse mentale", "Gestion de l'imprévu", "Adaptation", "Apprentissage rapide"]
        },
        {
            id: 7,
            title: "Influence sur son entourage",
            desc: "Impact du shinobi sur ses coéquipiers et son environnement.",
            subItems: ["Leadership naturel", "Capacité à rassurer", "Gestion des conflits", "Motivation des autres", "Présence positive"]
        },
        {
            id: 8,
            title: "Disponibilité psychique au service",
            desc: "État mental général permettant une reprise sereine et durable du service.",
            subItems: ["Énergie mentale", "Clarté d'esprit", "Résilience", "Fatigue psychologique", "Préparation au service"]
        }
    ];

    const SCENARIOS_BANK = (typeof FULL_100_SCENARIOS_BANK !== 'undefined') ? FULL_100_SCENARIOS_BANK : [];

    const MALUS_DATA = {
        light: [
            { id: 'm-1', label: 'Stress léger', pts: 2 },
            { id: 'm-2', label: 'Fatigue mentale', pts: 2 },
            { id: 'm-3', label: 'Manque de confiance', pts: 2 },
            { id: 'm-4', label: 'Difficulté de concentration', pts: 2 },
            { id: 'm-5', label: 'Irritabilité passagère', pts: 2 }
        ],
        moderate: [
            { id: 'm-6', label: 'Stress post-traumatique', pts: 4 },
            { id: 'm-7', label: 'Culpabilité importante', pts: 4 },
            { id: 'm-8', label: 'Instabilité émotionnelle', pts: 4 },
            { id: 'm-9', label: 'Impulsivité', pts: 4 },
            { id: 'm-10', label: 'Isolement social', pts: 4 }
        ],
        severe: [
            { id: 'm-11', label: 'Refus d\'obéir', pts: 6 },
            { id: 'm-12', label: 'Hallucinations', pts: 6 },
            { id: 'm-13', label: 'Perte de contrôle', pts: 6 },
            { id: 'm-14', label: 'Risque pour l\'équipe', pts: 6 },
            { id: 'm-15', label: 'Dangerosité potentielle', pts: 6 }
        ]
    };

    const BONUS_DATA = [
        { id: 'b-1', label: 'Sang-froid exceptionnel', desc: 'Maîtrise parfaite lors des crises imprévues', pts: 2 },
        { id: 'b-2', label: 'Leadership remarquable', desc: 'Mobilisation efficace du groupe', pts: 2 },
        { id: 'b-3', label: 'Grande résilience', desc: 'Capacité supérieure de récupération', pts: 2 },
        { id: 'b-4', label: 'Esprit d\'équipe exemplaire', desc: 'Altruisme et soutien constant', pts: 2 }
    ];

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
        criteriaScores: {}, // { 1: +5, 2: -10, ... } (values from -10 to +10)
        selectedMalus: [],
        selectedBonus: [],
        customAdjustments: [],
        malusJustification: '',
        bonusJustification: '',
        viewIsShinobi: false,
        evaluationsHistory: []
    };

    // Initialize default values for criteria (default to +5)
    CRITERIA_DATA.forEach(c => {
        appState.criteriaScores[c.id] = 5;
    });

    // Load initial scenario selection (3 random out of 100)
    selectRandomScenarios(3);

    // Load History from LocalStorage if available
    loadHistoryFromStorage();

    // Set today's date in form
    document.getElementById('eval-date').value = appState.patient.evalDate;

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
            const currentVal = appState.criteriaScores[c.id] ?? 5;
            const subItemsHtml = c.subItems.map(item => `<li><i class="fa-solid fa-check-double"></i> ${item}</li>`).join('');

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
                            <button type="button" class="rate-btn ${currentVal === 10 ? 'selected' : ''}" data-pts="10" data-id="${c.id}">
                                <span>Parfait</span>
                                <span class="pts">+10 / 10</span>
                            </button>
                            <button type="button" class="rate-btn ${currentVal === 5 ? 'selected' : ''}" data-pts="5" data-id="${c.id}">
                                <span>Bon</span>
                                <span class="pts">+5 / 10</span>
                            </button>
                            <button type="button" class="rate-btn ${currentVal === 0 ? 'selected' : ''}" data-pts="0" data-id="${c.id}">
                                <span>Moyen</span>
                                <span class="pts">0 / 10</span>
                            </button>
                            <button type="button" class="rate-btn ${currentVal === -5 ? 'selected' : ''}" data-pts="-5" data-id="${c.id}">
                                <span>Critique</span>
                                <span class="pts">-5 / 10</span>
                            </button>
                            <button type="button" class="rate-btn ${currentVal === -10 ? 'selected' : ''}" data-pts="-10" data-id="${c.id}">
                                <span>Critique Max</span>
                                <span class="pts" style="color: #ff6b6b; font-weight: bold;">-10 / 10</span>
                            </button>

                            <!-- Case à remplir directe pour le nombre de points sur-mesure -->
                            <div class="criterion-input-box-wrapper" title="Saisissez un nombre de points direct (-10 à +10)">
                                <label style="font-size: 10px; color: var(--sand-primary); text-transform: uppercase;">Case à remplir :</label>
                                <div class="criterion-input-group">
                                    <input type="number" 
                                           class="criterion-direct-input" 
                                           data-id="${c.id}" 
                                           min="-10" 
                                           max="10" 
                                           step="1" 
                                           value="${currentVal}" 
                                           placeholder="pts">
                                    <span style="font-size: 11px; font-weight: bold; color: var(--sand-dim);">/ 10</span>
                                </div>
                            </div>
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

        // Attach click handlers to preset buttons
        container.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const pts = parseInt(btn.getAttribute('data-pts'));

                appState.criteriaScores[id] = pts;

                // Sync the corresponding input box
                const inputEl = container.querySelector(`.criterion-direct-input[data-id="${id}"]`);
                if (inputEl) inputEl.value = pts;

                renderCriteriaSection();
                updateCalculations();
            });
        });

        // Attach input change handlers to direct inline input boxes ("cases à remplir")
        container.querySelectorAll('.criterion-direct-input').forEach(input => {
            input.addEventListener('input', () => {
                const id = parseInt(input.getAttribute('data-id'));
                let val = parseFloat(input.value);
                if (isNaN(val)) val = 0;
                val = Math.max(-10, Math.min(10, val));

                appState.criteriaScores[id] = val;
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

        container.innerHTML = scenariosToDisplay.map(sc => `
            <div class="scenario-card">
                <div>
                    <span class="scenario-category">${sc.category}</span>
                    <h3 class="scenario-title" style="margin-top: 6px;">${sc.title}</h3>
                    <p class="scenario-desc" style="margin-top: 8px;">${sc.desc}</p>
                </div>
                <div class="scenario-eval-tips">
                    <strong><i class="fa-solid fa-microscope"></i> Diagnostic évaluateur :</strong> ${sc.evalTips}
                </div>
            </div>
        `).join('');
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
        let rawCriteriaSum = 0;
        Object.values(appState.criteriaScores).forEach(val => {
            rawCriteriaSum += val;
        });

        // Convert criteria sum (-80 to +80) into a base score on 40
        const criteriaTotal = Math.max(0, Math.min(40, Math.round(20 + (rawCriteriaSum * 0.25))));

        // Calculate Malus Standard
        let malusTotal = 0;
        const allMalusItems = [...MALUS_DATA.light, ...MALUS_DATA.moderate, ...MALUS_DATA.severe];
        appState.selectedMalus.forEach(id => {
            const found = allMalusItems.find(m => m.id === id);
            if (found) malusTotal += found.pts;
        });

        // Calculate Bonus Standard (capped at +4)
        let rawBonus = 0;
        appState.selectedBonus.forEach(id => {
            const found = BONUS_DATA.find(b => b.id === id);
            if (found) rawBonus += found.pts;
        });
        const bonusTotal = Math.min(4, rawBonus);

        // Calculate Custom Adjustments ("Autre")
        let customAdjustmentsTotal = 0;
        appState.customAdjustments.forEach(adj => {
            if (adj.type === 'add') {
                customAdjustmentsTotal += adj.pts;
            } else {
                customAdjustmentsTotal -= adj.pts;
            }
        });

        // Final score (clamped between 0 and 50)
        const rawFinal = criteriaTotal + bonusTotal - malusTotal + customAdjustmentsTotal;
        const finalScore = Math.max(0, Math.min(50, rawFinal));

        // Determine Decision
        let decision = {
            title: '',
            statusClass: '',
            description: '',
            reevalDate: '3 mois',
            generalDiagnosis: 'Équilibre clinique conservé'
        };

        if (finalScore >= 45) {
            decision.title = "MAINTIEN DU GRADE";
            decision.statusClass = "status-maintien";
            decision.description = "Le shinobi est pleinement apte au combat. Aucune restriction de mission. Maintien strict du grade actuel.";
            decision.generalDiagnosis = "Aptitude optimale au combat — Aucune séquelle clinique";
            decision.reevalDate = "12 mois";
        } else if (finalScore >= 35) {
            decision.title = "MAINTIEN AVEC SUIVI";
            decision.statusClass = "status-suivi";
            decision.description = "Le shinobi est apte au service avec un suivi psychologique obligatoire. Rapport à fournir régulièrement par l'évaluateur.";
            decision.generalDiagnosis = "Aptitude opérationnelle sous suivi psychologique préventif";
            decision.reevalDate = "3 à 6 mois";
        } else if (finalScore >= 25) {
            decision.title = "RESTRICTION TEMPORAIRE";
            decision.statusClass = "status-restriction";
            decision.description = "Restrictions sur les missions à haut risque pendant 7 à 14 jours. Réévaluation obligatoire à la fin de la période.";
            decision.generalDiagnosis = "Vulnérabilité modérée — Mises au repos stratégique recommandées";
            decision.reevalDate = "14 jours";
        } else if (finalScore >= 15) {
            decision.title = "SUSPENSION TEMPORAIRE";
            decision.statusClass = "status-suspension";
            decision.description = "Suspension temporaire de l'ensemble des missions opérationnelles. Soins psychologiques intensifs prescrits.";
            decision.generalDiagnosis = "Altération marquée des facultés d'adaptation au combat";
            decision.reevalDate = "30 jours";
        } else {
            decision.title = "RÉTROGRADATION TEMPORAIRE";
            decision.statusClass = "status-retrogradation";
            decision.description = "Rétrogradation temporaire au grade inférieur avec réaffectation administrative. Réévaluation clinique complète avant toute progression.";
            decision.generalDiagnosis = "Inaptitude critique constatée — Risque majeur pour l'unité";
            decision.reevalDate = "60 jours";
        }

        return {
            rawCriteriaSum,
            criteriaTotal,
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

        // Update Tab 4 totals
        document.getElementById('total-malus-display').textContent = `-${scores.malusTotal} points`;
        document.getElementById('total-bonus-display').textContent = `+${scores.bonusTotal} points`;

        // Update Tab 5 score circle & breakdown
        document.getElementById('final-score-val').textContent = scores.finalScore;
        document.getElementById('breakdown-crit-val').textContent = `${scores.criteriaTotal} pts`;
        document.getElementById('breakdown-bonus-val').textContent = `+${scores.bonusTotal} pts`;
        document.getElementById('breakdown-malus-val').textContent = `-${scores.malusTotal} pts`;
        document.getElementById('breakdown-custom-val').textContent = `${scores.customAdjustmentsTotal >= 0 ? '+' : ''}${scores.customAdjustmentsTotal} pts`;
        document.getElementById('breakdown-total-val').textContent = `${scores.finalScore} / 50`;

        // Update decision card
        const badge = document.getElementById('decision-badge');
        badge.className = `decision-status-badge ${scores.decision.statusClass}`;
        badge.textContent = scores.decision.title;

        document.getElementById('decision-title').textContent = scores.decision.title;
        document.getElementById('decision-description').textContent = scores.decision.description;

        // Render printable report
        renderPrintableReport();
    }

    // Add Custom Adjustment Button Event ("Autre")
    document.getElementById('btn-add-custom-adjustment').addEventListener('click', () => {
        const labelInput = document.getElementById('custom-adj-label');
        const typeSelect = document.getElementById('custom-adj-type');
        const ptsInput = document.getElementById('custom-adj-pts');

        const label = labelInput.value.trim();
        const type = typeSelect.value;
        const pts = Math.abs(parseInt(ptsInput.value) || 0);

        if (!label) {
            alert("Veuillez saisir un motif pour l'ajustement 'Autre'.");
            return;
        }

        if (pts <= 0) {
            alert("Le nombre de points doit être supérieur à 0.");
            return;
        }

        appState.customAdjustments.push({
            id: 'adj-' + Date.now(),
            label: label,
            type: type,
            pts: pts
        });

        labelInput.value = '';
        renderCustomAdjustmentsList();
        updateCalculations();
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

            const selectedMalusItems = [...MALUS_DATA.light, ...MALUS_DATA.moderate, ...MALUS_DATA.severe]
                .filter(m => appState.selectedMalus.includes(m.id))
                .map(m => `${m.label} (-${m.pts} pts)`).join(', ') || 'Aucun malus retenu';

            const selectedBonusItems = BONUS_DATA
                .filter(b => appState.selectedBonus.includes(b.id))
                .map(b => `${b.label} (+${b.pts} pts)`).join(', ') || 'Aucun bonus appliqué';

            const customAdjustmentsText = appState.customAdjustments.length > 0
                ? appState.customAdjustments.map(a => `${a.label} (${a.type === 'add' ? '+' : '-'}${a.pts} pts)`).join(', ')
                : 'Aucun ajustement "Autre"';

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
                    <div><strong>Score Global :</strong> ${scores.finalScore} / 50 pts</div>
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
                    <div class="doc-section-title">3. DIAGNOSTICS, BONUS & AJUSTEMENTS "AUTRE"</div>
                    <p><strong>Diagnostics retenus (Malus Standard: -${scores.malusTotal} pts) :</strong> ${selectedMalusItems}</p>
                    <p style="font-size: 13px; color: #444; margin-top: 2px;"><em>Justification :</em> ${appState.malusJustification || 'Aucune justification enregistrée.'}</p>
                    <br>
                    <p><strong>Bonus de mérite (Bonus Standard: +${scores.bonusTotal} pts max) :</strong> ${selectedBonusItems}</p>
                    <p style="font-size: 13px; color: #444; margin-top: 2px;"><em>Justification :</em> ${appState.bonusJustification || 'Aucune justification enregistrée.'}</p>
                    <br>
                    <p><strong>Ajustements "Autre" Sur-Mesure (${scores.customAdjustmentsTotal >= 0 ? '+' : ''}${scores.customAdjustmentsTotal} pts) :</strong> ${customAdjustmentsText}</p>
                </div>

                <div class="doc-section">
                    <div class="doc-section-title">4. DÉCISION FINALE & RECOMMANDATIONS CLINIQUES</div>
                    <div style="background: #e9decb; border-left: 4px solid #3d0c11; padding: 12px 16px; margin-top: 6px;">
                        <h4 style="font-size: 16px; color: #3d0c11;">${scores.decision.title} (Score: ${scores.finalScore} / 50)</h4>
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

    function selectRandomScenarios(count = 3) {
        const shuffled = [...SCENARIOS_BANK].sort(() => 0.5 - Math.random());
        appState.activeScenarios = shuffled.slice(0, count);
        renderScenariosSection();
    }

    // Navigation Tabs Switcher
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(tabTarget);
            if (targetPane) targetPane.classList.add('active');
        });
    });

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

    // Textareas justification
    document.getElementById('malus-justification').addEventListener('input', (e) => {
        appState.malusJustification = e.target.value;
        renderPrintableReport();
    });
    document.getElementById('bonus-justification').addEventListener('input', (e) => {
        appState.bonusJustification = e.target.value;
        renderPrintableReport();
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

    // Save Patient to LocalStorage History
    document.getElementById('btn-save-patient').addEventListener('click', () => {
        if (!appState.patient.name) {
            alert("Veuillez renseigner le nom du shinobi avant d'enregistrer le dossier.");
            return;
        }

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
        alert(`Dossier clinique de ${appState.patient.name} enregistré avec succès !`);
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
                <td><strong style="color: var(--sand-primary);">${item.score} / 50</strong></td>
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
});
