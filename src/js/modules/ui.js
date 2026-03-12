import * as Storage from './storage.js';
import { state } from './state.js';

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
 * @param {boolean} addToHistory - whether to record this in navigation history
 */
export function showView(viewName, addToHistory = true) {
    const targetId = VIEW_IDS[viewName] || viewName;
    const target = document.getElementById(targetId);
    if (!target) {
        console.warn(`showView: no element found for "${viewName}" (id: "${targetId}")`);
        return;
    }

    // Capture current view before switching if adding to history
    if (addToHistory) {
        const currentActive = Object.values(VIEW_IDS).find(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains('active');
        });
        if (currentActive && currentActive !== targetId) {
            state.viewHistory.push(currentActive);
        }
    }

    // Hide all views
    Object.values(VIEW_IDS).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });

    // Show the target view
    target.classList.remove('hidden');
    target.classList.add('active');
    window.scrollTo(0, 0);
}

/**
 * Navega a la vista anterior en el historial.
 */
export function goBack() {
    if (state.viewHistory.length > 0) {
        const prevViewId = state.viewHistory.pop();
        // search the key for the ID
        const viewKey = Object.keys(VIEW_IDS).find(key => VIEW_IDS[key] === prevViewId) || prevViewId;
        showView(viewKey, false);
    } else {
        // Fallback safety
        showView('menu');
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
 * Recorre los récords e inyecta badges de forma discreta.
 */
export function renderizarRecordsMenu() {
    const records = Storage.getRecords();
    
    // Limpiar todos los badges y estilos previos primero
    document.querySelectorAll('.badge-record').forEach(b => b.remove());
    document.querySelectorAll('.card-has-record').forEach(c => c.classList.remove('card-has-record'));

    // Iterar sobre los récords guardados
    Object.keys(records).forEach(testId => {
        const score = records[testId];
        
        // Estrategia 1: Buscar por ID directo o ID generado
        let btn = document.getElementById(`btn-topic-${testId}`) || document.getElementById(testId);
        
        // Estrategia 2: Buscar por atributo data-testid
        if (!btn) {
            btn = document.querySelector(`[data-testid="${testId}"]`);
        }

        if (btn) {
            btn.classList.add('card-has-record');
            
            // Determinar icono según nota
            let icon = '❌';
            if (score >= 9) icon = '🏆';
            else if (score >= 7) icon = '🎖️';
            else if (score >= 5) icon = '✅';

            // Inyectar badge discreto (Sello de completado)
            const badge = document.createElement('span');
            badge.className = 'badge-record';
            // Formato: Icono dinámico + Trofeo fijo + Nota
            badge.innerHTML = `${icon} 🏆 ${score.toFixed(1)}`;
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
