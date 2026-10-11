import { motionValue } from 'framer-motion';
// Shared, normalised (0..1) pointer position. One listener for the whole app;
// the ambient gradient, ID-card tilt etc. all read from here.
export const px = motionValue(0.5);
export const py = motionValue(0.5);
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => { px.set(e.clientX / window.innerWidth); py.set(e.clientY / window.innerHeight); }, { passive: true });
}
