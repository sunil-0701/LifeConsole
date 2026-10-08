import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ListChecks,
  NotebookPen,
  Plus,
  Repeat,
  StickyNote,
  Target,
  Wallet,
} from 'lucide-react';
import TypedText from '../components/ui/TypedText';

const BOUNDARY_HOURS = [12, 17];

// Typewriter timing for the hero: one continuous typing pass across the
// whole line. "Sir." starts the instant the greeting's final character
// lands, +40ms only so the comma always renders first.
const GREETING_DELAY = 220;
const TYPE_SPEED = 60;
const NAME_SPEED = 120;
const SYNC_GAP = 40;

const QUICK_ACTIONS = [
  { to: '/tasks', label: 'New task', icon: Plus },
  { to: '/journal', label: 'Write entry', icon: NotebookPen },
  { to: '/sticky-notes', label: 'New note', icon: StickyNote },
];

const AREAS = [
  { to: '/tasks', label: 'Tasks', icon: ListChecks, blurb: 'Plan and time-block your day.' },
  { to: '/journal', label: 'Journal', icon: NotebookPen, blurb: 'Reflect while it is fresh.' },
  { to: '/goals', label: 'Goals', icon: Target, blurb: 'The outcomes you steer toward.' },
  { to: '/habits', label: 'Habits', icon: Repeat, blurb: 'Small actions, repeated daily.' },
  { to: '/finance', label: 'Finance', icon: Wallet, blurb: 'Money in, money out.' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, blurb: 'How the last weeks went.' },
];

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
  const navigate = useNavigate();
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

      {/* Quick actions: the three things worth one click from anywhere. */}
      <section className="mt-14 border-t border-white/[0.06] pt-6 sm:mt-20">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.to}
              type="button"
              onClick={() => navigate(action.to)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm text-zinc-300 transition-colors duration-150 hover:bg-white/[0.08] hover:text-white"
            >
              <action.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {action.label}
            </button>
          ))}
        </div>
      </section>

      {/* Area overview: one card per section, each deep-linking to it. */}
      <section className="mt-10">
        <h2 className="font-mono text-xs tracking-[0.25em] text-zinc-600 uppercase">Areas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => (
            <button
              key={area.to}
              type="button"
              onClick={() => navigate(area.to)}
              className="group flex flex-col items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors duration-150 hover:border-white/[0.1] hover:bg-white/[0.05]"
            >
              <area.icon
                className="h-[18px] w-[18px] text-zinc-500 transition-colors duration-150 group-hover:text-zinc-300"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                {area.label}
              </span>
              <span className="text-xs leading-relaxed text-zinc-600">{area.blurb}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
