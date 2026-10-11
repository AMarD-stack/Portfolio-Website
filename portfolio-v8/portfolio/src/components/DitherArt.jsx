import { useEffect, useRef } from 'react';
import { px, py } from '../lib/pointer';
import { useTheme } from '../lib/theme';

// Live ASCII / dither artwork. Soft blobs drift through a wavy (domain-warped) field; each cell
// takes the strongest blob, then an 8x8 Bayer matrix decides if it gets a mark: dense cores are
// solid pixels, the halo thins out into ASCII glyphs (. : + *). The cursor paints fading colour
// trails and a click throws a burst. Fills its (sticky, viewport-sized) parent.
const B8 = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21].map((v) => (v + 0.5) / 64);
const GLYPHS = ['.', ':', '+', '*'];
const PAL = { // light-mode ink is navy, dark-mode ink is near-white; the rest are shared
  ink: ['#0B1B33', '#E8EEF6'], orange: ['#F39C12', '#F39C12'], red: ['#E5322D', '#E5322D'], blue: ['#2A5BD7', '#5B8CF5'],
  cyan: ['#16B6DA', '#2FD0F0'], green: ['#25B866', '#34D27B'], magenta: ['#C2307E', '#E24A9B'], yellow: ['#E8B923', '#F2C230'],
};
const TRAIL_COLORS = ['blue', 'cyan', 'magenta', 'orange', 'red', 'green', 'yellow'];
// [colour, cx, cy, sigmaX, sigmaY, weight, orbitX, orbitY, speed, phase]  (fractions of the canvas)
const BLOBS = [
  ['ink', 0.80, 0.30, 0.060, 0.30, 1.0, 0.08, 0.10, 0.21, 0.0], ['orange', 0.84, 0.22, 0.040, 0.15, 1.1, 0.06, 0.08, 0.31, 1.7],
  ['red', 0.88, 0.50, 0.050, 0.14, 1.1, 0.05, 0.09, 0.27, 3.1], ['blue', 0.14, 0.34, 0.140, 0.36, 0.55, 0.10, 0.10, 0.16, 2.2],
  ['ink', 0.10, 0.80, 0.045, 0.24, 0.95, 0.05, 0.07, 0.20, 4.4], ['red', 0.07, 0.62, 0.030, 0.12, 0.95, 0.04, 0.06, 0.33, 0.9],
  ['green', 0.20, 0.18, 0.028, 0.11, 0.9, 0.06, 0.07, 0.29, 5.2], ['cyan', 0.50, 0.86, 0.070, 0.12, 0.6, 0.12, 0.05, 0.19, 1.1],
  ['magenta', 0.62, 0.12, 0.050, 0.10, 0.7, 0.09, 0.05, 0.23, 2.6], ['yellow', 0.34, 0.66, 0.030, 0.10, 0.8, 0.07, 0.06, 0.26, 3.9],
  ['blue', 0.92, 0.82, 0.100, 0.20, 0.5, 0.06, 0.08, 0.14, 0.4], ['orange', 0.04, 0.46, 0.026, 0.10, 0.85, 0.03, 0.06, 0.30, 4.9],
];

