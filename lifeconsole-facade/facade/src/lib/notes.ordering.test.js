import { describe, expect, it } from 'vitest';
import { sortNotes } from './notes';

describe('note ordering tie breakers', () => {
  it('prefers creation time and then ID when update times are tied', () => {
    const notes = [
      { id: 'b', pinned: false, updatedAt: 300, createdAt: 200 },
      { id: 'older', pinned: false, updatedAt: 300, createdAt: 100 },
      { id: 'a', pinned: false, updatedAt: 300, createdAt: 200 },
    ];
    expect(sortNotes(notes).map(({ id }) => id)).toEqual(['a', 'b', 'older']);
    expect(notes.map(({ id }) => id)).toEqual(['b', 'older', 'a']);
  });

  it('prioritizes pinned notes even when unpinned notes are newer', () => {
    const pinned = { id: 'pinned', pinned: true, updatedAt: 1, createdAt: 1 };
    const recent = { id: 'recent', pinned: false, updatedAt: 999, createdAt: 999 };
    expect(sortNotes([recent, pinned])).toEqual([pinned, recent]);
    expect(sortNotes([])).toEqual([]);
  });
});
