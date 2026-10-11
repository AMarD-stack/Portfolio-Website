import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Minimal preloader: one large number, one hairline. When it reaches 100 the number
// lifts away and the panel wipes upward, revealing the page settling into place.
const DURATION = 2400, HOLD = 350;
const ease = (t) => 1 - (1 - t) ** 2.6; // quick start, slow finish

export default function Intro({ onDone }) {
  const [pct, setPct] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const total = matchMedia('(prefers-reduced-motion: reduce)').matches ? 700 : DURATION;
    let raf, t0 = 0, fired = false;
    const loop = (now) => {
      if (!t0) t0 = now;
      const t = Math.min(1, (now - t0) / total);
      setPct(Math.max(1, Math.round(ease(t) * 100)));
      if (t < 1) raf = requestAnimationFrame(loop);
      else if (!fired) { fired = true; setLeaving(true); setTimeout(() => doneRef.current(), HOLD); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[8000] bg-bg text-fg flex flex-col items-center justify-center"
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] } }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}>
      <motion.div animate={leaving ? { y: -36, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: 'easeIn' }}
        className="flex flex-col items-center">
        <div className="font-sans font-extralight tabular-nums leading-none tracking-tighter flex items-start" style={{ fontSize: 'clamp(84px, 18vw, 220px)' }}>
          {pct}<span className="text-[0.22em] mt-[0.5em] ml-1 text-fg/40 font-light">%</span>
        </div>
        <div className="mt-8 h-px w-[min(260px,60vw)] bg-line overflow-hidden">
          <div className="h-full bg-accent origin-left" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </motion.div>
      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-fg/40">Axel M.D.</span>
    </motion.div>
  );
}
