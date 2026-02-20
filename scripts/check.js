const fs = require('fs');
const raw = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/scripts/raw_tema7_csif.txt', 'utf8');
const qs = JSON.parse(fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json', 'utf8'));
const t7 = qs.filter(q => q.tema.includes('Tema 7: Atención Primaria') && q.origen === 'CSIF');

console.log('Parsed in DB:', t7.length);

let blocks = raw.split(/BLOQUE \d+:/).filter(b => b.trim().length > 0);
let allQTexts = [];

blocks.forEach(b => {
    let chunks = b.replace(/\*/g, '').split(/Solución:\s*([A-D])/i);
    for (let i = 0; i < chunks.length - 1; i += 2) {
        let text = chunks[i].trim();
        let aMatch = text.match(/\nA\)/);
        if (aMatch) {
            let qText = text.substring(0, aMatch.index).trim();
            qText = qText.replace(/Fuente:.*\n/i, '').trim();
            allQTexts.push(qText);
        } else {
            console.log("NO A MATCH FOR:", text.substring(0, 50));
        }
    }
});

console.log('Found in raw:', allQTexts.length);
allQTexts.forEach(qRaw => {
    let snippet = qRaw.substring(0, 30);
    let found = t7.find(q => q.pregunta.includes(snippet));
    if (!found) console.log('MISSING:', qRaw);
});
