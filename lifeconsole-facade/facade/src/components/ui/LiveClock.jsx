import { useEffect, useState } from 'react';

const DATE_OPTIONS = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const TIME_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23', // railway time — 00–23, no AM/PM
};

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id;

    // Each tick is aimed at the next whole second, so the readout flips on the
    // boundary instead of wherever the component happened to mount — and a tab
    // left open for days never accumulates setInterval drift.
    const schedule = () => {
      id = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 1000 - (Date.now() % 1000));
    };

    schedule();
    return () => clearTimeout(id);
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
