const fs = require('fs');

const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));

let countModified = 0;

qs = qs.map(q => {
    if (q.tema.includes('Ley 8/2000') || q.tema.includes('Ley 5/2010')) {
        if (q.origen === 'MAD') {
            q.origen = 'CSIF';
            countModified++;
        }
    }
    return q;
});

fs.writeFileSync(path, JSON.stringify(qs, null, 2));
console.log(`Updated origen to CSIF for ${countModified} questions in Tema 4.`);
