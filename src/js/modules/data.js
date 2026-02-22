import { state } from './state.js';

/**
 * Fixes broken Spanish characters produced when a Windows-1252/CP-850 file
 * is read as if it were UTF-8 or Latin-1. Applied to all string fields of
 * CSIF data. Does NOT modify the source file.
 */
function fixEncoding(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/¾/g, 'ó').replace(/Ó/g, 'Ó')
        .replace(/±/g, 'ñ').replace(/Ñ/g, 'Ñ')
        .replace(/ß/g, 'á').replace(/Á/g, 'Á')
        .replace(/Ý/g, 'í').replace(/Í/g, 'Í')
        .replace(/Ú/g, 'é').replace(/É/g, 'É')
        .replace(/·/g, 'ú').replace(/Ú/g, 'Ú')
        .replace(/ä/g, 'ü')
        .replace(/┐/g, '¿')
        .replace(/┌/g, '¡')
        .replace(/ö/g, 'ö')
        .replace(/Ý/g, 'ï')
        .replace(/â/g, 'à');
}

function fixCsifQuestion(q) {
    const fix = fixEncoding;
    const fixOpts = (opts) => {
        if (!opts) return opts;
        if (Array.isArray(opts)) return opts.map(fix);
        const out = {};
        Object.entries(opts).forEach(([k, v]) => { out[k] = fix(v); });
        return out;
    };
    return {
        ...q,
        tema: fix(q.tema),
        pregunta: fix(q.pregunta),
        opciones: fixOpts(q.opciones),
        correcta: fix(q.correcta),
        origen: q.origen || 'CSIF',
        source: 'CSIF'
    };
}

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

        const bust = `?v=${Date.now()}`;
        const [resMad, resCsif, resAcad] = await Promise.all([
            fetch(`data/preguntas.json${bust}`),
            fetch(`data/csif_questions.json${bust}`),
            fetch(`data/academia_tema1.json${bust}`)
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
        const csifWithSource = csifData.map(q => fixCsifQuestion(q));

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
