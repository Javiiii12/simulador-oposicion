/**
 * topics.js — Handles source → part → topic navigation and mode selection.
 * Ported from the original script.js showParts(), showTopics(), etc.
 */
import { state } from './state.js';
import { TOPIC_TITLES } from './config.js';
import { showView } from './ui.js';

// ── Public API ────────────────────────────────────────────────────────────────

export function showParts(source) {
    state.currentSource = source;
    const titleEl = document.getElementById('parts-title');
    if (titleEl) titleEl.innerText = `Fuente: ${source}`;
    showView('parts');
}

export function showTopics(part) {
    state.currentCategory = part;
    const titleEl = document.getElementById('topic-title');

    if (titleEl) {
        if (part === 'GENERAL') titleEl.innerText = `Parte General (${state.currentSource})`;
        else if (part === 'ESPECIFICA') titleEl.innerText = `Parte Específica (${state.currentSource})`;
        else if (part === 'HISTORICO') titleEl.innerText = 'Histórico de Preguntas';
        else if (part === 'CCAA') titleEl.innerText = 'Otras Comunidades Autónomas';
    }

    // Filter by source, then by part
    let sourceQ = state.allQuestions.filter(q => {
        if (state.currentSource === 'MAD') return !q.origen || q.origen === 'MAD';
        return q.origen === state.currentSource;
    });

    let relevantQ = [];
    if (part === 'GENERAL') {
        relevantQ = sourceQ.filter(q => {
            const m = q.tema && q.tema.match(/tema\s+(\d+)/i);
            return m && parseInt(m[1]) >= 1 && parseInt(m[1]) <= 6;
        });
    } else if (part === 'ESPECIFICA') {
        relevantQ = sourceQ.filter(q => {
            const m = q.tema && q.tema.match(/tema\s+(\d+)/i);
            return m && parseInt(m[1]) >= 7 && parseInt(m[1]) <= 16;
        });
    } else if (part === 'HISTORICO') {
        relevantQ = sourceQ.filter(q => q.tema && !q.tema.includes('Otras Comunidades') && !q.tema.includes('Examen 2020'));
    } else if (part === 'CCAA') {
        relevantQ = sourceQ.filter(q => q.tema && q.tema.includes('Otras Comunidades'));
    }

    if (relevantQ.length === 0) {
        alert(`⚠️ No hay preguntas en la Parte ${part} para la fuente: ${state.currentSource}.`);
        return;
    }

    // Extract unique base "Tema X" labels
    const baseTemasRaw = relevantQ.map(q => {
        const m = q.tema && q.tema.match(/(Tema \d+)/i);
        return m ? m[1] : q.tema;
    });
    const baseTemas = [...new Set(baseTemasRaw)].filter(t => t && !t.toString().startsWith('Examen'));
    baseTemas.sort((a, b) => {
        const ma = a.match(/\d+/), mb = b.match(/\d+/);
        return (ma ? parseInt(ma[0]) : 9999) - (mb ? parseInt(mb[0]) : 9999);
    });

    const container = document.getElementById('topics-container');
    container.innerHTML = '';
    baseTemas.forEach(baseTema => container.appendChild(createBaseTopicButton(baseTema, relevantQ)));
    showView('topics');
}

export function prepareModeSelection(title, generatorFn) {
    const VIEW_IDS = {
        roleSelection: 'view-role-selection', menu: 'view-menu', parts: 'view-parts',
        topics: 'view-topics', random: 'view-random', examsMenu: 'view-exams-menu',
        modeSelection: 'view-mode-selection', progress: 'view-progress', game: 'view-game', results: 'view-results'
    };
    const activeKey = Object.keys(VIEW_IDS).find(key => {
        const el = document.getElementById(VIEW_IDS[key]);
        return el && el.classList.contains('active');
    });
    if (activeKey) state.lastViewBeforeMode = activeKey;

    state.pendingTopicTitle = title;
    state.pendingGameGenerator = generatorFn;
    const el = document.getElementById('mode-topic-title');
    if (el) el.textContent = title;
    showView('modeSelection');
}

// ── Private helpers ───────────────────────────────────────────────────────────

function createBaseTopicButton(baseTema, questionsSubset) {
    const temaQ = questionsSubset.filter(q =>
        q.tema === baseTema ||
        q.tema.startsWith(baseTema + ':') ||
        q.tema.startsWith(baseTema + ' ')
    );

    let titulo = TOPIC_TITLES[baseTema] || '';
    if (state.currentSource === 'CSIF') {
        const csifTitles = {
            'Tema 5': 'Estatuto Marco',
            'Tema 7': 'Atención Primaria y Especializada',
            'Tema 8': 'Prevención de Riesgos y Plan PERSEO',
            'Tema 9': 'Higiene y Conservación de Alimentos',
            'Tema 10': 'Organización y Funciones en la Cocina',
            'Tema 11': 'Dietas y Control de Alérgenos',
            'Tema 12': 'APPCC y Trazabilidad',
            'Tema 13': 'Manipulación de Alimentos',
            'Tema 14': 'Control de materias primas y técnicas',
            'Tema 15': 'Maquinaria y Utensilios',
            'Tema 16': 'Gestión de Residuos'
        };
        if (csifTitles[baseTema]) titulo = csifTitles[baseTema];
    }
    if (titulo === baseTema) titulo = '';

    const subTemaList = [...new Set(temaQ.map(q => q.tema))];
    const bloques = subTemaList.filter(t => t.toLowerCase().includes('bloque') || t.toLowerCase().includes('test'));
    const hasBlocks = bloques.length > 0;

    const btn = document.createElement('button');
    btn.className = 'btn-topic';
    btn.innerHTML = `
        <strong>${baseTema}</strong>
        <span class="topic-title-sub">${titulo}</span>
        <small>${temaQ.length} preguntas ${hasBlocks ? '(Contiene Bloques 📂)' : ''}</small>
    `;
    btn.addEventListener('click', () => {
        const subTemas = [...new Set(temaQ.map(q => q.tema))];
        if (hasBlocks && subTemas.length > 1) {
            showBlocksMenu(baseTema, subTemas, temaQ);
        } else {
            if (temaQ.length > 20) {
                showChunksMenu(baseTema, temaQ, () => {
                    if (state.currentCategory) {
                        showTopics(state.currentCategory);
                    } else {
                        const n = baseTema.match(/\d+/);
                        showTopics(n && parseInt(n[0]) <= 6 ? 'GENERAL' : 'ESPECIFICA');
                    }
                });
            } else {
                prepareModeSelection(baseTema, () => temaQ);
            }
        }
    });
    return btn;
}

