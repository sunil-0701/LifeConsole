import { useCallback, useMemo } from 'react';
import { NOTES_KEY, normalizeNotes } from './notes';
import { useStoredState } from './useStoredState';

const NO_NOTES = [];

// A schema boundary keeps malformed storage from breaking any note consumer.
export function useNotes() {
  const [stored, setStored] = useStoredState(NOTES_KEY, NO_NOTES);
  const notes = useMemo(() => normalizeNotes(stored), [stored]);
  const setNotes = useCallback((update) => {
    setStored((current) => {
      const valid = normalizeNotes(current);
      return normalizeNotes(typeof update === 'function' ? update(valid) : update);
    });
  }, [setStored]);
  return [notes, setNotes];
}
