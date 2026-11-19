import { describe, expect, it } from 'vitest';
import { createHabit, HABIT_NAME_LIMIT, normalizeHabits } from './habits';

describe('createHabit', () => {
  it('trims names and creates independent, active habits', () => {
    const habit = createHabit('  Read  ', '2026-01-01');

    expect(habit).toMatchObject({ name: 'Read', createdOn: '2026-01-01', archived: false, completedDays: [] });
    expect(habit.id).toBeTruthy();
    expect(createHabit('Read', '2026-01-01').id).not.toBe(habit.id);
  });

  it('enforces name and date constraints', () => {
    expect(createHabit('   ', '2026-01-01')).toBeNull();
    expect(createHabit('a'.repeat(HABIT_NAME_LIMIT + 1), '2026-01-01')).toBeNull();
    expect(createHabit('Read', '2026-02-30')).toBeNull();
    expect(createHabit('a'.repeat(HABIT_NAME_LIMIT), '2026-01-01')).not.toBeNull();
  });
});

describe('normalizeHabits', () => {
  it('deduplicates IDs and cleans completion history without mutating input', () => {
    const habit = {
      ...createHabit('Read', '2026-01-01'),
      name: '  Read  ',
      completedDays: ['2026-01-03', 'invalid', '2025-12-31', '2026-01-02', '2026-01-03'],
    };
    const normalized = normalizeHabits([null, habit, habit, { ...habit, id: 'bad', archived: 'false' }]);

    expect(normalized).toEqual([{ ...habit, name: 'Read', completedDays: ['2026-01-02', '2026-01-03'] }]);
    expect(habit.name).toBe('  Read  ');
    expect(habit.completedDays).toHaveLength(5);
    expect(normalizeHabits(null)).toEqual([]);
  });
});
