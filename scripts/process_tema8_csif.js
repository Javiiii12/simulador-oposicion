const fs = require('fs');

const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));

// Remove all CSIF Tema 8 to avoid duplicates if run multiple times
qs = qs.filter(q => !(q.origen === 'CSIF' && q.tema.includes('Tema 8:')));

const rawText = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_tema8_csif.txt', 'utf8');

let questions = [];
let blocks = rawText.split(/BLOQUE \d+:/).filter(b => b.trim().length > 0);

blocks.forEach((block, blockIndex) => {
    let blockNum = blockIndex + 1;
    let cleanBlock = block.replace(/\*/g, '');

    // Some lines might say Solución: A (Incorrecta...) so we just grab the letter
    const chunks = cleanBlock.split(/Solución:\s*([A-D])/i);

    // chunks will be [text1, letter1, text2, letter2, ...]
    // So chunks[i] is text, chunks[i+1] is answer
    for (let i = 0; i < chunks.length - 1; i += 2) {
        let chunkText = chunks[i].trim();
        let answer = chunks[i + 1].toLowerCase();

        let aMatch = chunkText.match(/\n\s*A\)/i);
        if (!aMatch) continue;

        let qText = chunkText.substring(0, aMatch.index).trim();
        const optionsText = chunkText.substring(aMatch.index);

        const ops = optionsText.split(/\n\s*[A-D]\)\s*/i).filter(o => o.trim().length > 0);

        if (ops.length >= 4 && qText.length > 5) {
            let lines = qText.split('\n');
            lines = lines.filter(l => !l.toLowerCase().includes('test nº') && !l.toLowerCase().includes('fuente:'));
            let finalQText = lines.join('\n').trim();

            questions.push({
                id: `csif_tema8_b${blockNum}_${i}`,
                tema: `Tema 8: Prevención de Riesgos y Plan PERSEO (Bloque ${blockNum})`,
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

console.log(`Parsed ${questions.length} CSIF Tema 8 questions.`);

qs = qs.concat(questions);
fs.writeFileSync(path, JSON.stringify(qs, null, 2));
console.log(`Total questions now: ${qs.length}`);
