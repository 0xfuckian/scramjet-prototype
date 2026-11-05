# SCRAMJET design brief

This file belongs to the standalone prototype in `design-prototype/`. The Next.js app at the repository root was not modified.

## Assumptions

Correct these and the set should be recut.

- **Site.** SCRAMJET, a hypersonic Solana token launch platform: multi-venue deploy and a 3.5% protocol fee. Copy in the prototype stays on that public explanation.
- **Audience.** Someone comparing launch tools. They need the fee, the venues, and a reason to start.
- **Brand.** Existing tokens: void `#08090C`, plasma `#FF3E00`, flare `#FF7700`, mint `#31E3AC`, stark `#F8FAFC`. Tone is an instrument panel. The inlet-ramp mark already exists; this build redraws that geometry in primitives and SVG. Aeonik is named in production Tailwind and is not licensed here, so the prototype uses Plus Jakarta Sans and JetBrains Mono from npm.
- **Goal.** First-screen conviction and a short launch sequence, with enough craft to feel considered.
- **Constraints.** English. Separate from production routes. Keyboard, reduced motion, and a low-power path. No CMS, auth, or wallet in this prototype. No model file over 2 MB, because there are no model files.

## Stack

**Prototype:** Vite, React, React Three Fiber, Three.js, GSAP ScrollTrigger, Lenis.

**Production recommendation:** keep Next.js.

The real product already has routes (`/launch`, `/workspace`, `/marketplace`, `/docs`) and needs indexed copy. A marketing page inside that app can keep one canvas and still server-render the fee, the venues, and the steps. Moving the product to a Vite SPA would throw away that routing for no benefit.

This prototype is a single review surface and was required to stay out of the production app. Vite keeps the install to one folder, code-splits each WebGL scene, and does not pull the Solana dependencies. React Three Fiber matches the React codebase the team already ships. GSAP ScrollTrigger owns scrubbed timelines. Lenis is the only smooth-scroll source, and it is destroyed when reduced motion is on so the browser scroll is the source again. There is no second scroll library.

No CMS or auth is required for the proposals. If either arrives, it belongs in the existing Next.js app, not in a rewrite of this prototype.

## Research summary

Thirty-six live pages were opened, listed with URLs, awards, and what the source scan actually found in `RESEARCH.md`. Twelve are shortlisted. Award-index rows that never returned a live page are listed there as not opened, including the Cartier experience (403) and Nick Ho (403).

