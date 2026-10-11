import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import { HERO as FEATURED } from '../data/projects';
import Ambient from './Ambient';
import Icon from './Icon';

// Section 1: a pinned banner that you scroll THROUGH. Each featured project gets one slice of the
// scroll: it settles in, slowly pushes in while its details open up, then the camera zooms
// through the artwork into the next project. After the last one the page moves on.
export const HERO_LEN = FEATURED.length * 110;
const N = FEATURED.length;
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (k) => k * k * (3 - 2 * k);

function Banner({ p, i }) {
  const pr = FEATURED[i], last = i === N - 1;
  const u = useTransform(p, (v) => v * N - i); // this banner's local 0..1 (can be <0 or >1)

  // artwork: pre-roll (scale up from .9 under the previous one) -> slow push-in -> zoom-through
  const scale = useTransform(u, (x) => {
    if (x < 0) return 0.9 + 0.1 * smooth(clamp((x + 0.2) / 0.2));
    const push = 1 + 0.1 * smooth(clamp(x / 0.8));
    return last ? push : push + 1.1 * smooth(clamp((x - 0.8) / 0.2));
  });
  const opacity = useTransform(u, (x) => (last ? 1 : 1 - smooth(clamp((x - 0.84) / 0.16))));
  const blur = useTransform(u, (x) => (last ? 'blur(0px)' : `blur(${(smooth(clamp((x - 0.8) / 0.2)) * 10).toFixed(1)}px)`));

  // text: block fades in, details open (the block grows upward), then everything leaves
  const tIn = (x) => (i === 0 ? 1 : smooth(clamp(x / 0.12)));
  const tOut = (x) => (last ? 1 : 1 - smooth(clamp((x - 0.74) / 0.12)));
  const blockO = useTransform(u, (x) => tIn(x) * tOut(x));
  const blockY = useTransform(u, (x) => (1 - tIn(x)) * 30 - (last ? 0 : (1 - tOut(x)) * 30));
  const det = useTransform(u, (x) => smooth(clamp((x - 0.28) / 0.18)));
  const rows = useTransform(det, (v) => `${v}fr`);
  const detPE = useTransform(det, (v) => (v > 0.5 ? 'auto' : 'none'));

  return (
    <>
      <motion.div style={{ opacity, zIndex: N - i }} className="absolute inset-0 pointer-events-none">
        <motion.div style={{ scale, filter: blur }} className="absolute inset-0 will-change-transform">
          <picture>
            <source media="(max-width: 767px)" srcSet={pr.imageM} />
            <img src={pr.image} alt={pr.heroTitle || pr.title} className="w-full h-full object-cover" />
          </picture>
        </motion.div>
        <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(6,15,30,.9) 0%, rgba(6,15,30,.55) 38%, rgba(6,15,30,0) 62%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,15,30,.92) 0%, rgba(6,15,30,.5) 34%, rgba(6,15,30,0) 62%)' }} />
      </motion.div>

      <motion.div style={{ opacity: blockO, y: blockY, zIndex: 20 }} className="absolute left-0 right-0 bottom-[88px] md:bottom-[92px] pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="md:max-w-[min(44%,580px)]">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex gap-1.5">{FEATURED.map((_, n) => <IndBar key={n} p={p} n={n} cur={i} />)}</div>
              <span className="text-white/60 text-sm font-mono">0{i + 1} / 0{N}</span>
            </div>
            <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-accent mb-3">{pr.kicker}</p>
            <h1 className="text-[40px] leading-[1.02] sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white mb-3 md:mb-4">{pr.heroTitle || pr.title}</h1>
            <p className="text-base md:text-xl text-white/75 font-light">{pr.tagline}</p>

            {/* details: the row opens as the artwork keeps pushing in */}
            <motion.div style={{ gridTemplateRows: rows, opacity: det, pointerEvents: detPE }} className="grid">
              <div className="overflow-hidden min-h-0">
                <p className="pt-4 md:pt-5 text-sm md:text-[15px] leading-relaxed text-white/85 font-light line-clamp-4 md:line-clamp-none">{pr.summary}</p>
                <div className="hidden md:flex flex-wrap gap-1.5 mt-4">{pr.tags.map((t) => <span key={t} className="px-3 py-0.5 rounded-full text-xs bg-white/12 border border-white/15 text-white">{t}</span>)}</div>
                <Link to={`/projects?p=${pr.id}`} className="mt-4 md:mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-ink text-sm font-semibold hover:brightness-110 transition group">
                  Open project <Icon name="upRight" size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// story-style progress segment
function IndBar({ p, n, cur }) {
  const fill = useTransform(p, (v) => clamp(v * N - n));
  return (
    <span className={`relative h-1 rounded-full overflow-hidden bg-white/25 transition-all duration-500 ${n === cur ? 'w-14' : 'w-5'}`}>
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 bg-accent origin-left" />
    </span>
  );
}

export default function Hero({ p, sink }) {
  const hint = useTransform(p, [0, 0.04], [1, 0]);
  const sinkScale = useTransform(sink, [0, 1], [1, 0.9]);
  const veil = useTransform(sink, [0, 1], [0, 0.6]);
  return (
    <div className="relative h-full bg-navy-950 text-white">
      <motion.div style={{ scale: sinkScale }} className="absolute inset-0">
        {FEATURED.map((_, i) => <Banner key={i} p={p} i={i} />)}
        <div className="absolute inset-0 z-[15] pointer-events-none"><Ambient /></div>
        <motion.div style={{ opacity: hint }} className="absolute z-30 bottom-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 font-mono text-[11px] uppercase tracking-[0.25em]">
          scroll <Icon name="down" size={16} className="animate-bounce" />
        </motion.div>
      </motion.div>
      <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-navy-950 pointer-events-none z-40" />
    </div>
  );
}
