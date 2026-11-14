import { isDayKey, localDay } from './calendar.js';

export const JOURNAL_KEY = 'lc:journal';
export const JOURNAL_TITLE_LIMIT = 120;
export const JOURNAL_TEXT_LIMIT = 10000;

function validText(title, text) {
  return typeof title === 'string' && Boolean(title.trim()) && title.length <= JOURNAL_TITLE_LIMIT &&
    typeof text === 'string' && Boolean(text.trim()) && text.length <= JOURNAL_TEXT_LIMIT;
}

export function normalizeJournal(value) {
  if (!Array.isArray(value)) return [];
  const ids = new Set();
  return value.filter((entry) => {
    if (
      !entry || typeof entry.id !== 'string' || !entry.id || ids.has(entry.id) ||
      !validText(entry.title, entry.text) || !isDayKey(entry.day) ||
      !Number.isFinite(entry.createdAt) || entry.createdAt < 0 || entry.createdAt > 8640000000000000 ||
      !Number.isFinite(entry.updatedAt) || entry.updatedAt < entry.createdAt || entry.updatedAt > 8640000000000000
    ) return false;
    ids.add(entry.id);
    return true;
  });
}

export function createJournalEntry(title, text, day = localDay()) {
  if (!validText(title, text) || !isDayKey(day) || day > localDay()) return null;
  const now = Date.now();
  return { id: crypto.randomUUID(), title: title.trim(), text: text.trim(), day, createdAt: now, updatedAt: now };
}

export function editJournalEntry(entries, id, { title, text, day }) {
  if (!validText(title, text) || !isDayKey(day) || day > localDay()) return entries;
  const nextTitle = title.trim();
  const nextText = text.trim();
  return entries.map((entry) => entry.id === id &&
    (entry.title !== nextTitle || entry.text !== nextText || entry.day !== day)
    ? { ...entry, title: nextTitle, text: nextText, day, updatedAt: Math.max(Date.now(), entry.updatedAt) }
    : entry);
}

export function sortJournal(entries) {
  return [...entries].sort((a, b) => b.day.localeCompare(a.day) || b.createdAt - a.createdAt || a.id.localeCompare(b.id));
}

export function formatJournalDay(day) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}
