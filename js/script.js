// Estado Global
let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = {};
let currentMode = 'training'; // 'training', 'exam', 'failures'
let currentTopicName = ''; // Para guardar en historial

// Elementos DOM - Cache
const views = {
    menu: document.getElementById('view-menu'),
    roleSelection: document.getElementById('view-role-selection'),
    topics: document.getElementById('view-topics'),
    random: document.getElementById('view-random'),
    modeSelection: document.getElementById('view-mode-selection'),
    progress: document.getElementById('view-progress'),
    game: document.getElementById('view-game'),
    results: document.getElementById('view-results')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateFailureBadge();
    setupEventListeners();
});

function setupEventListeners() {
    // Selección de Rol
    document.getElementById('btn-role-pinche').addEventListener('click', () => showView('menu'));
    document.getElementById('btn-role-celador').addEventListener('click', () => alert("🚧 Celador: Estamos trabajando en ello. ¡Pronto disponible!"));

    // Menú Principal
    document.getElementById('btn-back-menu').addEventListener('click', () => showView('roleSelection'));

    document.getElementById('btn-mad').addEventListener('click', () => showTopics('MAD'));
    document.getElementById('btn-failures').addEventListener('click', startFailureTest);
    document.getElementById('btn-random').addEventListener('click', showRandomConfig);
    document.getElementById('btn-progress').addEventListener('click', showProgress);

    // Botones Extras
    document.getElementById('btn-examenes').addEventListener('click', () => alert("📝 Estamos recopilando exámenes oficiales. ¡Pronto!"));
    document.getElementById('btn-academia').addEventListener('click', () => alert("🎓 La Academia Test abrirá sus puertas próximamente."));
    document.getElementById('btn-2020').addEventListener('click', () => alert("📅 El examen de 2020 se está digitalizando."));

    // Navegación (Volver)
    document.getElementById('btn-back-topics').addEventListener('click', () => showView('menu'));
    document.getElementById('btn-back-random').addEventListener('click', () => showView('menu'));
    document.getElementById('btn-back-mode').addEventListener('click', () => {
        // Volver depende... normalmente a Topics o Menu.
        // Simplificación: Volver a Topics si venimos de ahí, o Menu si venimos de Random (aunque random va directo).
        // Por ahora, volver a Menu es seguro.
        showView('menu');
    });
    document.getElementById('btn-back-progress').addEventListener('click', () => showView('menu'));
    document.getElementById('btn-quit-game').addEventListener('click', () => {
        if (confirm("¿Seguro que quieres salir? Se perderá el progreso actual.")) showView('menu');
    });
    document.getElementById('btn-home-results').addEventListener('click', () => showView('menu'));
    document.getElementById('btn-retry').addEventListener('click', () => {
        // Reintentar mismo set
        startGame(currentQuestions, currentMode, currentTopicName);
    });

    // Configuración Aleatoria
    document.getElementById('btn-start-random').addEventListener('click', () => {
        // En Random, vamos directo a elegir modo? O asumimos entrenamiento/examen?
        // Vamos a asumir que "Random" lleva a selección de modo también para ser consistente.
        prepareModeSelection("Test Aleatorio", () => {
            const input = document.getElementById('random-count');
            let count = parseInt(input.value) || 20;
            if (count < 1) count = 1;
            if (count > 100) count = 100;
            if (count > allQuestions.length) count = allQuestions.length;

            const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        });
    });

    // Selección de Modo
    document.getElementById('btn-mode-training').addEventListener('click', () => executeGameStart('training'));
    document.getElementById('btn-mode-exam').addEventListener('click', () => executeGameStart('exam'));

    // Juego
    document.getElementById('btn-next').addEventListener('click', nextQuestion);

    // Historial
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm("¿Borrar todo el historial?")) {
            localStorage.removeItem('ope_progress');
            showProgress(); // Refrescar
        }
    });
}

