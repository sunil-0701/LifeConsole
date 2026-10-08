import { Settings } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" hint="How LifeConsole behaves for you." />
      <EmptyState
        icon={Settings}
        title="Preferences are not available yet."
        hint="Account and appearance settings will be configurable here."
      />
    </div>
  );
}

export default SettingsPage;
