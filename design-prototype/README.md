# SCRAMJET design prototype

Standalone review build of proposed homepage elements. It does not replace the Next.js app in the repository root, and it does not import that app.

```bash
cd design-prototype
npm install
npm run dev
```

Open the URL Vite prints (port 5173 unless `PORT` is set). Production check:

```bash
npm run build
npm run preview
```

## What you can do in the prototype

- Scroll the main page. Every proposal is a section.
- Switch a proposal off with its **On / Off** control. Open one on its own with **Alone** or `/element/<id>`.
- **Low power** caps the pixel ratio and removes the bloom pass. Viewports under 800px start in low power.
- **Preview reduced motion** forces the same path as `prefers-reduced-motion: reduce`.
- The written brief is at `/brief` and in `DESIGN_BRIEF.md`. The visit log is `RESEARCH.md`.

## Assumptions to verify

These filled the blanks in the request. Correct any of them and the proposals should be recut.

1. **Site.** SCRAMJET is the hypersonic Solana token launch platform already described in the root README and homepage: multi-venue launches and a 3.5% protocol fee. The prototype explains that public product. It does not demonstrate wallet-graph evasion, bundle tactics, or artificial volume.
2. **Audience.** People deciding whether to launch a token here instead of another Solana launch tool. They want the fee, the venue list, and a sense of speed.
3. **Brand.** Taken from the existing theme, not invented. Void `#08090C`, plasma `#FF3E00`, flare `#FF7700`, mint `#31E3AC`, stark `#F8FAFC`. Tone: instrument panel, fast, precise. The inlet-ramp mark already exists; this prototype redraws a simple version of that geometry and does not ship a new logo.
4. **Type.** Aeonik is named in the production Tailwind config and is not a free font. The prototype uses Plus Jakarta Sans and JetBrains Mono from the `fontsource` npm packages. No Google Fonts or other CDN.
5. **Goal.** A first screen that can carry a launch click, plus a short explanation of the sequence. Portfolio craft is in service of that, not instead of it.
6. **Constraints.** English only. The prototype must stay out of the production routes. Keyboard access, reduced motion, and a low-power path are required. No CMS, auth, or wallet connection in this build.
7. **Stack.** Vite + React + React Three Fiber for this review surface. The production app should stay on Next.js. Reasoning is in `DESIGN_BRIEF.md`.
8. **3D assets.** No downloaded models. Every mesh is built from Three.js primitives, so nothing approaches the 2 MB model cap.

## Routes

| Path | What it is |
| --- | --- |
| `/` | All proposals, with toggles |
| `/element/intake-hero` | One proposal. Same pattern for every id in `src/data/proposals.js` |
| `/brief` | `DESIGN_BRIEF.md` rendered in the page |
