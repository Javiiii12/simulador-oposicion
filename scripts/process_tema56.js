const fs = require('fs');

const rawText = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_tema56.txt', 'utf8');

const blocks = [
    {
        title: "Tema 5 y 6: Estatuto Marco (Bloque 1 - CSIF)",
        text: rawText.split('BLOQUE 2: Test Completo CEP (38 Preguntas)')[0]
    },
    {
        title: "Tema 5 y 6: Estatuto Marco (Bloque 2 - CEP)",
        text: rawText.split('BLOQUE 2: Test Completo CEP (38 Preguntas)')[1]
    }
];

let questions = [];

blocks.forEach((block, blockIndex) => {
    // split by Solución: X
    const chunks = block.text.split(/Solución:\s*([A-D])/);

    // The chunks array will be [text1, answ1, text2, answ2, ... textLast]
    for (let i = 0; i < chunks.length - 1; i += 2) {
        let chunkText = chunks[i].trim();
        let answer = chunks[i + 1].trim().toLowerCase();

        // Find the options A), B), C), D)
        const aIndex = chunkText.lastIndexOf('\nA)');
        // Fallbacks if formatting differs slightly
        let aMatch = chunkText.match(/A\)/);
        if (!aMatch) continue;

        const qText = chunkText.substring(0, aMatch.index).trim();
        const optionsText = chunkText.substring(aMatch.index);

        const ops = optionsText.split(/\n*[A-D]\)\s*/).filter(o => o.trim().length > 0);

        if (ops.length === 4 && qText.length > 5 && !qText.includes("Fuente:")) {
            questions.push({
                id: `csif_tema_5_6_b${blockIndex + 1}_${i}`,
                tema: block.title,
                pregunta: qText,
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

console.log(`Parsed ${questions.length} questions.`);

// Read existing and append
const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));
qs = qs.concat(questions);
fs.writeFileSync(path, JSON.stringify(qs, null, 2));

console.log(`Total questions now: ${qs.length}`);
