import { describe, expect, it } from 'vitest';
import { createHabit, findHabits } from './habits';

describe('findHabits', () => {
  const reading = createHabit('Read before bed', '2026-01-01');
  const walking = createHabit('Walk before work', '2026-01-01');
  const archived = { ...createHabit('Read at lunch', '2026-01-01'), archived: true };
  const habits = [reading, walking, archived];

  it('matches every term case-insensitively in any order', () => {
    expect(findHabits(habits, '  BED\tread  ')).toEqual([reading]);
    expect(findHabits(habits, 'read work')).toEqual([]);
    expect(findHabits(habits, 'missing')).toEqual([]);
  });

  it('separates active and archived results even for blank searches', () => {
    expect(findHabits(habits, ' \n ')).toEqual([reading, walking]);
    expect(findHabits(habits, '', true)).toEqual([archived]);
    expect(findHabits(habits, 'READ', true)).toEqual([archived]);
    expect(findHabits([], '')).toEqual([]);
  });
});
