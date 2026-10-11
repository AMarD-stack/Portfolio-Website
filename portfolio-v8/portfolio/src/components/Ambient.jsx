import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import { px, py } from '../lib/pointer';

// Transparent theme-coloured gradient: three slow-drifting blobs plus a spotlight.
// Everything leans (gently) toward the cursor. Colours come from CSS variables, so it
// re-tints itself in light/dark mode. Put it first inside any `relative` frame.
export default function Ambient({ className = '' }) {
  const sx = useSpring(px, { stiffness: 40, damping: 20 });
  const sy = useSpring(py, { stiffness: 40, damping: 20 });
  const ax = useTransform(sx, [0, 1], [-70, 70]), ay = useTransform(sy, [0, 1], [-50, 50]);
  const bx = useTransform(sx, [0, 1], [60, -60]), by = useTransform(sy, [0, 1], [40, -40]);
  const cx = useTransform(sx, [0, 1], [-35, 35]), cy = useTransform(sy, [0, 1], [35, -35]);
  const lx = useTransform(sx, (v) => `${(v * 100).toFixed(1)}%`), ly = useTransform(sy, (v) => `${(v * 100).toFixed(1)}%`);
  const spot = useMotionTemplate`radial-gradient(560px circle at ${lx} ${ly}, var(--spot), transparent 70%)`;
  const blob = (c) => `radial-gradient(closest-side, var(${c}), transparent)`;
  return (
    <div aria-hidden="true" className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div style={{ x: ax, y: ay, left: '-12%', top: '-18%' }} className="absolute w-[70vmax] h-[70vmax]">
        <div className="w-full h-full" style={{ background: blob('--blob-a'), animation: 'drift-a 22s ease-in-out infinite' }} />
      </motion.div>
      <motion.div style={{ x: bx, y: by, right: '-16%', top: '-6%' }} className="absolute w-[60vmax] h-[60vmax]">
        <div className="w-full h-full" style={{ background: blob('--blob-b'), animation: 'drift-b 28s ease-in-out infinite' }} />
      </motion.div>
      <motion.div style={{ x: cx, y: cy, left: '22%', bottom: '-30%' }} className="absolute w-[65vmax] h-[65vmax]">
        <div className="w-full h-full" style={{ background: blob('--blob-c'), animation: 'drift-c 34s ease-in-out infinite' }} />
      </motion.div>
      <motion.div style={{ background: spot }} className="absolute inset-0" />
    </div>
  );
}
