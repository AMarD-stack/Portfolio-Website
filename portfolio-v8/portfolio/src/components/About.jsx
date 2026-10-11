import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Stage from './Stage';
import Icon from './Icon';
import { LINKS, extProps } from '../lib/links';
import { px, py } from '../lib/pointer';
import { useViewport } from '../lib/viewport';

const P1 = [["I am an Information Systems student at "], ["Binus University (2024 - 2028)", 1], [" with a relentless focus on bridging complex technical systems with tangible business value."]];
const P2 = [["My expertise lies in designing scalable "], ["enterprise software architectures", 1], [", deploying "], ["artificial intelligence solutions", 1], [", and robust "], ["data engineering", 1], [". I thrive in environments that demand rapid iteration, strategic foresight, and an uncompromising standard for quality."]];
// words, with punctuation that starts a segment glued to the word before it (no stray space before commas/full stops)
const split = (segs) => {
  const w = segs.flatMap(([t, b]) => t.split(' ').filter(Boolean).map((x) => ({ t: x, b })));
  w.forEach((x, i) => { if (w[i + 1] && /^[,.;:]/.test(w[i + 1].t)) x.sp = false; });
  return w;
};

// Your photo lives at /public/portrait.jpg (monogram shows if it is ever missing).
const PORTRAIT = ['/portrait.jpg'];

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (k) => k * k * (3 - 2 * k);
const backOut = (t) => { const c = 1.70158; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2; }; // overshoot "pop"
const useSeg = (p, a, b, fn = smooth) => useTransform(p, (v) => fn(clamp((v - a) / (b - a))));

// ---- timeline (0..1 of the About stage) ---------------------------------------------------
// .00-.07 pack rises   .07-.13 shake   .13-.22 top tears off   .20-.30 card slides out
// .30-.40 pack drops away, card settles   .30-.46 card travels to its slot
// .38-.52 photo / name / role / details pop   .52-.84 text lights up   .84-.97 quote + links

const BW = 340, BH = 560; // design size of card & pack (scaled to fit the screen)

// jagged "crimped" foil edges
const zig = (y, amp, step = 4) => { const a = []; for (let x = 0; x <= 100; x += step) a.push([x, y + ((x / step) % 2 ? amp : -amp)]); return a; };
const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
const TEAR = 13.5;
const CLIP_TOP = poly([...zig(1.2, 0.8), [100, TEAR], ...zig(TEAR, 0.9).reverse()]);
const CLIP_BODY = poly([...zig(TEAR, 0.9), [100, 98.8], ...zig(98.8, 0.8).reverse()]);

const Mark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 28" fill="none" strokeWidth="3" aria-hidden="true">
    <circle cx="14" cy="14" r="10" stroke="#9DB5CF" /><circle cx="26" cy="14" r="10" stroke="#C9B48A" />
  </svg>
);

function PackFace() {
  return (
    <div className="absolute inset-0 rounded-[22px] overflow-hidden"
      style={{ background: 'linear-gradient(115deg,#0B1B33 0%,#1F4E8C 22%,#9DB5CF 42%,#E9E1CF 50%,#C9B48A 56%,#5F85B0 74%,#0B1B33 100%)', backgroundSize: '220% 100%', animation: 'foil 6s linear infinite' }}>
      <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 1.5px, transparent 1.5px 7px)', maskImage: 'linear-gradient(#000 0 11%, transparent 11% 89%, #000 89%)', WebkitMaskImage: 'linear-gradient(#000 0 11%, transparent 11% 89%, #000 89%)' }} />
      <div className="absolute inset-[18px] rounded-[16px] border border-white/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-navy-950">
        <Mark size={96} />
        <div className="text-center">
          <p className="font-display text-3xl font-medium tracking-tight">Axel M.D.</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.35em] opacity-70">Portfolio pack</p>
        </div>
      </div>
    </div>
  );
}

