import { state } from './modules/state.js';
import * as Data from './modules/data.js';

document.addEventListener('DOMContentLoaded', () => {
    // Basic initialization for Phase 1 verification
    console.log("App Initializing (Phase 1)...");

    // Anty-copy protections
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'p' || e.key === 'a' || e.key === 's')) {
            e.preventDefault();
        }
    });

    // Load data and show count
    Data.loadAllData().then(questions => {
        const welcomeMsg = document.querySelector('#access-msg');
        if (welcomeMsg) {
            welcomeMsg.innerText = `Datos cargados: ${questions.length} preguntas.`;
        }

        // For Phase 1, we just want to see the main role selection view if possible
        // but we need the auth logic eventually. 
        // Right now, let's just make the role selection visible to prove UI works.
        const roleView = document.getElementById('view-role-selection');
        const accessOverlay = document.getElementById('access-overlay');

        if (roleView) {
            roleView.classList.remove('hidden');
            roleView.classList.add('active');
        }
        if (accessOverlay) {
            accessOverlay.classList.add('hidden');
        }
    });
});
