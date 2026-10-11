# Portfolio — Enterprise Blue (Vite + React + Tailwind v4)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the build locally
```

Dependencies: react, react-dom, react-router-dom, framer-motion, tailwindcss + @tailwindcss/vite, vite, @vitejs/plugin-react.

## Where to edit content
- `src/data/projects.js` — **Projects** (Featured + Work in progress, shown with pictures/covers) and **Archives** (listed with a short `desc`, grouped in dropdown sections). Add `role`, `timeline`, `stack`, `problem`, `approach`, `outcome`, `links` to any full project; `coDev: true` adds the Co-Developed badge.
- `src/data/skills.js` — the 6 skillset cards (Technology Stack, Machine learning, Product Development, Leadership Activities, Research Articles, Certifications): tools + logos and "where I applied it" links.
- `src/data/sources.js` — the Read grid (name + URL; every tile opens in a new tab).
- `src/lib/links.js` — Email / GitHub / LinkedIn (used by About, the dock and the certification links).
- `public/projects/*.jpg` — hero artwork (desktop `name.jpg`, phone `name-m.jpg`, folder-intro `name-thumb.jpg`).
- `public/portrait.jpg` — your photo for the About ID card.
- `public/logos/` — your own logo files (currently the Teach For Indonesia wordmark).

## Before launch
- Verify the OreMining claim (59% better accuracy than deep learning / up to 90% lower compute cost) against your results; see the `VERIFY` note in `projects.js`.
- Archive descriptions and the work-in-progress summaries are written from each project's title plus what is documented elsewhere (e.g. PT KAI, California Housing). Check each one, and replace with your own wording where you want more detail.
- Items in the skill lists that have no page of their own (e.g. AI SweetHome) are not linked.
- Skills logos are bundled (simple-icons). In the Read grid, brands without a bundled mark load their site icon from Google's favicon service at runtime and fall back to a text badge if it can't load.

## Scroll map (vh)
Hero banners 0–440 (4 × 110) → About iris 440–540 → About pack opening 540–940 → Skills cover 940–1040 →
Skills: per card (rest, zoom in, read, zoom out, slide) 112 each → grid → Read slides up → Play tucks over Read.
Tune pacing with `DW / IN / READ / OUT / PAN / ZOOM / HOLD` in `src/components/Skills.jsx` and `HERO_LEN` in `Hero.jsx`.

See `BRAND.md` for the colour/type/motif system.
