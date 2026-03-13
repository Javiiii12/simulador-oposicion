/**
 * auth.js — Supabase-based user authentication.
 * Mirrors the validateUserAccess() logic from the original script.js.
 */
import { state } from './state.js';
import { CONFIG } from './config.js';
import * as Storage from './storage.js';

const MAX_DEVICES = 2;

function initSupabase() {
    if (window.supabase && !state.supabaseClient) {
        state.supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    }
}

/**
 * Show the "access denied" state on the overlay (without hiding it).
 */
function showAccessDenied(msg) {
    const titleEl = document.getElementById('access-title');
    const msgEl = document.getElementById('access-msg');
    if (titleEl) { titleEl.innerText = 'Acceso Denegado'; titleEl.style.color = 'red'; }
    if (msgEl) msgEl.innerText = msg;

    // Ensure the overlay is visible
    const overlay = document.getElementById('access-overlay');
    if (overlay) overlay.classList.remove('hidden');

    Storage.clearUser();
}

/**
 * Validate a user ID against Supabase and call the appropriate callback.
 * @param {string} userId
 * @param {{ onSuccess: Function, onDenied: Function }} callbacks
 */
async function validateUserAccess(userId, { onSuccess, onDenied }) {
    initSupabase();
    if (!state.supabaseClient) {
        onDenied("Error: Supabase no inicializado.");
        return;
    }

    try {
        // Fetch user record (case-insensitive read)
        const { data, error } = await state.supabaseClient
            .from(CONFIG.TABLE_USERS)
            .select('*')
            .ilike('id_acceso', userId.trim())
            .single();

        if (error || !data) {
            onDenied("Acceso denegado. Código de usuario inválido o no encontrado.");
            return;
        }

        if (data.bloqueado === true) {
            onDenied("Acceso denegado. Tu licencia ha sido bloqueada.");
            return;
        }

        Storage.saveUser(userId.trim());
        Storage.setPrefix(userId.trim()); // Isolate progress data

        const exactId = data.id_acceso;

        // Keep local ID just for diagnostics/logs
        const { id: deviceId } = Storage.getOrCreateDeviceId();
        const shortId = deviceId.substring(0, 10);
        let currentDBCount = data.dispositivos_usados || 0;

        // VERIFICACIÓN ESTRICTA
        const registeredDeviceId = localStorage.getItem('ope_reg_v2_' + exactId);
        let isRegisteredLocally = (registeredDeviceId === deviceId);

        // Sanity check: si la DB dice 0, el local no puede ser válido
        if (currentDBCount === 0) isRegisteredLocally = false;

        let needsIncrement = !isRegisteredLocally;

        if (needsIncrement) {
            if (currentDBCount >= MAX_DEVICES) {
                console.warn(`[AUTH] Bloqueo: ${exactId} Supera límite (${currentDBCount}/${MAX_DEVICES}). Dev: ${shortId}`);
                onDenied(`Acceso denegado. Esta licencia ya ha alcanzado el límite máximo de ${MAX_DEVICES} dispositivos permitidos.`);
                Storage.clearUser();
                return;
            }
            
            // Proceder a incrementar
            const newCount = currentDBCount + 1;
            const { data: updateData, error: updateError } = await state.supabaseClient
                .from(CONFIG.TABLE_USERS)
                .update({ dispositivos_usados: newCount })
                .eq('id_acceso', exactId)
                .select();

            if (updateError) {
                console.error('[AUTH] Error Update:', updateError);
                onDenied("Error al sincronizar tu dispositivo. Inténtalo de nuevo.");
                return;
            }
            
            if (updateData && updateData.length > 0) {
                currentDBCount = updateData[0].dispositivos_usados;
                localStorage.setItem('ope_reg_v2_' + exactId, deviceId);
                console.log(`[AUTH] Registro exitoso: ${currentDBCount}/${MAX_DEVICES}`);
            }
        }

        // Log Final en Supabase
        try {
            const regStatus = isRegisteredLocally ? 'Old' : 'NEW';
            const trace = `V:${CONFIG.APP_VERSION.split(' ')[0]} [DB:${data.dispositivos_usados},Reg:${regStatus},Inc:${needsIncrement?'Y':'N'}]`;
            
            await state.supabaseClient.from(CONFIG.TABLE_LOGS).insert([{
                created_at: new Date().toISOString(),
                status: 'success',
                device_info: `${data.nombre} (${data.id_acceso}) — ${currentDBCount}/${MAX_DEVICES} — ${trace} — ${shortId}`
            }]);
        } catch (e) { console.warn('Log error:', e); }

        onSuccess(data, currentDBCount, MAX_DEVICES);

    } catch (err) {
        console.error("validateUserAccess error:", err);
        onDenied("Error de conexión al validar el acceso.");
    }
}


/**
 * Main entry point — checks URL param → localStorage → denies.
 * @param {{ onSuccess: Function, onDenied: Function }} callbacks
 */
export async function checkAuth({ onSuccess, onDenied }) {
    initSupabase();

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user') || Storage.getSavedUser();

    if (userId) {
        // Clean the URL (remove ?user=xxx so it doesn't persist in history)
        window.history.replaceState({}, document.title, window.location.pathname);
        await validateUserAccess(userId, { onSuccess, onDenied });
    } else {
        onDenied("Acceso denegado. Introduce tu código en la URL (?user=TU_CODIGO).");
    }
}

/**
 * Log an access event to Supabase.
 */
export async function logAccess(userId, detail) {
    if (!state.supabaseClient) return;
    try {
        await state.supabaseClient.from(CONFIG.TABLE_LOGS).insert([{
            created_at: new Date().toISOString(),
            status: 'success',
            device_info: detail
        }]);
    } catch (e) { console.warn('logAccess error:', e); }
}
