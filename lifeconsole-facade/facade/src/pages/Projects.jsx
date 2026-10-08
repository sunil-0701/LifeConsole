import { FolderKanban } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Projects() {
  return (
    <div>
      <PageHeader title="Projects" hint="The things you are building." />
      <EmptyState
        icon={FolderKanban}
        title="No active projects."
        hint="Add a project to start tracking its progress and tasks."
      />
    </div>
  );
}

export default Projects;
