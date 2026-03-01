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

        Storage.saveUser(userId.trim());
        Storage.setPrefix(userId.trim()); // Isolate progress data

        const exactId = data.id_acceso;

        // Generar un "fingerprint" de dispositivo basado en el navegador y pantalla
        const nav = window.navigator;
        const screen = window.screen;
        const rawFingerprint = `${nav.userAgent}-${nav.language}-${screen.colorDepth}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`;

        let hash = 0;
        for (let i = 0; i < rawFingerprint.length; i++) {
            const char = rawFingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        const stableDeviceId = 'dev_' + Math.abs(hash).toString(36);
        const shortId = stableDeviceId.substring(0, 10);

        let currentDevices = data.dispositivos_usados || 0;
        let needsIncrement = false;

        // Comprobación basada en los logs históricos reales de Supabase
        try {
            const { data: logs, error: logError } = await state.supabaseClient
                .from('access_logs')
                .select('device_info')
                .eq('status', 'success')
                .ilike('device_info', `%(${exactId})%`)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!logError && logs && logs.length > 0) {
                // Extraer los DevId únicos que han usado esta licencia recientemente
                const uniqueDevIds = new Set();
                logs.forEach(log => {
                    const match = log.device_info.match(/DevId: ([a-z0-9_]+)/);
                    if (match && match[1]) {
                        uniqueDevIds.add(match[1]);
                    }
                });

                if (uniqueDevIds.has(shortId)) {
                    // Es un dispositivo ya usado y registrado, adelante.
                    needsIncrement = false;
                } else {
                    // Es un dispositivo NUEVO que no está en el historial reciente
                    if (currentDevices >= MAX_DEVICES || uniqueDevIds.size >= MAX_DEVICES) {
                        onDenied(`Acceso denegado. Esta licencia ya ha alcanzado el límite máximo de ${MAX_DEVICES} dispositivos permitidos.`);
                        Storage.clearUser();
                        return;
                    } else {
                        needsIncrement = true;
                    }
                }
            } else {
                // No hay logs, primer uso o BD reseteada
                needsIncrement = true;
            }
        } catch (e) {
            console.warn('Sync check failed:', e);
            // Fallback
            if (currentDevices >= MAX_DEVICES && !localStorage.getItem('ope_device_id_stable')) {
                onDenied(`Acceso denegado. Límite de ${MAX_DEVICES} dispositivos alcanzado.`);
                Storage.clearUser();
                return;
            }
        }

        localStorage.setItem('ope_device_id_stable', stableDeviceId);

        if (needsIncrement) {
            currentDevices++;
            const { error: updateError } = await state.supabaseClient
                .from('usuarios_acceso')
                .update({ dispositivos_usados: currentDevices })
                .eq('id_acceso', exactId);

            if (updateError) {
                console.error('Error al actualizar dispositivos_usados:', updateError);
            } else {
                console.log(`Dispositivo sincronizado. Total: ${currentDevices}/${MAX_DEVICES}`);
            }
        }

        // Log access with hardware ID
        try {
            await state.supabaseClient.from('access_logs').insert([{
                created_at: new Date().toISOString(),
                status: 'success',
                device_info: `${data.nombre} (${data.id_acceso}) — Disp: ${currentDevices}/${MAX_DEVICES} — DevId: ${shortId}`
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
