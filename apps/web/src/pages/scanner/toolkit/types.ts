export interface ProgressEntry {
  signedUp: boolean
  migrated: boolean
  deleted: boolean
}

export type Progress = Record<string, ProgressEntry>

export const PROGRESS_KEY = 'toolkit_progress'

export function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}

export function entryFor(progress: Progress, id: string): ProgressEntry {
  return progress[id] ?? { signedUp: false, migrated: false, deleted: false }
}
