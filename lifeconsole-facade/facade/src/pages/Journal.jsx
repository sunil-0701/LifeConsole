import { useRef, useState } from 'react';
import { NotebookPen } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import JournalEntryCard from '../components/ui/JournalEntryCard';
import JournalEntryForm from '../components/ui/JournalEntryForm';
import { createJournalEntry, sortJournal } from '../lib/journal';
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
      <section className="max-w-2xl" aria-labelledby="new-journal-entry">
        <h2 id="new-journal-entry" className="mb-4 text-base font-medium text-zinc-300">Write an entry</h2>
        <JournalEntryForm today={today} onSave={addEntry} titleRef={composerRef} />
      </section>
      <p role="status" className="sr-only">{status}</p>
      {entries.length === 0 ? (
        <EmptyState icon={NotebookPen} title="No journal entries yet." hint="Start with a reflection above. You can write more than once a day." />
      ) : (
        <section className="mt-8 max-w-2xl" aria-labelledby="journal-entries">
          <h2 id="journal-entries" className="font-mono text-xs tracking-wider text-zinc-500 uppercase">Your entries · {entries.length}</h2>
          <ul className="mt-3 space-y-3">
            {ordered.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Journal;
