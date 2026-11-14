import { useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function TaskRow({ task, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const editRef = useRef(null);
  const closeEditor = () => {
    setEditing(false);
    editRef.current?.focus();
  };
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-2 py-3">
      <label className={`grid h-10 w-8 place-items-center rounded-lg hover:bg-white/[0.03] ${editing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          type="checkbox"
          checked={task.done}
          disabled={editing}
          onChange={onToggle}
          aria-label={`Mark “${task.text}” as ${task.done ? 'not done' : 'done'}`}
          className="h-5 w-5 cursor-pointer rounded border-white/20 disabled:cursor-not-allowed"
          style={{ accentColor: 'rgb(var(--accent-rgb))' }}
        />
      </label>

      {editing ? (
        <form className="min-w-0" onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          onEdit(draft);
          closeEditor();
        }}>
          <input autoFocus aria-label="Edit task" value={draft} onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeEditor(); } }}
            className="glass-control h-10 w-full rounded-lg px-3 text-sm text-zinc-100" />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="submit" disabled={!draft.trim()} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-300 disabled:opacity-40">Save</button>
            <button type="button" onClick={closeEditor} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-400">Cancel</button>
          </div>
        </form>
      ) : <span
        className={[
          'min-w-0 py-2 text-sm leading-relaxed [overflow-wrap:anywhere]',
          task.done ? 'text-zinc-500 line-through' : 'text-zinc-300',
        ].join(' ')}
      >
        {task.text}
      </span>}

      {onEdit || onRemove ? (
        <div className="flex items-center gap-1">
          {onEdit ? (
            <button ref={editRef} type="button" aria-label={`Edit “${task.text}”`} aria-expanded={editing}
              onClick={() => { if (editing) closeEditor(); else { setDraft(task.text); setEditing(true); } }}
              className="grid h-10 w-10 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200">
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}

          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Delete “${task.text}”`}
              className="grid h-10 w-10 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:bg-red-500/10 focus-visible:text-red-300"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export default TaskRow;
