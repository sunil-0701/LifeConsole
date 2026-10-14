import { Trash2 } from 'lucide-react';

function HabitCard({ habit, onRemove }) {
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
    </li>
  );
}

export default HabitCard;
