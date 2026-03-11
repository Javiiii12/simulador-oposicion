/**
 * ui.js — View navigation and DOM helpers
 * All view IDs must match what exists in index.html.
 */

const VIEW_IDS = {
    roleSelection: 'view-role-selection',
    menu: 'view-menu',
    parts: 'view-parts',
    topics: 'view-topics',
    random: 'view-random',
    examsMenu: 'view-exams-menu',
    modeSelection: 'view-mode-selection',
    progress: 'view-progress',
    game: 'view-game',
    results: 'view-results'
};

/**
 * Show a named view and hide all others.
 * @param {string} viewName - key from VIEW_IDS
 */
export function showView(viewName) {
    // Hide all views
    Object.values(VIEW_IDS).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });

    // Show the target view
    const targetId = VIEW_IDS[viewName] || viewName;
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        console.warn(`showView: no element found for "${viewName}" (id: "${targetId}")`);
    }
}

/**
 * Show or hide any element by ID using the .hidden class.
 * @param {string} id
 * @param {boolean} visible
 */
export function toggleEl(id, visible) {
    const el = document.getElementById(id);
    if (!el) return;
    if (visible) el.classList.remove('hidden');
    else el.classList.add('hidden');
}

/**
 * Update the failure badge counter in the menu.
 * @param {number} count
 */
export function updateFailureBadge(count) {
    const badge = document.getElementById('badge-failures');
    const btnFail = document.getElementById('btn-failures');

    if (count > 0) {
        if (badge) { badge.innerText = count; badge.classList.remove('hidden'); }
        if (btnFail) { btnFail.disabled = false; btnFail.style.opacity = '1'; }
    } else {
        if (badge) badge.classList.add('hidden');
        if (btnFail) { btnFail.disabled = true; btnFail.style.opacity = '0.5'; }
    }
}

/**
 * Recorre todos los botones con data-testid e inyecta el badge del récord si existe.
 */
export function renderizarRecordsMenu() {
    const records = Storage.getRecords();
    const buttons = document.querySelectorAll('[data-testid], .btn-topic');

    buttons.forEach(btn => {
        const testId = btn.getAttribute('data-testid') || 
                      (btn.querySelector('strong') ? slugify(`${state.currentSource || ''}_${btn.querySelector('strong').innerText}`) : null);
        
        if (!testId) return;

        // Limpiar badge anterior si existe
        const oldBadge = btn.querySelector('.badge-record');
        if (oldBadge) oldBadge.remove();

        if (records[testId]) {
            const badge = document.createElement('span');
            badge.className = 'badge-record';
            badge.innerHTML = `🏆 ${records[testId].toFixed(1)}`;
            btn.style.position = 'relative'; // Asegurar que el badge se posicione bien
            btn.appendChild(badge);
        }
    });
}

export function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '_')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
