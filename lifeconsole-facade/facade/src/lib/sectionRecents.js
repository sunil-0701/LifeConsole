export const RECENTS_KEY = 'lc:recent-sections';
const LIMIT = 5;

// localStorage can throw (private windows, blocked cookies, quota) — recents
// are a nicety, so a storage failure must never break navigation.
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

// Forget the whole history — offered by the palette and Settings, since a
// jump list is also a record of where you have been.
export function clearSectionRecents() {
  try {
    window.localStorage.removeItem(RECENTS_KEY);
  } catch {
    // Nothing stored, or storage is unreachable — either way there is nothing
    // to clear.
  }
}
