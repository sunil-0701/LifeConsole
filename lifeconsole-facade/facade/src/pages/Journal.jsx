import { NotebookPen } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Journal() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Journal</h1>
      <EmptyState
        icon={NotebookPen}
        title="No journal entries yet."
        hint="Your first entry can start here."
      />
    </div>
  );
}

export default Journal;
