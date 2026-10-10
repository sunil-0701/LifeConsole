import { useEffect, useRef, useState } from 'react';

// localStorage-backed state: JSON serialised, guarded against blocked or
// corrupt storage, and kept in sync across tabs through the storage event
// (which only ever fires in the *other* windows).
//
// Pass a stable `initial` — a module-level constant beats an inline literal
// like `[]`, which would be captured fresh on every render.
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      // Unreadable storage (private mode, quota, bad JSON) — start fresh.
      return initial;
    }
  });

  const initialRef = useRef(initial);

  // Persist every change; a failed write must not break the component.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Blocked or full — the value still holds in memory this session.
    }
  }, [key, value]);

  // Adopt changes made in other tabs, including a whole-storage clear
  // (event.key === null), which resets to the initial value.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== null && event.key !== key) return;

      try {
        setValue(event.newValue === null ? initialRef.current : JSON.parse(event.newValue));
      } catch {
        // Corrupt payload from the other tab — keep what we already have.
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}
