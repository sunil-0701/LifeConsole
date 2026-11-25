import { describe, expect, it } from 'vitest';
import { createTask, editTask } from './tasks';

describe('editTask', () => {
  it('trims edits while preserving completion status and creation metadata', () => {
    const task = { ...createTask('Original'), done: true };
    const other = createTask('Other');
    const next = editTask([task, other], task.id, '  Revised task  ');

    expect(next[0]).toEqual({ ...task, text: 'Revised task' });
    expect(next[1]).toBe(other);
    expect(task.text).toBe('Original');
  });

  it('ignores blank text and unknown IDs', () => {
    const tasks = [createTask('Original')];
    expect(editTask(tasks, tasks[0].id, '\n\t ')).toBe(tasks);
    expect(editTask(tasks, 'missing', 'Revised')[0]).toBe(tasks[0]);
    expect(editTask([], 'missing', 'Revised')).toEqual([]);
  });
});
