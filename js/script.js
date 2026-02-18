// State
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // Map: index -> selectedOptionKey (e.g., 'a')
let score = 0;

// DOM Elements
const loadingEl = document.getElementById('loading');
const quizArea = document.getElementById('quiz-area');
const footerNav = document.getElementById('footer-nav');

const topicBadge = document.getElementById('topic-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const feedbackArea = document.getElementById('feedback-area');
const feedbackTitle = document.getElementById('feedback-title');
const explanationBox = document.getElementById('explanation-box');

const currentQNumEl = document.getElementById('current-q-num');
const totalQNumEl = document.getElementById('total-q-num');
const progressBar = document.getElementById('progress-bar');
const scoreEl = document.getElementById('score');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

async function loadQuestions() {
    try {
        const response = await fetch('data/preguntas.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo');

        questions = await response.json();

        if (!questions || questions.length === 0) {
            loadingEl.textContent = 'No hay preguntas disponibles.';
            return;
        }

        // Randomize questions (optional - uncomment if desired)
        // questions.sort(() => Math.random() - 0.5);

        totalQNumEl.textContent = questions.length;
        loadingEl.style.display = 'none';
        quizArea.style.display = 'flex';
        footerNav.style.display = 'flex';

        renderQuestion(0);
    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `Error al cargar preguntas: ${error.message}.<br><br>Asegúrate de que 'preguntas.json' está en la misma carpeta y estás usando un servidor web (o GitHub Pages).`;
    }
}

function renderQuestion(index) {
    const q = questions[index];
    currentQuestionIndex = index;

    // Update Header
    currentQNumEl.textContent = index + 1;
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Content
    topicBadge.textContent = q.tema || 'General';
    questionText.textContent = q.pregunta;

    // Options
    optionsContainer.innerHTML = '';
    const existingAnswer = userAnswers[index];
    const isAnswered = existingAnswer !== undefined;

    Object.entries(q.opciones).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${key.toUpperCase()}</span> ${value}`;
        btn.onclick = () => selectAnswer(key);

        // If already answered, apply styles
        if (isAnswered) {
            btn.disabled = true;
            if (key === q.correcta) {
                btn.classList.add('correct');
            } else if (key === existingAnswer) {
                btn.classList.add('incorrect');
            }
        }

        optionsContainer.appendChild(btn);
    });

    // Feedback / Explanation
    if (isAnswered) {
        feedbackArea.style.display = 'block';
        explanationBox.textContent = q.explicacion;

        const isCorrect = existingAnswer === q.correcta;
        if (isCorrect) {
            feedbackTitle.innerHTML = '<span style="color:var(--success-color)">✔ ¡Correcto!</span>';
            feedbackTitle.style.color = 'var(--success-color)';
        } else {
            feedbackTitle.innerHTML = '<span style="color:var(--error-color)">✖ Incorrecto</span>';
            feedbackTitle.style.color = 'var(--error-color)';
        }
    } else {
        feedbackArea.style.display = 'none';
    }

    // Navigation Buttons
    prevBtn.disabled = index === 0;
    if (index === questions.length - 1) {
        nextBtn.textContent = 'Finalizar';
    } else {
        nextBtn.textContent = 'Siguiente';
    }
}

function selectAnswer(selectedKey) {
    if (userAnswers[currentQuestionIndex] !== undefined) return; // Prevent re-answering

    const q = questions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedKey;

    // Check correctness
    const isCorrect = selectedKey === q.correcta;
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
        // Trigger confetti or sound here if desired
    }

    // Re-render to show styles and feedback
    renderQuestion(currentQuestionIndex);
}

// Make functions available globally for HTML onClick
window.nextQuestion = function () {
    if (currentQuestionIndex < questions.length - 1) {
        renderQuestion(currentQuestionIndex + 1);
    } else {
        alert(`¡Examen finalizado! Tu puntuación final es: ${score} de ${questions.length}`);
    }
}

window.prevQuestion = function () {
    if (currentQuestionIndex > 0) {
        renderQuestion(currentQuestionIndex - 1);
    }
}
