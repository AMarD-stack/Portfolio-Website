import DitherArt from './DitherArt';
import PacMan from './PacMan';
import RevealHeadline from './RevealHeadline';

// Section 5: the live ASCII/dither art IS the page here (a sticky, full-viewport canvas behind
// everything) — the headline writes itself in, the game sits on top, and the cursor paints.
export default function Play() {
  return (
    <section id="play" className="relative z-30 bg-bg" style={{ marginTop: '-2.5rem', borderRadius: '2.5rem 2.5rem 0 0', overflow: 'clip' }}>
      <div className="sticky top-0 h-screen -mb-[100vh] z-0 pointer-events-none"><DitherArt /></div>
      <div className="relative z-10">
        <RevealHeadline kicker="05 — Play" lines={[['Play', 'Pac-Man'], ['with', 'me.']]} accent={['Pac-Man', 'me.']} sub="Eat every data point. Avoid the ghosts." />
        <div className="flex justify-center px-4 pt-4"><PacMan /></div>
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-fg/55 pt-24 pb-44 [text-shadow:0_0_18px_var(--bg)]">move your cursor — paint with the data</p>
      </div>
    </section>
  );
}
