# Enterprise Blue — identity

**Idea:** trust first. Navy for depth, enterprise blue for credibility, a muted steel ("tan") blue for calm, and a little
sand as the warm counter-note. Batik motifs (kawung, parang, tumpal...) stay as the heritage signature.

## Tokens (`src/styles.css`)
Static: `navy-950 #060F1E · navy-900 #0B1B33 · navy-800 #10284A · blue-700 #1F4E8C · steel-500 #5F85B0 · steel-300 #9DB5CF · mist-100 #E7ECF2 · mist-50 #F3F6F9 · sand-400 #C9B48A · pac #F2C230 (game only)`

Mode-aware (flip on `<html data-theme>`): `bg · bg-2 · surface · fg · line · accent · accent-ink · sand`

| | Dark | Light |
|---|---|---|
| bg | `#07111F` | `#DCE4ED` (muted blue-grey, deliberately not bright) |
| fg | `#E8EEF6` | `#0C1B30` |
| accent | `#8DB1DE` | `#1F4E8C` |

Photographs are never filtered by the theme. Gradients (`Ambient.jsx`) are CSS-variable driven and lean toward the cursor.

## Type
Fraunces (display) · Inter (UI/body) · JetBrains Mono (labels).

## Sections
01 Projects (scroll-through banners) · 02 About (ID-card pack opening) · 03 Skills (zoom-in cards) · 04 Read (source grid) · 05 Play (full-page live ASCII/dither art + Pac-Man)

## Transitions
Preloader: counter, then wipe up · 1→2 iris · 2→3 tumpal cover · 3→4 Read slides up, headline writes in · 4→5 rounded sheet · /projects: folder showcase, wipe up.
