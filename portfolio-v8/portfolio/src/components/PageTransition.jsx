import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// "Batik curtains": four serrated (tumpal-edged) sheets in the brand palette drop over the page,
// the two-ring mark draws itself while the route changes underneath, then the sheets peel away
// downward one after another to reveal the destination. Used when leaving the projects page.
const Ctx = createContext(() => {});
export const useGo = () => useContext(Ctx);

const LAYERS = ['#C9B48A', '#5F85B0', '#1F4E8C', '#060F1E'];
const EASE = [0.76, 0, 0.24, 1];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | cover | out
  const busy = useRef(false);

  const go = useCallback(async (to, state) => {
    if (busy.current) return;
    busy.current = true;
    const k = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.25 : 1;
    setPhase('cover'); await wait(1250 * k);       // sheets land, mark draws
    navigate(to, state ? { state } : undefined);   // route changes while covered
    await wait(550 * k);
    setPhase('out'); await wait(1250 * k);         // sheets peel away
    setPhase('idle'); busy.current = false;
  }, [navigate]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div aria-hidden="true" className="fixed inset-0 z-[9000] overflow-hidden" style={{ pointerEvents: phase === 'idle' ? 'none' : 'auto' }}>
        {LAYERS.map((c, i) => (
          <motion.div key={c} className="absolute inset-0" style={{ background: c, zIndex: i }}
            initial={false}
            animate={{ y: phase === 'cover' ? '0%' : phase === 'out' ? '114%' : '-114%' }}
            transition={phase === 'idle' ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: phase === 'cover' ? i * 0.1 : (LAYERS.length - 1 - i) * 0.1 }}>
            <span className="tumpal-down" style={{ background: c }} />
          </motion.div>
        ))}
        <motion.div className="absolute inset-0 grid place-items-center" style={{ zIndex: 10 }}
          animate={{ opacity: phase === 'cover' ? 1 : 0, scale: phase === 'cover' ? 1 : 1.12 }}
          transition={{ duration: 0.45, delay: phase === 'cover' ? 0.62 : 0 }}>
          <div className="flex flex-col items-center gap-5 text-mist-100">
            <svg width="132" height="84" viewBox="0 0 40 26" fill="none" strokeWidth="1.6" strokeLinecap="round">
              <motion.circle cx="14" cy="13" r="10" stroke="#9DB5CF" initial={false} animate={{ pathLength: phase === 'cover' ? 1 : 0 }} transition={{ duration: 0.7, delay: phase === 'cover' ? 0.7 : 0 }} />
              <motion.circle cx="26" cy="13" r="10" stroke="#C9B48A" initial={false} animate={{ pathLength: phase === 'cover' ? 1 : 0 }} transition={{ duration: 0.7, delay: phase === 'cover' ? 0.85 : 0 }} />
            </svg>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-mist-100/70">Back home</span>
          </div>
        </motion.div>
      </div>
    </Ctx.Provider>
  );
}
