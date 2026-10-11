import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV, navTarget } from '../lib/nav';
import { useTheme } from '../lib/theme';
import Icon from './Icon';
import { useGo } from './PageTransition';

export default function Navbar() {
  const nav = useNavigate();
  const go2 = useGo();
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState('projects');
  const home = pathname === '/';

  useEffect(() => {
    if (!home) return;
    const onScroll = () => {
      let a = 'projects';
      NAV.forEach((id) => { const t = navTarget(id); if (t !== null && scrollY >= t - innerHeight * 0.5) a = id; });
      setActive(a);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [home]);

  const go = (id) => {
    if (!home) return go2('/', { to: id });
    window.scrollTo({ top: navTarget(id), behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[5000]">
      <div className="glass flex items-center gap-1 rounded-full p-1 sm:p-1.5 text-[12.5px] sm:text-sm font-medium">
        {NAV.map((id) => {
          const on = home && active === id;
          return (
            <button key={id} onClick={() => go(id)} className="relative px-2 sm:px-5 py-2 rounded-full capitalize">
              {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className={`relative transition-colors ${on ? 'text-accent-ink' : ''}`}>{id}</span>
            </button>
          );
        })}
        <span className="w-px h-5 bg-line mx-0.5" />
        <button onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="relative w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-full hover:bg-fg/10 transition-colors">
          <motion.span key={theme} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </motion.span>
        </button>
      </div>
    </nav>
  );
}
