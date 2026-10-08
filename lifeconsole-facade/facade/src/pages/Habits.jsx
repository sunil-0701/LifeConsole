import { Repeat } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Habits() {
  return (
    <div>
      <PageHeader title="Habits" hint="Small actions, repeated until they stick." />
      <EmptyState
        icon={Repeat}
        title="No habits tracked yet."
        hint="Define a habit and start building your streak."
      />
    </div>
  );
}

export default Habits;
