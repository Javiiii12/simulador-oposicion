export const state = {
    allQuestions: [],
    currentQuestions: [],
    currentIndex: 0,
    score: 0,
    userAnswers: {},
    currentMode: 'training', // 'training', 'exam', 'failures', 'review'
    originalMode: 'training',
    currentSource: null,
    currentCategory: null,
    currentTopicName: "",
    lastViewBeforeMode: 'menu',
    supabaseClient: null,
    timeRemaining: 0,       // Segundos restantes del cronómetro
    timerInterval: null     // Referencia al setInterval activo
};

export function resetGameState() {
    state.currentIndex = 0;
    state.score = 0;
    state.userAnswers = {};
    state.timeRemaining = 0;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}
