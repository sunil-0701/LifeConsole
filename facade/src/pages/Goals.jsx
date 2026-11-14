import { Target } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Goals() {
  return (
    <div>
      <PageHeader title="Goals" hint="The outcomes you are steering toward." />
      <EmptyState
        icon={Target}
        title="No goals set yet."
        hint="Define what you are working toward, then track it here."
      />
    </div>
  );
}

export default Goals;
