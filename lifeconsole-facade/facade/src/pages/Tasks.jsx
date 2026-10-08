import { ListChecks } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Tasks() {
  return (
    <div>
      <PageHeader title="Tasks" hint="Everything you plan to do, in one list." />
      <EmptyState
        icon={ListChecks}
        title="No tasks yet."
        hint="Plan your day here — tasks with time blocks will show up in Today's Focus."
      />
    </div>
  );
}

export default Tasks;
