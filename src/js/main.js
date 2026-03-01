/**
 * main.js — Application entry point.
 * Orchestrates: auth → data load → UI init → ALL event listeners.
 */
import * as Auth from './modules/auth.js';
import * as Data from './modules/data.js';
import * as UI from './modules/ui.js';
import * as Storage from './modules/storage.js';
import * as Topics from './modules/topics.js';
import * as Game from './modules/game.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
    // ── Anti-copy protections ──────────────────────────────────────────────
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['c', 'x', 'p', 'a', 's'].includes(e.key)) e.preventDefault();
    });

    // ── Auth flow ──────────────────────────────────────────────────────────
    Auth.checkAuth({
        onDenied: (msg) => {
            const titleEl = document.getElementById('access-title');
            const msgEl = document.getElementById('access-msg');
            if (titleEl) { titleEl.innerText = 'Acceso Denegado'; titleEl.style.color = 'red'; }
            if (msgEl) msgEl.innerText = msg;
        },
        onSuccess: (_userData, _currentDevices, _maxDevices) => {
            const overlay = document.getElementById('access-overlay');
            if (overlay) overlay.classList.add('hidden');

            const licEl = document.getElementById('licencia-activa');
            if (licEl) licEl.style.display = 'inline-block';

            Data.loadAllData().then(questions => {
                if (questions.length === 0) return;

                // One-time data migration for old IDs
                if (Storage.getVersionData() !== 'v1_unique_ids') {
                    Storage.clearFailures();
                    Storage.setVersionData('v1_unique_ids');
                }

                UI.updateFailureBadge(Storage.getFailedIds().length);
                setupEventListeners();
                showRoleSelection();
            });
        }
    });
});

// ── Helpers ────────────────────────────────────────────────────────────────

function showRoleSelection() {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
        v.classList.add('hidden');
    });
    const v = document.getElementById('view-role-selection');
    if (v) { v.classList.remove('hidden'); v.classList.add('active'); }
}

// ── Event Listeners ────────────────────────────────────────────────────────

