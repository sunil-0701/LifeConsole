import { matchPath } from 'react-router-dom';
import {
  Home,
  NotebookPen,
  ListChecks,
  Target,
  Wallet,
  Repeat,
  StickyNote,
  Image,
  FileText,
  Heart,
  BarChart3,
  Settings,
} from 'lucide-react';

// Single source of truth for the shell navigation: which sections exist,
// what they are called, and which ones are still locked. The sidebar renders
// it; the command palette and the document title read from it.
export const PRIMARY_NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/finance', label: 'Finance', icon: Wallet },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/sticky-notes', label: 'Sticky Notes', icon: StickyNote },
  { label: 'Gallery', icon: Image, locked: true },
  { label: 'Documents', icon: FileText, locked: true },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export const SETTINGS_NAV = { to: '/settings', label: 'Settings', icon: Settings };

export const ALL_NAV = [...PRIMARY_NAV, SETTINGS_NAV];

// Resolve a pathname to the nav entry that owns it. Unmatched paths (the 404
// route) return undefined, so callers can fall back themselves.
export function navItemForPath(pathname) {
  return ALL_NAV.find(
    (item) =>
      item.to !== undefined &&
      matchPath({ path: item.to, end: item.end ?? false }, pathname) !== null,
  );
}
