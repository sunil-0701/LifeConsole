import { NotebookPen } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Journal() {
  return (
    <div>
      <PageHeader title="Journal" hint="A running record of your days." />
      <EmptyState
        icon={NotebookPen}
        title="No journal entries yet."
        hint="Your first entry can start here."
      />
    </div>
  );
}

export default Journal;
