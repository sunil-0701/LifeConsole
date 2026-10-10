// One import() per section, shared by the router (React.lazy) and by anyone
// that wants the chunk before the click lands: hovering or keyboard-focusing a
// rail item, or highlighting a row in the palette, starts the download. Vite
// dedupes the module graph, so a warm prefetch means navigation resolves from
// cache instead of the network.
export const sectionChunks = {
  '/journal': () => import('../../pages/Journal'),
  '/tasks': () => import('../../pages/Tasks'),
  '/goals': () => import('../../pages/Goals'),
  '/finance': () => import('../../pages/Finance'),
  '/habits': () => import('../../pages/Habits'),
  '/sticky-notes': () => import('../../pages/StickyNotes'),
  '/wishlist': () => import('../../pages/Wishlist'),
  '/analytics': () => import('../../pages/Analytics'),
  '/career': () => import('../../pages/Career'),
  '/projects': () => import('../../pages/Projects'),
  '/settings': () => import('../../pages/Settings'),
};

// The catch-all has no nav entry, so it gets its own loader.
export const notFoundChunk = () => import('../../pages/NotFound');

export function prefetchSection(path) {
  const load = sectionChunks[path];
  if (load) load();
}
