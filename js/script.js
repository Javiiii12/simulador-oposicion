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
    examsMenu: document.getElementById('view-exams-menu'),
    modeSelection: document.getElementById('view-mode-selection'),
    progress: document.getElementById('view-progress'),
    game: document.getElementById('view-game'),
    results: document.getElementById('view-results')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Migración/Limpieza de IDs antiguos (Bug Fix)
    // Si detectamos IDs numéricos simples (ej: "1", "2") o formato antiguo, limpiamos
    // O simplemente forzamos limpieza una vez con una flag de versión.
    const v_data = localStorage.getItem('ope_version_data');
    if (v_data !== 'v1_unique_ids') {
        console.log("Migrando a IDs únicos... Limpiando fallos antiguos.");
        localStorage.removeItem('ope_failed_ids');
        localStorage.setItem('ope_version_data', 'v1_unique_ids');
    }

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
    document.getElementById('btn-csif').addEventListener('click', () => alert("🏥 Test CSIF en proceso de digitalización."));
    document.getElementById('btn-failures').addEventListener('click', startFailureTest);
    document.getElementById('btn-random').addEventListener('click', showRandomConfig);
    document.getElementById('btn-progress').addEventListener('click', showProgress);

    // Botones Extras
    document.getElementById('btn-examenes').addEventListener('click', () => alert("📝 Estamos recopilando exámenes oficiales. ¡Pronto!"));
    document.getElementById('btn-academia').addEventListener('click', () => alert("🎓 La Academia Test abrirá sus puertas próximamente."));

    // Navegación Menú OPE 2020
    document.getElementById('btn-ope-2020').addEventListener('click', () => showView('examsMenu'));
    document.getElementById('btn-back-exams').addEventListener('click', () => showView('menu'));

    // Examen Ordinario
    document.getElementById('btn-2020-ord').addEventListener('click', () => {
        const questions = allQuestions.filter(q => q.tema === "Examen 2020 (Ordinario)");
        if (questions.length === 0) {
            alert("Error: No se han cargado las preguntas del Examen Ordinario.");
            return;
        }
        questions.sort((a, b) => {
            const na = parseInt(a.id.split('_')[1] || 0);
            const nb = parseInt(b.id.split('_')[1] || 0);
            return na - nb;
        });
        startGame(questions, 'exam', 'Examen OPE 2020 (Ordinario 2021)');
    });

    // Examen Extraordinario
    document.getElementById('btn-2020-extra').addEventListener('click', () => {
        const questions = allQuestions.filter(q => q.tema === "Examen 2020 (Extraordinario)");
        if (questions.length === 0) {
            alert("🚧 Este examen aún no está disponible. Estamos trabajando en ello.");
            return;
        }
        questions.sort((a, b) => {
            const na = parseInt(a.id.split('_')[1] || 0);
            const nb = parseInt(b.id.split('_')[1] || 0);
            return na - nb;
        });
        startGame(questions, 'exam', 'Examen OPE 2020 (Extraordinario 2022)');
    });

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

    // NAVIGATION & EXAM FEATURES
    document.getElementById('btn-prev').addEventListener('click', prevQuestion);
    document.getElementById('btn-show-grid').addEventListener('click', showGrid);
    document.getElementById('btn-close-grid').addEventListener('click', () => {
        document.getElementById('nav-grid-overlay').classList.add('hidden');
    });

    // Review Buttons - Logic bound in finishGame but we can init here too
    // But specific logic depends on state, so finishGame handles onclick assignment usually.
    // However, better to have a static listener if we can.
    // Let's rely on finishGame to bind/unbind or check state.
    // Actually, finishGame re-assigns onclick. That's fine.
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

    const temasRaw = [...new Set(allQuestions.map(q => q.tema))].filter(t => !t.toString().startsWith("Examen"));
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
    // Resetear visibilidad de botones por si acaso
    document.getElementById('btn-mode-training').style.display = 'flex';
    document.getElementById('btn-mode-exam').style.display = 'flex';

    showView('modeSelection');
}