function showBlocksMenu(baseTema, subTemas, temaQ) {
    const container = document.getElementById('topics-container');
    const titleEl = document.getElementById('topic-title');
    container.innerHTML = '';
    if (titleEl) titleEl.innerText = `${baseTema} — Bloques`;

    subTemas.sort((a, b) => {
        const getN = s => {
            const m = s.match(/(?:bloque|test)\s+(\d+)/i);
            return m ? parseInt(m[1]) : 999;
        };
        return getN(a) - getN(b);
    });

    // Back button
    const btnBack = document.createElement('button');
    btnBack.className = 'btn-secondary';
    btnBack.style.marginBottom = '20px';
    btnBack.innerHTML = '⬅ Volver a Temas';
    btnBack.addEventListener('click', () => {
        if (state.currentCategory) {
            showTopics(state.currentCategory);
        } else {
            const n = baseTema.match(/\d+/);
            showTopics(n && parseInt(n[0]) <= 6 ? 'GENERAL' : 'ESPECIFICA');
        }
    });
    container.appendChild(btnBack);

    // Only include questions from numbered blocks in COMPLETO.
    // Generic subtemas (e.g. 'La Constitución') are hidden AND excluded from COMPLETO.
    const numbered = subTemas.filter(t => /(?:bloque|test)\s*\d+/i.test(t));
    const completoQ = numbered.length > 0 ? temaQ.filter(q => numbered.includes(q.tema)) : temaQ;

    // "All blocks" button
    const btnAll = document.createElement('button');
    btnAll.className = 'btn-topic';
    btnAll.style.background = '#e3f2fd';
    btnAll.innerHTML = `<strong>${baseTema} COMPLETO</strong><small>Mezclar todos los bloques (${completoQ.length} pregs)</small>`;
    btnAll.addEventListener('click', () => prepareModeSelection(`${baseTema} (Todos)`, () => completoQ));
    container.appendChild(btnAll);

    // Only render blocks that have an explicit number (Bloque N / Test N).
    // Generic subtemas are still counted in COMPLETO but not shown individually.
    const numberedSubTemas = subTemas.filter(t => /(?:bloque|test)\s*\d+/i.test(t));

    numberedSubTemas.forEach(subTema => {
        const chunkQ = temaQ.filter(q => q.tema === subTema);
        const qCount = chunkQ.length;
        let displayTitle = subTema.replace(baseTema, '').replace(':', '').trim() || subTema;
        const btn = document.createElement('button');
        btn.className = 'btn-topic';
        btn.innerHTML = `<strong>${displayTitle}</strong><small>${qCount} preguntas</small>`;
        btn.addEventListener('click', () => {
            if (chunkQ.length > 20) {
                showChunksMenu(subTema, chunkQ, () => showBlocksMenu(baseTema, subTemas, temaQ));
            } else {
                prepareModeSelection(subTema, () => chunkQ);
            }
        });
        container.appendChild(btn);
    });
}

function showChunksMenu(title, qArray, backCallback) {
    const container = document.getElementById('topics-container');
    const titleEl = document.getElementById('topic-title');
    container.innerHTML = '';
    if (titleEl) titleEl.innerText = `${title} — Partes`;

    // Back button
    const btnBack = document.createElement('button');
    btnBack.className = 'btn-secondary';
    btnBack.style.marginBottom = '20px';
    btnBack.innerHTML = '⬅ Volver';
    btnBack.addEventListener('click', backCallback);
    container.appendChild(btnBack);

    // Full test button
    const btnAll = document.createElement('button');
    btnAll.className = 'btn-topic';
    btnAll.style.background = '#e3f2fd';
    btnAll.innerHTML = `<strong>Test Completo</strong><small>Todas las preguntas (${qArray.length})</small>`;
    btnAll.addEventListener('click', () => prepareModeSelection(`${title} (Completo)`, () => qArray));
    container.appendChild(btnAll);

    // Chunks
    const chunkSize = 20;
    const numChunks = Math.ceil(qArray.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, qArray.length);
        const chunk = qArray.slice(start, end);

        const btn = document.createElement('button');
        btn.className = 'btn-topic';
        btn.innerHTML = `<strong>Parte ${i + 1}</strong><small>Preguntas ${start + 1} a ${end}</small>`;
        btn.addEventListener('click', () => prepareModeSelection(`${title} (Parte ${i + 1})`, () => chunk));
        container.appendChild(btn);
    }
}
