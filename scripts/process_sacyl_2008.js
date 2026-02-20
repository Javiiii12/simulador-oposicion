const fs = require('fs');

const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));

// Delete previously inserted if re-run
qs = qs.filter(q => !(q.origen === 'Historico' && q.tema === 'Otras Comunidades: SACYL (Castilla y León 2008)'));

const rawText = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_sacyl_2008.txt', 'utf8');

const chunks = rawText.split(/Solución:\s*(.*)/i);
let questions = [];

for (let i = 0; i < chunks.length - 1; i += 2) {
    let chunkText = chunks[i].trim();
    if (!chunkText) continue;

    let answerMatch = chunks[i + 1].trim().match(/^([A-D])/i);
    if (!answerMatch) continue;
    let answer = answerMatch[1].toLowerCase();

    let aMatch = chunkText.match(/\n\s*A\)/i);
    if (!aMatch) continue;

    let qText = chunkText.substring(0, aMatch.index).trim();
    const optionsText = chunkText.substring(aMatch.index);

    const ops = optionsText.split(/\n\s*[A-D]\)\s*/i).filter(o => o.trim().length > 0);

    if (ops.length >= 4 && qText.length > 5) {
        questions.push({
            id: `historico_sacyl_2008_${i / 2}`,
            tema: "Otras Comunidades: SACYL (Castilla y León 2008)",
            pregunta: qText,
            opciones: {
                a: ops[0].trim(),
                b: ops[1].trim(),
                c: ops[2].trim(),
                d: ops[3].trim()
            },
            correcta: answer,
            explicacion: "",
            origen: "Historico"
        });
    }
}

console.log(`Parsed ${questions.length} questions for SACYL 2008.`);
qs = qs.concat(questions);
fs.writeFileSync(path, JSON.stringify(qs, null, 2));
console.log(`Total questions now: ${qs.length}`);
