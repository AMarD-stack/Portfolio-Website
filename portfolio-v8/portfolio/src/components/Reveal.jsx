import { forwardRef } from 'react';
import { motion, useTransform } from 'framer-motion';

// Section 1 -> 2 transition: the incoming section is clipped by a circle that opens
// like a camera iris as you scroll. `progress` (0..1) comes from the parent so the
// section underneath can react to it too.
const iris = (v) => `circle(${(v * v * 140).toFixed(1)}% at 50% 40vh)`;

const Reveal = forwardRef(function Reveal({ id, z, overlap = 0, progress, className = '', children }, ref) {
  const clipPath = useTransform(progress, (v) => (v >= 0.995 ? 'none' : iris(Math.max(0, v))));
  return (
    <motion.section ref={ref} id={id} style={{ clipPath, zIndex: z, marginTop: overlap ? `-${overlap}vh` : undefined }} className={`relative ${className}`}>
      {children}
    </motion.section>
  );
});
export default Reveal;
