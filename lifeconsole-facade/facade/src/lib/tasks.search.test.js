import { describe, expect, it } from 'vitest';
import { createTask, findTasks } from './tasks';

describe('findTasks', () => {
  const open = createTask('Plan summer trip');
  const done = { ...createTask('Book summer trip'), done: true };
  const other = createTask('Plan weekly meals');
  const tasks = [open, done, other];

  it('matches all whitespace-separated terms regardless of case or order', () => {
    expect(findTasks(tasks, ' TRIP\tSUMMER ')).toEqual([open, done]);
    expect(findTasks(tasks, 'plan trip')).toEqual([open]);
    expect(findTasks(tasks, 'book meals')).toEqual([]);
  });

  it('combines searches with open and completed filters without reordering', () => {
    expect(findTasks(tasks, 'summer', 'open')).toEqual([open]);
    expect(findTasks(tasks, 'summer', 'done')).toEqual([done]);
    expect(findTasks(tasks, ' \n ')).toEqual(tasks);
    expect(findTasks(tasks, '', 'open')).toEqual([open, other]);
    expect(findTasks([], '')).toEqual([]);
  });
});
