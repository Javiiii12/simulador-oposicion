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
    if (viewName === 'examsMenu') {
        renderizarProgresoExamenes();
    }
    if (viewName === 'topics') {
        // Al volver a temas, refrescar todos los progress bars que haya en el contenedor
        document.querySelectorAll('#topics-container .btn-topic').forEach(btn => {
            const testId = btn.getAttribute('data-testid');
            if (testId) {
                // El filtro es complejo de recuperar, así que usamos la lógica de slugify
                // Para temas base, q.tema.startsWith(baseTema). 
                // Para chunks, q.tema === chunkQ.
                // En topics.js ya inyectamos el progreso. Aquí solo queremos que se ACTUALICE.
                // Para simplificar, si el botón tiene data-testid, renderizarProgresoEnCard lo puede manejar
                // si le pasamos un filtro genérico basado en el testId.
                // Pero es mejor que la propia función renderizarProgresoEnCard lo detecte.
                renderizarProgresoEnCard(btn, null); 
            }
        });
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

    // 1. Identificar contenedores de categorías/bloques (Nivel 1 y 2)
    const categories = [
        { id: 'btn-source-mad', filter: q => q.origen === 'MAD' },
        { id: 'btn-source-csif', filter: q => q.origen === 'CSIF' },
        { id: 'btn-source-academia', filter: q => q.origen === 'Academia' },
        { id: 'btn-source-examenes', filter: q => q.source === 'Histo' || q.origen === 'Historico' },
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
        if (btn) renderizarProgresoEnCard(btn, cat.filter);
    });
}

/**
 * Inyecta una barra de progreso y nota media en un elemento basado en un filtro de preguntas.
 * Se usa para Niveles 1, 2 y 3 (Granularidad total).
 */
export function renderizarProgresoEnCard(element, questionsFilter) {
    if (!element) return;
    const records = Storage.getRecords();
    const allQuestions = state.allQuestions;

    // Quitar previo
    const oldWrap = element.querySelector('.global-progress-wrapper');
    if (oldWrap) oldWrap.remove();

    let filteredQs = [];
    if (questionsFilter) {
        filteredQs = allQuestions.filter(questionsFilter);
    } else {
        // Intentar inferir filtro del testId (útil para refrescos al volver de resultados)
        const testId = element.getAttribute('data-testid') || (element.id && element.id.replace('btn-topic-', ''));
        if (testId) {
            // Buscamos preguntas que coincidan con este testId (aproximación por tema)
            // Esto es necesario para que al "Volver a Selección" se actualice la barra
            filteredQs = allQuestions.filter(q => slugify(q.tema).includes(testId) || slugify(q.origen).includes(testId));
        }
    }

    if (filteredQs.length === 0) return;

    // Temas únicos en este subconjunto
    const uniqueTemas = [...new Set(filteredQs.map(q => {
        const m = q.tema && q.tema.match(/(Tema \d+)/i);
        return m ? m[1] : q.tema;
    }))].filter(t => t && !t.startsWith('Examen'));

    let completedCount = 0;
    let totalScore = 0;
    let countWithScore = 0;

    uniqueTemas.forEach(baseTema => {
        const themeSlug = slugify(baseTema);
        // Buscamos récords que pertenezcan a este tema
        const relatedKeys = Object.keys(records).filter(k => k.includes(themeSlug));
        
        if (relatedKeys.length > 0) {
            completedCount++;
            const maxInTheme = Math.max(...relatedKeys.map(k => records[k]));
            totalScore += maxInTheme;
            countWithScore++;
        }
    });

    // Si es un Examen Oficial (Nivel 3 específico)
    // Buscamos si el propio element tiene un testId y si ese testId está en records
    const testId = element.getAttribute('data-testid') || (element.id && element.id.replace('btn-topic-', ''));
    if (testId && records[testId] !== undefined) {
        // Si es un botón individual, el progreso es binario (o nota directa)
        // Pero para mantener la consistencia de la barra:
        const score = records[testId];
        injectProgressHTML(element, 100, score.toFixed(1));
        return;
    }

    const pct = uniqueTemas.length > 0 ? Math.round((completedCount / uniqueTemas.length) * 100) : 0;
    const avg = countWithScore > 0 ? (totalScore / countWithScore).toFixed(1) : "0.0";

    if (pct > 0 || countWithScore > 0) {
        injectProgressHTML(element, pct, avg);
    }
}

function injectProgressHTML(element, pct, avg) {
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
    element.appendChild(wrapper);
}

/**
 * Renderiza progreso específico para la sección de exámenes.
 */
export function renderizarProgresoExamenes() {
    const exams = [
        { id: 'btn-topic-ope_2024_cel', filter: q => q.tema === 'Examen Oficial Celador/a SESCAM 2024' },
        { id: 'btn-topic-ope_2020_ord', filter: q => q.tema === 'Examen 2020 (Ordinario)' },
        { id: 'btn-topic-ope_2020_extra', filter: q => q.tema === 'Examen 2020 (Extraordinario)' },
        { id: 'btn-examenes-ccaa', filter: q => q.tema && q.tema.includes('Otras Comunidades') },
        { id: 'btn-examenes-historico', filter: q => q.tema && !q.tema.includes('Otras Comunidades') && !q.tema.includes('Examen 2020') && !q.tema.includes('SESCAM 2024') }
    ];

    exams.forEach(ex => {
        const btn = document.getElementById(ex.id);
        if (btn) renderizarProgresoEnCard(btn, ex.filter);
    });
}
