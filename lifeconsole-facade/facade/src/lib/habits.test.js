import { describe, expect, it } from 'vitest';
import { createHabit, HABIT_NAME_LIMIT, habitProgress, habitStats, habitWeek, normalizeHabits, toggleHabitDay } from './habits';

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

describe('toggleHabitDay', () => {
  it('adds sorted completions and removes them on a second toggle', () => {
    const habits = [createHabit('Read', '2026-01-01'), createHabit('Walk', '2026-01-01')];
    const first = toggleHabitDay(habits, habits[0].id, '2026-01-03', '2026-01-04');
    const next = toggleHabitDay(first, habits[0].id, '2026-01-02', '2026-01-04');

    expect(next[0].completedDays).toEqual(['2026-01-02', '2026-01-03']);
    expect(toggleHabitDay(next, habits[0].id, '2026-01-03', '2026-01-04')[0].completedDays).toEqual(['2026-01-02']);
    expect(habits[0].completedDays).toEqual([]);
    expect(next[1]).toBe(habits[1]);
  });

  it('ignores future, invalid, pre-creation and archived completions', () => {
    const habit = createHabit('Read', '2026-01-02');
    const habits = [habit];

    for (const day of ['2026-01-05', 'invalid', '2026-01-01']) {
      expect(toggleHabitDay(habits, habit.id, day, '2026-01-04')).toEqual(habits);
    }
    const archived = [{ ...habit, archived: true }];
    expect(toggleHabitDay(archived, habit.id, '2026-01-03', '2026-01-04')).toEqual(archived);
    expect(toggleHabitDay(habits, 'missing', '2026-01-03', '2026-01-04')).toEqual(habits);
  });
});

describe('habit reporting', () => {
  it('separates current and best streaks while ignoring invalid completions', () => {
    const habit = {
      ...createHabit('Read', '2026-01-01'),
      completedDays: ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-05', '2026-01-05', '2026-01-09', 'invalid', '2025-12-31'],
    };

    expect(habitStats(habit, '2026-01-06')).toEqual({ current: 1, best: 3, total: 4 });
    expect(habitStats(habit, '2026-01-07')).toEqual({ current: 0, best: 3, total: 4 });
    expect(habitStats(createHabit('Walk', '2026-01-01'), '2026-01-06')).toEqual({ current: 0, best: 0, total: 0 });
  });

  it('marks dates before creation and archived history as unavailable', () => {
    const habit = { ...createHabit('Read', '2026-01-03'), completedDays: ['2026-01-04'] };
    const week = habitWeek(habit, '2026-01-07');

    expect(week).toHaveLength(7);
    expect(week[0]).toEqual({ day: '2026-01-01', completed: false, available: false });
    expect(week[3]).toEqual({ day: '2026-01-04', completed: true, available: true });
    expect(habitWeek({ ...habit, archived: true }, '2026-01-07').every((day) => !day.available)).toBe(true);
  });

  it('counts only active habits created by today toward progress', () => {
    const done = { ...createHabit('Read', '2026-01-01'), completedDays: ['2026-01-07'] };
    const open = createHabit('Walk', '2026-01-01');
    const archived = { ...done, id: 'archived', archived: true };
    const future = createHabit('Swim', '2026-01-08');

    expect(habitProgress([done, open, archived, future], '2026-01-07')).toEqual({ active: [done, open], done: 1, total: 2 });
    expect(habitProgress([], '2026-01-07')).toEqual({ active: [], done: 0, total: 0 });
  });
});
