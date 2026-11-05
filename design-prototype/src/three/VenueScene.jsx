import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { usePerf } from "../perf/PerfProvider.jsx";

// ===========================================================================
// LUXURY AEROSPACE PBR MATERIALS
// Heavy brushed titanium, 24k bullion gold, mirror chrome, and laser emissives
// ===========================================================================
const MAT_GOLD = {
  color: "#F59E0B",
  emissive: "#B45309",
  emissiveIntensity: 0.25,
  metalness: 0.98,
  roughness: 0.12,
  clearcoat: 1.0,
  clearcoatRoughness: 0.06,
};

const MAT_TITANIUM = {
  color: "#0F172A",
  emissive: "#020617",
  emissiveIntensity: 0.1,
  metalness: 0.92,
  roughness: 0.24,
  clearcoat: 0.8,
  clearcoatRoughness: 0.14,
};

const MAT_CHROME = {
  color: "#F8FAFC",
  metalness: 0.98,
  roughness: 0.04,
  clearcoat: 1.0,
};

const MAT_CYAN = {
  color: "#38BDF8",
  emissive: "#0284C7",
  emissiveIntensity: 0.5,
  metalness: 0.8,
  roughness: 0.15,
  clearcoat: 1.0,
};

const MAT_MINT = {
  color: "#22C55E",
  emissive: "#15803D",
  emissiveIntensity: 0.5,
  metalness: 0.3,
  roughness: 0.15,
  clearcoat: 1.0,
};

// ===========================================================================
// 12 LASER-ETCHED BRAND INSIGNIAS (High-Relief Vector Stamps)
// ===========================================================================

// 0. Pump.fun: Two-tone mint & white capsule pill
function InsigniaPumpFun() {
  return (
    <group position={[0, 0, 0.022]} rotation={[0, 0, -Math.PI / 4]}>
      {/* Lower Mint Half */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.07, 24]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      <mesh position={[0, -0.085, 0]}>
        <sphereGeometry args={[0.045, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      {/* Upper White Porcelain Half */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.07, 24]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} metalness={0.05} clearcoat={1.0} />
      </mesh>
      <mesh position={[0, 0.085, 0]}>
        <sphereGeometry args={[0.045, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.1} metalness={0.05} clearcoat={1.0} />
      </mesh>
      {/* Center 24k Gold Dividing Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.047, 0.005, 12, 24]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// 1. Meteora DBC: Supersonic 'M' delta chevron
function InsigniaMeteora() {
  return (
    <group position={[0, -0.01, 0.022]}>
      {/* Left Wing */}
      <mesh position={[-0.065, 0, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.032, 0.14, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Right Wing */}
      <mesh position={[0.065, 0, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.032, 0.14, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Center Dynamic V-Spine */}
      <mesh position={[-0.022, 0.025, 0.002]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.026, 0.09, 0.012]} />
        <meshPhysicalMaterial {...MAT_CYAN} />
      </mesh>
      <mesh position={[0.022, 0.025, 0.002]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.026, 0.09, 0.012]} />
        <meshPhysicalMaterial {...MAT_CYAN} />
      </mesh>
    </group>
  );
}

// 2. Raydium: Prismatic Faceted 'R' Prism
function InsigniaRaydium() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Vertical Spine */}
      <mesh position={[-0.055, 0, 0]}>
        <boxGeometry args={[0.028, 0.15, 0.012]} />
        <meshPhysicalMaterial {...MAT_CYAN} />
      </mesh>
      {/* Top Arc Loop */}
      <mesh position={[-0.015, 0.038, 0]}>
        <torusGeometry args={[0.040, 0.014, 12, 24, Math.PI * 1.3]} />
        <meshPhysicalMaterial {...MAT_CYAN} />
      </mesh>
      {/* Diagonal Kick Leg */}
      <mesh position={[0.025, -0.040, 0]} rotation={[0, 0, -0.65]}>
        <boxGeometry args={[0.028, 0.095, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Center Crystal Spark */}
      <mesh position={[-0.015, 0.038, 0.008]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.018, 0]} />
        <meshPhysicalMaterial color="#FFFFFF" emissive="#38BDF8" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// 3. Bags: Stylized Creator '$' Medallion
function InsigniaBags() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Outer Coin Rim */}
      <mesh>
        <ringGeometry args={[0.085, 0.095, 32]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* '$' Vertical Spine */}
      <mesh position={[0, 0, 0.002]}>
        <boxGeometry args={[0.018, 0.13, 0.01]} />
        <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
      </mesh>
      {/* Upper S-Loop */}
      <mesh position={[0, 0.032, 0.002]}>
        <torusGeometry args={[0.034, 0.009, 8, 16, Math.PI * 1.5]} />
        <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
      </mesh>
      {/* Lower S-Loop */}
      <mesh position={[0, -0.032, 0.002]}>
        <torusGeometry args={[0.034, 0.009, 8, 16, Math.PI * 1.5]} />
        <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// 4. LetsBonk: Cyber Warhammer Silhouette
