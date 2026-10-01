import { useEffect, useState } from 'react';

const DATE_OPTIONS = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const TIME_OPTIONS = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden items-center gap-3 text-[13px] text-zinc-500 sm:flex">
      <span className="whitespace-nowrap">{now.toLocaleDateString('en-US', DATE_OPTIONS)}</span>
      <span className="h-4 w-px bg-white/10" aria-hidden="true" />
      <span className="whitespace-nowrap tabular-nums text-zinc-400">
        {now.toLocaleTimeString('en-US', TIME_OPTIONS)}
      </span>
    </div>
  );
}

export default LiveClock;
