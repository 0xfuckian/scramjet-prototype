import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROPOSAL_MAP } from "../data/proposals.js";
import { usePerf } from "../perf/PerfProvider.jsx";
import { usePrototype } from "../prototype/PrototypeContext.jsx";

function Block({ id, children }) {
  const item = PROPOSAL_MAP[id];
  const { enabled, toggle, openElement } = usePrototype();
  const on = enabled[id];

  if (!item || !on) return null;

  return (
    <section className="block" id={id}>
      <div className="block-copy">
        <p className="eyebrow">
          <span className="proposal-badge">PROPOSAL {item.numStr}</span>
          <span className="eyebrow-sep">·</span>
          <span>{item.cost ? item.cost.toUpperCase() : "MEDIUM"} COST · {item.original ? "ORIGINAL" : "BENCHMARK"}</span>
        </p>
        <h2 id={`${id}-title`}>
          <span className="proposal-heading-num">{item.numStr}</span> {item.name}
        </h2>
        <p>{item.purpose}</p>
        {item.fit ? <p className="fit">{item.fit}</p> : null}
        <div className="control-row" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            aria-pressed={on}
            onClick={() => toggle(id)}
            aria-label={`${on ? "Hide" : "Show"} ${item.name}`}
          >
            {on ? "On" : "Off"}
          </button>
          <button type="button" onClick={() => openElement(id)}>
            Alone
          </button>
          {item.referenceUrl ? (
            <a href={item.referenceUrl} target="_blank" rel="noreferrer">
              Ref
            </a>
          ) : null}
        </div>
      </div>
      <div className="block-stage" style={{ marginTop: "1.4rem" }}>{children}</div>
      <footer className="meta">
        <span className="meta-num">{item.numStr}</span>
        <span>Cost {item.cost}</span>
        <span>{item.original ? "Original" : "Technique reference"}</span>
        {item.fit ? <span>{item.fit}</span> : null}
      </footer>
    </section>
  );
}

