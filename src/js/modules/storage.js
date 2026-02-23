/**
 * storage.js — LocalStorage helpers for failures and progress history.
 */

const KEYS = {
    FAILED_IDS: 'ope_failed_ids',
    PROGRESS: 'ope_progress',
    USER_ACCESS: 'ope_user_access',
    DEVICE_ID: 'ope_device_id',
    DEVICE_REGISTERED: 'ope_device_registered', // Legacy
    VERSION_DATA: 'ope_version_data'
};

let currentPrefix = '';

export function setPrefix(userId) {
    if (!userId) { currentPrefix = ''; return; }
    // Clean userId to be storage-safe
    currentPrefix = `u_${userId.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_`;
}

function pk(key) {
    if (key === KEYS.FAILED_IDS || key === KEYS.PROGRESS) {
        return currentPrefix + key;
    }
    return key;
}

// ── Failures ─────────────────────────────────────────────────────────────────

export function getFailedIds() {
    try { return JSON.parse(localStorage.getItem(pk(KEYS.FAILED_IDS))) || []; }
    catch { return []; }
}

export function addFailedId(id) {
    const ids = getFailedIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(pk(KEYS.FAILED_IDS), JSON.stringify(ids));
    }
}

export function removeFailedId(id) {
    const ids = getFailedIds().filter(x => x !== id);
    localStorage.setItem(pk(KEYS.FAILED_IDS), JSON.stringify(ids));
}

export function clearFailures() {
    localStorage.removeItem(pk(KEYS.FAILED_IDS));
}

// ── Progress History ──────────────────────────────────────────────────────────

export function getHistory() {
    try { return JSON.parse(localStorage.getItem(pk(KEYS.PROGRESS))) || []; }
    catch { return []; }
}

export function addHistoryEntry(entry) {
    const history = getHistory();
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem(pk(KEYS.PROGRESS), JSON.stringify(history));
}

export function clearHistory() {
    localStorage.removeItem(pk(KEYS.PROGRESS));
}

// ── User / Device ─────────────────────────────────────────────────────────────

export function getSavedUser() { return localStorage.getItem(KEYS.USER_ACCESS); }
export function saveUser(id) { localStorage.setItem(KEYS.USER_ACCESS, id); }
export function clearUser() {
    localStorage.removeItem(KEYS.USER_ACCESS);
    localStorage.removeItem(KEYS.DEVICE_ID);
    localStorage.removeItem(KEYS.DEVICE_REGISTERED);
}

export function getDeviceRegisteredFor() { return localStorage.getItem(KEYS.DEVICE_REGISTERED); }
export function setDeviceRegisteredFor(val) { localStorage.setItem(KEYS.DEVICE_REGISTERED, val); }

// Device confirmation index for a specific user (handles resets)
export function getConfirmedIdx(userId) {
    const normalized = userId.trim().toLowerCase();
    return parseInt(localStorage.getItem(`ope_confidx_${normalized}`)) || 0;
}
export function setConfirmedIdx(userId, idx) {
    const normalized = userId.trim().toLowerCase();
    localStorage.setItem(`ope_confidx_${normalized}`, idx.toString());
}

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
