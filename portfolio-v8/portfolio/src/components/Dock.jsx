import { Link, useLocation } from 'react-router-dom';
import { LINKS, extProps } from '../lib/links';
import { useGo } from './PageTransition';
import Icon from './Icon';

// Small footer locked to the bottom of the screen on every page/section:
// name, contact, projects.
export default function Dock() {
  const home = useLocation().pathname === '/';
  const go = useGo();
  const toHome = (e) => { if (!home) { e.preventDefault(); go('/'); } };
  const ico = 'w-9 h-9 grid place-items-center rounded-full hover:bg-fg/10 transition-colors';
  return (
    <div className="fixed bottom-3 inset-x-3 z-[4500] flex justify-center pointer-events-none">
      <div className="glass pointer-events-auto flex items-center justify-between gap-2 w-full max-w-2xl rounded-full pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 text-sm">
        <Link to="/" onClick={toHome} className="font-display text-base font-medium tracking-tight whitespace-nowrap">Axel M.D.</Link>
        <div className="flex items-center">
          <a href={LINKS[0].href} className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-full hover:bg-fg/10 transition-colors font-medium">
            <Icon name="mail" size={16} /><span className="hidden sm:inline">Contact me</span>
          </a>
          {LINKS.slice(1).map((l) => <a key={l.key} href={l.href} {...extProps(l.href)} aria-label={l.label} title={l.label} className={ico}><Icon name={l.key} size={16} /></a>)}
        </div>
        <Link to={home ? '/projects' : '/'} onClick={toHome} className="flex items-center gap-1 h-9 pl-3.5 pr-2.5 rounded-full bg-accent text-accent-ink font-medium whitespace-nowrap hover:brightness-110 transition">
          {home ? <><span className="hidden min-[400px]:inline">My&nbsp;</span>projects</> : 'Home'} <Icon name="chevronRight" size={15} />
        </Link>
      </div>
    </div>
  );
}