async function loadData() {
    try {
        const res = await fetch('data/preguntas.json');
        if (!res.ok) throw new Error('Error cargando datos');
        allQuestions = await res.json();
        console.log(`Cargadas ${allQuestions.length} preguntas.`);
        updateFailureBadge(); // Actualizar badge por si hay nuevos IDs
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
    window.scrollTo(0, 0);
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

    const temasRaw = [...new Set(allQuestions.map(q => q.tema))];
    const temas = temasRaw.sort((a, b) => {
        const numA = parseInt(a.replace("Tema ", "")) || 999;
        const numB = parseInt(b.replace("Tema ", "")) || 999;
        return numA - numB;
    });

    const container = document.getElementById('topics-container');
    container.innerHTML = '';

    const generales = [];
    const especificos = [];

    temas.forEach(tema => {
        const num = parseInt(tema.replace("Tema ", "")) || 0;
        if (num <= 6) generales.push(tema);
        else especificos.push(tema);
    });

    // Helpers
    const renderGroup = (title, list, color) => {
        if (list.length === 0) return;
        const h3 = document.createElement('h3');
        h3.textContent = title;
        h3.style.color = color;
        h3.style.borderBottom = `2px solid ${color}`;
        h3.style.paddingBottom = '5px';
        h3.style.marginTop = '20px';
        container.appendChild(h3);
        list.forEach(tema => container.appendChild(createTopicButton(tema)));
    };

    renderGroup("📘 Temas Generales", generales, 'var(--primary)');
    renderGroup("📙 Temas Específicos", especificos, 'var(--secondary)');

    showView('topics');
}

// Mapa de Títulos Oficiales (Hardcoded para limpieza y robustez)
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
    const count = allQuestions.filter(q => q.tema === tema).length;
    const titulo = TOPIC_TITLES[tema] || tema;

    btn.innerHTML = `
        <strong>${tema}</strong><br>
        <span style="font-size:0.9em; color:#555;">${titulo}</span><br>
        <small>${count} preguntas</small>
    `;

    btn.addEventListener('click', () => {
        // En lugar de iniciar, vamos a MODE SELECTION
        prepareModeSelection(tema, () => {
            return allQuestions.filter(q => q.tema === tema);
        });
    });
    return btn;
}

// --- SELECTOR DE MODO ---
let pendingGameGenerator = null; // Función que devuelve las preguntas
let pendingTopicTitle = "";

function prepareModeSelection(title, generatorFn) {
    pendingTopicTitle = title;
    pendingGameGenerator = generatorFn;

    document.getElementById('mode-topic-title').textContent = title;
    showView('modeSelection');
}

function executeGameStart(mode) {
    if (!pendingGameGenerator) return;
    const questions = pendingGameGenerator(); // Generar las preguntas (filtrar, random, etc)
    startGame(questions, mode, pendingTopicTitle);
}

// --- LOGICA DE FALLOS Y PROGRESO ---
function getFailedIds() {
    const str = localStorage.getItem('ope_failed_ids');
    return str ? JSON.parse(str) : [];
}

function saveFailedId(id) {
    const ids = getFailedIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem('ope_failed_ids', JSON.stringify(ids));
        updateFailureBadge();
    }
}

function removeFailedId(id) {
    let ids = getFailedIds();
    ids = ids.filter(x => x !== id);
    localStorage.setItem('ope_failed_ids', JSON.stringify(ids));
    updateFailureBadge();
}

function updateFailureBadge() {
    const ids = getFailedIds();
    const badge = document.getElementById('badge-failures');
    if (badge) badge.textContent = ids.length;
}

function startFailureTest() {
    const ids = getFailedIds();
    if (ids.length === 0) {
        alert("¡No tienes fallos registrados! ¡Buen trabajo!");
        return;
    }

    // Filtrar preguntas que coincidan con los IDs
    const questions = allQuestions.filter(q => ids.includes(q.id));

    if (questions.length === 0) {
        // IDs huerfanos (preguntas borradas?)
        localStorage.setItem('ope_failed_ids', JSON.stringify([]));
        updateFailureBadge();
        alert("No se encontraron las preguntas de tus fallos (quizás cambiaron). Se ha limpiado la lista.");
        return;
    }

    startGame(questions, 'failures', 'Repaso de Fallos');
}

function saveHistory(topic, score, total) {
    const historyStr = localStorage.getItem('ope_progress');
    const history = historyStr ? JSON.parse(historyStr) : [];

    const record = {
        date: new Date().toLocaleDateString(),
        topic: topic,
        score: score,
        total: total,
        pct: Math.round((score / total) * 100)
    };

    // Guardar al principio
    history.unshift(record);
    // Limitar a 50
    if (history.length > 50) history.pop();

    localStorage.setItem('ope_progress', JSON.stringify(history));
}

function showProgress() {
    const historyStr = localStorage.getItem('ope_progress');
    const history = historyStr ? JSON.parse(historyStr) : [];
    const tbody = document.getElementById('progress-body');
    tbody.innerHTML = '';

    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay resultados aún.</td></tr>';
    } else {
        history.forEach(reg => {
            const tr = document.createElement('tr');
            const colorClass = reg.pct >= 50 ? 'score-good' : 'score-bad';
            tr.innerHTML = `
                <td>${reg.date}</td>
                <td>${reg.topic}</td>
                <td class="${colorClass}">${reg.score}/${reg.total} (${reg.pct}%)</td>
            `;
            tbody.appendChild(tr);
        });
    }

    showView('progress');
}

