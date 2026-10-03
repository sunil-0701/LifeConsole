import { StickyNote } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function StickyNotes() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Sticky Notes</h1>
      <EmptyState
        icon={StickyNote}
        title="No notes yet."
        hint="Quick thoughts and reminders can live here."
      />
    </div>
  );
}

export default StickyNotes;
