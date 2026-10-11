import { useState } from 'react';
import { motion } from 'framer-motion';
import Ambient from './Ambient';
import Icon from './Icon';
import { LOGOS } from '../lib/logos';
import RevealHeadline from './RevealHeadline';
import { SOURCES } from '../data/sources';

// Section 4: what I read to keep up with the industry. Each tile catches a spotlight + sheen
// on hover (same language as the About card) and opens the source in a new tab.
const host = (u) => new URL(u).hostname.replace(/^www\./, '');

// Logo chip: bundled brand mark in its brand colour, else the site's own icon (loaded at runtime), else a text badge.
function Mark({ s }) {
  const [bad, setBad] = useState(false);
  const brand = s.k && LOGOS[s.k];
  return (
    <span className={`h-12 rounded-xl grid place-items-center bg-white ring-1 ring-black/10 shadow-sm overflow-hidden ${s.img ? 'px-3 min-w-12' : 'w-12'}`}>
      {s.img ? <img src={s.img} alt={s.n} className="h-[22px] w-auto" /> : brand ? <svg width="26" height="26" viewBox="0 0 24 24" fill={`#${brand.hex}`} aria-hidden="true"><path d={brand.path} /></svg>
        : !bad ? <img src={`https://www.google.com/s2/favicons?domain=${new URL(s.u).hostname}&sz=128`} alt="" width="30" height="30" loading="lazy" referrerPolicy="no-referrer" onError={() => setBad(true)} className="w-[30px] h-[30px] object-contain" />
        : <span className="font-mono font-bold text-navy-900 text-[13px] leading-none">{s.b}</span>}
    </span>
  );
}

function Tile({ s, i }) {
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <motion.a href={s.u} target="_blank" rel="noopener noreferrer" onPointerMove={move} aria-label={`${s.n} (opens in a new tab)`}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay: (i % 5) * 0.05 }}
      className="group relative overflow-hidden rounded-2xl glass p-4 md:p-5 min-h-[128px] flex flex-col justify-between hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_18px_40px_-18px_var(--spot)] transition-[transform,box-shadow,border-color] duration-300">
      {/* cursor-following highlight */}
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), var(--hi), transparent 65%)' }} />
      {/* reflection sweep */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[60%] -translate-x-full group-hover:translate-x-[230%] transition-transform duration-[900ms] ease-out"
        style={{ background: 'linear-gradient(110deg, transparent 30%, var(--sheen) 50%, transparent 70%)' }} />
      <span className="relative flex items-start justify-between">
        <Mark s={s} />
        {s.sub && <span className="absolute right-0 top-0 font-mono text-[10px] px-2 py-0.5 rounded-full border border-line text-fg/60 group-hover:opacity-0 transition-opacity">{s.sub}</span>}
        <Icon name="upRight" size={16} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-70 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
      </span>
      <span className="relative mt-4 block">
        <span className="block font-semibold text-[15px] leading-tight">{s.n}</span>
        <span className="block font-mono text-[11px] text-fg/50 mt-0.5 truncate">{host(s.u)}</span>
      </span>
    </motion.a>
  );
}

export default function Read() {
  return (
    <section id="read" className="relative z-30 bg-bg-2" style={{ marginTop: '-100vh', borderRadius: '2.5rem 2.5rem 0 0', overflow: 'clip' }}>
      <Ambient />
      <div className="relative z-10">
        <RevealHeadline kicker="04 — Read" lines={[['Read', 'with', 'me.']]} accent={['me.']}
          sub="What is currently happening in the industry — the publications, firms and platforms I follow." />
        <div className="px-4 md:px-8 pb-36">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {SOURCES.map((s, i) => <Tile key={s.n} s={s} i={i} />)}
            <div className="col-span-2 md:col-span-1 rounded-2xl border border-dashed border-line p-4 md:p-5 min-h-[128px] flex flex-col items-center justify-center text-fg/55">
              <span className="font-display text-3xl">+ More</span>
              <span className="font-mono text-[11px] mt-1">always growing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
