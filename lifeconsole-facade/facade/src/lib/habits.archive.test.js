import { describe, expect, it } from 'vitest';
import { createHabit, toggleHabitArchive } from './habits';

describe('toggleHabitArchive', () => {
  it('archives and restores a habit without losing its history', () => {
    const habit = { ...createHabit('Read', '2026-01-01'), completedDays: ['2026-01-02'] };
    const other = createHabit('Walk', '2026-01-01');
    const habits = [habit, other];
    const archived = toggleHabitArchive(habits, habit.id);

    expect(archived[0]).toEqual({ ...habit, archived: true });
    expect(archived[1]).toBe(other);
    expect(habit.archived).toBe(false);
    expect(toggleHabitArchive(archived, habit.id)).toEqual(habits);
  });

  it('leaves unknown IDs and empty lists unchanged', () => {
    const habit = createHabit('Read', '2026-01-01');
    expect(toggleHabitArchive([habit], 'missing')[0]).toBe(habit);
    expect(toggleHabitArchive([], 'missing')).toEqual([]);
  });
});