// ===========================================================================
// 1. MEMPOOL INTERCEPT RADAR
// 360-degree tactical sonar radar intercepting unconfirmed Solana txs in real time
// ===========================================================================
export function MempoolIntercept() {
  const [range, setRange] = useState(400); // 100ms, 200ms, 400ms
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("all");
  const [angle, setAngle] = useState(0);
  const [blips, setBlips] = useState([
    { id: 1, angle: 45, dist: 0.72, sig: "tx_9xJ1..8a", type: "shielded", fee: "0.015 SOL", time: "4ms ago" },
    { id: 2, angle: 120, dist: 0.45, sig: "bot_3mB..2e", type: "neutralized", fee: "0.080 SOL", time: "12ms ago" },
    { id: 3, angle: 210, dist: 0.85, sig: "tx_4kJ9..7f", type: "jito", fee: "0.020 SOL", time: "18ms ago" },
    { id: 4, angle: 300, dist: 0.35, sig: "sniper_91..1c", type: "neutralized", fee: "0.120 SOL", time: "22ms ago" },
    { id: 5, angle: 340, dist: 0.60, sig: "tx_2vQ4..9k", type: "shielded", fee: "0.010 SOL", time: "28ms ago" },
  ]);

  const { motionOff } = usePerf();

  useEffect(() => {
    if (motionOff || paused) return undefined;
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 3) % 360);
    }, 24);
    return () => clearInterval(interval);
  }, [motionOff, paused]);

  function triggerSweep() {
    const newBlip = {
      id: Date.now(),
      angle: Math.floor(Math.random() * 360),
      dist: 0.3 + Math.random() * 0.6,
      sig: `tx_${Math.random().toString(36).slice(2, 6)}..${Math.random().toString(36).slice(2, 4)}`,
      type: Math.random() > 0.4 ? "shielded" : "neutralized",
      fee: `${(0.01 + Math.random() * 0.05).toFixed(3)} SOL`,
      time: "just now",
    };
    setBlips((prev) => [newBlip, ...prev.slice(0, 5)]);
  }

  const visibleBlips = blips.filter((b) => filter === "all" || b.type === filter);

  return (
    <Block id="mempool-intercept">
      <div className="radar-layout">
        {/* Tactical Radar Display */}
        <div className="radar-screen-wrap">
          <svg className="radar-svg" viewBox="-120 -120 240 240" aria-label="Mempool Intercept Sonar">
            {/* Dark background circle */}
            <circle cx="0" cy="0" r="115" fill="#0B0F17" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Concentric Range Rings */}
            <circle cx="0" cy="0" r="30" fill="none" stroke="#FF7700" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#FF7700" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="0" cy="0" r="90" fill="none" stroke="#FF7700" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="0" cy="0" r="115" fill="none" stroke="#FF7700" strokeWidth="1.2" opacity="0.7" />

            {/* Crosshairs */}
            <line x1="-115" y1="0" x2="115" y2="0" stroke="#1E293B" strokeWidth="1" />
            <line x1="0" y1="-115" x2="0" y2="115" stroke="#1E293B" strokeWidth="1" />

            {/* 360 Radar Sweep Line */}
            <g transform={`rotate(${angle})`}>
              <line x1="0" y1="0" x2="0" y2="-115" stroke="#FF7700" strokeWidth="2" opacity="0.9" />
              <polygon points="0,0 -40,-115 0,-115" fill="url(#radarSweepGlow)" opacity="0.25" />
            </g>

            {/* Gradient definition for sweep trail */}
            <defs>
              <linearGradient id="radarSweepGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7700" stopOpacity="0" />
                <stop offset="100%" stopColor="#FF7700" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Center Scramjet Core */}
            <circle cx="0" cy="0" r="5" fill="#FF7700" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#FF7700" strokeWidth="1" opacity="0.7" />

            {/* Plotted Blips */}
            {visibleBlips.map((blip) => {
              const rad = ((blip.angle - 90) * Math.PI) / 180;
              const r = blip.dist * 105;
              const bx = Math.cos(rad) * r;
              const by = Math.sin(rad) * r;
              const isDanger = blip.type === "neutralized";
              const color = isDanger ? "#EF4444" : "#FF7700";

              return (
                <g key={blip.id} transform={`translate(${bx}, ${by})`} className="radar-blip">
                  <circle cx="0" cy="0" r="4" fill={color} />
                  <circle cx="0" cy="0" r="9" fill="none" stroke={color} strokeWidth="1" opacity="0.5" className="blip-pulse" />
                  <text x="7" y="3" fill="#F8FAFC" fontSize="7" fontFamily="JetBrains Mono" opacity="0.85">
                    {blip.sig}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="radar-scope-telemetry">
            <span>RANGE: {range}ms</span>
            <span className={paused ? "radar-alert" : "radar-live"}>
              {paused ? "PAUSED" : "INTERCEPT ACTIVE"}
            </span>
          </div>
        </div>

        {/* Live Intercept Log & Controls */}
        <div className="radar-panel">
          <div className="radar-actions">
            <div className="filter-group">
              <button
                type="button"
                className={`tab-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Signals
              </button>
              <button
                type="button"
                className={`tab-btn ${filter === "shielded" ? "active" : ""}`}
                onClick={() => setFilter("shielded")}
              >
                Shielded
              </button>
              <button
                type="button"
                className={`tab-btn ${filter === "neutralized" ? "active" : ""}`}
                onClick={() => setFilter("neutralized")}
              >
                Snipers Neutralized
              </button>
            </div>
            <div className="btn-row">
              <button type="button" className="sec-btn" onClick={() => setPaused(!paused)}>
                {paused ? "Resume Sweep" : "Freeze"}
              </button>
              <button type="button" className="pri-btn" onClick={triggerSweep}>
                Ping Mempool
              </button>
            </div>
          </div>

          <div className="intercept-feed" aria-live="polite">
            {blips.map((b) => (
              <div key={b.id} className={`feed-row ${b.type}`}>
                <span className="feed-badge">{b.type.toUpperCase()}</span>
                <span className="feed-sig">{b.sig}</span>
                <span className="feed-fee">{b.fee}</span>
                <span className="feed-time">{b.time}</span>
              </div>
            ))}
          </div>

          <p className="radar-caption">
            SCRAMJET Jito-relayed private endpoints bypass public Solana mempools, neutralizing frontrun bots before validator scheduling.
          </p>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 2. GOD CANDLE THROTTLE
// Tactile aerospace throttle pushing market cap from $100K to $100M+
// ===========================================================================
export function CandleSurge() {
  const [throttle, setThrottle] = useState(70); // 5 to 100%
  const [smoothThrottle, setSmoothThrottle] = useState(70);

  // Smooth critically damped animation towards target throttle
  useEffect(() => {
    let animId;
    const animate = () => {
      setSmoothThrottle((prev) => {
        const diff = throttle - prev;
        if (Math.abs(diff) < 0.15) return throttle;
        return prev + diff * 0.14;
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [throttle]);

  const mcap = useMemo(() => {
    const val = 100000 * Math.pow(1000, smoothThrottle / 100);
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${Math.round(val / 1000)}K`;
  }, [smoothThrottle]);

  const mach = (1.0 + (smoothThrottle / 100) * 9.0).toFixed(1);

  // MONUMENTAL 5X VERTICAL SCALE
  // In the original, max candleHeight was 220px. Here it reaches 1,060px (~4.8x taller)
  const BASE_Y = 1140;
  const candleHeight = 35 + (smoothThrottle / 100) * 1050;
  const candleTopY = BASE_Y - candleHeight;

  // SMOOTH DYNAMIC CAMERA ZOOM OUT
  // As throttle opens, the SVG viewport smoothly dollies out from a close-up (340px)
  // to a monumental wide-angle view (1,180px) capturing the full stratospheric column
  const zoomP = smoothThrottle / 100;
  const viewHeight = 340 + zoomP * 840;
  const viewY = (BASE_Y + 30) - viewHeight;

  // 8 Stratospheric Resistance Thresholds
  const levels = [
    { y: 1050, label: "R1: ACCUMULATION", val: "$100K" },
    { y: 920, label: "R2: MACH 1 BOOM", val: "$350K" },
    { y: 790, label: "R3: TROPOSPHERE", val: "$1.2M" },
    { y: 650, label: "R4: STRATOSPHERE", val: "$4.5M" },
    { y: 510, label: "R5: MESOSPHERE", val: "$12.0M" },
    { y: 360, label: "R6: KARMAN ORBIT", val: "$30.0M" },
    { y: 210, label: "R7: THERMOSPHERE", val: "$65.0M" },
    { y: 80, label: "R8: GOD CANDLE", val: "$100M+" },
  ];

  const shockSpread = Math.min(35, (smoothThrottle / 100) * 45);

  return (
    <Block id="candle-surge">
      <div className="throttle-grid">
        {/* Tactile Throttle Quadrant */}
        <div className="throttle-console">
          <p className="console-label">AEROSPACE THROTTLE QUADRANT</p>
          <div className="throttle-track-wrap">
            <input
              type="range"
              min="5"
              max="100"
              value={throttle}
              onChange={(e) => setThrottle(Number(e.target.value))}
              className="vertical-throttle-input"
              aria-label="Hypersonic throttle lever"
            />
            <div className="throttle-markings">
              <span>MACH 10.0</span>
              <span>MACH 7.5</span>
              <span>MACH 5.0</span>
              <span>MACH 2.5</span>
              <span>MACH 1.0</span>
            </div>
          </div>
          <div className="throttle-readout">
            <span className="mach-badge">MACH {mach}</span>
            <span className="throttle-pct">{Math.round(smoothThrottle)}% POWER</span>
          </div>

          {/* Quick Throttle Presets */}
          <div className="throttle-presets" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginTop: "1rem" }}>
            <button
              type="button"
              className={`tab-btn ${throttle <= 20 ? "active" : ""}`}
              onClick={() => setThrottle(10)}
              style={{ fontSize: "0.68rem", padding: "0.35rem 0.4rem" }}
            >
              Mach 1.0 (Base)
            </button>
            <button
              type="button"
              className={`tab-btn ${throttle > 20 && throttle <= 50 ? "active" : ""}`}
              onClick={() => setThrottle(45)}
              style={{ fontSize: "0.68rem", padding: "0.35rem 0.4rem" }}
            >
              Mach 5.0 (Escape)
            </button>
            <button
              type="button"
              className={`tab-btn ${throttle > 50 && throttle <= 80 ? "active" : ""}`}
              onClick={() => setThrottle(75)}
              style={{ fontSize: "0.68rem", padding: "0.35rem 0.4rem" }}
            >
              Mach 7.5 (Stratosphere)
            </button>
            <button
              type="button"
              className={`tab-btn ${throttle > 80 ? "active" : ""}`}
              onClick={() => setThrottle(100)}
              style={{ fontSize: "0.68rem", padding: "0.35rem 0.4rem", borderColor: "var(--flare)", color: "var(--flare)" }}
            >
              Mach 10.0 (5X Apex)
            </button>
          </div>
        </div>

        {/* Surging Volumetric God Candle with Smooth Camera Zoom */}
        <div className="candle-stage">
          <svg
            viewBox={`0 ${viewY} 400 ${viewHeight}`}
            className="candle-svg"
            aria-label="Surging 5X Flat-Top God Candle"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="godCandleGrad5X" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803D" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>

            {/* Stratospheric Resistance Grid Lines */}
            {levels.map((lvl) => {
              const breached = candleTopY <= lvl.y;
              const sf = viewHeight / 340;
              return (
                <g key={lvl.y}>
                  <line
                    x1="16"
                    y1={lvl.y}
                    x2="384"
                    y2={lvl.y}
                    stroke={breached ? "#FF7700" : "#1E293B"}
                    strokeDasharray={`${sf * 3.5} ${sf * 2.5}`}
                    strokeWidth={breached ? sf * 1.5 : sf * 0.9}
                    opacity={breached ? 0.9 : 0.35}
                  />
                  {/* Left Label */}
                  <text
                    x="20"
                    y={lvl.y - sf * 3.5}
                    fill={breached ? "#FF7700" : "#64748B"}
                    fontSize={sf * 4.5}
                    fontFamily="JetBrains Mono"
                    fontWeight={breached ? "600" : "400"}
                  >
                    {lvl.label}
                  </text>

                  {/* Right Valuation & Status */}
                  <text
                    x="380"
                    y={lvl.y - sf * 3.5}
                    textAnchor="end"
                    fill={breached ? "#FF7700" : "#475569"}
                    fontSize={sf * 4.5}
                    fontFamily="JetBrains Mono"
                    fontWeight={breached ? "600" : "400"}
                  >
                    {lvl.val} {breached ? "✓" : ""}
                  </text>
                </g>
              );
            })}

            {/* Candle Lower Wick */}
            <line
              x1="200"
              y1={BASE_Y}
              x2="200"
              y2={BASE_Y + (viewHeight / 340) * 25}
              stroke="#22C55E"
              strokeWidth={(viewHeight / 340) * 2.5}
              strokeLinecap="square"
            />

            {/* Monumental Emerald God Candle Body (100% Flat Top: rx=0, ry=0) */}
            <rect
              x="174"
              y={candleTopY}
              width="52"
              height={candleHeight}
              rx="0"
              ry="0"
              fill="url(#godCandleGrad5X)"
              stroke="#4ADE80"
              strokeWidth={(viewHeight / 340) * 1.8}
            />

            {/* Razor-sharp Flat Apex Threshold (Zero curves, crisp flat laser edge) */}
            <line
              x1="174"
              y1={candleTopY}
              x2="226"
              y2={candleTopY}
              stroke="#FFFFFF"
              strokeWidth={(viewHeight / 340) * 3.5}
              strokeLinecap="square"
            />

            {/* Flat Supersonic Planar Shockwave & Laser HUD */}
            {smoothThrottle > 20 && (
              <g className="flat-shockwave">
                {/* Horizontal laser beam across the entire chart at candle apex */}
                <line
                  x1="16"
                  y1={candleTopY}
                  x2="384"
                  y2={candleTopY}
                  stroke="#FF7700"
                  strokeWidth={(viewHeight / 340) * 1.2}
                  strokeDasharray={`${(viewHeight / 340) * 4} ${(viewHeight / 340) * 2}`}
                  opacity="0.85"
                />

                {/* Flat supersonic planar crossbar extensions */}
                <line
                  x1={174 - shockSpread * (viewHeight / 340)}
                  y1={candleTopY}
                  x2={226 + shockSpread * (viewHeight / 340)}
                  y2={candleTopY}
                  stroke="#FF7700"
                  strokeWidth={(viewHeight / 340) * 2.2}
                  strokeLinecap="square"
                />

                {/* Flat corner boundary brackets */}
                <line
                  x1="174"
                  y1={candleTopY - (viewHeight / 340) * 6}
                  x2="174"
                  y2={candleTopY + (viewHeight / 340) * 6}
                  stroke="#FFFFFF"
                  strokeWidth={(viewHeight / 340) * 1.5}
                />
                <line
                  x1="226"
                  y1={candleTopY - (viewHeight / 340) * 6}
                  x2="226"
                  y2={candleTopY + (viewHeight / 340) * 6}
                  stroke="#FFFFFF"
                  strokeWidth={(viewHeight / 340) * 1.5}
                />

                {/* Live Hypersonic Telemetry Badge at Flat Apex in Scramjet Orange */}
                <text
                  x="234"
                  y={candleTopY - (viewHeight / 340) * 4}
                  fill="#FF7700"
                  fontSize={(viewHeight / 340) * 5.2}
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  ▲ {mcap} [M{mach}]
                </text>
              </g>
            )}
          </svg>

          <div className="candle-metrics">
            <div className="m-item">
              <span className="m-label">MARKET CAP</span>
              <span className="m-val highlight">{mcap}</span>
            </div>
            <div className="m-item">
              <span className="m-label">CANDLE HEIGHT</span>
              <span className="m-val highlight">{Math.round(candleHeight)} px (5.2X)</span>
            </div>
            <div className="m-item">
              <span className="m-label">INFLOW VELOCITY</span>
              <span className="m-val">{(smoothThrottle * 14.2).toFixed(0)} SOL/s</span>
            </div>
            <div className="m-item">
              <span className="m-label">ESCAPE VELOCITY</span>
              <span className="m-val">{smoothThrottle >= 80 ? "CONFIRMED (HYPERSONIC)" : "CHARGING"}</span>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 3. KINETIC ANTI-MEV DEFLECTOR
// Kinetic armor repelling sniper/sandwich bots with spark deflections
// ===========================================================================
export function AntiMevShield() {
  const [mode, setMode] = useState("shielded"); // 'shielded' | 'public'
  const [sparks, setSparks] = useState([]);
  const [attacksBlocked, setAttacksBlocked] = useState(1482);

  function simulateAttack() {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * 75;
    const y = Math.sin(angle) * 75;
    setSparks((prev) => [...prev.slice(-6), { id: Date.now(), x, y }]);
    if (mode === "shielded") {
      setAttacksBlocked((c) => c + 1);
    }
  }

  return (
    <Block id="anti-mev-shield">
      <div className="shield-container">
        <div className="shield-toggle-bar">
          <button
            type="button"
            className={`mode-btn ${mode === "shielded" ? "active" : ""}`}
            onClick={() => setMode("shielded")}
          >
            SCRAMJET Private Bundle (Invulnerable)
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "public" ? "danger" : ""}`}
            onClick={() => setMode("public")}
          >
            Standard Public Mempool (Vulnerable)
          </button>
          <button type="button" className="sec-btn attack-trigger" onClick={simulateAttack}>
            Simulate Bot Attack Wave
          </button>
        </div>

        <div className="shield-graphic-wrap">
          <svg viewBox="-150 -150 300 300" className="shield-svg" aria-label="Anti-MEV Kinetic Shield">
            {/* Central Transaction Core */}
            <circle cx="0" cy="0" r="28" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              LAUNCH TX
            </text>

            {/* Shield State */}
            {mode === "shielded" ? (
              <g className="kinetic-hex-shield">
                {/* Outer Hexagon Shield */}
                <polygon
                  points="0,-85 73,-42 73,42 0,85 -73,42 -73,-42"
                  fill="#06B6D4"
                  fillOpacity="0.08"
                  stroke="#FF7700"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                {/* Secondary Buffer Ring */}
                <circle cx="0" cy="0" r="58" fill="none" stroke="#FF3E00" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                {/* Deflected Beam Indicators */}
                <line x1="-130" y1="-80" x2="-65" y2="-40" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="-65" y1="-40" x2="-120" y2="0" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="130" y1="70" x2="68" y2="38" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="68" y1="38" x2="110" y2="120" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            ) : (
              <g className="compromised-mempool">
                {/* Vulnerable Broken Perimeters */}
                <circle cx="0" cy="0" r="75" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 6" opacity="0.5" />
                {/* Direct Piercing Sandwich Beams */}
                <line x1="-140" y1="-50" x2="-20" y2="-10" stroke="#EF4444" strokeWidth="3" />
                <line x1="140" y1="40" x2="20" y2="10" stroke="#EF4444" strokeWidth="3" />
                <circle cx="-20" cy="-10" r="6" fill="#EF4444" />
                <circle cx="20" cy="10" r="6" fill="#EF4444" />
              </g>
            )}

            {/* Active Deflection Sparks */}
            {sparks.map((s) => (
              <g key={s.id} transform={`translate(${s.x}, ${s.y})`} className="deflection-spark">
                <circle cx="0" cy="0" r="4" fill="#FDE047" />
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FDE047" strokeWidth="1.5" />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FDE047" strokeWidth="1.5" />
              </g>
            ))}
          </svg>

          <div className="shield-stats">
            <div className="stat-box">
              <span className="lbl">FRONTRUN STATUS</span>
              <span className={`val ${mode === "shielded" ? "good" : "bad"}`}>
                {mode === "shielded" ? "DEFLECTED (0% SLIPPAGE)" : "PENETRATED (8.4% LOSS)"}
              </span>
            </div>
            <div className="stat-box">
              <span className="lbl">MEV ATTACKS BLOCKED</span>
              <span className="val">{attacksBlocked.toLocaleString()}</span>
            </div>
            <div className="stat-box">
              <span className="lbl">SOL RECOVERY VALUE</span>
              <span className="val highlight">+14.2 SOL / Launch</span>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 4. MACH SONIC BOOM WAVEFORM
// Interactive air compression scrubber bursting into a supersonic vapor cone
// ===========================================================================
export function SonicScrubber() {
  const [mach, setMach] = useState(1.4); // 0.2 to 3.5
  const isSupersonic = mach >= 1.0;

  return (
    <Block id="sonic-scrubber">
      <div className="sonic-box">
        <div className="sonic-header">
          <div className="mach-indicator">
            <span className="speed-title">FLIGHT SPEED</span>
            <span className={`mach-numeric ${isSupersonic ? "boom" : ""}`}>MACH {mach.toFixed(2)}</span>
            <span className="speed-state">
              {mach < 1.0 ? "SUBSONIC (Mempool lag)" : mach < 2.5 ? "SUPERSONIC (Atomic finality)" : "HYPERSONIC (Block-0)"}
            </span>
          </div>
          <div className="scrubber-control">
            <label htmlFor="mach-scrub">Compress Air Density / Velocity:</label>
            <input
              id="mach-scrub"
              type="range"
              min="0.2"
              max="3.5"
              step="0.05"
              value={mach}
              onChange={(e) => setMach(parseFloat(e.target.value))}
              className="mach-slider"
            />
          </div>
        </div>

        <div className="waveform-display">
          <svg viewBox="0 0 500 160" className="waveform-svg" aria-label="Sonic Shockwave Graph">
            {/* Center Flight Axis */}
            <line x1="20" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

            {/* Aerodynamic Pressure Curve */}
            {isSupersonic ? (
              <g>
                {/* Sharp Shock Discontinuity (Prandtl-Glauert Singularity) */}
                <path
                  d={`M 30,80 Q 180,80 230,20 L 230,140 Q 280,80 470,80`}
                  fill="none"
                  stroke="#FF7700"
                  strokeWidth="3"
                />
                {/* Supersonic Shock Angle Wings */}
                <line x1="230" y1="20" x2={230 - mach * 35} y2="0" stroke="#FF3E00" strokeWidth="2" />
                <line x1="230" y1="140" x2={230 - mach * 35} y2="160" stroke="#FF3E00" strokeWidth="2" />

                {/* Condensation Vapor Cone Fill */}
                <polygon
                  points={`230,80 ${230 - mach * 45},10 ${230 - mach * 45},150`}
                  fill="#FF7700"
                  fillOpacity="0.12"
                />
              </g>
            ) : (
              /* Smooth Subsonic Sine Wave */
              <path
                d="M 30,80 Q 150,40 250,80 T 470,80"
                fill="none"
                stroke="#64748B"
                strokeWidth="2"
              />
            )}

            {/* Scramjet Vehicle Marker */}
            <polygon points="230,80 215,72 215,88" fill="#F8FAFC" />
          </svg>

          <div className="waveform-telemetry">
            <span>SOUND BARRIER: {isSupersonic ? "BREACHED" : "UNREACHED"}</span>
            <span>TRANSACTION CONFIRMATION: {isSupersonic ? "380ms (1 SLOT)" : "2,400ms (SLOW)"}</span>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 5. HYPERSONIC LAUNCH CLI
// Pro terminal emulator with interactive command dispatch & ASCII scramjet art
// ===========================================================================
export function TerminalMatrix() {
  const [logs, setLogs] = useState([
    { text: "scramjet-cli v2.4.1 (solana-mainnet-beta)", type: "head" },
    { text: "connected to jito-relayer-dfw · latency 14ms", type: "info" },
    { text: "ready. type 'deploy', 'simulate', or 'audit' to run.", type: "prompt" },
  ]);
  const [inputVal, setInputVal] = useState("");

  function runCommand(cmd) {
    const clean = cmd.trim().toLowerCase();
    const time = new Date().toISOString().slice(11, 19);

    let replies = [];
    if (clean === "deploy" || clean === "launch") {
      replies = [
        { text: `[${time}] > scramjet launch --ticker $MACH --supply 1B`, type: "cmd" },
        { text: `[${time}] [1/4] Minting SPL-Token2022 with zero freeze authority...`, type: "info" },
        { text: `[${time}] [2/4] Assembling Jito Block-0 atomic bundle (5 instructions)...`, type: "info" },
        { text: `[${time}] [3/4] Routing through Ghost Funder ephemeral keypair...`, type: "info" },
        { text: `[${time}] [4/4] Finalized! Sig: 5kR9wX...pL2m (Slot 318,492,104)`, type: "success" },
      ];
    } else if (clean === "simulate") {
      replies = [
        { text: `[${time}] > scramjet simulate --venues all`, type: "cmd" },
        { text: `[${time}] Pump.fun: 12ms · Meteora DBC: 14ms · Raydium: 18ms`, type: "info" },
        { text: `[${time}] Estimated Slippage: 0.00% · MEV Risk: ZERO`, type: "success" },
      ];
    } else if (clean === "audit") {
      replies = [
        { text: `[${time}] > scramjet audit --anti-mev`, type: "cmd" },
        { text: `[${time}] Contract Bytecode: VERIFIED CLEAN (No backdoors)`, type: "success" },
        { text: `[${time}] LP Burn: PERMANENT · Mint Authority: REVOKED`, type: "success" },
      ];
    } else {
      replies = [
        { text: `[${time}] > ${cmd}`, type: "cmd" },
        { text: `Available commands: 'deploy', 'simulate', 'audit', 'clear'`, type: "warn" },
      ];
    }

    if (clean === "clear") {
      setLogs([{ text: "terminal cleared. ready.", type: "prompt" }]);
    } else {
      setLogs((prev) => [...prev, ...replies]);
    }
    setInputVal("");
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;
    runCommand(inputVal);
  }

  return (
    <Block id="terminal-matrix">
      <div className="terminal-window">
        {/* Terminal Header */}
        <div className="terminal-bar">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="terminal-title">scramjet@solana-core: ~/hypersonic-launch</span>
          <div className="terminal-quick-cmds">
            <button type="button" onClick={() => runCommand("deploy")}>
              deploy
            </button>
            <button type="button" onClick={() => runCommand("simulate")}>
              simulate
            </button>
            <button type="button" onClick={() => runCommand("audit")}>
              audit
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          {logs.map((log, idx) => (
            <div key={idx} className={`term-line ${log.type}`}>
              {log.text}
            </div>
          ))}

          {/* Prompt line */}
          <form onSubmit={onSubmit} className="term-prompt-line">
            <span className="prompt-sym">&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type 'deploy' and press Enter..."
              className="term-input"
              aria-label="Terminal command input"
            />
          </form>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 6. JITO BLOCK-0 ATOMIC SORTER
// Interactive 5-slot packager demonstrating atomic indivisibility
// ===========================================================================
export function BundleOrchestrator() {
  const [activeSlot, setActiveSlot] = useState(0);

  const SLOTS = [
    { num: 1, title: "SPL-Token2022 Mint", action: "Create immutable supply & metadata", gas: "45,000 CU", tip: "0.00 SOL" },
    { num: 2, title: "Liquidity Injection", action: "Deposit SOL + Token pair into pool", gas: "85,000 CU", tip: "0.00 SOL" },
    { num: 3, title: "Block-0 Sniper Buy", action: "Creator first-purchase in exact same block", gas: "65,000 CU", tip: "0.00 SOL" },
    { num: 4, title: "Liquidity Auto-Lock", action: "Burn LP tokens permanently to incinerator", gas: "35,000 CU", tip: "0.00 SOL" },
    { num: 5, title: "Jito Validator Tip", action: "Guaranteed priority inclusion in Slot 0", gas: "15,000 CU", tip: "0.02 SOL" },
  ];

  return (
    <Block id="bundle-orchestrator">
      <div className="bundle-box">
        <p className="bundle-intro">
          Solana blocks are vulnerable to sandwiched re-ordering. SCRAMJET seals five atomic operations into a single unbreakably bonded Jito bundle:
        </p>

        {/* 5-Slot Horizontal Chain */}
        <div className="bundle-chain" role="tablist">
          {SLOTS.map((s, idx) => {
            const isSelected = activeSlot === idx;
            return (
              <div
                key={s.num}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                className={`bundle-slot ${isSelected ? "selected" : ""}`}
                onClick={() => setActiveSlot(idx)}
                onKeyDown={(e) => e.key === "Enter" && setActiveSlot(idx)}
              >
                <div className="slot-head">
                  <span className="slot-idx">SLOT {s.num}</span>
                  <span className="slot-status">SEALED</span>
                </div>
                <h4 className="slot-title">{s.title}</h4>
                <p className="slot-action">{s.action}</p>
                <div className="slot-footer">
                  <span>{s.gas}</span>
                </div>
                {idx < SLOTS.length - 1 && <div className="slot-connector" aria-hidden="true">➔</div>}
              </div>
            );
          })}
        </div>

        {/* Slot Bytecode Detail Drawer */}
        <div className="slot-inspector" aria-live="polite">
          <div className="insp-head">
            <span className="insp-tag">INSTRUCTION DETAILS — {SLOTS[activeSlot].title}</span>
            <span className="insp-sig">STATUS: ATOMIC LOCK VERIFIED</span>
          </div>
          <div className="insp-grid">
            <div className="insp-col">
              <span className="col-lbl">EXECUTION GUARANTEE</span>
              <span className="col-val">All 5 execute or NONE execute (Zero partial state)</span>
            </div>
            <div className="insp-col">
              <span className="col-lbl">MEV EXPOSURE</span>
              <span className="col-val good">0.00% (No external transactions can be inserted)</span>
            </div>
            <div className="insp-col">
              <span className="col-lbl">COMPUTE BUDGET</span>
              <span className="col-val">{SLOTS[activeSlot].gas}</span>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 7. HYPER-DIMENSIONAL BONDING CURVE
// Dynamic interactive bonding curve formula with real-time reserves tracking
// ===========================================================================
export function LiquidityManifold() {
  const [curveType, setCurveType] = useState("exponential");
  const [solIn, setSolIn] = useState(15);

  const tokensOut = useMemo(() => {
    if (curveType === "linear") return (solIn * 1250000).toLocaleString();
    if (curveType === "dynamic") return (solIn * 980000).toLocaleString();
    return (solIn * 1420000).toLocaleString(); // exponential
  }, [curveType, solIn]);

  const progress = Math.min(100, Math.round((solIn / 69) * 100));

  return (
    <Block id="liquidity-manifold">
      <div className="manifold-box">
        <div className="manifold-controls">
          <div className="curve-buttons">
            <button
              type="button"
              className={`curve-btn ${curveType === "exponential" ? "active" : ""}`}
              onClick={() => setCurveType("exponential")}
            >
              Exponential (Pump Curve)
            </button>
            <button
              type="button"
              className={`curve-btn ${curveType === "dynamic" ? "active" : ""}`}
              onClick={() => setCurveType("dynamic")}
            >
              Dynamic Fee (Meteora DBC)
            </button>
            <button
              type="button"
              className={`curve-btn ${curveType === "linear" ? "active" : ""}`}
              onClick={() => setCurveType("linear")}
            >
              Linear Escalation
            </button>
          </div>

          <div className="sol-slider-wrap">
            <label htmlFor="sol-in-slider">Simulate Purchase Volume: <strong>{solIn} SOL</strong></label>
            <input
              id="sol-in-slider"
              type="range"
              min="1"
              max="69"
              value={solIn}
              onChange={(e) => setSolIn(Number(e.target.value))}
              className="sol-slider"
            />
          </div>
        </div>

        {/* Mathematical Curve Canvas */}
        <div className="curve-canvas-wrap">
          <svg viewBox="0 0 500 200" className="curve-svg" aria-label="Bonding Curve Mathematical Graph">
            {/* Coordinate axes */}
            <line x1="40" y1="170" x2="480" y2="170" stroke="#334155" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1.5" />

            {/* Graduation Threshold 69 SOL */}
            <line x1="420" y1="20" x2="420" y2="170" stroke="#F59E0B" strokeDasharray="3 3" strokeWidth="1" />
            <text x="425" y="40" fill="#F59E0B" fontSize="9" fontFamily="JetBrains Mono">
              GRADUATION: 69 SOL
            </text>

            {/* Dynamic Curve Path */}
            {curveType === "exponential" && (
              <path d="M 40,170 Q 300,165 420,30" fill="none" stroke="#FF7700" strokeWidth="3" />
            )}
            {curveType === "dynamic" && (
              <path d="M 40,170 C 180,160 260,80 420,30" fill="none" stroke="#38BDF8" strokeWidth="3" />
            )}
            {curveType === "linear" && (
              <line x1="40" y1="170" x2="420" y2="30" stroke="#A855F7" strokeWidth="3" />
            )}

            {/* User Purchase Position Marker */}
            {(() => {
              const px = 40 + (solIn / 69) * 380;
              const ratio = solIn / 69;
              const py = curveType === "linear" 
                ? 170 - ratio * 140 
                : 170 - Math.pow(ratio, 2) * 140;
              return (
                <g transform={`translate(${px}, ${py})`}>
                  <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#FF7700" strokeWidth="1.5" opacity="0.6" />
                  <text x="14" y="4" fill="#F8FAFC" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    {solIn} SOL
                  </text>
                </g>
              );
            })()}
          </svg>

          <div className="curve-summary-bar">
            <div className="c-metric">
              <span className="lbl">TOKENS RECEIVED</span>
              <span className="val highlight">{tokensOut} MACH</span>
            </div>
            <div className="c-metric">
              <span className="lbl">GRADUATION PROGRESS</span>
              <span className="val">{progress}% of Bonding Target</span>
            </div>
            <div className="c-metric">
              <span className="lbl">DEX MIGRATION</span>
              <span className="val">Auto-transfers to Raydium/Meteora at 100%</span>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 8. COLLIMATED FIGHTER PILOT HUD
// Supersonic avionics display with horizon ladder and cursor target lock
// ===========================================================================
export function CockpitHud() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hudMode, setHudMode] = useState("COMBAT");
  const [locked, setLocked] = useState(false);

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x: nx * 30, y: ny * 20 });
  }

  return (
    <Block id="cockpit-hud">
      <div className="hud-wrapper" onMouseMove={onMouseMove}>
        {/* HUD Mode Switcher */}
        <div className="hud-mode-bar">
          <span>AVIONICS HUD v4.0</span>
          <div className="mode-tabs">
            {["NAV", "COMBAT", "LAUNCH"].map((m) => (
              <button
                key={m}
                type="button"
                className={`hud-mode-btn ${hudMode === m ? "active" : ""}`}
                onClick={() => setHudMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <button type="button" className="lock-btn" onClick={() => setLocked(!locked)}>
            {locked ? "LOCK ENGAGED" : "ACQUIRE TARGET"}
          </button>
        </div>

        {/* Collimated Reticle Canvas */}
        <div className="hud-viewport">
          <svg viewBox="-150 -100 300 200" className="hud-svg" aria-label="Fighter Pilot HUD">
            {/* Horizon Pitch Ladder tilting with mouse */}
            <g transform={`translate(${coords.x * 0.4}, ${coords.y * 0.4}) rotate(${coords.x * 0.3})`}>
              {/* Center boresight */}
              <circle cx="0" cy="0" r="3" fill="#FF7700" />
              <path d="M -15,0 L -5,0 M 5,0 L 15,0 M 0,-15 L 0,-5 M 0,5 L 0,15" stroke="#FF7700" strokeWidth="1.2" />

              {/* +10 Degree Pitch Line */}
              <line x1="-35" y1="-30" x2="35" y2="-30" stroke="#FF7700" strokeWidth="1" strokeDasharray="6 3" />
              <text x="40" y="-28" fill="#FF7700" fontSize="7" fontFamily="JetBrains Mono">+10</text>

              {/* -10 Degree Pitch Line */}
              <line x1="-35" y1="30" x2="35" y2="30" stroke="#FF7700" strokeWidth="1" strokeDasharray="6 3" />
              <text x="40" y="32" fill="#FF7700" fontSize="7" fontFamily="JetBrains Mono">-10</text>
            </g>

            {/* Mach Airspeed Tape (Left) */}
            <g transform="translate(-115, -60)">
              <rect width="25" height="120" fill="#0B0F17" stroke="#FF7700" strokeWidth="1" opacity="0.6" />
              <text x="12" y="20" textAnchor="middle" fill="#FF7700" fontSize="8" fontFamily="JetBrains Mono">M3.8</text>
              <text x="12" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">M3.5</text>
              <text x="12" y="100" textAnchor="middle" fill="#FF7700" fontSize="8" fontFamily="JetBrains Mono">M3.2</text>
            </g>

            {/* Solana Slot Altitude Tape (Right) */}
            <g transform="translate(90, -60)">
              <rect width="32" height="120" fill="#0B0F17" stroke="#FF7700" strokeWidth="1" opacity="0.6" />
              <text x="16" y="20" textAnchor="middle" fill="#FF7700" fontSize="6" fontFamily="JetBrains Mono">SLOT 492k</text>
              <text x="16" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">318,492</text>
              <text x="16" y="100" textAnchor="middle" fill="#FF7700" fontSize="6" fontFamily="JetBrains Mono">SLOT 491k</text>
            </g>

            {/* Dynamic Target Box tracking pointer */}
            <g transform={`translate(${coords.x * 1.5}, ${coords.y * 1.5})`}>
              <rect
                x="-18"
                y="-18"
                width="36"
                height="36"
                fill="none"
                stroke={locked ? "#EF4444" : "#FF7700"}
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="0" y="26" textAnchor="middle" fill={locked ? "#EF4444" : "#FF7700"} fontSize="7" fontFamily="JetBrains Mono">
                {locked ? "LOCKED: SOLANA LEADER" : "TRACKING"}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 9. TOKEN ALLOCATION CENTRIFUGE
// Rotating gyroscopic rotor with interactive slice extraction
// ===========================================================================
export function TokenomicsCentrifuge() {
  const [activeSlice, setActiveSlice] = useState(0);

  const SLICES = [
    { title: "Public Bonding Curve", pct: 80.0, color: "#FF7700", note: "Fair launch for public liquidity on bonding curve" },
    { title: "Creator Allocation", pct: 10.0, color: "#38BDF8", note: "Vested token share for founder & contributors" },
    { title: "AMM Migration Pool", pct: 6.5, color: "#F59E0B", note: "Seed liquidity reserved for Raydium/Meteora pool" },
    { title: "SCRAMJET Protocol Fee", pct: 3.5, color: "#FF3E00", note: "Fixed platform execution & anti-MEV guarantee" },
  ];

  return (
    <Block id="tokenomics-centrifuge">
      <div className="centrifuge-layout">
        {/* Rotating SVG Rotor Graphic */}
        <div className="centrifuge-stage">
          <svg viewBox="-100 -100 200 200" className="centrifuge-svg" aria-label="Token Allocation Centrifuge">
            {/* Outer Gyroscope Gimbals */}
            <circle cx="0" cy="0" r="88" fill="none" stroke="#1E293B" strokeWidth="2" />
            <circle cx="0" cy="0" r="76" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

            {/* Centrifuge Ring Slices */}
            {/* 80% Arc (0 to 288 deg) */}
            <path
              d="M 0,-65 A 65,65 0 1,1 -61.8,20.0"
              fill="none"
              stroke="#FF7700"
              strokeWidth={activeSlice === 0 ? "14" : "10"}
              className="rotor-arc"
              onClick={() => setActiveSlice(0)}
            />
            {/* 10% Arc (288 to 324 deg) */}
            <path
              d="M -61.8,20.0 A 65,65 0 0,1 -38.2,-52.5"
              fill="none"
              stroke="#38BDF8"
              strokeWidth={activeSlice === 1 ? "14" : "10"}
              className="rotor-arc"
              onClick={() => setActiveSlice(1)}
            />
            {/* 6.5% Arc (324 to 347.4 deg) */}
            <path
              d="M -38.2,-52.5 A 65,65 0 0,1 -14.1,-63.4"
              fill="none"
              stroke="#F59E0B"
              strokeWidth={activeSlice === 2 ? "14" : "10"}
              className="rotor-arc"
              onClick={() => setActiveSlice(2)}
            />
            {/* 3.5% Arc (347.4 to 360 deg) */}
            <path
              d="M -14.1,-63.4 A 65,65 0 0,1 0,-65"
              fill="none"
              stroke="#FF3E00"
              strokeWidth={activeSlice === 3 ? "14" : "10"}
              className="rotor-arc"
              onClick={() => setActiveSlice(3)}
            />

            {/* Central Spindle Hub */}
            <circle cx="0" cy="0" r="28" fill="#0B0F17" stroke="#475569" strokeWidth="2" />
            <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              1,000,000,000
            </text>
            <text x="0" y="8" textAnchor="middle" fill="#64748B" fontSize="6" fontFamily="JetBrains Mono">
              TOTAL SUPPLY
            </text>
          </svg>
        </div>

        {/* Slice Inspector Cards */}
        <div className="centrifuge-info">
          <div className="slice-buttons">
            {SLICES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={`slice-btn ${activeSlice === i ? "active" : ""}`}
                style={{ borderLeftColor: s.color }}
                onClick={() => setActiveSlice(i)}
              >
                <span className="slice-pct">{s.pct}%</span>
                <span className="slice-name">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="slice-card" style={{ borderColor: SLICES[activeSlice].color }}>
            <div className="card-top">
              <span className="card-badge" style={{ backgroundColor: SLICES[activeSlice].color }}>
                {SLICES[activeSlice].pct}% OF TOTAL
              </span>
              <span className="card-tokens">
                {(SLICES[activeSlice].pct * 10000000).toLocaleString()} TOKENS
              </span>
            </div>
            <h3 className="card-title">{SLICES[activeSlice].title}</h3>
            <p className="card-note">{SLICES[activeSlice].note}</p>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 10. SOLANA COMPUTE UNIT REDLINE TACHOMETER
// Dual-needle tachometer tracking Compute Units & Priority Tips with redline flash
// ===========================================================================
export function ComputeTachometer() {
  const [cu, setCu] = useState(420000); // 0 to 1,400,000 CU
  const [isRedline, setIsRedline] = useState(false);

  function triggerBoost() {
    setIsRedline(true);
    setCu(1250000);
    setTimeout(() => {
      setIsRedline(false);
      setCu(480000);
    }, 2500);
  }

  // Calculate needle angle (-120deg to +120deg)
  const angle = -120 + (cu / 1400000) * 240;

  return (
    <Block id="compute-tachometer">
      <div className="tacho-box">
        <div className="tacho-gauge-wrap">
          <svg viewBox="-120 -120 240 240" className="tacho-svg" aria-label="Compute Unit Tachometer">
            {/* Background Dial Ring */}
            <circle cx="0" cy="0" r="105" fill="#0B0F17" stroke="#1E293B" strokeWidth="2" />

            {/* Normal Zone (0 to 1M CU) */}
            <path
              d="M -74,74 A 105,105 0 1,1 74,74"
              fill="none"
              stroke="#FF7700"
              strokeWidth="6"
              strokeDasharray="4 2"
              opacity="0.8"
            />

            {/* Redline Zone (>1.0M CU) */}
            <path
              d="M 52,91 A 105,105 0 0,1 74,74"
              fill="none"
              stroke="#EF4444"
              strokeWidth="8"
            />

            {/* Hash ticks */}
            {[-120, -80, -40, 0, 40, 80, 120].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = Math.sin(rad) * 90;
              const y1 = -Math.cos(rad) * 90;
              const x2 = Math.sin(rad) * 100;
              const y2 = -Math.cos(rad) * 100;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748B" strokeWidth="1.5" />;
            })}

            {/* Tachometer Needle */}
            <g transform={`rotate(${angle})`}>
              <line x1="0" y1="15" x2="0" y2="-92" stroke={isRedline ? "#EF4444" : "#F8FAFC"} strokeWidth="2.5" />
              <polygon points="0,-98 -4,-85 4,-85" fill={isRedline ? "#EF4444" : "#F8FAFC"} />
              <circle cx="0" cy="0" r="8" fill="#0B0F17" stroke="#475569" strokeWidth="2" />
            </g>

            {/* Center Digital Display */}
            <text x="0" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
              {cu.toLocaleString()}
            </text>
            <text x="0" y="58" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="JetBrains Mono">
              COMPUTE UNITS / TX
            </text>
          </svg>

          {/* Shift Light */}
          <div className={`shift-light ${isRedline ? "active" : ""}`}>
            <span>SHIFT LIGHT</span>
          </div>
        </div>

        <div className="tacho-actions">
          <div className="tacho-summary">
            <h3>Solana Compute Budget Optimization</h3>
            <p>
              Unoptimized launches crash against Solana’s 1.4M CU limit or fail due to insufficient priority micro-lamports. SCRAMJET automatically sizes instructions to 420K CU with dynamic tipping.
            </p>
          </div>
          <div className="action-row">
            <button type="button" className="boost-btn" onClick={triggerBoost}>
              Simulate Network Congestion Spike
            </button>
          </div>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 11. 400MS SOLANA SLOT MICROSCOPE
// High-speed looping microsecond breakdown of a single Solana slot
// ===========================================================================
export function AtomicClock() {
  const [activePhase, setActivePhase] = useState(0);
  const [ms, setMs] = useState(140);

  const PHASES = [
    { title: "Leader Schedule Lookup", start: 0, end: 50, desc: "Determining upcoming slot leader validator pubkey and geographical routing path" },
    { title: "Atomic Bundle Assembly", start: 50, end: 180, desc: "Compiling 5-instruction atomic transaction pack without public mempool leak" },
    { title: "Jito Block Engine Relay", start: 180, end: 280, desc: "Direct fiber optic transmit to validator memory buffer before block packaging" },
    { title: "Consensus Finality", start: 280, end: 400, desc: "Validator cluster multi-signature verification and permanent ledger recording" },
  ];

  return (
    <Block id="atomic-clock">
      <div className="clock-box">
        <div className="clock-timeline">
          <div className="clock-header">
            <span className="slot-badge">SOLANA SLOT #318,492,044</span>
            <span className="time-badge">400.00 MILLISECONDS TOTAL</span>
          </div>

          {/* 4-Phase Progress Bar */}
          <div className="slot-track" role="tablist">
            {PHASES.map((p, idx) => {
              const widthPct = ((p.end - p.start) / 400) * 100;
              const isSelected = activePhase === idx;
              return (
                <div
                  key={p.title}
                  role="tab"
                  aria-selected={isSelected}
                  className={`phase-chunk ${isSelected ? "selected" : ""}`}
                  style={{ width: `${widthPct}%` }}
                  onClick={() => setActivePhase(idx)}
                >
                  <span className="chunk-label">{p.start}-{p.end}ms</span>
                  <span className="chunk-name">{p.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Breakdown Card */}
        <div className="phase-card">
          <div className="phase-badge">
            PHASE {activePhase + 1} OF 4 · {PHASES[activePhase].start}ms to {PHASES[activePhase].end}ms
          </div>
          <h3 className="phase-title">{PHASES[activePhase].title}</h3>
          <p className="phase-desc">{PHASES[activePhase].desc}</p>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 12. SUPERSONIC DE LAVAL THRUST CHAMBER
// Interactive scramjet engine nozzle adjusting Mach shock diamonds
// ===========================================================================
export function PlasmaNozzle() {
  const [throttle, setThrottle] = useState(85);

  const diamonds = Math.floor(throttle / 20) + 1;
  const thrustKn = (throttle * 1.8).toFixed(1);

  return (
    <Block id="plasma-nozzle">
      <div className="nozzle-box">
        <div className="nozzle-controls">
          <label htmlFor="nozzle-throttle">Chamber Pressure / Expansion Ratio:</label>
          <input
            id="nozzle-throttle"
            type="range"
            min="20"
            max="100"
            value={throttle}
            onChange={(e) => setThrottle(Number(e.target.value))}
            className="nozzle-slider"
          />
          <div className="nozzle-readout">
            <span>THRUST: {thrustKn} kN</span>
            <span>SHOCK STRUCTURE: {diamonds} MACH DIAMONDS</span>
          </div>
        </div>

        <div className="nozzle-graphic">
          <svg viewBox="0 0 500 160" className="nozzle-svg" aria-label="Supersonic Scramjet Rocket Nozzle">
            {/* Converging-Diverging Nozzle Geometry */}
            <path
              d="M 20,20 L 100,50 L 220,15 L 240,15 L 240,145 L 220,145 L 100,110 L 20,140 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Nozzle Throat (Throat choke at x=100) */}
            <line x1="100" y1="50" x2="100" y2="110" stroke="#FF3E00" strokeWidth="1" strokeDasharray="3 3" />

            {/* Supersonic Exhaust Plume expanding out from x=220 */}
            <polygon
              points={`220,40 480,10 480,150 220,120`}
              fill="#FF7700"
              fillOpacity={throttle / 400}
            />

            {/* Supersonic Mach Shock Diamonds */}
            {Array.from({ length: diamonds }).map((_, i) => {
              const dx = 250 + i * 45;
              return (
                <polygon
                  key={i}
                  points={`${dx},80 ${dx + 18},65 ${dx + 36},80 ${dx + 18},95`}
                  fill="#FFFFFF"
                  stroke="#FF7700"
                  strokeWidth="1.5"
                  className="shock-diamond"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 13. GHOST FUNDER CRYPTOGRAPHY VAULT
// Interactive zero-knowledge ephemeral wallet generator
// ===========================================================================
export function StealthPayload() {
  const [stealthKey, setStealthKey] = useState("8xK2..9aP1");
  const [isGenerated, setIsGenerated] = useState(false);

  function generateStealth() {
    setIsGenerated(true);
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < 44; i++) str += chars[Math.floor(Math.random() * chars.length)];
    setStealthKey(`${str.slice(0, 4)}..${str.slice(-4)}`);
  }

  return (
    <Block id="stealth-payload">
      <div className="stealth-box">
        <div className="stealth-intro">
          <h3>Ephemeral Ghost Funder Keypair</h3>
          <p>
            Public deployer wallets are monitored by copy-trading snipers. Ghost Funder generates a single-use blinded address that deposits launch liquidity and instantly destroys its private key.
          </p>
        </div>

        <div className="vault-interface">
          <div className="vault-key-display">
            <span className="key-lbl">ACTIVE EPHEMERAL ADDRESS</span>
            <span className="key-val">{stealthKey}</span>
            <span className="key-badge">{isGenerated ? "DERIVED & BLINDED" : "READY TO DERIVE"}</span>
          </div>

          <button type="button" className="pri-btn" onClick={generateStealth}>
            Generate New Ephemeral Stealth Address
          </button>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 14. SUPERSONIC MULTI-VENUE SMART ROUTER
// Replaces the 3D toy carousel with a pro-grade high-velocity trading matrix
// ===========================================================================
export function VenueRouter() {
  const [selectedVenue, setSelectedVenue] = useState(0);

  const VENUES = [
    { name: "Pump.fun", type: "Bonding Curve", fee: "3.5%", latency: "12ms", share: "82%" },
    { name: "Meteora DBC", type: "Dynamic Fee AMM", fee: "3.5%", latency: "14ms", share: "91%" },
    { name: "Raydium", type: "LaunchLab CPMM", fee: "3.5%", latency: "18ms", share: "78%" },
    { name: "Bags", type: "Creator Royalty", fee: "3.5%", latency: "16ms", share: "88%" },
    { name: "LetsBonk", type: "Bonk Native", fee: "3.5%", latency: "15ms", share: "85%" },
    { name: "StonkFun", type: "Token-2022 Tax", fee: "3.5%", latency: "19ms", share: "74%" },
    { name: "Printr", type: "Supply Scaler", fee: "3.5%", latency: "22ms", share: "70%" },
    { name: "Anoncoin", type: "Privacy Curve", fee: "3.5%", latency: "25ms", share: "68%" },
  ];

  return (
    <Block id="venue-router">
      <div className="router-box">
        <div className="router-head">
          <p className="router-lede">
            SCRAMJET routes deployment transactions directly into the top Solana launch environments with unified 3.5% protocol fee parity:
          </p>
        </div>

        <div className="router-matrix">
          {VENUES.map((v, i) => {
            const isSel = selectedVenue === i;
            return (
              <div
                key={v.name}
                className={`venue-card ${isSel ? "active" : ""}`}
                onClick={() => setSelectedVenue(i)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === "Enter" && setSelectedVenue(i)}
              >
                <div className="card-top">
                  <span className="v-name">{v.name}</span>
                  <span className="v-lat">{v.latency}</span>
                </div>
                <div className="v-type">{v.type}</div>
                <div className="card-bot">
                  <span className="v-fee">FEE: {v.fee}</span>
                  <span className="v-rate">ROUTED</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="router-terminal">
          <span>OPTIMAL PATH SELECTED: <strong>{VENUES[selectedVenue].name}</strong> ({VENUES[selectedVenue].latency} Execution Relay)</span>
        </div>
      </div>
    </Block>
  );
}

// ===========================================================================
// 15. THERMAL RE-ENTRY FRICTION TILES
// Heat shield simulation glowing from cold slate to plasma orange on interaction
// ===========================================================================
export function AblationShield() {
  const [friction, setFriction] = useState(25); // 0 to 100%

  const kelvin = Math.round(300 + (friction / 100) * 2500);

  return (
    <Block id="ablation-shield">
      <div className="ablation-box">
        <div className="ablation-controls">
          <label htmlFor="friction-range">Simulate Re-entry Aerodynamic Friction:</label>
          <input
            id="friction-range"
            type="range"
            min="0"
            max="100"
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className="friction-slider"
          />
          <div className="temp-readout">
            <span>SURFACE TEMPERATURE: <strong>{kelvin} K</strong></span>
            <span>HEAT FLUX: {friction > 70 ? "EXTREME ABLATION" : "NOMINAL"}</span>
          </div>
        </div>

        {/* Silicon Carbide Hexagonal Tile Matrix */}
        <div className="hex-tile-grid">
          {Array.from({ length: 18 }).map((_, i) => {
            // Heat color interpolation based on friction
            const heatAlpha = Math.min(1, (friction / 100) * 1.2);
            return (
              <div
                key={i}
                className="hex-tile"
                style={{
                  backgroundColor: friction > 50 ? "#FF3E00" : "#1E293B",
                  opacity: 0.3 + heatAlpha * 0.7,
                  boxShadow: friction > 70 ? "0 0 16px rgba(255, 62, 0, 0.6)" : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </Block>
  );
}
