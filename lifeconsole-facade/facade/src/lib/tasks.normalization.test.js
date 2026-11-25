import { describe, expect, it } from 'vitest';
import { normalizeTasks } from './tasks';

describe('normalizeTasks', () => {
  const task = { id: 'task', text: 'Read', done: false, createdAt: 123 };

  it('keeps the first valid record for an ID and preserves input records', () => {
    const duplicate = { ...task, text: 'Duplicate' };
    const tasks = [task, duplicate];
    const normalized = normalizeTasks(tasks);

    expect(normalized).toEqual([task]);
    expect(normalized[0]).toBe(task);
    expect(tasks).toEqual([task, duplicate]);
  });

  it('rejects malformed fields without reserving their IDs', () => {
    for (const fields of [{ id: '' }, { id: 1 }, { text: null }, { text: '\t ' }, { done: 'false' }, { createdAt: NaN }, { createdAt: Infinity }]) {
      expect(normalizeTasks([null, { ...task, ...fields }, task])).toEqual([task]);
    }
    for (const value of [null, {}, '[]', undefined]) {
      expect(normalizeTasks(value)).toEqual([]);
    }
  });
});
