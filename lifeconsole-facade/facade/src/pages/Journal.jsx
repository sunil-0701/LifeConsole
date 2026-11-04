import { useRef, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import JournalEntryCard from '../components/ui/JournalEntryCard';
import JournalEntryForm from '../components/ui/JournalEntryForm';
import { createJournalEntry, editJournalEntry, sortJournal } from '../lib/journal';
import { useJournal } from '../lib/useJournal';
import { useToday } from '../lib/useToday';

function Journal() {
  const [entries, setEntries] = useJournal();
  const [status, setStatus] = useState('');
  const composerRef = useRef(null);
  const today = useToday();
  const ordered = sortJournal(entries);

  const addEntry = ({ title, text, day }) => {
    const entry = createJournalEntry(title, text, day);
    if (!entry) return false;
    setEntries((current) => [entry, ...current]);
    setStatus('Entry added to your journal.');
    return true;
  };

  return (
    <div>
      <PageHeader title="Journal" hint="A running record of your days." />
      <section className="glass-panel max-w-2xl rounded-2xl p-5 sm:p-6" aria-labelledby="new-journal-entry">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="new-journal-entry" className="inline-flex items-center gap-2 text-base font-medium text-zinc-200"><NotebookPen className="h-4 w-4 text-[rgb(var(--accent-rgb))]" aria-hidden="true" /> Write an entry</h2>
          <span className="rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-zinc-400">Local only</span>
        </div>
        <JournalEntryForm today={today} onSave={addEntry} titleRef={composerRef} />
      </section>
      <p role="status" className="sr-only">{status}</p>
      {entries.length === 0 ? (
        <EmptyState icon={NotebookPen} title="No journal entries yet." hint="Start with a reflection above. You can write more than once a day." />
      ) : (
        <section className="mt-8 max-w-2xl" aria-labelledby="journal-entries">
          <div className="flex items-center justify-between gap-3">
            <h2 id="journal-entries" className="font-mono text-xs tracking-wider text-zinc-400 uppercase">Your entries</h2>
            <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-xs tabular-nums text-zinc-400">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          <ul className="mt-3 space-y-3">
            {ordered.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} today={today} onEdit={(draft) => {
                setEntries((current) => editJournalEntry(current, entry.id, draft));
                setStatus('Journal entry updated.');
                return true;
              }} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Journal;
