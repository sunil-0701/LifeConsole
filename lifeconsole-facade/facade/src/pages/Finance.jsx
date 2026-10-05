import { Wallet } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Finance() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">Finance</h1>
      <EmptyState
        icon={Wallet}
        title="No financial data yet."
        hint="Income, expenses, and savings will appear here once recorded."
      />
    </div>
  );
}

export default Finance;
