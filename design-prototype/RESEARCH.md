# Research log

Visited in this session, November 2026. Award pages were fetched as text. Live sites were requested over HTTP and, where noted, their HTML and JS bundles were scanned for library strings (`WebGLRenderer` / `three.module`, `gsap`, `lenis`, `playcanvas`, `/_next/`, `_nuxt`, `webflow`, `rmcdn`). A string in a bundle is evidence the library shipped. Absence in the chunks that were scanned is not proof the library is missing if the file was code-split past the scan.

Phone-sized viewports were not resized for every site. Mobile notes below are only what the response or source actually said. If a site could not be opened, it is listed under "Not opened" and is not part of the count.

## Award indexes opened

- Sites of the Day: https://www.awwwards.com/websites/sites_of_the_day/
- Sites of the Month: https://www.awwwards.com/websites/sites_of_the_month/
- WebGL collection: https://www.awwwards.com/websites/webgl/

Direct requests to `awwwards.com` with curl returned 403. The fetches used for the notes below succeeded and returned article text.

## Candidates reviewed on the live site

1. **DeepBook** — https://deepbook.xyz/ (https://www.deepbook.tech/ redirected here). Award: https://www.awwwards.com/sites/deepbook — Site of the Day, 3 Nov 2026, score 7.37, Developer Award. Award page describes scroll, illustrated primitives, and hover. Live title was "DeepBook — Spot and prediction markets on Sui". Bundles scanned: Astro and GSAP. Three.js was not in those bundles. Holographik's public description of a scroll-led illustration system was not what the HTML title showed, so that marketing pass is treated as unverified on the current URL. Viewport meta was present. No desktop-only gate found.
2. **Grids** — https://grids.obys.agency/ — https://www.awwwards.com/sites/grids — score 7.83. The Site of the Day index dated this entry 2 Nov 2026. The award image path contains `/2021/08/`, so the file looks older than the index date. Both are recorded. Live page is a Readymag viewer (`rmcdn`), horizontal layout, palette `#000`, `#fff`, `#ECD06F`. No Three.js or GSAP in the document. Technique: typographic grid instruction, including a "crazy mode" control named on the award page. Mobile layout was not opened.
3. **Don't Look Up** — https://www.dontlookup.app/ — https://www.awwwards.com/sites/dont-look-up-game — Site of the Day, 1 Nov 2026, score 7.25, Developer Award. Award tools: GSAP, Three.js, vanilla JS. Those names are in the live HTML. A source comment says the nine-item distraction rail is desktop-only and a phone keeps a menu. The site does not hard-block phones. Technique: illustrated crowd, color as state, short tutorial cards.
4. **MECHA** — https://mecha.xyz/ — https://www.awwwards.com/sites/mecha — Site of the Day, 31 Oct 2026, score 7.28, Developer Award. Award tools: GSAP, Three.js, Webflow. Live bundles matched Three.js, GSAP, Lenis, and Webflow, plus a KTX string. Technique: editorial type with a light 3D and microinteraction layer. Widelab's case study says the mobile layout was designed on its own rather than shrunk from desktop. That claim was not rechecked by resizing.
5. **Spyker Cars** — https://spykercars.com/ — https://www.awwwards.com/sites/spyker-cars — Site of the Day, 30 Oct 2026, score 7.31, Developer Award. Award tools: WebGL, GSAP, storytelling. Live bundles: Next.js, GSAP, Lenis, and a KTX string. A Three.js signature was not in the six chunks scanned (38 scripts on the page). The Brink Agency case study describes scroll chapters of a day with the car, made as cinematic sequences. Mobile not resized.
6. **Unbelievably Crap** — https://www.unbelievablycrap.com/ — Site of the Day index, 29 Oct 2026, Liubomyr Ulytskyi. The award detail page was not fetched. Live document contains GSAP. Title: "Liubomyr Ulytskyi - Digital Designer". Deeper interaction was not inspected.
7. **G. Colombel — Portfolio 2026** — https://guillaumecolombel.fr/ — https://www.awwwards.com/sites/g-colombel-portfolio-2026 — Site of the Day, 28 Oct 2026, score 7.50, Developer Award. Award tools: WebGL, Three.js. Award elements include a fluid mouse interaction, carousel, and transitions. Live document is Nuxt. Chunks were not deep-scanned, so Three.js is from the award page only.
8. **Awards Racing** — https://awards.racing/ — Site of the Day index, 27 Oct 2026, Developer Award, Angelica P. Award detail page was not fetched. Live document: Nuxt and GSAP.
9. **A24 films homepage** — https://a24films.com/ loaded and a scanned chunk contained PlayCanvas. The Site of the Day index lists an A24 entry on 26 Oct 2026 by Ravi Klaassens. This visit does **not** confirm that URL is that submission.
10. **Forge Automotive** — https://forgeautomotive.co.uk/ — https://www.awwwards.com/sites/forge-automotive — Site of the Day, 25 Oct 2026, score 7.24, Developer Award. Award tools: WebGL, GSAP, Next.js. Award elements: introduction scrubbing, clip-path menu, WebGL exhaust on the 404. Live page is Next.js and includes a canvas. GSAP and Three.js strings were not in the first six of 23 chunks. A Mindsparkle note on the project names Next.js, GSAP, and Sanity. https://forgeautomotive.com/ failed TLS.
11. **Emotion Agency live site** — https://emotion-agency.com/ bundles contained Three.js, GSAP, Lenis, Nuxt, Draco, and KTX. https://www.awwwards.com/sites/emotion-agency returned an Honorable Mention dated 1 Jul 2021, while the Site of the Day index lists an Emotion Agency entry on 22 Oct 2026. Those two records were not reconciled, so the live site is not pinned to the October award. https://emotion.agency/ returned an empty title.
12. **Ascension — Pegassi** — https://ascension.pegassi.be/ — https://www.awwwards.com/sites/ascension-pegassi-r — Site of the Day, 21 Oct 2026, score 7.51, Developer Award. Award tools: GSAP, Three.js, Nuxt. Live bundle matched Three.js, GSAP, Lenis, Nuxt, Draco, and KTX. A third-party writeup describes an oversized wordmark, track columns, ScrollTrigger, and Lenis. No desktop-only phrase in the scan.
13. **FORMAT** — https://format.obys.agency/ — Site of the Day index, 19 Oct 2026, Obys, Developer Award. Live bundle: GSAP and Lenis. Three.js was not found. A KTX string was present and may be incidental. Technique read from the page shell: a typography lesson, not a 3D world.
14. **HeronAI** — https://www.heronai.com/ — Site of the Day index, 12 Oct 2026, Bearplus. Award detail page was not fetched. Live document is Webflow. Three.js was not in the HTML fetched. The visible page is a conventional product explanation.
15. **Why Zero** — https://why.zero.university/ — https://www.awwwards.com/sites/why-zero — Site of the Month, September 2026, score 7.73 on the award page, plus a Developer Award. Award tools: GSAP, Three.js, Blender. Award elements: narrative scroll, shaders, an interactive map, text sprites. Live bundle matched Three.js, GSAP, Draco, and KTX, and the document contains a canvas. The builder's own note says the site was made to run on a budget phone. Not retested on a phone here.
16. **learnwithzero.com** — https://zero.university/ redirected here. Lenis was in the document, plus a canvas. This is a sibling marketing URL, not the Why Zero piece above.
17. **EDOLUS** — https://edolus.com/ — https://www.awwwards.com/sites/edolus — Site of the Day, 4 Oct 2026, score 7.20, Developer Award. Award tools: WebGL, GSAP, GLSL. Live HTML includes PlayCanvas. An FWA case page describes PlayCanvas, custom GLSL, and scene chapters (data center, orbital, planetary). A GSAP string was not in the HTML scanned. Palette on the award page is `#000000`.
18. **Oryzo AI** — https://oryzo.ai/ — https://www.awwwards.com/sites/oryzo-ai — Site of the Month, April 2026, score 7.86. Award tools: WebGL, GSAP, Three.js. Award elements: sketch interaction, footer particles, a 3D-to-2D transition. Live bundle matched Astro, Three.js, GSAP, and KTX, with a canvas in the document.
19. **Bruno Simon** — https://bruno-simon.com/ — Site of the Month, January 2026, from the month index. Live HTML includes Three.js and a canvas. Title: "Bruno's". Technique visible from the page shell: a spatial WebGL portfolio rather than a document. Script bundles were inlined enough that the scan reported zero external scripts.
20. **TRIONN** — https://trionn.com/ — https://www.awwwards.com/sites/trionn-2 — score 7.42. The fetched award page did not include a date. Award tools: GSAP, Three.js, Next.js. Award elements include explosive scroll type and a 3D mark. Live scan: GSAP, Lenis, Next.js, and the word WebGL. Three.js was not in the six chunks scanned.
21. **Lusion** — https://lusion.co/ — studio site, not the Oryzo case. Astro, canvas, Three.js and a KTX string in the bundle. Useful only as the studio behind Oryzo.
22. **Zentry** — https://zentry.com/ — Site of the Month, August 2024, Resn, from the month index. The individual award page was not fetched. Live bundles: Three.js, GSAP, Lenis, Nuxt, canvas. Full-bleed WebGL marketing.
23. **Igloo Inc** — https://www.igloo.inc/ — Site of the Year 2024 from the month index. The main bundle scan found no Three, GSAP, or Lenis strings. No viewport meta in the HTML sample. Technique was not identified from source, so it is not used as a reference.
24. **Anime.js** — https://animejs.com/ — Site of the Month, May 2025, from the month index. Live bundles contained Three.js, Draco, and KTX (demo scenes). The page itself is the product for an animation engine: type, examples, and docs.
25. **Immersive Garden** — https://immersive-g.com/ — Site of the Month, January 2025, from the month index. https://www.immersive-garden.com/ returned 521. Live bundles: Three.js, GSAP, Lenis, Nuxt, KTX, canvas.
26. **Terminal Industries** — https://terminal-industries.com/ — Site of the Month, September 2025, REJOUICE, from the month index. Live bundles: GSAP, Lenis, Nuxt, and a KTX string. Three.js was not in the scripts scanned. Scroll-smoothed marketing page.
27. **Obys** — https://obys.agency/ — studio homepage. A canvas is in the HTML. No library strings in the document. Not the Grids or FORMAT projects.
28. **Active Theory** — https://activetheory.net/ loaded with no library strings in the document. https://active-theory.com/ returned 401. https://santioni.com/ failed TLS, so the Santioni Spirits award site was not opened.
29. **Shader Development Studio** — https://www.shader.se/ — https://www.awwwards.com/sites/shader-development-studio — score 7.73. The fetched page did not show the award date. Award tools: Next.js, WebGL, Three.js, React. Live scan matched Three.js, Lenis, Draco, and Next.js, with a canvas. GSAP was not in the chunks scanned.
30. **iyO** — https://www.iyo.ai/ — https://www.awwwards.com/sites/iyo — Site of the Day, 2 Apr 2026, score 7.68. Award tools: WebGL, Three.js, Webflow. Award elements: exploded product view, configurator, shader footer. Live document: Lenis, Webflow, and the word WebGL. Three.js was not in the six chunks scanned. The bundle contains a "rotate your" prompt, so portrait is not the intended view. https://www.iyo.world/ returned an empty document.
31. **Nightjar** — https://nightjar.co/ — studio homepage, no library strings in the document. This is not confirmed as the ESR Bespoke or Odyssée award sites (Site of the Day index, 23 Oct 2026 and 8 Oct 2026).
32. **Resn** — https://www.resn.co.nz/ — agency homepage, no library strings in the document. Not the Zentry, Navigate, or Tracing Art pieces.
33. **Dropbox Brand** — https://dropbox.design/ redirected to https://brand.dropbox.com/. Webflow markup. Site of the Month, February 2025, from the month index (Daybreak). The redirect target looks like guidelines, and that match was not proven beyond the URL.
34. **Floema** — https://floema.com/ — https://www.awwwards.com/sites/floema — score 7.65, and Site of the Month, May 2026, from the month index. Award tools: WebGL, GSAP, Nuxt. Award elements: scroll-zoom photography and a material 3D moment. Live document is Nuxt. Chunks were not deep-scanned, so GSAP and WebGL are from the award page. Title on the live page is in Portuguese.
35. **MindMarket** — https://mindmarket.com/ — https://www.awwwards.com/sites/mindmarket — score 7.85, Site of the Month, December 2025, from the month index. Award tools: GSAP, illustration, storytelling. No WebGL tag. Live document contains Lenis. GSAP was not confirmed in the first HTML slice. https://www.mindmarket.co/ returned an empty title.
36. **Lando Norris** — https://landonorris.com/ — https://www.awwwards.com/sites/lando-norris — score 8.18, Site of the Year 2025 from the month index. Award tools: WebGL, GSAP, Webflow. Palette `#D2FF00` / `#111112`. Live document contains Lenis and Webflow. WebGL and GSAP were not in the first 180 KB.

