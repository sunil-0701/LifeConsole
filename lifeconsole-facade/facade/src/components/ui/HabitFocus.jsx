import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { habitProgress, toggleHabitDay } from '../../lib/habits';
import { useHabits } from '../../lib/useHabits';
import { useToday } from '../../lib/useToday';

function HabitFocus() {
  const [habits, setHabits] = useHabits();
  const today = useToday();
  const [status, setStatus] = useState('');
  const { active, done, total } = habitProgress(habits, today);
  const preview = [...active].sort((a, b) =>
    Number(a.completedDays.includes(today)) - Number(b.completedDays.includes(today))).slice(0, 3);

  return (
    <section className="mt-10 max-w-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">Daily habits</h2>
        <Link to="/habits" className="text-xs text-zinc-500 hover:text-zinc-300">{total ? `All ${total} active habits` : 'Build a routine'}</Link>
      </div>
      {total ? (
        <div className="glass-panel mt-3 rounded-xl px-5 py-4">
          <p className="text-xs tabular-nums text-zinc-400">{done} of {total} done today{done === total ? ' — daily routine complete.' : '.'}</p>
          <progress aria-label="Daily habit completion" value={done} max={total} style={{ accentColor: 'rgb(var(--accent-rgb))' }} className="mt-2 h-2 w-full" />
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {preview.map((habit) => {
              const completed = habit.completedDays.includes(today);
              return (
                <li key={habit.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0 break-words text-sm text-zinc-300 [overflow-wrap:anywhere]">{habit.name}</span>
                  <button
                    type="button"
                    aria-pressed={completed}
                    aria-label={`${completed ? 'Undo today for' : 'Complete today for'} ${habit.name}`}
                    onClick={() => {
                      setHabits((current) => toggleHabitDay(current, habit.id, today, today));
                      setStatus(`${habit.name}: ${completed ? 'check-in undone' : 'done today'}.`);
                    }}
                    className={`glass-control grid h-10 w-10 shrink-0 place-items-center rounded-lg ${completed ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-500 hover:text-zinc-200'}`}
                  ><Check className="h-4 w-4" aria-hidden="true" /></button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="glass-panel mt-3 rounded-xl p-5 text-sm text-zinc-500">Create a daily habit to track small wins here.</p>
      )}
      <p role="status" className="sr-only">{status}</p>
    </section>
  );
}

export default HabitFocus;
