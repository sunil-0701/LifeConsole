import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TypedText from '../components/ui/TypedText';

const BOUNDARY_HOURS = [12, 17];

// Typewriter timing for the hero: one continuous typing pass across the
// whole line. "Sir." starts the instant the greeting's final character
// lands, +40ms only so the comma always renders first.
const GREETING_DELAY = 220;
const TYPE_SPEED = 60;
const NAME_SPEED = 120;
const SYNC_GAP = 40;

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
  const nameDelay = GREETING_DELAY + greeting.length * TYPE_SPEED + SYNC_GAP;

  return (
    <div>
      <section className="grid max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="leading-tight"
          >
            <span className="font-mono text-[13px] font-normal tracking-[0.3em] text-zinc-500 uppercase">
              <TypedText
                key={greeting}
                text={`${greeting},`}
                delay={GREETING_DELAY}
                speed={TYPE_SPEED}
              />
            </span>{' '}
            <TypedText
              key={greeting}
              text="Sir."
              delay={nameDelay}
              speed={NAME_SPEED}
              className="font-serif text-2xl font-medium text-white sm:text-3xl"
            />
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
