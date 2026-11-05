import { lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROPOSAL_MAP } from "../data/proposals.js";
import { usePerf } from "../perf/PerfProvider.jsx";
import { gsap, ScrollTrigger } from "../scroll/SmoothScroll.jsx";
import { LazyStage } from "../three/LazyStage.jsx";
import { usePrototype } from "../prototype/PrototypeContext.jsx";

const IntakeScene = lazy(() => import("../three/IntakeScene.jsx"));
const RibbonScene = lazy(() => import("../three/RibbonScene.jsx"));
const CascadeScene = lazy(() => import("../three/CascadeScene.jsx"));
const ShockScene = lazy(() => import("../three/ShockScene.jsx"));
const VenueScene = lazy(() => import("../three/VenueScene.jsx"));

import {
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
} from "./NewHypersonicElements.jsx";

export {
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
};

const VENUES = [
  { name: "Pump.fun", note: "Bonding curve" },
  { name: "Meteora DBC", note: "Dynamic fee" },
  { name: "Raydium", note: "LaunchLab" },
  { name: "Bags", note: "Creator share" },
  { name: "LetsBonk", note: "Bonk native" },
  { name: "StonkFun", note: "Token-2022" },
  { name: "Printr", note: "Supply scaler" },
  { name: "Anoncoin", note: "Privacy curve" },
  { name: "Surge", note: "Instant AMM" },
  { name: "Clanker", note: "AI autonomous" },
  { name: "FourMeme", note: "Fast bonding" },
  { name: "Flap", note: "Fair launch" },
];

const CHAPTERS = [
  { k: "01", title: "Name it", copy: "A ticker, a supply, and one sentence a stranger can repeat." },
  { k: "02", title: "Pick a venue", copy: "Twelve Solana venues. The page should make that a choice, not a logo wall." },
  { k: "03", title: "Fund the wallet", copy: "The launch wallet is funded before the transaction is sent." },
  { k: "04", title: "Confirm", copy: "Solana finalizes the launch. The page returns to the terminal." },
];

function Meta({ id }) {
  const item = PROPOSAL_MAP[id];
  return (
    <footer className="meta">
      <span className="meta-num">{item.numStr}</span>
      <span>{item.three ? "3D" : "No 3D"}</span>
      <span>Cost {item.cost}</span>
      <span>{item.original ? "Original" : "Technique reference"}</span>
      <span>{item.technique}</span>
      {item.referenceUrl ? (
        <a href={item.referenceUrl} target="_blank" rel="noreferrer">
          Award page
        </a>
      ) : (
        <span>No award page</span>
      )}
    </footer>
  );
}

function Block({ id, children, className = "" }) {
  const { isActive, solo } = usePrototype();
  if (!isActive(id)) return null;
  const item = PROPOSAL_MAP[id];
  const headingId = solo === id ? "solo-title" : `${id}-title`;
  return (
    <section id={id} className={`block ${className}`} aria-labelledby={headingId}>
      <div className="block-copy">
        <p className="eyebrow">
          <span className="proposal-badge">PROPOSAL {item.numStr}</span>
          <span className="eyebrow-sep">·</span>
          <span>{item.three ? "3D PROPOSAL" : "LIGHTWEIGHT PROPOSAL"}</span>
        </p>
        {solo === id ? null : (
          <h2 id={`${id}-title`}>
            <span className="proposal-heading-num">{item.numStr}</span> {item.name}
          </h2>
        )}
        <p>{item.purpose}</p>
        <p className="fit">{item.fit}</p>
        <p className="fallback">
          <strong>Fallback. </strong>
          {item.fallback}
        </p>
      </div>
      <div className="block-stage">{children}</div>
      <Meta id={id} />
    </section>
  );
}

export function IntakeHero() {
  return (
    <Block id="intake-hero">
      <div className="god-candle-wrap">
        <LazyStage scene={IntakeScene} fallback="/fallbacks/godcandle.svg" label="God candle hero" />
        <div className="candle-hint">
          <span className="live-dot" />
          <span>Click / tap the 3D candle to trigger a Mega Pump surge</span>
        </div>
      </div>
    </Block>
  );
}

export function MachRibbon() {
  return (
    <Block id="mach-ribbon">
      <LazyStage scene={RibbonScene} fallback="/fallbacks/ribbon.svg" label="Mach ribbon" />
    </Block>
  );
}

