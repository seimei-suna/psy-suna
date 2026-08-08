/* ==========================================================================
   SEIMEI - SUNA : camp-resultats.js
   Vue réservée au grade Fudan Shō (et à la Gérance/Seimei) : liste des
   évaluations initiales Camp de Redressement, résultat uniquement
   (niveau de dangerosité + synthèse). La requête Supabase ne sélectionne
   volontairement PAS les colonnes "reponses" et "score_total" — les
   réponses ouvertes et le détail des points restent réservés aux
   psychologues qui étudient le dossier.
   ========================================================================== */

async function loadCampResultats() {
    const listEl = document.getElementById('camp-resultats-list');
    const emptyEl = document.getElementById('camp-resultats-empty');
    if (!sb) return;

    try {
        const res = await sb.from('psy_camp_evaluations')
            .select('id, created_at, patient_nom, psy_nom, etat_mental, niveau_dangerosite')
            .order('created_at', { ascending: false });
        if (res.error) throw new Error(res.error.message);

        const rows = res.data || [];
        emptyEl.classList.toggle('hidden', rows.length > 0);
        listEl.innerHTML = rows.map(r => {
            const tier = CAMP_DANGER_TIERS.find(t => t.id === r.niveau_dangerosite);
            return `
                <div class="dossier-card">
                    <div class="dossier-head">
                        <span class="dossier-name">${escapeHtml(r.patient_nom)}</span>
                        <span class="risque-badge ${tier ? tier.badgeClass : ''}">${escapeHtml(r.etat_mental || (tier ? tier.label : '—'))}</span>
                    </div>
                    <div class="dossier-meta">Évalué le ${formatDateFr(r.created_at)}${r.psy_nom ? ' — ' + escapeHtml(r.psy_nom) : ''}</div>
                    ${tier ? `<p class="detail-text" style="margin-top:8px;">${escapeHtml(tier.description)}</p>` : ''}
                </div>
            `;
        }).join('');
    } catch (e) {
        listEl.innerHTML = `<div class="dossiers-empty" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth((user) => {
        if (!requireRole(user, ['fudan_sho', 'gerance_psy', 'seimei'])) return;
        loadCampResultats();
    });
});
