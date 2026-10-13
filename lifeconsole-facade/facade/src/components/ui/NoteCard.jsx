import { Trash2 } from 'lucide-react';

function NoteCard({ note, onRemove }) {
  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300 [overflow-wrap:anywhere]">
        {note.text}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <time dateTime={new Date(note.updatedAt).toISOString()} className="text-xs text-zinc-500">
          {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </time>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete note: ${note.text.slice(0, 60)}`}
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export default NoteCard;
