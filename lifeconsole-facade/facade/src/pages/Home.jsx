import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BOUNDARY_HOURS = [12, 17];

function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Milliseconds until the next hour at which the greeting changes.
function msUntilNextChange(now) {
  const next = new Date(now);
  const boundary = BOUNDARY_HOURS.find((hour) => hour > now.getHours());

  if (boundary === undefined) {
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
  } else {
    next.setHours(boundary, 0, 0, 0);
  }

  return next.getTime() - now.getTime();
}

function useGreeting() {
  const [greeting, setGreeting] = useState(() => greetingFor(new Date().getHours()));

  useEffect(() => {
    let timer;

    const sync = () => {
      setGreeting(greetingFor(new Date().getHours()));
      schedule();
    };

    // One timeout aimed exactly at the next boundary — no interval, no polling.
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, msUntilNextChange(new Date()));
    };

    const onVisible = () => {
      if (!document.hidden) sync();
    };

    schedule();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return greeting;
}

function Home() {
  const greeting = useGreeting();

  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-mono text-[13px] tracking-[0.3em] text-zinc-500 uppercase"
          >
            {greeting},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="mt-4 font-serif text-6xl leading-[0.95] font-medium text-white sm:text-7xl lg:text-8xl"
          >
            Sunil.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
            className="mt-6 font-mono text-sm tracking-wide text-zinc-500"
          >
            Small steps today. A stronger tomorrow.
          </motion.p>
        </div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xs font-mono text-[13px] leading-relaxed text-zinc-400 lg:mt-2"
        >
          <p>
            &ldquo;Discipline is choosing what you want most over what you want
            now.&rdquo;
          </p>
          <footer className="mt-3 text-zinc-600">&mdash; James Clear</footer>
        </motion.blockquote>
      </section>

      <section className="mt-14 border-t border-white/[0.06] pt-6 sm:mt-20">
        <p className="font-mono text-xs text-zinc-600">
          Today&rsquo;s focus, quick actions, and area overviews will appear
          here.
        </p>
      </section>
    </div>
  );
}

export default Home;
