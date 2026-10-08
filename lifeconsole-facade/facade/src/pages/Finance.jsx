import { Wallet } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Finance() {
  return (
    <div>
      <PageHeader title="Finance" hint="Money in, money out, nothing hidden." />
      <EmptyState
        icon={Wallet}
        title="No financial data yet."
        hint="Income, expenses, and savings will appear here once recorded."
      />
    </div>
  );
}

export default Finance;
