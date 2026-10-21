import { useRef, useState } from 'react';
import { Plus, StickyNote } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import NoteCard from '../components/ui/NoteCard';
import { createNote, editNote, findNotes, removeNote, toggleNotePin } from '../lib/notes';
import { useNotes } from '../lib/useNotes';

function StickyNotes() {
  const [notes, setNotes] = useNotes();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const composerRef = useRef(null);
  const visible = findNotes(notes, query, pinnedOnly);

  const addNote = (event) => {
    event.preventDefault();
    const note = createNote(draft);
    if (!note) return;
    setNotes((current) => [note, ...current]);
    setDraft('');
    setQuery('');
    setPinnedOnly(false);
    setStatus('Note added.');
    composerRef.current?.focus();
  };

  const deleteNote = (id) => {
    setNotes((current) => removeNote(current, id));
    setStatus('Note deleted.');
    composerRef.current?.focus();
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
          aria-keyshortcuts="Control+Enter Meta+Enter"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (!event.repeat) event.currentTarget.form.requestSubmit();
            }
          }}
          placeholder="Capture a quick thought…"
          rows={3}
          maxLength={5000}
          aria-describedby="note-storage-hint"
          className="glass-control block w-full resize-y rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="note-storage-hint" className="text-xs text-zinc-500">Saved locally. Ctrl/⌘+Enter adds a note.</p>
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
          <div className="mt-8 flex max-w-xl flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search notes"
              placeholder="Search your notes…"
              className="glass-control h-10 min-w-0 flex-1 rounded-lg px-3 text-sm text-zinc-100 placeholder:text-zinc-500"
            />
            <button
              type="button"
              aria-pressed={pinnedOnly}
              onClick={() => setPinnedOnly((current) => !current)}
              className={`glass-control min-h-10 rounded-lg px-3 text-xs ${pinnedOnly ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-400'}`}
            >Pinned only</button>
          </div>
          <p role="status" className="mt-3 font-mono text-xs text-zinc-500">{visible.length} of {notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          {visible.length === 0 ? (
            <div className="glass-panel mt-3 max-w-xl rounded-xl p-5">
              <p className="text-sm text-zinc-500">No notes match these filters.</p>
              <button type="button" onClick={() => { setQuery(''); setPinnedOnly(false); }} className="glass-control mt-3 min-h-9 rounded-lg px-3 text-xs text-zinc-300">Clear filters</button>
            </div>
          ) : (
          <ul className="mt-3 grid max-w-5xl items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onRemove={() => deleteNote(note.id)}
                onPin={() => {
                  setNotes((current) => toggleNotePin(current, note.id));
                  setStatus(note.pinned ? 'Note unpinned.' : 'Note pinned.');
                }}
                onEdit={(text) => {
                  setNotes((current) => editNote(current, note.id, text));
                  setStatus('Note updated.');
                }}
              />
            ))}
          </ul>
          )}
        </>
      )}
    </div>
  );
}

export default StickyNotes;
