/**
 * storage.js — LocalStorage helpers for failures and progress history.
 */

const KEYS = {
    FAILED_IDS: 'ope_failed_ids',
    PROGRESS: 'ope_progress',
    USER_ACCESS: 'ope_user_access',
    DEVICE_ID: 'ope_device_id',
    VERSION_DATA: 'ope_version_data'
};

// ── Failures ─────────────────────────────────────────────────────────────────

export function getFailedIds() {
    try { return JSON.parse(localStorage.getItem(KEYS.FAILED_IDS)) || []; }
    catch { return []; }
}

export function addFailedId(id) {
    const ids = getFailedIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(KEYS.FAILED_IDS, JSON.stringify(ids));
    }
}

export function removeFailedId(id) {
    const ids = getFailedIds().filter(x => x !== id);
    localStorage.setItem(KEYS.FAILED_IDS, JSON.stringify(ids));
}

export function clearFailures() {
    localStorage.removeItem(KEYS.FAILED_IDS);
}

// ── Progress History ──────────────────────────────────────────────────────────

export function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEYS.PROGRESS)) || []; }
    catch { return []; }
}

export function addHistoryEntry(entry) {
    const history = getHistory();
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(history));
}

export function clearHistory() {
    localStorage.removeItem(KEYS.PROGRESS);
}

// ── User / Device ─────────────────────────────────────────────────────────────

export function getSavedUser() { return localStorage.getItem(KEYS.USER_ACCESS); }
export function saveUser(id) { localStorage.setItem(KEYS.USER_ACCESS, id); }
export function clearUser() { localStorage.removeItem(KEYS.USER_ACCESS); localStorage.removeItem(KEYS.DEVICE_ID); }

export function getOrCreateDeviceId() {
    let id = localStorage.getItem(KEYS.DEVICE_ID);
    if (!id) {
        id = 'dev_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(KEYS.DEVICE_ID, id);
        return { id, isNew: true };
    }
    return { id, isNew: false };
}

export function getVersionData() { return localStorage.getItem(KEYS.VERSION_DATA); }
export function setVersionData(val) { localStorage.setItem(KEYS.VERSION_DATA, val); }