export function VenueMedallions() {
  const [focus, setFocus] = useState(0);

  return (
    <Block id="venue-medallions">
      <div className="venue-medallions-wrap">
        <div className="medallions-stage">
          <LazyStage
            scene={VenueScene}
            fallback="/fallbacks/venues.svg"
            label="Machined Titanium Medallions"
            sceneProps={{ focus }}
          />
        </div>
        <div className="venue-controls" role="group" aria-label="Machined Titanium Medallions">
          {VENUES.map((venue, index) => (
            <button
              key={venue.name}
              type="button"
              className={`venue-btn ${focus === index ? "active" : ""}`}
              aria-pressed={focus === index}
              onClick={() => setFocus(index)}
            >
              <span className="v-name">{venue.name}</span>
              <span className="v-note">{venue.note}</span>
            </button>
          ))}
        </div>
      </div>
    </Block>
  );
}

export function CascadeChamber() {
  const track = useRef(null);
  const progress = useRef(0);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("cascade-chamber");

  useEffect(() => {
    if (motionOff || !active) return undefined;
    const steps = track.current?.querySelectorAll("[data-step]");
    const trigger = ScrollTrigger.create({
      trigger: track.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        progress.current = self.progress;
        const active = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
        steps?.forEach((node, index) => node.classList.toggle("is-on", index === active));
      },
    });
    return () => trigger.kill();
  }, [motionOff, active]);

  return (
    <Block id="cascade-chamber" className="is-wide">
      <div ref={track} className={motionOff ? "cascade is-flat" : "cascade"}>
        <div className="cascade-sticky">
          <LazyStage
            scene={CascadeScene}
            fallback="/fallbacks/cascade.svg"
            label="Cascade chamber"
            sceneProps={{ progressRef: progress }}
          />
          <ol className="chapters">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.k} data-step className={motionOff || chapter.k === "01" ? "is-on" : undefined}>
                <span>{chapter.k}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Block>
  );
}

export function ShockField() {
  return (
    <Block id="shock-field">
      <LazyStage scene={ShockScene} fallback="/fallbacks/shock.svg" label="Shock field" />
    </Block>
  );
}

export function KineticWordmark() {
  const root = useRef(null);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("kinetic-wordmark");

  useEffect(() => {
    if (motionOff || !active) return undefined;
    const lines = root.current?.querySelectorAll(".line span");
    const tween = gsap.from(lines, {
      yPercent: 110,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    return () => tween.kill();
  }, [motionOff, active]);

  return (
    <Block id="kinetic-wordmark">
      <div ref={root} className="wordmark" aria-hidden="true">
        <p className="line"><span>Hypersonic</span></p>
        <p className="line"><span>launches.</span></p>
        <p className="line accent"><span>3.5% fee.</span></p>
      </div>
      <p className="sr-only">Hypersonic launches. 3.5% fee.</p>
    </Block>
  );
}

export function ChapterRail() {
  const root = useRef(null);
  const bar = useRef(null);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("chapter-rail");

  useEffect(() => {
    if (motionOff || !active) return undefined;
    const items = root.current?.querySelectorAll("li");
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        const active = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
        items?.forEach((node, index) => node.classList.toggle("is-on", index <= active));
      },
    });
    return () => trigger.kill();
  }, [motionOff, active]);

  return (
    <Block id="chapter-rail">
      <div ref={root} className={motionOff ? "rail-story is-flat" : "rail-story"}>
        <div className="rail-sticky">
          <div className="progress" aria-hidden="true">
            <span ref={bar} />
          </div>
          <ol>
            {CHAPTERS.map((chapter) => (
              <li key={chapter.k} className={motionOff ? "is-on" : undefined}>
                <span>{chapter.k}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Block>
  );
}

export function ProtocolStrip() {
  const scroller = useRef(null);
  const { motionOff } = usePerf();
  const protocols = ["Pump.fun", "Meteora DBC", "Raydium LaunchLab", "Bags", "LetsBonk", "StonkFun", "Anoncoin", "Surge"];

  function nudge(direction) {
    scroller.current?.scrollBy({
      left: direction * 240,
      behavior: motionOff ? "auto" : "smooth",
    });
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudge(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudge(-1);
    }
  }

  return (
    <Block id="protocol-strip">
      <div className="strip-wrap">
        <div className="strip-actions">
          <button type="button" onClick={() => nudge(-1)} aria-label="Scroll venues backward">
            Back
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Scroll venues forward">
            Forward
          </button>
        </div>
        <div
          ref={scroller}
          className="strip"
          tabIndex={0}
          data-lenis-prevent
          data-lenis-prevent-wheel
          onKeyDown={onKeyDown}
          aria-label="Venue tape"
        >
          {protocols.map((name, index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <h3>{name}</h3>
            </article>
          ))}
        </div>
      </div>
    </Block>
  );
}

export function MagneticIgnition() {
  const button = useRef(null);
  const { motionOff } = usePerf();
  const { openElement } = usePrototype();

  function onMove(event) {
    if (motionOff || !button.current) return;
    const rect = button.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    button.current.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }

  function onLeave() {
    if (button.current) button.current.style.transform = "";
  }

  return (
    <Block id="magnetic-ignition">
      <div className="ignition" onMouseMove={onMove} onMouseLeave={onLeave}>
        <button ref={button} type="button" onClick={() => openElement("intake-hero")}>
          Launch a token
        </button>
        <p>Pointer offset only. Keyboard users get the same button with a focus ring.</p>
      </div>
    </Block>
  );
}

export function FeeLockup() {
  const number = useRef(null);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("fee-lockup");

  useEffect(() => {
    const node = number.current;
    if (!node) return undefined;
    if (motionOff || !active) {
      node.textContent = "3.5%";
      return undefined;
    }
    const state = { value: 5 };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(state, {
          value: 3.5,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = `${state.value.toFixed(1)}%`;
          },
        });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(state);
    };
  }, [motionOff, active]);

  return (
    <Block id="fee-lockup">
      <div className="fee">
        <p className="fee-figure" ref={number}>
          5.0%
        </p>
        <p>
          Protocol fee on this proposal. The comparison figure on the current site is 5.0%.
        </p>
      </div>
    </Block>
  );
}