function setupEventListeners() {
    // ── Role selection ──
    document.getElementById('btn-role-pinche')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-role-celador')
        .addEventListener('click', () => alert('🚧 Celador: ¡Próximamente!'));

    // ── Admin ──
    const btnAdmin = document.getElementById('btn-admin-panel');
    if (btnAdmin) btnAdmin.addEventListener('click', loadAdminLogs);
    const btnCloseAdmin = document.getElementById('btn-close-admin');
    if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', () => UI.toggleEl('admin-modal', false));

    // ── Main menu ──
    document.getElementById('btn-back-menu')
        .addEventListener('click', () => UI.showView('roleSelection'));
    document.getElementById('btn-source-mad')
        .addEventListener('click', () => Topics.showParts('MAD'));
    document.getElementById('btn-source-csif')
        .addEventListener('click', () => Topics.showParts('CSIF'));
    const btnAcademia = document.getElementById('btn-source-academia');
    if (btnAcademia) btnAcademia.addEventListener('click', () => Topics.showParts('Academia'));
    document.getElementById('btn-source-examenes')
        .addEventListener('click', () => UI.showView('examsMenu'));

    // ── Failures ──
    document.getElementById('btn-failures').addEventListener('click', () => {
        const ids = Storage.getFailedIds();
        const qs = state.allQuestions.filter(q => ids.includes(q.id));
        if (qs.length === 0) { alert('¡No tienes fallos registrados!'); return; }
        Game.startGame(qs, 'failures', 'Repaso de Fallos');
    });

    // ── Random ──
    document.getElementById('btn-random')
        .addEventListener('click', () => { initRandomView(); UI.showView('random'); });

    // ── Progress ──
    document.getElementById('btn-progress')
        .addEventListener('click', showProgress);

    // ── Parts ──
    document.getElementById('btn-back-parts')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-part-general')
        .addEventListener('click', () => Topics.showTopics('GENERAL'));
    document.getElementById('btn-part-especifica')
        .addEventListener('click', () => Topics.showTopics('ESPECIFICA'));

    // ── Topics ──
    document.getElementById('btn-back-topics').addEventListener('click', () => {
        if (state.currentSource === 'Historico') UI.showView('examsMenu');
        else UI.showView('menu');
    });

    // ── Exams ──
    document.getElementById('btn-back-exams')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-2020-ord').addEventListener('click', () => {
        const qs = state.allQuestions
            .filter(q => q.tema === 'Examen 2020 (Ordinario)')
            .sort((a, b) => (parseInt(a.id?.split('_')[1]) || 0) - (parseInt(b.id?.split('_')[1]) || 0));
        if (!qs.length) return alert('Examen no cargado.');
        Topics.prepareModeSelection('Examen OPE 2020 (Ordinario)', () => qs);
    });
    document.getElementById('btn-2020-extra').addEventListener('click', () => {
        const qs = state.allQuestions
            .filter(q => q.tema === 'Examen 2020 (Extraordinario)')
            .sort((a, b) => (parseInt(a.id?.split('_')[1]) || 0) - (parseInt(b.id?.split('_')[1]) || 0));
        if (!qs.length) return alert('🚧 Examen aún no disponible.');
        Topics.prepareModeSelection('Examen OPE 2020 (Extraordinario)', () => qs);
    });
    const btnCCAA = document.getElementById('btn-examenes-ccaa');
    if (btnCCAA) btnCCAA.addEventListener('click', () => {
        state.currentSource = 'Historico';
        Topics.showTopics('CCAA');
    });
    const btnHistorico = document.getElementById('btn-examenes-historico');
    if (btnHistorico) btnHistorico.addEventListener('click', () => {
        state.currentSource = 'Historico';
        Topics.showTopics('HISTORICO');
    });

    // ── Mode selection ──
    document.getElementById('btn-back-mode')
        .addEventListener('click', () => UI.showView(state.lastViewBeforeMode || 'menu'));
    document.getElementById('btn-mode-training')
        .addEventListener('click', () => triggerGameStart('training'));
    document.getElementById('btn-mode-exam')
        .addEventListener('click', () => triggerGameStart('exam'));

    // ── Random config ──
    document.getElementById('btn-back-random')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-start-random').addEventListener('click', startRandom);
    const selectMix = document.getElementById('select-mix-type');
    if (selectMix) selectMix.addEventListener('change', onMixTypeChange);

    // ── Progress ──
    document.getElementById('btn-back-progress')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm('¿Borrar todo el historial?')) { Storage.clearHistory(); showProgress(); }
    });

    // ── Game controls ──
    document.getElementById('btn-quit-game').addEventListener('click', () => {
        if (confirm('¿Salir? Se perderá el progreso actual.')) UI.showView('menu');
    });
    document.getElementById('btn-next').addEventListener('click', () => Game.nextQuestion());
    document.getElementById('btn-prev').addEventListener('click', () => Game.prevQuestion());
    document.getElementById('btn-show-grid').addEventListener('click', () => Game.showGrid());
    document.getElementById('btn-close-grid').addEventListener('click', () =>
        UI.toggleEl('nav-grid-overlay', false));

    // ── Results ──
    document.getElementById('btn-home-results')
        .addEventListener('click', () => UI.showView('menu'));
    document.getElementById('btn-retry').addEventListener('click', () => {
        if (state.pendingGameGenerator) triggerGameStart(state.originalMode || 'training');
    });
    // btn-review-exam / btn-review-failed are bound dynamically in game.js finishGame()

    // ── Failure clear buttons ──
    const btnClearHeader = document.getElementById('btn-clear-failures-header');
    if (btnClearHeader) btnClearHeader.addEventListener('click', () => {
        if (confirm('¿Vaciar historial de fallos?')) {
            Storage.clearFailures();
            UI.updateFailureBadge(0);
            UI.showView('menu');
        }
    });
    const btnClearRes = document.getElementById('btn-clear-failures');
    if (btnClearRes) btnClearRes.addEventListener('click', () => {
        if (confirm('¿Borrar todos los fallos guardados?')) {
            Storage.clearFailures();
            UI.updateFailureBadge(0);
            UI.toggleEl('btn-review-failed', false);
            UI.toggleEl('btn-clear-failures', false);
        }
    });
}

// ── Feature helpers ────────────────────────────────────────────────────────

function triggerGameStart(mode) {
    if (!state.pendingGameGenerator) { alert('No hay tema seleccionado.'); return; }
    const qs = state.pendingGameGenerator();
    if (!qs || qs.length === 0) { alert('No hay preguntas para este test.'); return; }
    state.currentMode = mode;
    state.originalMode = mode;
    Game.startGame(qs, mode, state.pendingTopicTitle || 'Test');
}

function initRandomView() {
    const selectMix = document.getElementById('select-mix-type');
    if (selectMix) {
        selectMix.value = 'general';
        // Ensure listener is attached (initially or if re-init)
        selectMix.onchange = onMixTypeChange;
        onMixTypeChange({ target: selectMix });
    }
    const selTema = document.getElementById('select-tema-num');
    if (selTema && selTema.options.length === 0) {
        for (let i = 1; i <= 16; i++) {
            const opt = document.createElement('option');
            opt.value = `Tema ${i}`; opt.text = `Tema ${i}`;
            selTema.appendChild(opt);
        }
    }
    const countInput = document.getElementById('random-count');
    if (countInput) countInput.value = 20;
}

