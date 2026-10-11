import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { SECTIONS, PROJECTS, GROUP_LABEL, byId, isArchive } from '../data/projects';
import Icon from '../components/Icon';
import Ambient from '../components/Ambient';
import ProjectsIntro from '../components/ProjectsIntro';
import { useGo } from '../components/PageTransition';

const Block = ({ label, children }) => <div><h3 className="text-sm font-semibold text-fg/50 mb-3">{label}</h3>{children}</div>;
const Pill = ({ children, tone = 'line' }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tone === 'accent' ? 'bg-accent/15 text-accent border-accent/30' : 'bg-fg/5 text-fg/70 border-line'}`}>{children}</span>
);

// Projects without artwork get a generated cover (navy gradient + a batik motif) instead of a stock photo.
const COVER = { wip: ['ceplok', '#10284A'], featured: ['kawung', '#1F4E8C'] };
function Cover({ p, n }) {
  const [pat, tone] = COVER[p.group] || COVER.wip;
  return (
    <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-8 shadow-2xl text-white">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0B1B33 0%, ${tone} 100%)` }} />
      <div className={`pattern-fill b-${pat} absolute inset-0 opacity-30`} style={{ '--c2': 'rgba(157,181,207,.6)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,15,30,.75), transparent 60%)' }} />
      <span className="absolute top-6 left-7 font-mono text-xs uppercase tracking-[0.2em] text-white/70">{p.kicker}</span>
      <span className="absolute top-5 right-7 font-display text-6xl md:text-8xl text-white/15">{String(n).padStart(2, '0')}</span>
      <span className="absolute left-7 bottom-6 right-7 font-display text-2xl md:text-4xl font-medium tracking-tight leading-tight">{p.title}</span>
    </div>
  );
}

function CaseStudy({ p, n }) {
  const meta = [['Team', p.team], ['Role', p.role], ['Timeline', p.timeline]].filter(([, v]) => v);
  const chips = p.stack || p.tags;
  return (
    <motion.article id={'p' + p.id} data-id={p.id} className="scroll-mt-28"
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
      {p.image ? <img src={p.image} alt={p.title} className="w-full aspect-[16/9] object-cover rounded-3xl mb-8 shadow-2xl" /> : <Cover p={p} n={n} />}
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{p.kicker}</span>
        {p.status && <Pill tone="accent">{p.status}</Pill>}
        {p.coDev && <Pill>Co-Developed</Pill>}
      </div>
      <h3 className="text-3xl md:text-5xl font-display font-medium tracking-tight mb-3">{p.title}</h3>
      {p.tagline && <p className="text-xl text-fg/70 font-light mb-6 max-w-2xl">{p.tagline}</p>}
      {p.summary && <p className="text-lg text-fg/85 font-light leading-relaxed max-w-3xl mb-6">{p.summary}</p>}
      {(meta.length > 0 || chips) && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 text-sm mb-8 border-y border-line py-5">
          {meta.map(([k, v]) => <div key={k}><dt className="text-fg/45">{k}</dt><dd>{v}</dd></div>)}
          {chips && <div><dt className="text-fg/45">{p.stack ? 'Stack' : 'Focus'}</dt><dd className="flex flex-wrap gap-2 mt-1">{chips.map((t) => <span key={t} className="glass rounded-full px-3 py-0.5 text-xs">{t}</span>)}</dd></div>}
        </dl>
      )}
      <div className="grid gap-8 max-w-3xl text-fg/80 font-light leading-relaxed">
        {p.problem && <Block label="The problem"><p>{p.problem}</p></Block>}
        {p.approach && <Block label="What I did"><ul className="list-disc pl-5 space-y-1">{p.approach.map((a) => <li key={a}>{a}</li>)}</ul></Block>}
        {p.outcome && <Block label="Outcome"><ul className="space-y-1 text-fg">{p.outcome.map((o) => <li key={o}>{o}</li>)}</ul></Block>}
        {p.learnings && <Block label="What I learned"><p>{p.learnings}</p></Block>}
      </div>
      {!p.summary && !p.problem && <p className="text-fg/45 font-mono text-sm">Write-up coming soon.</p>}
      {p.links?.length > 0 && (
        <div className="flex gap-4 mt-8">
          {p.links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="glass rounded-full px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-ink inline-flex items-center gap-1.5">{l.label} <Icon name="upRight" size={14} /></a>)}
        </div>
      )}
    </motion.article>
  );
}

