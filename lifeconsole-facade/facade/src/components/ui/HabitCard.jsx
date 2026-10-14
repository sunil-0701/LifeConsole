import { Check, Trash2 } from 'lucide-react';

function HabitCard({ habit, today, onRemove, onCheckIn }) {
  const completed = habit.completedDays.includes(today);
  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-base font-medium text-zinc-300 [overflow-wrap:anywhere]">{habit.name}</h2>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete habit: ${habit.name}`}
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-500">Daily · Started <time dateTime={habit.createdOn}>{habit.createdOn}</time></p>
      <button
        type="button"
        aria-pressed={completed}
        aria-label={`${completed ? 'Undo today for' : 'Complete today for'} ${habit.name}`}
        onClick={onCheckIn}
        disabled={habit.archived || today < habit.createdOn}
        className={`glass-control mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${completed ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-400 hover:text-zinc-200'}`}
      >
        <Check className="h-4 w-4" aria-hidden="true" />
        {completed ? 'Done today' : 'Complete today'}
      </button>
    </li>
  );
}

export default HabitCard;
