/**
 * game.js — Game engine: renders questions, handles answers, navigation, results.
 * Ported from script.js and adapted as an ES Module.
 */
import { state, resetGameState } from './state.js';
import { showView, toggleEl, updateFailureBadge } from './ui.js';
import { addFailedId, removeFailedId, getFailedIds, addHistoryEntry, saveSuspendedSession, clearSuspendedSession } from './storage.js';

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start a game session.
 * @param {Array}  questions  The question set to play.
 * @param {string} mode       'training' | 'exam' | 'failures' | 'review'
 * @param {string} topicName  Display name for the session.
 */
export function startGame(questions, mode, topicName) {
    if (!questions || questions.length === 0) {
        alert('No hay preguntas para iniciar este test.');
        return;
    }

    // ── Auto-limpieza: si había un test en pausa, se descarta al iniciar uno nuevo ──
    if (mode !== 'review') {
        clearSuspendedSession();
    }

    state.currentQuestions = questions;
    state.currentMode = mode;
    state.currentTopicName = topicName;
    resetGameState();

    if (mode !== 'review') state.originalMode = mode;

    // Show / hide the "Vaciar Fallos" button in the game header
    toggleEl('btn-clear-failures-header', mode === 'failures');

    showView('game');
    renderQuestion();
    saveCurrentSession();
}

/**
 * Initialise a review session from the results screen.
 * @param {boolean} onlyFailures  true = show only wrong/unanswered.
 */
export function startReviewMode(onlyFailures = false) {
    let questions = state.currentQuestions;
    let answersSnap = { ...state.userAnswers };
    const topicName = state.currentTopicName;

    if (onlyFailures) {
        const idxToKeep = questions
            .map((_q, i) => i)
            .filter(i => {
                const ans = state.userAnswers[i];
                if (!ans) return false;  // skip blancs — only answered-wrong count as fallos
                const question = questions[i];
                return ans.toLowerCase() !== (question.correcta || '').toLowerCase();
            });

        if (idxToKeep.length === 0) {
            alert('¡No tienes fallos para revisar! 🏆');
            return;
        }

        const newAnswers = {};
        idxToKeep.forEach((oldIdx, newIdx) => {
            if (state.userAnswers[oldIdx]) newAnswers[newIdx] = state.userAnswers[oldIdx];
        });

        questions = idxToKeep.map(i => state.currentQuestions[i]);
        answersSnap = newAnswers;
    }

    startGame(questions, 'review', topicName + (onlyFailures ? ' (Solo Fallos)' : ' (Completo)'));

    // Restore the saved answers so user sees their previous choices
    state.userAnswers = answersSnap;
    renderQuestion();
}

// ── Navigation handlers (called from main.js event listeners) ─────────────────

export function nextQuestion() {
    if (state.currentIndex < state.currentQuestions.length - 1) {
        state.currentIndex++;
        renderQuestion();
        saveCurrentSession();
    } else {
        if (state.currentMode === 'review') {
            showView('results');
        } else {
            finishGame();
        }
    }
}

export function prevQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
        saveCurrentSession();
    }
}

