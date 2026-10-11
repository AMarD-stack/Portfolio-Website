import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { SKILLS } from '../data/skills';
import { useViewport } from '../lib/viewport';
import Icon from './Icon';
import Logo from './Logo';
import { byId } from '../data/projects';
import { LINKEDIN } from '../lib/links';

const N = SKILLS.length;

// Scroll budget (vh). Every card gets the same beat:
//   DW   rests in the centre
//   IN   zooms in to show its detail          READ  you read it
//   OUT  zooms back out                       PAN   slides sideways to the next card
// After the last card: ZOOM pulls back to all six, HOLD rests on the grid, EXIT is the
// window in which the Play section slides up over this (still pinned) frame.
export const DW = 10, IN = 22, READ = 28, OUT = 22, PAN = 30, ZOOM = 80, HOLD = 40, EXIT = 100;
const UNIT = DW + IN + READ + OUT + PAN;
const LAST_END = (N - 1) * UNIT + DW + IN + READ + OUT;
export const SKILLS_LENGTH = LAST_END + ZOOM + HOLD + EXIT;
const detailAt = (i) => i * UNIT + DW + IN; // scroll (vh) where card i is fully zoomed in

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (k) => k * k * (3 - 2 * k);
const posFn = (s) => { // which card is in the centre (fractional while sliding)
  const i = Math.min(N - 1, Math.max(0, Math.floor(s / UNIT))), l = s - i * UNIT, rest = DW + IN + READ + OUT;
  return i === N - 1 || l <= rest ? i : i + smooth(clamp((l - rest) / PAN));
};
const detFn = (s, i) => { // 0..1 how zoomed-in card i is
  const l = s - i * UNIT - DW;
  return smooth(clamp(l / IN)) - smooth(clamp((l - IN - READ) / OUT));
};
const zoomFn = (s) => clamp((s - LAST_END) / ZOOM);
const STAG = 0.07;
const local = (z, i) => smooth(clamp((z - i * STAG) / (1 - (N - 1) * STAG)));

const vars = (s) => ({ '--bg-c': s.bg, '--fg-c': s.fg, '--c1': s.c1, '--c2': s.c2 });

// All geometry in px, relative to the carousel centre (w/2, cy). Cards are built at DETAIL size
// (bw x bh) and scaled down: c = carousel scale, sg = grid scale, dz = zoomed-in scale.
function layout(w, h) {
  const mobile = w < 768;
  const head = mobile ? 176 : 214, padB = mobile ? 104 : 110, padX = mobile ? 14 : 40, gg = mobile ? 10 : 20, gap = mobile ? 18 : 40;
  const availH = h - head - padB;
  const bw = mobile ? w - 24 : Math.min(w * 0.62, 860), bh = Math.min(availH, 600);
  const dz = Math.min(1, (w - 16) / bw, availH / bh);
  const tW = mobile ? w * 0.78 : Math.min(w * 0.4, 540), tH = mobile ? Math.min(h * 0.46, 400) : Math.min(h * 0.5, 380);
  const c = Math.min(tW / bw, tH / bh);
  const cols = mobile ? 2 : 3, rows = N / cols;
  const sg = Math.min((w - 2 * padX - (cols - 1) * gg) / (cols * bw), (availH - (rows - 1) * gg) / (rows * bh), c);
  const cy = head + availH / 2;
  const cells = SKILLS.map((_, i) => ({
    x: ((i % cols) - (cols - 1) / 2) * (sg * bw + gg),
    y: (Math.floor(i / cols) - (rows - 1) / 2) * (sg * bh + gg),
  }));
  const fit = mobile ? Math.min(1, bh / 650) : 1; // shrink detail content on short phones so every row fits
  return { bw, bh, c, dz, sg, cy, cells, step: bw * c + gap, mobile, fit };
}

