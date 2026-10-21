import { useRef, useState } from 'react';
import { Plus, Repeat } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import HabitCard from '../components/ui/HabitCard';
import PageHeader from '../components/ui/PageHeader';
import { createHabit, findHabits, HABIT_NAME_LIMIT, removeHabit, renameHabit, toggleHabitArchive, toggleHabitDay } from '../lib/habits';
import { useHabits } from '../lib/useHabits';
import { useToday } from '../lib/useToday';

function Habits() {
  const [habits, setHabits] = useHabits();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState('active');
  const [query, setQuery] = useState('');
  const composerRef = useRef(null);
  const today = useToday();
  const activeCount = habits.filter((habit) => !habit.archived).length;
  const visible = findHabits(habits, query, view === 'archived');

  const addHabit = (event) => {
    event.preventDefault();
    const habit = createHabit(draft, today);
    if (!habit) return;
    setHabits((current) => [...current, habit]);
    setDraft('');
    setView('active');
    setQuery('');
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

      {habits.length > 0 ? (
        <div role="group" aria-label="Filter habits" className="glass-panel mt-8 inline-flex flex-wrap gap-1 rounded-lg p-1">
          {['active', 'archived'].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={`min-h-9 rounded-md px-3 text-xs ${view === option ? 'bg-white/[0.06] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {option === 'active' ? `Active (${activeCount})` : `Archived (${habits.length - activeCount})`}
            </button>
          ))}
        </div>
      ) : null}

      {habits.length > 0 ? (
        <div className="mt-4 max-w-xl">
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            aria-label="Search habits" placeholder="Search habit names…"
            className="glass-control h-10 w-full rounded-lg px-3 text-sm text-zinc-100 placeholder:text-zinc-500" />
          <p role="status" className="mt-2 text-xs text-zinc-500">{visible.length} {view} habits shown</p>
          {query.trim() ? <button type="button" onClick={() => setQuery('')} className="glass-control mt-2 min-h-9 rounded-lg px-3 text-xs text-zinc-300">Clear search</button> : null}
        </div>
      ) : null}

      {habits.length === 0 ? (
        <EmptyState icon={Repeat} title="No habits tracked yet." hint="Define a daily habit above to start tracking your progress." />
      ) : visible.length === 0 ? (
        <p className="glass-panel mt-4 max-w-xl rounded-xl p-5 text-sm text-zinc-500">
          {query.trim() ? 'No habit names match this search in the selected view. Clear the search or switch views.' : view === 'active' ? 'No active habits. Add one above or restore a habit from Archived.' : 'No archived habits. Archive an active habit to preserve its history without tracking it daily.'}
        </p>
      ) : (
        <ul className="mt-4 grid max-w-5xl items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onRename={(name) => {
                setHabits((current) => renameHabit(current, habit.id, name));
                setStatus('Habit renamed. History preserved.');
              }}
              onRemove={() => deleteHabit(habit)}
              onArchive={() => {
                setHabits((current) => toggleHabitArchive(current, habit.id));
                setStatus(habit.archived ? 'Habit restored.' : 'Habit archived. History preserved.');
                composerRef.current?.focus();
              }}
              onCheckIn={(day) => {
                setHabits((current) => toggleHabitDay(current, habit.id, day, today));
                setStatus(`${day}: check-in ${habit.completedDays.includes(day) ? 'undone' : 'saved'}.`);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Habits;
