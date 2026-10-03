import { FolderKanban } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Projects() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-medium tracking-tight text-white">Projects</h1>
      <EmptyState
        icon={FolderKanban}
        title="No active projects."
        hint="Add a project to start tracking its progress and tasks."
      />
    </div>
  );
}

export default Projects;
