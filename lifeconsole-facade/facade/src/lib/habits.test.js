import { describe, expect, it } from 'vitest';
import { createHabit, HABIT_NAME_LIMIT, normalizeHabits, removeHabit, toggleHabitDay } from './habits';

describe('habit records', () => {
  it('creates uniquely identified daily habits with trimmed names', () => {
    const habit = createHabit('  Walk  ', '2026-10-14');
    expect(habit).toMatchObject({ name: 'Walk', createdOn: '2026-10-14', archived: false, completedDays: [] });
    expect(habit.id).not.toBe(createHabit('Walk', '2026-10-14').id);
  });

  it('rejects blank, oversized or undated habits', () => {
    expect(createHabit(' ')).toBeNull();
    expect(createHabit('a'.repeat(HABIT_NAME_LIMIT + 1))).toBeNull();
    expect(createHabit('Walk', 'bad')).toBeNull();
  });

  it('handles non-list storage and drops malformed rows and duplicate ids', () => {
    for (const input of [null, {}, 1, 'text']) expect(normalizeHabits(input)).toEqual([]);
    const habit = createHabit('Walk');
    expect(normalizeHabits([null, {}, habit, habit, { ...habit, id: 'bad', archived: 'no' }])).toEqual([habit]);
  });

  it('sanitizes completion history without discarding healthy records', () => {
    const habit = { ...createHabit('Walk', '2026-10-01'), completedDays: [
      '2026-10-03', 'bad', '2026-09-30', '2026-10-02', '2026-10-03', '2026-02-30',
    ] };
    expect(normalizeHabits([habit])[0].completedDays).toEqual(['2026-10-02', '2026-10-03']);
    expect(habit.completedDays).toHaveLength(6);
  });

  it('removes only the target without mutating existing state', () => {
    const habits = [createHabit('Walk'), createHabit('Read')];
    expect(removeHabit(habits, habits[0].id)).toEqual([habits[1]]);
    expect(removeHabit(habits, 'missing')).toEqual(habits);
    expect(habits).toHaveLength(2);
  });
});

describe('daily check-ins', () => {
  const today = '2026-10-14';

  it('toggles a date without mutating the original or duplicating history', () => {
    const habits = [createHabit('Walk', today), createHabit('Read', today)];
    const done = toggleHabitDay(habits, habits[0].id, today, today);
    expect(done[0].completedDays).toEqual([today]);
    expect(done[1]).toBe(habits[1]);
    expect(habits[0].completedDays).toEqual([]);
    expect(toggleHabitDay(done, habits[0].id, today, today)).toEqual(habits);
  });

  it('rejects future, malformed and pre-creation check-ins', () => {
    const habits = [createHabit('Walk', today)];
    expect(toggleHabitDay(habits, habits[0].id, '2026-10-15', today)).toBe(habits);
    expect(toggleHabitDay(habits, habits[0].id, 'bad', today)).toBe(habits);
    expect(toggleHabitDay(habits, habits[0].id, '2026-10-13', today)).toEqual(habits);
  });

  it('does not change archived or missing habits', () => {
    const habit = { ...createHabit('Walk', today), archived: true };
    expect(toggleHabitDay([habit], habit.id, today, today)).toEqual([habit]);
    expect(toggleHabitDay([], 'gone', today, today)).toEqual([]);
  });
});
