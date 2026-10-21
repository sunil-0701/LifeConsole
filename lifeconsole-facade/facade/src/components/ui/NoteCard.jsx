import { useRef, useState } from 'react';
import { Pencil, Pin, Trash2 } from 'lucide-react';

function NoteCard({ note, onRemove, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const editButtonRef = useRef(null);

  const finishEditing = () => {
    setEditing(false);
    editButtonRef.current?.focus();
  };

  const save = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onEdit(draft);
    finishEditing();
  };

  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      {note.pinned ? <p className="mb-3 font-mono text-[10px] tracking-wider text-[rgb(var(--accent-rgb))] uppercase">Pinned</p> : null}
      {editing ? (
        <form onSubmit={save} onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            finishEditing();
          }
        }}>
          <textarea
            autoFocus
            aria-label="Edit note"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
                event.preventDefault();
                if (!event.repeat) event.currentTarget.form.requestSubmit();
              }
            }}
            maxLength={5000}
            rows={5}
            className="glass-control block w-full resize-y rounded-lg px-3 py-2 text-sm text-zinc-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="submit" disabled={!draft.trim()} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-200 disabled:opacity-40">Save</button>
            <button type="button" onClick={finishEditing} className="glass-control min-h-9 rounded-lg px-3 text-xs text-zinc-400">Cancel</button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300 [overflow-wrap:anywhere]">
          {note.text}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <time dateTime={new Date(note.updatedAt).toISOString()} className="text-xs text-zinc-500">
          {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </time>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onPin}
            aria-pressed={note.pinned}
            aria-label={`Pin note: ${note.text.slice(0, 60)}`}
            className={`glass-control grid h-9 w-9 place-items-center rounded-lg ${note.pinned ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-500 hover:text-zinc-200'}`}
          >
            <Pin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            ref={editButtonRef}
            type="button"
            aria-label={`Edit note: ${note.text.slice(0, 60)}`}
            aria-expanded={editing}
            onClick={() => {
              if (editing) finishEditing();
              else {
                setDraft(note.text);
                setEditing(true);
              }
            }}
            className="glass-control grid h-9 w-9 place-items-center rounded-lg text-zinc-500 hover:text-zinc-200"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete note: ${note.text.slice(0, 60)}`}
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default NoteCard;
