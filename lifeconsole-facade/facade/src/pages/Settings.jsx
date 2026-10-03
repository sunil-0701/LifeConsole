import { Settings } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function SettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Settings</h1>
      <EmptyState
        icon={Settings}
        title="Preferences are not available yet."
        hint="Account and appearance settings will be configurable here."
      />
    </div>
  );
}

export default SettingsPage;
