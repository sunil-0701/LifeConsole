import { afterEach, describe, expect, it, vi } from 'vitest';
import { createJournalEntry, editJournalEntry, formatJournalDay, JOURNAL_TEXT_LIMIT, JOURNAL_TITLE_LIMIT, normalizeJournal, sortJournal } from './journal';

afterEach(() => {
  vi.useRealTimers();
});

describe('createJournalEntry', () => {
  it('trims content and assigns unique IDs and consistent timestamps', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    const entry = createJournalEntry('  A good day  ', '  Read a book.  ', '2026-01-14');

    expect(entry).toMatchObject({ title: 'A good day', text: 'Read a book.', day: '2026-01-14', createdAt: Date.now(), updatedAt: Date.now() });
    expect(entry.id).toBeTruthy();
    expect(createJournalEntry('A good day', 'Read a book.', '2026-01-14').id).not.toBe(entry.id);
  });

  it('rejects blank, oversized, invalid and future entries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));

    for (const [title, text] of [[' ', 'Body'], ['Title', ' '], [null, 'Body'], ['Title', null], ['a'.repeat(JOURNAL_TITLE_LIMIT + 1), 'Body'], ['Title', 'a'.repeat(JOURNAL_TEXT_LIMIT + 1)]]) {
      expect(createJournalEntry(title, text, '2026-01-14')).toBeNull();
    }
    expect(createJournalEntry('Title', 'Body', '2026-02-30')).toBeNull();
    expect(createJournalEntry('Title', 'Body', '2026-01-17')).toBeNull();
    expect(createJournalEntry('a'.repeat(JOURNAL_TITLE_LIMIT), 'a'.repeat(JOURNAL_TEXT_LIMIT), '2026-01-14')).not.toBeNull();
  });
});

describe('editJournalEntry', () => {
  it('updates only the selected entry without mutating existing data', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    const entries = [createJournalEntry('First', 'Body', '2026-01-14'), createJournalEntry('Second', 'Body', '2026-01-14')];
    vi.setSystemTime(new Date('2026-01-16T12:00:00Z'));
    const next = editJournalEntry(entries, entries[0].id, { title: '  Revised  ', text: '  New body  ', day: '2026-01-15' });

    expect(next[0]).toEqual({ ...entries[0], title: 'Revised', text: 'New body', day: '2026-01-15', updatedAt: Date.now() });
    expect(entries[0].title).toBe('First');
    expect(next[1]).toBe(entries[1]);
  });

  it('preserves no-op entries and prevents timestamps from moving backwards', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-16T12:00:00Z'));
    const entry = createJournalEntry('Title', 'Body', '2026-01-14');
    const entries = [entry];
    const fields = { title: ' Title ', text: ' Body ', day: entry.day };

    expect(editJournalEntry(entries, entry.id, fields)[0]).toBe(entry);
    expect(editJournalEntry(entries, 'missing', fields)[0]).toBe(entry);
    expect(editJournalEntry(entries, entry.id, { ...fields, title: ' ' })).toBe(entries);
    expect(editJournalEntry(entries, entry.id, { ...fields, day: '2026-01-20' })).toBe(entries);
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    expect(editJournalEntry(entries, entry.id, { ...fields, title: 'Changed' })[0].updatedAt).toBe(entry.updatedAt);
  });
});

describe('journal storage and presentation', () => {
  it('filters duplicate IDs and malformed stored entries', () => {
    const entry = { id: 'valid', title: 'Title', text: 'Body', day: '2026-01-14', createdAt: 100, updatedAt: 200 };
    const invalid = [
      null,
      { ...entry, id: '' },
      { ...entry, id: 'blank', title: ' ' },
      { ...entry, id: 'date', day: '2026-02-30' },
      { ...entry, id: 'negative', createdAt: -1 },
      { ...entry, id: 'reversed', updatedAt: 99 },
      { ...entry, id: 'infinite', updatedAt: Infinity },
      { ...entry, id: 'overflow', updatedAt: 8640000000000001 },
    ];

    expect(normalizeJournal([...invalid, entry, { ...entry, title: 'Duplicate' }])).toEqual([entry]);
    expect(normalizeJournal({})).toEqual([]);
  });

  it('sorts newest days first with deterministic timestamp and ID tie breakers', () => {
    const entries = [
      { id: 'b', day: '2026-01-14', createdAt: 200 },
      { id: 'old', day: '2026-01-13', createdAt: 999 },
      { id: 'a', day: '2026-01-14', createdAt: 200 },
      { id: 'latest', day: '2026-01-14', createdAt: 300 },
    ];

    expect(sortJournal(entries).map((entry) => entry.id)).toEqual(['latest', 'a', 'b', 'old']);
    expect(entries.map((entry) => entry.id)).toEqual(['b', 'old', 'a', 'latest']);
  });

  it('formats the calendar day consistently regardless of the local time zone', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
    }).format(new Date('2026-01-01T00:00:00Z'));

    expect(formatJournalDay('2026-01-01')).toBe(expected);
  });
});
