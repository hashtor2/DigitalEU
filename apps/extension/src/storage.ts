import type {
  ExtensionLocalState,
  UploadedAccountEntry,
  GuideRunState,
  PrivacyRating,
} from "@digitaleu/shared";

const STORAGE_KEYS = {
  targetEmail: "targetEmail",
  switchedCount: "switchedCount",
  uploadedEntries: "uploadedEntries",
  guideRuns: "guideRuns",
  privacyRatings: "privacyRatings",
} as const;

// Fallback to localStorage for non-extension contexts (dev/test in browser tab)
function chromeStorageAvailable(): boolean {
  return typeof chrome !== "undefined" && !!chrome.storage?.local;
}

async function getKey<T>(key: string): Promise<T | undefined> {
  if (chromeStorageAvailable()) {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

async function setKey<T>(key: string, value: T): Promise<void> {
  if (chromeStorageAvailable()) {
    await chrome.storage.local.set({ [key]: value });
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export async function readExtensionState(): Promise<ExtensionLocalState> {
  const [targetEmail, switchedCount, uploadedEntries, guideRuns, privacyRatings] =
    await Promise.all([
      getKey<string>(STORAGE_KEYS.targetEmail),
      getKey<number>(STORAGE_KEYS.switchedCount),
      getKey<UploadedAccountEntry[]>(STORAGE_KEYS.uploadedEntries),
      getKey<GuideRunState[]>(STORAGE_KEYS.guideRuns),
      getKey<PrivacyRating[]>(STORAGE_KEYS.privacyRatings),
    ]);
  return { targetEmail, switchedCount, uploadedEntries, guideRuns, privacyRatings };
}

export async function writeUploadedEntries(entries: UploadedAccountEntry[]): Promise<void> {
  await setKey(STORAGE_KEYS.uploadedEntries, entries);
}

export async function readUploadedEntries(): Promise<UploadedAccountEntry[]> {
  return (await getKey<UploadedAccountEntry[]>(STORAGE_KEYS.uploadedEntries)) ?? [];
}

export async function writeGuideRuns(guideRuns: GuideRunState[]): Promise<void> {
  await setKey(STORAGE_KEYS.guideRuns, guideRuns);
}

export async function writePrivacyRatings(privacyRatings: PrivacyRating[]): Promise<void> {
  await setKey(STORAGE_KEYS.privacyRatings, privacyRatings);
}

export async function clearUploadedEntries(): Promise<void> {
  if (chromeStorageAvailable()) {
    await chrome.storage.local.remove(STORAGE_KEYS.uploadedEntries);
  } else {
    localStorage.removeItem(STORAGE_KEYS.uploadedEntries);
  }
}
