import { describe, expect, it, vi, afterEach } from 'vitest';
import { createNote, editNote, normalizeNotes, removeNote, sortNotes, toggleNotePin } from './notes';

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

describe('editNote', () => {
  it('updates only the target and keeps its id and creation time', () => {
    vi.useFakeTimers();
    const notes = [createNote('one'), createNote('two')];
    vi.advanceTimersByTime(1000);
    const next = editNote(notes, notes[0].id, '  revised\ntext ');
    expect(next[0]).toEqual({ ...notes[0], text: 'revised\ntext', updatedAt: Date.now() });
    expect(next[1]).toBe(notes[1]);
    expect(notes[0].text).toBe('one');
  });

  it('refuses blank edits and does not change timestamps for identical text', () => {
    const notes = [createNote('one')];
    expect(editNote(notes, notes[0].id, ' ')).toBe(notes);
    expect(editNote(notes, notes[0].id, ' one ')[0]).toBe(notes[0]);
  });

  it('does not recreate notes deleted in another tab', () => {
    expect(editNote([], 'deleted', 'text')).toEqual([]);
  });
});

describe('pinned note ordering', () => {
  it('toggles only the target pin without changing its edit time', () => {
    const notes = [createNote('one'), createNote('two')];
    const pinned = toggleNotePin(notes, notes[0].id);
    expect(pinned[0]).toEqual({ ...notes[0], pinned: true });
    expect(pinned[1]).toBe(notes[1]);
    expect(toggleNotePin(pinned, notes[0].id)).toEqual(notes);
    expect(notes[0].pinned).toBe(false);
  });

  it('puts pinned notes before newer unpinned notes without mutating the list', () => {
    const older = { ...createNote('older'), updatedAt: 10, pinned: true };
    const newer = { ...createNote('newer'), updatedAt: 20 };
    const newest = { ...createNote('newest'), updatedAt: 30 };
    const notes = [newer, newest, older];
    expect(sortNotes(notes)).toEqual([older, newest, newer]);
    expect(notes).toEqual([newer, newest, older]);
  });

  it('breaks timestamp ties deterministically', () => {
    const a = { ...createNote('a'), id: 'a', updatedAt: 10, createdAt: 10 };
    const b = { ...a, id: 'b' };
    expect(sortNotes([b, a])).toEqual([a, b]);
  });
});
