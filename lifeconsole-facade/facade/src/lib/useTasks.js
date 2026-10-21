import { useCallback, useMemo } from 'react';
import { normalizeTasks, TASKS_KEY } from './tasks';
import { useStoredState } from './useStoredState';

const NO_TASKS = [];

export function useTasks() {
  const [stored, setStored] = useStoredState(TASKS_KEY, NO_TASKS);
  const tasks = useMemo(() => normalizeTasks(stored), [stored]);
  const setTasks = useCallback((update) => {
    setStored((current) => {
      const valid = normalizeTasks(current);
      return normalizeTasks(typeof update === 'function' ? update(valid) : update);
    });
  }, [setStored]);
  return [tasks, setTasks];
}
