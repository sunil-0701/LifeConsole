export const TASKS_KEY = 'lc:tasks';

export function normalizeTasks(value) {
  if (!Array.isArray(value)) return [];
  const ids = new Set();
  return value.filter((task) => {
    if (!task || typeof task.id !== 'string' || !task.id || ids.has(task.id) ||
      typeof task.text !== 'string' || !task.text.trim() ||
      typeof task.done !== 'boolean' || !Number.isFinite(task.createdAt)) return false;
    ids.add(task.id);
    return true;
  });
}

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

export function clearCompleted(tasks) {
  return tasks.filter((task) => !task.done);
}

export function editTask(tasks, id, text) {
  const trimmed = text.trim();
  if (!trimmed) return tasks;
  return tasks.map((task) => task.id === id ? { ...task, text: trimmed } : task);
}

export function findTasks(tasks, query, filter = 'all') {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return tasks.filter((task) =>
    (filter === 'all' || (filter === 'open' ? !task.done : task.done)) &&
    terms.every((term) => task.text.toLowerCase().includes(term)));
}
