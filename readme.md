# My Digital Playground

A **cyberpunk-flavored** drivable 3D playground — not a portfolio clone. Drive around, hit `//` markers, press **ENTER** for mood, thoughts, music, jokes, and quotes.

## Inspired by (not a copy of) folio-2025

We keep the **engine** (Three.js, Rapier, interact flow) from **[folio-2025](https://github.com/brunosimon/folio-2025)** (MIT) but re-skin it for this project:

- Neon / monospace UI (`sources/style/chaos-theme.styl`, legacy color tokens)
- Playground-only menu (achievements, circuit, whispers, behind-the-scene hidden)
- Your zones + copy in [`content/playground.json`](./content/playground.json)
- Landing name mesh hidden; social pedestals removed; dusk lighting locked
- MIT attribution remains in [license.md](./license.md)

The old **2D** site lives in [`legacy/`](./legacy/). World **geometry** is still folio’s low-poly map until you re-export Blender scenes — next step if you want it to feel fully original.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev
```

Open the URL Vite prints (car physics, interact zones, WebGL/WebGPU renderer). Use the in-game menu for controls and quality.

## Build & deploy (Cloudflare)

Static output is written to `dist/`:

```bash
npm run build
npm run preview   # optional local check
npm run deploy    # build + wrangler deploy (Workers static assets)
```

[`wrangler.jsonc`](./wrangler.jsonc) serves `./dist` as static assets with SPA-style fallback to `index.html`.

## Zone map

| Drive to | Marker label | Panel |
|----------|--------------|-------|
| Blacksmith / projects | Vibe shrine | Mood |
| Behind-the-scene portal | Thought bench | Thoughts |
| Time machine | Radio | Music (UI playlist) |
| Cookie area | Comedy board | Jokes |
| Lab | Fortune kiosk | Quotes |

Home menu (**M**) includes the rebranded welcome copy.

## Content

Edit [`content/playground.json`](./content/playground.json) — moods, thoughts, songs, jokes, and quotes are loaded by [`sources/Game/PlaygroundPanels.js`](./sources/Game/PlaygroundPanels.js).
