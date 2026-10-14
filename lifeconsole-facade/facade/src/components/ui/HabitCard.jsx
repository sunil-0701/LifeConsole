import { Archive, ArchiveRestore, Check, Trash2 } from 'lucide-react';
import { habitStats } from '../../lib/habits';
import HabitHistory from './HabitHistory';

function HabitCard({ habit, today, onRemove, onCheckIn, onArchive }) {
  const completed = habit.completedDays.includes(today);
  const stats = habitStats(habit, today);
  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-base font-medium text-zinc-300 [overflow-wrap:anywhere]">{habit.name}</h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onArchive}
            aria-label={`${habit.archived ? 'Restore' : 'Archive'} habit: ${habit.name}`}
            className="glass-control grid h-9 w-9 place-items-center rounded-lg text-zinc-500 hover:text-zinc-200"
          >
            {habit.archived ? <ArchiveRestore className="h-4 w-4" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
          </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete habit: ${habit.name}`}
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
        </div>
      </div>
      {habit.archived ? <p className="mt-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">Archived · history preserved</p> : null}
      <p className="mt-3 text-xs text-zinc-500">Daily · Started <time dateTime={habit.createdOn}>{habit.createdOn}</time></p>
      <button
        type="button"
        aria-pressed={completed}
        aria-label={`${completed ? 'Undo today for' : 'Complete today for'} ${habit.name}`}
        onClick={() => onCheckIn(today)}
        disabled={habit.archived || today < habit.createdOn}
        className={`glass-control mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${completed ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-400 hover:text-zinc-200'}`}
      >
        <Check className="h-4 w-4" aria-hidden="true" />
        {completed ? 'Done today' : 'Complete today'}
      </button>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div><dt className="text-zinc-500">Current streak</dt><dd className="mt-1 font-mono tabular-nums text-zinc-300">{stats.current} days</dd></div>
        <div><dt className="text-zinc-500">Best streak</dt><dd className="mt-1 font-mono tabular-nums text-zinc-300">{stats.best} days</dd></div>
        <div><dt className="text-zinc-500">Check-ins</dt><dd className="mt-1 font-mono tabular-nums text-zinc-300">{stats.total}</dd></div>
      </dl>
      <HabitHistory habit={habit} today={today} onCheckIn={onCheckIn} />
    </li>
  );
}

export default HabitCard;
