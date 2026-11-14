export const RECENTS_KEY = 'lc:recent-sections';
const LIMIT = 5;

function read() {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function write(paths) {
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(paths));
  } catch {
  }
}

export function recentSections() {
  return read();
}

export function rememberSection(path) {
  write([path, ...read().filter((entry) => entry !== path)].slice(0, LIMIT));
}

export function clearSectionRecents() {
  try {
    window.localStorage.removeItem(RECENTS_KEY);
  } catch {
  }
}
