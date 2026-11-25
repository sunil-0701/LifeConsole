import { describe, expect, it } from 'vitest';
import { createHabit, habitStats } from './habits';

describe('habit streak calendar boundaries', () => {
  it('counts consecutive days across a leap day and month boundary', () => {
    const habit = { ...createHabit('Read', '2024-02-28'), completedDays: ['2024-03-01', '2024-02-28', '2024-02-29'] };
    expect(habitStats(habit, '2024-03-01')).toEqual({ current: 3, best: 3, total: 3 });
    expect(habitStats(habit, '2024-03-02')).toEqual({ current: 3, best: 3, total: 3 });
    expect(habitStats(habit, '2024-03-03')).toEqual({ current: 0, best: 3, total: 3 });
  });

  it('joins December and January without treating gaps as consecutive', () => {
    const habit = { ...createHabit('Walk', '2025-12-30'), completedDays: ['2025-12-30', '2026-01-01', '2025-12-31', '2026-01-03'] };
    expect(habitStats(habit, '2026-01-03')).toEqual({ current: 1, best: 3, total: 4 });
  });
});