function IdCard({ p }) {
  const [src, setSrc] = useState(0);
  const photoS = useSeg(p, 0.38, 0.45, backOut), nameS = useSeg(p, 0.41, 0.48, backOut), roleS = useSeg(p, 0.44, 0.5, backOut), sideS = useSeg(p, 0.46, 0.52), logoS = useSeg(p, 0.48, 0.54, backOut);
  const shine = useTransform(p, [0.36, 0.52], ['-130%', '130%']);
  const pop = (s) => ({ scale: s, opacity: s });
  return (
    <div className="absolute inset-0 rounded-[26px] overflow-hidden text-white shadow-[0_40px_80px_-30px_rgba(2,8,18,.7)] border border-white/10"
      style={{ background: 'linear-gradient(160deg,#16294a 0%,#0c1a33 55%,#08111f 100%)' }}>
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(95,133,176,.35), transparent)' }} />
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[72px] h-[14px] rounded-full bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,.7),0_1px_0_rgba(255,255,255,.12)]" />
      <motion.div style={{ ...pop(nameS), transformOrigin: 'left top' }} className="absolute left-[26px] top-[64px]">
        <p className="text-[46px] leading-[1.02] font-normal tracking-tight">Axel</p>
        <p className="text-[46px] leading-[1.02] font-normal tracking-tight text-white/40">M.D.</p>
      </motion.div>
      <motion.p style={{ ...pop(roleS), transformOrigin: 'left top' }} className="absolute left-[26px] top-[170px] font-mono text-[12.5px] text-white/80">Information Systems</motion.p>
      <motion.div style={{ opacity: sideS }} className="absolute right-[22px] top-[64px] flex flex-col gap-4 font-mono text-[9px] tracking-wider text-white/65">
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>2024 — 2028</span>
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Binus</span>
      </motion.div>
      <motion.div style={{ ...pop(photoS), transformOrigin: 'center' }} className="absolute left-[22px] right-[22px] top-[212px] bottom-[88px] rounded-2xl overflow-hidden bg-navy-800 ring-1 ring-white/10">
        {src < PORTRAIT.length
          ? <img src={PORTRAIT[src]} alt="Axel M.D." onError={() => setSrc((s) => s + 1)} className="w-full h-full object-cover" style={{ objectPosition: '50% 22%' }} />
          : <div className="w-full h-full grid place-items-center font-display text-6xl text-steel-300">AMD</div>}
      </motion.div>
      <motion.div style={{ ...pop(logoS), transformOrigin: 'left bottom' }} className="absolute left-[24px] bottom-[26px] flex items-center gap-2.5">
        <Mark size={30} />
        <span className="text-[24px] font-normal tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#9DB5CF,#E9E1CF 60%,#C9B48A)' }}>Axel M.D.</span>
      </motion.div>
      {/* holographic sheen */}
      <motion.div style={{ x: shine }} className="absolute inset-0 pointer-events-none mix-blend-soft-light"><div className="w-full h-full" style={{ background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%)' }} /></motion.div>
    </div>
  );
}

