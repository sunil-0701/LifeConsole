import { afterEach, describe, expect, it, vi } from 'vitest';
import { createJournalEntry, JOURNAL_TEXT_LIMIT, JOURNAL_TITLE_LIMIT } from './journal';

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
