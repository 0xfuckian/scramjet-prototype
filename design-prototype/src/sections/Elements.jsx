import { lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROPOSAL_MAP } from "../data/proposals.js";
import { usePerf } from "../perf/PerfProvider.jsx";
import { gsap, ScrollTrigger } from "../scroll/SmoothScroll.jsx";
import { LazyStage } from "../three/LazyStage.jsx";
import { usePrototype } from "../prototype/PrototypeContext.jsx";

const IntakeScene = lazy(() => import("../three/IntakeScene.jsx"));
const RibbonScene = lazy(() => import("../three/RibbonScene.jsx"));
const VenueScene = lazy(() => import("../three/VenueScene.jsx"));
const CascadeScene = lazy(() => import("../three/CascadeScene.jsx"));
const ShockScene = lazy(() => import("../three/ShockScene.jsx"));

const VENUES = [
  { name: "Pump.fun", note: "Bonding curve" },
  { name: "Meteora DBC", note: "Dynamic fee" },
  { name: "Raydium", note: "LaunchLab" },
  { name: "Bags", note: "Public sale" },
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
        <p className="eyebrow">{item.three ? "3D proposal" : "Lightweight proposal"}</p>
        {solo === id ? null : <h2 id={`${id}-title`}>{item.name}</h2>}
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
      <LazyStage scene={IntakeScene} fallback="/fallbacks/intake.svg" label="Intake hero" />
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

export function VenueViewer() {
  const [focus, setFocus] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  function onPointerDown(event) {
    drag.current = { x: event.clientX, focus };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!drag.current) return;
    const delta = Math.round((event.clientX - drag.current.x) / 80);
    const next = (drag.current.focus + delta + VENUES.length) % VENUES.length;
    setFocus(next);
  }

  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <Block id="venue-viewer">
      <div className="venue">
        <div
          className="venue-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <LazyStage
            scene={VenueScene}
            fallback="/fallbacks/venues.svg"
            label="Venue viewer"
            sceneProps={{ focus }}
          />
        </div>
        <div className="venue-controls" role="group" aria-label="Launch venues">
          {VENUES.map((venue, index) => (
            <button
              key={venue.name}
              type="button"
              aria-pressed={focus === index}
              onClick={() => setFocus(index)}
            >
              <span>{venue.name}</span>
              <small>{venue.note}</small>
            </button>
          ))}
        </div>
        <p className="hint">{dragging ? "Dragging the object." : "Drag the object or use the buttons."}</p>
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

export function ElementBody({ id }) {
  switch (id) {
    case "intake-hero":
      return <IntakeHero />;
    case "mach-ribbon":
      return <MachRibbon />;
    case "venue-viewer":
      return <VenueViewer />;
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
