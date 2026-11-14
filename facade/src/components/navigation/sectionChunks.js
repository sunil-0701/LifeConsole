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

export const notFoundChunk = () => import('../../pages/NotFound');

export function prefetchSection(path) {
  const load = sectionChunks[path];
  if (load) load();
}