// the whole pack-opening sequence, positioned in the slot where the card ends up
function PackOpening({ p, k, off }) {
  const sx = useSpring(px, { stiffness: 80, damping: 18 }), sy = useSpring(py, { stiffness: 80, damping: 18 });
  const enter = useSeg(p, 0, 0.07, (t) => 1 - (1 - t) ** 3);
  const tear = useSeg(p, 0.13, 0.22), drop = useSeg(p, 0.3, 0.4), travel = useSeg(p, 0.3, 0.46), tiltOn = useSeg(p, 0.44, 0.5);

  // wrapper: pack starts mid-screen (off), card ends in its slot
  const wx = useTransform(travel, (m) => off.x * (1 - m)), wy = useTransform(travel, (m) => off.y * (1 - m));
  const ws = useTransform(travel, (m) => 0.92 + 0.08 * m);

  const packO = useTransform([enter, drop], ([e, d]) => e * (1 - smooth(clamp((d - 0.1) / 0.8))));
  const packY = useTransform([enter, drop], ([e, d]) => `${(1 - e) * 45 + d * 140}%`);
  const packR = useTransform(p, [0, 0.07, 0.09, 0.11, 0.13, 0.3, 0.4], [-5, 0, -3.2, 3.2, 0, 0, 12]);
  const topX = useTransform(tear, (t) => t * BW * 0.95), topY = useTransform(tear, (t) => -t * BH * 0.4), topR = useTransform(tear, (t) => t * 36);
  const topO = useTransform(tear, (t) => 1 - smooth(clamp((t - 0.55) / 0.45)));
  const glowO = useTransform(p, [0.12, 0.18, 0.3, 0.4], [0, 1, 0.7, 0]);
  const glowS = useTransform(p, [0.12, 0.3], [0.5, 1.7]);

  const cardO = useTransform(p, (v) => clamp((v - 0.185) / 0.015));
  const cardY = useTransform(p, (v) => { const up = smooth(clamp((v - 0.2) / 0.1)), dn = smooth(clamp((v - 0.3) / 0.1)); return `${-52 * up * (1 - dn)}%`; });
  const cardS = useTransform(p, [0.2, 0.4], [0.9, 1]);
  const rotY = useTransform([sx, tiltOn], ([x, t]) => (x - 0.5) * 16 * t), rotX = useTransform([sy, tiltOn], ([y, t]) => -(y - 0.5) * 16 * t);

  return (
    <motion.div style={{ x: wx, y: wy, scale: ws }} className="absolute inset-0">
      <div style={{ width: BW, height: BH, transform: `scale(${k})`, transformOrigin: 'top left', perspective: 1200 }} className="relative">
        <motion.div style={{ opacity: glowO, scale: glowS }} className="absolute left-1/2 -top-8 -ml-[260px] w-[520px] h-[260px] pointer-events-none">
          <div className="w-full h-full" style={{ background: 'radial-gradient(closest-side, rgba(233,225,207,.95), rgba(141,177,222,.45) 45%, transparent)' }} />
        </motion.div>
        <motion.div style={{ opacity: cardO, y: cardY, scale: cardS, rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="absolute inset-0 z-[1]"><IdCard p={p} /></motion.div>
        <motion.div style={{ opacity: packO, y: packY, rotate: packR }} className="absolute inset-0 z-[2] pointer-events-none">
          <div className="absolute inset-0 drop-shadow-[0_30px_40px_rgba(2,8,18,.45)]" style={{ clipPath: CLIP_BODY }}><PackFace /></div>
          <motion.div style={{ x: topX, y: topY, rotate: topR, opacity: topO, transformOrigin: '100% 100%' }} className="absolute inset-0" >
            <div className="absolute inset-0" style={{ clipPath: CLIP_TOP }}><PackFace /></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const Word = ({ w, p, a, b }) => {
  const o = useTransform(p, [a, b], [0.16, 1]);
  return <motion.span style={{ opacity: o }} className={w.b ? 'font-semibold text-fg' : ''}>{w.t}{w.sp === false ? '' : ' '}</motion.span>;
};
const Para = ({ segs, p, from, to }) => {
  const ws = split(segs);
  return <p>{ws.map((w, i) => <Word key={i} w={w} p={p} a={from + ((to - from) * i) / ws.length} b={from + ((to - from) * (i + 1)) / ws.length} />)}</p>;
};
function ContactLink({ l, p, i }) {
  const o = useSeg(p, 0.9 + i * 0.022, 0.93 + i * 0.022);
  const y = useTransform(o, (v) => (1 - v) * 14);
  return (
    <motion.a href={l.href} {...extProps(l.href)} style={{ opacity: o, y }} className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full glass text-sm font-medium hover:bg-accent hover:text-accent-ink hover:border-accent transition-colors">
      <Icon name={l.key} size={17} />{l.label}
      <Icon name="upRight" size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
}

function Body({ p, sink }) {
  const { w, h } = useViewport();
  const mobile = w < 768;
  const k = mobile ? Math.min(0.46, (h * 0.27) / BH) : Math.min(1.08, (h * 0.74) / BH);
  const root = useRef(null), slot = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      if (!root.current || !slot.current) return;
      const a = root.current.getBoundingClientRect(), b = slot.current.getBoundingClientRect();
      setOff({ x: a.left + a.width / 2 - (b.left + b.width / 2), y: a.top + a.height / 2 - (b.top + b.height / 2) + (mobile ? 0 : 24) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root.current); ro.observe(slot.current);
    const t = setTimeout(measure, 1600); // after the page-settle animation
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [mobile, k]);

  const headO = useSeg(p, 0.5, 0.56), headY = useTransform(headO, (v) => (1 - v) * 24);
  const quoteO = useSeg(p, 0.84, 0.9), quoteX = useTransform(quoteO, (v) => (v - 1) * 30);
  const bar = useTransform(p, [0, 1], [0, 1]);
  const sinkScale = useTransform(sink, [0, 1], [1, 0.9]);
  const veil = useTransform(sink, [0, 1], [0, 0.6]);

  return (
    <div ref={root} className="relative z-10 h-full text-fg">
      <motion.div style={{ scale: sinkScale }} className="relative h-full flex items-center">
        <motion.div style={{ scaleY: bar }} className="absolute right-4 top-0 bottom-0 w-0.5 bg-accent/70 origin-top" />
        <div className="max-w-7xl mx-auto w-full px-6 pt-24 md:pt-0 pb-20 md:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-14 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div ref={slot} className="relative" style={{ width: BW * k, height: BH * k }}>
              <PackOpening p={p} k={k} off={off} />
            </div>
          </div>
          <div className="md:col-span-7">
            <motion.div style={{ opacity: headO, y: headY }}>
              <h2 className="font-mono text-xs md:text-sm font-medium uppercase tracking-widest text-fg/50 mb-2 md:mb-4">About</h2>
              <h3 className="font-display text-4xl md:text-6xl font-medium tracking-tight mb-3 md:mb-6">Axel M.D.</h3>
            </motion.div>
            <div className="space-y-3 md:space-y-4 text-[13.5px] leading-relaxed md:text-lg text-fg/60 font-light mb-5 md:mb-6">
              <Para segs={P1} p={p} from={0.52} to={0.68} />
              <Para segs={P2} p={p} from={0.68} to={0.84} />
            </div>
            <motion.blockquote style={{ opacity: quoteO, x: quoteX }} className="hidden md:block font-display text-xl md:text-2xl font-light italic leading-snug border-l-4 border-sand pl-6 mb-8">
              "Nothing is more certain in life than death, with all the time in the world you ought to do some good for others & for thyself."
            </motion.blockquote>
            <div className="flex flex-wrap gap-2.5 md:gap-3 md:border-t md:border-line md:pt-6">
              {LINKS.map((l, i) => <ContactLink key={l.key} l={l} p={p} i={i} />)}
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-navy-950 pointer-events-none z-20" />
    </div>
  );
}

export const ABOUT_LEN = 400;
// pinned reading + a 100vh tail while the next section covers it
export default function About({ sink }) {
  return <Stage length={ABOUT_LEN} tail={100} ambient>{(p) => <Body p={p} sink={sink} />}</Stage>;
}
