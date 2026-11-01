import { useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { formatJournalDay } from '../../lib/journal';
import JournalEntryForm from './JournalEntryForm';

function JournalEntryCard({ entry, today, onEdit }) {
  const [editing, setEditing] = useState(false);
  const editRef = useRef(null);
  const closeEditor = () => { setEditing(false); editRef.current?.focus(); };

  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <time dateTime={entry.day} className="font-mono text-xs text-zinc-500">{formatJournalDay(entry.day)}</time>
          <h3 className="mt-2 break-words text-base font-medium text-zinc-200 [overflow-wrap:anywhere]">{entry.title}</h3>
        </div>
        <button ref={editRef} type="button" aria-label={`Edit entry: ${entry.title}`} aria-expanded={editing}
          onClick={() => { if (editing) closeEditor(); else setEditing(true); }}
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-zinc-200">
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {editing ? (
        <div className="mt-4">
          <JournalEntryForm entry={entry} today={today} onCancel={closeEditor} onSave={(draft) => {
            if (!onEdit(draft)) return false;
            closeEditor();
            return true;
          }} />
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300 [overflow-wrap:anywhere]">{entry.text}</p>
      )}
      {entry.updatedAt !== entry.createdAt ? (
        <p className="mt-3 text-xs text-zinc-500">Edited <time dateTime={new Date(entry.updatedAt).toISOString()}>{new Date(entry.updatedAt).toLocaleString()}</time></p>
      ) : null}
    </li>
  );
}

export default JournalEntryCard;
