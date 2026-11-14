import { BarChart3 } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" hint="How the last weeks actually went." />
      <EmptyState
        icon={BarChart3}
        title="No data to analyze yet."
        hint="Charts and trends will appear once LifeConsole has real activity."
      />
    </div>
  );
}

export default Analytics;
