import { useCallback, useMemo } from 'react';
import { HABITS_KEY, normalizeHabits } from './habits';
import { useStoredState } from './useStoredState';

const NO_HABITS = [];

export function useHabits() {
  const [stored, setStored] = useStoredState(HABITS_KEY, NO_HABITS);
  const habits = useMemo(() => normalizeHabits(stored), [stored]);
  const setHabits = useCallback((update) => {
    setStored((current) => {
      const valid = normalizeHabits(current);
      return normalizeHabits(typeof update === 'function' ? update(valid) : update);
    });
  }, [setStored]);
  return [habits, setHabits];
}
