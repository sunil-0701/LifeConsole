const STORAGE_KEY = 'lc:recent-sections';
const LIMIT = 5;

// localStorage can throw (private windows, blocked cookies, quota) — recents
// are a nicety, so a storage failure must never break navigation.
function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

function write(paths) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
  } catch {
    // No persistence this session — the in-memory order still stands.
  }
}

// Most-recent-first list of section paths, newest capped at LIMIT.
export function recentSections() {
  return read();
}

export function rememberSection(path) {
  write([path, ...read().filter((entry) => entry !== path)].slice(0, LIMIT));
}
