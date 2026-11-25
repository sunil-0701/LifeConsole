import { describe, expect, it } from 'vitest';
import { createHabit, HABIT_NAME_LIMIT, renameHabit } from './habits';

describe('renameHabit', () => {
  it('trims the selected name and preserves other habits and completion history', () => {
    const habit = { ...createHabit('Read', '2026-01-01'), completedDays: ['2026-01-02'] };
    const other = createHabit('Walk', '2026-01-01');
    const next = renameHabit([habit, other], habit.id, '  Read daily  ');

    expect(next[0]).toEqual({ ...habit, name: 'Read daily' });
    expect(next[1]).toBe(other);
    expect(habit.name).toBe('Read');
  });

  it('rejects blank and oversized names but accepts the exact limit', () => {
    const habits = [createHabit('Read', '2026-01-01')];
    expect(renameHabit(habits, habits[0].id, ' \n\t ')).toBe(habits);
    expect(renameHabit(habits, habits[0].id, 'a'.repeat(HABIT_NAME_LIMIT + 1))).toBe(habits);
    expect(renameHabit(habits, habits[0].id, 'a'.repeat(HABIT_NAME_LIMIT))[0].name).toHaveLength(HABIT_NAME_LIMIT);
    expect(renameHabit(habits, 'missing', 'New name')[0]).toBe(habits[0]);
  });
});
