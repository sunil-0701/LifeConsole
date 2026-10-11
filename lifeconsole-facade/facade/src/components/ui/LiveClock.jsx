import { useEffect, useState } from 'react';

const DATE_OPTIONS = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const TIME_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
};

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id;

    const schedule = () => {
      clearTimeout(id);
      if (document.hidden) return;
      id = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 1000 - (Date.now() % 1000));
    };

    const onVisibility = () => {
      if (!document.hidden) setNow(new Date());
      schedule();
    };

    schedule();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="hidden items-center gap-3 text-[11px] text-zinc-500 sm:flex">
      <span className="whitespace-nowrap">{now.toLocaleDateString('en-US', DATE_OPTIONS)}</span>
      <span className="h-4 w-px bg-white/10" aria-hidden="true" />
      <span className="whitespace-nowrap tabular-nums text-zinc-400">
        {now.toLocaleTimeString('en-US', TIME_OPTIONS)}
      </span>
    </div>
  );
}

export default LiveClock;
