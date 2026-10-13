import { describe, expect, it, vi, afterEach } from 'vitest';
import { createNote, normalizeNotes, removeNote } from './notes';

afterEach(() => vi.useRealTimers());

describe('createNote', () => {
  it('trims text, creates unique ids and starts unpinned', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T10:00:00Z'));
    const note = createNote('  remember this  ');
    expect(note.text).toBe('remember this');
    expect(note.pinned).toBe(false);
    expect(note.updatedAt).toBe(Date.now());
    expect(note.createdAt).toBe(note.updatedAt);
    expect(note.id).not.toBe(createNote('remember this').id);
  });

  it('refuses blank notes and preserves line breaks', () => {
    expect(createNote(' \n ')).toBeNull();
    expect(createNote('one\ntwo').text).toBe('one\ntwo');
  });
});

describe('normalizeNotes', () => {
  it('handles valid JSON that is not a note list', () => {
    for (const value of [null, 1, {}, 'text']) expect(normalizeNotes(value)).toEqual([]);
  });

  it('drops invalid rows and duplicate ids without losing healthy notes', () => {
    const note = createNote('keep me');
    expect(normalizeNotes([
      null, {}, note, note, { ...note, id: 'blank', text: ' ' },
      { ...note, id: 'bad-date', updatedAt: 'yesterday' },
      { ...note, id: 'bad-pin', pinned: 'yes' },
    ])).toEqual([note]);
  });
});

describe('removeNote', () => {
  it('removes only the target without mutating the original', () => {
    const notes = [createNote('one'), createNote('two')];
    expect(removeNote(notes, notes[0].id)).toEqual([notes[1]]);
    expect(notes).toHaveLength(2);
    expect(removeNote(notes, 'missing')).toEqual(notes);
  });
});
