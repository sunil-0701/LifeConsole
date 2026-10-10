import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import MainLayout from './components/layouts/MainLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { notFoundChunk, sectionChunks } from './components/navigation/sectionChunks';
import Home from './pages/Home';

// Home stays eager — it is the landing route, and pulling its chunk before
// first paint keeps the greeting animation immediate. Everything else loads
// on navigation through the shared sectionChunks map, so the initial bundle
// only pays for the shell.
const Journal = lazy(sectionChunks['/journal']);
const Tasks = lazy(sectionChunks['/tasks']);
const Goals = lazy(sectionChunks['/goals']);
const Finance = lazy(sectionChunks['/finance']);
const Habits = lazy(sectionChunks['/habits']);
const StickyNotes = lazy(sectionChunks['/sticky-notes']);
const Wishlist = lazy(sectionChunks['/wishlist']);
const Analytics = lazy(sectionChunks['/analytics']);
const Career = lazy(sectionChunks['/career']);
const Projects = lazy(sectionChunks['/projects']);
const Settings = lazy(sectionChunks['/settings']);
const NotFound = lazy(notFoundChunk);

function App() {
  return (
    // Outermost on purpose: a section that throws — or a chunk that fails to
    // fetch — should not take the whole console down with it. Inside,
    // reducedMotion="user" hands framer the OS motion preference.
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
