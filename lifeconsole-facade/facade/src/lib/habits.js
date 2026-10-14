import { isDayKey, localDay, recentDays, shiftDay } from './calendar';

export const HABITS_KEY = 'lc:habits';
export const HABIT_NAME_LIMIT = 120;

export function normalizeHabits(value) {
  if (!Array.isArray(value)) return [];
  const ids = new Set();
  return value.filter((habit) => {
    if (
      !habit || typeof habit.id !== 'string' || !habit.id || ids.has(habit.id) ||
      typeof habit.name !== 'string' || !habit.name.trim() || habit.name.length > HABIT_NAME_LIMIT ||
      !isDayKey(habit.createdOn) || typeof habit.archived !== 'boolean' ||
      !Array.isArray(habit.completedDays)
    ) return false;
    ids.add(habit.id);
    return true;
  }).map((habit) => ({
    ...habit,
    name: habit.name.trim(),
    completedDays: [...new Set(habit.completedDays.filter((day) => isDayKey(day) && day >= habit.createdOn))].sort(),
  }));
}

export function createHabit(name, day = localDay()) {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > HABIT_NAME_LIMIT || !isDayKey(day)) return null;
  return { id: crypto.randomUUID(), name: trimmed, createdOn: day, archived: false, completedDays: [] };
}

export function removeHabit(habits, id) {
  return habits.filter((habit) => habit.id !== id);
}

export function toggleHabitDay(habits, id, day, today = localDay()) {
  if (!isDayKey(day) || !isDayKey(today) || day > today) return habits;
  return habits.map((habit) => {
    if (habit.id !== id || habit.archived || day < habit.createdOn) return habit;
    const completedDays = habit.completedDays.includes(day)
      ? habit.completedDays.filter((entry) => entry !== day)
      : [...habit.completedDays, day].sort();
    return { ...habit, completedDays };
  });
}

export function habitStats(habit, today = localDay()) {
  const days = [...new Set(habit.completedDays.filter((day) =>
    isDayKey(day) && day >= habit.createdOn && day <= today))].sort();
  let best = 0;
  let run = 0;
  let previous;
  for (const day of days) {
    run = previous && shiftDay(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  const completed = new Set(days);
  let cursor = completed.has(today) ? today : shiftDay(today, -1);
  let current = 0;
  while (completed.has(cursor)) {
    current += 1;
    cursor = shiftDay(cursor, -1);
  }
  return { current, best, total: days.length };
}

export function habitWeek(habit, today = localDay()) {
  return recentDays(today).map((day) => ({
    day,
    completed: habit.completedDays.includes(day),
    available: !habit.archived && day >= habit.createdOn,
  }));
}
