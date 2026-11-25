import { describe, expect, it } from 'vitest';
import { normalizeJournal } from './journal';

describe('journal timestamp bounds', () => {
  const entry = { id: 'entry', title: 'Title', text: 'Body', day: '2026-01-01', createdAt: 0, updatedAt: 0 };
  const maximum = 8640000000000000;

  it('accepts the epoch, equal timestamps and the maximum supported date', () => {
    expect(normalizeJournal([entry])).toEqual([entry]);
    const last = { ...entry, createdAt: maximum, updatedAt: maximum };
    expect(normalizeJournal([last])).toEqual([last]);
  });

  it('rejects invalid creation and update timestamps independently', () => {
    for (const value of [-1, NaN, Infinity, -Infinity, maximum + 1, '123', null]) {
      expect(normalizeJournal([{ ...entry, createdAt: value }])).toEqual([]);
      expect(normalizeJournal([{ ...entry, updatedAt: value }])).toEqual([]);
    }
    expect(normalizeJournal([{ ...entry, createdAt: 2, updatedAt: 1 }])).toEqual([]);
  });
});
