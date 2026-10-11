import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll } from 'framer-motion';
import Reveal from '../components/Reveal';
import Stage from '../components/Stage';
import Hero, { HERO_LEN } from '../components/Hero';
import About, { ABOUT_LEN } from '../components/About';
import Skills, { SKILLS_LENGTH } from '../components/Skills';
import Read from '../components/Read';
import Play from '../components/Play';
import { navTarget } from '../lib/nav';

export default function Home() {
  const { state } = useLocation();

  // 0 -> 1 while the About iris opens over the (pinned) hero
  const aboutRef = useRef(null);
  const { scrollYProgress: iris } = useScroll({ target: aboutRef, offset: ['start end', 'start 15%'] });
  // 0 -> 1 while the Skills sheet slides up over the (pinned) About frame
  const skillsRef = useRef(null);
  const { scrollYProgress: cover } = useScroll({ target: skillsRef, offset: ['start end', 'start start'] });

  useEffect(() => {
    const to = state?.to;
    if (to && to !== 'projects') setTimeout(() => window.scrollTo({ top: navTarget(to), behavior: 'instant' }), 80);
    else window.scrollTo(0, 0);
  }, [state]);

  return (
    <main className="bg-bg">
      {/* 1     scroll through the 4 project banners (zoom-through between them) */}
      <Stage id="projects" length={HERO_LEN} tail={100} z={0}>{(p) => <Hero p={p} sink={iris} />}</Stage>
      {/* 1 -> 2  iris opens over the pinned hero */}
      <Reveal id="about" ref={aboutRef} progress={iris} z={10} overlap={100} className="bg-bg">
        <About sink={cover} />
      </Reveal>
      {/* 2 -> 3  tumpal cover: the sheet slides up over a pinned, dimming About */}
      <Stage id="skills" ref={skillsRef} length={SKILLS_LENGTH} overlap={100} z={20} edge ambient className="bg-bg-2">
        {(p) => <Skills p={p} />}
      </Stage>
      {/* 3 -> 4  Read slides up over the pinned skills grid; its headline writes itself in */}
      <Read />
      {/* 4 -> 5  Play tucks its rounded sheet over Read; the art fills the page */}
      <Play />
    </main>
  );
}
