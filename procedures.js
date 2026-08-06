/* ==========================================================================
   SEIMEI - SUNA : procedures.js — Procédures de la branche
   ========================================================================== */

let proceduresState = { docs: [] };

async function loadProcedures() {
    const listEl = document.getElementById('procedures-list');
    if (!sb) return;
    listEl.innerHTML = '<p class="detail-text">Chargement...</p>';
    try {
        const res = await sb.from('psy_documents').select('*').eq('categorie', 'procedure').order('ordre', { ascending: true }).order('created_at', { ascending: true });
        if (res.error) throw new Error(res.error.message);
        proceduresState.docs = res.data || [];
        renderProcedures();
    } catch (e) {
        listEl.innerHTML = `<p class="detail-text" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</p>`;
    }
}

function renderProcedures() {
    const listEl = document.getElementById('procedures-list');
    const canManage = hasAnyRole(getCurrentUser(), ['gerance_psy', 'seimei']);

    if (proceduresState.docs.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucune procédure enregistrée pour le moment.</div>';
        return;
    }

    listEl.innerHTML = proceduresState.docs.map(d => `
        <div class="doc-list-item">
            <div class="dossier-head">
                <h3>${escapeHtml(d.titre)}</h3>
                ${canManage ? `<button type="button" class="btn btn-danger btn-sm proc-delete-btn" data-id="${d.id}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
            <div class="doc-content">${escapeHtml(d.contenu || '')}</div>
        </div>
    `).join('');

    listEl.querySelectorAll('.proc-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProcedure(parseInt(btn.dataset.id)));
    });
}

async function addProcedure() {
    const titre = document.getElementById('procedure-titre').value.trim();
    const contenu = document.getElementById('procedure-contenu').value.trim();
    if (!titre) return;
    const user = getCurrentUser();
    try {
        const res = await sb.from('psy_documents').insert([{
            categorie: 'procedure', titre, contenu, ordre: proceduresState.docs.length,
            updated_by_nom: user ? `${user.prenom} ${user.nom}` : null
        }]);
        if (res.error) throw new Error(res.error.message);
        document.getElementById('procedure-titre').value = '';
        document.getElementById('procedure-contenu').value = '';
        await loadProcedures();
    } catch (e) {
        alert('Ajout impossible : ' + e.message);
    }
}

async function deleteProcedure(id) {
    if (!confirm('Supprimer cette procédure ?')) return;
    try {
        const res = await sb.from('psy_documents').delete().eq('id', id);
        if (res.error) throw new Error(res.error.message);
        await loadProcedures();
    } catch (e) {
        alert('Suppression impossible : ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth(() => {
        const canManage = hasAnyRole(getCurrentUser(), ['gerance_psy', 'seimei']);
        document.getElementById('procedures-edit-card').classList.toggle('hidden', !canManage);
        loadProcedures();
    });

    document.getElementById('btn-add-procedure').addEventListener('click', addProcedure);
});
