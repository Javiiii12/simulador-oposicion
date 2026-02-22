import { state } from './state.js';

/**
 * Normalises an Academia-format question (array opciones + respuesta_correcta)
 * into the standard app format (object opciones {a,b,c,d} + correcta letter).
 */
function normalizeAcademiaQuestion(q, source) {
    const letters = ['a', 'b', 'c', 'd'];
    const opcionesObj = {};
    (q.opciones || []).forEach((text, i) => {
        if (letters[i]) opcionesObj[letters[i]] = text;
    });

    // Find which letter corresponds to respuesta_correcta
    const correctIdx = (q.opciones || []).indexOf(q.respuesta_correcta);
    const correcta = correctIdx >= 0 ? letters[correctIdx] : 'a';

    return {
        id: q.id,
        tema: q.tema,
        pregunta: q.pregunta,
        opciones: opcionesObj,
        correcta,
        origen: source,
        source
    };
}

export async function loadAllData() {
    try {
        console.log("Fetching question data...");

        const [resMad, resCsif, resAcad] = await Promise.all([
            fetch('data/preguntas.json'),
            fetch('data/csif_questions.json'),
            fetch('data/academia_tema1.json')
        ]);

        if (!resMad.ok) throw new Error(`HTTP ${resMad.status} al cargar preguntas.json`);

        const textMad = await resMad.text();
        const textCsif = resCsif.ok ? await resCsif.text() : '[]';
        const textAcad = resAcad.ok ? await resAcad.text() : '[]';

        // Sanitize BOM (Byte Order Mark) that corrupts JSON.parse()
        const sanitize = (str) => str.replace(/^\uFEFF/, '').trim();

        const madData = JSON.parse(sanitize(textMad));
        const csifData = JSON.parse(sanitize(textCsif));
        const acadData = JSON.parse(sanitize(textAcad));

        // Tag standard format sources
        const madWithSource = madData.map(q => ({ ...q, source: q.origen || 'MAD', origen: q.origen || 'MAD' }));
        const csifWithSource = csifData.map(q => ({ ...q, source: q.origen || 'CSIF', origen: q.origen || 'CSIF' }));

        // Normalize Academia format (array opciones → object, respuesta_correcta → correcta)
        const acadNormalized = acadData.map(q => normalizeAcademiaQuestion(q, 'Academia'));

        state.allQuestions = [...madWithSource, ...csifWithSource, ...acadNormalized];
        console.log(`Successfully loaded ${state.allQuestions.length} questions. (MAD: ${madWithSource.length}, CSIF: ${csifWithSource.length}, Academia: ${acadNormalized.length})`);
        return state.allQuestions;

    } catch (err) {
        console.error("CRITICAL: Error loading questions:", err);
        const msg = document.getElementById('access-msg');
        if (msg) msg.innerText = `⚠️ Error al cargar datos: ${err.message}`;
        return [];
    }
}