function executeGameStart(mode) {
    console.log("Ejecutando inicio de juego:", mode);
    if (!pendingGameGenerator) {
        console.error("No hay generador de juego pendiente.");
        alert("Error interno: No se pudo iniciar el test. Intenta recargar.");
        return;
    }

    try {
        const questions = pendingGameGenerator(); // Generar las preguntas (filtrar, random, etc)
        console.log("Preguntas generadas:", questions ? questions.length : 0);

        if (!questions || questions.length === 0) {
            alert("Este tema no tiene preguntas disponibles aún.");
            return;
        }

        startGame(questions, mode, pendingTopicTitle);
    } catch (e) {
        console.error("Error al generar preguntas:", e);
        alert("Ocurrió un error al preparar las preguntas.");
    }
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
    document.getElementById('tema-tag').textContent = temaMatch ? temaMatch[0] : (q.tema || 'General');

    // Update Mode Tag
    const modeTag = document.getElementById('mode-tag');
    if (currentMode === 'exam') {
        modeTag.textContent = "Examen";
        modeTag.style.background = "#ffebee"; // Red tint
        modeTag.style.color = "#c62828";
    } else if (currentMode === 'failures') {
        modeTag.textContent = "Repaso Fallos";
        modeTag.style.background = "#fff3e0"; // Orange tint
        modeTag.style.color = "#ef6c00";
    } else {
        modeTag.textContent = "Entrenamiento";
        modeTag.style.background = "#e8f5e9"; // Green tint
        modeTag.style.color = "#2e7d32";
    }

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

        // Restaurar estado si ya se respondió (navegación atrás)
        if (userAnswers[currentIndex] === letter) {
            btn.disabled = true;
            if (currentMode === 'exam') {
                btn.classList.add('selected'); // Estilo visual simple
                btn.style.border = "2px solid var(--primary)";
                btn.style.background = "#eef";
            } else {
                // Training/Failures coloring
                if (letter === q.correcta) btn.classList.add('correct');
                else btn.classList.add('incorrect');
            }
        } else if (userAnswers[currentIndex]) {
            btn.disabled = true; // Deshabilitar las no elegidas
            if (currentMode !== 'exam' && letter === q.correcta) {
                btn.classList.add('correct'); // Mostrar la correcta si falló
            }
        }

        optionsDiv.appendChild(btn);
    });

    // MODO EXAMEN / REVISIÓN: Permitir saltar (Next visible siempre)
    if (currentMode === 'exam' || currentMode === 'review') {
        document.getElementById('btn-next').classList.remove('hidden');
        document.getElementById('btn-next').textContent = (currentIndex === currentQuestions.length - 1) ?
            (currentMode === 'exam' ? "Finalizar Examen 🏁" : "Volver a Resultados 🏁")
            : "Siguiente ➡";
    }
}

function handleAnswer(selected) {
    if (currentMode === 'review') return; // Read-only in review
    if (currentMode !== 'exam' && userAnswers[currentIndex]) return; // Block in training if answered

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
        saveFailedId(q.id); // Guardar fallo para siempre
    }

    // UI Feedback
    const options = document.getElementById('opciones-container').children;

    if (currentMode === 'exam') {
        // En examen solo iluminamos la que pulsó el usuario
        for (let btn of options) {
            // NO deshabilitar botones en examen (permitir corregir)
            // btn.disabled = true; <-- REMOVED

            // Reset styles first
            btn.style.border = "";
            btn.style.background = "";
            btn.classList.remove('selected');

            if (btn.innerText.startsWith(`${selected.toUpperCase()})`)) {
                btn.style.border = "2px solid var(--primary)";
                btn.style.background = "#eef";
                btn.classList.add('selected');
            }
        }
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
        setTimeout(() => document.getElementById('btn-next').scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }

    // Update botón Next text (For training, becase Exam is always visible)
    if (currentMode !== 'exam') {
        const btnNext = document.getElementById('btn-next');
        btnNext.textContent = (currentIndex === currentQuestions.length - 1) ? "Finalizar Test 🏁" : "Siguiente ➡";
    }
}

function nextQuestion() {
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        if (currentMode === 'review') {
            showView('results'); // Volver a pantalla de resultados 
        } else {
            finishGame();
        }
    }
}

