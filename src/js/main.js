/**
 * main.js — Application entry point.
 * Orchestrates: auth → data load → UI init → ALL event listeners.
 */
import * as Auth from './modules/auth.js?v=1.15.7';
import * as Data from './modules/data.js';
import * as UI from './modules/ui.js';
import * as Storage from './modules/storage.js';
import * as Topics from './modules/topics.js';
import * as Game from './modules/game.js';
import { state } from './modules/state.js';
import { CONFIG } from './modules/config.js';

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
            const overlay = document.getElementById('access-overlay');
            if (overlay) overlay.classList.remove('hidden'); // Ensure it's visible on denial
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
                UI.renderizarRecordsMenu();
                UI.renderizarProgresoGlobal();
                UI.renderizarProgresoExamenes();
                setupEventListeners();
                UI.showView('roleSelection', false); // Usar el sistema de navegación real
            });
        }
    });

    // ── Browsing History Fix ──
    window.onpopstate = (event) => {
        if (event.state && event.state.view) {
            UI.showView(event.state.view, false);
        }
    };
});

// ── Helpers ────────────────────────────────────────────────────────────────

// showRoleSelection borrado por redundancia con UI.showView('roleSelection')

// ── Event Listeners ────────────────────────────────────────────────────────

function setupEventListeners() {
    checkAndInjectSessionButton();

    // ── Role selection ──
    const btnPinche = document.getElementById('btn-role-pinche');
    if (btnPinche) {
        btnPinche.addEventListener('click', (e) => {
            console.log('Pinche button clicked');
            UI.showView('menu');
        });
    }

    const btnCelador = document.getElementById('btn-role-celador');
    if (btnCelador) {
        btnCelador.addEventListener('click', () => alert('🚧 Celador: ¡Próximamente!'));
    }

    // ── Admin ──
    const btnAdmin = document.getElementById('btn-admin-panel');
    if (btnAdmin) btnAdmin.addEventListener('click', loadAdminLogs);
    const btnCloseAdmin = document.getElementById('btn-close-admin');
    if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', () => UI.toggleEl('admin-modal', false));

    // ── Main menu ──
    document.getElementById('btn-back-menu')
        .addEventListener('click', () => UI.goBack());
    document.getElementById('btn-source-mad')
        .addEventListener('click', () => Topics.showParts('MAD'));
    document.getElementById('btn-source-csif')
        .addEventListener('click', () => Topics.showParts('CSIF'));
    const btnAcademia = document.getElementById('btn-source-academia');
    if (btnAcademia) btnAcademia.addEventListener('click', () => Topics.showParts('Academia'));
    document.getElementById('btn-source-examenes')
        .addEventListener('click', () => {
            UI.renderizarProgresoExamenes();
            UI.showView('examsMenu');
        });

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
        .addEventListener('click', () => UI.goBack());
    document.getElementById('btn-part-general')
        .addEventListener('click', () => Topics.showTopics('GENERAL'));
    document.getElementById('btn-part-especifica')
        .addEventListener('click', () => Topics.showTopics('ESPECIFICA'));

    // ── Topics ──
    document.getElementById('btn-back-topics').addEventListener('click', () => {
        UI.goBack();
    });

    // ── Exams ──
    document.getElementById('btn-back-exams')
        .addEventListener('click', () => UI.goBack());
    // Exámenes específicos
    const btn2024 = document.getElementById('btn-topic-ope_2024_cel');
    if (btn2024) btn2024.addEventListener('click', () => {
        const qs = state.allQuestions.filter(q => q.tema === 'Examen Oficial Celador/a SESCAM 2024');
        if (!qs.length) return alert('Examen no cargado.');
        Topics.prepareModeSelection('Examen Celador SESCAM 2024', () => qs, 'ope_2024_cel');
    });

    const btn2020Ord = document.getElementById('btn-topic-ope_2020_ord');
    if (btn2020Ord) btn2020Ord.addEventListener('click', () => {
        const qs = state.allQuestions
            .filter(q => q.tema === 'Examen 2020 (Ordinario)')
            .sort((a, b) => (parseInt(a.id?.split('_')[1]) || 0) - (parseInt(b.id?.split('_')[1]) || 0));
        if (!qs.length) return alert('Examen no cargado.');
        Topics.prepareModeSelection('Examen OPE 2020 (Ordinario)', () => qs, 'ope_2020_ord');
    });

    const btn2020Extra = document.getElementById('btn-topic-ope_2020_extra');
    if (btn2020Extra) btn2020Extra.addEventListener('click', () => {
        const qs = state.allQuestions
            .filter(q => q.tema === 'Examen 2020 (Extraordinario)')
            .sort((a, b) => (parseInt(a.id?.split('_')[1]) || 0) - (parseInt(b.id?.split('_')[1]) || 0));
        if (!qs.length) return alert('🚧 Examen aún no disponible.');
        Topics.prepareModeSelection('Examen OPE 2020 (Extraordinario)', () => qs, 'ope_2020_extra');
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
        .addEventListener('click', () => UI.goBack());
    document.getElementById('btn-mode-training')
        .addEventListener('click', () => triggerGameStart('training'));
    document.getElementById('btn-mode-exam')
        .addEventListener('click', () => triggerGameStart('exam'));

    // ── Timer Toggle ──
    const toggleTimer = document.getElementById('toggle-timer');
    if (toggleTimer) {
        toggleTimer.addEventListener('change', (e) => {
            state.timerEnabled = e.target.checked;
        });
    }

    // ── Random config ──
    document.getElementById('btn-back-random')
        .addEventListener('click', () => UI.goBack());
    document.getElementById('btn-start-random').addEventListener('click', startRandom);
    const selectMix = document.getElementById('select-mix-type');
    if (selectMix) selectMix.addEventListener('change', onMixTypeChange);

    // ── Progress ──
    document.getElementById('btn-back-progress')
        .addEventListener('click', () => UI.goBack());
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (confirm('¿Borrar todo el historial?')) { Storage.clearHistory(); showProgress(); }
    });
    document.getElementById('btn-clear-records').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todos tus récords y medallas? Esta acción no se puede deshacer.')) {
            Storage.clearRecords();
            UI.renderizarRecordsMenu();
            alert('¡Progreso limpiado correctamente!');
        }
    });

    // ── Game controls ──
    document.getElementById('btn-quit-game').addEventListener('click', () => {
        if (confirm('¿Salir al menú? Tu test actual quedará guardado automáticamente.')) {
            Game.stopTimer(); // Detener cronómetro (sin borrar el tiempo guardado)
            if (typeof checkAndInjectSessionButton === 'function') checkAndInjectSessionButton(); // Refresca UI
            UI.goBack(); 
        }
    });
    document.getElementById('btn-next').addEventListener('click', () => Game.nextQuestion());
    document.getElementById('btn-prev').addEventListener('click', () => Game.prevQuestion());
    document.getElementById('btn-show-grid').addEventListener('click', () => Game.showGrid());
    document.getElementById('btn-toggle-fullview').addEventListener('click', () => Game.toggleFullView());
    document.getElementById('btn-close-grid').addEventListener('click', () =>
        UI.toggleEl('nav-grid-overlay', false));

    // ── Results ──
    document.getElementById('btn-home-results')
        .addEventListener('click', () => {
            checkAndInjectSessionButton();
            UI.renderizarRecordsMenu();
            UI.renderizarProgresoGlobal();
            UI.renderizarProgresoExamenes();
            
            // BUG FIX: Reset navigation when going home from results
            state.viewHistory = []; 
            UI.showView('menu', false);
            // Replace state to avoid going back to results
            history.replaceState({ view: 'menu' }, '');
        });
    document.getElementById('btn-back-selection')
        .addEventListener('click', () => {
            UI.renderizarRecordsMenu();
            UI.renderizarProgresoGlobal();
            UI.renderizarProgresoExamenes();
            UI.showView(state.lastViewBeforeMode || 'topics');
        });
    document.getElementById('btn-retry').addEventListener('click', () => {
        if (state.pendingGameGenerator) triggerGameStart(state.originalMode || 'training');
    });
    // btn-review-exam / btn-review-failed are bound dynamically in game.js finishGame()

    // ── Failure clear buttons ──
    const btnClearHeader = document.getElementById('btn-clear-failures-header');
    if (btnClearHeader) btnClearHeader.addEventListener('click', () => {
        if (confirm('¿Vaciar historial de fallos?')) {
            Storage.clearFailures();
            // Only clear the suspended session if it was a failure recap
            const session = Storage.getSuspendedSession();
            if (session && session.currentMode === 'failures') {
                Storage.clearSuspendedSession();
            }
            UI.updateFailureBadge(0);
            checkAndInjectSessionButton(); // Refrescar UI
            UI.showView('menu');
        }
    });
    const btnClearRes = document.getElementById('btn-clear-failures');
    if (btnClearRes) btnClearRes.addEventListener('click', () => {
        if (confirm('¿Borrar todos los fallos guardados?')) {
            Storage.clearFailures();
            // Si la sesión actual en pausa era de fallos, la limpiamos tb
            const session = Storage.getSuspendedSession();
            if (session && session.currentMode === 'failures') {
                Storage.clearSuspendedSession();
            }
            UI.updateFailureBadge(0);
            UI.toggleEl('btn-review-failed', false);
            UI.toggleEl('btn-clear-failures', false);
            checkAndInjectSessionButton();
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
    Game.startGame(qs, mode, state.pendingTopicTitle || 'Test', state.pendingTestId);
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
            state.supabaseClient.from(CONFIG.TABLE_USERS).select('*').order('dispositivos_usados', { ascending: false }),
            state.supabaseClient.from(CONFIG.TABLE_LOGS).select('*').order('created_at', { ascending: false }).limit(30)
        ]);
        let html = `<tr style="background:#f4f6f8"><td colspan="2" style="font-weight:bold;text-align:center;color:var(--primary);padding:10px">Estado de Licencias</td></tr>`;
        html += (lics || []).map(l => `<tr>
            <td><strong>${l.nombre}</strong><br><small>ID: *** ${l.bloqueado ? '🚫 Bloqueado' : ''}</small></td>
            <td style="text-align:center;font-weight:bold;color:${l.dispositivos_usados >= 2 ? 'red' : 'green'}">${l.dispositivos_usados} / 2</td></tr>`).join('');
        html += `<tr style="background:#f4f6f8"><td colspan="2" style="font-weight:bold;text-align:center;color:var(--primary);padding:10px">Últimas Conexiones</td></tr>`;
        html += (logs || []).map(l => `<tr>
            <td>${new Date(l.created_at).toLocaleString('es-ES')}</td>
            <td style="font-size:0.8rem">${(l.device_info || '').replace(/\([^)]+\)/, '(***)')}</td></tr>`).join('');
        tbody.innerHTML = html;
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="2" style="color:red;text-align:center">Error: ${e.message}</td></tr>`;
    }
}

export function checkAndInjectSessionButton() {
    const session = Storage.getSuspendedSession();
    const oldBtn = document.getElementById('btn-continue-session');
    if (oldBtn) oldBtn.remove(); // Limpiar previo

    if (session && session.currentQuestions && session.currentQuestions.length > 0) {
        const menuGrid = document.querySelector('#view-menu .menu-grid');

        const wrapper = document.createElement('div');
        wrapper.id = 'btn-continue-session';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.style.position = 'relative';
        wrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        const btn = document.createElement('button');
        btn.className = 'btn-menu special';
        btn.style.width = '100%';
        btn.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
        btn.style.color = '#fff';
        btn.style.boxShadow = '0 6px 15px rgba(13, 148, 136, 0.4)';
        btn.style.paddingRight = '3rem'; // Space for discard btn

        const total = session.currentQuestions.length;
        const current = session.currentIndex + 1;
        const pct = Math.round((current / total) * 100);

        btn.innerHTML = `
            <strong>▶️ Continuar Test en Pausa</strong>
            <div style="font-size: 0.85rem; margin-top: 5px; opacity: 0.9;">
                ${session.currentTopicName} - Pregunta ${current} de ${total}
            </div>
            <div style="width: 100%; background: rgba(255,255,255,0.3); height: 6px; border-radius: 3px; margin-top: 8px; overflow: hidden;">
                <div style="width: ${pct}%; background: #fff; height: 100%;"></div>
            </div>
        `;

        btn.addEventListener('click', () => {
            Game.restoreSession(session);
        });

        // ── Discard button ──────────────────────────────────────────────────
        const discardBtn = document.createElement('button');
        discardBtn.title = 'Descartar test en pausa';
        discardBtn.innerHTML = '🗑️';
        discardBtn.style.cssText = `
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 6px;
            color: #fff;
            font-size: 1.1rem;
            cursor: pointer;
            padding: 4px 8px;
            line-height: 1;
            transition: background 0.2s;
            z-index: 2;
        `;
        discardBtn.addEventListener('mouseenter', () => {
            discardBtn.style.background = 'rgba(255,255,255,0.35)';
        });
        discardBtn.addEventListener('mouseleave', () => {
            discardBtn.style.background = 'rgba(255,255,255,0.2)';
        });
        discardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // No disparar el "Continuar"
            Storage.clearSuspendedSession();
            // Transición suave antes de eliminar
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'scaleY(0.8)';
            wrapper.style.overflow = 'hidden';
            setTimeout(() => wrapper.remove(), 300);
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(discardBtn);
        if (menuGrid) menuGrid.insertBefore(wrapper, menuGrid.firstChild);
    }
}

function slugify(text) {
    return UI.slugify(text);
}
