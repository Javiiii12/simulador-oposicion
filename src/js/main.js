import * as Data from './modules/data.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("App: DOMContentLoaded — starting Phase 1 init...");

    // Anti-copy protections (same as the original script.js)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'p' || e.key === 'a' || e.key === 's')) {
            e.preventDefault();
        }
    });

    // Show a "loading" message while data fetches
    const accessMsg = document.getElementById('access-msg');
    if (accessMsg) accessMsg.innerText = 'Cargando preguntas...';

    Data.loadAllData().then(questions => {
        console.log(`App: loadAllData() returned ${questions.length} questions.`);

        // Hide the access overlay and show the role-selection view
        const accessOverlay = document.getElementById('access-overlay');
        if (accessOverlay) accessOverlay.classList.add('hidden');

        const roleView = document.getElementById('view-role-selection');
        if (roleView) {
            // Remove hidden just in case, ensure active class is set
            roleView.classList.remove('hidden');
            roleView.classList.add('active');
        }

        // Update the version counter with the number of loaded questions (optional)
        const versionEl = document.querySelector('#view-role-selection p[style]');
        if (versionEl) {
            const current = versionEl.innerHTML;
            if (!current.includes('preguntas')) {
                versionEl.innerHTML = current.replace('v1.13.0 (Security)', `v1.14.0 (Modular) — ${questions.length} preguntas`);
            }
        }
    }).catch(err => {
        console.error("App: Fatal error during data load:", err);
    });
});
