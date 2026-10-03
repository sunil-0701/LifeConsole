import { ListChecks } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Tasks() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Tasks</h1>
      <EmptyState
        icon={ListChecks}
        title="No tasks yet."
        hint="Plan your day here — tasks with time blocks will show up in Today's Focus."
      />
    </div>
  );
}

export default Tasks;
