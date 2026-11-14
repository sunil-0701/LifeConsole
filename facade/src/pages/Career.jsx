import { Briefcase } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Career() {
  return (
    <div>
      <PageHeader title="Career" hint="Skills, applications, and the next move." />
      <EmptyState
        icon={Briefcase}
        title="Nothing tracked yet."
        hint="Skills, milestones, and applications will live here."
      />
    </div>
  );
}

export default Career;
