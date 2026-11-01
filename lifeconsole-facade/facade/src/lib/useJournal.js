import { useCallback, useMemo } from 'react';
import { JOURNAL_KEY, normalizeJournal } from './journal';
import { useStoredState } from './useStoredState';

const NO_ENTRIES = [];

// All journal consumers share the same boundary for malformed or duplicate rows.
export function useJournal() {
  const [stored, setStored] = useStoredState(JOURNAL_KEY, NO_ENTRIES);
  const entries = useMemo(() => normalizeJournal(stored), [stored]);
  const setEntries = useCallback((update) => {
    setStored((current) => {
      const valid = normalizeJournal(current);
      return normalizeJournal(typeof update === 'function' ? update(valid) : update);
    });
  }, [setStored]);
  return [entries, setEntries];
}
