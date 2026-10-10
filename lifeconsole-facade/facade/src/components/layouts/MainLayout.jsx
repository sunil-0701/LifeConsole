import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from '../ui/CommandPalette';
import ShortcutHelp from '../ui/ShortcutHelp';
import PageFallback from '../ui/PageFallback';
import { navItemForPath } from '../navigation/navItems';
import { rememberSection } from '../../lib/sectionRecents';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState('');
  const skipFirstAnnounce = useRef(true);

  // After navigating, hand focus to the new page and start it at the top —
  // otherwise a keyboard user's focus stays on the sidebar button they just
  // pressed, and the viewport keeps the previous page's scroll position.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  // The tab label follows the rail: "Tasks · LifeConsole". Unmatched paths
  // fall through navItemForPath, so the 404 gets its own wording.
  useEffect(() => {
    const item = navItemForPath(pathname);
    document.title = item ? `${item.label} · LifeConsole` : 'Page not found · LifeConsole';
  }, [pathname]);

  // Every navigation feeds the recency list the palette sorts by.
  useEffect(() => {
    rememberSection(pathname);
  }, [pathname]);

  // Focus is moved to <main> on navigation, but a screen reader left parked
  // on the rail would otherwise hear nothing change — this polite region
  // speaks the section name. The initial page load stays silent.
  useEffect(() => {
    if (skipFirstAnnounce.current) {
      skipFirstAnnounce.current = false;
      return;
    }

    const item = navItemForPath(pathname);
    setAnnouncement(item ? `${item.label} loaded` : 'Page not found');
  }, [pathname]);

  // Global keys: Cmd/Ctrl+K toggles the palette, '?' opens the shortcut sheet
  // — but never while the user is typing, where '?' is just punctuation.
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (event.key === '?' && !typing) {
        event.preventDefault();
        setHelpOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // While an overlay (mobile drawer, palette, shortcut sheet) is open, the
  // page behind it must not scroll and Escape must dismiss it.
  useEffect(() => {
    if (!sidebarOpen && !paletteOpen && !helpOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setSidebarOpen(false);
      setPaletteOpen(false);
      setHelpOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [sidebarOpen, paletteOpen, helpOpen]);

  return (
    <div className="min-h-screen">
      {/* First tab stop: jumps past the rail straight to page content. */}
      <a
        href="#main-content"
        style={{ borderColor: 'rgb(var(--accent-rgb) / 0.45)' }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:text-zinc-100"
      >
        Skip to main content
      </a>

      {/* Route announcements — visually hidden, but spoken on change. */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[4.5rem]">
        <Topbar
          onMenu={() => setSidebarOpen(true)}
          onSearch={() => setPaletteOpen(true)}
          onHelp={() => setHelpOpen(true)}
        />

        <motion.main
          key={pathname}
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="px-5 py-8 focus:outline-none sm:px-8 sm:py-10"
        >
          {/* Sections are lazy chunks — the shell never unmounts while one loads. */}
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </div>

      {/* Mounted only while open — a fresh instance means a fresh query. */}
      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
      {helpOpen ? <ShortcutHelp onClose={() => setHelpOpen(false)} /> : null}
    </div>
  );
}

export default MainLayout;