// --- MOTOR DEL JUEGO ---
function startGame(questionsSet, mode, topicName) {
    if (!questionsSet || questionsSet.length === 0) {
        alert("Error: No hay preguntas para iniciar.");
        return;
    }
    currentQuestions = questionsSet;
    currentIndex = 0;
    score = 0;
    userAnswers = {};
    currentMode = mode; // 'training', 'exam', 'failures'
    currentTopicName = topicName;

    // UI Updates
    document.getElementById('mode-tag').textContent =
        mode === 'training' ? 'Entrenamiento' :
            mode === 'exam' ? 'Examen' : 'Repaso Fallos';

    showView('game');
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];

    // Info Header
    document.getElementById('question-counter').textContent = `${currentIndex + 1}/${currentQuestions.length}`;
    document.getElementById('score-badge').textContent = (currentMode === 'exam') ? '???' : `Aciertos: ${score}`;

    // Progreso
    const pct = ((currentIndex) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Contenido
    const temaMatch = q.tema.match(/Tema \d+/);
    document.getElementById('tema-tag').textContent = temaMatch ? temaMatch[0] : 'General';

    document.getElementById('pregunta-texto').textContent = q.pregunta;

    const optionsDiv = document.getElementById('opciones-container');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('btn-next').classList.add('hidden');
    document.getElementById('explicacion').innerHTML = ''; // Limpiar

    // Opciones
    ['a', 'b', 'c', 'd'].forEach(letter => {
        if (!q.opciones[letter]) return;

        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerHTML = `<strong>${letter.toUpperCase()})</strong> ${q.opciones[letter]}`;
        btn.onclick = () => handleAnswer(letter);

        // Si ya respondimos (navegar atrás/adelante en futuro?), restaurar estado
        // De momento solo vamos hacia adelante.

        optionsDiv.appendChild(btn);
    });
}

function handleAnswer(selected) {
    if (userAnswers[currentIndex]) return; // Ya respondida

    const q = currentQuestions[currentIndex];
    userAnswers[currentIndex] = selected;
    const isCorrect = (selected === q.correcta);

    // Lógica de Puntuación y Fallos
    if (isCorrect) {
        score++;
        if (currentMode === 'failures') {
            removeFailedId(q.id); // ¡Superada!
        }
    } else {
        saveFailedId(q.id); // Guardar fallo para siempre (hasta acierto en modo fallos)
    }

    // UI Feedback
    const options = document.getElementById('opciones-container').children;

    // En modo 'exam', solo marcamos la seleccionada (sin color de verdad/mentira, solo "selected")
    // Pero el usuario pidió "veo la nota al final". 
    // Vamos a ser visualmente neutros en EXAMEN, visualmente explicativos en ENTRENAMIENTO/FALLOS.

    if (currentMode === 'exam') {
        // En examen solo iluminamos la que pulsó el usuario para que sepa que la marcó.
        // No decimos si es buena o mala
        for (let btn of options) {
            btn.disabled = true;
            if (btn.innerText.startsWith(`${selected.toUpperCase()})`)) {
                btn.style.border = "2px solid var(--primary)";
                btn.style.background = "#eef";
            }
        }
        // Pasamos automáticamente o mostramos botón siguiente?
        // Mejor botón siguiente para consistencia
        document.getElementById('btn-next').classList.remove('hidden');
        // Auto-next en examen para velocidad? 
        // Mejor manual para evitar clicks accidentales.
        // Pero espera, si no hay feedback, next es solo pasar. 
        // Vamos a dejarlo manual pero sin feedback de texto.

    } else {
        // MODO ENTRENAMIENTO / FALLOS
        // Colorear
        for (let btn of options) {
            btn.disabled = true;
            const letter = btn.innerText.charAt(0).toLowerCase();

            if (letter === q.correcta) {
                btn.classList.add('correct');
            } else if (letter === selected) {
                btn.classList.add('incorrect');
            }
        }

        // Mostrar Feedback Texto
        const feedbackDiv = document.getElementById('feedback');
        const explicacionP = document.getElementById('explicacion');
        feedbackDiv.classList.remove('hidden');

        if (isCorrect) {
            explicacionP.innerHTML = `<strong>✅ ¡Correcto!</strong>`;
            feedbackDiv.style.backgroundColor = '#e8f5e9';
            feedbackDiv.style.borderLeftColor = '#4caf50';
        } else {
            explicacionP.innerHTML = `<strong>❌ Incorrecto</strong><br>La respuesta correcta es la <strong>${q.correcta.toUpperCase()}</strong>.`;
            feedbackDiv.style.backgroundColor = '#fff3cd';
            feedbackDiv.style.borderLeftColor = '#ffc107';
        }

        document.getElementById('btn-next').classList.remove('hidden');
        // Scroll to feedback
        setTimeout(() => document.getElementById('btn-next').scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }

    // Update botón Next text
    const btnNext = document.getElementById('btn-next');
    btnNext.textContent = (currentIndex === currentQuestions.length - 1) ? "Finalizar Test 🏁" : "Siguiente ➡";
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
    // Guardar Historial
    saveHistory(currentTopicName + ` [${currentMode}]`, score, currentQuestions.length);

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
