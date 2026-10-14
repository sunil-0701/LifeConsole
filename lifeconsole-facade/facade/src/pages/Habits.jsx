import { useRef, useState } from 'react';
import { Plus, Repeat } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import HabitCard from '../components/ui/HabitCard';
import PageHeader from '../components/ui/PageHeader';
import { createHabit, HABIT_NAME_LIMIT, removeHabit, toggleHabitDay } from '../lib/habits';
import { useHabits } from '../lib/useHabits';
import { useToday } from '../lib/useToday';

function Habits() {
  const [habits, setHabits] = useHabits();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const composerRef = useRef(null);
  const today = useToday();

  const addHabit = (event) => {
    event.preventDefault();
    const habit = createHabit(draft, today);
    if (!habit) return;
    setHabits((current) => [...current, habit]);
    setDraft('');
    setStatus('Habit added.');
    composerRef.current?.focus();
  };

  const deleteHabit = (habit) => {
    if (!window.confirm(`Delete “${habit.name}” and all its check-ins? This cannot be undone.`)) return;
    setHabits((current) => removeHabit(current, habit.id));
    setStatus('Habit deleted.');
    composerRef.current?.focus();
  };

  return (
    <div>
      <PageHeader title="Habits" hint="Small actions, repeated until they stick." />
      <form onSubmit={addHabit} className="max-w-xl">
        <label htmlFor="new-habit" className="mb-2 block text-sm text-zinc-400">New daily habit</label>
        <div className="flex gap-2">
          <input
            id="new-habit"
            ref={composerRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={HABIT_NAME_LIMIT}
            placeholder="Read for ten minutes…"
            aria-describedby="habit-storage-hint"
            className="glass-control h-10 min-w-0 flex-1 rounded-lg px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
          <button type="submit" disabled={!draft.trim()} className="glass-control inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add
          </button>
        </div>
        <p id="habit-storage-hint" className="mt-2 text-xs text-zinc-500">Daily habits, saved on this device. Today: <time dateTime={today}>{today}</time>.</p>
      </form>
      <p role="status" className="sr-only">{status}</p>

      {habits.length === 0 ? (
        <EmptyState icon={Repeat} title="No habits tracked yet." hint="Define a daily habit above to start tracking your progress." />
      ) : (
        <ul className="mt-8 grid max-w-5xl items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onRemove={() => deleteHabit(habit)}
              onCheckIn={() => {
                setHabits((current) => toggleHabitDay(current, habit.id, today, today));
                setStatus(habit.completedDays.includes(today) ? 'Today’s check-in undone.' : 'Today’s check-in saved.');
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Habits;
