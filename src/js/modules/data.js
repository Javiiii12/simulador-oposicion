import { state } from './state.js';

export async function loadAllData() {
    try {
        console.log("Fetching question data...");
        // The user wants to ensure ALL data is loaded. 
        // In previous turns, we found that CSIF were in a separate file.
        // Let's load both to be safe, as it seems they were meant to be combined.

        const [resMad, resCsif] = await Promise.all([
            fetch('data/preguntas.json'),
            fetch('data/csif_questions.json')
        ]);

        if (!resMad.ok) throw new Error(`Error loading MAD: ${resMad.status}`);

        const madData = await resMad.json();
        let csifData = [];

        if (resCsif.ok) {
            csifData = await resCsif.json();
        }

        // Combine and add source tags if missing
        const processedMad = madData.map(q => ({ ...q, source: q.origen || 'MAD' }));
        const processedCsif = csifData.map(q => ({ ...q, source: 'CSIF' }));

        state.allQuestions = [...processedMad, ...processedCsif];
        console.log(`Successfully loaded ${state.allQuestions.length} questions.`);
        return state.allQuestions;
    } catch (err) {
        console.error("CRITICAL: Error loading questions:", err);
        alert("Error al cargar los datos. Por favor, recarga la página.");
        return [];
    }
}
