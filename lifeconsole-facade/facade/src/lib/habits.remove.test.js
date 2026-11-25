import { describe, expect, it } from 'vitest';
import { createHabit, removeHabit } from './habits';

describe('removeHabit', () => {
  it('removes an archived habit without mutating the list or remaining entries', () => {
    const archived = { ...createHabit('Read', '2026-01-01'), archived: true };
    const active = createHabit('Walk', '2026-01-01');
    const habits = [archived, active];
    const next = removeHabit(habits, archived.id);

    expect(next).toEqual([active]);
    expect(next[0]).toBe(active);
    expect(habits).toEqual([archived, active]);
  });

  it('handles unknown IDs and empty lists', () => {
    const habits = [createHabit('Read', '2026-01-01')];
    expect(removeHabit(habits, 'missing')).toEqual(habits);
    expect(removeHabit([], 'missing')).toEqual([]);
    expect(removeHabit(habits, habits[0].id)).toEqual([]);
  });
});
