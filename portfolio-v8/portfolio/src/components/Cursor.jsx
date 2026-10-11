import { useEffect, useRef } from 'react';

// Follows the native pointer (so speed = your mouse DPI) with only ~5% smoothing lag.
// Colour comes from --cursor, which the ASCII section sets so the ring matches the art.
export default function Cursor() {
  const outer = useRef(null), ring = useRef(null);
  useEffect(() => {
    const t = { x: -50, y: -50 }, c = { x: -50, y: -50 };
    let raf, ptr = false;
    const move = (e) => { t.x = e.clientX; t.y = e.clientY; ptr = !!e.target.closest?.('a, button, [role="button"]'); };
    const loop = () => {
      c.x += (t.x - c.x) * 0.95; c.y += (t.y - c.y) * 0.95;
      outer.current.style.transform = `translate3d(${c.x - 16}px,${c.y - 16}px,0)`;
      ring.current.style.transform = ptr ? 'scale(1.5)' : 'scale(1)';
      ring.current.style.backgroundColor = ptr ? 'var(--cursor, #fff)' : 'transparent';
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={outer} className="cursor-dot cursor-root fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'var(--cursor-blend, difference)' }}>
      <div ref={ring} className="w-full h-full rounded-full border-2 transition-[transform,background-color] duration-200"
        style={{ borderColor: 'var(--cursor, #fff)' }} />
    </div>
  );
}
