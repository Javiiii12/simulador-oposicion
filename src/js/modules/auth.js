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
        // Try both exact and case-insensitive match
        const { data, error } = await state.supabaseClient
            .from('usuarios_acceso')
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

        const { id: deviceId, isNew } = Storage.getOrCreateDeviceId();
        let currentDevices = data.dispositivos_usados || 0;

        if (isNew) {
            if (currentDevices >= MAX_DEVICES) {
                onDenied(`Límite alcanzado: esta licencia ya usa ${MAX_DEVICES} dispositivos.`);
                Storage.clearUser();
                return;
            }
            currentDevices++;
            await state.supabaseClient
                .from('usuarios_acceso')
                .update({ dispositivos_usados: currentDevices })
                .ilike('id_acceso', userId.trim());
        }

        Storage.saveUser(userId.trim());

        // Log access
        try {
            await state.supabaseClient.from('access_logs').insert([{
                created_at: new Date().toISOString(),
                status: 'success',
                device_info: `${data.nombre} (${data.id_acceso}) — Disp: ${currentDevices}/${MAX_DEVICES}`
            }]);
        } catch (e) { console.warn('Log access error:', e); }

        onSuccess(data, currentDevices, MAX_DEVICES);

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
        await state.supabaseClient.from('access_logs').insert([{
            created_at: new Date().toISOString(),
            status: 'success',
            device_info: detail
        }]);
    } catch (e) { console.warn('logAccess error:', e); }
}
