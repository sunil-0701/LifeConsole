import { describe, expect, it } from 'vitest';
import { createHabit, habitWeek } from './habits';

describe('habit week boundaries', () => {
  it('includes the prior year and enables the exact creation day', () => {
    const habit = { ...createHabit('Read', '2025-12-31'), completedDays: ['2026-01-01'] };
    const week = habitWeek(habit, '2026-01-03');

    expect(week.map(({ day }) => day)).toEqual(['2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03']);
    expect(week.filter(({ available }) => available).map(({ day }) => day)).toEqual(['2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03']);
    expect(week.filter(({ completed }) => completed).map(({ day }) => day)).toEqual(['2026-01-01']);
  });

  it('disables every date when the habit has not been created yet', () => {
    const week = habitWeek(createHabit('Read', '2026-01-04'), '2026-01-03');
    expect(week).toHaveLength(7);
    expect(week.every(({ available, completed }) => !available && !completed)).toBe(true);
  });
});