function Card({ s, i, L, sv, pos, dmax, zoom, jump }) {
  const det = useTransform(sv, (v) => detFn(v, i));
  const lz = useTransform(zoom, (z) => local(z, i));
  const x = useTransform([pos, lz, dmax], ([p, z, dm]) => {
    const d = i - p, push = Math.abs(d) > 0.5 ? 1 + 0.5 * dm : 1;
    return (1 - z) * d * L.current.step * push + z * L.current.cells[i].x;
  });
  const y = useTransform(lz, (z) => z * L.current.cells[i].y);
  const scale = useTransform([pos, lz, det], ([p, z, d]) => {
    const base = (1 - z) * L.current.c * (1 - 0.1 * Math.min(Math.abs(i - p), 1)) + z * L.current.sg;
    return base * (1 - d) + d * L.current.dz;
  });
  const opacity = useTransform([pos, dmax], ([p, dm]) => (Math.abs(i - p) < 0.5 ? 1 : 1 - dm));
  const zIndex = useTransform(det, (d) => (d > 0.01 ? 50 : i));
  const compactO = useTransform(det, (d) => 1 - clamp(d * 2.2));
  const detailO = useTransform(det, (d) => clamp((d - 0.45) * 2.2));
  const extraO = useTransform(lz, (z) => (L.current.mobile ? 1 - z : 1));
  const [open, setOpen] = useState(false);
  useMotionValueEvent(det, 'change', (d) => setOpen(d > 0.5));
  const { bw, bh, cy } = L.current;

  return (
    <motion.div style={{ x, y, scale, opacity, zIndex, width: bw, height: bh, left: '50%', marginLeft: -bw / 2, top: cy - bh / 2 }} className="absolute">
      <div role="button" tabIndex={0} onClick={() => !open && jump(i)} onKeyDown={(e) => e.key === 'Enter' && !open && jump(i)}
        className={`skill-card b-${s.pat} w-full h-full shadow-xl ring-1 ring-white/10 ${open ? 'is-open' : ''}`} style={vars(s)}>
        {/* compact face (carousel + grid) */}
        <motion.div style={{ opacity: compactO }} className="absolute inset-0 p-9 md:p-11 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-lg uppercase tracking-widest font-semibold opacity-70">{s.kind}</span>
              <h3 className="font-display text-[44px] md:text-[58px] font-medium tracking-tight leading-[1.04] mt-3">{s.category}</h3>
            </div>
            <span className="font-mono text-xl opacity-60 pt-1">0{i + 1}/0{N}</span>
          </div>
          <motion.p style={{ opacity: extraO }} className="text-[26px] font-light opacity-80 max-w-[30ch] leading-snug">{s.summary}</motion.p>
          <motion.div style={{ opacity: extraO }} className="flex items-end justify-between gap-3">
            <div className="flex flex-wrap gap-3">{s.tools.slice(0, 6).map((t, k) => (
              t.k?.startsWith('img:')
                ? <span key={k} title={t.n} className="h-[68px] px-5 rounded-2xl grid place-items-center bg-white"><Logo k={t.k} name={t.n} size={26} /></span>
                : <span key={k} title={t.n} className="w-[68px] h-[68px] rounded-2xl grid place-items-center bg-white/12 border border-current/15"><Logo k={t.k} name={t.n} size={36} /></span>
            ))}</div>
            <Icon name="upRight" size={32} className="opacity-60 shrink-0" />
          </motion.div>
        </motion.div>

        {/* detail face (zoomed in) */}
        <motion.div style={{ opacity: detailO, pointerEvents: open ? 'auto' : 'none' }} className="absolute inset-0 overflow-hidden">
          <div style={{ zoom: L.current.fit }} className="h-full p-7 md:p-10 grid md:grid-cols-[1.05fr_1fr] gap-6 md:gap-10 content-start md:content-center">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold opacity-70">{s.kind} · 0{i + 1}/0{N}</span>
            <h3 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.05] mt-2 mb-3 md:mb-3">{s.category}</h3>
            <p className="hidden md:block opacity-80 font-light mb-5 md:mb-6">{s.summary}</p>
            <div className="flex flex-wrap gap-2">
              {s.tools.map((t, k) => (
                <span key={k} className={`flex items-center gap-2 rounded-full pl-3 pr-3.5 py-1.5 text-xs md:text-sm ${t.k?.startsWith('img:') ? 'bg-white text-navy-950' : 'bg-current/10'}`}>
                  <Logo k={t.k} name={t.n} size={t.k?.startsWith('img:') ? 14 : 16} />{t.k?.startsWith('img:') ? '' : t.n}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm md:text-base">{s.listTitle}</h4>
            <ul className="space-y-1.5 md:space-y-2.5">
              {s.list.map((a, k) => {
                const sub = a.d ?? (a.p ? byId[a.p]?.kicker : null);
                const body = <span className="flex-1 min-w-0"><span className="block font-medium text-sm md:text-base leading-snug">{a.t}</span>{sub && <span className={`${s.list.length <= 4 ? 'block' : 'hidden md:block'} opacity-70 text-[11px] md:text-xs font-light mt-0.5`}>{sub}</span>}</span>;
                return (
                  <li key={k}>
                    {s.roles || a.nolink ? (
                      <div className="flex items-center gap-3 bg-black/25 rounded-2xl px-4 py-2 md:py-3">{body}<span className="shrink-0 w-7 h-7 rounded-full grid place-items-center bg-white/15"><Icon name={s.roles ? 'users' : 'doc'} size={15} /></span></div>
                    ) : s.cert ? (
                      <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label={`${a.t} — open on LinkedIn`}
                        className="group flex items-center gap-3 bg-black/25 hover:bg-black/40 rounded-2xl px-4 py-2.5 md:py-3 transition-colors">
                        {body}
                        <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center bg-white/15 group-hover:bg-white group-hover:text-navy-950 transition-colors"><Icon name="upRight" size={15} /></span>
                      </a>
                    ) : (
                      <Link to={a.p ? `/projects?p=${a.p}` : '/projects'} aria-label={`Open ${a.t} on the projects page`}
                        className="group flex items-center gap-3 bg-black/25 hover:bg-black/40 rounded-2xl px-4 py-2 md:py-3 transition-colors">
                        {body}
                        <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center bg-white/15 group-hover:bg-white group-hover:text-navy-950 transition-colors"><Icon name="chevronRight" size={16} /></span>
                      </Link>
                    )}
                  </li>
                );
              })}
              </ul>
          </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills({ p }) {
  const { w, h } = useViewport();
  const lay = useMemo(() => layout(w, h), [w, h]);
  const L = useRef(lay);
  L.current = lay;

  const sv = useTransform(p, (v) => v * SKILLS_LENGTH);
  const pos = useTransform(sv, posFn);
  const zoom = useTransform(sv, zoomFn);
  const dmax = useTransform(sv, (s) => { let m = 0; for (let i = 0; i < N; i++) m = Math.max(m, detFn(s, i)); return m; });
  const panHint = useTransform(zoom, [0, 0.4], [1, 0]);
  const gridHint = useTransform(zoom, [0.7, 1], [0, 1]);
  const [cur, setCur] = useState(0);
  useMotionValueEvent(pos, 'change', (v) => setCur(Math.round(v)));

  // clicking a card jumps to its zoomed-in moment
  const jump = (i) => {
    const el = document.getElementById('skills');
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((detailAt(i) + 3) / 100) * window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 h-full text-fg">
      <div className="absolute inset-x-0 top-24 px-6 md:px-12 max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-fg/50 mb-2">03 — Skills &amp; credentials</p>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight">Skillsets</h2>
      </div>

      {SKILLS.map((s, i) => <Card key={s.id} s={s} i={i} L={L} sv={sv} pos={pos} dmax={dmax} zoom={zoom} jump={jump} />)}

      <div className="absolute inset-x-0 bottom-[72px] h-6 flex items-center justify-center font-mono text-xs text-fg/60">
        <motion.div style={{ opacity: panHint }} className="absolute flex items-center gap-3">
          <span className="flex gap-1.5">{SKILLS.map((s, i) => <i key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === cur ? 'w-6 bg-accent' : 'w-1.5 bg-fg/25'}`} />)}</span>
          keep scrolling
        </motion.div>
        <motion.div style={{ opacity: gridHint }} className="absolute">tap a card to jump to it</motion.div>
      </div>
    </div>
  );
}
