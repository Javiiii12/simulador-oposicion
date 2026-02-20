const fs = require('fs');

const rawText = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_tema7_csif.txt', 'utf8');

let questions = [];

// Split by blocks
let blocks = rawText.split(/BLOQUE \d+:/).filter(b => b.trim().length > 0);

blocks.forEach((block, blockIndex) => {
    let blockNum = blockIndex + 1;

    // Some lines have *, remove them
    let cleanBlock = block.replace(/\*/g, '');

    // Split by Solución:
    const chunks = cleanBlock.split(/Solución:\s*(.*)/i);

    for (let i = 0; i < chunks.length - 1; i += 2) {
        let chunkText = chunks[i].trim();
        let answerMatch = chunks[i + 1].trim().match(/^([A-D])/i);
        if (!answerMatch) continue;
        let answer = answerMatch[1].toLowerCase();

        let aMatch = chunkText.match(/\nA\)/);
        if (!aMatch) continue;

        const qText = chunkText.substring(0, aMatch.index).trim();
        const optionsText = chunkText.substring(aMatch.index);

        const ops = optionsText.split(/\n*[A-D]\)\s*/i).filter(o => o.trim().length > 0);

        if (ops.length === 4 && qText.length > 5 && !qText.includes("Fuente:")) {
            // Clean question text of potential leftover Fuente
            let finalQText = qText.replace(/Fuente:.*\n/i, '').trim();

            questions.push({
                id: `csif_tema7_b${blockNum}_${i}`,
                tema: `Tema 7: Atención Primaria y Especializada (Bloque ${blockNum})`,
                pregunta: finalQText,
                opciones: {
                    a: ops[0].trim(),
                    b: ops[1].trim(),
                    c: ops[2].trim(),
                    d: ops[3].trim()
                },
                correcta: answer,
                explicacion: "",
                origen: "CSIF"
            });
        }
    }
});

console.log(`Parsed ${questions.length} CSIF Tema 7 questions.`);

const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));
qs = qs.concat(questions);
fs.writeFileSync(path, JSON.stringify(qs, null, 2));
console.log(`Total questions now: ${qs.length}`);
