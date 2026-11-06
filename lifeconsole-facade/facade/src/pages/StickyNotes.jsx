import { useRef, useState } from 'react';
import { Pin, Plus, Search, StickyNote } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import NoteCard from '../components/ui/NoteCard';
import { createNote, editNote, findNotes, removeNote, toggleNotePin } from '../lib/notes';
import { useNotes } from '../lib/useNotes';

const NOTE_TEXT_LIMIT = 5000;

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
      <form onSubmit={addNote} className="glass-panel max-w-xl rounded-2xl p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="new-note" className="text-sm font-medium text-zinc-200">New note</label>
          <span id="note-character-count" className="font-mono text-[10px] tabular-nums text-zinc-400">{draft.length.toLocaleString()} / {NOTE_TEXT_LIMIT.toLocaleString()} characters</span>
        </div>
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
          rows={4}
          maxLength={NOTE_TEXT_LIMIT}
          aria-describedby="note-storage-hint note-character-count"
          className="glass-control block w-full resize-y rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="note-storage-hint" className="max-w-xs text-xs leading-relaxed text-zinc-400">Stored in this browser only. Line breaks are welcome; Ctrl/⌘+Enter adds your note.</p>
          <button type="submit" disabled={!draft.trim()} className="glass-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">
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
            <div className="relative min-w-0 flex-1 basis-48">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search notes"
                placeholder="Search your notes…"
                className="glass-control h-11 w-full rounded-xl pr-3 pl-10 text-sm text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <button
              type="button"
              aria-pressed={pinnedOnly}
              onClick={() => setPinnedOnly((current) => !current)}
              style={pinnedOnly ? { borderColor: 'rgb(var(--accent-rgb) / 0.35)' } : undefined}
              className={`glass-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs ${pinnedOnly ? 'bg-[rgb(var(--accent-rgb)/0.1)] text-[rgb(var(--accent-rgb))]' : 'text-zinc-400 hover:text-zinc-200'}`}
            ><Pin className="h-3.5 w-3.5" aria-hidden="true" /> Pinned only</button>
          </div>
          <p role="status" className="mt-3 font-mono text-xs text-zinc-400">{visible.length} of {notes.length} {notes.length === 1 ? 'note' : 'notes'}{pinnedOnly ? ' · pinned only' : ''}</p>
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