function finishGame() {
    // Calcular Estadísticas
    const total = currentQuestions.length;
    let aciertos = 0;
    let fallos = 0;
    let blancas = 0;

    // Recalcular basado en userAnswers (más seguro que variable score)
    currentQuestions.forEach((q, index) => {
        const answer = userAnswers[index];
        if (!answer) {
            blancas++;
        } else if (answer === q.correcta) {
            aciertos++;
        } else {
            fallos++;
        }
    });

    // Puntuación Final
    let finalScore = 0;
    let maxScore = total; // En entrenamiento es simples aciertos
    let message = "";

    if (currentMode === 'exam') {
        // Fórmula: Aciertos - (Fallos / 3)
        // Nota sobre 10 para visualización
        const rawScore = aciertos - (fallos / 3);
        finalScore = Math.max(0, rawScore); // No negativos

        // Puntuación para vista (ajustada a escala 0-10)
        // Valor de cada pregunta = 10 / total
        const pointsPerQ = 10 / total;
        const notaNumerica = finalScore * pointsPerQ;

        score = finalScore.toFixed(2); // Guardamos la neta para display

        // Mensaje Examen
        if (notaNumerica >= 5) message = `¡Aprobado! (Nota: ${notaNumerica.toFixed(2)}) 🎉`;
        else message = `Suspenso (Nota: ${notaNumerica.toFixed(2)}) 📚`;

        // Detalles para Examen
        const detailsEnv = document.getElementById('exam-feedback-container');
        detailsEnv.classList.remove('hidden');
        detailsEnv.innerHTML = `
            <div style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #ddd;">
                <h4>📊 Desglose de Puntuación</h4>
                <ul style="list-style:none; padding:0; line-height:1.6;">
                    <li>✅ <strong>Aciertos:</strong> ${aciertos} <span style="color:green;">(+1.00)</span></li>
                    <li>❌ <strong>Errores:</strong> ${fallos} <span style="color:red;">(-0.33)</span></li>
                    <li>⚪ <strong>Blancas:</strong> ${blancas} <span style="color:gray;">(0.00)</span></li>
                    <li style="margin-top:10px; border-top:1px solid #ccc; padding-top:5px;">
                        <strong>Puntuación Neta:</strong> ${Math.round(aciertos)} - ${(fallos / 3).toFixed(2)} = <strong>${finalScore.toFixed(2)}</strong> / ${total}
                    </li>
                    <li style="font-size:1.1em; color:var(--primary); margin-top:5px;">
                        <strong>Nota Final (0-10): ${notaNumerica.toFixed(2)}</strong>
                    </li>
                </ul>
                <p style="font-size:0.85em; color:#777; margin-top:10px;">
                    * Fórmula: Aciertos - (Errores / 3).
                </p>
            </div>
        `;

        // Guardar en historial la nota numérica (más representativa)
        saveHistory(currentTopicName + ` [Examen]`, notaNumerica.toFixed(2), 10);

    } else {
        // MODO ENTRENAMIENTO / FALLOS
        score = aciertos;
        const pct = (aciertos / total) * 100;

        if (pct === 100) message = "¡Perfecto! 🏆";
        else if (pct >= 80) message = "¡Excelente! 🌟";
        else if (pct >= 50) message = "Aprobado 👍";
        else message = "A repasar... 📚";

        document.getElementById('exam-feedback-container').classList.add('hidden');
        saveHistory(currentTopicName + ` [${currentMode}]`, aciertos, total);
    }

    showView('results');

    // Display Principal
    if (currentMode === 'exam') {
        const nota = (Math.max(0, aciertos - (fallos / 3)) * (10 / total));
        document.getElementById('final-score').textContent = nota.toFixed(1);
        document.getElementById('final-total').textContent = "/ 10";

        // Show Review Button
        // Show Review Buttons
        const btnReview = document.getElementById('btn-review-exam');
        const btnReviewFailed = document.getElementById('btn-review-failed');

        if (btnReview) {
            btnReview.classList.remove('hidden');
            btnReview.onclick = () => startReviewMode(false);
        }

        if (btnReviewFailed) {
            // Only show if there are errors or unanswered
            if (fallos > 0 || blancas > 0) {
                btnReviewFailed.classList.remove('hidden');
                btnReviewFailed.onclick = () => startReviewMode(true);
            } else {
                btnReviewFailed.classList.add('hidden');
            }
        }

    } else {
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-total').textContent = `/ ${total}`;
        document.getElementById('btn-review-exam').classList.add('hidden');
    }

    document.getElementById('final-message').textContent = message;
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

function showGrid() {
    const overlay = document.getElementById('nav-grid-overlay');
    const container = document.getElementById('grid-buttons');
    document.getElementById('grid-total').textContent = currentQuestions.length;

    container.innerHTML = '';

    currentQuestions.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-grid-number';
        btn.textContent = index + 1;

        // Estado
        const answer = userAnswers[index];
        if (index === currentIndex) btn.classList.add('current');
        if (answer) btn.classList.add('answered');

        // Mark correct/incorrect if in review or training (and answered)
        if (currentMode !== 'exam' && answer) {
            if (answer === q.correcta) btn.style.borderColor = "var(--success)";
            else btn.style.borderColor = "var(--error)";
        }

        btn.onclick = () => {
            currentIndex = index;
            renderQuestion();
            overlay.classList.add('hidden');
        };

        container.appendChild(btn);
    });

    overlay.classList.remove('hidden');
}

function startReviewMode(onlyFailures = false) {
    let questionsToReview = currentQuestions;
    let answersToReview = { ...userAnswers };
    const topicToReview = currentTopicName;

    if (onlyFailures) {
        // Filter: Failures AND Unanswered
        const indicesToKeep = currentQuestions.map((q, i) => i).filter(i => {
            const ans = userAnswers[i];
            return !ans || ans !== currentQuestions[i].correcta;
        });

        if (indicesToKeep.length === 0) {
            alert("¡No tienes fallos para revisar! 🏆");
            return;
        }

        const newQuestions = indicesToKeep.map(i => currentQuestions[i]);
        const newAnswers = {};

        // Remap answers to new indices
        indicesToKeep.forEach((oldIndex, newIndex) => {
            if (userAnswers[oldIndex]) {
                newAnswers[newIndex] = userAnswers[oldIndex];
            }
        });

        questionsToReview = newQuestions;
        answersToReview = newAnswers;
    }

    startGame(questionsToReview, 'review', topicToReview + (onlyFailures ? ' (Solo Fallos)' : ' (Completo)'));

    // Restore answers
    userAnswers = answersToReview;
    renderQuestion();
}
