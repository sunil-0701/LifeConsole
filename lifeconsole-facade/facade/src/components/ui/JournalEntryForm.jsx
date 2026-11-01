import { useId, useRef, useState } from 'react';
import { JOURNAL_TEXT_LIMIT, JOURNAL_TITLE_LIMIT } from '../../lib/journal';

function JournalEntryForm({ entry, today, onSave, onCancel, titleRef }) {
  const id = useId();
  const ownTitleRef = useRef(null);
  const inputRef = titleRef ?? ownTitleRef;
  const [title, setTitle] = useState(entry?.title ?? '');
  const [text, setText] = useState(entry?.text ?? '');
  const [day, setDay] = useState(entry?.day ?? null);

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !text.trim()) return;
    if (!onSave({ title, text, day: day ?? today })) return;
    if (entry) return;
    setTitle('');
    setText('');
    setDay(null);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={submit} onKeyDown={(event) => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === 'Escape' && onCancel) {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (!event.repeat) event.currentTarget.requestSubmit();
      }
    }} className="space-y-3">
      <div>
        <label htmlFor={`${id}-title`} className="mb-2 block text-sm text-zinc-400">Title</label>
        <input id={`${id}-title`} ref={inputRef} autoFocus={Boolean(entry)} value={title} required maxLength={JOURNAL_TITLE_LIMIT}
          onChange={(event) => setTitle(event.target.value)} placeholder="Give this moment a name…"
          className="glass-control h-11 w-full rounded-lg px-3 text-sm text-zinc-100 placeholder:text-zinc-500" />
      </div>
      <div>
        <label htmlFor={`${id}-day`} className="mb-2 block text-sm text-zinc-400">Entry date</label>
        <input id={`${id}-day`} type="date" value={day ?? today} required max={today}
          onChange={(event) => setDay(event.target.value)}
          className="glass-control h-11 max-w-full rounded-lg px-3 text-sm text-zinc-100 [color-scheme:dark]" />
      </div>
      <div>
        <label htmlFor={`${id}-text`} className="mb-2 block text-sm text-zinc-400">Your entry</label>
        <textarea id={`${id}-text`} value={text} required maxLength={JOURNAL_TEXT_LIMIT} rows={6}
          onChange={(event) => setText(event.target.value)} placeholder="What is on your mind?"
          aria-keyshortcuts="Control+Enter Meta+Enter" aria-describedby={`${id}-hint`}
          className="glass-control block w-full resize-y rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={`${id}-hint`} className="text-xs text-zinc-500">Browser-local only. Ctrl/⌘+Enter {entry ? 'saves changes' : 'adds your entry'}.</p>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={!title.trim() || !text.trim()}
            className="glass-control min-h-10 rounded-lg px-3.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">{entry ? 'Save changes' : 'Add entry'}</button>
          {onCancel ? <button type="button" onClick={onCancel} className="glass-control min-h-10 rounded-lg px-3 text-sm text-zinc-400">Cancel</button> : null}
        </div>
      </div>
    </form>
  );
}

export default JournalEntryForm;
