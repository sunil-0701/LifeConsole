import { useEffect, useRef, useState } from 'react';

export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  const initialRef = useRef(initial);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== null && event.key !== key) return;

      try {
        setValue(event.newValue === null ? initialRef.current : JSON.parse(event.newValue));
      } catch {
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue];
}