export function HoverShear() {
  return (
    <Block id="hover-shear">
      <ul className="shear-list">
        {[
          ["01", "Block-0 send"],
          ["02", "Fee routed"],
          ["03", "Terminal open"],
        ].map(([index, label]) => (
          <li key={index}>
            <a href="#magnetic-ignition">
              <span>{index}</span>
              <strong>{label}</strong>
            </a>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export function SectionVeil() {
  const { openElement } = usePrototype();
  return (
    <Block id="section-veil">
      <div className="veil-demo">
        <button type="button" onClick={() => openElement("kinetic-wordmark")}>
          Open the wordmark alone
        </button>
        <p>The wipe runs only when this proposal is on and motion is allowed.</p>
      </div>
    </Block>
  );
}

export function InstrumentDial() {
  const dial = useRef(null);
  const value = useRef(null);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("instrument-dial");

  useEffect(() => {
    if (!active) return undefined;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (dial.current) dial.current.style.transform = `rotate(${progress * 270 - 135}deg)`;
      if (value.current) value.current.textContent = `${Math.round(progress * 100)}`;
      if (dial.current?.parentElement) {
        dial.current.parentElement.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
      }
    };
    update();
    if (motionOff) {
      window.addEventListener("scroll", update, { passive: true });
      return () => window.removeEventListener("scroll", update);
    }
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
    });
    return () => trigger.kill();
  }, [motionOff, active]);

  return (
    <Block id="instrument-dial">
      <div
        className="dial"
        role="progressbar"
        aria-label="Page progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="46" />
          <line ref={dial} x1="60" y1="60" x2="60" y2="22" />
        </svg>
        <p>
          Mach <span ref={value}>0</span>
        </p>
      </div>
    </Block>
  );
}

export function HypersonicStream() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const { low, motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("hypersonic-stream");

  useEffect(() => {
    if (!active || motionOff) return undefined;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let animId = 0;
    const streakCount = low ? 25 : 65;
    const gridSpacing = 44;

    const streaks = [];
    function initStreaks() {
      streaks.length = 0;
      for (let i = 0; i < streakCount; i++) {
        streaks.push({
          x: Math.random() * (width || 600),
          y: Math.random() * (height || 360),
          length: 40 + Math.random() * 110,
          speed: (low ? 2 : 4) + Math.random() * (low ? 3 : 7),
          opacity: 0.2 + Math.random() * 0.5,
          width: 0.8 + Math.random() * 1.5,
          hue: Math.random() > 0.75 ? "#FF7700" : "#FF3E00",
        });
      }
    }

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = low ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || 600;
      height = Math.max(340, rect.height || 340);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (streaks.length === 0) initStreaks();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const render = () => {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      ctx.fillStyle = "rgba(8, 9, 12, 0.45)";
      ctx.fillRect(0, 0, width, height);

      // Coordinate Grid Dots
      const cols = Math.ceil(width / gridSpacing);
      const rows = Math.ceil(height / gridSpacing);
      const maxProximity = low ? 120 : 180;

      for (let c = 0; c <= cols; c++) {
        const x = c * gridSpacing;
        for (let r = 0; r <= rows; r++) {
          const y = r * gridSpacing;
          const dist = Math.hypot(x - mouseX, y - mouseY);

          if (dist < maxProximity) {
            const glow = (1 - dist / maxProximity) * 0.65;
            ctx.fillStyle = `rgba(255, 62, 0, ${glow})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = "rgba(28, 37, 51, 0.4)";
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Supersonic particle streaks
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.x += s.speed;
        if (s.x > width + s.length) {
          s.x = -s.length;
          s.y = Math.random() * height;
        }

        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
        grad.addColorStop(0, "rgba(255, 62, 0, 0)");
        grad.addColorStop(0.7, s.hue);
        grad.addColorStop(1, "#FFFFFF");

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.length, s.y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [active, low, motionOff]);

  return (
    <Block id="hypersonic-stream">
      <div ref={containerRef} className="hypersonic-stream-stage">
        {motionOff ? (
          <img
            src="/fallbacks/hypersonic.svg"
            alt="Hypersonic stream static fallback"
            className="stream-fallback"
          />
        ) : (
          <canvas ref={canvasRef} className="stream-canvas" aria-hidden="true" />
        )}
        <div className="stream-overlay">
          <span className="badge">MACH HYPERSONIC FLOW</span>
          <p>Cursor proximity warps grid coordinate lattice; particle velocity throttles to power profile.</p>
        </div>
      </div>
    </Block>
  );
}

export function TelemetryRadar() {
  const [slot, setSlot] = useState(318492810);
  const [machPreset, setMachPreset] = useState("3.5");
  const [machValue, setMachValue] = useState(3.52);
  const [activeEngine, setActiveEngine] = useState(0);
  const { motionOff } = usePerf();
  const { isActive } = usePrototype();
  const active = isActive("telemetry-radar");

  const engines = [
    { code: "FRA", city: "Frankfurt", ping: 12, status: "OPT" },
    { code: "AMS", city: "Amsterdam", ping: 14, status: "OPT" },
    { code: "NYC", city: "New York", ping: 8, status: "OPT" },
    { code: "TYO", city: "Tokyo", ping: 22, status: "OPT" },
    { code: "SLC", city: "Salt Lake", ping: 6, status: "OPT" },
  ];

  const [pings, setPings] = useState(() => engines.map((e) => e.ping));

  useEffect(() => {
    if (!active || motionOff) return undefined;
    const interval = setInterval(() => {
      setSlot((s) => s + Math.floor(1 + Math.random() * 2));
      const base = Number(machPreset);
      setMachValue(Number((base + (Math.random() - 0.5) * 0.08).toFixed(2)));
      setPings((prev) =>
        prev.map((p) => Math.max(4, p + Math.floor((Math.random() - 0.5) * 3)))
      );
    }, 450);
    return () => clearInterval(interval);
  }, [active, motionOff, machPreset]);

  const targetMach = Number(machPreset);
  const strokeOffset = Math.max(0, 251.2 - (targetMach / 12) * 251.2);

  return (
    <Block id="telemetry-radar">
      <div className="radar-console">
        <div className="radar-header">
          <div className="radar-live">
            <span className="ping-beacon" />
            <span className="live-label">Telemetry Feed // Block-0 Radar</span>
          </div>
          <div className="radar-slot">
            <span>SOLANA SLOT:</span>
            <strong>{slot.toLocaleString()}</strong>
          </div>
        </div>

        <div className="radar-body">
          <div className="radar-dial-wrap">
            <svg className="radar-dial-svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" className="track" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="indicator"
                strokeDasharray="251.2"
                strokeDashoffset={strokeOffset}
              />
            </svg>
            <div className="radar-dial-center">
              <span className="cap">VELOCITY</span>
              <span className="num">{motionOff ? machPreset : machValue.toFixed(2)}</span>
              <span className="unit">MACH</span>
            </div>
          </div>

          <div className="radar-info">
            <div className="status-badge">HYPERSONIC STATUS: CASCADE ACTIVE</div>
            <p className="status-desc">
              Atomic Block-0 bundling guarantees sub-wallet placement ahead of public mempool snipers.
            </p>
            <div className="mach-presets" role="group" aria-label="Mach velocity presets">
              {[
                { label: "Mach 3.5 (Cruise)", val: "3.5" },
                { label: "Mach 6.2 (Ramjet)", val: "6.2" },
                { label: "Mach 10.4 (Max)", val: "10.4" },
              ].map((m) => (
                <button
                  key={m.val}
                  type="button"
                  aria-pressed={machPreset === m.val}
                  onClick={() => setMachPreset(m.val)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="engine-matrix">
          <div className="engine-matrix-head">
            <span>REGIONAL JITO BLOCK ENGINES</span>
            <span className="engine-status-tag">5/5 ONLINE</span>
          </div>
          <div className="engine-grid">
            {engines.map((eng, idx) => (
              <button
                key={eng.code}
                type="button"
                className={`engine-card ${activeEngine === idx ? "is-selected" : ""}`}
                onClick={() => setActiveEngine(idx)}
              >
                <span className="code">{eng.code}</span>
                <span className="city">{eng.city}</span>
                <strong className="ping">{pings[idx]}ms</strong>
                <span className="status">{eng.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Block>
  );
}

export function SavingsSimulator() {
  const [volume, setVolume] = useState(15);
  const [cohortMode, setCohortMode] = useState(false);
  const SOL_PRICE = 93.85;

  const effectiveVolume = cohortMode ? volume * 10 : volume;
  const scramjetFeeSol = effectiveVolume * 0.035;
  const proximaFeeSol = effectiveVolume * 0.050;
  const userSavingsSol = proximaFeeSol - scramjetFeeSol;

  const scramjetFeeUsd = (scramjetFeeSol * SOL_PRICE).toFixed(2);
  const proximaFeeUsd = (proximaFeeSol * SOL_PRICE).toFixed(2);
  const userSavingsUsd = (userSavingsSol * SOL_PRICE).toFixed(2);

  return (
    <Block id="savings-simulator">
      <div className="savings-panel">
        <div className="savings-header">
          <div>
            <span className="badge">INTERACTIVE FEE BENCHMARK</span>
            <h3>SCRAMJET vs Proxima Savings Simulator</h3>
          </div>
          <div className="savings-discount-tag">
            30% LOWER PLATFORM FEES
          </div>
        </div>

        <div className="savings-controls">
          <div className="slider-row">
            <span className="slider-label">
              Launch Commitment: <strong>{volume} SOL</strong>
              {cohortMode && <span className="cohort-note"> (10-Launch Cohort = {effectiveVolume} SOL)</span>}
            </span>
            <div className="preset-buttons">
              {[5, 15, 50, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={volume === v}
                  onClick={() => setVolume(v)}
                >
                  {v} SOL
                </button>
              ))}
              <button
                type="button"
                aria-pressed={cohortMode}
                onClick={() => setCohortMode((c) => !c)}
              >
                {cohortMode ? "Cohort x10 Active" : "10x Cohort Mode"}
              </button>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider"
            aria-label="Simulated Launch Volume in SOL"
          />
        </div>

        <div className="savings-cards">
          <div className="savings-card proxima">
            <span className="title">Proxima Fee (5.0%)</span>
            <div className="sol-amt">{proximaFeeSol.toFixed(3)} SOL</div>
            <div className="usd-amt">≈ ${proximaFeeUsd} USD</div>
          </div>

          <div className="savings-card scramjet">
            <span className="title highlight">SCRAMJET Fee (3.5%)</span>
            <div className="sol-amt highlight">{scramjetFeeSol.toFixed(3)} SOL</div>
            <div className="usd-amt highlight">≈ ${scramjetFeeUsd} USD</div>
          </div>

          <div className="savings-card savings">
            <span className="title flare">Direct Creator Savings</span>
            <div className="sol-amt flare">+{userSavingsSol.toFixed(3)} SOL</div>
            <div className="usd-amt flare">+${userSavingsUsd} USD Saved</div>
          </div>
        </div>
      </div>
    </Block>
  );
}

export function ArchitectureBento() {
  const [tab, setTab] = useState("ALL");

  const protocols = [
    { name: "Meteora DBC", type: "Dynamic Curve", cat: "DYNAMIC", feature: "0.15% - 5.0% Dynamic Fee Pool + DLMM LP" },
    { name: "Pump.fun", type: "Bonding Curve", cat: "CURVES", feature: "Off-Chain Create + 0.5% Creator Fee Claim" },
    { name: "Raydium LaunchLab", type: "CPMM / AMM", cat: "DYNAMIC", feature: "Platform Configs + Automated LP Lock" },
    { name: "Bags", type: "Meme Ecosystem", cat: "CURVES", feature: "Multi-Recipient % Creator Fee Share" },
    { name: "LetsBonk", type: "Bonk Native", cat: "CURVES", feature: "Custom Bonding Curve + Bonk Rewards" },
    { name: "StonkFun", type: "Token-2022", cat: "CURVES", feature: "Transfer Fee Extensions + Auto Liquidity" },
    { name: "Printr", type: "Supply Scaler", cat: "CURVES", feature: "100M / 1B / 10B Curve Supply Models" },
    { name: "Anoncoin", type: "Privacy Curve", cat: "CURVES", feature: "Anon API key masked deployment" },
    { name: "Surge", type: "Instant AMM", cat: "DYNAMIC", feature: "Atomic single-slot liquidity routing" },
    { name: "Clanker", type: "Autonomous", cat: "DYNAMIC", feature: "AI autonomous agent deploy triggers" },
    { name: "FourMeme", type: "Fast Bonding", cat: "CURVES", feature: "Ultra-fast bonding curve migration" },
    { name: "Flap", type: "Fair Launch", cat: "CURVES", feature: "Anti-sniper fair launch distribution" },
  ];

  const filtered = tab === "ALL" ? protocols : protocols.filter((p) => p.cat === tab);

  return (
    <Block id="architecture-bento" className="is-wide">
      <div className="bento-container">
        <div className="bento-grid">
          {/* Card 1: Jito Block-0 */}
          <div className="bento-card col-span-7">
            <div className="card-top">
              <span className="tag plasma">JITO ATOMIC BLOCK-0</span>
              <span className="sub">5 Global Engines</span>
            </div>
            <h4>Sub-Wallet Front-Running Defense</h4>
            <p>
              Bundles your token creation, developer buy, and sub-wallet entries into a single atomic Block-0 transaction. 
              Zero public mempool visibility protects launches from predatory sandwich bots.
            </p>
            <div className="tx-sequence">
              <div className="tx-step">
                <span className="step-num">1</span>
                <span className="step-txt">Deploy Token & Bonding Curve</span>
                <span className="step-tag">Slot +0</span>
              </div>
              <div className="tx-step active">
                <span className="step-num highlight">2</span>
                <span className="step-txt highlight">Dev & Sub-Wallet Buys (Zero Slippage)</span>
                <span className="step-tag flare">Confirmed</span>
              </div>
              <div className="tx-step">
                <span className="step-num">3</span>
                <span className="step-txt">Jito Priority Tip Leader Transfer</span>
                <span className="step-tag">Leader Tip</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ghost Funder */}
          <div className="bento-card col-span-5">
            <div className="card-top">
              <span className="tag flare">ANTI-BUBBLEMAP</span>
              <span className="sub">Ghost Funder</span>
            </div>
            <h4>Zero-Cluster Wallet Graph</h4>
            <p>
              Bypasses BubbleMaps and Photon cluster warnings via multi-hop Merkle relays, randomized funding intervals, and clean unlinked root trees.
            </p>
            <div className="cluster-readout">
              <span className="label">BUBBLEMAPS DETECTION RISK</span>
              <strong className="risk flare">0.0% CLUSTER</strong>
              <span className="note">Organic independent wallet graph</span>
            </div>
          </div>

          {/* Card 3: 0.01 SOL Micro-Bundles */}
          <div className="bento-card col-span-5">
            <div className="card-top">
              <span className="tag flare">MICRO-BUNDLING</span>
              <span className="sub">Rent Reclaim</span>
            </div>
            <h4>0.01 SOL Entry vs Proxima 0.10</h4>
            <p>
              Never lock up 2.0+ SOL across 20 sub-wallets. SCRAMJET lowers the barrier to 0.01 SOL and automatically batch-sweeps ~0.00204 SOL ATA rent back post-sale.
            </p>
            <div className="comparison-row">
              <div className="comp-box">
                <span className="comp-lbl">PROXIMA LOCKUP</span>
                <span className="comp-val danger">0.10 SOL / w</span>
              </div>
              <div className="comp-box highlight">
                <span className="comp-lbl highlight">SCRAMJET</span>
                <span className="comp-val flare">0.01 SOL / w</span>
              </div>
            </div>
          </div>

          {/* Card 4: Deflationary Flywheel */}
          <div className="bento-card col-span-7">
            <div className="card-top">
              <span className="tag plasma">DEFLATIONARY FLYWHEEL</span>
              <span className="sub">Auto-Burn Loop</span>
            </div>
            <h4>Creator Fee Buyback & Burn</h4>
            <p>
              Automatically route 25%–100% of harvested fees into bonding curve market buys, instantly executing SPL token burns to generate upward momentum.
            </p>
            <div className="flywheel-flow">
              <div className="flow-step">Trading Volume Fees</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step highlight">Curve Market Buy</div>
              <span className="flow-arrow">→</span>
              <div className="flow-step flare">SPL Supply Burned 🔥</div>
            </div>
          </div>
        </div>

        {/* 12-Protocol Supported Matrix */}
        <div className="protocols-section">
          <div className="protocols-head">
            <div>
              <h5>12 Solana Launchpad Protocols Supported</h5>
              <p>Deploy across any bonding curve, dynamic fee tier, or AMM with native instruction builders.</p>
            </div>
            <div className="filter-tabs" role="tablist">
              {["ALL", "CURVES", "DYNAMIC"].map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t === "ALL" ? "All (12)" : t === "CURVES" ? "Bonding Curves" : "AMM / Dynamic"}
                </button>
              ))}
            </div>
          </div>
          <div className="protocols-grid">
            {filtered.map((item) => (
              <div key={item.name} className="proto-card">
                <div className="proto-name">{item.name}</div>
                <div className="proto-type">{item.type}</div>
                <div className="proto-feat">{item.feature}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Block>
  );
}

export function ElementBody({ id }) {
  switch (id) {
    case "intake-hero":
      return <IntakeHero />;
    case "mach-ribbon":
      return <MachRibbon />;
    case "cascade-chamber":
      return <CascadeChamber />;
    case "shock-field":
      return <ShockField />;
    case "kinetic-wordmark":
      return <KineticWordmark />;
    case "chapter-rail":
      return <ChapterRail />;
    case "protocol-strip":
      return <ProtocolStrip />;
    case "magnetic-ignition":
      return <MagneticIgnition />;
    case "fee-lockup":
      return <FeeLockup />;
    case "hover-shear":
      return <HoverShear />;
    case "section-veil":
      return <SectionVeil />;
    case "instrument-dial":
      return <InstrumentDial />;
    case "hypersonic-stream":
      return <HypersonicStream />;
    case "telemetry-radar":
      return <TelemetryRadar />;
    case "savings-simulator":
      return <SavingsSimulator />;
    case "architecture-bento":
      return <ArchitectureBento />;
    case "venue-medallions":
      return <VenueMedallions />;
    // 15 New Hypersonic Interactive Components
    case "mempool-intercept":
      return <MempoolIntercept />;
    case "candle-surge":
      return <CandleSurge />;
    case "anti-mev-shield":
      return <AntiMevShield />;
    case "sonic-scrubber":
      return <SonicScrubber />;
    case "terminal-matrix":
      return <TerminalMatrix />;
    case "bundle-orchestrator":
      return <BundleOrchestrator />;
    case "liquidity-manifold":
      return <LiquidityManifold />;
    case "cockpit-hud":
      return <CockpitHud />;
    case "tokenomics-centrifuge":
      return <TokenomicsCentrifuge />;
    case "compute-tachometer":
      return <ComputeTachometer />;
    case "atomic-clock":
      return <AtomicClock />;
    case "plasma-nozzle":
      return <PlasmaNozzle />;
    case "stealth-payload":
      return <StealthPayload />;
    case "venue-router":
      return <VenueRouter />;
    case "ablation-shield":
      return <AblationShield />;
    default:
      return null;
  }
}

export function StandaloneElement({ id }) {
  const item = PROPOSAL_MAP[id];
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
        <Link to={`/#${id}`}>All proposals</Link>
      </p>
      <h1>{item.name}</h1>
      <p className="lede">{item.purpose}</p>
      <ElementBody id={id} />
    </main>
  );
}
