import { Briefcase } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Career() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">Career</h1>
      <EmptyState
        icon={Briefcase}
        title="Nothing tracked yet."
        hint="Skills, milestones, and applications will live here."
      />
    </div>
  );
}

export default Career;
