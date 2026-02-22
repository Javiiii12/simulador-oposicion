export const state = {
    allQuestions: [],
    currentQuestions: [],
    currentIndex: 0,
    score: 0,
    userAnswers: {},
    currentMode: 'training', // 'training', 'exam', 'failures', 'review'
    originalMode: 'training',
    currentSource: null,
    currentTopicName: "",
    supabaseClient: null
};

export function resetGameState() {
    state.currentIndex = 0;
    state.score = 0;
    state.userAnswers = {};
}
