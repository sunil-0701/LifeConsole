import { Repeat } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Habits() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Habits</h1>
      <EmptyState
        icon={Repeat}
        title="No habits tracked yet."
        hint="Define a habit and start building your streak."
      />
    </div>
  );
}

export default Habits;
