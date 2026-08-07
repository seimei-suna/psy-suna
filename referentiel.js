/* ==========================================================================
   SEIMEI - SUNA : RÉFÉRENTIEL EN VIGUEUR (CONSULTATION GÉRANCE)
   Page en lecture seule — tout le contenu est dérivé de data.js et
   scenarios.js, jamais saisi à la main, pour ne jamais diverger du
   barème réellement appliqué par l'outil psychologue et l'auto-test.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const SCENARIOS_BANK = (typeof FULL_100_SCENARIOS_BANK !== 'undefined') ? FULL_100_SCENARIOS_BANK : [];

    // ── Critères cliniques ──
    document.getElementById('ref-criteria-container').innerHTML = CRITERIA_DATA.map(c => `
        <div class="criterion-card" data-id="${c.id}">
            <div class="criterion-header">
                <div class="criterion-number-title">
                    <span class="criterion-num">${c.id}</span>
                    <div>
                        <h3 class="criterion-name">${c.title}</h3>
                        <p class="criterion-desc">${c.desc}</p>
                    </div>
                </div>
            </div>
            <ul class="thresholds-reference-table" style="margin-top: 6px; opacity: 0.85;">
                <li style="padding: 4px 8px; font-size: 12px; background: transparent; border: none; flex-wrap: wrap; gap: 15px;">
                    ${c.subItems.map(item => `<i class="fa-solid fa-check-double"></i> ${item}`).join('')}
                </li>
            </ul>
        </div>
    `).join('');

    // ── Échelle de notation ──
    document.getElementById('ref-levels-list').innerHTML = RATING_LEVELS.map(lvl => `
        <li><span>${lvl.pts} / 5 — ${lvl.label}</span><strong>${lvl.desc}</strong></li>
    `).join('');

    // ── Catégories de mises en situation ──
    const categories = {};
    SCENARIOS_BANK.forEach(sc => { categories[sc.category] = (categories[sc.category] || 0) + 1; });
    document.getElementById('ref-scenario-categories').innerHTML = Object.keys(categories).length
        ? Object.entries(categories).map(([cat, count]) => `
            <li><span>${cat}</span><strong>${count} scénario(s)</strong></li>
        `).join('') + `<li><span>Total de la banque</span><strong>${SCENARIOS_BANK.length} scénario(s)</strong></li>`
        : '<li><em>Aucun scénario chargé</em></li>';

    // ── Tableau de décision ──
    document.getElementById('ref-decisions-container').innerHTML = DECISIONS.map(d => `
        <div class="dossier-card" style="margin-bottom: 12px;">
            <div class="dossier-head">
                <span class="dossier-name">${d.dotColor} ${d.title}</span>
                <span class="dossier-score ${d.statusClass.replace('status-', 'dec-')}">${d.min} – ${d.max} pts</span>
            </div>
            <p class="detail-text" style="margin-top: 6px;"><strong>Décision clinique :</strong> ${d.description}</p>
            <p class="detail-text"><strong>Diagnostic général :</strong> ${d.generalDiagnosis} · <strong>Réévaluation :</strong> ${d.reevalDate}</p>
            <p class="detail-text"><strong>Message affiché au patient (auto-test) :</strong> <em>${d.patientMessage}</em></p>
        </div>
    `).join('');

});
