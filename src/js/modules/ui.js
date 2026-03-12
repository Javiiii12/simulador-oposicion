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

    // ACTUALIZACIÓN: Renderizar progreso global si estamos en vistas que lo muestran
    if (viewName === 'menu' || viewName === 'parts') {
        renderizarProgresoGlobal();
    }

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
            // NUEVO FORMATO: ✅ Completado | 🏆 8.5
            badge.innerHTML = `${icon} <span style="margin-left:2px;">Completado</span> <span style="margin:0 4px; opacity:0.5;">|</span> 🏆 ${score.toFixed(1)}`;
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

/**
 * Calcula y renderiza barras de progreso en tarjetas que agrupan temas.
 */
export function renderizarProgresoGlobal() {
    const records = Storage.getRecords();
    const allQuestions = state.allQuestions;

    // 1. Identificar contenedores de categorías/bloques
    // Mapeo: ID del botón -> Filtro de temas/origen
    const categories = [
        { id: 'btn-source-mad', filter: q => q.origen === 'MAD' },
        { id: 'btn-source-csif', filter: q => q.origen === 'CSIF' },
        { id: 'btn-source-academia', filter: q => q.origen === 'Academia' },
        { id: 'btn-part-general', filter: q => {
            const m = q.tema && q.tema.match(/tema\s+(\d+)/i);
            return m && parseInt(m[1]) >= 1 && parseInt(m[1]) <= 6;
        }},
        { id: 'btn-part-especifica', filter: q => {
            const m = q.tema && q.tema.match(/tema\s+(\d+)/i);
            return m && parseInt(m[1]) >= 7 && parseInt(m[1]) <= 16;
        }}
    ];

    categories.forEach(cat => {
        const btn = document.getElementById(cat.id);
        if (!btn) return;

        // Limpiar progreso previo si existe
        const oldWrap = btn.querySelector('.global-progress-wrapper');
        if (oldWrap) oldWrap.remove();

        const catQuestions = allQuestions.filter(cat.filter);
        if (catQuestions.length === 0) return;

        // Obtener temas únicos dentro de esta categoría
        const uniqueTemas = [...new Set(catQuestions.map(q => {
            const m = q.tema && q.tema.match(/(Tema \d+)/i);
            return m ? m[1] : q.tema;
        }))].filter(t => t && !t.startsWith('Examen'));

        // Calcular cuántos de estos temas tienen algún récord > 0
        let completedCount = 0;
        let totalScore = 0;
        let countWithScore = 0;

        // Para cada tema base, buscamos si hay algún récord guardado que empiece por ese slug
        uniqueTemas.forEach(baseTema => {
            // Nota: Aquí asumimos que el testId empieza por "fuente_temaX"
            // Buscamos en records cualquier key que contenga este tema
            // Es una aproximación, lo ideal sería tener un mapeo más estricto
            const themeSlug = slugify(baseTema);
            const relatedRecords = Object.keys(records).filter(k => k.includes(themeSlug));
            
            if (relatedRecords.length > 0) {
                completedCount++;
                const maxInTheme = Math.max(...relatedRecords.map(k => records[k]));
                totalScore += maxInTheme;
                countWithScore++;
            }
        });

        const pct = uniqueTemas.length > 0 ? Math.round((completedCount / uniqueTemas.length) * 100) : 0;
        const avg = countWithScore > 0 ? (totalScore / countWithScore).toFixed(1) : "0.0";

        // Inyectar UI
        const wrapper = document.createElement('div');
        wrapper.className = 'global-progress-wrapper';
        wrapper.innerHTML = `
            <div class="global-progress-info">
                <span>Progreso: ${pct}%</span>
                <span>Media: ${avg}</span>
            </div>
            <div class="global-progress-bar-bg">
                <div class="global-progress-bar-fill" style="width: ${pct}%"></div>
            </div>
        `;
        btn.appendChild(wrapper);
    });
}
