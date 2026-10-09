import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import MainLayout from './components/layouts/MainLayout';
import Home from './pages/Home';

// Home stays eager — it is the landing route, and pulling its chunk before
// first paint keeps the greeting animation immediate. Everything else loads
// on navigation, so the initial bundle only pays for the shell.
const Journal = lazy(() => import('./pages/Journal'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Goals = lazy(() => import('./pages/Goals'));
const Finance = lazy(() => import('./pages/Finance'));
const Habits = lazy(() => import('./pages/Habits'));
const StickyNotes = lazy(() => import('./pages/StickyNotes'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Career = lazy(() => import('./pages/Career'));
const Projects = lazy(() => import('./pages/Projects'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    // reducedMotion="user": framer drops transform/layout animation for anyone
    // who asked the OS for less motion (opacity fades stay, they are harmless).
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="journal" element={<Journal />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="goals" element={<Goals />} />
            <Route path="finance" element={<Finance />} />
            <Route path="habits" element={<Habits />} />
            <Route path="sticky-notes" element={<StickyNotes />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="career" element={<Career />} />
            <Route path="projects" element={<Projects />} />
            <Route path="settings" element={<Settings />} />
            {/* Anything unmatched used to render the shell with an empty body. */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
