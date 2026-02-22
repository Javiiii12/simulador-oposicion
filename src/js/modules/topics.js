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
        <strong>${baseTema}</strong><br>
        <span style="font-size:0.9em; color:#555;">${titulo}</span><br>
        <small>${temaQ.length} preguntas ${hasBlocks ? '(Contiene Bloques 📂)' : ''}</small>
    `;
    btn.addEventListener('click', () => {
        const subTemas = [...new Set(temaQ.map(q => q.tema))];
        if (hasBlocks && subTemas.length > 1) showBlocksMenu(baseTema, subTemas, temaQ);
        else prepareModeSelection(baseTema, () => temaQ);
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
        const n = baseTema.match(/\d+/);
        showTopics(n && parseInt(n[0]) <= 6 ? 'GENERAL' : 'ESPECIFICA');
    });
    container.appendChild(btnBack);

    // "All blocks" button
    const btnAll = document.createElement('button');
    btnAll.className = 'btn-topic';
    btnAll.style.background = '#e3f2fd';
    btnAll.innerHTML = `<strong>${baseTema} COMPLETO</strong><br><small>Mezclar todos los bloques (${temaQ.length} pregs)</small>`;
    btnAll.addEventListener('click', () => prepareModeSelection(`${baseTema} (Todos)`, () => temaQ));
    container.appendChild(btnAll);

    // Individual block buttons
    subTemas.forEach(subTema => {
        const qCount = temaQ.filter(q => q.tema === subTema).length;
        let displayTitle = subTema.replace(baseTema, '').replace(':', '').trim() || subTema;
        const btn = document.createElement('button');
        btn.className = 'btn-topic';
        btn.innerHTML = `<strong>${displayTitle}</strong><br><small>${qCount} preguntas</small>`;
        btn.addEventListener('click', () => prepareModeSelection(subTema, () => temaQ.filter(q => q.tema === subTema)));
        container.appendChild(btn);
    });
}
