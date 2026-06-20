const STORAGE_KEYS = {
    targetEmail: "targetEmail",
    switchedCount: "switchedCount",
    uploadedEntries: "uploadedEntries",
    guideRuns: "guideRuns",
    privacyRatings: "privacyRatings",
};
// Fallback to localStorage for non-extension contexts (dev/test in browser tab)
function chromeStorageAvailable() {
    return typeof chrome !== "undefined" && !!chrome.storage?.local;
}
async function getKey(key) {
    if (chromeStorageAvailable()) {
        const result = await chrome.storage.local.get(key);
        return result[key];
    }
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : undefined;
    }
    catch {
        return undefined;
    }
}
async function setKey(key, value) {
    if (chromeStorageAvailable()) {
        await chrome.storage.local.set({ [key]: value });
    }
    else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
export async function readExtensionState() {
    const [targetEmail, switchedCount, uploadedEntries, guideRuns, privacyRatings] = await Promise.all([
        getKey(STORAGE_KEYS.targetEmail),
        getKey(STORAGE_KEYS.switchedCount),
        getKey(STORAGE_KEYS.uploadedEntries),
        getKey(STORAGE_KEYS.guideRuns),
        getKey(STORAGE_KEYS.privacyRatings),
    ]);
    return { targetEmail, switchedCount, uploadedEntries, guideRuns, privacyRatings };
}
export async function writeUploadedEntries(entries) {
    await setKey(STORAGE_KEYS.uploadedEntries, entries);
}
export async function readUploadedEntries() {
    return (await getKey(STORAGE_KEYS.uploadedEntries)) ?? [];
}
export async function writeGuideRuns(guideRuns) {
    await setKey(STORAGE_KEYS.guideRuns, guideRuns);
}
export async function writePrivacyRatings(privacyRatings) {
    await setKey(STORAGE_KEYS.privacyRatings, privacyRatings);
}
export async function clearUploadedEntries() {
    if (chromeStorageAvailable()) {
        await chrome.storage.local.remove(STORAGE_KEYS.uploadedEntries);
    }
    else {
        localStorage.removeItem(STORAGE_KEYS.uploadedEntries);
    }
}
