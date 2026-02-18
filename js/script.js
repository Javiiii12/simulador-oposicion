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
        alert("🏥 Test CSIF disponible próximamente.");
        return;
    }

    if (category === 'OTRAS_COMUNIDADES') {
        alert("🗓️ Próximamente: Simulacros de otras comunidades.");
        return;
    }

    // Filtrar preguntas
    let filtered = allQuestions;

    if (category === 'EXAMENES') {
        alert("📂 Sección de Exámenes Anteriores en construcción.");
        return;
    }

    // Ordenar temas numéricamente si es posible
    const temas = [...new Set(filtered.map(q => q.tema || "General"))].sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)) || 999;
        const numB = parseInt(b.match(/\d+/)) || 999;
        return numA - numB;
    });

    const container = document.getElementById('topics-list');
    container.innerHTML = '';

    // Título dinámico
    const titleMap = {
        'MAD': 'Test MAD',
        'EXAMENES': 'Exámenes'
    };
    document.getElementById('topic-title').textContent = titleMap[category] || 'Temas';

    temas.forEach(tema => {
        const btn = document.createElement('button');
        btn.className = 'btn-topic';
        const count = filtered.filter(q => (q.tema || "General") === tema).length;

        let label = tema;
        // Decoración para MAD
        if (category === 'MAD') {
            if (tema.includes("Tema 1") || tema.includes("Tema 2") || tema.includes("Tema 3") ||
                tema.includes("Tema 4") || tema.includes("Tema 5") || tema.includes("Tema 6")) {
                label = `📘 ${tema}`; // Generales
            } else {
                label = `📙 ${tema}`; // Específicos
            }
        }

        btn.innerHTML = `<strong>${label}</strong> <br><small>${count} preguntas</small>`;
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

    // Validación
    if (count < 1) count = 1;
    if (count > 100) count = 100; // Tope máximo solicitado

    // Si pide más de las disponibles, usamos todas
    if (count > allQuestions.length) count = allQuestions.length;

    // Barajar
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    startGame(selected);
}

// ... (startGame engine)

// ...

window.quitGame = function () {
    // Salir directamente sin confirmar, como pidió ("flecha atrás")
    showMenu();
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
