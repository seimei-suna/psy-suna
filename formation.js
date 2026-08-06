/* ==========================================================================
   SEIMEI - SUNA : formation.js — Formation & Communications internes
   La lecture des communications est ouverte à tout membre connecté (même
   protection "front" que le reste du site) ; la publication passe par le
   RPC publier_communication (security definer), qui revérifie le rôle
   ET le mot de passe côté serveur — le seul verrou du site qui ne peut
   pas être contourné en modifiant le JS local. Le mot de passe n'est
   donc jamais conservé en session : on le redemande à chaque publication.
   ========================================================================== */

let formationState = { comms: [], docs: [] };

function isGeranceOrSeimei(user) {
    return hasAnyRole(user, ['gerance_psy', 'seimei']);
}

function applyRoleGating() {
    const user = getCurrentUser();
    const allowed = isGeranceOrSeimei(user);
    document.getElementById('comm-publish-card').classList.toggle('hidden', !allowed);
    document.getElementById('formation-edit-card').classList.toggle('hidden', !allowed);
}

async function loadCommunications() {
    const listEl = document.getElementById('comm-list');
    if (!sb) return;
    listEl.innerHTML = '<p class="detail-text">Chargement...</p>';
    try {
        const res = await sb.from('psy_communications').select('*').order('epingle', { ascending: false }).order('created_at', { ascending: false });
        if (res.error) throw new Error(res.error.message);
        formationState.comms = res.data || [];
        renderCommunications();
    } catch (e) {
        listEl.innerHTML = `<p class="detail-text" style="color:#e74c3c;">Erreur : ${escapeHtml(e.message)}</p>`;
    }
}

function renderCommunications() {
    const listEl = document.getElementById('comm-list');
    const user = getCurrentUser();
    const canManage = isGeranceOrSeimei(user);

    if (formationState.comms.length === 0) {
        listEl.innerHTML = '<div class="dossiers-empty">Aucune communication publiée pour le moment.</div>';
        return;
    }

    listEl.innerHTML = formationState.comms.map(c => `
        <div class="comm-card ${c.epingle ? 'epingle' : ''}">
            <div class="comm-head">
                <div>
                    ${c.epingle ? '<div class="comm-pin-tag"><i class="fa-solid fa-thumbtack"></i> Épinglé</div>' : ''}
                    <div class="comm-title">${escapeHtml(c.titre)}</div>
                    <div class="comm-meta">Par ${escapeHtml(c.auteur_nom || '—')} · ${formatDateTimeFr(c.created_at)}</div>
                </div>
                ${canManage ? `<button type="button" class="btn btn-danger btn-sm comm-delete-btn" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
            <div class="comm-body">${escapeHtml(c.contenu)}</div>
        </div>
    `).join('');

    listEl.querySelectorAll('.comm-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteCommunication(parseInt(btn.dataset.id)));
    });
}

async function publishCommunication() {
    const errEl = document.getElementById('comm-error');
    errEl.textContent = '';
    const user = getCurrentUser();
    if (!user) return;

    const titre = document.getElementById('comm-titre').value.trim();
    const contenu = document.getElementById('comm-contenu').value.trim();
    const epingle = document.getElementById('comm-epingle').checked;
    const sceau = document.getElementById('comm-sceau').value;

    if (!titre || !contenu) { errEl.textContent = 'Titre et contenu requis.'; return; }
    if (!sceau) { errEl.textContent = 'Confirmez votre mot de passe pour publier.'; return; }

    const btn = document.getElementById('btn-publish-comm');
    btn.disabled = true;
    try {
        const hash = await hashSceauPsy(sceau);
        const res = await sb.rpc('publier_communication', {
            p_auteur_id: user.id, p_sceau_hash: hash, p_titre: titre, p_contenu: contenu, p_epingle: epingle
        });
        if (res.error) throw new Error(res.error.message);

        document.getElementById('comm-titre').value = '';
        document.getElementById('comm-contenu').value = '';
        document.getElementById('comm-epingle').checked = false;
        document.getElementById('comm-sceau').value = '';
        await loadCommunications();
    } catch (e) {
        errEl.textContent = e.message;
    } finally {
        btn.disabled = false;
    }
}

async function deleteCommunication(id) {
    const user = getCurrentUser();
    if (!user) return;
    const sceau = prompt('Confirmez votre mot de passe pour supprimer cette communication :');
    if (!sceau) return;
    try {
        const hash = await hashSceauPsy(sceau);
        const res = await sb.rpc('supprimer_communication', { p_id: id, p_auteur_id: user.id, p_sceau_hash: hash });
        if (res.error) throw new Error(res.error.message);
        await loadCommunications();
    } catch (e) {
        alert('Suppression impossible : ' + e.message);
    }
}

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
    const user = getCurrentUser();
    const canManage = isGeranceOrSeimei(user);

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
    requireAuth(() => {
        applyRoleGating();
        loadCommunications();
        loadFormationDocs();
    });

    document.getElementById('btn-publish-comm').addEventListener('click', publishCommunication);
    document.getElementById('btn-add-formation').addEventListener('click', addFormationDoc);
});
