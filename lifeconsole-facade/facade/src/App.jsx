import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import MainLayout from './components/layouts/MainLayout';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Finance from './pages/Finance';
import Habits from './pages/Habits';
import StickyNotes from './pages/StickyNotes';
import Wishlist from './pages/Wishlist';
import Analytics from './pages/Analytics';
import Career from './pages/Career';
import Projects from './pages/Projects';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

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
