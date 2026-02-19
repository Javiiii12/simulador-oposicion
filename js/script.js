// Estado Global
let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = {};

// Elementos DOM - Cache
const views = {
    menu: document.getElementById('view-menu'),
    topics: document.getElementById('view-topics'),
    random: document.getElementById('view-random'),
    game: document.getElementById('view-game'),
    results: document.getElementById('view-results')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

function setupEventListeners() {
    // Selección de Rol
    document.getElementById('btn-role-pinche').addEventListener('click', () => {
        showView('view-menu');
    });

    document.getElementById('btn-role-celador').addEventListener('click', () => {
        alert("🚧 Celador: Estamos trabajando en ello. ¡Pronto disponible!");
    });

    // Menú Principal
    document.getElementById('btn-back-menu').addEventListener('click', () => showView('view-role-selection')); // Back to roles
    document.getElementById('btn-mad').addEventListener('click', () => showTopics('MAD'));
    document.getElementById('btn-csif').addEventListener('click', () => alert("🏥 Test CSIF disponible próximamente."));
    document.getElementById('btn-examenes').addEventListener('click', () => alert("📂 Sección de Exámenes Anteriores en construcción."));
    document.getElementById('btn-otras').addEventListener('click', () => alert("🌍 Próximamente: Simulacros de otras comunidades."));
    document.getElementById('btn-random').addEventListener('click', showRandomConfig);

    // Navegación
    document.getElementById('btn-back-topics').addEventListener('click', showMenu);
    document.getElementById('btn-back-random').addEventListener('click', showMenu);
    document.getElementById('btn-quit-game').addEventListener('click', showMenu);
    document.getElementById('btn-home-results').addEventListener('click', showMenu);

    // Configuración Aleatoria
    document.getElementById('btn-start-random').addEventListener('click', startRandomGame);

    // Juego
    document.getElementById('btn-next').addEventListener('click', nextQuestion);
}

async function loadData() {
    try {
        const res = await fetch('data/preguntas.json');
        if (!res.ok) throw new Error('Error cargando datos');
        allQuestions = await res.json();
        console.log(`Cargadas ${allQuestions.length} preguntas.`);
    } catch (err) {
        console.error(err);
        alert("Error cargando las preguntas.");
    }
}

// --- NAVEGACIÓN SPA ---
function showView(viewName) {
    Object.values(views).forEach(el => {
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });
    const target = views[viewName];
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function showMenu() {
    showView('menu');
}

function showRandomConfig() {
    showView('random');
}

// --- LÓGICA DE TEMAS ---
function showTopics(category) {
    if (category !== 'MAD') return;

    // Filtrar temas válidos (Tema 1 a 16)
    // Usamos Set para únicos
    const temasRaw = [...new Set(allQuestions.map(q => q.tema))];

    // Ordenar numéricamente (Tema 1, Tema 2...)
    const temas = temasRaw.sort((a, b) => {
        // Extraer numero: "Tema 1" -> 1
        const numA = parseInt(a.replace("Tema ", ""));
        const numB = parseInt(b.replace("Tema ", ""));
        return numA - numB;
    });

    const container = document.getElementById('topics-container');
    container.innerHTML = '';

    // Agrupar en Generales (1-6) y Específicos (7-16)
    const generales = [];
    const especificos = [];

    temas.forEach(tema => {
        const num = parseInt(tema.replace("Tema ", ""));
        if (num <= 6) generales.push(tema);
        else especificos.push(tema);
    });

    // Renderizar Grupo: Generales
    if (generales.length > 0) {
        const h3 = document.createElement('h3');
        h3.textContent = "📘 Temas Generales";
        h3.style.color = 'var(--primary)';
        h3.style.borderBottom = '2px solid var(--primary)';
        h3.style.paddingBottom = '5px';
        h3.style.marginTop = '0';
        container.appendChild(h3);

        generales.forEach(tema => container.appendChild(createTopicButton(tema)));
    }

    // Renderizar Grupo: Específicos
    if (especificos.length > 0) {
        const h3 = document.createElement('h3');
        h3.textContent = "📙 Temas Específicos";
        h3.style.color = 'var(--secondary)'; // Usamos secondary color
        h3.style.borderBottom = '2px solid var(--secondary)';
        h3.style.paddingBottom = '5px';
        h3.style.marginTop = '30px';
        container.appendChild(h3);

        especificos.forEach(tema => container.appendChild(createTopicButton(tema)));
    }

    showView('topics');
}

// Mapa de Títulos Oficiales (Hardcoded para limpieza total)
const TOPIC_TITLES = {
    "Tema 1": "La Constitución Española de 1978",
    "Tema 2": "Estatuto de Autonomía de Castilla-La Mancha",
    "Tema 3": "Ley General de Sanidad y Servicio de Salud de CLM",
    "Tema 4": "Ley 41/2002: Autonomía del paciente e información",
    "Tema 5": "Igualdad efectiva, Violencia de género y Discapacidad",
    "Tema 6": "Régimen Jurídico del Personal Estatutario",
    "Tema 7": "Plan de autoprotección y prevención de incendios",
    "Tema 8": "Ley de Prevención de Riesgos Laborales",
    "Tema 9": "Gestión de residuos sanitarios y medio ambiente",
    "Tema 10": "Distribución del trabajo en cocina",
    "Tema 11": "Los alimentos: clasificación y características",
    "Tema 12": "Autocontrol y Seguridad Alimentaria (APPCC)",
    "Tema 13": "Manipulación de alimentos y formación",
    "Tema 14": "Tecnología culinaria: cocción y conservación",
    "Tema 15": "Cocina Hospitalaria: sistemas y emplatado",
    "Tema 16": "Protección medioambiental y eficiencia"
};

function createTopicButton(tema) {
    const btn = document.createElement('button');
    btn.className = 'btn-topic';

    // Calcular preguntas
    const count = allQuestions.filter(q => q.tema === tema).length;

    // Usar título oficial o fallback
    // Si tema es "Tema 1", buscamos en el mapa.
    const titulo = TOPIC_TITLES[tema] || tema;

    // Formato bonito:
    // Título Principal: "Tema 1"
    // Subtítulo: "La Constitución Española..."
    btn.innerHTML = `
        <strong>${tema}</strong><br>
        <span style="font-size:0.9em; color:#555;">${titulo}</span><br>
        <small>${count} preguntas</small>
    `;

    btn.addEventListener('click', () => startTopicGame(tema));
    return btn;
}

function startTopicGame(tema) {
    const questions = allQuestions.filter(q => q.tema === tema);
    startGame(questions);
}

// --- LÓGICA ALEATORIA ---
function startRandomGame() {
    const input = document.getElementById('random-count');
    let count = parseInt(input.value) || 20;

    if (count < 1) count = 1;
    if (count > 100) count = 100;
    if (count > allQuestions.length) count = allQuestions.length;

    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    startGame(selected);
}

// --- MOTOR DEL JUEGO ---
function startGame(questionsSet) {
    if (questionsSet.length === 0) {
        alert("No hay preguntas disponibles.");
        return;
    }
    currentQuestions = questionsSet;
    currentIndex = 0;
    score = 0;
    userAnswers = {};

    showView('game');
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];

    // Info Header
    document.getElementById('question-counter').textContent = `${currentIndex + 1}/${currentQuestions.length}`;
    document.getElementById('score-badge').textContent = `Aciertos: ${score}`;

    // Progreso
    const pct = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Contenido
    // Extraer solo "Tema X" para el tag
    const temaMatch = q.tema.match(/Tema \d+/);
    document.getElementById('tema-tag').textContent = temaMatch ? temaMatch[0] : 'General';

    document.getElementById('pregunta-texto').textContent = q.pregunta;

    const optionsDiv = document.getElementById('opciones-container');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('btn-next').classList.add('hidden');

    // Opciones
    ['a', 'b', 'c', 'd'].forEach(letter => {
        if (!q.opciones[letter]) return;

        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerHTML = `<strong>${letter.toUpperCase()})</strong> ${q.opciones[letter]}`;

        // Listener con cierre para capturar 'letter'
        btn.addEventListener('click', () => handleAnswer(letter));

        if (userAnswers[currentIndex]) {
            btn.disabled = true;
            if (letter === q.correcta) btn.classList.add('correct');
            else if (letter === userAnswers[currentIndex]) btn.classList.add('incorrect');
        }

        optionsDiv.appendChild(btn);
    });

    if (userAnswers[currentIndex]) showFeedback(q);
}

function handleAnswer(selected) {
    if (userAnswers[currentIndex]) return;

    userAnswers[currentIndex] = selected;
    if (selected === currentQuestions[currentIndex].correcta) score++;

    renderQuestion();

    // Auto-scroll al botón siguiente para asegurar que se ve
    setTimeout(() => {
        const btnNext = document.getElementById('btn-next');
        if (btnNext) btnNext.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function showFeedback(q) {
    const feedbackDiv = document.getElementById('feedback');
    const explicacionP = document.getElementById('explicacion');
    const nextBtn = document.getElementById('btn-next');

    feedbackDiv.classList.remove('hidden');

    const esCorrecta = userAnswers[currentIndex] === q.correcta;
    const icon = esCorrecta ? '✅' : '❌';

    if (esCorrecta) {
        // Usuario acierta: Solo confirmación positiva, sin redundancia visual.
        explicacionP.innerHTML = `<strong>${icon} ¡Correcto!</strong>`;
        feedbackDiv.style.backgroundColor = '#e8f5e9'; // Greenish bg
        feedbackDiv.style.borderLeftColor = '#4caf50';
    } else {
        // Usuario falla: Mostrar la correcta.
        explicacionP.innerHTML = `<strong>${icon} Incorrecto</strong><br>La respuesta correcta es la <strong>${q.correcta.toUpperCase()}</strong>.`;
        feedbackDiv.style.backgroundColor = '#fff3cd'; // Yellowish bg
        feedbackDiv.style.borderLeftColor = '#ffc107';
    }

    nextBtn.classList.remove('hidden');
    if (currentIndex === currentQuestions.length - 1) {
        nextBtn.textContent = "Ver Resultados 🏁";
    } else {
        nextBtn.textContent = "Siguiente ➡";
    }
}

function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    showView('results');
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = `/ ${currentQuestions.length}`;

    const pct = (score / currentQuestions.length) * 100;
    let msg = "¡Sigue así!";
    if (pct === 100) msg = "¡Perfecto! 🏆";
    else if (pct >= 80) msg = "¡Excelente! 🌟";
    else if (pct >= 50) msg = "Aprobado 👍";
    else msg = "A repasar... 📚";

    document.getElementById('final-message').textContent = msg;
}
