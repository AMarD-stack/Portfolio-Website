import { useEffect, useRef, useState } from 'react';

const MAP = [
  "###############", "#......#......#", "#.####.#.####.#", "#.#.........#.#", "#...##.#.##...#", "###.#     #.###",
  "#...#######...#", "#.#....P....#.#", "#.####.#.####.#", "#......#......#", "###############",
];
const W = 15, H = 11, S = 32, TICK = 300; // one cell per 300ms, drawn smoothly in between
const KEYS = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
const COLORS = ['#ff3b30', '#ff9ad5', '#32d6ff', '#ff9f0a'];
const CHASE = [0.85, 0.6, 0.4, 0.2];

const place = (o, x, y) => { o.x = o.px = x; o.y = o.py = y; };
const spawn = (s) => {
  s.pac = { dx: 0, dy: 0, next: [0, 0] }; place(s.pac, 7, 7);
  s.ghosts = [5, 6, 8, 9].map((x, i) => { const h = { dx: 0, dy: -1, c: COLORS[i] }; place(h, x, 5); return h; });
};
const fresh = () => {
  const grid = MAP.map((r) => [...r].map((c) => (c === '#' ? 1 : c === '.' ? 2 : 0)));
  const s = { grid, score: 0, lives: 3, tick: 0, status: 'ready', dots: grid.flat().filter((c) => c === 2).length };
  spawn(s);
  return s;
};

