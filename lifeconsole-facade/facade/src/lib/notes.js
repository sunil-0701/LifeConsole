export const NOTES_KEY = 'lc:notes';

export function normalizeNotes(value) {
  if (!Array.isArray(value)) return [];
  const ids = new Set();
  return value.filter((note) => {
    if (
      !note || typeof note.id !== 'string' || !note.id || ids.has(note.id) ||
      typeof note.text !== 'string' || !note.text.trim() ||
      !Number.isFinite(note.createdAt) || !Number.isFinite(note.updatedAt) ||
      typeof note.pinned !== 'boolean'
    ) return false;
    ids.add(note.id);
    return true;
  });
}

export function createNote(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    text: trimmed,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function removeNote(notes, id) {
  return notes.filter((note) => note.id !== id);
}

export function editNote(notes, id, text) {
  const trimmed = text.trim();
  if (!trimmed) return notes;
  return notes.map((note) => note.id === id && note.text !== trimmed
    ? { ...note, text: trimmed, updatedAt: Date.now() }
    : note);
}

export function toggleNotePin(notes, id) {
  return notes.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note);
}

export function sortNotes(notes) {
  return [...notes].sort((a, b) =>
    Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt ||
    b.createdAt - a.createdAt || a.id.localeCompare(b.id));
}