What the useful sites shared: one scroll story, GSAP for the timeline, Lenis when scroll is smoothed, and 3D as either one canvas or a small accent inside HTML. The pages that stay readable on a phone put the words in the DOM (Grids, FORMAT, MindMarket, Mecha's editorial layer).

Rejected for a first release, with reasons:

- Bruno Simon's drivable world, EDOLUS, Zentry, and Immersive Garden: the canvas is the page. Search, translation, and low-power phones all get worse, and the maintenance sits on a custom renderer.
- Don't Look Up: a game. The phone path exists, and it is still the wrong job.
- iyO: the award page shows an exploded product; the chunks scanned on iyo.ai did not confirm Three.js, and the source asks for rotation.
- DeepBook's current URL serves the trading product. The studio's scroll description was not verified on that response.
- Igloo: the bundle scan did not identify a library, so it is not a source.
- Studio homepages (Resn, Nightjar, Obys, Active Theory) are not the awarded pieces.
- Grids' "crazy mode" breaks the instrument tone. The grid itself does not.

## Proposals

Seventeen elements. Five use 3D. The instrument dial, hypersonic stream, telemetry radar, savings simulator, and architecture bento are original to the prototype. Fields in full are also on the prototype page.

| Element | Reference | Technique | 3D | Cost | Priority |
| --- | --- | --- | --- | --- | --- |
| Kinetic Wordmark | FORMAT, Ascension, Grids | Split-line reveal | No | Low | Ship |
| Fee Lockup | Grids, applied to the fee | Large numeric type | No | Low | Ship |
| Chapter Rail | MindMarket, Forge intro scrub | Pinned HTML timeline | No | Medium | Ship |
| Magnetic Ignition | Mecha microinteractions | Pointer-offset button | No | Low | Ship |
| Intake Hero | Spyker chapters, Oryzo object | Cursor-reactive 3D inlet, bloom removed in low power | Yes | High | Ship one 3D |
| Protocol Strip | Grids horizontal layout | Horizontal tape, keyboard nudges | No | Low | Later |
| Section Veil | Forge clip-path, Oryzo reveal | Route wipe | No | Low | Later |
| Hover Shear | Colombel fluid mouse (award page) | CSS shear, decorative crosshair, system cursor kept | No | Low | Later |
| Instrument Dial | Original | SVG scroll gauge | No | Low | Later |
| Venue Viewer | Oryzo, iyO award exploded view | Drag and button object viewer | Yes | Medium | Later, one route only |
| Mach Ribbon | EDOLUS, Shader studio | Fragment shader | Yes | Medium | Later, or as CSS |
| Shock Field | Oryzo particles | Pointer point cloud | Yes | Medium | Cut for v1 |
| Cascade Chamber | Why Zero narrative scroll | Scrubbed 3D chapter camera | Yes | High | Cut if the rail ships |
| Hypersonic Stream | Anime.js, EDOLUS flow lines | 2D HTML5 Canvas stream & reactive coordinate grid | No | Low | Ship |
| Telemetry Radar | Terminal Industries, Forge HUD | Radial Mach speedometer, slot ticker, 5-engine latency | No | Low | Ship |
| Savings Simulator | Grids comparison | Real-time commitment volume slider & net savings math | No | Low | Ship |
| Architecture Bento | MECHA, Ascension column layout | 4-card architectural bento & 12-protocol matrix | No | Low | Ship |

## Recommended combination

Ship these five together:

1. **Kinetic Wordmark** states the speed claim in type, which is what a phone will actually read.
2. **Fee Lockup** makes 3.5% the number people remember. It is the conversion.
3. **Chapter Rail** tells name, venue, fund, confirm without a second WebGL context.
4. **Intake Hero** is the one 3D object. It is the inlet the logo already is. Low power and reduced motion keep the SVG.
5. **Magnetic Ignition** puts the only playful motion on the launch control.

That set is one canvas, four HTML sections, and a shared plasma / void palette. The chamber, the ribbon, and the shock field are the same idea at a higher cost. The venue viewer is the right pattern for a later `/launch` step, not for the first screen beside the hero. Two WebGL contexts on the homepage will lose the phone budget the research kept pointing at.

## How the prototype behaves

- Main page shows every element. Each control toggles that section. `/element/<id>` shows one.
- Each 3D scene is a separate dynamic import. It mounts when the stage is near the viewport and unmounts when it leaves, so contexts do not pile up. The SVG stays up until the canvas reports ready.
- WebGL and `window` listeners run in effects on the client. The Vite app is client-rendered; nothing reads `window` at module scope except the low-power and reduced-motion checks, which bail out when `window` is missing.
- Low power forces pixel ratio 1, skips the bloom composer, freezes the shader, and draws fewer points.
- `prefers-reduced-motion: reduce` skips Lenis, leaves type in place, does not pin, and does not mount canvases. A preview button forces the same path. There is no `localStorage` or `sessionStorage`.
- Fonts and libraries come from npm. No external script tags.
- One `h1` on each route. Sections use `h2`, steps use `h3`. Canvases are `aria-hidden`. The crosshair is decorative and does not replace the system cursor.

## Risks

- **Performance.** Five 3D sections exist so they can be reviewed. Running them all on a phone is the failure mode. The recommended set keeps one. Bloom and a full-resolution shader are the first things low power removes. Lighthouse on the main page still has to download React, GSAP, and Lenis even when the canvases have not mounted.
- **Accessibility.** A custom cursor that hides the system pointer was rejected. Magnetic offset is pointer-only. Pins are removed for reduced motion. Canvas text is not used for the steps; the steps are HTML.
- **Mobile.** Default low power under 800px and for coarse pointers. Horizontal tape is a native scroller with buttons. The chamber's four cards stack. This was not lab-tested on a physical phone.
- **SEO.** Anything that matters (fee, venues, steps) is DOM text. Do not move it into WebGL. The production page should stay on Next.js so that text is in the first HTML response. This Vite prototype is a review tool and is not indexed as the product.
- **Maintenance.** Procedural meshes avoid a model pipeline. A real CAD inlet later has to stay under 2 MB compressed (Draco or Meshopt, KTX2 for textures) and needs the same SVG fallback. GSAP pins plus Lenis need one scroll source; adding a second smooth-scroll library will desync the rail. Aeonik, if it is licensed later, is a CSS swap, not a layout change.

## Open questions

- Which sentences on the current homepage have to survive on the new one, and which are legally off a public page?
- Is 3.5% versus 5.0% still the comparison to show?
- Should the marketing page live at `/` inside the Next app, with the terminal moving to a route, or should `/` stay the terminal?
- Is Aeonik licensed for the web, or is Plus Jakarta Sans an acceptable stand-in?
- Is a real inlet model coming, and who owns its polygon budget?
- Are the eight venue names in the strip the ones that should be public?
- Is English the only locale for the first release?