export default function DitherArt({ className = '' }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    const small = window.innerWidth < 768, CELL = small ? 10 : 8;
    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, onScreen = true, dpr = 1, sprites = null, spriteTheme = '';
    const trail = []; let lx = -999, ly = -999;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(cv);

    const buildSprites = (dark) => { // one tiny canvas per (colour x glyph): drawImage is far cheaper than fillText per cell
      const out = {}, px2 = Math.ceil(CELL * dpr);
      for (const [k, v] of Object.entries(PAL)) {
        out[k] = GLYPHS.map((g) => {
          const c = document.createElement('canvas'); c.width = c.height = px2;
          const x = c.getContext('2d'); x.fillStyle = v[dark ? 1 : 0]; x.font = `700 ${px2 * 1.15}px "JetBrains Mono", monospace`;
          x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(g, px2 / 2, px2 / 2 + px2 * 0.05); return c;
        });
      }
      return out;
    };
    const resize = () => {
      const r = cv.parentElement.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL); sprites = null;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv.parentElement);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onDown = (e) => { // click: a burst of colour
      const r = cv.getBoundingClientRect();
      for (let k = 0; k < 7; k++) trail.push({ x: e.clientX - r.left + (Math.random() - 0.5) * 80, y: e.clientY - r.top + (Math.random() - 0.5) * 80, t0: performance.now(), c: TRAIL_COLORS[(Math.random() * 7) | 0], s: 60 + Math.random() * 40 });
    };
    window.addEventListener('pointerdown', onDown);

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!onScreen || now - last < 33) return; // ~30fps is plenty for dither
      last = now;
      const dark = themeRef.current === 'dark', th = dark ? 'd' : 'l';
      if (!sprites || spriteTheme !== th) { sprites = buildSprites(dark); spriteTheme = th; }
      const t = reduce ? 0 : now / 1000;
      ctx.clearRect(0, 0, w, h);

      // cursor paint
      const r = cv.getBoundingClientRect(), mx = px.get() * innerWidth - r.left, my = py.get() * innerHeight - r.top;
      if (Math.hypot(mx - lx, my - ly) > 22 && mx > -50 && my > -50 && mx < w + 50 && my < h + 50) {
        trail.push({ x: mx, y: my, t0: now, c: TRAIL_COLORS[Math.floor(now / 260) % 7], s: 46 }); lx = mx; ly = my;
      }
      while (trail.length > 44 || (trail.length && now - trail[0].t0 > 3400)) trail.shift();

      const bl = [];
      for (const b of BLOBS) {
        const sx = b[3] * w, sy = b[4] * h;
        bl.push({ c: b[0], x: (b[1] + Math.sin(t * b[8] + b[9]) * b[6]) * w, y: (b[2] + Math.cos(t * b[8] * 0.8 + b[9]) * b[7]) * h, ix: 1 / (2 * sx * sx), iy: 1 / (2 * sy * sy), rx: sx * 2.7, ry: sy * 2.7, wt: b[5] });
      }
      for (const p of trail) {
        const age = (now - p.t0) / 3400, wt = Math.max(0, 1 - age) ** 1.4, s = p.s;
        bl.push({ c: p.c, x: p.x, y: p.y, ix: 1 / (2 * s * s), iy: 1 / (2 * s * s), rx: s * 2.7, ry: s * 2.7, wt });
      }

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const X0 = cx * CELL + CELL / 2, Y0 = cy * CELL + CELL / 2;
          // domain warp: ribbons instead of round blobs
          const X = X0 + 34 * Math.sin(Y0 * 0.011 + t * 0.5) + 14 * Math.sin(Y0 * 0.034 - t * 0.9);
          const Y = Y0 + 26 * Math.cos(X0 * 0.009 + t * 0.4);
          let best = 0, col = null;
          for (let k = 0; k < bl.length; k++) {
            const b = bl[k], dx = X - b.x, dy = Y - b.y;
            if (dx > b.rx || dx < -b.rx || dy > b.ry || dy < -b.ry) continue;
            const v = b.wt / (1 + (dx * dx * b.ix + dy * dy * b.iy) * 1.9) ** 2;
            if (v > best) { best = v; col = b.c; }
          }
          if (best < 0.05 || best <= B8[(cy & 7) * 8 + (cx & 7)]) continue;
          if (best > 0.78) { ctx.fillStyle = PAL[col][dark ? 1 : 0]; ctx.fillRect(cx * CELL, cy * CELL, CELL, CELL); }
          else if (best > 0.5) { ctx.fillStyle = PAL[col][dark ? 1 : 0]; ctx.fillRect(cx * CELL + 1.5, cy * CELL + 1.5, CELL - 3, CELL - 3); }
          else ctx.drawImage(sprites[col][best > 0.34 ? 3 : best > 0.22 ? 2 : best > 0.12 ? 1 : 0], cx * CELL, cy * CELL, CELL, CELL);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener('pointerdown', onDown); };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 ${className}`} />;
}
