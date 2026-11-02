import { useRef, useState } from 'react';
import { Archive, ArchiveRestore, Check, Circle, Pencil, Trash2 } from 'lucide-react';
import { HABIT_NAME_LIMIT, habitStats } from '../../lib/habits';
import HabitHistory from './HabitHistory';

function HabitCard({ habit, today, onRemove, onCheckIn, onArchive, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const editRef = useRef(null);
  const closeEditor = () => { setEditing(false); editRef.current?.focus(); };
  const completed = habit.completedDays.includes(today);
  const stats = habitStats(habit, today);
  return (
    <li className="glass-panel min-w-0 rounded-xl p-5" style={!habit.archived && completed ? { borderColor: 'rgb(var(--accent-rgb) / 0.3)' } : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="min-w-0 break-words text-base font-medium text-zinc-300 [overflow-wrap:anywhere]">{habit.name}</h2>
        <div className="flex shrink-0 gap-2">
          <button ref={editRef} type="button" aria-label={`Rename habit: ${habit.name}`} aria-expanded={editing}
            onClick={() => { if (editing) closeEditor(); else { setDraft(habit.name); setEditing(true); } }}
            title="Rename habit"
            className="glass-control grid h-10 w-10 place-items-center rounded-lg text-zinc-400 hover:text-zinc-200">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onArchive}
            aria-label={`${habit.archived ? 'Restore' : 'Archive'} habit: ${habit.name}`}
            title={habit.archived ? 'Restore habit' : 'Archive habit'}
            className="glass-control grid h-10 w-10 place-items-center rounded-lg text-zinc-400 hover:text-zinc-200"
          >
            {habit.archived ? <ArchiveRestore className="h-4 w-4" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete habit: ${habit.name}`}
            title="Delete habit"
            className="glass-control grid h-10 w-10 place-items-center rounded-lg text-zinc-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      {editing ? (
        <form className="mt-3" onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          onRename(draft);
          closeEditor();
        }}>
          <input autoFocus aria-label="Habit name" value={draft} maxLength={HABIT_NAME_LIMIT}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeEditor(); } }}
            className="glass-control h-10 w-full rounded-lg px-3 text-sm text-zinc-100" />
          <div className="mt-2 flex gap-2">
            <button type="submit" disabled={!draft.trim()} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-300 disabled:opacity-40">Save name</button>
            <button type="button" onClick={closeEditor} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-400">Cancel</button>
          </div>
        </form>
      ) : null}
      {habit.archived ? (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
          <Archive className="h-3 w-3" aria-hidden="true" /> Archived · history preserved
        </p>
      ) : null}
      <p className="mt-3 text-xs text-zinc-500">Daily · Started <time dateTime={habit.createdOn}>{habit.createdOn}</time></p>
      <button
        type="button"
        aria-pressed={completed}
        aria-label={`${completed ? 'Undo today for' : 'Complete today for'} ${habit.name}`}
        onClick={() => onCheckIn(today)}
        disabled={habit.archived || today < habit.createdOn}
        className={`glass-control mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${completed ? 'bg-[rgb(var(--accent-rgb)/0.1)] text-[rgb(var(--accent-rgb))]' : 'text-zinc-400 hover:text-zinc-200'}`}
      >
        {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : <Circle className="h-4 w-4" aria-hidden="true" />}
        {completed ? 'Done today' : 'Complete today'}
      </button>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-white/[0.03] p-2.5"><dt className="text-[10px] text-zinc-400">Current streak</dt><dd className="mt-2 font-mono tabular-nums text-zinc-200">{stats.current} <span className="text-[10px] text-zinc-500">days</span></dd></div>
        <div className="rounded-xl bg-white/[0.03] p-2.5"><dt className="text-[10px] text-zinc-400">Best streak</dt><dd className="mt-2 font-mono tabular-nums text-zinc-200">{stats.best} <span className="text-[10px] text-zinc-500">days</span></dd></div>
        <div className="rounded-xl bg-white/[0.03] p-2.5"><dt className="text-[10px] text-zinc-400">Check-ins</dt><dd className="mt-2 font-mono tabular-nums text-zinc-200">{stats.total}</dd></div>
      </dl>
      <HabitHistory habit={habit} today={today} onCheckIn={onCheckIn} />
    </li>
  );
}

export default HabitCard;
