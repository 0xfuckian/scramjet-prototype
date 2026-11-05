import { useEffect } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { PROPOSALS, PROPOSAL_MAP } from "./data/proposals.js";
import { usePerf } from "./perf/PerfProvider.jsx";
import { SmoothScroll } from "./scroll/SmoothScroll.jsx";
import { PrototypeProvider, usePrototype } from "./prototype/PrototypeContext.jsx";
import {
  ArchitectureBento,
  CascadeChamber,
  ChapterRail,
  ElementBody,
  FeeLockup,
  HoverShear,
  HypersonicStream,
  InstrumentDial,
  IntakeHero,
  KineticWordmark,
  MachRibbon,
  MagneticIgnition,
  ProtocolStrip,
  SavingsSimulator,
  SectionVeil,
  ShockField,
  TelemetryRadar,
  VenueMedallions,
  // 15 New Hypersonic Animation Proposals
  MempoolIntercept,
  CandleSurge,
  AntiMevShield,
  SonicScrubber,
  TerminalMatrix,
  BundleOrchestrator,
  LiquidityManifold,
  CockpitHud,
  TokenomicsCentrifuge,
  ComputeTachometer,
  AtomicClock,
  PlasmaNozzle,
  StealthPayload,
  VenueRouter,
  AblationShield,
} from "./sections/Elements.jsx";
import brief from "../DESIGN_BRIEF.md?raw";

function Cursor() {
  const { isActive } = usePrototype();
  const { motionOff } = usePerf();
  const shear = isActive("hover-shear");

  useEffect(() => {
    if (!shear || motionOff) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const node = document.createElement("div");
    node.className = "crosshair";
    node.setAttribute("aria-hidden", "true");
    document.body.appendChild(node);
    const move = (event) => {
      node.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      node.remove();
    };
  }, [shear, motionOff]);

  return null;
}

function Controls() {
  const { low, setLow, osReduced, forceReduced, setForceReduced, motionOff } = usePerf();
  const { enabled, toggle, openElement } = usePrototype();

  return (
    <aside className="controls" aria-label="Prototype controls">
      <p className="mark">SCRAMJET</p>
      <p className="controls-note">Review chrome. This column is not one of the proposals.</p>
      <div className="control-row">
        <button type="button" aria-pressed={low} onClick={() => setLow((value) => !value)}>
          {low ? "Low power on" : "Low power off"}
        </button>
        <button
          type="button"
          aria-pressed={forceReduced}
          onClick={() => setForceReduced((value) => !value)}
          disabled={osReduced}
        >
          {motionOff ? "Reduced motion on" : "Preview reduced motion"}
        </button>
      </div>
      <p className="controls-note">
        {osReduced
          ? "The operating system is asking for reduced motion. Animations stay off."
          : "Low power caps pixel ratio and removes bloom. Narrow screens start in low power."}
      </p>
      <details className="proposal-index">
        <summary>Proposal index</summary>
        <ul id="proposal-index">
        {PROPOSALS.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.name}</a>
            <button
              type="button"
              aria-pressed={enabled[item.id]}
              aria-label={`${enabled[item.id] ? "Hide" : "Show"} ${item.name}`}
              onClick={() => toggle(item.id)}
            >
              {enabled[item.id] ? "On" : "Off"}
            </button>
            <button type="button" onClick={() => openElement(item.id)}>
              Alone
            </button>
          </li>
        ))}
        </ul>
      </details>
      <p>
        <Link to="/brief">Written brief</Link>
      </p>
    </aside>
  );
}

function Home() {
  useEffect(() => {
    document.title = "SCRAMJET design prototype";
  }, []);

  return (
    <>
      <a className="skip" href="#content">
        Skip to proposals
      </a>
      <div className="shell">
        <Controls />
        <div className="sheet" id="content">
          <header className="intro">
            <p className="eyebrow">Design prototype · not the production site</p>
            <h1>Proposed elements for SCRAMJET</h1>
            <p className="lede">
              Thirty-one working sections and interactive animations for a hypersonic Solana launch platform. Switch any of them off,
              or open one on its own to review and approve animations.
            </p>
          </header>
          {/* Section 1: Hero & Market Speed */}
          <KineticWordmark />
          <IntakeHero />
          <CandleSurge />
          <HypersonicStream />
          <SonicScrubber />
          <CockpitHud />

          {/* Section 2: Mempool, MEV & Atomic Bundles */}
          <MempoolIntercept />
          <AntiMevShield />
          <BundleOrchestrator />
          <StealthPayload />
          <AtomicClock />

          {/* Section 3: Telemetry, Compute & Economics */}
          <TelemetryRadar />
          <ComputeTachometer />
          <FeeLockup />
          <SavingsSimulator />
          <LiquidityManifold />
          <TokenomicsCentrifuge />

          {/* Section 4: Engine Diagnostics & Multi-Venue Routing */}
          <PlasmaNozzle />
          <VenueMedallions />
          <VenueRouter />
          <ArchitectureBento />
          <ProtocolStrip />
          <TerminalMatrix />

          {/* Section 5: Transition Systems, Shaders & Aerodynamics */}
          <AblationShield />
          <ChapterRail />
          <CascadeChamber />
          <MachRibbon />
          <ShockField />
          <HoverShear />
          <MagneticIgnition />
          <SectionVeil />
          <InstrumentDial />
        </div>
      </div>
    </>
  );
}

function ElementRoute() {
  const { id } = useParams();
  const item = PROPOSAL_MAP[id];
  useEffect(() => {
    document.title = item ? `${item.name} · SCRAMJET prototype` : "Missing element · SCRAMJET prototype";
  }, [item]);

  if (!item) {
    return (
      <main className="missing">
        <h1>That element is not in the set</h1>
        <p>
          <Link to="/">Back to every proposal</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="solo">
      <p className="solo-back">
        <Link to={`/#${item.id}`}>All proposals</Link>
      </p>
      <p className="eyebrow">Single element</p>
      <h1 id="solo-title">{item.name}</h1>
      <p className="lede">{item.purpose}</p>
      <ElementBody id={item.id} />
    </main>
  );
}

function BriefRoute() {
  useEffect(() => {
    document.title = "Design brief · SCRAMJET prototype";
  }, []);
  return (
    <main className="brief">
      <p className="solo-back">
        <Link to="/">All proposals</Link>
      </p>
      <h1>Design brief</h1>
      <pre>{brief}</pre>
    </main>
  );
}

export default function App() {
  return (
    <PrototypeProvider>
      <SmoothScroll />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/element/:id" element={<ElementRoute />} />
        <Route path="/brief" element={<BriefRoute />} />
      </Routes>
    </PrototypeProvider>
  );
}
