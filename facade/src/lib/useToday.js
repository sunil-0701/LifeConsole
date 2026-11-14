import { useEffect, useState } from 'react';
import { localDay, msUntilMidnight } from './calendar';

export function useToday() {
  const [today, setToday] = useState(() => localDay());
  useEffect(() => {
    let timer;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, msUntilMidnight());
    };
    const sync = () => {
      setToday(localDay());
      schedule();
    };
    const onVisible = () => {
      if (!document.hidden) sync();
    };
    schedule();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', sync);
    };
  }, []);
  return today;
}
