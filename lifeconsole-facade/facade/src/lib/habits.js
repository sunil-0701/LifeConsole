import { isDayKey, localDay } from './calendar';

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
