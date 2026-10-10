import { describe, expect, it } from 'vitest';
import { editDistance, scoreSegment, suggestionsFor } from './suggestions';

describe('editDistance', () => {
  it('counts single-character edits', () => {
    expect(editDistance('same', 'same')).toBe(0);
    expect(editDistance('stiky-notes', 'sticky-notes')).toBe(1);
    expect(editDistance('tsaks', 'tasks')).toBe(2);
    expect(editDistance('', 'tasks')).toBe(5);
  });
});

describe('scoreSegment', () => {
  it('ranks exact over prefix over substring', () => {
    expect(scoreSegment('tasks', 'Tasks')).toBe(100);
    expect(scoreSegment('stick', 'Sticky Notes')).toBe(80);
    expect(scoreSegment('notes', 'Sticky Notes')).toBe(60);
  });

  it('accepts near misses inside the edit budget', () => {
    expect(scoreSegment('stiky-notes', 'Sticky Notes')).toBe(39); // 40 - 1
    expect(scoreSegment('tsaks', 'Tasks')).toBe(38); // 40 - 2
  });

  it('gives up on unrelated words', () => {
    expect(scoreSegment('completely-different', 'Tasks')).toBeNull();
  });
});

describe('suggestionsFor', () => {
  it('offers nothing for the bare dashboard path', () => {
    expect(suggestionsFor('/')).toEqual([]);
  });

  it('suggests a section from a typo', () => {
    expect(suggestionsFor('/tsaks').map((item) => item.to)).toEqual(['/tasks']);
  });

  it('scores every segment, so a nested miss still finds its section', () => {
    expect(suggestionsFor('/jornal/entry').map((item) => item.to)).toEqual(['/journal']);
  });

  it('ranks the closest first and keeps only the best three', () => {
    const ranked = suggestionsFor('/tsaks/goals/wishlist/hme');

    expect(ranked.map((item) => item.to)).toEqual(['/goals', '/wishlist', '/']);
  });

  it('never suggests a section that is still locked', () => {
    expect(suggestionsFor('/gallry')).toEqual([]);
  });
});
