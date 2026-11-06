import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import MainLayout from './components/layouts/MainLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { notFoundChunk, sectionChunks } from './components/navigation/sectionChunks';
import Home from './pages/Home';

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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
