import { habitWeek } from '../../lib/habits';

function HabitHistory({ habit, today, onCheckIn }) {
  return (
    <div className="mt-5">
      <p className="text-xs text-zinc-500">Last 7 days · select a day to correct it</p>
      <div role="group" aria-label={`Last 7 days for ${habit.name}`} className="mt-2 grid grid-cols-7 gap-1">
        {habitWeek(habit, today).map(({ day, completed, available }) => (
          <button
            key={day}
            type="button"
            aria-label={`${habit.name}, ${day}`}
            aria-pressed={completed}
            aria-current={day === today ? 'date' : undefined}
            title={available ? `${day}: ${completed ? 'done' : 'not done'}` : `${day}: not editable`}
            disabled={!available}
            onClick={() => onCheckIn(day)}
            className={`glass-control flex min-h-11 min-w-0 flex-col items-center justify-center rounded-md text-[10px] disabled:cursor-not-allowed disabled:opacity-35 ${completed ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-500 enabled:hover:text-zinc-200'}`}
          >
            <span>{new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
            <span className="font-mono tabular-nums">{Number(day.slice(-2))}</span>
            <span aria-hidden="true">{completed ? '●' : '·'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HabitHistory;
