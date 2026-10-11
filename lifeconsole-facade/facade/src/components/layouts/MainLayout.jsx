import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
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

  const openHelp = useCallback(() => setHelpOpen(true), []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    const item = navItemForPath(pathname);
    document.title = item ? `${item.label} · LifeConsole` : 'Page not found · LifeConsole';
  }, [pathname]);

  useEffect(() => {
    rememberSection(pathname);
  }, [pathname]);

  useEffect(() => {
    if (skipFirstAnnounce.current) {
      skipFirstAnnounce.current = false;
      return;
    }

    const item = navItemForPath(pathname);
    setAnnouncement(item ? `${item.label} loaded` : 'Page not found');
  }, [pathname]);

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
      <a
        href="#main-content"
        style={{ borderColor: 'rgb(var(--accent-rgb) / 0.45)' }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:text-zinc-100"
      >
        Skip to main content
      </a>

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
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onShowHelp={openHelp} />
      ) : null}
      {helpOpen ? <ShortcutHelp onClose={() => setHelpOpen(false)} /> : null}
    </div>
  );
}

export default MainLayout;
