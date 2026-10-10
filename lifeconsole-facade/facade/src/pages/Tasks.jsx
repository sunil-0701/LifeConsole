import { useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import TaskRow from '../components/ui/TaskRow';
import { TASKS_KEY, countOpen, createTask, removeTask, toggleTask } from '../lib/tasks';
import { useStoredState } from '../lib/useStoredState';

// Module-level so useStoredState captures one stable initial value.
const NO_TASKS = [];

function Tasks() {
  const [tasks, setTasks] = useStoredState(TASKS_KEY, NO_TASKS);
  const [draft, setDraft] = useState('');

  const addTask = (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    setTasks((current) => [createTask(text), ...current]);
    setDraft('');
  };

  const open = countOpen(tasks);
  const done = tasks.length - open;

  return (
    <div>
      <PageHeader title="Tasks" hint="Everything you plan to do, in one list." />

      <form onSubmit={addTask} className="flex max-w-xl gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New task"
          className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors duration-150 hover:border-white/[0.14] focus:outline-none"
        />
        <button
          type="submit"
          disabled={draft.trim().length === 0}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3.5 text-sm text-zinc-200 transition-colors duration-150 hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/[0.05] disabled:hover:text-zinc-200"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet."
          hint="Type something above and press Enter — tasks save as you go, on this device."
        />
      ) : (
        <>
          <p className="mt-8 font-mono text-xs text-zinc-600">
            {open} open · {done} done
          </p>
          <ul className="mt-3 max-w-xl divide-y divide-white/[0.04] border-y border-white/[0.06]">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => setTasks((current) => toggleTask(current, task.id))}
                onRemove={() => setTasks((current) => removeTask(current, task.id))}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Tasks;