function onMixTypeChange(e) {
    UI.toggleEl('filter-group-origen', e.target.value === 'origen');
    UI.toggleEl('filter-group-oficial', e.target.value === 'oficial');
    UI.toggleEl('filter-group-tema', e.target.value === 'tema');
}

function startRandom() {
    const count = Math.min(100, Math.max(1, parseInt(document.getElementById('random-count').value) || 20));
    const mixType = document.getElementById('select-mix-type').value;
    let pool = [], desc = '';

    console.log(`Random mode init: mix=${mixType}, count=${count}, total_data=${state.allQuestions.length}`);

    if (mixType === 'general') {
        pool = state.allQuestions; desc = 'General Total';
    } else if (mixType === 'origen') {
        const val = document.getElementById('select-origen').value;
        pool = state.allQuestions.filter(q => q.origen === val);
        desc = val;
    } else if (mixType === 'oficial') {
        const val = document.getElementById('select-oficial').value;
        if (val === 'todos') {
            pool = state.allQuestions.filter(q => q.origen === 'Historico');
        } else if (val === 'SESCAM') {
            pool = state.allQuestions.filter(q => q.origen === 'Historico' && q.tema && q.tema.includes('SESCAM'));
        } else {
            pool = state.allQuestions.filter(q => q.origen === 'Historico' && q.tema && !q.tema.includes('SESCAM'));
        }
        desc = `Oficial: ${val}`;
    } else if (mixType === 'tema') {
        const temaVal = document.getElementById('select-tema-num').value; // e.g. "Tema 1"
        const fuenteVal = document.getElementById('select-tema-fuente').value; // e.g. "CSIF", "MAD", "Academia", "todas"

        pool = state.allQuestions.filter(q => {
            if (!q.tema) return false;
            // Robust match: "Tema 1: ..." or exactly "Tema 1"
            const matchesTema = q.tema.startsWith(temaVal + ':') || q.tema.startsWith(temaVal + ' ') || q.tema === temaVal;
            if (!matchesTema) return false;

            if (fuenteVal !== 'todas') {
                return q.origen === fuenteVal;
            }
            return true;
        });
        desc = temaVal;
    }

    if (pool.length === 0) {
        console.warn(`Random pool empty for type=${mixType}`);
        return alert('No hay preguntas para este filtro.');
    }

    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, Math.min(count, pool.length));
    Topics.prepareModeSelection(`Aleatorio: ${desc} (${selected.length} pregs)`, () => selected);
}


function showProgress() {
    const tbody = document.getElementById('progress-body');
    const history = Storage.getHistory();
    tbody.innerHTML = history.length === 0
        ? '<tr><td colspan="3" style="text-align:center">No hay resultados aún.</td></tr>'
        : history.map(r => `<tr>
            <td>${r.date}</td>
            <td>${r.topic}</td>
            <td class="${r.pct >= 50 ? 'score-good' : 'score-bad'}">${r.score}/${r.total} (${r.pct}%)</td>
          </tr>`).join('');
    UI.showView('progress');
}

// ── Admin panel ────────────────────────────────────────────────────────────

async function loadAdminLogs() {
    if (!state.supabaseClient) return;
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center">Cargando...</td></tr>';
    UI.toggleEl('admin-modal', true);
    try {
        const [{ data: lics }, { data: logs }] = await Promise.all([
            state.supabaseClient.from('usuarios_acceso').select('*').order('dispositivos_usados', { ascending: false }),
            state.supabaseClient.from('access_logs').select('*').order('created_at', { ascending: false }).limit(30)
        ]);
        let html = `<tr style="background:#f4f6f8"><td colspan="2" style="font-weight:bold;text-align:center;color:var(--primary);padding:10px">Estado de Licencias</td></tr>`;
        html += (lics || []).map(l => `<tr>
            <td><strong>${l.nombre}</strong><br><small>ID: *** ${l.bloqueado ? '🚫 Bloqueado' : ''}</small></td>
            <td style="text-align:center;font-weight:bold;color:${l.dispositivos_usados >= 2 ? 'red' : 'green'}">${l.dispositivos_usados} / 2</td></tr>`).join('');
        html += `<tr style="background:#f4f6f8"><td colspan="2" style="font-weight:bold;text-align:center;color:var(--primary);padding:10px">Últimas Conexiones</td></tr>`;
        html += (logs || []).map(l => `<tr>
            <td>${new Date(l.created_at).toLocaleString('es-ES')}</td>
            <td style="font-size:0.8rem">${(l.device_info || '').replace(/\\([^)]+\\)/, '(***)')}</td></tr>`).join('');
        tbody.innerHTML = html;
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="2" style="color:red;text-align:center">Error: ${e.message}</td></tr>`;
    }
}
