
export function fakeStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

export function withBrowser() {
  globalThis.window = { localStorage: fakeStorage() };
  globalThis.document = { documentElement: { dataset: {} } };
}

export function withoutBrowser() {
  delete globalThis.window;
  delete globalThis.document;
}