// archive entry: no picture, a short description
function ArchiveCard({ p }) {
  return (
    <article id={'p' + p.id} data-id={p.id} className="scroll-mt-28 glass rounded-2xl p-5 md:p-6 flex flex-col gap-2 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-lg md:text-xl font-medium tracking-tight leading-snug">{p.title}</h4>
        {p.coDev && <Pill>Co-Developed</Pill>}
      </div>
      <p className="text-sm md:text-[15px] text-fg/70 font-light leading-relaxed">{p.desc}</p>
    </article>
  );
}

export default function ProjectsPage() {
  const [sp] = useSearchParams();
  const go = useGo();
  const target = sp.get('p');
  const [cur, setCur] = useState(target || PROJECTS[0].id);
  const [open, setOpen] = useState(() => window.innerWidth >= 768);
  const [ready, setReady] = useState(false); // false while the folder intro plays
  const archiveGroups = SECTIONS[1].groups;
  const [openG, setOpenG] = useState(() => Object.fromEntries(archiveGroups.map((g) => [g.id, true])));
  const bounds = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => { document.documentElement.style.overflow = ready ? '' : 'hidden'; return () => { document.documentElement.style.overflow = ''; }; }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (target) {
      const g = byId[target]?.group;
      if (g && isArchive(byId[target])) setOpenG((o) => ({ ...o, [g]: true }));
      const jump = () => document.getElementById('p' + target)?.scrollIntoView({ behavior: 'instant' });
      setTimeout(jump, 60); setTimeout(jump, 700); // second pass once images/animations have settled
    } else window.scrollTo(0, 0);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCur(e.target.dataset.id)), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('[data-id]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);

  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const jumpGroup = (gid) => { setOpenG((o) => ({ ...o, [gid]: true })); setTimeout(() => jumpTo('g-' + gid), 30); };
  const activeKey = byId[cur] && isArchive(byId[cur]) ? 'g-' + byId[cur].group : cur;
  const setAll = (v) => setOpenG(Object.fromEntries(archiveGroups.map((g) => [g.id, v])));
  const allOpen = archiveGroups.every((g) => openG[g.id]);
  let n = 0; // running number for generated covers

  const navBtn = (key, label, onClick, extra) => (
    <button key={key} onClick={onClick}
      className={`relative w-full text-left rounded-xl px-3 py-1.5 text-[13px] leading-snug transition-colors flex items-center justify-between gap-2 ${activeKey === key ? 'text-fg' : 'text-fg/50 hover:text-fg/85'}`}>
      {activeKey === key && <motion.span layoutId="proj-active" className="absolute inset-0 rounded-xl bg-fg/10" />}
      <span className="relative">{label}</span>{extra}
    </button>
  );

  return (
    <main className="relative bg-bg text-fg min-h-screen pt-28 pb-36">
      <AnimatePresence>{!ready && <ProjectsIntro key="pi" onDone={() => setReady(true)} />}</AnimatePresence>
      <div className="fixed inset-0 z-0"><Ambient /></div>

      {/* floating, draggable guide: follows you down the page; drag it anywhere */}
      <div ref={bounds} className="fixed inset-0 z-[4000] pointer-events-none">
        <motion.aside drag dragConstraints={bounds} dragMomentum={false} dragElastic={0.08} whileDrag={{ scale: 1.02 }}
          className="glass pointer-events-auto absolute top-24 left-3 md:left-6 w-56 md:w-64 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-3xl p-3 select-none">
          <div className="flex items-center justify-between text-fg/50 mb-2 px-1">
            <span className="flex items-center gap-1 text-xs"><Icon name="grip" size={14} /> drag me</span>
            <button onClick={() => setOpen(!open)} aria-label="Toggle list" className="p-1 hover:text-fg">
              <Icon name="chevron" size={16} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
            </button>
          </div>
          <Link to="/" onClick={(e) => { e.preventDefault(); go('/'); }} className="flex items-center gap-2 rounded-2xl bg-fg/10 hover:bg-fg/20 px-3 py-2 text-sm font-semibold transition-colors">
            <Icon name="left" size={16} /> Back to home
          </Link>
          {open && (
            <div className="mt-3 space-y-4">
              {SECTIONS.map((sec) => (
                <div key={sec.id}>
                  <p className="px-3 mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{sec.label}</p>
                  {sec.id === 'projects'
                    ? sec.groups.map((g) => (
                        <div key={g.id} className="mb-2">
                          <p className="px-3 mb-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-fg/35">{g.label}</p>
                          {PROJECTS.filter((p) => p.group === g.id).map((p) => navBtn(p.id, p.heroTitle || p.title, () => jumpTo('p' + p.id)))}
                        </div>
                      ))
                    : sec.groups.map((g) => navBtn('g-' + g.id, g.label, () => jumpGroup(g.id), <span className="relative font-mono text-[10px] text-fg/40">{PROJECTS.filter((p) => p.group === g.id).length}</span>))}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 h-1 rounded-full bg-fg/10 overflow-hidden"><motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-accent origin-left" /></div>
        </motion.aside>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:pl-80 space-y-32">
        {/* ============ PROJECTS ============ */}
        <section className="space-y-28">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">01</p>
            <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight">Projects</h1>
          </header>
          {SECTIONS[0].groups.map((g) => (
            <div key={g.id} className="space-y-24">
              <div className="flex items-end gap-4 border-b border-line pb-4">
                <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">{g.label}</h2>
                <span className="ml-auto font-mono text-xs text-fg/40">{PROJECTS.filter((p) => p.group === g.id).length} projects</span>
              </div>
              {PROJECTS.filter((p) => p.group === g.id).map((p) => { n += 1; return <CaseStudy key={p.id} p={p} n={n} />; })}
            </div>
          ))}
        </section>

        {/* ============ ARCHIVES ============ */}
        <section className="space-y-10">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">02</p>
              <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight">Archives</h1>
              <p className="mt-4 text-lg text-fg/65 font-light max-w-xl">Past projects, challenges and case studies, each with a short description.</p>
            </div>
            <button onClick={() => setAll(!allOpen)} className="glass rounded-full px-5 py-2 text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors">{allOpen ? 'Collapse all' : 'Expand all'}</button>
          </header>

          {archiveGroups.map((g) => {
            const items = PROJECTS.filter((p) => p.group === g.id);
            return (
              <div key={g.id} id={'g-' + g.id} data-id={items[0].id} className="scroll-mt-28">
                <button onClick={() => setOpenG((o) => ({ ...o, [g.id]: !o[g.id] }))} aria-expanded={openG[g.id]}
                  className="w-full flex items-center gap-4 border-b border-line pb-4 text-left group">
                  <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">{g.label}</h2>
                  <span className="font-mono text-xs text-fg/40">{items.length}</span>
                  <span className="ml-auto w-9 h-9 rounded-full grid place-items-center bg-fg/10 group-hover:bg-accent group-hover:text-accent-ink transition-colors">
                    <Icon name="chevron" size={18} className={`transition-transform duration-300 ${openG[g.id] ? '' : '-rotate-90'}`} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openG[g.id] && (
                    <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="grid md:grid-cols-2 gap-4 pt-6">{items.map((p) => <ArchiveCard key={p.id} p={p} />)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
