export const TASKS_KEY = 'lc:tasks';

export function createTask(text) {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    text: text.trim(),
    done: false,
    createdAt: Date.now(),
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function countOpen(tasks) {
  return tasks.reduce((total, task) => (task.done ? total : total + 1), 0);
}
