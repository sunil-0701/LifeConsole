import { X } from 'lucide-react';

// One task line: native checkbox tinted by the accent (so "done" and the
// focus ring agree on colour), the label struck through once completed, and
// an optional delete affordance — omit `onRemove` for read-only lists.
// The delete button stays visible rather than hover-revealed: touch devices
// have no hover, and a task you cannot remove is a bug.
function TaskRow({ task, onToggle, onRemove }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        aria-label={`Mark “${task.text}” as ${task.done ? 'not done' : 'done'}`}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-white/20"
        style={{ accentColor: 'rgb(var(--accent-rgb))' }}
      />

      <span
        className={[
          'min-w-0 flex-1 truncate text-sm',
          task.done ? 'text-zinc-600 line-through' : 'text-zinc-300',
        ].join(' ')}
      >
        {task.text}
      </span>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete “${task.text}”`}
          className="grid h-6 w-6 shrink-0 place-items-center rounded text-zinc-600 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-300"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      ) : null}
    </li>
  );
}

export default TaskRow;
