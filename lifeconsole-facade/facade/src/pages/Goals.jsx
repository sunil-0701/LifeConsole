import { Target } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Goals() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Goals</h1>
      <EmptyState
        icon={Target}
        title="No goals set yet."
        hint="Define what you are working toward, then track it here."
      />
    </div>
  );
}

export default Goals;
