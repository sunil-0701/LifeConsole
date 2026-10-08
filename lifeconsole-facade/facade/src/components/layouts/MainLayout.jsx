import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from '../ui/CommandPalette';
import { navItemForPath } from '../navigation/navItems';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();

  // The tab label follows the rail: "Tasks · LifeConsole". Unmatched paths
  // fall through navItemForPath, so the 404 gets its own wording.
  useEffect(() => {
    const item = navItemForPath(pathname);
    document.title = item ? `${item.label} · LifeConsole` : 'Page not found · LifeConsole';
  }, [pathname]);

  // Cmd/Ctrl+K toggles the palette from anywhere in the app.
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // While an overlay (mobile drawer or palette) is open, the page behind it
  // must not scroll and Escape must dismiss it.
  useEffect(() => {
    if (!sidebarOpen && !paletteOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setSidebarOpen(false);
      setPaletteOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [sidebarOpen, paletteOpen]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[4.5rem]">
        <Topbar onMenu={() => setSidebarOpen(true)} onSearch={() => setPaletteOpen(true)} />

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="px-5 py-8 sm:px-8 sm:py-10"
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Mounted only while open — a fresh instance means a fresh query. */}
      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}

export default MainLayout;
