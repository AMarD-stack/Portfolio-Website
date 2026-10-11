import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Headline whose words rise out of a mask (with a touch of blur) as it scrolls into view.
// lines: [['Read', 'with', 'me.']]   accent: words rendered in the accent colour, italic
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (k) => k * k * (3 - 2 * k);

function Word({ u, i, total, children, accent }) {
  const e = useTransform(u, (v) => smooth(clamp((v - i * (0.54 / Math.max(1, total - 1))) / 0.46)));
  const y = useTransform(e, (v) => `${(1 - v) * 112}%`);
  const blur = useTransform(e, (v) => `blur(${((1 - v) * 8).toFixed(1)}px)`);
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.22em]">
      <motion.span style={{ y, filter: blur, opacity: e }} className={`inline-block ${accent ? 'italic text-accent' : ''}`}>{children}</motion.span>
    </span>
  );
}

export default function RevealHeadline({ lines, accent = [], kicker, sub, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress: u } = useScroll({ target: ref, offset: ['start 92%', 'center 52%'] });
  const rule = useTransform(u, [0.55, 1], [0, 1]);
  const total = lines.flat().length;
  let n = 0;
  return (
    <div ref={ref} className={`min-h-[64vh] flex flex-col items-center justify-center text-center px-6 pt-28 pb-10 ${className}`}>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg/55 mb-6">{kicker}</p>
      <h2 className="font-display font-medium tracking-tight leading-[1.02] text-[clamp(44px,9vw,128px)] [text-shadow:0_0_28px_var(--bg),0_0_10px_var(--bg)]">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.map((w) => { const i = n++; return <Word key={w} u={u} i={i} total={total} accent={accent.includes(w)}>{w}</Word>; })}
          </span>
        ))}
      </h2>
      <motion.div style={{ scaleX: rule }} className="mt-8 h-px w-40 bg-accent origin-left" />
      <p className="mt-6 text-lg md:text-xl text-fg/65 font-light max-w-xl [text-shadow:0_0_18px_var(--bg)]">{sub}</p>
    </div>
  );
}
