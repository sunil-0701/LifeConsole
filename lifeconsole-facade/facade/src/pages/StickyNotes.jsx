import { StickyNote } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function StickyNotes() {
  return (
    <div>
      <PageHeader title="Sticky Notes" hint="Scraps and reminders that do not need a full page." />
      <EmptyState
        icon={StickyNote}
        title="No notes yet."
        hint="Quick thoughts and reminders can live here."
      />
    </div>
  );
}

export default StickyNotes;
