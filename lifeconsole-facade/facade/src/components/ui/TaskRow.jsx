import { useRef, useState } from 'react';
import { Pencil, X } from 'lucide-react';

function TaskRow({ task, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const editRef = useRef(null);
  const closeEditor = () => {
    setEditing(false);
    editRef.current?.focus();
  };
  return (
    <li className="flex items-start gap-3 py-2.5">
      <input
        type="checkbox"
        checked={task.done}
        disabled={editing}
        onChange={onToggle}
        aria-label={`Mark “${task.text}” as ${task.done ? 'not done' : 'done'}`}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20"
        style={{ accentColor: 'rgb(var(--accent-rgb))' }}
      />

      {editing ? (
        <form className="min-w-0 flex-1" onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          onEdit(draft);
          closeEditor();
        }}>
          <input autoFocus aria-label="Edit task" value={draft} onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeEditor(); } }}
            className="glass-control h-9 w-full rounded-lg px-3 text-sm text-zinc-100" />
          <div className="mt-2 flex gap-2">
            <button type="submit" disabled={!draft.trim()} className="glass-control min-h-8 rounded px-2 text-xs text-zinc-300 disabled:opacity-40">Save</button>
            <button type="button" onClick={closeEditor} className="glass-control min-h-8 rounded px-2 text-xs text-zinc-400">Cancel</button>
          </div>
        </form>
      ) : <span
        className={[
          'min-w-0 flex-1 text-sm leading-relaxed [overflow-wrap:anywhere]',
          task.done ? 'text-zinc-600 line-through' : 'text-zinc-300',
        ].join(' ')}
      >
        {task.text}
      </span>}

      {onEdit ? (
        <button ref={editRef} type="button" aria-label={`Edit “${task.text}”`} aria-expanded={editing}
          onClick={() => { if (editing) closeEditor(); else { setDraft(task.text); setEditing(true); } }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete “${task.text}”`}
          className="-my-1 grid h-8 w-8 shrink-0 place-items-center rounded text-zinc-600 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-300 focus-visible:bg-white/[0.06] focus-visible:text-zinc-300"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      ) : null}
    </li>
  );
}

export default TaskRow;
