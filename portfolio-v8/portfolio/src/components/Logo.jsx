import { LOGOS } from '../lib/logos';
import Icon from './Icon';

// k: 'python' (bundled brand mark) | 'g:db' (generic glyph) | 'a:XGB' (text badge) | 'img:/logos/x.png' (image) | undefined -> monogram of `name`
export default function Logo({ k, name = '', size = 20, className = '' }) {
  const mono = (name.match(/[A-Za-z0-9]+/g) || []).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  if (k && LOGOS[k]) return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d={LOGOS[k].path} /></svg>;
  if (k?.startsWith('img:')) return <img src={k.slice(4)} alt={name} height={size} style={{ height: size, width: 'auto' }} className={className} />;
  if (k?.startsWith('g:')) return <Icon name={k.slice(2)} size={size} className={className} />;
  const text = k?.startsWith('a:') ? k.slice(2) : mono;
  return <span className={`inline-grid place-items-center font-mono font-bold leading-none ${className}`} style={{ width: size, height: size, fontSize: size * (text.length > 2 ? 0.34 : 0.44) }} aria-hidden="true">{text}</span>;
}
