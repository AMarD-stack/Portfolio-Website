import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FEATURED } from '../data/projects';
import Ambient from './Ambient';

// Startup animation for the projects page: a big folder rises, opens, and fans out one card
// per project; then the whole thing lifts away into the page. Click / Esc / "skip" to leave early.
const FAN = [{ r: -17, x: -230, y: -150 }, { r: -6, x: -78, y: -190 }, { r: 6, x: 78, y: -190 }, { r: 17, x: 230, y: -150 }];

export default function ProjectsIntro({ onDone }) {
  const fs = Math.min(1, window.innerWidth / 760); // narrower fan on phones
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), 3600);
    const k = (e) => e.key === 'Escape' && done.current();
    window.addEventListener('keydown', k);
    return () => { clearTimeout(t); window.removeEventListener('keydown', k); };
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[7000] bg-bg text-fg overflow-hidden grid place-items-center cursor-pointer" onClick={() => done.current()}
      initial={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } }}>
      <Ambient />
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: 1400 }}>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-fg/50 mb-[min(210px,22vh)]">Selected work · 0{FEATURED.length} featured projects</motion.p>

        {/* the folder: back panel + tab, cards, front flap */}
        <motion.div initial={{ y: 80, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          exit={{ y: -60, scale: 1.12, opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          className="relative w-[min(560px,86vw)] aspect-[1.55]">
          <div className="absolute left-0 -top-7 w-[34%] h-9 rounded-t-2xl bg-steel-500/90" />
          <div className="absolute inset-0 rounded-3xl rounded-tl-none bg-steel-500/90 shadow-[0_40px_80px_-30px_rgba(2,8,18,.6)]" />

          {FEATURED.map((p, i) => (
            <motion.div key={p.id} initial={{ x: 0, y: 24, rotate: 0, opacity: 0 }}
              animate={{ x: FAN[i].x * fs, y: FAN[i].y * (fs < 1 ? 0.9 : 1), rotate: FAN[i].r, opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-[8%] -ml-[88px] w-[176px] h-[236px] rounded-2xl overflow-hidden bg-navy-900 border border-white/15 shadow-xl"
              style={{ zIndex: 1 + i, transformOrigin: '50% 100%' }}>
              <img src={p.thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,15,30,.92), rgba(6,15,30,.15) 70%)' }} />
              <div className="absolute inset-x-3 bottom-3 text-white">
                <p className="font-mono text-[10px] opacity-60">0{i + 1}</p>
                <p className="font-display text-[15px] leading-tight">{p.title}</p>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ rotateX: 0 }} animate={{ rotateX: -24 }} transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: '50% 100%', zIndex: 10 }}
            className="absolute inset-x-0 bottom-0 h-[72%] rounded-3xl bg-gradient-to-b from-steel-300 to-steel-500 border-t border-white/40 shadow-[0_-10px_30px_rgba(2,8,18,.25)]">
            <p className="absolute left-7 bottom-6 font-display text-3xl md:text-4xl text-navy-950 tracking-tight">Projects</p>
            <p className="absolute right-7 bottom-7 font-mono text-xs text-navy-950/60 uppercase tracking-widest">Axel M.D.</p>
          </motion.div>
        </motion.div>
      </div>
      <button className="absolute bottom-8 right-8 z-10 font-mono text-xs text-fg/50 hover:text-fg" onClick={(e) => { e.stopPropagation(); done.current(); }}>skip</button>
    </motion.div>
  );
}
