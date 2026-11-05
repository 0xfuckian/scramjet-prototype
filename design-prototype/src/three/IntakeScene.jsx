import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { usePerf } from "../perf/PerfProvider.jsx";

// ---------------------------------------------------------------------------
// Strict Symmetrical Candlestick Geometry & Spacing
// ALL candles (consolidation and God Candle) share the EXACT SAME:
// - Width: 0.28
// - Depth: 0.20
// - Spacing Step: 0.52 (leaves a generous 0.24 gap, ZERO collision!)
// - Green Color: #22C55E / Emissive: #15803D (Identical green material!)
// ---------------------------------------------------------------------------
const CANDLE_WIDTH = 0.28;
const CANDLE_DEPTH = 0.20;
const CANDLE_STEP = 0.52;
const BASELINE_OPEN_Y = -0.74; // Anchor bottom of the breakout candle body
const INITIAL_BODY_HEIGHT = 0.16; // Normal candlestick size at first appearance
const GOD_MAX_HEIGHT = 2.75; // Peak breakout height

// Exact matching colors for all green candles
const GREEN_COLOR = "#22C55E";
const GREEN_EMISSIVE = "#15803D";

// Red candles
const RED_COLOR = "#F43F5E";
const RED_EMISSIVE = "#BE123C";

// 6 Consolidation Candlesticks (Chop before the breakout)
const CONSOLIDATION_SERIES = [
  { open: -0.70, close: -0.88, high: -0.62, low: -0.96, green: false, vol: 0.18 },
  { open: -0.88, close: -0.72, high: -0.66, low: -0.94, green: true,  vol: 0.24 },
  { open: -0.72, close: -0.84, high: -0.68, low: -0.90, green: false, vol: 0.16 },
  { open: -0.84, close: -0.68, high: -0.62, low: -0.90, green: true,  vol: 0.30 },
  { open: -0.68, close: -0.78, high: -0.64, low: -0.84, green: false, vol: 0.20 },
  { open: -0.78, close: -0.74, high: -0.66, low: -0.84, green: true,  vol: 0.28 },
];

// 7 candles total (indices 0 to 6). Symmetrically centered around x = 0!
// Candle 0: x = -1.56
// Candle 1: x = -1.04
// Candle 2: x = -0.52
// Candle 3: x =  0.00
// Candle 4: x = +0.52
// Candle 5: x = +1.04
// God Candle (6): x = +1.56 (Distance to Candle 5 is 0.52, leaving a clean 0.24 air gap!)
const START_X = -1.56;
const GOD_CANDLE_X = START_X + CONSOLIDATION_SERIES.length * CANDLE_STEP; // x = +1.56