That is 36 live responses. The review count used for the brief is these visits, not the index rows that were never opened.

## Not opened

Listed on the Site of the Day index, with no live page retrieved in this session:

- Brandon Yasin (24 Oct 2026) — no URL found that was requested successfully
- ESR Bespoke, Signal-A, Belgrade Arbor, OFFF Forum, Overworld Audio, Huy Phan (handshake timeout on huyphan.com), Neutomni, Nick Ho (nickho.com returned 403), LPAS, Maria Vasilyeva, Odyssée, twks, Lidar Drone Scanning
- Cartier — Le Chœur des Pierres. The makemepulse case study loaded. https://www.cartier.com/en-us/lechoeurdespierres.html returned 403, so the live experience was not inspected. The case study describes choosing a gemstone and revealing the working drawing, in about 20 languages. It is not used as a technique source.

## What the visited set had in common

The pages that are actually doing the work share one scroll source, GSAP for the timeline, and Lenis when the scroll is smoothed. 3D is either one persistent canvas (Why Zero, Oryzo, Ascension, Bruno Simon, EDOLUS) or a small accent inside an HTML page (Mecha). Type-led pages (Grids, FORMAT, MindMarket, Anime.js) carry the content in the DOM. Several award pages claim WebGL where the chunks scanned on this pass did not show Three.js (Spyker, Forge, TRIONN, iyO). Those claims are kept as award-page claims, not as confirmed libraries.