function InsigniaLetsBonk() {
  return (
    <group position={[0, 0, 0.022]} rotation={[0, 0, -0.3]}>
      {/* Hammer Shaft */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.022, 0.14, 0.01]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      {/* 24k Gold Hammer Head */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.055, 0.014]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Impact Plate */}
      <mesh position={[-0.062, 0.05, 0]}>
        <boxGeometry args={[0.008, 0.065, 0.016]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      {/* Impact Sparks */}
      <mesh position={[-0.085, 0.07, 0.005]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.016, 0]} />
        <meshBasicMaterial color="#FDE047" />
      </mesh>
    </group>
  );
}

// 5. StonkFun: Ascending Breakout Chevron
function InsigniaStonkFun() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Stepped Chart Bars */}
      <mesh position={[-0.065, -0.045, 0]}>
        <boxGeometry args={[0.026, 0.05, 0.01]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      <mesh position={[-0.022, -0.025, 0]}>
        <boxGeometry args={[0.026, 0.09, 0.01]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      <mesh position={[0.022, 0.005, 0]}>
        <boxGeometry args={[0.026, 0.15, 0.01]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      {/* Apex 24k Gold Breakout Arrow */}
      <mesh position={[0.065, 0.045, 0.004]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.038, 0.065, 3]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// 6. Printr: Precision Minting Roller & Currency Strip
function InsigniaPrintr() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Dual Chrome Rollers */}
      <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.13, 20]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh position={[0, -0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 0.13, 20]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      {/* Mint Emerald Currency Note */}
      <mesh position={[0, 0, 0.004]}>
        <boxGeometry args={[0.11, 0.055, 0.008]} />
        <meshPhysicalMaterial {...MAT_MINT} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <boxGeometry args={[0.018, 0.055, 0.004]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// 7. Anoncoin: Stealth Operative Cyber Mask
function InsigniaAnoncoin() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Faceted Mask Silhouette */}
      <mesh rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.085, 0.14, 5]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      {/* Glowing Cyan Cipher Visor Slot */}
      <mesh position={[0, 0.015, 0.025]}>
        <boxGeometry args={[0.095, 0.018, 0.01]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// 8. Surge: High-Voltage Lightning Bolt
function InsigniaSurge() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Top Segment */}
      <mesh position={[-0.015, 0.045, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.028, 0.08, 0.01]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>
      {/* Middle Connector */}
      <mesh position={[0.010, 0, 0]} rotation={[0, 0, 0.75]}>
        <boxGeometry args={[0.024, 0.075, 0.01]} />
        <meshPhysicalMaterial color="#FFFFFF" emissive="#38BDF8" emissiveIntensity={1.0} />
      </mesh>
      {/* Bottom Dart */}
      <mesh position={[-0.010, -0.048, 0]} rotation={[0, 0, -0.45]}>
        <coneGeometry args={[0.026, 0.09, 3]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// 9. Clanker: AI Autonomous Droid Faceplate
function InsigniaClanker() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Robot Head Frame */}
      <mesh>
        <boxGeometry args={[0.13, 0.11, 0.012]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      {/* Phosphor Green Eyes */}
      <mesh position={[-0.032, 0.015, 0.008]}>
        <cylinderGeometry args={[0.014, 0.014, 0.006, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0.032, 0.015, 0.008]}>
        <cylinderGeometry args={[0.014, 0.014, 0.006, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
      {/* Antenna with Orb */}
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh position={[0, 0.10, 0]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  );
}

// 10. FourMeme: Quad-Faceted Lucky '4' Emblem
function InsigniaFourMeme() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Vertical '4' Spine */}
      <mesh position={[0.025, 0, 0]}>
        <boxGeometry args={[0.026, 0.14, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Diagonal Beam */}
      <mesh position={[-0.025, 0.032, 0]} rotation={[0, 0, 0.65]}>
        <boxGeometry args={[0.024, 0.095, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Horizontal Crossbar */}
      <mesh position={[-0.012, -0.015, 0]}>
        <boxGeometry args={[0.11, 0.024, 0.012]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Center Inset Emerald Gem */}
      <mesh position={[0.025, -0.015, 0.008]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.018, 0]} />
        <meshPhysicalMaterial {...MAT_MINT} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

// 11. Flap: Supersonic Cyber Delta Wings
function InsigniaFlap() {
  return (
    <group position={[0, 0, 0.022]}>
      {/* Central Turbine Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.038, 0.012, 12, 24]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      {/* Plasma Core */}
      <mesh>
        <sphereGeometry args={[0.020, 16, 16]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
      {/* Left Wing Blade */}
      <mesh position={[-0.075, 0.02, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.08, 0.022, 0.01]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      {/* Right Wing Blade */}
      <mesh position={[0.075, 0.02, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.08, 0.022, 0.01]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

function VenueInsignia({ index }) {
  switch (index) {
    case 0: return <InsigniaPumpFun />;
    case 1: return <InsigniaMeteora />;
    case 2: return <InsigniaRaydium />;
    case 3: return <InsigniaBags />;
    case 4: return <InsigniaLetsBonk />;
    case 5: return <InsigniaStonkFun />;
    case 6: return <InsigniaPrintr />;
    case 7: return <InsigniaAnoncoin />;
    case 8: return <InsigniaSurge />;
    case 9: return <InsigniaClanker />;
    case 10: return <InsigniaFourMeme />;
    case 11: return <InsigniaFlap />;
    default: return <InsigniaPumpFun />;
  }
}

// ===========================================================================
// MACHINED TITANIUM MEDALLION (Unified Swiss Aerospace Form Factor)
// Heavy cylindrical coin with 24k chamfered gold rim, brushed titanium face,
// precision knurling teeth, and laser-etched venue insignia
// ===========================================================================
function MachinedMedallion({ index, isFocused }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    // Focused medallion catches specular light with gentle tilt oscillation
    if (isFocused) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.16;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.9) * 0.08;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.025;
    }
  });

  return (
    <group ref={group}>
      {/* 1. Heavy 24k Bullion Gold Chamfered Bezel Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.040, 64]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* 2. Recessed Brushed Dark Titanium Face (Front) */}
      <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.222, 0.222, 0.020, 64]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* 3. Recessed Brushed Dark Titanium Face (Back) */}
      <mesh position={[0, 0, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.222, 0.222, 0.020, 64]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* 4. Precision Concentric Gold Bezel Wire Ring */}
      <mesh position={[0, 0, 0.021]}>
        <ringGeometry args={[0.208, 0.222, 64]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* 5. Precision Perimeter Knurling Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.261, 0.005, 12, 64]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* 6. Authentic Laser-Etched Brand Insignia */}
      <VenueInsignia index={index} />
    </group>
  );
}

// ===========================================================================
// 12-MEDALLION TURNTABLE CAROUSEL RIG
// ===========================================================================
const VENUE_ACCENTS = [
  "#22C55E", // 0. Pump.fun (Mint)
  "#F59E0B", // 1. Meteora (Aerospace Gold)
  "#38BDF8", // 2. Raydium (Electric Cyan)
  "#F59E0B", // 3. Bags (Gold)
  "#F59E0B", // 4. LetsBonk (Bonk Gold)
  "#22C55E", // 5. StonkFun (Stonks Green)
  "#22C55E", // 6. Printr (Mint)
  "#38BDF8", // 7. Anoncoin (Cyan)
  "#38BDF8", // 8. Surge (Plasma Cyan)
  "#22C55E", // 9. Clanker (Phosphor Green)
  "#F59E0B", // 10. FourMeme (Gold)
  "#38BDF8", // 11. Flap (Shield Cyan)
];

const TOTAL_VENUES = 12;

function Rig({ focus }) {
  const group = useRef(null);
  const target = useRef(0);
  const { low } = usePerf();

  useEffect(() => {
    target.current = -focus * ((Math.PI * 2) / TOTAL_VENUES);
  }, [focus]);

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += (target.current - node.rotation.y) * 0.12;
    node.rotation.x = state.pointer.y * 0.06;
    if (low) state.invalidate();
  });

  return (
    <group ref={group}>
      {/* Dark Titanium Aerospace Turntable Ground */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial color="#0B0F17" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Subtle Orbital Track Ring */}
      <mesh position={[0, -0.415, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.38, 2.42, 64]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.5} />
      </mesh>

      {Array.from({ length: TOTAL_VENUES }).map((_, index) => {
        const angle = (index / TOTAL_VENUES) * Math.PI * 2;
        const radius = 2.4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const accent = VENUE_ACCENTS[index];
        const isFocused = index === focus;

        return (
          <group
            key={index}
            position={[x, 0, z]}
            // Outward facing orientation
            rotation={[0, angle, 0]}
          >
            <group scale={isFocused ? 0.95 : 0.50}>
              <MachinedMedallion index={index} isFocused={isFocused} />
            </group>

            {/* Glowing Studio Ring under each medallion */}
            <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.28, 32]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={isFocused ? 0.95 : 0.12}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function VenueScene({ onReady, focus = 0 }) {
  const { low } = usePerf();

  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      frameloop={low ? "demand" : "always"}
      gl={{
        antialias: !low,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.52, 4.05], fov: 36 }}
      onCreated={({ gl, scene, invalidate }) => {
        gl.setClearColor("#08090C", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;

        // Apply realistic studio softbox environment reflections
        const pmrem = new THREE.PMREMGenerator(gl);
        pmrem.compileEquirectangularShader();
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room, 0.04).texture;

        onReady?.();
        invalidate();
      }}
    >
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.6} />
      {/* Key Light: Crisp warm directional spotlight for gold highlights */}
      <directionalLight position={[4, 5, 4]} intensity={2.8} color="#FFFDF7" />
      {/* Fill Light: Cool slate fill from top-left */}
      <directionalLight position={[-4, 2, 1]} intensity={0.8} color="#94A3B8" />
      {/* Rim / Silhouette Light: Edge backlight */}
      <spotLight position={[0, 4, -3]} intensity={2.6} color="#22C55E" angle={0.8} />

      <Rig focus={focus} />
    </Canvas>
  );
}
