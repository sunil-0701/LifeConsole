import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import TaskRow from '../components/ui/TaskRow';
import { TASKS_KEY, countOpen, toggleTask } from '../lib/tasks';
import { sortNotes } from '../lib/notes';
import { useNotes } from '../lib/useNotes';
import { useStoredState } from '../lib/useStoredState';

const BOUNDARY_HOURS = [12, 17];

const NO_TASKS = [];

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
  const [tasks, setTasks] = useStoredState(TASKS_KEY, NO_TASKS);
  const [notes] = useNotes();
  const nameDelay = GREETING_DELAY + greeting.length * TYPE_SPEED + SYNC_GAP;

  const open = countOpen(tasks);
  const focus = tasks.filter((task) => !task.done).slice(0, 3);
  const reminders = sortNotes(notes).slice(0, 3);

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
          className="max-w-xs border-l border-white/[0.1] pl-5 font-mono text-[13px] leading-relaxed text-zinc-400 lg:mt-2"
        >
          <p>
            &ldquo;Discipline is choosing what you want most over what you want
            now.&rdquo;
          </p>
          <footer className="mt-3 text-zinc-600">&mdash; James Clear</footer>
        </motion.blockquote>
      </section>

      <section className="mt-14 border-t border-white/[0.06] pt-6 sm:mt-20">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.to}
              type="button"
              onClick={() => navigate(action.to)}
              className="glass-control inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm text-zinc-300 hover:text-white"
            >
              <action.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex max-w-xl flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">
            Today&rsquo;s focus
          </h2>
          <Link
            to="/tasks"
            className="whitespace-nowrap text-xs tabular-nums text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
          >
            {open > 0 ? `All ${open} open tasks` : 'Open tasks'}
          </Link>
        </div>

        {focus.length > 0 ? (
          <ul className="glass-panel mt-3 max-w-xl divide-y divide-white/[0.05] rounded-xl px-5 py-2">
            {focus.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => setTasks((current) => toggleTask(current, task.id))}
              />
            ))}
          </ul>
        ) : (
          <p className="glass-panel mt-3 max-w-xl rounded-xl p-5 text-sm text-zinc-500">
            {tasks.length > 0
              ? 'Everything on the list is done. Add the next thing above.'
              : 'Nothing open — add a task and it shows up here.'}
          </p>
        )}
      </section>

      <section className="mt-10">
        <div className="flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">Notes at a glance</h2>
          <Link to="/sticky-notes" className="text-xs text-zinc-500 hover:text-zinc-300">
            {notes.length ? `All ${notes.length} notes` : 'Add a note'}
          </Link>
        </div>
        {reminders.length ? (
          <ul className="mt-3 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reminders.map((note) => (
              <li key={note.id} className="min-w-0">
                <Link to="/sticky-notes" className="glass-panel glass-interactive block h-full rounded-xl p-5">
                  <span className="mb-2 block font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                    {note.pinned ? 'Pinned reminder' : 'Recent note'}
                  </span>
                  <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300 [overflow-wrap:anywhere]">{note.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="glass-panel mt-3 max-w-xl rounded-xl p-5 text-sm text-zinc-500">
            Capture a thought with New note above. Pinned reminders will appear here first.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">Areas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => (
            <button
              key={area.to}
              type="button"
              onClick={() => navigate(area.to)}
              className="glass-panel glass-interactive group flex flex-col items-start gap-2 rounded-xl p-5 text-left"
            >
              <area.icon
                className="mb-1 h-[18px] w-[18px] text-zinc-400 transition-colors duration-150 group-hover:text-[rgb(var(--accent-rgb))]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white">
                {area.label}
              </span>
              <span className="text-xs leading-relaxed text-zinc-500">{area.blurb}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
