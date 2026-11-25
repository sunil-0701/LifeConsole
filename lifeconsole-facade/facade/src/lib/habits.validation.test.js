import { describe, expect, it } from 'vitest';
import { createHabit, HABIT_NAME_LIMIT, normalizeHabits } from './habits';

describe('habit storage validation', () => {
  it('rejects each malformed field without discarding a later valid record', () => {
    const valid = createHabit('Read', '2026-01-01');
    const invalidFields = [
      { id: '' }, { id: 42 }, { name: null }, { name: ' \n ' },
      { name: 'a'.repeat(HABIT_NAME_LIMIT + 1) }, { createdOn: '2026-02-30' },
      { archived: 0 }, { completedDays: null }, { completedDays: {} },
    ];

    for (const fields of invalidFields) {
      expect(normalizeHabits([{ ...valid, ...fields }, valid])).toEqual([valid]);
    }
  });

  it('retains valid metadata while copying and cleaning the history array', () => {
    const habit = { ...createHabit('Read', '2026-01-01'), archived: true, completedDays: ['2026-01-01', null, 42] };
    const [normalized] = normalizeHabits([habit]);

    expect(normalized).toEqual({ ...habit, completedDays: ['2026-01-01'] });
    expect(normalized.completedDays).not.toBe(habit.completedDays);
    expect(habit.completedDays).toEqual(['2026-01-01', null, 42]);
  });
});
