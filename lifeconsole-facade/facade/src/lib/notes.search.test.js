import { describe, expect, it } from 'vitest';
import { findNotes } from './notes';

describe('note search combinations', () => {
  const first = { id: 'first', text: 'Buy tea and apples', pinned: false, createdAt: 1, updatedAt: 1 };
  const pinned = { id: 'pinned', text: 'Tea shopping list', pinned: true, createdAt: 2, updatedAt: 2 };
  const other = { id: 'other', text: 'Coffee shopping list', pinned: true, createdAt: 3, updatedAt: 3 };
  const notes = [first, pinned, other];

  it('applies every search term together with the pinned-only constraint', () => {
    expect(findNotes(notes, ' LIST\nTEA ', true)).toEqual([pinned]);
    expect(findNotes(notes, 'apples', true)).toEqual([]);
    expect(findNotes(notes, 'tea coffee')).toEqual([]);
  });

  it('sorts blank searches and leaves the source list unchanged', () => {
    expect(findNotes(notes, '\t ')).toEqual([other, pinned, first]);
    expect(findNotes(notes, '', true)).toEqual([other, pinned]);
    expect(notes).toEqual([first, pinned, other]);
    expect(findNotes([], 'tea', true)).toEqual([]);
  });
});
