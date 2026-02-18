// Estado Global
let allQuestions = []; // Todar las preguntas cargadas
let currentQuestions = []; // Preguntas del juego actual
let currentIndex = 0;
let score = 0;
let userAnswers = {}; // Map: index -> respuesta

// Elementos DOM - Vistas
const views = {
    menu: document.getElementById('view-menu'),
    topics: document.getElementById('view-topics'),
    random: document.getElementById('view-random'),
    game: document.getElementById('view-game'),
    results: document.getElementById('view-results')
};

// Carga Inicial
document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    try {
        const res = await fetch('data/preguntas.json');
        if (!res.ok) throw new Error('Error cargando datos');
        allQuestions = await res.json();
        console.log(`Cargadas ${allQuestions.length} preguntas.`);

        // Actualizar UI de configuración aleatoria
        const maxSpan = document.getElementById('max-questions-count');
        if (maxSpan) maxSpan.textContent = allQuestions.length;

    } catch (err) {
        console.error(err);
        alert("Error cargando las preguntas. Asegúrate de iniciar con un servidor local o en GitHub Pages.");
    }
}

// --- NAVEGACIÓN SPA ---

function showView(viewName) {
    // Ocultar todas
    Object.values(views).forEach(el => {
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });
    // Mostrar la deseada
    const target = views[viewName];
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

window.showMenu = function () {
    showView('menu');
}

window.showRandomConfig = function () {
    showView('random');
}

// --- LÓGICA DE TEMAS ---

window.showTopics = function (category) {
    if (category === 'CSIF') {
        alert("🚧 Test CSIF disponible próximamente.");
        return;
    }

    // Filtrar preguntas por categoría (si tuviéramos campo 'categoria')
    // Por ahora asumimos que todas son MAD o Generales
    let filtered = allQuestions;

    if (category === 'EXAMENES') {
        // Simulación: Si tuviéramos examenes por año.
        // Como no hay metadatos de año, mostramos un mensaje o filtramos por algo específico
        alert("📂 Sección de Exámenes Anteriores en construcción (se requieren más datos).");
        return;
    }

    // Extraer temas únicos
    const temas = [...new Set(filtered.map(q => q.tema || "General"))].sort();

    const container = document.getElementById('topics-list');
    container.innerHTML = '';
    document.getElementById('topic-title').textContent = category === 'MAD' ? 'Temas MAD' : 'Temas';

    temas.forEach(tema => {
        const btn = document.createElement('button');
        btn.className = 'btn-topic';
        // Contar preguntas de este tema
        const count = filtered.filter(q => (q.tema || "General") === tema).length;
        btn.innerHTML = `<strong>${tema}</strong> <br><small>${count} preguntas</small>`;
        btn.onclick = () => startTopicGame(tema);
        container.appendChild(btn);
    });

    showView('topics');
}

function startTopicGame(tema) {
    const questions = allQuestions.filter(q => (q.tema || "General") === tema);
    startGame(questions);
}

// --- LÓGICA ALEATORIA ---

window.startRandomGame = function () {
    const input = document.getElementById('random-count');
    let count = parseInt(input.value) || 20;

    // Validar
    if (count < 1) count = 1;
    if (count > allQuestions.length) count = allQuestions.length;

    // Barajar y cortar
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    startGame(selected);
}

// --- MOTOR DEL JUEGO ---

function startGame(questionsSet) {
    if (questionsSet.length === 0) {
        alert("No hay preguntas disponibles en esta selección.");
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

    // Header Info
    document.getElementById('question-counter').textContent = `${currentIndex + 1}/${currentQuestions.length}`;
    document.getElementById('score-badge').textContent = `Aciertos: ${score}`;

    // Barra de progreso
    const pct = ((currentIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Card Content
    document.getElementById('tema-tag').textContent = q.tema || 'General';
    document.getElementById('pregunta-texto').textContent = q.pregunta;

    const optionsDiv = document.getElementById('opciones-container');
    optionsDiv.innerHTML = '';

    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.classList.add('hidden');

    const nextBtn = document.getElementById('btn-next');
    nextBtn.classList.add('hidden');

    // Render Opciones
    const letters = ['a', 'b', 'c', 'd'];
    letters.forEach(letter => {
        if (!q.opciones[letter]) return; // Si no existe la opción d, por ejemplo

        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerHTML = `<strong>${letter.toUpperCase()})</strong> ${q.opciones[letter]}`;
        btn.onclick = () => handleAnswer(letter);

        // Estado si ya fue respondida
        if (userAnswers[currentIndex]) {
            btn.disabled = true;
            if (letter === q.correcta) btn.classList.add('correct');
            else if (letter === userAnswers[currentIndex]) btn.classList.add('incorrect');
        }

        optionsDiv.appendChild(btn);
    });

    // Mostrar feedback si ya respondió
    if (userAnswers[currentIndex]) {
        showFeedback(q, nextBtn);
    }
}

function handleAnswer(selected) {
    if (userAnswers[currentIndex]) return; // Ya respondida

    userAnswers[currentIndex] = selected;
    const q = currentQuestions[currentIndex];

    if (selected === q.correcta) {
        score++;
        // Efecto visual simple (opcional)
    }

    renderQuestion(); // Re-render para mostrar colores
}

function showFeedback(q, nextBtn) {
    const feedbackDiv = document.getElementById('feedback');
    const explicacionP = document.getElementById('explicacion');

    feedbackDiv.classList.remove('hidden');

    const esCorrecta = userAnswers[currentIndex] === q.correcta;
    const textoResultado = esCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto';
    const textoExplicacion = q.explicacion ? `<br><br>💡 ${q.explicacion}` : '';

    explicacionP.innerHTML = `<strong>${textoResultado}</strong> - La respuesta correcta es la <strong>${q.correcta.toUpperCase()}</strong>.${textoExplicacion}`;

    // Configurar botón Siguiente
    nextBtn.classList.remove('hidden');
    if (currentIndex === currentQuestions.length - 1) {
        nextBtn.textContent = "Ver Resultados 🏁";
    } else {
        nextBtn.textContent = "Siguiente ➡";
    }
}

window.nextQuestion = function () {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        finishGame();
    }
}

window.quitGame = function () {
    if (confirm("¿Seguro que quieres salir? Se perderá el progreso.")) {
        showMenu();
    }
}

function finishGame() {
    showView('results');
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = `/ ${currentQuestions.length}`;

    const pct = (score / currentQuestions.length) * 100;
    let msg = "";
    if (pct === 100) msg = "¡Perfecto! 🏆";
    else if (pct >= 80) msg = "¡Excelente trabajo! 🌟";
    else if (pct >= 50) msg = "Aprobado, pero se puede mejorar. 👍";
    else msg = "hay que estudiar más... 📚";

    document.getElementById('final-message').textContent = msg;
}
