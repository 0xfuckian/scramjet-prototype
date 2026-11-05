# SCRAMJET // Design & 3D Interactive Prototype

> Production review prototype for **SCRAMJET** — Hypersonic Solana Token Launchpad & MEV Bundle Protocol.  
> Featuring interactive Three.js WebGL scenes, PBR studio lighting, kinetic typography, and motion-designed product elements.

---

## ⚡ Overview

This repository houses the standalone design prototype and WebGL laboratory for **SCRAMJET**. It is engineered to test, benchmark, and demonstrate the brand's visual identity, interactive 3D hero moments, and hypersonic UX patterns before integrating into the production Next.js application.

---

## 🚀 Key Prototype Highlights

### 1. 🕯️ The 3D God Candle Hero (`IntakeScene.jsx`)
* **True-to-Scale Candlestick Architecture**: Symmetrically framed chart with 6 preceding historical consolidation candles and the breakout monolith.
* **Locked Width & Depth**: Uniform `CANDLE_WIDTH = 0.28` and `CANDLE_DEPTH = 0.20` across all candles. Breakout eruption strictly scales in height ($h$), never widening or colliding with adjacent candles.
* **Timeline Gating**: Initial chop prints rapidly ($0 - 2.2\text{s}$), followed by the God Candle appearing as a normal candlestick before launching vertically into the stratosphere.
* **Cinematic Camera & Lighting**: Camera smoothly pulls back from $z = 4.1$ to $z = 5.6$ as the candle breaches orbital escape levels, accompanied by ascending market spark particles and a real-time HUD gain badge.

### 2. 🪐 12-Venue 3D Carousel Viewer (`VenueScene.jsx`)
Interactive 3D turntable featuring custom, physically based rendered (PBR) models for all 12 supported launchpads, illuminated by Three.js `RoomEnvironment` softbox studio lighting and `ACESFilmicToneMapping`:

| # | Venue | 3D Visual Asset | Materials & Highlights |
|---|---|---|---|
| 0 | **Pump.fun** | Two-tone Medical Capsule Pill | Mint green & porcelain white with high-gloss clearcoat sheen |
| 1 | **Meteora DBC** | Hypersonic Supersonic Dart | 24k bullion gold & titanium chiseled blade with plasma slipstream |
| 2 | **Raydium** | Faceted Diamond Crystal Prism | Refractive glass transmission core with gyroscopic electric cyan ring |
| 3 | **Bags** | Authentic Sculpted Money Bag | Saddle canvas burlap sack, braided gold rope, embossed `$` medallion & overflowing gold coins |
| 4 | **LetsBonk** | 24k Gold Sledgehammer of Velocity | Solid gold chamfered hammerhead, strike faceplates & knurled titanium shaft |
| 5 | **StonkFun** | Emerald Stonks Ascension Monolith | Tiered architectural pedestal with rocketing 3D emerald arrowhead |
| 6 | **Printr** | High-Speed Currency Minting Press | Gunmetal chassis, dual mirror chrome rollers & flowing minted banknote ribbon |
| 7 | **Anoncoin** | Stealth Operative Cyber Mask | Low-poly carbon-titanium cowl with cyan laser HUD visor & data ring |
| 8 | **Surge** | Crystalline Lightning Reactor | Continuous 3D zigzag crystal bolt encased in an electromagnetic containment torus |
| 9 | **Clanker** | Retro-Futuristic Autonomous AI Bot | Brushed titanium chassis, curved CRT screen with phosphor eyes `(● ‿ ●)` & brass dials |
| 10 | **FourMeme** | 24k Gold Lucky Quad-Amulet | Architectural gold '4' frame with four inset brilliant-cut emerald gems |
| 11 | **Flap** | Supersonic Cybernetic Delta Wings | Articulated swept delta wing blades with Mach turbine intake ring and thruster |

### 3. 🛸 Kinetic UI & Motion Engine
* **Kinetic Wordmark**: Split-line typographic entrance sequence with scrubbed scroll velocity.
* **3.5% Fee Lockup**: Prominent numeric fee statement showcasing 30% savings over legacy 5.0% launchpads.
* **Chapter Rail**: Pinned launchflow scrubber (Name ➔ Venue ➔ Fund ➔ Launch) with zero desync.
* **Telemetry Radar**: Radial Mach speedometer with real-time 5-engine Jito latency telemetry.
* **Savings Simulator**: Interactive slider calculating net capital savings across trading volume tiers.
* **Magnetic Ignition**: Spring-physics pointer-offset launch button.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: React 19 + Vite 7
* **3D & WebGL**: Three.js (`^0.180.0`) + React Three Fiber (`@react-three/fiber`) + `@react-three/postprocessing`
* **PBR Lighting**: Three.js native `RoomEnvironment` compiled via `PMREMGenerator` for realistic studio reflections
* **Animation & Motion**: GSAP 3 (ScrollTrigger) + Lenis smooth scroll
* **Typography**: `@fontsource/plus-jakarta-sans` & `@fontsource/jetbrains-mono`
* **Performance & Fallbacks**:
  * Low-power mode (caps pixel ratio to 1.0, disables bloom passes, freezes shaders)
  * Reduced-motion mode (`prefers-reduced-motion` compliant, bypasses canvases, provides static vector SVGs)

---

## 📁 Project Structure

```
scramjet-prototype/
├── design-prototype/             # Standalone review prototype application
│   ├── public/
│   │   └── fallbacks/            # Static SVGs for low-power & reduced-motion
│   ├── src/
│   │   ├── components/           # UI badges, navigation, and review controls
│   │   ├── data/                 # Launchpad definitions & proposal metadata
│   │   ├── perf/                 # Low-power & reduced-motion React context
│   │   ├── sections/             # Standalone element preview sections
│   │   ├── three/                # 3D WebGL scenes:
│   │   │   ├── IntakeScene.jsx   # God Candle Hero scene
│   │   │   ├── VenueScene.jsx    # 12-Venue 3D model carousel
│   │   │   ├── CascadeScene.jsx  # Atmospheric cascade visualizer
│   │   │   ├── RibbonScene.jsx   # Mach velocity ribbon
│   │   │   └── ShockScene.jsx    # Particle shock field
│   │   ├── App.jsx               # Main prototype preview switcher & catalog
│   │   └── styles.css            # Dark aerospace design system styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
* Node.js 18+
* npm or pnpm

### Running the Prototype

```bash
# 1. Navigate to the design prototype directory
cd design-prototype

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://localhost:5174 (or configured Vite port)
```

### Production Build

```bash
cd design-prototype
npm run build
npm run preview
```

---

## 🛡️ License

Private & Proprietary. SCRAMJET Protocol.
