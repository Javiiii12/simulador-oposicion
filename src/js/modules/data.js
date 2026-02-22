import { state } from './state.js';

export async function loadAllData() {
    try {
        console.log("Fetching question data...");

        // Paths are relative to the HTML document (root of the project).
        // GitHub Pages serves from /simulador-oposicion/, so these paths are correct.
        const [resMad, resCsif] = await Promise.all([
            fetch('data/preguntas.json'),
            fetch('data/csif_questions.json')
        ]);

        if (!resMad.ok) throw new Error(`HTTP ${resMad.status} al cargar preguntas.json`);

        const textMad = await resMad.text();
        let textCsif = '[]';
        if (resCsif.ok) {
            textCsif = await resCsif.text();
        }

        // Sanitize BOM (Byte Order Mark) that corrupts JSON.parse()
        const sanitize = (str) => str.replace(/^\uFEFF/, '').trim();

        const madData = JSON.parse(sanitize(textMad));
        const csifData = JSON.parse(sanitize(textCsif));

        // Tag each question with its source
        const madWithSource = madData.map(q => ({ ...q, source: q.origen || 'MAD' }));
        const csifWithSource = csifData.map(q => ({ ...q, source: q.origen || 'CSIF' }));

        state.allQuestions = [...madWithSource, ...csifWithSource];
        console.log(`Successfully loaded ${state.allQuestions.length} questions.`);
        return state.allQuestions;

    } catch (err) {
        console.error("CRITICAL: Error loading questions:", err);
        // Show a non-blocking message instead of an alert that freezes the UI
        const msg = document.getElementById('access-msg');
        if (msg) msg.innerText = `⚠️ Error al cargar datos: ${err.message}`;
        return [];
    }
}
