import { describe, expect, it } from 'vitest';
import { clearCompleted, countOpen, createTask, removeTask, toggleTask } from './tasks';

describe('createTask', () => {
  it('trims the text and starts open', () => {
    const task = createTask('  water the plants  ');

    expect(task.text).toBe('water the plants');
    expect(task.done).toBe(false);
    expect(task.id).toBeTruthy();
    expect(task.createdAt).toBeGreaterThan(0);
  });

  it('gives every task its own id, even for identical text', () => {
    expect(createTask('same text').id).not.toBe(createTask('same text').id);
  });
});

describe('toggleTask', () => {
  it('flips only the matching task and leaves the list untouched', () => {
    const tasks = [createTask('one'), createTask('two')];
    const next = toggleTask(tasks, tasks[1].id);

    expect(next[1].done).toBe(true);
    expect(next[0].done).toBe(false);
    expect(tasks[1].done).toBe(false); // original array was not mutated
    expect(next).not.toBe(tasks);
  });

  it('is a no-op for an unknown id', () => {
    const tasks = [createTask('one')];

    expect(toggleTask(tasks, 'missing')).toEqual(tasks);
  });
});

describe('removeTask', () => {
  it('drops the matching task', () => {
    const tasks = [createTask('one'), createTask('two')];

    expect(removeTask(tasks, tasks[0].id).map((task) => task.text)).toEqual(['two']);
  });
});

describe('countOpen', () => {
  it('counts only the tasks that are not done', () => {
    const a = createTask('a');
    const b = createTask('b');
    const [doneA] = toggleTask([a], a.id);

    expect(countOpen([a, b])).toBe(2);
    expect(countOpen([doneA, b])).toBe(1);
    expect(countOpen([])).toBe(0);
  });
});

describe('clearCompleted', () => {
  it('keeps the open tasks and drops the rest', () => {
    const a = createTask('a');
    const b = createTask('b');
    const withOneDone = toggleTask([a, b], a.id);

    expect(clearCompleted(withOneDone).map((task) => task.text)).toEqual(['b']);
  });

  it('changes nothing when nothing is done', () => {
    const tasks = [createTask('a'), createTask('b')];

    expect(clearCompleted(tasks)).toEqual(tasks);
  });
});
