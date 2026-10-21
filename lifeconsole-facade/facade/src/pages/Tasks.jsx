import { useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import TaskRow from '../components/ui/TaskRow';
import {
  clearCompleted,
  countOpen,
  createTask,
  editTask,
  findTasks,
  removeTask,
  toggleTask,
} from '../lib/tasks';
import { useTasks } from '../lib/useTasks';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'done', label: 'Done' },
];

function Tasks() {
  const [tasks, setTasks] = useTasks();
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const addTask = (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    setTasks((current) => [createTask(text), ...current]);
    setDraft('');
  };

  const open = countOpen(tasks);
  const done = tasks.length - open;
  const visible = findTasks(tasks, query, filter);

  return (
    <div>
      <PageHeader title="Tasks" hint="Everything you plan to do, in one list." />

      <form onSubmit={addTask} className="flex max-w-xl gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New task"
          className="glass-control h-10 min-w-0 w-full rounded-lg px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={draft.trim().length === 0}
          className="glass-control inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm text-zinc-200 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
          <div
            className="glass-panel mt-8 inline-flex rounded-lg p-1"
            role="group"
            aria-label="Filter tasks"
          >
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                style={
                  filter === option.id
                    ? { backgroundColor: 'rgb(var(--accent-rgb) / 0.14)' }
                    : undefined
                }
                className={[
                  'min-h-8 rounded-md px-3 py-1.5 text-xs transition-colors duration-150',
                  filter === option.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>

          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            aria-label="Search tasks" placeholder="Search tasks…"
            className="glass-control mt-4 block h-10 w-full max-w-xl rounded-lg px-3 text-sm text-zinc-100 placeholder:text-zinc-500" />
          <p role="status" className="mt-2 text-xs text-zinc-500">{visible.length} of {tasks.length} tasks shown</p>

          <div className="mt-4 flex max-w-xl items-center justify-between gap-3">
            <p className="font-mono text-xs text-zinc-600">
              {open} open · {done} done
            </p>
            <button
              type="button"
              onClick={() => setTasks((current) => clearCompleted(current))}
              disabled={done === 0}
              className="rounded-lg px-2.5 py-1 text-xs text-zinc-500 transition-colors duration-150 hover:bg-white/[0.05] hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Clear completed ({done})
            </button>
          </div>

          {visible.length === 0 ? (
            <div className="mt-6 max-w-xl text-sm text-zinc-500">
              <p>{query.trim() ? 'No tasks match this search and filter.' : filter === 'open'
                ? 'Nothing open — everything on the list is done.'
                : 'Nothing completed yet.'}</p>
              <button type="button" onClick={() => { setQuery(''); setFilter('all'); }}
                className="glass-control mt-3 min-h-9 rounded-lg px-3 text-xs text-zinc-300">Show all tasks</button>
            </div>
          ) : (
            <ul className="glass-panel mt-3 max-w-xl divide-y divide-white/[0.05] rounded-xl px-5 py-2">
              {visible.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={(text) => setTasks((current) => editTask(current, task.id, text))}
                  onToggle={() => setTasks((current) => toggleTask(current, task.id))}
                  onRemove={() => setTasks((current) => removeTask(current, task.id))}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Tasks;
