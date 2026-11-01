import { useId, useState } from 'react';
import { JOURNAL_TEXT_LIMIT, JOURNAL_TITLE_LIMIT } from '../../lib/journal';

function JournalEntryForm({ today, onSave, titleRef }) {
  const id = useId();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [day, setDay] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    if (!onSave({ title, text, day: day ?? today })) return;
    setTitle('');
    setText('');
    setDay(null);
    titleRef.current?.focus();
  };

  return (
    <form onSubmit={submit} onKeyDown={(event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
        event.preventDefault();
        if (!event.repeat) event.currentTarget.requestSubmit();
      }
    }} className="space-y-3">
      <div>
        <label htmlFor={`${id}-title`} className="mb-2 block text-sm text-zinc-400">Title</label>
        <input id={`${id}-title`} ref={titleRef} value={title} required maxLength={JOURNAL_TITLE_LIMIT}
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
        <p id={`${id}-hint`} className="text-xs text-zinc-500">Browser-local only. Ctrl/⌘+Enter adds your entry.</p>
        <button type="submit" disabled={!title.trim() || !text.trim()}
          className="glass-control min-h-10 rounded-lg px-3.5 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40">Add entry</button>
      </div>
    </form>
  );
}

export default JournalEntryForm;
