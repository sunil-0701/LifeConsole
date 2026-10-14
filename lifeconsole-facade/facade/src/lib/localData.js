import { ACCENT_KEY } from './preferences';
import { RECENTS_KEY } from './sectionRecents';
import { TASKS_KEY } from './tasks';
import { NOTES_KEY } from './notes';
import { HABITS_KEY } from './habits';

export const LOCAL_DATA_KEYS = [ACCENT_KEY, RECENTS_KEY, TASKS_KEY, NOTES_KEY, HABITS_KEY];

// Only remove our own keys; one blocked removal must not skip the others.
export function clearLocalData() {
  let success = true;
  for (const key of LOCAL_DATA_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      success = false;
    }
  }
  return success;
}