export function showGrid() {
    const container = document.getElementById('grid-buttons');
    const overlay = document.getElementById('nav-grid-overlay');
    document.getElementById('grid-total').textContent = state.currentQuestions.length;
    container.innerHTML = '';

    state.currentQuestions.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-grid-number';
        btn.textContent = index + 1;

        const answer = state.userAnswers[index];
        if (index === state.currentIndex) btn.classList.add('current');
        if (answer) {
            btn.classList.add('answered');
            if (state.currentMode !== 'exam') {
                const isOk = answer === q.correcta;
                btn.style.backgroundColor = isOk ? 'var(--success)' : 'var(--error)';
                btn.style.color = 'white';
                btn.style.borderColor = isOk ? 'var(--success)' : 'var(--error)';
            }
        }

        btn.addEventListener('click', () => {
            state.currentIndex = index;
            renderQuestion();
            overlay.classList.add('hidden');
            saveCurrentSession();
        });
        container.appendChild(btn);
    });

    overlay.classList.remove('hidden');
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function renderQuestion() {
    const q = state.currentQuestions[state.currentIndex];
    const mode = state.currentMode;

    // Counter + progress bar
    document.getElementById('question-counter').textContent =
        `${state.currentIndex + 1}/${state.currentQuestions.length}`;
    document.getElementById('score-badge').textContent =
        mode === 'exam' ? '???' : `Aciertos: ${state.score}`;
    const pct = (state.currentIndex / state.currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Tema tag
    const temaMatch = q?.tema?.match(/Tema \d+/);
    document.getElementById('tema-tag').textContent =
        temaMatch ? temaMatch[0] : (q?.tema || 'General');

    // Mode tag
    const modeTag = document.getElementById('mode-tag');
    const modeStyles = {
        exam: { text: 'Examen', bg: '#ffebee', color: '#c62828' },
        failures: { text: 'Repaso Fallos', bg: '#fff3e0', color: '#ef6c00' },
        review: { text: 'Revisión', bg: '#e3f2fd', color: '#1565c0' },
        training: { text: 'Entrenamiento', bg: '#e8f5e9', color: '#2e7d32' }
    };
    const style = modeStyles[mode] || modeStyles.training;
    modeTag.textContent = style.text;
    modeTag.style.background = style.bg;
    modeTag.style.color = style.color;

    // Prev button: only in exam/review modes
    const btnPrev = document.getElementById('btn-prev');
    btnPrev.classList.toggle('hidden', mode !== 'exam' && mode !== 'review');

    // Question text
    document.getElementById('pregunta-texto').textContent = q.pregunta;

    // Clear feedback
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('explicacion').innerHTML = '';

    // Next button default
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.add('hidden');
    btnNext.innerHTML = buildNextButtonLabel();

    // Render options
    const optContainer = document.getElementById('opciones-container');
    optContainer.innerHTML = '';
    ['a', 'b', 'c', 'd'].forEach(letter => {
        if (!q.opciones?.[letter]) return;
        const btn = createOptionButton(q, letter);
        optContainer.appendChild(btn);
    });

    // Exam / review / already answered / paused restoration: check visibility
    const alreadyAnswered = state.userAnswers && state.userAnswers[state.currentIndex];
    if (mode === 'exam' || mode === 'review' || alreadyAnswered) {
        btnNext.classList.remove('hidden');
        btnNext.innerHTML = buildNextButtonLabel();
    }
}

function buildNextButtonLabel() {
    const isLast = state.currentIndex === state.currentQuestions.length - 1;
    const mode = state.currentMode;
    if (isLast) {
        if (mode === 'exam') return 'Finalizar Examen 🏁';
        if (mode === 'review') return 'Volver a Resultados 🏁';
        return 'Finalizar Test 🏁';
    }
    return 'Siguiente <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
}

function createOptionButton(q, letter) {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerHTML = `<strong>${letter.toUpperCase()})</strong> ${q.opciones[letter]}`;

    const answered = state.userAnswers[state.currentIndex];

    if (answered && state.currentMode !== 'exam') {
        // Training/failures: restore locked state with colour feedback
        applyAnswerStyle(btn, letter, q.correcta, answered, state.currentMode);
    } else {
        // Exam mode (even if already answered) OR fresh — allow (re)answering
        if (answered && state.currentMode === 'exam') {
            // Pre-highlight stored selection without locking
            if (letter === answered) {
                btn.style.border = '2px solid var(--primary)';
                btn.style.background = 'rgba(79,70,229,0.12)';
                btn.classList.add('selected');
            }
        }
        btn.addEventListener('click', () => handleAnswer(letter, q));
    }

    return btn;
}

function applyAnswerStyle(btn, letter, correcta, chosen, mode) {
    btn.disabled = true;
    if (mode === 'exam') {
        if (letter === chosen) {
            btn.style.border = '2px solid var(--primary)';
            btn.style.background = '#eef';
            btn.classList.add('selected');
        }
    } else {
        if (letter === correcta) btn.classList.add('correct');
        else if (letter === chosen) btn.classList.add('incorrect');
    }
}

function handleAnswer(selected, q) {
    if (state.currentMode === 'review') return;
    if (state.currentMode !== 'exam' && state.userAnswers[state.currentIndex]) return;

    const isCorrect = selected === q.correcta;
    state.userAnswers[state.currentIndex] = selected;

    // Score + failure tracking
    if (isCorrect) {
        state.score++;
        if (state.currentMode === 'failures') {
            removeFailedId(q.id);
            updateFailureBadge(getFailedIds().length);
        }
    } else {
        addFailedId(q.id);
        updateFailureBadge(getFailedIds().length);
    }

    // Exam mode: highlight selected, keep ALL buttons re-clickable
    const optContainer = document.getElementById('opciones-container');
    const buttons = [...optContainer.children];

    if (state.currentMode === 'exam') {
        buttons.forEach(b => {
            // Reset visual state on all options
            b.style.border = '';
            b.style.background = '';
            b.classList.remove('selected');
            // Highlight only the newly selected one
            const ltr = b.innerHTML.charAt(b.innerHTML.indexOf(')') - 1).toLowerCase();
            if (ltr === selected) {
                b.style.border = '2px solid var(--primary)';
                b.style.background = 'rgba(79,70,229,0.12)';
                b.classList.add('selected');
            }
            // Always re-attach listener so the user can change their answer
            const newBtn = b.cloneNode(true);
            newBtn.style.border = b.style.border;
            newBtn.style.background = b.style.background;
            if (b.classList.contains('selected')) newBtn.classList.add('selected');
            newBtn.addEventListener('click', () => handleAnswer(ltr, q));
            b.replaceWith(newBtn);
        });
    } else {
        // Training / failures: lock and colour
        buttons.forEach(b => {
            b.disabled = true;
            const ltr = b.innerHTML.charAt(b.innerHTML.indexOf(')') - 1).toLowerCase();
            if (ltr === q.correcta) b.classList.add('correct');
            else if (ltr === selected) b.classList.add('incorrect');
        });

        // Show feedback
        const feedbackDiv = document.getElementById('feedback');
        const explicacionP = document.getElementById('explicacion');
        feedbackDiv.classList.remove('hidden');
        if (isCorrect) {
            explicacionP.innerHTML = '<strong>✅ ¡Correcto!</strong>';
            feedbackDiv.style.backgroundColor = '#e8f5e9';
            feedbackDiv.style.borderLeftColor = '#4caf50';
        } else {
            explicacionP.innerHTML = `<strong>❌ Incorrecto</strong><br>La respuesta correcta es la <strong>${q.correcta.toUpperCase()}</strong>.`;
            feedbackDiv.style.backgroundColor = '#ffebee'; /* Light Red background */
            feedbackDiv.style.borderLeftColor = '#b91c1c';   /* Dark Red border */
        }
    }

    // Show / update Next button
    const btnNext = document.getElementById('btn-next');
    btnNext.classList.remove('hidden');
    btnNext.innerHTML = buildNextButtonLabel();
    setTimeout(() => btnNext.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    
    saveCurrentSession();
}

function finishGame() {
    clearSuspendedSession();
    const total = state.currentQuestions.length;
    let aciertos = 0, fallos = 0, blancos = 0;

    state.currentQuestions.forEach((q, i) => {
        const ans = state.userAnswers[i];
        if (!ans) blancos++;
        else if (ans === q.correcta) aciertos++;
        else fallos++;
    });

    const percentage = Math.round((aciertos / total) * 100);

    // ── Exam: penalised score ──
    if (state.currentMode === 'exam') {
        const rawScore = aciertos - fallos / 3;
        const finalScore = Math.max(0, rawScore);
        const pointsPerQ = 10 / total;
        const notaNumerica = finalScore * pointsPerQ;

        document.getElementById('final-score').textContent = finalScore.toFixed(2);
        document.getElementById('final-total').textContent = `/ ${total} pts`;

        const detailsEl = document.getElementById('exam-feedback-container');
        detailsEl.classList.remove('hidden');
        detailsEl.innerHTML = `
            <div style="background:#f9f9f9;padding:15px;border-radius:8px;border:1px solid #ddd;">
              <h4>📊 Desglose de Puntuación</h4>
              <ul style="list-style:none;padding:0;line-height:1.8;">
                <li>✅ <strong>Aciertos:</strong> ${aciertos}</li>
                <li>❌ <strong>Errores:</strong> ${fallos} <span style="color:red;">(-0.33 c/u)</span></li>
                <li>⚪ <strong>Blancas:</strong> ${blancos}</li>
                <li style="margin-top:8px;border-top:1px solid #ccc;padding-top:6px;">
                    <strong>Puntuación neta:</strong> ${aciertos} - ${(fallos / 3).toFixed(2)} = <strong>${finalScore.toFixed(2)}</strong>
                </li>
                <li style="font-size:1.1em;color:var(--primary);">
                    <strong>Nota Final (0–10): ${notaNumerica.toFixed(2)}</strong>
                </li>
              </ul>
              <p style="font-size:0.85em;color:#777;">* Fórmula oficial: Aciertos − (Errores / 3)</p>
            </div>`;

        addHistoryEntry({
            date: new Date().toLocaleDateString('es-ES'),
            topic: state.currentTopicName + ' [Examen]',
            score: notaNumerica.toFixed(2),
            total: 10,
            pct: Math.round(notaNumerica * 10)
        });

    } else {
        // ── Training / Failures ──
        document.getElementById('final-score').textContent = aciertos;
        document.getElementById('final-total').textContent = `/ ${total} pts`;
        document.getElementById('exam-feedback-container').classList.add('hidden');

        if (state.currentMode !== 'failures') {
            addHistoryEntry({
                date: new Date().toLocaleDateString('es-ES'),
                topic: state.currentTopicName + ' [Entrenamiento]',
                score: aciertos,
                total,
                pct: percentage
            });
        }
    }

    // Motivational feedback
    const pctEl = document.getElementById('resultado-porcentaje');
    const txtEl = document.getElementById('resultado-texto');
    pctEl.textContent = `${percentage}% de Aciertos`;

    // Calculamos la nota sobre 10 oficial (Aciertos - Fallos/3) para el feedback
    const rawScoreFeed = aciertos - (fallos / 3);
    const notaFinalFeed = Math.max(0, rawScoreFeed) * (10 / total);

    // Limpiar colores inline por si existían, para que actúen las clases CSS
    pctEl.style.color = '';
    txtEl.style.color = '';

    if (notaFinalFeed >= 9) {
        pctEl.className = 'texto-exito-teal';
        txtEl.className = 'texto-exito-teal';
        txtEl.textContent = '¡Excelente! Plaza casi asegurada. 🏆';
    } else if (notaFinalFeed >= 7) {
        pctEl.className = 'texto-bien-teal';
        txtEl.className = 'texto-bien-teal';
        txtEl.textContent = '¡Muy buen trabajo! Vas por el buen camino. 🚀';
    } else if (notaFinalFeed >= 5) {
        pctEl.className = 'texto-aviso-naranja';
        txtEl.className = 'texto-aviso-naranja';
        txtEl.textContent = '¡Aprobado! Pero hay margen de mejora, repasa los fallos. 📚';
    } else if (notaFinalFeed >= 3) {
        pctEl.className = 'texto-peligro-rojo';
        txtEl.className = 'texto-peligro-rojo';
        txtEl.textContent = '¡No te rindas! De los errores se aprende. Revisa los fallos. 💪';
    } else {
        pctEl.className = 'texto-peligro-rojo';
        txtEl.className = 'texto-peligro-rojo';
        txtEl.textContent = 'Duro golpe, pero es solo un simulacro. ¡A seguir estudiando! ☕';
    }

    // Review buttons
    const btnReviewAll = document.getElementById('btn-review-exam');
    const btnReviewFailed = document.getElementById('btn-review-failed');

    if (btnReviewAll) {
        btnReviewAll.classList.remove('hidden');
        // Remove old listener before adding new one
        const newBtn = btnReviewAll.cloneNode(true);
        newBtn.addEventListener('click', () => startReviewMode(false));
        btnReviewAll.replaceWith(newBtn);
    }

    if (btnReviewFailed) {
        if (fallos > 0 || blancos > 0) {
            btnReviewFailed.classList.remove('hidden');
            const newBtn = btnReviewFailed.cloneNode(true);
            newBtn.addEventListener('click', () => startReviewMode(true));
            btnReviewFailed.replaceWith(newBtn);
        } else {
            btnReviewFailed.classList.add('hidden');
        }
    }

    // Show "Borrar Fallos" if there are any stored
    const btnClearFail = document.getElementById('btn-clear-failures');
    if (btnClearFail) toggleEl('btn-clear-failures', getFailedIds().length > 0);

    updateFailureBadge(getFailedIds().length);
    showView('results');
}

export function saveCurrentSession() {
    if (state.currentMode === 'review') return; // No guardamos los repasos
    const sessionData = {
        currentMode: state.currentMode,
        originalMode: state.originalMode,
        currentTopicName: state.currentTopicName,
        currentQuestions: state.currentQuestions,
        currentIndex: state.currentIndex,
        score: state.score,
        userAnswers: state.userAnswers
    };
    saveSuspendedSession(sessionData);
}

export function restoreSession(savedState) {
    if (!savedState || !savedState.currentQuestions) return;

    state.currentMode = savedState.currentMode || 'training';
    state.originalMode = savedState.originalMode || state.currentMode;
    state.currentTopicName = savedState.currentTopicName || 'Test Rescatado';
    state.currentQuestions = savedState.currentQuestions;
    state.currentIndex = savedState.currentIndex || 0;
    state.score = savedState.score || 0;
    state.userAnswers = savedState.userAnswers || {};

    // Sincronizar UI
    toggleEl('btn-clear-failures-header', state.currentMode === 'failures');
    showView('game');

    // Forzar el render para actualizar contadores y botones basados en la longitud real
    renderQuestion();
}

// ── Vista Completa (Scroll Continuo) ──────────────────────────────────────────

let _fullViewActive = false;

export function toggleFullView() {
    _fullViewActive = !_fullViewActive;

    const singleCard = document.querySelector('#view-game .question-card');
    const controls   = document.querySelector('#view-game .controls');
    const fullView   = document.getElementById('full-exam-view');
    const toggleBtn  = document.getElementById('btn-toggle-fullview');

    if (_fullViewActive) {
        // Ocultar vista individual
        if (singleCard) singleCard.classList.add('hidden');
        if (controls)   controls.classList.add('hidden');
        if (toggleBtn)  toggleBtn.classList.add('active-view-btn');
        renderFullView(fullView);
        fullView.classList.remove('hidden');
    } else {
        // Volver a vista individual
        fullView.classList.add('hidden');
        if (singleCard) singleCard.classList.remove('hidden');
        if (controls)   controls.classList.remove('hidden');
        if (toggleBtn)  toggleBtn.classList.remove('active-view-btn');
        // Sincronizar: re-renderizar la pregunta actual con las respuestas dadas en la vista completa
        renderQuestion();
    }
}

function renderFullView(container) {
    container.innerHTML = '';
    container.className = 'full-exam-view';

    state.currentQuestions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'full-view-question-card';
        card.dataset.idx = idx;

        const header = document.createElement('div');
        header.className = 'full-view-q-header';
        header.innerHTML = `<span class="full-view-q-num">${idx + 1}</span><span class="tag" style="font-size:0.75rem;">${(q.tema || '').match(/Tema \d+/)?.[0] || 'General'}</span>`;
        card.appendChild(header);

        const qText = document.createElement('p');
        qText.className = 'full-view-q-text';
        qText.textContent = q.pregunta;
        card.appendChild(qText);

        const optsDiv = document.createElement('div');
        optsDiv.className = 'full-view-opts';

        ['a', 'b', 'c', 'd'].forEach(letter => {
            if (!q.opciones?.[letter]) return;
            const btn = document.createElement('button');
            btn.className = 'btn-option full-view-opt';
            btn.innerHTML = `<strong>${letter.toUpperCase()})</strong> ${q.opciones[letter]}`;

            // Highlight if already answered
            const chosen = state.userAnswers[idx];
            if (chosen === letter) {
                btn.classList.add('exam-selected');
            }

            btn.addEventListener('click', () => {
                // Update global answer state
                state.userAnswers[idx] = letter;

                // Score tracking for training/failures (not exam)
                if (state.currentMode !== 'exam') {
                    if (letter === q.correcta) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('incorrect');
                        addFailedId(q.id);
                        updateFailureBadge(getFailedIds().length);
                    }
                    // Lock all siblings
                    [...optsDiv.children].forEach(b => { b.disabled = true; });
                } else {
                    // Exam: move highlight
                    [...optsDiv.children].forEach(b => b.classList.remove('exam-selected'));
                    btn.classList.add('exam-selected');
                }

                // Persist session
                saveCurrentSession();
            });

            optsDiv.appendChild(btn);
        });

        card.appendChild(optsDiv);
        container.appendChild(card);
    });

    // Botón Finalizar al final
    const finishBtn = document.createElement('button');
    finishBtn.className = 'btn-primary full-view-finish-btn';
    finishBtn.innerHTML = 'Finalizar Test 🏁';
    finishBtn.addEventListener('click', () => {
        // Salir de la vista completa antes de calcular resultados
        _fullViewActive = false;
        const singleCard = document.querySelector('#view-game .question-card');
        const controls   = document.querySelector('#view-game .controls');
        const fullView   = document.getElementById('full-exam-view');
        const toggleBtn  = document.getElementById('btn-toggle-fullview');
        if (singleCard) singleCard.classList.remove('hidden');
        if (controls)   controls.classList.remove('hidden');
        if (toggleBtn)  toggleBtn.classList.remove('active-view-btn');
        fullView.classList.add('hidden');
        finishGame();
    });
    container.appendChild(finishBtn);
}
