import { useRef, useState } from 'react';
import { Plus, StickyNote } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import NoteCard from '../components/ui/NoteCard';
import { createNote, removeNote } from '../lib/notes';
import { useNotes } from '../lib/useNotes';

function StickyNotes() {
  const [notes, setNotes] = useNotes();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const composerRef = useRef(null);

  const addNote = (event) => {
    event.preventDefault();
    const note = createNote(draft);
    if (!note) return;
    setNotes((current) => [note, ...current]);
    setDraft('');
    setStatus('Note added.');
    composerRef.current?.focus();
  };

  const deleteNote = (id) => {
    setNotes((current) => removeNote(current, id));
    setStatus('Note deleted.');
  };

  return (
    <div>
      <PageHeader title="Sticky Notes" hint="Scraps and reminders that do not need a full page." />
      <form onSubmit={addNote} className="max-w-xl">
        <label htmlFor="new-note" className="mb-2 block text-sm text-zinc-400">New note</label>
        <textarea
          id="new-note"
          ref={composerRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Capture a quick thought…"
          rows={3}
          maxLength={5000}
          aria-describedby="note-storage-hint"
          className="glass-control block w-full resize-y rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="note-storage-hint" className="text-xs text-zinc-500">Saved locally on this device.</p>
          <button type="submit" disabled={!draft.trim()} className="glass-control inline-flex min-h-10 items-center gap-2 rounded-lg px-3.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add note
          </button>
        </div>
      </form>
      <p role="status" className="sr-only">{status}</p>

      {notes.length === 0 ? (
        <EmptyState icon={StickyNote} title="No notes yet." hint="Add a quick thought above — line breaks are welcome." />
      ) : (
        <>
          <p className="mt-8 font-mono text-xs text-zinc-500">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          <ul className="mt-3 grid max-w-5xl items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => <NoteCard key={note.id} note={note} onRemove={() => deleteNote(note.id)} />)}
          </ul>
        </>
      )}
    </div>
  );
}

export default StickyNotes;
