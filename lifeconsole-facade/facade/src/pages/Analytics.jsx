import { BarChart3 } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Analytics() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Analytics</h1>
      <EmptyState
        icon={BarChart3}
        title="No data to analyze yet."
        hint="Charts and trends will appear once LifeConsole has real activity."
      />
    </div>
  );
}

export default Analytics;
