import { useEffect, useState } from 'react';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
});
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

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
    <div className="hidden flex-col items-end gap-0.5 border-l border-white/[0.08] pl-4 text-[10px] text-zinc-500 sm:flex" aria-live="off">
      <span className="hidden whitespace-nowrap md:block">{DATE_FORMATTER.format(now)}</span>
      <time dateTime={now.toISOString()} title={DATE_FORMATTER.format(now)} className="whitespace-nowrap font-mono text-xs tabular-nums text-zinc-300">
        {TIME_FORMATTER.format(now)}
      </time>
    </div>
  );
}

export default LiveClock;