## Shortlist

| Site | Why it is here | Bucket |
| --- | --- | --- |
| Why Zero | Confirmed Three.js + GSAP scroll story, and the builder says it was budgeted for a phone | 3D + scroll |
| Oryzo AI | Confirmed Three.js + GSAP object, particles, and a 3D-to-2D handoff | 3D product |
| Ascension | Confirmed Three.js + GSAP + Lenis, with a huge wordmark | 3D + type |
| EDOLUS | PlayCanvas world and GLSL chapters. Reference for a shader room, too heavy to ship | 3D scene |
| Shader Development Studio | Confirmed Three.js shader site | Shader |
| Mecha | Confirmed Three.js + GSAP + Lenis inside an editorial page | 3D accent |
| Spyker Cars | Confirmed GSAP + Lenis chapter scroll of a vehicle. WebGL is on the award page, not in the chunks scanned | Scroll story |
| Forge Automotive | Scrubbed intro and clip-path menu are named on the award page. Next.js confirmed live | Scroll + transition |
| Grids | Horizontal, typographic, no WebGL in the document | Type / layout |
| FORMAT | GSAP + Lenis type motion, no Three.js found | Type |
| MindMarket | Storytelling without a WebGL tag. Lenis confirmed live | Scroll, no 3D |
| Bruno Simon | Confirmed Three.js spatial navigation. Included so the "world" idea has a real example, and so it can be rejected for v1 | Immersive nav |

## Rejected for the first version, and why

- **Bruno Simon's world.** One canvas is the whole site. Content inside it is weak for search and for a phone, and it is a portfolio toy rather than a fee explanation.
- **EDOLUS as a full environment.** PlayCanvas, a black field, and little DOM. Wrong maintenance cost for a launch page.
- **Zentry and Immersive Garden.** Same full-canvas pattern as Why Zero, with less to steal once Why Zero is the scroll reference.
- **Don't Look Up.** The color-as-state idea is good and the phone path exists, but it is a game. A launch page should not depend on learning a crowd.
- **iyO's configurator.** The award page shows an exploded product. The live chunks scanned did not confirm Three.js, and the source asks you to rotate the phone. Too fragile as a model.
- **DeepBook's current URL.** The domain now serves the trading product. The scroll system described by the studio was not verified on that response.
- **Igloo.** Stack could not be identified from the bundle, so it cannot be a technique reference.
- **HeronAI, Resn, Nightjar, Obys, Active Theory homepages.** They are not the awarded experiences.
- **Grids' crazy mode.** The grid discipline is useful. The playful break is off the instrument tone.
- **A24 homepage.** PlayCanvas was real on the URL that loaded, and the award identity was not.