export default function PacMan() {
  const wrap = useRef(null), cv = useRef(null), g = useRef(fresh()), visible = useRef(false), last = useRef(0);
  const [ui, setUi] = useState({ score: 0, lives: 3, status: 'ready' });

  useEffect(() => {
    const walkable = (x, y) => { const v = g.current.grid[y]?.[x]; return v !== undefined && v !== 1; };

    const moveGhost = (h, i) => {
      const p = g.current.pac;
      let opts = [[0, -1], [0, 1], [-1, 0], [1, 0]].filter(([dx, dy]) => walkable(h.x + dx, h.y + dy) && !(dx === -h.dx && dy === -h.dy));
      if (!opts.length) opts = [[-h.dx, -h.dy]];
      const dist = ([dx, dy]) => (h.x + dx - p.x) ** 2 + (h.y + dy - p.y) ** 2;
      const [dx, dy] = Math.random() < CHASE[i] ? opts.reduce((a, b) => (dist(b) < dist(a) ? b : a)) : opts[(Math.random() * opts.length) | 0];
      h.dx = dx; h.dy = dy; h.x += dx; h.y += dy;
    };

    const step = () => {
      const s = g.current, p = s.pac;
      s.tick++;
      [p, ...s.ghosts].forEach((o) => { o.px = o.x; o.py = o.y; });
      if ((p.next[0] || p.next[1]) && walkable(p.x + p.next[0], p.y + p.next[1])) { p.dx = p.next[0]; p.dy = p.next[1]; }
      if (walkable(p.x + p.dx, p.y + p.dy)) { p.x += p.dx; p.y += p.dy; }
      if (s.grid[p.y][p.x] === 2) { s.grid[p.y][p.x] = 0; s.score += 10; s.dots--; }
      const hit = () => s.ghosts.some((h) => h.x === p.x && h.y === p.y);
      if (!hit() && s.tick % 4 !== 0) s.ghosts.forEach(moveGhost); // ghosts are 25% slower than Pac-Man
      if (hit()) { s.lives--; if (s.lives <= 0) s.status = 'lost'; else spawn(s); }
      else if (s.dots === 0) s.status = 'won';
      setUi({ score: s.score, lives: s.lives, status: s.status });
    };

    const draw = (f, now) => {
      const s = g.current, c = cv.current.getContext('2d');
      const L = (o, k) => (o['p' + k] + (o[k] - o['p' + k]) * f) * S + S / 2;
      c.clearRect(0, 0, W * S, H * S);
      s.grid.forEach((row, y) => row.forEach((v, x) => {
        if (v === 1) { c.fillStyle = 'rgba(27,42,92,.7)'; c.strokeStyle = '#6F86E0'; c.lineWidth = 2; c.beginPath(); c.roundRect(x * S + 2, y * S + 2, S - 4, S - 4, 6); c.fill(); c.stroke(); }
        else if (v === 2) { c.fillStyle = '#E7ECF2'; c.beginPath(); c.arc(x * S + S / 2, y * S + S / 2, 3, 0, 7); c.fill(); }
      }));
      const p = s.pac, r = S * 0.4, cx = L(p, 'x'), cy = L(p, 'y');
      const moving = p.x !== p.px || p.y !== p.py;
      const mouth = (moving ? Math.abs(Math.sin(now / 110)) : 0.3) * 0.28 * Math.PI + 0.03;
      const ang = Math.atan2(p.dy, p.dx);
      c.fillStyle = '#F2C230'; c.shadowColor = '#F2C230'; c.shadowBlur = 12;
      c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, ang + mouth, ang + 2 * Math.PI - mouth); c.fill(); c.shadowBlur = 0;
      s.ghosts.forEach((h) => {
        const gx = L(h, 'x'), gy = L(h, 'y'), w = (2 * r) / 3;
        c.fillStyle = h.c; c.beginPath(); c.arc(gx, gy, r, Math.PI, 0); c.lineTo(gx + r, gy + r);
        for (let k = 0; k < 3; k++) { c.lineTo(gx + r - (k + 0.5) * w, gy + r * 0.7); c.lineTo(gx + r - (k + 1) * w, gy + r); }
        c.fill();
        [-1, 1].forEach((e) => {
          c.fillStyle = '#fff'; c.beginPath(); c.arc(gx + e * r * 0.38, gy - r * 0.15, r * 0.27, 0, 7); c.fill();
          c.fillStyle = '#111'; c.beginPath(); c.arc(gx + e * r * 0.38 + h.dx * 2, gy - r * 0.15 + h.dy * 2, r * 0.13, 0, 7); c.fill();
        });
      });
    };

    let raf;
    const loop = (now) => {
      let f = 1;
      if (g.current.status === 'play' && visible.current) {
        if (!last.current) last.current = now;
        if (now - last.current >= TICK) { last.current = now; step(); }
        f = Math.min(1, (now - last.current) / TICK);
      } else last.current = 0;
      draw(f, now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(wrap.current);
    const key = (e) => {
      const d = KEYS[e.key];
      if (!d || g.current.status !== 'play' || !visible.current) return;
      e.preventDefault(); g.current.pac.next = d;
    };
    window.addEventListener('keydown', key, { passive: false });
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('keydown', key); };
  }, []);

  const start = () => { g.current = { ...fresh(), status: 'play' }; last.current = 0; setUi({ score: 0, lives: 3, status: 'play' }); };
  const over = ui.status === 'won' || ui.status === 'lost';

  return (
    <div ref={wrap} className="relative bg-navy-950/90 p-5 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-4 font-mono uppercase tracking-widest text-sm text-mist-100">
        <span>Score <b className="text-pac">{ui.score}</b></span>
        <span className="flex gap-1.5">{Array.from({ length: Math.max(ui.lives, 0) }).map((_, i) => <i key={i} className="w-3.5 h-3.5 rounded-full bg-pac" />)}</span>
      </div>
      <canvas ref={cv} width={W * S} height={H * S} className={`max-w-full h-auto transition duration-300 ${ui.status === 'ready' ? 'opacity-30 blur-sm' : ''}`} />
      {(ui.status === 'ready' || over) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-3xl bg-navy-950/60">
          {over && <h3 className="text-4xl font-bold text-pac">{ui.status === 'won' ? 'You win!' : 'Game over'}</h3>}
          <button onClick={start} className="px-6 py-3 rounded-full font-bold bg-pac text-navy-950 hover:brightness-110 transition">{over ? 'Play again' : 'Start game'}</button>
          <p className="text-mist-100/60 text-sm">Arrow keys or WASD</p>
        </div>
      )}
    </div>
  );
}