// ---------------------------------------------------------------------------
// Stratospheric Resistance Levels (Crossing wide across the viewport)
// ---------------------------------------------------------------------------
function ChartGridLines({ candleHeight }) {
  const levels = [
    { y: -1.02, label: "GROUND ACCUMULATION ($0.01)", color: "#334155" },
    { y: -0.64, label: "BREAKOUT BASELINE ($0.10)", color: "#475569" },
    { y: 0.22,  label: "RESISTANCE 1 ($1.00) [SHATTERED]", color: "#059669" },
    { y: 1.05,  label: "RESISTANCE 2 ($10.0) [SHATTERED]", color: "#10B981" },
    { y: 1.85,  label: "STRATOSPHERE ATH ($100.0) [BROKEN]", color: "#31E3AC" },
    { y: 2.50,  label: "ORBITAL ESCAPE ($1000.0+)", color: "#86EFAC" },
  ];

  return (
    <group position={[0, 0, -0.2]}>
      {levels.map((lvl, idx) => {
        const breached = candleHeight > lvl.y;
        return (
          <group key={idx} position={[0, lvl.y, 0]}>
            <mesh>
              <boxGeometry args={[11.5, 0.012, 0.012]} />
              <meshBasicMaterial
                color={breached ? lvl.color : "#1E293B"}
                transparent
                opacity={breached ? 0.9 : 0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Deep Ground Grid Base */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.0, 4.0]} />
        <meshBasicMaterial color="#05070B" />
      </mesh>
      <gridHelper args={[12.0, 24, "#1E293B", "#0B1019"]} position={[0, -1.045, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Ascending Market Sparks
// ---------------------------------------------------------------------------
function MarketSparkParticles({ count = 140, erupting }) {
  const pointsRef = useRef(null);
  const { low } = usePerf();
  const actualCount = low ? 40 : count;

  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const spd = new Float32Array(actualCount);
    const col = new Float32Array(actualCount * 3);

    const cNeon = new THREE.Color("#31E3AC");
    const cGreen = new THREE.Color(GREEN_COLOR);
    const cGold = new THREE.Color("#FCD34D");
    const cWhite = new THREE.Color("#FFFFFF");

    for (let i = 0; i < actualCount; i++) {
      const radX = (Math.random() - 0.5) * 4.6;
      const radZ = (Math.random() - 0.5) * 1.8;
      pos[i * 3] = radX;
      pos[i * 3 + 1] = -1.1 + Math.random() * 4.2;
      pos[i * 3 + 2] = radZ;

      spd[i] = 0.02 + Math.random() * 0.05;

      const pick = Math.random();
      const chosen = pick > 0.8 ? cWhite : pick > 0.6 ? cGold : pick > 0.25 ? cNeon : cGreen;
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return [pos, spd, col];
  }, [actualCount, low]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const mult = erupting ? 3.6 : 1.0;

    for (let i = 0; i < actualCount; i++) {
      let y = posAttr.getY(i) + speeds[i] * (delta * 60) * mult;
      if (y > 3.6) {
        y = -1.1 - Math.random() * 0.2;
      }
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={low ? 0.045 : 0.038}
        vertexColors
        transparent
        opacity={erupting ? 0.9 : 0.45}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3D Floating HUD Banner
// ---------------------------------------------------------------------------
function FloatingHudBadge({ position, gainPct, isVisible }) {
  const meshRef = useRef(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 130;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(7, 10, 16, 0.96)";
    ctx.beginPath();
    ctx.roundRect(4, 4, 272, 122, 12);
    ctx.fill();

    ctx.lineWidth = 3.0;
    ctx.strokeStyle = GREEN_COLOR;
    ctx.stroke();

    ctx.fillStyle = GREEN_COLOR;
    ctx.font = "900 36px monospace";
    ctx.fillText(`▲ +${gainPct}%`, 16, 46);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 18px monospace";
    ctx.fillText("GOD CANDLE ATH", 16, 80);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 14px monospace";
    ctx.fillText("VOL: 2,450,000 SOL", 16, 110);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [gainPct]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2.2) * 0.04;
    meshRef.current.scale.setScalar(isVisible ? 1 : 0);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.25, 0.58]} />
      <meshBasicMaterial map={texture} transparent opacity={0.98} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Main Cinematic God Candle Chart
// ---------------------------------------------------------------------------
function CinematicGodCandle() {
  const group = useRef(null);
  const candleMesh = useRef(null);
  const shockRingRef = useRef(null);

  // Timing
  const animTime = useRef(0);
  const [visibleCandles, setVisibleCandles] = useState(0);
  const [showGodCandle, setShowGodCandle] = useState(false);
  const [erupting, setErupting] = useState(false);
  const [gain, setGain] = useState(140);

  const currentHeight = useRef(INITIAL_BODY_HEIGHT);
  const targetHeight = useRef(INITIAL_BODY_HEIGHT);

  const CYCLE_DURATION = 12.0;

  useFrame((state, delta) => {
    animTime.current += delta;
    const t = animTime.current % CYCLE_DURATION;

    // Centered camera target
    let targetCamX = 0.0;
    let targetCamY = -0.22;
    let targetCamZ = 4.1;
    let targetLookX = 0.0;
    let targetLookY = -0.45;

    // Phase 1: Rapid printing of 6 consolidation candles one-by-one (0s - 2.2s)
    if (t < 2.2) {
      const stepTime = 2.2 / CONSOLIDATION_SERIES.length;
      const count = Math.min(
        CONSOLIDATION_SERIES.length,
        Math.floor(t / stepTime) + 1
      );
      setVisibleCandles(count);
      setShowGodCandle(false);
      setErupting(false);
      targetHeight.current = INITIAL_BODY_HEIGHT;
      setGain(Math.floor(90 + (t / 2.2) * 180));

      targetCamX = 0.0;
      targetCamY = -0.22;
      targetCamZ = 4.1;
      targetLookY = -0.45;
    }
    // Phase 2: Candle 7 (God Candle) appears at SAME EXACT WIDTH & COLOR (2.2s - 2.5s)
    // Starts as a normal candlestick: height = 0.16, width = 0.28, green = #22C55E
    else if (t >= 2.2 && t < 2.5) {
      setVisibleCandles(CONSOLIDATION_SERIES.length);
      setShowGodCandle(true);
      setErupting(false);
      targetHeight.current = INITIAL_BODY_HEIGHT;
      setGain(280);

      targetCamX = 0.0;
      targetCamY = -0.20;
      targetCamZ = 4.1;
      targetLookY = -0.42;
    }
    // Phase 3: THE GOD CANDLE ERUPTS TALLER ONLY (2.5s - 7.0s)
    // WIDTH (0.28) NEVER CHANGES! DEPTH (0.20) NEVER CHANGES! COLOR STAYS GREEN (#22C55E)!
    // ONLY HEIGHT GROWS!
    else if (t >= 2.5 && t < 7.0) {
      setVisibleCandles(CONSOLIDATION_SERIES.length);
      setShowGodCandle(true);
      setErupting(true);

      const pumpProgress = Math.min(1, (t - 2.5) / 3.6);
      const pumpCurve = 1 - Math.pow(1 - pumpProgress, 3.6);

      // Shoots straight up from INITIAL_BODY_HEIGHT up to GOD_MAX_HEIGHT
      targetHeight.current = INITIAL_BODY_HEIGHT + pumpCurve * (GOD_MAX_HEIGHT - INITIAL_BODY_HEIGHT);
      setGain(Math.floor(280 + Math.pow(pumpProgress, 2.7) * 48200));

      // As candle shoots upward, smoothly zoom camera back so the entire chart remains in view
      targetCamX = 0.0;
      targetCamY = 0.35;
      targetCamZ = 5.6;
      targetLookY = 0.35;
    }
    // Phase 4: Stratosphere ATH Apex Hold (7.0s - 11.2s)
    else if (t >= 7.0 && t < 11.2) {
      setVisibleCandles(CONSOLIDATION_SERIES.length);
      setShowGodCandle(true);
      setErupting(true);
      targetHeight.current = GOD_MAX_HEIGHT + Math.sin(t * 3.2) * 0.06;

      targetCamX = 0.0;
      targetCamY = 0.35;
      targetCamZ = 5.6;
      targetLookY = 0.35;
    }
    // Phase 5: Loop reset (11.2s - 12.0s)
    else {
      targetHeight.current = INITIAL_BODY_HEIGHT;
      setShowGodCandle(false);
      targetCamX = 0.0;
      targetCamY = -0.22;
      targetCamZ = 4.1;
      targetLookY = -0.45;
    }

    // Camera smoothing with interactive mouse parallax
    const mouseX = state.pointer.x * 0.08;
    const mouseY = state.pointer.y * 0.05;

    state.camera.position.x += (targetCamX + mouseX - state.camera.position.x) * 0.08;
    state.camera.position.y += (targetCamY + mouseY - state.camera.position.y) * 0.08;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.08;

    state.camera.lookAt(targetLookX, targetLookY, 0);

    // Responsive height-only growth lerp
    currentHeight.current += (targetHeight.current - currentHeight.current) * 0.16;
    const h = Math.max(INITIAL_BODY_HEIGHT, currentHeight.current);

    // ONLY h (HEIGHT) IS SCALED! WIDTH (x=1) AND DEPTH (z=1) NEVER CHANGE!
    if (candleMesh.current) {
      candleMesh.current.scale.set(1, h, 1);
      candleMesh.current.position.y = BASELINE_OPEN_Y + h / 2;
    }

    // Shockwave ring at tip
    if (shockRingRef.current) {
      if (erupting && h > 0.8) {
        shockRingRef.current.scale.x += delta * 4.0;
        shockRingRef.current.scale.y += delta * 4.0;
        shockRingRef.current.material.opacity = Math.max(
          0,
          shockRingRef.current.material.opacity - delta * 1.5
        );
      } else {
        shockRingRef.current.scale.set(0.1, 0.1, 0.1);
        shockRingRef.current.material.opacity = 0.8;
      }
    }

    // Subtle group tilt
    if (group.current) {
      const tilt = state.pointer.x * 0.04;
      group.current.rotation.y += (tilt - group.current.rotation.y) * 0.06;
    }
  });

  const candleTopY = BASELINE_OPEN_Y + currentHeight.current;

  function triggerExplosion() {
    animTime.current = 2.55;
  }

  return (
    <group ref={group} onClick={triggerExplosion} cursor="pointer">
      {/* Chart Grid Lines & Horizontal Resistance */}
      <ChartGridLines candleHeight={candleTopY} />

      {/* Preceding Historical Consolidation Candlesticks (Prominently framed on left) */}
      <group>
        {CONSOLIDATION_SERIES.slice(0, visibleCandles).map((c, i) => {
          const posX = START_X + i * CANDLE_STEP;
          const bodyHeight = Math.max(0.12, Math.abs(c.close - c.open));
          const bodyY = (c.open + c.close) / 2;
          const wickHeight = Math.max(0.24, c.high - c.low);
          const wickY = (c.high + c.low) / 2;
          const color = c.green ? GREEN_COLOR : RED_COLOR;
          const emissive = c.green ? GREEN_EMISSIVE : RED_EMISSIVE;

          return (
            <group key={i} position={[posX, 0, 0]}>
              {/* Candle Body - EXACT SAME WIDTH (0.28) AND DEPTH (0.20) */}
              <mesh position={[0, bodyY, 0]}>
                <boxGeometry args={[CANDLE_WIDTH, bodyHeight, CANDLE_DEPTH]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={0.35}
                  roughness={0.25}
                  metalness={0.15}
                />
              </mesh>

              {/* Wick */}
              <mesh position={[0, wickY, 0]}>
                <cylinderGeometry args={[0.012, 0.012, wickHeight, 8]} />
                <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} />
              </mesh>

              {/* Volume Bar Underneath */}
              <mesh position={[0, -1.02 + c.vol / 2, 0]}>
                <boxGeometry args={[CANDLE_WIDTH, c.vol, CANDLE_DEPTH]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={0.25}
                  transparent
                  opacity={0.65}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ================= THE GOD CANDLE ================= */}
      {/* EXACT SAME WIDTH (0.28), DEPTH (0.20) AND GREEN COLOR AS THE OTHER GREEN CANDLES! */}
      {/* ZERO COLLISION (0.24 gap to Candle 5)! ONLY GROWS TALLER IN HEIGHT! */}
      {showGodCandle && (
        <group position={[GOD_CANDLE_X, 0, 0]}>
          {/* Lower Wick below open */}
          <mesh position={[0, BASELINE_OPEN_Y - 0.08, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
            <meshStandardMaterial
              color={GREEN_COLOR}
              emissive={GREEN_EMISSIVE}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Dynamic God Candle Body - Same width & depth, SAME GREEN MATERIAL, scales in HEIGHT only */}
          <mesh ref={candleMesh} position={[0, BASELINE_OPEN_Y + INITIAL_BODY_HEIGHT / 2, 0]}>
            <boxGeometry args={[CANDLE_WIDTH, 1, CANDLE_DEPTH]} />
            <meshStandardMaterial
              color={GREEN_COLOR}
              emissive={GREEN_EMISSIVE}
              emissiveIntensity={0.38}
              roughness={0.25}
              metalness={0.15}
            />
          </mesh>

          {/* Proportional Upper Wick on top of the surging candle */}
          <mesh position={[0, candleTopY + 0.10, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.20, 8]} />
            <meshStandardMaterial
              color={GREEN_COLOR}
              emissive={GREEN_EMISSIVE}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Apex Star Diamond Flare right at the top of the upper wick */}
          <group position={[0, candleTopY + 0.20, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <octahedronGeometry args={[0.065, 0]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Breakthrough Shockwave Ring */}
          <mesh
            ref={shockRingRef}
            position={[0, candleTopY, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.20, 0.26, 32]} />
            <meshBasicMaterial color={GREEN_COLOR} transparent opacity={0.7} />
          </mesh>

          {/* Standard Volume Bar Underneath (Width 0.28, Depth 0.20, sitting cleanly on floor) */}
          <mesh position={[0, -1.02 + 0.32 / 2, 0]}>
            <boxGeometry args={[CANDLE_WIDTH, 0.32, CANDLE_DEPTH]} />
            <meshStandardMaterial
              color={GREEN_COLOR}
              emissive={GREEN_EMISSIVE}
              emissiveIntensity={0.3}
              transparent
              opacity={0.75}
            />
          </mesh>
        </group>
      )}

      {/* Floating 3D HUD Badge (Docked cleanly on the right of the God Candle) */}
      <FloatingHudBadge
        position={[GOD_CANDLE_X + 0.90, Math.min(2.1, candleTopY - 0.15), 0.3]}
        gainPct={gain.toLocaleString()}
        isVisible={showGodCandle && erupting && currentHeight.current > 0.5}
      />

      {/* Ascending Rocket Market Sparks */}
      <MarketSparkParticles count={140} erupting={erupting} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Root Scene with Guaranteed Constant 60fps Frameloop
// ---------------------------------------------------------------------------
export default function IntakeScene({ onReady }) {
  const { post } = usePerf();

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0.0, -0.22, 4.1], fov: 42 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#06080E", 1);
        onReady?.();
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={2.8} color="#FFFFFF" />
      <directionalLight position={[-4, 2, -1]} intensity={1.5} color="#059669" />

      <CinematicGodCandle />

      {post && (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
