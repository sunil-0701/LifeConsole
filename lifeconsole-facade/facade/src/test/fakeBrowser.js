// The persistence libraries talk to window.localStorage and applyAccent
// touches document — neither object exists in the node test environment, so
// tests install these stand-ins around each case. Every fakeStorage() call
// returns a fresh map, which keeps tests independent of each other.

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
