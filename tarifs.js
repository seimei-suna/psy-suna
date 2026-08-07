/* ==========================================================================
   SEIMEI - SUNA : tarifs.js — Tableau des tarifs (lecture publique,
   édition Gérance/Seimei). Contrairement aux autres pages, celle-ci ne
   passe pas par requireAuth() : elle doit rester consultable sans
   compte (patients compris).
   ========================================================================== */

let tarifsState = { rows: [] };

async function loadTarifs() {
    if (!sb) return;
    try {
        const res = await sb.from('psy_tarifs').select('*').order('ordre', { ascending: true }).order('id', { ascending: true });
        if (res.error) throw new Error(res.error.message);
        tarifsState.rows = res.data || [];
        renderTarifs();
    } catch (e) {
        console.error(e);
    }
}

function renderTarifs() {
    const body = document.getElementById('tarifs-body');
    const empty = document.getElementById('tarifs-empty');
    const canManage = hasAnyRole(getCurrentUser(), ['gerance_psy', 'seimei']);

    if (tarifsState.rows.length === 0) {
        body.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    body.innerHTML = tarifsState.rows.map(t => `
        <tr>
            <td>${escapeHtml(t.prestation)}</td>
            <td class="price">${escapeHtml(t.prix)}</td>
            <td>${canManage ? `<button type="button" class="btn btn-danger btn-sm tarif-delete-btn" data-id="${t.id}"><i class="fa-solid fa-trash"></i></button>` : ''}</td>
        </tr>
    `).join('');

    body.querySelectorAll('.tarif-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTarif(parseInt(btn.dataset.id)));
    });
}

async function addTarif() {
    const prestation = document.getElementById('tarif-prestation').value.trim();
    const prix = document.getElementById('tarif-prix').value.trim();
    if (!prestation || !prix) return;
    try {
        const res = await sb.from('psy_tarifs').insert([{ prestation, prix, ordre: tarifsState.rows.length }]);
        if (res.error) throw new Error(res.error.message);
        document.getElementById('tarif-prestation').value = '';
        document.getElementById('tarif-prix').value = '';
        await loadTarifs();
    } catch (e) {
        alert('Ajout impossible : ' + e.message);
    }
}

async function deleteTarif(id) {
    if (!confirm('Supprimer cette ligne de tarif ?')) return;
    try {
        const res = await sb.from('psy_tarifs').delete().eq('id', id);
        if (res.error) throw new Error(res.error.message);
        await loadTarifs();
    } catch (e) {
        alert('Suppression impossible : ' + e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar('tarifs');
    const canManage = hasAnyRole(getCurrentUser(), ['gerance_psy', 'seimei']);
    document.getElementById('tarifs-edit-card').classList.toggle('hidden', !canManage);
    loadTarifs();
    document.getElementById('btn-add-tarif').addEventListener('click', addTarif);
});
