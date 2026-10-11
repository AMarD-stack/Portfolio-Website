import { forwardRef, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import Ambient from './Ambient';

// A pinned scroll stage: the content stays fixed in the viewport while you scroll through
// `length` vh. `children` receives a 0..1 progress MotionValue for that pinned range.
//  tail    - extra vh pinned AFTER progress hits 1 (so the next section can cover it)
//  overlap - pulls this stage up over the previous one by that many vh (cover transitions)
//  edge    - draws a tumpal (batik triangle) edge on the leading side
//  ambient - paints the theme gradient behind the content
const Stage = forwardRef(function Stage({ id, length, tail = 0, overlap = 0, z, edge = false, ambient = false, className = '', children }, ref) {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  return (
    <motion.section ref={ref} id={id} className={`relative ${className}`}
      style={{ height: `${length + 100 + tail}vh`, marginTop: overlap ? `-${overlap}vh` : undefined, zIndex: z }}>
      {edge && <><div className="tumpal edge" /><div className="tumpal" /></>}
      <div ref={track} className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: `${length + 100}vh` }} />
      <div className="sticky top-0 h-screen overflow-hidden">
        {ambient && <Ambient />}
        {children(scrollYProgress)}
      </div>
    </motion.section>
  );
});
export default Stage;
