import { ListChecks } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Tasks() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">Tasks</h1>
      <EmptyState
        icon={ListChecks}
        title="No tasks yet."
        hint="Plan your day here — tasks with time blocks will show up in Today's Focus."
      />
    </div>
  );
}

export default Tasks;
