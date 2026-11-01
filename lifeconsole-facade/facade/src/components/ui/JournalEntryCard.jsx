import { formatJournalDay } from '../../lib/journal';

function JournalEntryCard({ entry }) {
  return (
    <li className="glass-panel min-w-0 rounded-xl p-5">
      <time dateTime={entry.day} className="font-mono text-xs text-zinc-500">{formatJournalDay(entry.day)}</time>
      <h3 className="mt-2 break-words text-base font-medium text-zinc-200 [overflow-wrap:anywhere]">{entry.title}</h3>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300 [overflow-wrap:anywhere]">{entry.text}</p>
    </li>
  );
}

export default JournalEntryCard;
