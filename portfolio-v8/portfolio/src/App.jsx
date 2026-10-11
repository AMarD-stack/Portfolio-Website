import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './lib/theme';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Dock from './components/Dock';
import Intro from './components/Intro';
import { PageTransitionProvider } from './components/PageTransition';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';

export default function App() {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(() => pathname !== '/' || sessionStorage.getItem('booted') === '1');
  const fromIntro = useRef(!booted);
  useEffect(() => { document.documentElement.style.overflow = booted ? '' : 'hidden'; }, [booted]);
  const done = () => { sessionStorage.setItem('booted', '1'); setBooted(true); };

  return (
    <ThemeProvider>
      <PageTransitionProvider>
      <div className="font-sans bg-bg text-fg selection:bg-accent selection:text-accent-ink overflow-x-clip">
        <Cursor />
        <AnimatePresence>{!booted && <Intro key="intro" onDone={done} />}</AnimatePresence>
        {booted && (
          <>
            <Navbar />
            <Dock />
            {/* the page rises into place as the intro panel wipes away */}
            <motion.div initial={fromIntro.current ? { y: 60, opacity: 0, scale: 1.03 } : false}
              animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
              </Routes>
            </motion.div>
          </>
        )}
      </div>
      </PageTransitionProvider>
    </ThemeProvider>
  );
}
