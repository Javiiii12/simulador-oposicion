const fs = require('fs');
const path = require('path');

const qsPath = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(qsPath, 'utf8'));

// Delete previously inserted if re-run
qs = qs.filter(q => !(q.origen === 'Historico' && (q.tema.includes('Simulacro 3') || q.tema.includes('Simulacro 4'))));

function parseFile(fileName, idPrefix, temaName) {
    const rawText = fs.readFileSync(fileName, 'utf8');
    const chunks = rawText.split(/Solución:\s*(.*)/i);
    let questions = [];

    for (let i = 0; i < chunks.length - 1; i += 2) {
        let chunkText = chunks[i].trim();
        if (!chunkText) continue;

        let answerMatch = chunks[i + 1].trim().match(/^([A-D])/i);
        if (!answerMatch) continue;
        let answer = answerMatch[1].toLowerCase();

        let aMatch = chunkText.match(/\n\s*a\)/i);
        if (!aMatch) {
            aMatch = chunkText.match(/\n\*\s*a\)/i);
        }
        if (!aMatch) continue;

        let qText = chunkText.substring(0, aMatch.index).trim();
        qText = qText.replace(/^\*\s*/, ''); // Remove leading * if present

        // Remove trailing " +2" or "(Nota...)" from previous lines if they got mixed
        qText = qText.replace(/\+2\s*$/, '').trim();

        const optionsText = chunkText.substring(aMatch.index);

        const ops = optionsText.split(/\n[\*\s]*[a-d]\)\s*/i).filter(o => o.trim().length > 0);

        if (ops.length >= 4 && qText.length > 5) {
            questions.push({
                id: `${idPrefix}_${i / 2}`,
                tema: temaName,
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

    console.log(`Parsed ${questions.length} questions for ${temaName}.`);
    return questions;
}

const sim3 = parseFile('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_simulacro_3.txt', 'historico_sim3_sas2018', 'Otras Comunidades: Simulacro 3 - SAS 2018 (Extra) + SESCAM 2010');
const sim4 = parseFile('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_simulacro_4.txt', 'historico_sim4_sas2015', 'Otras Comunidades: Simulacro 4 - SAS 2015 + SESCAM 2010');

qs = qs.concat(sim3, sim4);
fs.writeFileSync(qsPath, JSON.stringify(qs, null, 2));
console.log(`Total questions now: ${qs.length}`);
