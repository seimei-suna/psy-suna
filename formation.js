/* ==========================================================================
   SEIMEI - SUNA : formation.js — Formation des nouveaux psychologues
   ========================================================================== */

let formationState = { docs: [] };

async function loadFormationDocs() {
    const listEl = document.getElementById('formation-list');
    if (!sb) return;
    listEl.innerHTML = '<p class="detail-text">Chargement...</p>';
    try {
        const res = await sb.from('psy_documents').select('*').eq('categorie', 'formation').order('ordre', { ascending: true }).order('created_at', { ascending: true });
        if (res.error) throw new Error(res.error.message);
        formationState.docs = res.data || [];
        renderFormationDocs();
    } catch (e) {
        listEl.innerHTML = `<p class="detail-text" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</p>`;
    }
}

function renderFormationDocs() {
    const listEl = document.getElementById('formation-list');
    const canManage = hasAnyRole(getCurrentUser(), ['gerance_psy', 'seimei']);

    if (formationState.docs.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucune ressource de formation pour le moment.</div>';
        return;
    }

    listEl.innerHTML = formationState.docs.map(d => `
        <div class="doc-list-item">
            <div class="dossier-head">
                <h3>${escapeHtml(d.titre)}</h3>
                ${canManage ? `<button type="button" class="btn btn-danger btn-sm doc-delete-btn" data-id="${d.id}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
            <div class="doc-content">${escapeHtml(d.contenu || '')}</div>
        </div>
    `).join('');

    listEl.querySelectorAll('.doc-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteFormationDoc(parseInt(btn.dataset.id)));
    });
}

async function addFormationDoc() {
    const titre = document.getElementById('formation-titre').value.trim();
    const contenu = document.getElementById('formation-contenu').value.trim();
    if (!titre) return;
    const user = getCurrentUser();
    try {
        const res = await sb.from('psy_documents').insert([{
            categorie: 'formation', titre, contenu, ordre: formationState.docs.length,
            updated_by_nom: user ? `${user.prenom} ${user.nom}` : null
        }]);
        if (res.error) throw new Error(res.error.message);
        document.getElementById('formation-titre').value = '';
        document.getElementById('formation-contenu').value = '';
        await loadFormationDocs();
    } catch (e) {
        alert('Ajout impossible : ' + e.message);
    }
}

async function deleteFormationDoc(id) {
    if (!confirm('Supprimer cette ressource de formation ?')) return;
    try {
        const res = await sb.from('psy_documents').delete().eq('id', id);
        if (res.error) throw new Error(res.error.message);
        await loadFormationDocs();
    } catch (e) {
        alert('Suppression impossible : ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth((user) => {
        if (!requireRole(user, ['psychologue', 'gerance_psy', 'seimei'], null,
            "Cet espace est réservé aux psychologues, à la Gérance et à la Seimei. Le grade Fudan Shō a accès aux Résultats Camp de Redressement.")) return;
        const canManage = hasAnyRole(user, ['gerance_psy', 'seimei']);
        document.getElementById('formation-edit-card').classList.toggle('hidden', !canManage);
        loadFormationDocs();
    });

    document.getElementById('btn-add-formation').addEventListener('click', addFormationDoc);
});
